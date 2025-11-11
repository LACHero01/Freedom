function main(item) {
    // 获取URL参数，默认值为'hnws'
    var id = ku9.getQuery(item.url, "id") || 'hnws';
    
    // 频道映射表
    var ids = {
        "hnws": "STHaiNan_channel_lywsgq", //海南卫视
        "ssws": "STHaiNan_channel_ssws",   //三沙卫视
        "xwpd": "STHaiNan_channel_xwpd",   //海南新闻频道
        "wlpd": "wlpd",                    //海南文旅频道
        "jjpd": "jjpd",                    //海南自贸频道
        "ggpd": "ggpd",                    //海南公共频道
        "sepd": "sepd"                     //海南少儿频道
    };
    
    // 获取对应的频道代码
    var channelCode = ids[id] || ids['hnws'];
    
    // 构建API请求URL
    var apiUrl = "http://ps.hnntv.cn/ps/livePlayUrl?appCode=&token=&channelCode=" + channelCode;
    
    try {
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "http://ps.hnntv.cn/",
            "Accept": "application/json, text/plain, */*"
        };
        
        // 发送GET请求获取API数据
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ 
                error: "API请求失败，无法获取播放地址" 
            });
        }
        
        // 使用正则表达式提取m3u8地址 - 与原PHP脚本相同的正则
        var pattern = /"url":"(.*?)"/i;
        var match = response.match(pattern);
        
        if (!match || !match[1]) {
            return JSON.stringify({ 
                error: "无法从API响应中提取播放地址" 
            });
        }
        
        var m3u8Url = match[1];
        
        // 返回播放地址 - 对应原PHP的header('Location:'.$m3u8[1])
        return JSON.stringify({ 
            url: m3u8Url 
        });
        
    } catch (e) {
        // 错误处理
        return JSON.stringify({ 
            error: "获取播放地址失败: " + e.toString() 
        });
    }
}