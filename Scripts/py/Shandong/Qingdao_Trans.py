from base.parser import Parser
import requests
from typing import Dict, Any


class Parser(Parser):
    def parse(self, params: Dict[str, str]) -> Dict[str, Any]:
        try:
            # 你的 PHP 地址（你自己改）
            php_api = "https://freeone.alonso729.dpdns.org/myphp/Shandong_Qingdao.php"

            # 直接把酷9传入的所有参数（包括 id）原样转发给 PHP
            resp = requests.get(php_api, params=params, timeout=10, verify=False)

            # 如果 PHP 返回的是 302 跳转（Location: m3u8）
            final_url = resp.url

            # 如果 PHP 返回的是 m3u8 内容（非跳转）
            if final_url == php_api:
                return {
                    "m3u8": resp.text,
                    "headers": {
                        "User-Agent": "Mozilla/5.0",
                    }
                }

            # 如果 PHP 返回的是跳转后的真实 URL
            return {
                "url": final_url,
                "headers": {
                    "User-Agent": "Mozilla/5.0",
                }
            }

        except Exception as e:
            return {"error": f"转发异常: {str(e)}"}

    def proxy(self, url, headers):
        return url, headers
