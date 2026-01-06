// 石家庄电视台 - 酷9JS 版本
// sjz.js?id=4

function main(item) {

    // 1. 获取 id
    var url = item.url;
    var id = ku9.getQuery(url, "id") || "4";

    // 2. API 地址
    var api = "http://mapi.sjzntv.cn/api/v1/channel.php?node_id=1";

    // 3. 请求头（可选）
    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
    };

    // 4. 获取频道列表
    var resp = ku9.get(api, JSON.stringify(headers));
    if (!resp) {
        return JSON.stringify({
            error: "接口返回空内容",
            url: api
        });
    }

    // 5. 解析 JSON
    var list;
    try {
        list = JSON.parse(resp);
    } catch (e) {
        return JSON.stringify({
            error: "返回不是合法 JSON",
            body: resp.substr(0, 200)
        });
    }

    // 6. 遍历查找对应 id 的 m3u8
    var playUrl = null;
    for (var i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(id)) {
            playUrl = list[i].m3u8;
            break;
        }
    }

    if (!playUrl) {
        return JSON.stringify({
            error: "未找到对应频道 id：" + id,
            response: list
        });
    }

    // 7. 返回播放地址
    return JSON.stringify({
        url: playUrl,
        headers: headers
    });
}
