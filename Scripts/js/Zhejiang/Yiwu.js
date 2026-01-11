function main(item) {
    var id = ku9.getQuery(item.url, "id") || "ywxwzh";

    var map = {
        "ywxwzh": ["a6edb25e0b944b449f26c881e8c68b85", "www.media.xinhuamm.net", "b496650d5db94435a690db7326131dc9"],
        "ywsmpd": ["dbc6a686692249379d912943bcec99f1", "www.media.xinhuamm.net", "b496650d5db94435a690db7326131dc9"],
        "ywwtpd": ["6219f5d02db840e7b2f7ccda32bc99d3", "www.media.xinhuamm.net", "b496650d5db94435a690db7326131dc9"]
    };

    if (!map[id]) {
        return JSON.stringify({ error: "频道不存在" });
    }

    var channelId = map[id][0];
    var domain = map[id][1];
    var siteId = map[id][2];

    var api = "https://" + domain + "/rftapi/api/rft/getLiveChannelInfo";

    // 必须使用表单格式
    var form = 
        "platform=h5" +
        "&channelId=" + channelId +
        "&siteId=" + siteId +
        "&runType=test";

    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://" + domain + "/html/rft/live.html?channelId=" + channelId + "&type=1&siteId=" + siteId,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    var res = ku9.request(api, "POST", headers, form, true);

    if (!res || !res.body) {
        return JSON.stringify({ error: "接口返回空内容" });
    }

    var data;
    try {
        data = JSON.parse(res.body);
    } catch (e) {
        return JSON.stringify({ error: "返回非 JSON", raw: res.body.slice(0, 200) });
    }

    if (!data.url) {
        return JSON.stringify({ error: "未找到播放地址", raw: res.body.slice(0, 200) });
    }

    return JSON.stringify({
        url: data.url,
        headers: JSON.stringify({
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://" + domain + "/"
        })
    });
}
