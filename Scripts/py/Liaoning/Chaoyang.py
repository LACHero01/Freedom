from base.parser import Parser
import requests
import time
import json
from typing import Dict, Any


class Parser(Parser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # AES key & iv（与 PHP 完全一致）
        self.key = b"BkOcnMPiGKh9WkmPftgZBMVM2gWw33v0"
        self.iv = b"fReE9dQL0PPuEaey"

        # API 地址
        self.api_url = "https://cyrm.app.cygbdst.com:1443/api/gettvlivebyid"

        # UA（使用酷9兼容 UA）
        self.ua = (
            "Mozilla/5.0 (Linux; Android 12; SM-A5560 Build/V417IR; wv) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 "
            "Chrome/101.0.4951.61 Mobile Safari/537.36"
        )

    # ---------------- AES-256-CBC ZERO_PADDING（纯 Python 实现） ---------------- #

    def _aes_encrypt_zero_padding(self, data: bytes, key: bytes, iv: bytes) -> str:
        """
        纯 Python AES-256-CBC ZERO_PADDING 加密
        （酷9 无法安装第三方库，因此必须手写）
        """
        from Crypto.Cipher import AES  # 酷9 内置 pycryptodome，可直接使用

        # ZERO_PADDING：补 0 到 16 字节倍数
        pad_len = 16 - (len(data) % 16)
        data += b"\x00" * pad_len

        cipher = AES.new(key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(data)

        # PHP openssl_encrypt 默认 base64 输出
        import base64
        return base64.b64encode(encrypted).decode("utf-8")

    # ---------------- 主解析逻辑 ---------------- #

    def parse(self, params: Dict[str, str]) -> Dict[str, Any]:
        try:
            raw_id = params.get("id", "").strip()
            if not raw_id:
                return {"error": "缺少 id 参数"}

            # Step 1：生成 timestamp（毫秒）
            timestamp = int(time.time() * 1000)

            # Step 2：AES 加密 timestamp（字符串形式）
            ts_bytes = str(timestamp).encode("utf-8")
            enc = self._aes_encrypt_zero_padding(ts_bytes, self.key, self.iv)

            # Step 3：构造 authorization JSON（与 PHP 完全一致）
            auth_json = json.dumps({
                "timestamp": timestamp,
                "encryption": enc
            }, separators=(",", ":"))

            # Step 4：POST 请求
            headers = {
                "authorization": auth_json,
                "User-Agent": self.ua,
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://cyrm.app.cygbdst.com/"
            }

            payload = f"tvliveid={raw_id}"

            resp = requests.post(
                self.api_url,
                headers=headers,
                data=payload,
                timeout=10,
                verify=False
            )

            if resp.status_code != 200:
                return {"error": f"接口请求失败: HTTP {resp.status_code}"}

            # Step 5：解析 JSON
            try:
                obj = resp.json()
            except:
                return {"error": "JSON 解析失败"}

            try:
                play_url = obj["data"]["path"]
            except:
                return {"error": "未找到播放地址字段"}

            # Step 6：返回给酷9
            return {
                "url": play_url,
                "headers": {
                    "User-Agent": self.ua,
                    "Referer": "https://cyrm.app.cygbdst.com/",
                    "Origin": "https://cyrm.app.cygbdst.com"
                }
            }

        except Exception as e:
            return {"error": f"解析异常: {str(e)}"}

    # ---------------- proxy（不需要二次代理） ---------------- #

    def proxy(self, url: str, headers: Dict[str, Any]):
        return url, headers
