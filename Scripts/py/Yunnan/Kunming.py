from base.parser import Parser
import requests, hashlib, time, json

class Parser(Parser):
    def parse(self, params):
        vid = params.get("id")

        mapping = {
            "kmxwzh": 1,
            "kmccms": 5,
            "kmjjsh": 2
        }

        if vid not in mapping:
            return {"error": "无效频道ID"}

        t = int(time.time())
        n = hashlib.md5(str(t).encode()).hexdigest()[:20]

        appid = "0d9dceb318565bdc"
        key   = "aede663c0d9dceb318565bdca6451456"
        e = hashlib.md5((appid + key + str(t) + n).encode()).hexdigest()

        url = "https://zsccv9-cache.kmzscc.com/page/get_page?obj_id=5004&open_type=1"

        headers = {
            "appid": appid,
            "timestamp": str(t),
            "noncestr": n,
            "version": "8.2.0",
            "encrypt": e,
            "User-Agent": "Mozilla/5.0"
        }

        resp = requests.get(url, headers=headers, verify=False).json()

        for item in resp["data"]["recommend_list"][1]["item_list"]:
            if item["item_id"] == mapping[vid]:
                return {"url": item["resource"][0]["url"]}

        return {"error": "未找到频道流"}

    def proxy(self, url, headers):
        return url, headers
