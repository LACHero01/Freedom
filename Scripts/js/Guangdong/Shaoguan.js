function main(item) {

    // 1. 固定网页地址（韶关新闻综合）
    var pageUrl = "https://www.sgmsw.cn/mobile/tvinfo?id=SB05RIYZOU8JR418AUQOF62CAJQ08D0E";

    // 2. 请求头（可选）
    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html"
    };

    // 3. 获取网页内容
    var html = ku9.get(pageUrl, JSON.stringify(headers));

    if (!html) {
        return JSON.stringify({
            error: "网页内容为空"
        });
    }

    // 4. 正则提取 m3u8 路径
    var match = html.match(/src:\s*"(\/videos\/tv\/[^"]+\.m3u8)"/);

    if (!match) {
        return JSON.stringify({
            error: "未找到 m3u8 地址",
            raw: html.slice(0, 200)
        });
    }

    // 5. 拼接完整播放地址
    var playUrl = "https://www.sgmsw.cn" + match[1];

    // 6. 返回给酷9播放器
    return JSON.stringify({
        url: playUrl,
        headers: JSON.stringify({
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://www.sgmsw.cn/"
        })
    });
}
