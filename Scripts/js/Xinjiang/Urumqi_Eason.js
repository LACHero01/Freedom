// 乌鲁木齐电视台 - 酷9JS 版本
// wlmq.js?id=17  汉语综合频道
// wlmq.js?id=21  维吾尔语综合频道

function main(item) {

    // 1. 获取 id
    var url = item.url;
    var id = ku9.getQuery(url, "id") || "17";

    // 2. 构造 API 地址
    var api = "https://hsynew.hongshannet.cn/tvradio/Tvfront/getTvInfo?tv_id=" + id;

    // 3. 请求头（可选）
    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
    };

    // 4. 发送 GET 请求
    var resp = ku9.get(api, JSON.stringify(headers));
    if (!resp) {
        return JSON.stringify({
            error: "接口返回空内容",
            url: api
        });
    }

    // 5. 解析 JSON
    var json;
    try {
        json = JSON.parse(resp);
    } catch (e) {
        return JSON.stringify({
            error: "返回不是合法 JSON",
            body: resp.substr(0, 200)
        });
    }

    // 6. 获取 m3u8 地址
    if (!json.data || !json.data.m3u8) {
        return JSON.stringify({
            error: "未找到 m3u8 地址",
            response: json
        });
    }

    var playUrl = json.data.m3u8;

    // 7. 返回播放地址
    return JSON.stringify({
        url: playUrl,
        headers: headers
    });
}
