// 转换难度: ⭐ 简单
// 文件名: Fujian.js

function main(item) {
    // 获取频道ID，默认3
    var channelId = ku9.getQuery(item.url, "id") || '3';
    
    // 构建API地址
    var apiUrl = 'https://live.fjtv.net/m2o/channel/channel_info.php?channel_id=' + channelId;
    
    try {
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        };
        
        // 发送请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                error: '无法获取频道信息'
            });
        }
        
        // 解析JSON数据
        var data = JSON.parse(response);
        
        if (!data || data.length === 0 || !data[0].m3u8) {
            return JSON.stringify({
                error: '无法提取播放地址'
            });
        }
        
        var m3u8Url = data[0].m3u8;
        
        return JSON.stringify({
            url: m3u8Url
        });
        
    } catch (e) {
        return JSON.stringify({
            error: '处理过程中出错: ' + e.toString()
        });
    }
}