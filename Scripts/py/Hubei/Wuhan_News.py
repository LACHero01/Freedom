from base.parser import Parser
import requests
import base64
import json
from typing import Dict, Any


class Parser(Parser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # 固定接口地址
        self.api_url = "https://clientapi.hannews.com.cn/detail/stream/309413"

        # XXTEA 密钥（与 PHP 完全一致）
        self.xxtea_key = "5b28bae827e651b3"

        # UA（保持与 PHP 一致，避免 API 不返回字段）
        self.ua = "Mozilla/5.0 (Windows NT 6.1)"

    # ----------------- XXTEA 实现（与吉林脚本一致） ----------------- #

    def _int32(self, n: int) -> int:
        n = n & 0xffffffff
        if n >= 0x80000000:
            n = -((~n + 1) & 0xffffffff)
        return n

    def _str2long(self, s: bytes, w: bool):
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

    # ----------------- 主解析逻辑 ----------------- #

    def parse(self, params: Dict[str, str]) -> Dict[str, Any]:
        try:
            headers = {
                "Host": "clientapi.hannews.com.cn",
                "Origin": "https://m.hannews.com.cn",
                "User-Agent": self.ua
            }

            # 请求接口
            resp = requests.get(self.api_url, headers=headers, timeout=10, verify=False)
            if resp.status_code != 200:
                return {"error": f"接口请求失败: HTTP {resp.status_code}"}

            # base64 解码
            try:
                enc_bytes = base64.b64decode(resp.text)
            except Exception as e:
                return {"error": f"base64 解码失败: {str(e)}"}

            # XXTEA 解密
            decrypted = self.xxtea_decrypt(enc_bytes, self.xxtea_key)
            if not decrypted:
                return {"error": "XXTEA 解密失败"}

            # JSON 解析
            try:
                obj = json.loads(decrypted.decode("utf-8", errors="ignore"))
            except Exception as e:
                return {"error": f"JSON 解析失败: {str(e)}"}

            # 提取播放地址
            try:
                play_url = obj["data"]["data"]["playUrl"]
            except:
                return {"error": "未找到播放地址字段"}

            # 返回给酷9
            return {
                "url": play_url,
                "headers": {
                    "User-Agent": self.ua,
                    "Referer": "https://m.hannews.com.cn",
                    "Origin": "https://m.hannews.com.cn"
                }
            }

        except Exception as e:
            return {"error": f"解析异常: {str(e)}"}

    def proxy(self, url: str, headers: Dict[str, Any]):
        return url, headers
