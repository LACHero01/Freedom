function main(item) {

    // 1. API 地址（固定）
    var api = "https://app.xyxrmt.com/apiv4.2/api/m3u8_notoken?channelid=2MAgsgb";

    // 2. 请求头（可选）
    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
    };

    // 3. 发送 GET 请求
    var res = ku9.get(api, JSON.stringify(headers));

    if (!res) {
        return JSON.stringify({
            error: "接口返回空内容"
        });
    }

    // 4. 解析 JSON
    var data;
    try {
        data = JSON.parse(res);
    } catch (e) {
        return JSON.stringify({
            error: "返回非 JSON",
            raw: res.slice(0, 200)
        });
    }

    // 5. 取出 m3u8 地址
    if (!data.data || !data.data.address) {
        return JSON.stringify({
            error: "未找到播放地址",
            raw: res.slice(0, 200)
        });
    }

    var playUrl = data.data.address;

    // 6. 返回给酷9播放器
    return JSON.stringify({
        url: playUrl,
        headers: JSON.stringify({
            "User-Agent": "Mozilla/5.0"
        })
    });
}
