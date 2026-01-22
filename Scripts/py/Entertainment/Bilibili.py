from base.parser import Parser
import requests
import json
import time


class Parser(Parser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.INIT_URL = "https://api.live.bilibili.com/room/v1/Room/room_init"
        self.PLAY_URL = "https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo"

        # 你 PHP 里的 COOKIE（可替换）
        self.COOKIE = {
            "LIVE_BUVID": "AUTO6016498536114225",
            "SESSDATA": "3abcdd4f,1722328666,76f94*21CjDi_HRAEz7xhkHGKSdJMGt3p27W4njJY1wxhY02lt6Hkg4MlX_of6nrLHtdsOXqoiwSVktRS3Y0blZLNWllUnUtUU8zV1lLZlhMTEJKQ3JkTjlBR1poYUNDOWxjYlpBLUVZWjJaaHRNejhPYUJYNWwxVWI3dWVacXF4STJJWGhfWGwyMlJjdnlBIIEC",
            "DedeUserID": "76533767",
            "DedeUserID__ckMd5": "16952989ea20eda4",
            "_uuid": "952FFA19-DB106-DF32-8A710-A5FBF10FB8D10381135infoc"
        }

        self.UA = (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )

    # -------------------- 主解析逻辑 --------------------

    def parse(self, params):
        try:
            rid = params.get("id", "")
            if not rid:
                return {"error": "缺少 id 参数"}

            # Step 1：room_init 获取真实房间号
            init_info = self._request(self.INIT_URL, {"id": rid})
            if not init_info or init_info.get("data", {}).get("live_status") != 1:
                return {"error": "直播未开播或房间不存在"}

            real_rid = init_info["data"]["room_id"]

            # Step 2：获取最高清晰度流
            stream_info = self._get_stream_info(real_rid, 10000)
            if not stream_info:
                return {"error": "无法获取直播流信息"}

            # 找最高清晰度
            max_qn = 0
            for s in stream_info:
                qn_list = s["format"][0]["codec"][0]["accept_qn"]
                max_qn = max(max_qn, max(qn_list))

            if max_qn != 10000:
                stream_info = self._get_stream_info(real_rid, max_qn)

            # Step 3：拼接所有 URL
            urls = []
            for s in stream_info:
                for fmt in s["format"]:
                    for codec in fmt["codec"]:
                        base = codec["base_url"]
                        for info in codec["url_info"]:
                            urls.append(info["host"] + base + info["extra"])

            # Step 4：测试可用 URL
            working = self._get_first_working(urls)
            if not working:
                return {"error": "没有可用的直播流 URL"}

            # 返回给酷9播放器
            return {
                "url": working,
                "headers": {
                    "User-Agent": self.UA,
                    "Referer": "https://live.bilibili.com/"
                }
            }

        except Exception as e:
            return {"error": f"解析异常: {str(e)}"}

    # -------------------- 工具函数 --------------------

    def _request(self, url, params):
        try:
            resp = requests.get(
                url,
                params=params,
                headers={"User-Agent": self.UA},
                cookies=self.COOKIE,
                timeout=10,
                verify=False
            )
            return resp.json()
        except:
            return None

    def _get_stream_info(self, rid, qn):
        params = {
            "room_id": rid,
            "protocol": "0,1",
            "format": "0,1,2",
            "codec": "0,1",
            "qn": qn,
            "platform": "h5",
            "ptype": 8
        }
        data = self._request(self.PLAY_URL, params)
        try:
            return data["data"]["playurl_info"]["playurl"]["stream"]
        except:
            return []

    def _get_first_working(self, urls):
        for u in urls:
            try:
                r = requests.head(
                    u,
                    headers={"User-Agent": self.UA},
                    cookies=self.COOKIE,
                    timeout=5,
                    verify=False
                )
                if r.status_code == 200:
                    return u
            except:
                continue
        return None

    def proxy(self, url, headers):
        return url, headers
