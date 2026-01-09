// 1905电影网 Ku9JS 明文脚本
// 用法示例：
//   ?id=1905b   // 1905 国外电影
//   ?id=1905    // 1905 国内电影（与 cctv6 同流）
//   ?id=cctv6   // CCTV6 电影频道

function main(item) {
    // 1. 频道映射（保持与 PHP 一致）
    var id = ku9.getQuery(item.url, "id") || "1905b";

    var map = {
        "cctv6": "LIVEOYY31H24H48NE",        // CCTV6 电影频道
        "1905b": "LIVE8J4LTCXPI7QJ5_258",    // 1905 国外电影
        "1905": "LIVEOYY31H24H48NE"          // 1905 国内电影（同 cctv6）
    };

    if (!map[id]) {
        return JSON.stringify({
            error: "无效的频道 id",
            requested: id,
            available: Object.keys(map)
        });
    }

    var StreamName = map[id];

    // 2. 固定 salt（与 PHP 一致）
    var salt = "689d471d9240010534b531f8409c9ac31e0e6521";
    var apiUrl = "https://profile.m1905.com/mvod/liveinfo.php";

    // 3. 时间与 playid（与 PHP 行为一致）
    var ts = Math.floor(Date.now() / 1000);             // time()
    var tsStr = String(ts);
    var playid = tsStr.slice(-4) + "12312345678";       // substr($ts,-4).'12312345678'

    // 4. 请求参数（顺序非常重要，供签名使用）
    var params = {
        cid: 999999,
        expiretime: 2000000600,
        nonce: 2000000000,
        page: "https://www.1905.com",
        playerid: playid,
        streamname: StreamName,
        uuid: 1
        // appid 在签名之后再追加
    };

    // 5. 实现 http_build_query 的等价逻辑（保持键顺序）
    function buildQuery(p) {
        var keys = ["cid", "expiretime", "nonce", "page", "playerid", "streamname", "uuid"];
        var arr = [];
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var v = p[k];
            // PHP http_build_query 默认 urlencode，encodeURIComponent 足够接近
            arr.push(k + "=" + encodeURIComponent(v));
        }
        return arr.join("&");
    }

    var queryStr = buildQuery(params);

    // 6. 生成签名：sha1(http_build_query(params) . "." . salt)
    var signBase = queryStr + "." + salt;
    var sign = ku9.sha1(signBase);

    // 7. 追加 appid（注意：appid 不参与上面的签名）
    params.appid = "W0hUwz8D";

    // 8. 请求头（转为对象形式）
    var headers = {
        "Authorization": sign,
        "Content-Type": "application/json",
        "Origin": "https://www.1905.com",
        "User-Agent": "Mozilla/5.0"
    };

    // 9. 发送 POST 请求
    var resText = ku9.post(apiUrl, JSON.stringify(headers), JSON.stringify(params));
    if (!resText || !resText.trim()) {
        return JSON.stringify({
            error: "1905 接口返回空内容"
        });
    }

    // 10. 解析 JSON
    var data;
    try {
        data = JSON.parse(resText);
    } catch (e) {
        return JSON.stringify({
            error: "1905 接口返回非 JSON 内容",
            raw: resText.slice(0, 200)
        });
    }

    if (!data || !data.data) {
        return JSON.stringify({
            error: "1905 接口 JSON 结构异常",
            raw: resText.slice(0, 200)
        });
    }

    // 11. 优先取 hd，失败则尝试其他清晰度
    var host = null;
    var uri = null;
    var hashuri = null;

    // 尝试 hd → sd → ld
    var qualityOrder = ["hd", "sd", "ld"];

    for (var i = 0; i < qualityOrder.length; i++) {
        var q = qualityOrder[i];

        var qHost = data.data.quality && data.data.quality[q] && data.data.quality[q].host;
        var qUri = data.data.path && data.data.path[q] && data.data.path[q].uri;
        var qHash = data.data.sign && data.data.sign[q] && data.data.sign[q].hashuri;

        if (qHost && qUri && qHash) {
            host = qHost;
            uri = qUri;
            hashuri = qHash;
            break;
        }
    }

    if (!host || !uri || !hashuri) {
        return JSON.stringify({
            error: "无法从返回数据中提取播放地址",
            raw: resText.slice(0, 200)
        });
    }

    var playUrl = host + uri + hashuri;

    // 12. 返回给酷9播放器
    return JSON.stringify({
        url: playUrl,
        headers: JSON.stringify({
            "Origin": "https://www.1905.com",
            "User-Agent": "Mozilla/5.0"
        })
    });
}
