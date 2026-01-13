function main(item) {

    // 1. 获取频道 ID（默认 109152）
    var id = ku9.getQuery(item.url, "id");
    if (!id) id = "109152";

    // 2. 读取远程 JS 文件
    var jsUrl = "http://www.nbs.cn/js/channel.js";
    var jsCode = ku9.get(jsUrl, JSON.stringify({
        "User-Agent": "Mozilla/5.0"
    }));

    if (!jsCode || jsCode.length < 10) {
        return JSON.stringify({ error: "无法获取远程JS文件" });
    }

    // 3. 构造正则表达式（与 PHP 完全一致）
    var pattern = new RegExp("case\\s+'" + id + "'\\s*:\\s*(?:\\/\\/[^\\n]*)?\\s*videosrc\\s*=\\s*'([^']+)'");

    var match = jsCode.match(pattern);

    if (!match) {
        return JSON.stringify({ error: "未找到对应频道地址" });
    }

    var url = match[1];

    // 4. 如果是以 // 开头，补上 http:
    if (url.indexOf("//") === 0) {
        url = "http:" + url;
    }

    // 5. 返回酷9播放器可识别的 JSON
    return JSON.stringify({
        url: url,
        headers: JSON.stringify({
            "User-Agent": "Mozilla/5.0"
        })
    });
}
