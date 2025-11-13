// 百视通(BST)电视台直播源 - 酷9JS版本
// 转换自 bst.php
// 频道参数: code=频道代码 (具体代码见注释)
function main(item) {
    var code = ku9.getQuery(item.url, "code") || 'Umai:CHAN/111128@BESTV.SMG.SMG';
    
    try {
        var result = getPlayUrl(code);
        
        if (result.success) {
            return JSON.stringify({
                code: 200,
                message: '获取成功',
                url: result.playUrl
            });
        } else {
            return JSON.stringify({
                code: 500,
                message: '获取失败: ' + result.errorMsg
            });
        }
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

function getPlayUrl(code) {
    var responseMsg = '';
    var playUrl = '';
    
    // 重试10次
    for (var i = 1; i <= 10; i++) {
        var hosts = getHosts();
        
        for (var j = 0; j < hosts.length; j++) {
            var host = hosts[j];
            var apiUrl = buildInterfaceUrl(host, code);
            
            var headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Referer": "http://www.bestv.com.cn/"
            };
            
            var response = ku9.get(apiUrl, JSON.stringify(headers));
            
            if (!response) {
                continue; // 请求失败，尝试下一个主机
            }
            
            var result = parseResponse(response);
            playUrl = result.playUrl;
            var responseCode = result.responseCode;
            responseMsg = result.responseMsg;
            
            switch (responseCode) {
                case 0: // 成功
                    return {
                        success: true,
                        playUrl: playUrl
                    };
                case -4014: // 防盗链服务错误
                    // 继续尝试下一个主机
                    break;
                case -4020: // 直播频道配置异常
                    // 跳出内外两层循环
                    i = 10; // 设置外层循环结束
                    j = hosts.length; // 设置内层循环结束
                    break;
                default:
                    // 其他错误，跳出内外两层循环
                    i = 10;
                    j = hosts.length;
                    break;
            }
        }
    }
    
    return {
        success: false,
        errorMsg: responseMsg || '所有主机尝试均失败'
    };
}

function buildInterfaceUrl(host, code) {
    var format = 'http://%s.bestv.com.cn/ps/OttService/Auth?UserID=%s&UserToken=%s&TVID=$$%s&UserGroup=$TerOut_1&ItemType=2&ItemCode=%s';
    var userId = getUserId();
    var userToken = getUserToken();
    var tvid = getTvId();
    
    return sprintf(format, host, userId, userToken, tvid, code);
}

function getTvId() {
    return generateRandomString(4, 16);
}

function getUserToken() {
    return generateRandomString(1, 16);
}

function getUserId() {
    return generateRandomString(1, 16);
}

function generateRandomString(minLength, maxLength) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    var result = '';
    
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }
    
    return result;
}

function getHosts() {
    return [
        'b2cv3replay',
        'b2cv3wxmini', 
        'b2cv3epg',
        'b2cv3aaa',
        'b2cv3ps'
    ];
}

function parseResponse(content) {
    try {
        var jsonData = JSON.parse(content);
        var responseCode = jsonData.Response.Header.RC;
        var responseMsg = jsonData.Response.Header.RM;
        var playUrl = '';
        
        if (responseCode === 0) {
            playUrl = jsonData.Response.Body.PlayURL;
            // 解析和重构URL（模拟PHP的parse_url和parse_str）
            var urlParts = parseUrl(playUrl);
            if (urlParts.query && urlParts.query.se && urlParts.query.ct) {
                playUrl = urlParts.path + '?se=' + urlParts.query.se + '&ct=' + urlParts.query.ct;
            }
        }
        
        return {
            playUrl: playUrl,
            responseCode: responseCode,
            responseMsg: responseMsg
        };
        
    } catch (e) {
        return {
            playUrl: '',
            responseCode: -1,
            responseMsg: '响应解析失败: ' + e.toString()
        };
    }
}

// 简单的URL解析函数（模拟PHP的parse_url）
function parseUrl(url) {
    var result = {
        path: '',
        query: {}
    };
    
    var questionMarkIndex = url.indexOf('?');
    if (questionMarkIndex !== -1) {
        result.path = url.substring(0, questionMarkIndex);
        var queryString = url.substring(questionMarkIndex + 1);
        var pairs = queryString.split('&');
        
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            if (pair.length === 2) {
                result.query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }
    } else {
        result.path = url;
    }
    
    return result;
}

