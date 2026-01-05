// 九江电视台直播源 - 酷9JS版本
// 转换自 jiujiang.php
// 频道参数: jjtv1=新闻综合频道, jjtv2=公共频道, jjfz=教育频道
function main(item) {
    // 获取频道ID
    var id = ku9.getQuery(item.url, "id") || 'jjtv1';
    
    try {
        // 获取M3U8播放地址
        var m3u8Url = get_m3u8_url(id);
        
        if (!m3u8Url) {
            return JSON.stringify({
                code: 500,
                message: '无法获取播放地址，请检查频道ID是否正确'
            });
        }
        
        // 返回播放地址
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: m3u8Url
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

function get_m3u8_url(id) {
    return get_m3u8_url_from_web(id);
}

function get_m3u8_url_from_web(id) {
    var url = 'https://www.jjntv.cn/live';
    var data = send_request(url);
    
    if (!data) {
        return null;
    }
    
    // 使用正则表达式匹配stream地址
    var pattern = new RegExp(id + ':[\\s\\S]+?stream:\\s*?\'(.*?)\'');
    var match = data.match(pattern);
    
    if (match && match[1]) {
        return match[1];
    }
    
    return null;
}

function send_request(url) {
    var headers = {
        "Referer": "https://www.jjntv.cn/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    };
    
    try {
        return ku9.get(url, JSON.stringify(headers));
    } catch (e) {
        return null;
    }
}