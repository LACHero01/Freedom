// 百视通直播源 - 酷9JS版本（更新版）
// 转换自 bst.js（新增t参数版本）
// 参数: g=用户组, t=类型, c=频道代码
function main(item) {
    var group = ku9.getQuery(item.url, "g");
    var type = ku9.getQuery(item.url, "t");
    var code = ku9.getQuery(item.url, "c");
    
    if (!group || !type || !code) {
        return JSON.stringify({
            code: 400,
            message: '缺少必要参数',
            usage: '需要g(用户组)、t(类型)和c(频道代码)参数',
            example: '?g=1&t=2&c=1001',
            note: 't参数说明: 1=添加_BitRate参数, 2+=提取se和ct参数'
        });
    }
    
    try {
        var result = get_play_url(group, type, code);
        
        if (result.success) {
            return JSON.stringify({
                code: 200,
                message: '获取成功',
                url: result.play_url,
                type: type,
                info: '百视通直播源 - 类型' + type
            });
        } else {
            return JSON.stringify({
                code: 500,
                message: result.error_msg || '无法获取播放地址'
            });
        }
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// 获取播放URL（主逻辑）
function get_play_url(group, type, code) {
    var hosts = get_hosts();
    var max_retries = 10;
    
    for (var i = 1; i <= max_retries; i++) {
        for (var j = 0; j < hosts.length; j++) {
            var host = hosts[j];
            var api_url = build_api_url(host, group, type, code);
            
            try {
                var response = ku9.request(api_url, 'GET', JSON.stringify({}), '');
                
                if (!response || !response.body) {
                    continue; // 尝试下一个主机
                }
                
                var result = parse_response(type, response.body);
                
                if (result.response_code === 0) {
                    return {
                        success: true,
                        play_url: result.play_url
                    };
                } else if (result.response_code === -4014) {
                    // 防盗链服务错误，继续尝试
                    break;
                } else if (result.response_code === -4020) {
                    // 直播频道配置异常，停止重试
                    return {
                        success: false,
                        error_msg: result.response_msg
                    };
                } else {
                    // 其他错误，停止重试
                    return {
                        success: false,
                        error_msg: result.response_msg
                    };
                }
            } catch (e) {
                // 请求失败，继续尝试下一个主机
                continue;
            }
        }
    }
    
    return {
        success: false,
        error_msg: '所有服务器尝试失败'
    };
}

// 构建API URL
function build_api_url(host, group, type, code) {
    var user_id = generate_random_string(1, 16);
    var user_token = generate_random_string(1, 16);
    var tv_id = "$$" + generate_random_string(4, 16);
    
    var url = "http://" + host + "/ps/OttService/Auth?UserID=" + user_id + 
              "&UserToken=" + user_token + 
              "&TVID=" + encodeURIComponent(tv_id) + 
              "&UserGroup=$TerOut_" + group + 
              "&ItemType=" + type + 
              "&ItemCode=" + code;
    
    return url;
}

// 获取主机列表
function get_hosts() {
    return [
        '139.224.116.50'
        // 注释掉的其他主机可以按需添加
        // 'dangbeisdkps.bestv.com.cn',
        // 'dangbeisdkaaa.bestv.com.cn',
        // 'b2cv3replay.bestv.com.cn',
        // 'b2cv3wxmini.bestv.com.cn',
        // 'b2cv3epg.bestv.com.cn',
        // 'b2cv3aaa.bestv.com.cn',
        // 'b2cv3ps.bestv.com.cn',
        // 'b2cv3up.bestv.com.cn',
        // 'b2cv3wag.bestv.com.cn',
        // '2cv3qhaaa.bestv.com.cn',
    ];
}

// 生成随机字符串
function generate_random_string(min_length, max_length) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var length = Math.floor(Math.random() * (max_length - min_length + 1)) + min_length;
    var result = '';
    
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

// 解析API响应（根据type处理URL）
function parse_response(type, content) {
    try {
        var json_data = JSON.parse(content);
        var response_header = json_data.Response.Header;
        var response_body = json_data.Response.Body;
        
        var response_code = response_header.RC;
        var response_msg = response_header.RM;
        
        if (response_code !== 0) {
            return {
                response_code: response_code,
                response_msg: response_msg,
                play_url: null
            };
        }
        
        // 提取播放URL - 现在只使用PlayURL，不再使用LookBackUrl
        var play_url = response_body.PlayURL;
        
        if (!play_url) {
            return {
                response_code: -1,
                response_msg: '未找到播放地址',
                play_url: null
            };
        }
        
        // 根据type参数处理URL
        var processed_url = process_url_by_type(type, play_url);
        
        return {
            response_code: response_code,
            response_msg: response_msg,
            play_url: processed_url
        };
        
    } catch (e) {
        return {
            response_code: -1,
            response_msg: '响应解析失败: ' + e.toString(),
            play_url: null
        };
    }
}

// 根据type参数处理URL
function process_url_by_type(type, original_url) {
    // 解析URL
    var url_parts = original_url.split('?');
    var base_url = url_parts[0];
    var query_string = url_parts[1] || '';
    
    if (parseInt(type) > 1) {
        // type > 1: 提取se和ct参数
        var params = {};
        if (query_string) {
            var pairs = query_string.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                if (pair[0] === 'se' || pair[0] === 'ct') {
                    params[pair[0]] = pair[1];
                }
            }
        }
        
        if (params.se && params.ct) {
            return base_url + '?se=' + params.se + '&ct=' + params.ct;
        } else {
            // 如果没有找到se和ct参数，返回原始URL
            return original_url;
        }
    } else {
        // type = 1: 添加_BitRate参数
        return base_url + '?_BitRate=4000';
    }
}

/*
央视,#genre#
CCTV-1HD,bst.js?g=1&t=2&c=Umai:CHAN/111128@BESTV.SMG.SMG
CCTV-2HD,bst.js?g=1&t=2&c=Umai:CHAN/5000036@BESTV.SMG.SMG
CCTV-3HD,bst.js?g=14&t=2&c=Umai:CHAN/1369028@BESTV.SMG.SMG
CCTV-4,bst.js?g=1&t=2&c=Umai:CHAN/1349@BESTV.SMG.SMG
CCTV-5HD,bst.js?g=14&t=2&c=Umai:CHAN/1369029@BESTV.SMG.SMG
CCTV-5+HD,bst.js?g=14&t=2&c=Umai:CHAN/6000068@BESTV.SMG.SMG
CCTV-6HD,bst.js?g=14&t=2&c=Umai:CHAN/1369030@BESTV.SMG.SMG
CCTV-7,bst.js?g=1&t=2&c=Umai:CHAN/1352@BESTV.SMG.SMG
CCTV-8HD,bst.js?g=14&t=2&c=Umai:CHAN/1369033@BESTV.SMG.SMG
CCTV-9HD,bst.js?g=14&t=2&c=Umai:CHAN/5000039@BESTV.SMG.SMG
CCTV-10,bst.js?g=1&t=2&c=Umai:CHAN/1355@BESTV.SMG.SMG
CCTV-11,bst.js?g=1&t=2&c=Umai:CHAN/1356@BESTV.SMG.SMG
CCTV-12,bst.js?g=1&t=2&c=Umai:CHAN/1357@BESTV.SMG.SMG
CCTV-13HD,bst.js?g=1&t=2&c=Umai:CHAN/6000054@BESTV.SMG.SMG
CCTV-13,bst.js?g=1&t=2&c=Umai:CHAN/1358@BESTV.SMG.SMG
CCTV-14,bst.js?g=1&t=2&c=Umai:CHAN/1359@BESTV.SMG.SMG
CCTV-15,bst.js?g=1&t=2&c=Umai:CHAN/3874@BESTV.SMG.SMG
CCTV-16HD,bst.js?g=14&t=2&c=Umai:CHAN/6000061@BESTV.SMG.SMG
CCTV-17HD,bst.js?g=14&t=2&c=Umai:CHAN/5000041@BESTV.SMG.SMG

卫视,#genre#
安徽卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/3540416@BESTV.SMG.SMG
北京卫视HD,bst.js?g=14&t=2&c=Umai:CHAN/181361@BESTV.SMG.SMG
北京卫视,bst.js?g=1&t=2&c=Umai:CHAN/1326@BESTV.SMG.SMG
广东深圳卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/181362@BESTV.SMG.SMG
黑龙江卫视,bst.js?g=1&t=2&c=Umai:CHAN/1343@BESTV.SMG.SMG
湖北卫视,bst.js?g=1&t=2&c=Umai:CHAN/1341@BESTV.SMG.SMG
湖南卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/181358@BESTV.SMG.SMG
江苏卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/111129@BESTV.SMG.SMG
江西卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/3468921@BESTV.SMG.SMG
辽宁卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/3450001@BESTV.SMG.SMG
山东卫视,bst.js?g=1&t=2&c=Umai:CHAN/1330@BESTV.SMG.SMG
上海东方卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/111131@BESTV.SMG.SMG
天津卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/3450000@BESTV.SMG.SMG
浙江卫视HD,bst.js?g=1&t=2&c=Umai:CHAN/111130@BESTV.SMG.SMG

上海,#genre#
第一财经HD,bst.js?g=1&t=2&c=Umai:CHAN/1346062@BESTV.SMG.SMG
第一财经,bst.js?g=1&t=2&c=Umai:CHAN/1314@BESTV.SMG.SMG
东方财经HD,bst.js?g=1&t=2&c=Umai:CHAN/6880079@BESTV.SMG.SMG
东方财经,bst.js?g=1&t=2&c=Umai:CHAN/1383@BESTV.SMG.SMG
东方购物-1,bst.js?g=1&t=2&c=Umai:CHAN/648549@BESTV.SMG.SMG
都市剧场,bst.js?g=1&t=2&c=Umai:CHAN/1366@BESTV.SMG.SMG
都市频道,bst.js?g=1&t=2&c=Umai:CHAN/1318@BESTV.SMG.SMG
哈哈炫动HD,bst.js?g=14&t=2&c=Umai:CHAN/4641019@BESTV.SMG.SMG
哈哈炫动,bst.js?g=1&t=2&c=Umai:CHAN/1324@BESTV.SMG.SMG
欢笑剧场,bst.js?g=1&t=2&c=Umai:CHAN/1376@BESTV.SMG.SMG
七彩戏剧HD,bst.js?g=14&t=2&c=Umai:CHAN/6880440@BESTV.SMG.SMG
七彩戏剧,bst.js?g=1&t=2&c=Umai:CHAN/1374@BESTV.SMG.SMG
外语频道HD,bst.js?g=1&t=2&c=Umai:CHAN/3778907@BESTV.SMG.SMG
新闻综合HD,bst.js?g=14&t=2&c=Umai:CHAN/1346060@BESTV.SMG.SMG
新闻综合,bst.js?g=1&t=2&c=Umai:CHAN/1312@BESTV.SMG.SMG
游戏风云HD,bst.js?g=1&t=2&c=Umai:CHAN/1555894@BESTV.SMG.SMG

百视通,#genre#
百视通1,bst.js?g=1&t=2&c=Umai:CHAN/123222@BESTV.SMG.SMG
百视通2,bst.js?g=1&t=2&c=Umai:CHAN/123223@BESTV.SMG.SMG
百视通3,bst.js?g=1&t=2&c=Umai:CHAN/123224@BESTV.SMG.SMG
百视通4,bst.js?g=1&t=2&c=Umai:CHAN/123225@BESTV.SMG.SMG
百视通5,bst.js?g=1&t=2&c=Umai:CHAN/123226@BESTV.SMG.SMG
百视通6,bst.js?g=1&t=2&c=Umai:CHAN/123227@BESTV.SMG.SMG
百视通7,bst.js?g=1&t=2&c=Umai:CHAN/123228@BESTV.SMG.SMG

点播,#genre#
京剧《白蛇传》,bst.js?g=1&t=1&c=14016258
*/