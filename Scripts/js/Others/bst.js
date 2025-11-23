// 转换自: bst.php (百视通直播)
function main(item) {
    var group = item.g || '1'; // UserGroup
    var type = item.t || '1';  // ItemType
    var code = item.c || '';   // ItemCode (频道代码)
    var playseek = item.playseek || null; // 回看时间范围
    
    try {
        // 获取主机列表
        var hosts = hosts_get();
        var play_url = '';
        var response_msg = '';
        
        // 尝试每个主机
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            
            // 获取接口URL和POST数据
            var intfData = intf_get(host, group, type, code);
            var url = intfData[0];
            var postData = intfData[1];
            
            var headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json, text/plain, */*"
            };
            
            // 发送POST请求
            var response = ku9.request(
                url,
                'POST',
                JSON.stringify(headers),
                postData
            );
            
            if (!response || !response.body) {
                continue; // 尝试下一个主机
            }
            
            // 处理响应
            var urlResult = url_get(playseek, type, response.body, response_msg);
            
            if (urlResult && urlResult.url) {
                play_url = urlResult.url;
                break; // 成功获取播放地址
            } else if (urlResult.responseCode === -4020) {
                // 直播频道配置异常，停止尝试
                break;
            }
            // 其他错误继续尝试下一个主机
        }
        
        if (play_url) {
            return JSON.stringify({ 
                url: play_url,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "*/*"
                }
            });
        } else {
            return JSON.stringify({ 
                error: "无法获取播放地址: " + response_msg 
            });
        }
        
    } catch (e) {
        return JSON.stringify({ 
            error: "获取百视通直播地址失败: " + e.toString() 
        });
    }
}

// 获取接口URL和POST数据
function intf_get(host, group, type, code) {
    var url = 'http://' + host + '/ps/OttService/Auth';
    
    var params = {
        'UserID': user_get_id(),
        'UserToken': user_get_token(),
        'TVID': '$$' + tvid_get(),
        'UserGroup': '$TerOut_' + group,
        'ItemType': type,
        'ItemCode': code
    };
    
    var postData = Object.keys(params).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
    
    return [url, postData];
}

// 生成TVID
function tvid_get() {
    return random_string(4, 16);
}

// 生成用户Token
function user_get_token() {
    return random_string(1, 16);
}

// 生成用户ID
function user_get_id() {
    return random_string(1, 16);
}

// 生成随机字符串
function random_string(min, max) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var length = Math.floor(Math.random() * (max - min + 1)) + min;
    var result = '';
    
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

// 获取主机列表
function hosts_get() {
    return [
        '139.224.116.50'
        // 可以添加更多备用主机
    ];
}

// 处理URL响应
function url_get(playseek, type, content, response_msg) {
    try {
        var jsonData = JSON.parse(content);
        var responseHeader = jsonData.Response.Header;
        var responseCode = responseHeader.RC;
        response_msg = responseHeader.RM || '';
        
        if (responseCode !== 0) {
            return {
                responseCode: responseCode,
                error: response_msg
            };
        }
        
        var responseBody = jsonData.Response.Body;
        var url = '';
        
        // 根据是否有回看时间选择URL
        if (playseek !== null) {
            url = responseBody.LookBackUrl || responseBody.PlayURL;
        } else {
            url = responseBody.PlayURL;
        }
        
        if (!url) {
            return {
                responseCode: -1,
                error: "未找到播放URL"
            };
        }
        
        // 根据类型处理URL
        if (type > 1) {
            // 解析查询参数
            var urlObj = new URL(url);
            var se = urlObj.searchParams.get('se');
            var ct = urlObj.searchParams.get('ct');
            
            if (se && ct) {
                url = url.split('?')[0] + '?se=' + se + '&ct=' + ct;
            } else {
                url = url.split('?')[0];
            }
        } else {
            url = url.split('?')[0] + '?_BitRate=6000';
        }
        
        // 处理回看时间
        if (playseek !== null) {
            var timeRange = parsePlayseek(playseek);
            if (timeRange) {
                var separator = url.includes('?') ? '&' : '?';
                url += separator + 'starttime=' + timeRange.starttime + '&endtime=' + timeRange.endtime;
            }
        }
        
        return {
            url: url,
            responseCode: 0
        };
        
    } catch (e) {
        return {
            responseCode: -1,
            error: "解析响应失败: " + e.toString()
        };
    }
}

