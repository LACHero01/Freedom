function main(item) {
    // 1. 获取频道 ID（默认 2：新闻综合）
    var id = ku9.getQuery(item.url, "id") || "2";

    // 2. 第一步：获取 stream 地址
    var api1 = "https://api-cms.fcgtvb.com/v1/mobile/channel/play?channel_id=" + id;

    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
    };

    var res1 = ku9.get(api1, JSON.stringify(headers));

    if (!res1) {
        return JSON.stringify({
            error: "接口返回空内容（play）"
        });
    }

    var data1;
    try {
        data1 = JSON.parse(res1);
    } catch (e) {
        return JSON.stringify({
            error: "接口返回非 JSON（play）",
            raw: res1.slice(0, 200)
        });
    }

    if (!data1.data || !data1.data.channel || !data1.data.channel.stream) {
        return JSON.stringify({
            error: "未找到 stream 地址",
            raw: res1.slice(0, 200)
        });
    }

    var stream = data1.data.channel.stream;

    // 3. 第二步：获取 auth_key
    var api2 = "https://api-cms.fcgtvb.com/v1/mobile/channel/play_auth?stream=" + encodeURIComponent(stream);

    var res2 = ku9.get(api2, JSON.stringify(headers));

    if (!res2) {
        return JSON.stringify({
            error: "接口返回空内容（play_auth）"
        });
    }

    var data2;
    try {
        data2 = JSON.parse(res2);
    } catch (e) {
        return JSON.stringify({
            error: "接口返回非 JSON（play_auth）",
            raw: res2.slice(0, 200)
        });
    }

    if (!data2.data || !data2.data.auth_key) {
        return JSON.stringify({
            error: "未找到 auth_key",
            raw: res2.slice(0, 200)
        });
    }

    var authKey = data2.data.auth_key;

    // 4. 拼接最终播放地址
    var finalUrl = stream + (stream.indexOf("?") !== -1 ? "&" : "?") + "auth_key=" + authKey;

    // 5. 返回给酷9播放器
    return JSON.stringify({
        url: finalUrl,
        headers: JSON.stringify({
            "User-Agent": "Mozilla/5.0"
        })
    });
}
