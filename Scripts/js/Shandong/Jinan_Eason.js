// 转换难度: ⭐⭐ 可以完整转换
// 文件名: Jinan.js

function main(item) {
    // 获取频道ID
    var channelId = ku9.getQuery(item.url, "id");
    
    if (!channelId) {
        return JSON.stringify({
            error: '请提供频道ID参数',
            available_channels: {
                '1676': '济南新闻综合频道',
                '1807': '济南都市频道',
                '1842': '济南文旅体育频道',
                '1855': '济南生活频道',
                '2234': '济南少儿频道',
                '1857': '济南鲁中频道'
            }
        });
    }
    
    try {
        // 生成时间戳（秒级）
        var timestamp = Math.floor(Date.now() / 1000);
        
        // API地址
        var apiUrl = 'https://dlive.guangbocloud.com/api/public/third/channel/tv/page?size=10&page=1';
        
        // 构建签名
        // 原始查询参数：size=10&page=1
        // 反转后：page=1&size=10
        var reversedQuery = 'page=1&size=10';
        var secret = '401b38e85b0640b9a6d8f13ad4e1bcc4';
        var signString = reversedQuery + '&timestamp=' + timestamp + '&secret=' + secret;
        var signature = ku9.md5(signString);
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-DFSX-Timestamp": timestamp.toString(),
            "X-DFSX-mainUsername": "jntv",
            "X-DFSX-Signature": signature
        };
        
        // 发送请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                error: '无法获取频道列表'
            });
        }
        
        // 解析JSON数据
        var result = JSON.parse(response);
        
        if (!result.data || !Array.isArray(result.data)) {
            return JSON.stringify({
                error: 'API返回数据格式错误'
            });
        }
        
        // 遍历查找匹配的频道
        var playUrl = null;
        for (var i = 0; i < result.data.length; i++) {
            var channel = result.data[i];
            
            // 注意：channelId是字符串，需要转换比较
            if (channel.id == channelId && 
                channel.push_play_urls && 
                channel.push_play_urls.length > 1) {
                playUrl = channel.push_play_urls[1];
                break;
            }
        }
        
        if (!playUrl) {
            return JSON.stringify({
                error: '未找到对应频道的播放地址'
            });
        }
        
        return JSON.stringify({
            url: playUrl
        });
        
    } catch (e) {
        return JSON.stringify({
            error: '处理过程中出错: ' + e.toString()
        });
    }
}