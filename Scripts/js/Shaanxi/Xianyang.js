function main(item) {
    var id = ku9.getQuery(item.url, "id") || "xyzh";

    // 1. 频道网页
    var pageUrl = "https://www.sxxynews.com.cn/tvradio/" + id + "pd.html";

    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.sxxynews.com.cn/"
    };

    // 2. 获取网页内容
    var html = ku9.get(pageUrl, JSON.stringify(headers));

    if (!html) {
        return JSON.stringify({ error: "网页内容为空" });
    }

    // 3. 提取 videoUrl
    var match = html.match(/videoUrl\s*=\s*['"]([^'"]+)['"]/);

    if (!match) {
        return JSON.stringify({ error: "未找到 videoUrl" });
    }

    var m3u8 = match[1];

    // 4. 返回原始 m3u8（不代理、不重写）
    return JSON.stringify({
        url: m3u8,
        headers: JSON.stringify({
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://www.sxxynews.com.cn/"
        })
    });
}
