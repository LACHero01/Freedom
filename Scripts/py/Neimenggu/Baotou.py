from base.parser import Parser
import requests
import re
from typing import Dict, Any


class Parser(Parser):

    def parse(self, params: Dict[str, str]) -> Dict[str, Any]:
        try:
            rid = params.get("id", "").strip()
            if not rid:
                return {"error": "缺少 id 参数"}

            page_url = f"https://iapp.baotounews.com.cn/share/{rid}.html"

            headers = {
                "User-Agent": (
                    "Mozilla/5.0 (Linux; Android 12; SM-G9980 Build/SP1A.210812.016) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                ),
                "Referer": "https://iapp.baotounews.com.cn/"
            }

            resp = requests.get(page_url, headers=headers, timeout=10, verify=False)
            html = resp.text

            # 尝试多种正则匹配
            patterns = [
                r'source src="([^"]+)"',
                r'source data-src="([^"]+)"',
                r'video src="([^"]+)"',
                r'"(https?://[^"]+\.m3u8)"',
                r'"(https?://[^"]+\.flv)"'
            ]

            real_url = None
            for p in patterns:
                m = re.search(p, html)
                if m:
                    real_url = m.group(1)
                    break

            if not real_url:
                return {"error": "未找到播放地址（网页结构可能已更新）"}

            return {
                "url": real_url,
                "headers": {
                    "User-Agent": headers["User-Agent"],
                    "Referer": "https://iapp.baotounews.com.cn/"
                }
            }

        except Exception as e:
            return {"error": f"解析异常: {str(e)}"}

    def proxy(self, url, headers):
        return url, headers
