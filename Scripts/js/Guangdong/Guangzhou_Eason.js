// 广州电视台直播源 - 酷9JS版本
// 转换自 Guangdong_Guangzhou2.php
// 频道参数: id=zh/xw/fz/ngds

function main(item) {
    // 获取频道ID，默认zh（综合频道）
    var channelId = ku9.getQuery(item.url, "id") || 'zh';
    
    // 频道映射表（使用完整的ID字符串）
    var channelMap = {
        'zh': '1375684745699328',    // 综合频道
        'xw': '1375684808818688',    // 新闻频道
        'fz': '1375684882210816',    // 法治频道
        'ngds': '1375684847116288'   // 4K南国都市频道
    };
    
    // 检查频道是否存在
    if (!channelMap.hasOwnProperty(channelId)) {
        return JSON.stringify({
            error: '频道不存在',
            available_channels: {
                'zh': '综合频道',
                'xw': '新闻频道',
                'fz': '法治频道',
                'ngds': '4K南国都市频道'
            }
        });
    }
    
    var targetChannelId = channelMap[channelId];
    
    try {
        // API地址
        var apiUrl = 'https://gzbn.gztv.com:7443/plus-cloud-manage-app/liveChannel/queryLiveChannelList?type=1';
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json"
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
        
        // 遍历查找匹配的频道ID
        var playUrl = null;
        for (var i = 0; i < result.data.length; i++) {
            // 注意：这里比较的是字符串ID，不是stationNumber
            if (result.data[i].id == targetChannelId) {
                playUrl = result.data[i].httpUrl;
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