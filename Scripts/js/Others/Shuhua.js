function main(item) {

    // 目标网页
    var url = "http://web.shtv.net.cn/MobileWeb/OnlineLive.aspx";

    // 请求头（保持与 PHP 类似）
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    };

    // 获取网页内容
    var html = ku9.get(url, JSON.stringify(headers));

    if (!html) {
        return JSON.stringify({
            error: "无法获取网页内容"
        });
    }

    // 正则提取 m3u8 地址
    var pattern = /src="(http[^"]+\.m3u8[^"]*)"/i;
    var match = html.match(pattern);

    if (!match || !match[1]) {
        return JSON.stringify({
            error: "未找到 m3u8 地址"
        });
    }

    // 返回播放地址
    return JSON.stringify({
        url: match[1]
    });
}
