// 洛阳广播电视台 - 酷9JS版（解混淆整理）
// 说明：通过 API 获取直播地址 live_address

function main(item) {
    // 1. 从 URL 里取 id 参数，默认 1
    var url = item.url;
    var id = ku9.getQuery(url, "id") || 1;

    // 2. 构造 API 地址
    var apiUrl = "https://www.lytv.com.cn/api/broadcast/index?broadcast_id=" + id;

    // 3. 请求头（User-Agent 可以按需调整）
    var headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/119.0 Safari/537.36",
        "Referer": "https://www.lytv.com.cn/"
    };

    // 4. 发送请求
    var resp = ku9.get(apiUrl, JSON.stringify(headers));
    if (!resp) {
        return JSON.stringify({
            error: "Empty response from server",
            url: apiUrl
        });
    }

    // 5. 去掉转义反斜杠
    resp = resp.replace(/\\/g, "");

    // 6. 正则匹配 "live_address":"xxxx"
    var re = /"live_address":"(.*?)"/;
    var m = resp.match(re);
    if (!m || !m[1]) {
        return JSON.stringify({
            error: "Cannot find live_address in response",
            url: apiUrl,
            bodySample: resp.substr(0, 200)
        });
    }

    var playUrl = m[1];

    // 7. 返回播放地址 + 播放头
    return JSON.stringify({
        url: playUrl,
        headers: headers
    });
}