// 简单的字符串格式化函数（模拟PHP的sprintf）
function sprintf(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/%s/g, function() {
        return args.shift();
    });
}

/*
可用频道代码:
CCTV-1HD: Umai:CHAN/111128@BESTV.SMG.SMG
CCTV-2HD: Umai:CHAN/5000036@BESTV.SMG.SMG
CCTV-5+HD: Umai:CHAN/6000068@BESTV.SMG.SMG
CCTV-13HD: Umai:CHAN/6000054@BESTV.SMG.SMG
安徽卫视HD: Umai:CHAN/3540416@BESTV.SMG.SMG
广东深圳卫视HD: Umai:CHAN/181362@BESTV.SMG.SMG
江苏卫视HD: Umai:CHAN/111129@BESTV.SMG.SMG
江西卫视HD: Umai:CHAN/3468921@BESTV.SMG.SMG
辽宁卫视HD: Umai:CHAN/3450001@BESTV.SMG.SMG
东方卫视HD: Umai:CHAN/111131@BESTV.SMG.SMG
天津卫视HD: Umai:CHAN/3450000@BESTV.SMG.SMG
浙江卫视HD: Umai:CHAN/111130@BESTV.SMG.SMG
东方财经HD: Umai:CHAN/6880079@BESTV.SMG.SMG
游戏风云HD: Umai:CHAN/1555894@BESTV.SMG.SMG
CCTV-7: Umai:CHAN/1352@BESTV.SMG.SMG
CCTV-10: Umai:CHAN/1355@BESTV.SMG.SMG
CCTV-11: Umai:CHAN/1356@BESTV.SMG.SMG
CCTV-12: Umai:CHAN/1357@BESTV.SMG.SMG
CCTV-13: Umai:CHAN/1358@BESTV.SMG.SMG
CCTV-14: Umai:CHAN/1359@BESTV.SMG.SMG
CCTV-15: Umai:CHAN/3874@BESTV.SMG.SMG
北京卫视: Umai:CHAN/1326@BESTV.SMG.SMG
黑龙江卫视: Umai:CHAN/1343@BESTV.SMG.SMG
湖北卫视: Umai:CHAN/1341@BESTV.SMG.SMG
山东卫视: Umai:CHAN/1330@BESTV.SMG.SMG
第一财经: Umai:CHAN/1314@BESTV.SMG.SMG
东方购物-1: Umai:CHAN/648549@BESTV.SMG.SMG
哈哈炫动: Umai:CHAN/1324@BESTV.SMG.SMG
新闻综合: Umai:CHAN/1312@BESTV.SMG.SMG

可看频道:
CCTV-1,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/111128@BESTV.SMG.SMG
CCTV-2,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/5000036@BESTV.SMG.SMG
CCTV-4,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1349@BESTV.SMG.SMG
CCTV-7,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1352@BESTV.SMG.SMG
CCTV-10,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1355@BESTV.SMG.SMG
CCTV-11,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1356@BESTV.SMG.SMG
CCTV-12,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1357@BESTV.SMG.SMG
CCTV-13,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/6000054@BESTV.SMG.SMG
CCTV-13,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1358@BESTV.SMG.SMG
CCTV-14,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1359@BESTV.SMG.SMG
CCTV-15,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/3874@BESTV.SMG.SMG
北京卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1326@BESTV.SMG.SMG
东方卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/111131@BESTV.SMG.SMG
黑龙江卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1343@BESTV.SMG.SMG
湖北卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1341@BESTV.SMG.SMG
湖南卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/181358@BESTV.SMG.SMG
江苏卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/111129@BESTV.SMG.SMG
江西卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/3468921@BESTV.SMG.SMG
辽宁卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/3450001@BESTV.SMG.SMG
山东卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1330@BESTV.SMG.SMG
深圳卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/181362@BESTV.SMG.SMG
天津卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/3450000@BESTV.SMG.SMG
浙江卫视,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/111130@BESTV.SMG.SMG
上海新闻综合,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1312@BESTV.SMG.SMG
第一财经-标清,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1314@BESTV.SMG.SMG
哈哈炫动,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1324@BESTV.SMG.SMG
东方购物,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/648549@BESTV.SMG.SMG
东方财经,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/6880079@BESTV.SMG.SMG
都市剧场,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1366@BESTV.SMG.SMG
游戏风云,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/1555894@BESTV.SMG.SMG
直播室4,http://A/ku9/js/Others/bst.js?code=Umai:CHAN/123225@BESTV.SMG.SMG


*/