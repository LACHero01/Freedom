function main(item) {
    // 频道映射表
    var channelMap = {
        'cczh': '36',  // 长春综合
        'wlty': '37',  // 文旅体育
        'smsh': '38'   // 市民生活
    };
    
    // 获取URL参数，默认值为'smsh'
    var channelKey = ku9.getQuery(item.url, "id") || 'smsh';
    
    // 检查频道ID是否有效
    if (!channelMap[channelKey]) {
        return JSON.stringify({ 
            error: "无效的频道ID，请检查参数" 
        });
    }
    
    // 获取对应的资源ID
    var resourceId = channelMap[channelKey];
    
    try {
        // 调用函数获取直播m3u8地址
        var m3u8 = getLiveM3u8(resourceId);
        
        if (!m3u8) {
            return JSON.stringify({ 
                error: "获取直播流失败，请稍后重试" 
            });
        }
        
        // 返回播放地址
        return JSON.stringify({ 
            url: m3u8 
        });
        
    } catch (e) {
        return JSON.stringify({ 
            error: "获取播放地址失败: " + e.toString() 
        });
    }
}

// 获取直播m3u8地址的函数
function getLiveM3u8(resourceId) {
    var apiUrl = "https://ccms.njgdmm.com/changchun/api/api-bc/share/liveTvById?resourceId=" + resourceId;
    
    // 设置请求头
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://ccms.njgdmm.com/",
        "Accept": "application/json, text/plain, */*"
    };
    
    // 发送GET请求获取API数据
    var response = ku9.get(apiUrl, JSON.stringify(headers));
    
    if (!response) {
        return false;
    }
    
    try {
        // 解析JSON响应
        var apiData = JSON.parse(response);
        
        // 检查API返回状态 - 与原PHP脚本相同的检查逻辑
        if (!apiData || apiData.error !== 200) {
            return false;
        }
        
        // 返回m3u8地址
        return apiData.data?.url || false;
        
    } catch (parseError) {
        return false;
    }
}