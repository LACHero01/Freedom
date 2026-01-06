// 郑州电视台（简单版）
// zz.js?id=zzxwzh

function main(item) {

    var url = item.url;
    var id = ku9.getQuery(url, "id") || "zzxwzh";

    var map = {
        zzxwzh: 103,
        zzsd: 104,
        zzwtly: 105,
        zzyj: 106,
        zzfnet: 107,
        zzdssh: 108
    };

    if (!map[id]) {
        return JSON.stringify({
            error: "未知频道 id：" + id
        });
    }

    var api = "http://mapi-new.zztv.tv/api/v1/channel.php?channel_id=" + map[id];

    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
    };

    var resp = ku9.get(api, JSON.stringify(headers));
    if (!resp) {
        return JSON.stringify({
            error: "接口返回空内容",
            url: api
        });
    }

    var json;
    try {
        json = JSON.parse(resp);
    } catch (e) {
        return JSON.stringify({
            error: "返回不是合法 JSON",
            body: resp.substr(0, 200)
        });
    }

    var playUrl = json[0] && json[0].m3u8;
    if (!playUrl) {
        return JSON.stringify({
            error: "未找到 m3u8",
            response: json
        });
    }

    return JSON.stringify({
        url: playUrl,
        headers: headers
    });
}
