function main(item) {
    try {
        // 获取频道ID参数
        var id = ku9.getQuery(item.url, "id") || '10'; // 默认新闻频道
        
        // API地址
        var apiUrl = "http://appx.tlbts.com/mag/tv/v1/tv/tvList";
        
        // 请求头配置
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "http://appx.tlbts.com/"
        };
        
        // 发送GET请求获取频道列表
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ 
                error: "无法获取铜陵电视台频道列表",
                code: 500 
            });
        }
        
        // 解析JSON数据
        var data;
        try {
            data = JSON.parse(response);
        } catch (e) {
            return JSON.stringify({ 
                error: "API返回数据格式错误",
                code: 500,
                rawResponse: response.substring(0, 100) + "..." // 只显示前100字符
            });
        }
        
        // 检查数据结构
        if (!data || !data.list || !Array.isArray(data.list)) {
            return JSON.stringify({ 
                error: "频道列表数据格式不正确",
                code: 500,
                availableIds: "请检查API返回的数据结构"
            });
        }
        
        // 查找匹配的频道ID
        var matchedChannel = null;
        for (var i = 0; i < data.list.length; i++) {
            var channel = data.list[i];
            if (channel.id == id) { // 使用==比较，因为id可能是字符串或数字
                matchedChannel = channel;
                break;
            }
        }
        
        // 如果找不到匹配的频道
        if (!matchedChannel || !matchedChannel.link) {
            // 返回所有可用频道供参考
            var availableChannels = [];
            for (var j = 0; j < data.list.length; j++) {
                var ch = data.list[j];
                availableChannels.push({
                    id: ch.id,
                    name: ch.name || '未知频道',
                    link: ch.link || '无链接'
                });
            }
            
            return JSON.stringify({
                error: "未找到对应ID的频道",
                code: 404,
                requestedId: id,
                availableChannels: availableChannels
            });
        }
        
        // 返回播放地址
        return JSON.stringify({
            url: matchedChannel.link,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "http://appx.tlbts.com/"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            error: "获取铜陵电视台直播地址失败: " + e.toString(),
            code: 500
        });
    }
}

// 可选：添加版本信息
var version_ = "铜陵电视台直播源 v1.0";