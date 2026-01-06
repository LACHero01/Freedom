// 山西汾阳电视台 - 酷9JS 版本
// fy.js?id=1

function main(item) {

    // 1. 获取 id
    var url = item.url;
    var id = ku9.getQuery(url, "id") || "1";

    // 2. API 地址
    var api = "https://rmtzx.fysrmt.com/api/media/channelDetail?siteId=1&channelId=" + id;

    // 3. 请求头（与 PHP 一致）
    var headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
        "Accept": "application/json, text/plain, */*",
        "Origin": "https://rmtzx.fysrmt.com",
        "Referer": "https://rmtzx.fysrmt.com/",
        "Host": "rmtzx.fysrmt.com"
    };

    // 4. GET 请求
    var resp = ku9.get(api, JSON.stringify(headers));
    if (!resp) {
        return JSON.stringify({
            error: "获取数据失败",
            url: api
        });
    }

    // 5. 解析 JSON
    var data;
    try {
        data = JSON.parse(resp);
    } catch (e) {
        return JSON.stringify({
            error: "返回不是合法 JSON",
            body: resp.substr(0, 200)
        });
    }

    // 6. 第一种结构：data["channelLiveUrl"]
    if (data.channelLiveUrl) {
        return JSON.stringify({
            url: data.channelLiveUrl,
            headers: headers
        });
    }

    // 7. 第二种结构：data["data"]["channelLiveUrl"]
    if (data.data && data.data.channelLiveUrl) {
        return JSON.stringify({
            url: data.data.channelLiveUrl,
            headers: headers
        });
    }

    // 8. 都没有 → 报错
    return JSON.stringify({
        error: "未找到播放地址",
        response: data
    });
}
