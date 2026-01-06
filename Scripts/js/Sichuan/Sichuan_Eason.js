// 四川电视台 - 可播放版（使用四川官方 CDN 源）
// 用法：sc.js?id=1

function main(item) {

    var url = item.url;
    var id = ku9.getQuery(url, "id") || "1";

    // 四川台官方 CDN 源（混淆脚本真实地址）
    var api = "http://api.vonchange.com/utao/sctv?tag=" + id;

    // 请求头（混淆脚本里的 UA + Referer）
    var headers = {
        "Referer": "https://www.sctv.com/",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36"
    };

    // 获取真实 m3u8（这个 m3u8 的 ts 是绝对路径，可直接播放）
    var m3u8 = ku9.get(api, JSON.stringify(headers));

    return JSON.stringify({
        url: m3u8,
        headers: headers
    });
}
