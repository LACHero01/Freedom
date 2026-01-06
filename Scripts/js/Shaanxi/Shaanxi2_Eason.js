// 陕西头条（电视 + 广播）
// 用法：sx2.js?id=频道ID&type=tv 或 type=radio
// 默认 type=tv，默认 id=1131（混淆脚本默认值）

function main(item) {

    var url = item.url;

    // 频道 ID（默认 1131）
    var id = ku9.getQuery(url, "id") || "1131";

    // 类型：tv 或 radio
    var type = ku9.getQuery(url, "type") || "tv";

    // 两个 API
    var api_tv =
        "https://qidian.sxtvs.com/sxtoutiao/getLiveTvV11" +
        "?cnwestAppId=3&cnwestLbs=十堰市&deviceId=43b2bfb9-dffa-4c46-a75f-c754a057aba5" +
        "&deviceInfo=samsung-SM-G9750-12&version=5.2.2" +
        "&imeiId=f591ccd35e75394c292ea2fcf2b22af814508d0752b0f97d6fa77d1a7ec57b32&typeid=17";

    var api_radio =
        "https://qidian.sxtvs.com/sxtoutiao/getLiveRadioV11" +
        "?cnwestLbs=十堰市&typeid=18&deviceId=43b2bfb9-dffa-4c46-a75f-c754a057aba5" +
        "&version=5.2.2&deviceInfo=samsung-SM-G9750-12&cnwestAppId=3&imeiId=未初始化";

    var api = (type === "radio") ? api_radio : api_tv;

    // 请求 API
    var resp = ku9.get(api, null);
    if (!resp) {
        return JSON.stringify({ error: "从 URL 获取内容失败。" });
    }

    // 解析 JSON
    var json;
    try {
        json = JSON.parse(resp);
    } catch (e) {
        return JSON.stringify({ error: "解析JSON失败。" });
    }

    // code 必须是 101（混淆脚本判断）
    if (json.code !== 101) {
        return JSON.stringify({ error: "获取数据失败: " + json.msg });
    }

    // 电视：json.data
    // 广播：json.data.radio
    var list = (type === "radio") ? json.data.radio : json.data;

    // 遍历查找对应 id
    for (var item of list) {
        if (item.id == id) {
            var play = (type === "radio")
                ? item.radioUrlForandroid
                : item.onlineUrlForandroid;

            return JSON.stringify({ url: play });
        }
    }

    return JSON.stringify({ error: "未找到对应的流。" });
}
