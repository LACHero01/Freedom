// 桂林电视台直播源 - 酷9JS版本
// 转换自 guilin.php
// 频道参数: id=xwzh(桂林新闻综合), id=glgg(桂林公共), id=glkj(桂林科教旅游)
function main(item) {
    // 频道映射表
    var channelMap = {
        'xwzh': 33, // 桂林新闻综合
        'glgg': 34, // 桂林公共
        'glkj': 35  // 桂林科教旅游
    };
    
    // 获取频道ID
    var id = ku9.getQuery(item.url, "id") || 'xwzh';
    
    // 验证频道ID
    if (!channelMap[id]) {
        return JSON.stringify({
            code: 404,
            message: '频道不存在',
            available_channels: {
                'xwzh': '桂林新闻综合',
                'glgg': '桂林公共', 
                'glkj': '桂林科教旅游'
            }
        });
    }
    
    try {
        var resourceId = channelMap[id];
        var url = "https://guilinbcnew.zainanjing365.com//share/live/detailTv?resourceId=" + resourceId + "&appscheme=gdmm-zaiguilin";
        
        var userAgent = 'Mozilla/5.0 (Linux; U; Android 13; zh-cn; PGZ110 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.86 MQQBrowser/13.8 Mobile Safari/537.36 COVC/046915';
        
        var headers = {
            "User-Agent": userAgent
        };
        
        var response = ku9.get(url, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取页面内容'
            });
        }
        
        // 查找视频URL
        var searchStr = 'const videoUrl = "';
        var startPos = response.indexOf(searchStr);
        
        if (startPos === -1) {
            return JSON.stringify({
                code: 500,
                message: '无法提取视频地址'
            });
        }
        
        startPos += searchStr.length;
        var endPos = response.indexOf('"', startPos);
        
        if (endPos === -1) {
            return JSON.stringify({
                code: 500,
                message: '视频地址格式错误'
            });
        }
        
        var videoUrl = response.substring(startPos, endPos);
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: videoUrl
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}