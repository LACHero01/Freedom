function main(item) {
    var url = item.url || "";
    var id = ku9.getQuery(url, "id");

    if (!id) {
        return JSON.stringify({ error: "缺少 id 参数" });
    }

    var m3u8Url =
        "http://szyplaytv.snxw.com/live/" +
        encodeURIComponent(id) +
        "/playlist.m3u8";

    return JSON.stringify({
        url: m3u8Url,
        headers: {
            "Referer": "https://www.snxw.com/",
            "User-Agent": "Mozilla/5.0"
        }
    });
}
