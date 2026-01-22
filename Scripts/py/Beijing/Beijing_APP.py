from base.parser import Parser
import requests
import hashlib
import time
import json


class Parser(Parser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # 频道映射（与 PHP 一致）
        self.channel_map = {
            'bjws4k': '5481pu3mib99s696hvtkq65c25n',
            'bjws':   '573ib1kp5nk92irinpumbo9krlb',
            'bjwy':   '54db6gi5vfj8r8q1e6r89imd64s',
            'bjjs':   '53bn9rlalq08lmb8nf8iadoph0b',
            'bjys':   '50mqo8t4n4e8gtarqr3orj9l93v',
            'bjcj':   '50e335k9dq488lb7jo44olp71f5',
            'bjty':   '54hv0f3pq079d4oiil2k12dkvsc',
            'bjsh':   '50j015rjrei9vmp3h8upblr41jf',
            'bjxw':   '53gpt1ephlp86eor6ahtkg5b2hf',
            'bjkk':   '55skfjq618b9kcq9tfjr5qllb7r',
        }

        self.ua = "bjtime 100600"
        self.referer = "android-app.btime.com"

    # ---------------- 主解析逻辑 ---------------- #

    def parse(self, params):
        try:
            cid = params.get("id", "bjws4k")
            if cid not in self.channel_map:
                return {"error": f"无效频道 id: {cid}"}

            channel_id = self.channel_map[cid]

            # PHP: $time = time();
            t = int(time.time())

            # push_id = token = md5(time + channel_id)
            raw = f"{t}{channel_id}".encode("utf-8")
            token = hashlib.md5(raw).hexdigest()
            push_id = token

            # 构造 body（完全按 PHP 顺序）
            body = (
                f"browse_mode=1"
                f"&channel=ali"
                f"&id={channel_id}"
                f"&net=WIFI"
                f"&os=NOX666999"
                f"&os_type=Android"
                f"&os_ver=33"
                f"&push_id={push_id}"
                f"&timestamp={t}"
                f"&token={token}"
                f"&ver=100600"
            )

            # sign = substr(md5(body + "shi!@#$%^&*[xian!@#]*"), 3, 7)
            sign_src = (body + "shi!@#$%^&*[xian!@#]*").encode("utf-8")
            sign_full = hashlib.md5(sign_src).hexdigest()
            sign = sign_full[3:10]  # PHP substr(3,7)

            # 最终 URL
            api_url = f"https://app.api.btime.com/video/play?{body}&sign={sign}"

            headers = {
                "User-Agent": self.ua,
                "Referer": self.referer
            }

            resp = requests.get(api_url, headers=headers, timeout=10, verify=False)
            if resp.status_code != 200:
                return {"error": f"接口请求失败: HTTP {resp.status_code}"}

            try:
                obj = resp.json()
            except:
                return {"error": "返回数据不是 JSON"}

            # PHP: json_decode($data)->data->video_stream[0]->stream_url
            try:
                play_url = obj["data"]["video_stream"][0]["stream_url"]
            except:
                return {"error": "未找到播放地址"}

            # 酷9返回格式
            return {
                "url": play_url,
                "headers": {
                    "User-Agent": self.ua,
                    "Referer": self.referer
                }
            }

        except Exception as e:
            return {"error": f"解析异常: {str(e)}"}

    def proxy(self, url, headers):
        return url, headers
