// 香港亚洲卫视 asiasatv
function main(item) {

    // API 地址
    var api = "https://live-liveapi.vzan.com/api/v1/siteinfo/get_flow_livedetail?liveId=2046370057&types=1001&source=sdk&vid=330913109&domain=www.asiasatv.com";

    // 请求头（与 PHP UA 保持一致）
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    };

    // 发送 GET 请求
    var res = ku9.get(api, JSON.stringify(headers));

    if (!res) {
        return JSON.stringify({
            error: "API 请求失败"
        });
    }

    // 解析 JSON
    var json;
    try {
        json = JSON.parse(res);
    } catch (e) {
        return JSON.stringify({
            error: "JSON 解析失败: " + e.toString()
        });
    }

    // 提取真实播放地址
    var play = json.dataObj && json.dataObj.playUrl;

    if (!play) {
        return JSON.stringify({
            error: "无法获取播放地址"
        });
    }

    // 返回给酷9播放器
    return JSON.stringify({
        url: play
    });
}
