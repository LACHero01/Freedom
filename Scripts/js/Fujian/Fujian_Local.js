function main(item) {

    // 1. 获取频道 ID（默认南平综合）
    var id = ku9.getQuery(item.url, "id");
    if (!id) id = "727216450918322176";

    // 2. 构造 API 地址
    var api = "https://mapi-plus.fjtv.net/cloudlive-manage-mapi/api/topic/detail?preview=&id="
              + id + "&tenant_id=0&company_id=468&lang_type=zh";

    // 3. 请求 API
    var res = ku9.get(api, JSON.stringify({
        "User-Agent": "Mozilla/5.0"
    }));

    if (!res || res.length < 10) {
        return JSON.stringify({ error: "无法获取福建广电API数据" });
    }

    // 4. 解析 JSON
    var data = {};
    try {
        data = JSON.parse(res);
    } catch (e) {
        return JSON.stringify({ error: "JSON解析失败" });
    }

    // 5. 取 hls 地址（与 PHP 完全一致）
    try {
        var hls = data.topic_camera[0].streams[0].hls;
        if (!hls) throw "empty";
    } catch (e) {
        return JSON.stringify({ error: "未找到HLS播放地址" });
    }

    // 6. 返回酷9播放器可识别的 JSON
    return JSON.stringify({
        url: hls,
        headers: JSON.stringify({
            "User-Agent": "Mozilla/5.0"
        })
    });
}
