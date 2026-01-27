function main(item) {
    var url = item.url || "";
    var id = ku9.getQuery(url, "id");

    // 必须有 id
    if (!id) {
        return JSON.stringify({ error: "缺少 id 参数" });
    }

    // m3u8 地址
    var m3u8Url =
        "https://m3u8-channel.lytv.tv/nmip-media/channellive/" +
        encodeURIComponent(id) +
        "/playlist.m3u8";

    // 返回给酷9播放器
    return JSON.stringify({
        url: m3u8Url,
        headers: {
            "Referer": "https://www.ilinyi.net/",
            "User-Agent": "Mozilla/5.0"
        }
    });
}
