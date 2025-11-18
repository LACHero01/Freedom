// 百视通直播源 - 酷9JS版本（GET请求版）
// 转换自 bst.php（GET请求版本）
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
            example: '?g=1&t=2&c=Umai:CHAN/111131@BESTV.SMG.SMG',
            note: 't参数说明: 1=添加_BitRate参数, 2+=去掉查询参数'
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

// 获取播放URL（主逻辑）- 使用GET请求
function get_play_url(group, type, code) {
    var hosts = get_hosts();
    var max_retries = 1; // 重试次数改为1次
    
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

// 构建API URL（GET请求，参数在URL中）
function build_api_url(host, group, type, code) {
    var user_id = get_user_id(); // 固定UserID
    var user_token = generate_random_string(1, 16);
    var tv_id = "$$" + generate_random_string(4, 16);
    
    var params = "UserID=" + user_id + 
                "&UserToken=" + user_token + 
                "&TVID=" + encodeURIComponent(tv_id) + 
                "&UserGroup=$TerOut_" + group + 
                "&ItemType=" + type + 
                "&ItemCode=" + encodeURIComponent(code);
    
    var api_url = "http://" + host + "/ps/OttService/Auth?" + params;
    
    return api_url;
}

// 获取固定UserID
function get_user_id() {
    return '023909999999999'; // 固定UserID
}

// 获取主机列表
function get_hosts() {
    return [
        'ltzxps.bbtv.cn'
        // 注释掉的其他主机可以按需添加
        // '139.224.116.50',
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

// 根据type参数处理URL（简化版）
function process_url_by_type(type, original_url) {
    // 解析URL
    var url_parts = original_url.split('?');
    var base_url = url_parts[0];
    
    if (parseInt(type) > 1) {
        // type > 1: 直接返回基础URL，去掉查询参数
        return base_url;
    } else {
        // type = 1: 添加_BitRate参数
        return base_url + '?_BitRate=6000';
    }
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