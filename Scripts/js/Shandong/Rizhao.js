// ==================== 2. 日照电视台 ====================
// 转换难度: ⭐⭐⭐⭐⭐ 困难 - 部分转换（简化版）
// 文件名: Rizhao.js
// 用法: ?id=rzxwzh 或 ?id=rzkj 或 ?id=rzgg
// 
// 警告: 此为简化版本，无法实现原PHP的代理功能
//      如果播放源需要代理才能访问，必须使用PHP版本

function main(item) {
    // 获取频道ID，默认rzxwzh
    var channelId = ku9.getQuery(item.url, "id") || 'rzxwzh';
    
    // 频道映射表
    var channelMap = {
        'rzxwzh': 6,    // 日照新闻综合
        'rzkj': 12,     // 日照科教
        'rzgg': 13      // 日照公共
    };
    
    // 检查频道是否存在
    if (!channelMap.hasOwnProperty(channelId)) {
        return JSON.stringify({
            error: '频道不存在',
            available_channels: {
                'rzxwzh': '日照新闻综合',
                'rzkj': '日照科教',
                'rzgg': '日照公共'
            }
        });
    }
    
    var targetChannelId = channelMap[channelId];
    
    try {
        // 第一步：获取M3U8地址
        var apiUrl = 'https://mapi.rzw.com.cn/api/v1/channel.php?channel_id=' + targetChannelId;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://www.rzw.com.cn/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                error: '无法获取频道信息'
            });
        }
        
        // 解析JSON获取m3u8地址
        var data = JSON.parse(response);
        
        if (!data || !data[0] || !data[0].m3u8) {
            return JSON.stringify({
                error: 'API返回数据格式错误'
            });
        }
        
        var indexM3u8Url = data[0].m3u8;
        
        // 第二步：获取索引M3U8内容
        var indexContent = ku9.get(indexM3u8Url, JSON.stringify(headers));
        
        if (!indexContent) {
            return JSON.stringify({
                error: '无法获取M3U8索引文件'
            });
        }
        
        // 第三步：提取实际播放流地址
        // 查找包含"sd"的行（标清流）
        var lines = indexContent.split('\n');
        var actualM3u8 = null;
        
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            
            // 查找包含"sd"的非注释行
            if (line.indexOf('sd') !== -1 && line.charAt(0) !== '#') {
                // 拼接完整URL
                var baseUrl = indexM3u8Url.substring(0, indexM3u8Url.lastIndexOf('/'));
                actualM3u8 = baseUrl + '/' + line;
                break;
            }
        }
        
        if (!actualM3u8) {
            // 如果没找到sd流，尝试返回第一个非注释行
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line.length > 0 && line.charAt(0) !== '#') {
                    var baseUrl = indexM3u8Url.substring(0, indexM3u8Url.lastIndexOf('/'));
                    actualM3u8 = baseUrl + '/' + line;
                    break;
                }
            }
        }
        
        if (!actualM3u8) {
            return JSON.stringify({
                error: '无法提取实际播放地址'
            });
        }
        
        return JSON.stringify({
            url: actualM3u8,
            headers: headers,
            warning: '简化版本：原PHP包含TS代理功能，酷9JS无法实现。如播放失败，请使用PHP版本'
        });
        
    } catch (e) {
        return JSON.stringify({
            error: '处理过程中出错: ' + e.toString()
        });
    }
}
