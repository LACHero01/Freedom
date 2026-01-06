// 西安电视台 - 明文酷9JS版本
// 用法：xian.js?id=频道名

function main(item) {

    // 1. 获取频道 id
    var url = item.url;
    var id = ku9.getQuery(url, "id");

    // 2. 拼接 m3u8 播放地址
    var playUrl = "https://stream.xiancity.cn/live/" + id + "/index.m3u8";

    // 3. 请求头
    var headers = {
        "Origin": "https://v.xiancity.cn/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://v.xiancity.cn/"
    };

    // 4. 返回结果
    return JSON.stringify({
        url: playUrl,
        headers: headers
    });
}
