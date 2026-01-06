// 铜川电视台 - 明文酷9JS版本
// 用法示例：tongchuan.js?id=1、tongchuan.js?id=2 等
// 实际有哪些 id，可以自己在浏览器试访问对应栏目页：
// https://www.tcsrm.cn/tvradio/1.html

function main(item) {

    // 1. 获取传入的 URL 和频道 id
    var url = item.url;
    var id = ku9.getQuery(url, "id") || 1;  // 默认 id=1

    // 2. 构造栏目页面地址
    var pageUrl = "https://www.tcsrm.cn/tvradio/" + id + ".html";
    var refererUrl = "https://www.tcsrm.cn/tvradio/" + id + ".html?isShare=true";

    // 3. 请求头
    var headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": refererUrl
    };

    // 4. 拉取页面 HTML，并去掉反斜杠
    var html = ku9.get(pageUrl, JSON.stringify(headers));
    if (!html) {
        return JSON.stringify({
            error: "获取页面失败",
            url: pageUrl
        });
    }
    html = html.replace(/\\/g, "");

    // 5. 正则提取 videoUrl = '...'
    var re = /videoUrl\s*=\s*'(.*?)'/;
    var m = html.match(re);
    if (!m || !m[1]) {
        return JSON.stringify({
            error: "未找到视频地址",
            url: pageUrl,
            bodySample: html.substr(0, 200)
        });
    }

    var playUrl = m[1];

    // 6. 返回播放地址和请求头
    return JSON.stringify({
        url: playUrl,
        headers: headers
    });
}
