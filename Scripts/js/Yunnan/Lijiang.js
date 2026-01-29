function main(item) {
    var m3u8Url = "https://live3f.lijiang.cn/live/tvzh_720p.m3u8";

    return JSON.stringify({
        url: m3u8Url,
        headers: {
            "Referer": "https://www.lijiang.cn/",
            "User-Agent": "Mozilla/5.0"
        }
    });
}
