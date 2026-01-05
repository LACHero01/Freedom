function main(item) {
    // 获取URL参数，默认值为'czds'
    var id = ku9.getQuery(item.url, "id") || 'czds';
    
    // 频道映射表
    var n = {
        'czzh': 1, //常州综合
        'czds': 2, //常州都市
        'czsh': 3, //常州生活
        'czgg': 4  //常州公共
    };
    
    // 获取对应的频道索引
    var channelIndex = n[id] || n['czds'];
    
    // API地址
    var apiUrl = "https://kcz.cztv.tv/api/v1/channel/tv";
    
    try {
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://kcz.cztv.tv/",
            "Accept": "application/json, text/plain, */*"
        };
        
        // 发送GET请求获取API数据
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ 
                error: "API请求失败，无法获取频道数据" 
            });
        }
        
        // 解析JSON响应
        var data;
        try {
            data = JSON.parse(response);
        } catch (parseError) {
            return JSON.stringify({ 
                error: "JSON解析失败: " + parseError.toString() 
            });
        }
        
        // 检查数据结构
        if (!data || !data.data || !data.data.data || !Array.isArray(data.data.data)) {
            return JSON.stringify({ 
                error: "API返回数据格式不正确" 
            });
        }
        
        var channelList = data.data.data;
        
        // 获取对应的频道流地址（注意索引从0开始，所以需要减1）
        var streamUrl = channelList[channelIndex - 1]?.stream_url;
        
        if (!streamUrl) {
            return JSON.stringify({ 
                error: "未找到频道 " + id + " 的播放地址" 
            });
        }
        
        // 返回播放地址 - 对应原PHP的header("Location: " . $json->data->data[$n[$id]-1]->stream_url)
        return JSON.stringify({ 
            url: streamUrl 
        });
        
    } catch (e) {
        // 错误处理
        return JSON.stringify({ 
            error: "获取播放地址失败: " + e.toString() 
        });
    }
}