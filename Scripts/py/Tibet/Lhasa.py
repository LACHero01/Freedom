from base.parser import Parser
import requests
import json
from typing import Dict, Any

class Parser(Parser):
    def parse(self, params: Dict[str, str]) -> Dict[str, Any]:
        try:
            cid = params.get("id", "").strip()
            if not cid:
                return {"error": "缺少 id 参数"}

            api_url = "https://www.lasatv.cn/cms/home/content?id=" + cid
            resp = requests.get(api_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10, verify=False)

            if resp.status_code != 200:
                return {"error": f"接口请求失败: HTTP {resp.status_code}"}

            data = resp.json()
            m3u8_url = data["exdata"]["lives"][0]["m3u8_url"]

            return {
                "url": m3u8_url,
                "headers": {
                    "Referer": "https://www.lasatv.cn/",
                    "User-Agent": "Mozilla/5.0"
                }
            }

        except Exception as e:
            return {"error": f"解析异常: {str(e)}"}

    def proxy(self, url, headers):
        return url, headers