// 解析回看时间范围
function parsePlayseek(playseek) {
    try {
        var parts = playseek.split('-');
        if (parts.length !== 2) return null;
        
        var startStr = parts[0]; // 格式: YYYYMMDDHHMMSS
        var endStr = parts[1];
        
        // 将时间字符串转换为时间戳
        var startTime = parseDateTime(startStr);
        var endTime = parseDateTime(endStr);
        
        if (startTime && endTime) {
            return {
                starttime: Math.floor(startTime / 1000), // 转换为秒
                endtime: Math.floor(endTime / 1000)
            };
        }
    } catch (e) {
        console.error('解析回看时间失败:', e);
    }
    return null;
}

// 解析日期时间字符串
function parseDateTime(dateTimeStr) {
    // 格式: YYYYMMDDHHMMSS
    var year = parseInt(dateTimeStr.substring(0, 4));
    var month = parseInt(dateTimeStr.substring(4, 6)) - 1; // 月份从0开始
    var day = parseInt(dateTimeStr.substring(6, 8));
    var hour = parseInt(dateTimeStr.substring(8, 10));
    var minute = parseInt(dateTimeStr.substring(10, 12));
    var second = parseInt(dateTimeStr.substring(12, 14));
    
    // 创建日期对象（使用本地时区）
    var date = new Date(year, month, day, hour, minute, second);
    return date.getTime();
}
/*
东方卫视,bst.js?g=1&t=2&c=Umai:CHAN/111131@BESTV.SMG.SMG
东方购物上星,bst.js?g=1&t=2&c=Umai:CHAN/6880080@BESTV.SMG.SMG
金色学堂,bst.js?g=1&t=2&c=Umai:CHAN/4492970@BESTV.SMG.SMG
法治天地,bst.js?g=1&t=2&c=Umai:CHAN/1373@BESTV.SMG.SMG
东方财经,bst.js?g=1&t=2&c=Umai:CHAN/6880079@BESTV.SMG.SMG
欢笑剧场,bst.js?g=1&t=2&c=Umai:CHAN/1367710@BESTV.SMG.SMG
都市剧场,bst.js?g=1&t=2&c=Umai:CHAN/1555881@BESTV.SMG.SMG
动漫秀场,bst.js?g=1&t=2&c=Umai:CHAN/1555886@BESTV.SMG.SMG
生活时尚,bst.js?g=1&t=2&c=Umai:CHAN/1555893@BESTV.SMG.SMG
游戏风云,bst.js?g=1&t=2&c=Umai:CHAN/1555894@BESTV.SMG.SMG

CCTV-1,bst.js?g=1&t=2&c=Umai:CHAN/111128@BESTV.SMG.SMG
CCTV-2,bst.js?g=1&t=2&c=Umai:CHAN/5000036@BESTV.SMG.SMG
CCTV-3,bst.js?g=1&t=2&c=Umai:CHAN/1369028@BESTV.SMG.SMG
CCTV-4,bst.js?g=1&t=2&c=Umai:CHAN/1349@BESTV.SMG.SMG
CCTV-5,bst.js?g=1&t=2&c=Umai:CHAN/1369029@BESTV.SMG.SMG
CCTV-5+,bst.js?g=1&t=2&c=Umai:CHAN/6000068@BESTV.SMG.SMG
CCTV-6,bst.js?g=1&t=2&c=Umai:CHAN/1369030@BESTV.SMG.SMG
CCTV-7,bst.js?g=1&t=2&c=Umai:CHAN/1352@BESTV.SMG.SMG
CCTV-8,bst.js?g=1&t=2&c=Umai:CHAN/1369033@BESTV.SMG.SMG
CCTV-9,bst.js?g=1&t=2&c=Umai:CHAN/5000039@BESTV.SMG.SMG
CCTV-10,bst.js?g=1&t=2&c=Umai:CHAN/3949784@BESTV.SMG.SMG
CCTV-11,bst.js?g=1&t=2&c=Umai:CHAN/6000053@BESTV.SMG.SMG
CCTV-12,bst.js?g=1&t=2&c=Umai:CHAN/5000040@BESTV.SMG.SMG
CCTV-13,bst.js?g=1&t=2&c=Umai:CHAN/6000054@BESTV.SMG.SMG
CCTV-14,bst.js?g=1&t=2&c=Umai:CHAN/3949788@BESTV.SMG.SMG
CCTV-15,bst.js?g=1&t=2&c=Umai:CHAN/6000055@BESTV.SMG.SMG
CCTV-16,bst.js?g=1&t=2&c=Umai:CHAN/6000061@BESTV.SMG.SMG
CCTV-17,bst.js?g=1&t=2&c=Umai:CHAN/5000041@BESTV.SMG.SMG
CGTN英语,bst.js?g=1&t=2&c=Umai:CHAN/1354@BESTV.SMG.SMG
CETV-1,bst.js?g=1&t=2&c=Umai:CHAN/3138605@BESTV.SMG.SMG
CETV-2,bst.js?g=1&t=2&c=Umai:CHAN/79471@BESTV.SMG.SMG
CETV-4,bst.js?g=1&t=2&c=Umai:CHAN/79472@BESTV.SMG.SMG

百视通直播-30,bst.js?g=1&t=2&c=Umai:CHAN/123222@BESTV.SMG.SMG
百视通直播-31,bst.js?g=1&t=2&c=Umai:CHAN/123223@BESTV.SMG.SMG
百视通直播-32,bst.js?g=1&t=2&c=Umai:CHAN/123224@BESTV.SMG.SMG
百视通直播-33,bst.js?g=1&t=2&c=Umai:CHAN/123225@BESTV.SMG.SMG
百视通直播-34,bst.js?g=1&t=2&c=Umai:CHAN/123226@BESTV.SMG.SMG
百视通直播-35,bst.js?g=1&t=2&c=Umai:CHAN/123227@BESTV.SMG.SMG
百视通直播-36,bst.js?g=1&t=2&c=Umai:CHAN/123228@BESTV.SMG.SMG
百视通直播-37,bst.js?g=1&t=2&c=Umai:CHAN/2197671@BESTV.SMG.SMG
百视通直播-38,bst.js?g=1&t=2&c=Umai:CHAN/2197672@BESTV.SMG.SMG
百视通直播-39,bst.js?g=1&t=2&c=Umai:CHAN/2197673@BESTV.SMG.SMG
百视通直播-40,bst.js?g=1&t=2&c=Umai:CHAN/2197674@BESTV.SMG.SMG

BesTV华语影院,bst.js?g=1&t=2&c=Umai:CHAN/3992540@BESTV.SMG.SMG
BesTV星光影院,bst.js?g=1&t=2&c=Umai:CHAN/3992541@BESTV.SMG.SMG
BesTV全球大片,bst.js?g=1&t=2&c=Umai:CHAN/3992543@BESTV.SMG.SMG
BesTV热门剧场,bst.js?g=1&t=2&c=Umai:CHAN/3992538@BESTV.SMG.SMG
BesTV谍战剧场,bst.js?g=1&t=2&c=Umai:CHAN/3992539@BESTV.SMG.SMG
BesTV青春动漫,bst.js?g=1&t=2&c=Umai:CHAN/3992536@BESTV.SMG.SMG
BesTV宝宝动画,bst.js?g=1&t=2&c=Umai:CHAN/3992535@BESTV.SMG.SMG
BesTV戏曲精选,bst.js?g=1&t=2&c=Umai:CHAN/3992530@BESTV.SMG.SMG
BesTV热门综艺,bst.js?g=1&t=2&c=Umai:CHAN/3992529@BESTV.SMG.SMG
BesTV健康养生,bst.js?g=1&t=2&c=Umai:CHAN/3992544@BESTV.SMG.SMG
BesTV百变课堂,bst.js?g=1&t=2&c=Umai:CHAN/3992537@BESTV.SMG.SMG
BesTV看天下精选,bst.js?g=1&t=2&c=Umai:CHAN/3992546@BESTV.SMG.SMG
BesTV电竞天堂,bst.js?g=1&t=2&c=Umai:CHAN/3992531@BESTV.SMG.SMG

安徽卫视,bst.js?g=1&t=2&c=Umai:CHAN/3540416@BESTV.SMG.SMG
北京卫视,bst.js?g=1&t=2&c=Umai:CHAN/181361@BESTV.SMG.SMG
兵团卫视,bst.js?g=1&t=2&c=Umai:CHAN/126389@BESTV.SMG.SMG
重庆卫视,bst.js?g=1&t=2&c=Umai:CHAN/3840707@BESTV.SMG.SMG
东南卫视,bst.js?g=1&t=2&c=Umai:CHAN/3540417@BESTV.SMG.SMG
甘肃卫视,bst.js?g=1&t=2&c=Umai:CHAN/6000067@BESTV.SMG.SMG
广东卫视,bst.js?g=1&t=2&c=Umai:CHAN/181359@BESTV.SMG.SMG
广西卫视,bst.js?g=1&t=2&c=Umai:CHAN/5000045@BESTV.SMG.SMG
贵州卫视,bst.js?g=1&t=2&c=Umai:CHAN/4252663@BESTV.SMG.SMG
海南卫视,bst.js?g=1&t=2&c=Umai:CHAN/4252684@BESTV.SMG.SMG
河北卫视,bst.js?g=1&t=2&c=Umai:CHAN/100000002@BESTV.SMG.SMG
河南卫视,bst.js?g=1&t=2&c=Umai:CHAN/5000044@BESTV.SMG.SMG
黑龙江卫视,bst.js?g=1&t=2&c=Umai:CHAN/181356@BESTV.SMG.SMG
湖北卫视,bst.js?g=1&t=2&c=Umai:CHAN/911989@BESTV.SMG.SMG
湖南卫视,bst.js?g=1&t=2&c=Umai:CHAN/181358@BESTV.SMG.SMG
吉林卫视,bst.js?g=1&t=2&c=Umai:CHAN/5000046@BESTV.SMG.SMG
江苏卫视,bst.js?g=1&t=2&c=Umai:CHAN/111129@BESTV.SMG.SMG
江西卫视,bst.js?g=1&t=2&c=Umai:CHAN/3468921@BESTV.SMG.SMG
辽宁卫视,bst.js?g=1&t=2&c=Umai:CHAN/3450001@BESTV.SMG.SMG
内蒙古卫视,bst.js?g=1&t=2&c=Umai:CHAN/79469@BESTV.SMG.SMG
宁夏卫视,bst.js?g=1&t=2&c=Umai:CHAN/160782@BESTV.SMG.SMG
青海卫视,bst.js?g=1&t=2&c=Umai:CHAN/67026@BESTV.SMG.SMG
山东卫视,bst.js?g=1&t=2&c=Umai:CHAN/911992@BESTV.SMG.SMG
山西卫视,bst.js?g=1&t=2&c=Umai:CHAN/1344@BESTV.SMG.SMG
陕西卫视,bst.js?g=1&t=2&c=Umai:CHAN/7105@BESTV.SMG.SMG
深圳卫视,bst.js?g=1&t=2&c=Umai:CHAN/181362@BESTV.SMG.SMG
四川卫视,bst.js?g=1&t=2&c=Umai:CHAN/3840706@BESTV.SMG.SMG
天津卫视,bst.js?g=1&t=2&c=Umai:CHAN/3450000@BESTV.SMG.SMG
西藏卫视,bst.js?g=1&t=2&c=Umai:CHAN/77574@BESTV.SMG.SMG
新疆卫视,bst.js?g=1&t=2&c=Umai:CHAN/126387@BESTV.SMG.SMG
云南卫视,bst.js?g=1&t=2&c=Umai:CHAN/5000043@BESTV.SMG.SMG
浙江卫视,bst.js?g=1&t=2&c=Umai:CHAN/111130@BESTV.SMG.SMG

广东嘉佳卡通,bst.js?g=1&t=2&c=Umai:CHAN/484998@BESTV.SMG.SMG
湖南金鹰卡通,bst.js?g=1&t=2&c=Umai:CHAN/79467@BESTV.SMG.SMG
湖南金鹰纪实,bst.js?g=1&t=2&c=Umai:CHAN/4766929@BESTV.SMG.SMG
湖南快乐垂钓,bst.js?g=1&t=2&c=Umai:CHAN/4766930@BESTV.SMG.SMG
湖南茶频道,bst.js?g=1&t=2&c=Umai:CHAN/6000049@BESTV.SMG.SMG
江苏财富天下,bst.js?g=1&t=2&c=Umai:CHAN/5000047@BESTV.SMG.SMG
家庭理财,bst.js?g=1&t=2&c=Umai:CHAN/1872767@BESTV.SMG.SMG

好享购物,bst.js?g=1&t=2&c=Umai:CHAN/1800368@BESTV.SMG.SMG
央广购物,bst.js?g=1&t=2&c=Umai:CHAN/1168794@BESTV.SMG.SMG
京剧《白蛇传》,bst.js?g=85&t=1&c=14016258
*/