from base.parser import Parser
import requests
import json
import base64
from typing import Dict, Any


class Parser(Parser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # 频道别名映射（对应第一份 PHP）
        self.channel_alias_map = {
            'jlws': 1531,  # 吉林卫视
            'jlds': 1532,  # 都市频道
            'jlsh': 1534,  # 生活频道
            'jlys': 1535,  # 影视频道
            'jlxc': 1536,  # 乡村频道
            'jlgg': 1537,  # 公共·新闻频道
            'jlzy': 1538,  # 综艺文化频道
            'dbxq': 1539,  # 东北戏曲频道
        }

        # XXTEA 密钥（两份 PHP 一样）
        self.xxtea_key = "5b28bae827e651b3"

        # 接口地址 & UA / Referer
        self.api_url = "https://clientapi.jlntv.cn/broadcast/list?page=1&size=10000&type=1"
        self.ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        self.referer = "https://www.jlntv.cn/"

    # ----------------- XXTEA 实现（按 PHP 逻辑翻译） -----------------

    def _int32(self, n: int) -> int:
        n = n & 0xffffffff
        if n >= 0x80000000:
            n = -((~n + 1) & 0xffffffff)
        return n

    def _str2long(self, s: bytes, w: bool):
        # PHP: unpack("V*", $s . padding)
        # 小端 32bit
        length = len(s)
        pad_len = (4 - (length % 4)) & 3
        s = s + b"\0" * pad_len
        v = []
        for i in range(0, len(s), 4):
            v.append(int.from_bytes(s[i:i+4], "little"))
        if w:
            v.append(length)
        return v

    def _long2str(self, v, w: bool) -> bytes:
        # PHP: pack("V", $v[$i]) 拼接
        length = len(v)
        n = (length - 1) << 2
        if w:
            m = v[-1]
            if m < n - 3 or m > n:
                return b""
            n = m
        out = b""
        for x in v:
            out += int(x & 0xffffffff).to_bytes(4, "little")
        return out[:n] if w else out

    def xxtea_decrypt(self, data: bytes, key: str) -> bytes:
        if not data:
            return b""
        v = self._str2long(data, False)
        k = self._str2long(key.encode("utf-8"), False)
        if len(k) < 4:
            k = k + [0] * (4 - len(k))
        n = len(v) - 1
        z = v[n]
        y = v[0]
        delta = 0x9E3779B9
        q = int(6 + 52 / (n + 1))
        summ = self._int32(q * delta)
        while summ != 0:
            e = (summ >> 2) & 3
            for p in range(n, 0, -1):
                z = v[p - 1]
                mx = self._int32(
                    (((z >> 5) & 0x07ffffff) ^ (y << 2)) +
                    (((y >> 3) & 0x1fffffff) ^ (z << 4))
                ) ^ self._int32(
                    (summ ^ y) + (k[(p & 3) ^ e] ^ z)
                )
                y = v[p] = self._int32(v[p] - mx)
            z = v[n]
            mx = self._int32(
                (((z >> 5) & 0x07ffffff) ^ (y << 2)) +
                (((y >> 3) & 0x1fffffff) ^ (z << 4))
            ) ^ self._int32(
                (summ ^ y) + (k[(0 & 3) ^ e] ^ z)
            )
            y = v[0] = self._int32(v[0] - mx)
            summ = self._int32(summ - delta)
        return self._long2str(v, True)

    # ----------------- 主解析逻辑 -----------------

    def parse(self, params: Dict[str, str]) -> Dict[str, Any]:
        """
        支持两种调用方式：
        1）id = jlws / jlds / jlsh ...（别名）
        2）id = 1531 / 1532 / 812244 ...（直接数值 ID）
        """
        try:
            raw_id = params.get("id", "").strip()
            if not raw_id:
                return {"error": "缺少 id 参数"}

            # 先看是不是别名
            if raw_id in self.channel_alias_map:
                target_id = self.channel_alias_map[raw_id]
            else:
                # 尝试当作数字 ID
                try:
                    target_id = int(raw_id)
                except:
                    return {"error": f"无效的频道 id: {raw_id}"}

            # 请求接口
            headers = {
                "User-Agent": self.ua,
                "Referer": self.referer,
                "Client-Type": "web",
                "Connection": "keep-alive",
                "DNT": "1",
                "Host": "clientapi.jlntv.cn",
                "Origin": "https://www.jlntv.cn"
            }

            resp = requests.get(self.api_url, headers=headers, timeout=10, verify=False)
            if resp.status_code != 200:
                return {"error": f"接口请求失败: HTTP {resp.status_code}"}

            # PHP: $response = str_replace('"','',$response);
            # 这里要小心：PHP 是把所有双引号去掉，再 base64_decode
            # 说明接口返回的是一个“被加引号包裹的 base64 字符串”
            text = resp.text.replace('"', '')

            # base64 解码 + XXTEA 解密
            try:
                enc_bytes = base64.b64decode(text)
            except Exception as e:
                return {"error": f"base64 解码失败: {str(e)}"}

            decrypted = self.xxtea_decrypt(enc_bytes, self.xxtea_key)
            if not decrypted:
                return {"error": "XXTEA 解密失败"}

            try:
                obj = json.loads(decrypted.decode("utf-8", errors="ignore"))
            except Exception as e:
                return {"error": f"JSON 解析失败: {str(e)}"}

            data_list = obj.get("data") or []

            # 遍历查找匹配 id
            m3u8_url = None
            for item in data_list:
                if not isinstance(item, dict):
                    continue
                if item.get("id") == target_id:
                    # 第一份 / 第二份 PHP 都是取 item['data']['streamUrl']
                    data_field = item.get("data") or {}
                    m3u8_url = data_field.get("streamUrl")
                    break

            if not m3u8_url:
                return {"error": f"未找到 id={target_id} 对应的频道流地址"}

            # 在 PHP 里是 header("Location: $m3u8")
            # 在酷9里就直接返回 url + headers
            return {
                "url": m3u8_url,
                "headers": {
                    "User-Agent": self.ua,
                    "Referer": self.referer,
                    "Origin": "https://www.jlntv.cn"
                }
            }

        except Exception as e:
            return {"error": f"解析异常: {str(e)}"}

    def proxy(self, url: str, headers: Dict[str, Any]):
        # 吉林这套不需要二次代理，直接把 URL + headers 交给酷9就行
        return url, headers
