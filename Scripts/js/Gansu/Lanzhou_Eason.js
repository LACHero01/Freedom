// 兰州电视台 - 修复版酷9JS脚本
// id 可选：lzxwzh / lzwl / lzzhgb / lzyygb / lzwygb

function main(item) {

    // 1. 获取 id
    var url = item.url;
    var id = ku9.getQuery(url, "id") || "lzxwzh";

    // 2. 频道映射表
    var map = {
        lzxwzh: ["xwzh", "tv"],     // 新闻综合
        lzwl:   ["wlpd", "tv"],     // 文旅
        lzzhgb: ["aac_zhgb", "gb"], // 新闻综合广播
        lzyygb: ["aac_jtyy", "gb"], // 音乐广播
        lzwygb: ["aac_shwy", "gb"]  // 文艺广播
    };

    if (!map[id]) {
        return JSON.stringify({
            error: "未知频道 id：" + id
        });
    }

    var code = map[id][0];
    var type = map[id][1];

    // 3. 构造 m3u8 地址
    var m3u8 = "http://liveplus.lzr.com.cn/" + code + "/HD/live.m3u8";

    // 4. 请求头（与 PHP 一致）
    var headers = {
        "Referer": "http://lanzhoubcnew.zainanjing365.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1)"
    };

    // ✅ 修复点：不再返回 m3u8 内容，而是返回 m3u8 地址
    return JSON.stringify({
        url: m3u8,
        headers: headers
    });
}
