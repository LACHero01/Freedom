//********ku9 js使用示例(适合1.3.4及以上版本使用)********//

//识别名称main
function main(item) {
    //日志打印
    console.log(item.url);
    
    //获取参数
    var id = item.id || 'cctv1';
    
    //频道映射
    var channelMap = {
        'cctv1': '11200132825562653886',
        'cctv2': '12030532124776958103',
        'cctv4': '10620168294224708952',
        'cctv7': '8516529981177953694',
        'cctv9': '7252237247689203957',
        'cctv10': '14589146016461298119',
        'cctv12': '13180385922471124325',
        'cctv13': '16265686808730585228',
        'cctv17': '4496917190172866934',
        'cctv4k': '2127841942201075403'
    };
    
    var room = channelMap[id] || channelMap['cctv1'];
    
    //获取m3u8地址
    var m3u8Url = getM3u8Url(room);
    
    if (m3u8Url) {
        //返回播放地址
        return { url: m3u8Url };
    } else {
        console.log("无法获取播放地址");
        return { url: "" };
    }
}

function getM3u8Url(room) {
    try {
        var url = "https://gateway2.cctvnews.cctv.com/1.0.0/feed/article/live/detail?articleId=" + room + "&scene_type=6";
        var t = Math.round(Date.now());
        
        // 构建签名字符串 - 严格按照PHP格式
        var er = "GET\napplication/json\n\n\n\nx-ca-key:204133710\nx-ca-stage:RELEASE\nx-ca-timestamp:" + t + "\n/1.0.0/feed/article/live/detail?articleId=" + room + "&scene_type=6";
        
        var es = 'etyEuNdA7GvQU7iPZHqnrBpSFfRyKQTD';
        
        // 使用正确的HMAC-SHA256计算
        var signature = calculateHMACSHA256(er, es);
        
        var client_id = createUUID();
        var x_req_ts = t - 1;
        
        var headers = {
            'accept': 'application/json',
            'cookieuid': client_id,
            'from-client': 'h5',
            'userid': client_id,
            'x-ca-key': '204133710',
            'x-ca-stage': 'RELEASE',
            'x-ca-signature': signature,
            'x-ca-signature-headers': 'x-ca-key,x-ca-stage,x-ca-timestamp',
            'x-ca-timestamp': t.toString(),
            'x-req-ts': x_req_ts.toString(),
            'x-request-id': client_id,
            'referer': 'https://m-live.cctvnews.cctv.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        };
        
        console.log("发送请求到: " + url);
        console.log("签名: " + signature);
        
        //发送请求
        var response = ku9.request(url, "GET", headers, null, false);
        
        if (response && response.code === 200) {
            console.log("请求成功");
            var data = JSON.parse(response.body);
            
            if (data.response) {
                var decodedResponse = ku9.decodeBase64(data.response);
                var responseData = JSON.parse(decodedResponse);
                
                if (responseData.data && responseData.data.live_room) {
                    var liveData = responseData.data;
                    var authUrl = liveData.live_room.liveCameraList[0].pullUrlList[0].authResultUrl[0].authUrl;
                    
                    var liveUrl;
                    if (authUrl.toLowerCase().indexOf('http') === 0) {
                        liveUrl = authUrl;
                    } else {
                        var dk = liveData.dk;
                        liveUrl = decryptUrl(authUrl, dk, x_req_ts);
                    }
                    
                    if (liveUrl) {
                        //处理URL
                        liveUrl = liveUrl.replace(/https:/gi, 'http:');
                        liveUrl = liveUrl.replace(/-hls\./g, '.');
                        console.log("获取到播放地址: " + liveUrl);
                        return liveUrl;
                    }
                }
            }
        } else {
            console.log("请求失败，状态码: " + (response ? response.code : "无响应"));
            if (response && response.body) {
                console.log("响应内容: " + response.body);
            }
        }
    } catch (e) {
        console.log("处理过程中出错: " + e.toString());
    }
    
    return null;
}

// 正确的HMAC-SHA256计算函数
function calculateHMACSHA256(message, key) {
    // 使用CryptoJS计算HMAC-SHA256
    const CryptoJS = require("crypto");
    
    // 将字符串转换为WordArray
    var messageWA = CryptoJS.enc.Utf8.parse(message);
    var keyWA = CryptoJS.enc.Utf8.parse(key);
    
    // 计算HMAC-SHA256
    var hmac = CryptoJS.HmacSHA256(messageWA, keyWA);
    
    // 转换为Base64
    return CryptoJS.enc.Base64.stringify(hmac);
}

function createUUID() {
    var template = 'xxxxxxxxxxxx4xxx8xxxxxxxxxxxxxxx';
    return template.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function decryptUrl(authUrl, dk, x_req_ts) {
    try {
        var key = getKey(dk, x_req_ts);
        var iv = getIv(dk, x_req_ts);
        
        console.log("解密参数 - key: " + key + ", iv: " + iv);
        
        // 使用ku9的AES解密
        var decrypted = ku9.opensslDecrypt(authUrl, "AES-128-CBC", key, 0, iv);
        return decrypted;
    } catch (e) {
        console.log("解密失败: " + e.toString());
        return null;
    }
}

function getKey(dk, x_req_ts) {
    var tsStr = x_req_ts.toString();
    tsStr = tsStr.substring(0, tsStr.length - 3);
    return (dk.substring(0, 8) + tsStr.substring(tsStr.length - 8)).substring(0, 16);
}

function getIv(dk, x_req_ts) {
    var tsStr = x_req_ts.toString();
    tsStr = tsStr.substring(0, tsStr.length - 3);
    return (dk.substring(dk.length - 8) + tsStr.substring(0, 8)).substring(0, 16);
}