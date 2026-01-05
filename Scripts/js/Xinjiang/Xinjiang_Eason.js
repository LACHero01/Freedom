// 新疆电视台直播源 - 酷9JS版本
// 转换自: xjtv.php (修复版)
// 频道参数: id=xjws/xjwyzh/xjhyzh等

function main(item) {
    // 频道ID映射表
    const channelMap = {
        'xjws': 1,      // 新疆卫视
        'xjwyzh': 3,    // 新疆维语新闻综合
        'xjhyzh': 4,    // 新疆哈语新闻综合
        'xjzy': 16,     // 新疆综艺
        'xjwyys': 17,   // 新疆维语影视
        'xjjjsh': 18,   // 新疆经济生活
        'xjhyzy': 19,   // 新疆哈语综艺
        'xjwyjjsh': 20, // 新疆维语经济生活
        'xjtyjk': 21,   // 新疆体育健康
        'xjxxfw': 22,   // 新疆信息服务
        'xjse': 23      // 新疆少儿频道
    };
    
    // 获取频道ID参数，默认xjws
    const id = item.id || 'xjws';
    
    // 检查频道ID是否有效
    if (!channelMap.hasOwnProperty(id)) {
        const availableChannels = Object.keys(channelMap).join(', ');
        return JSON.stringify({
            error: `频道ID '${id}' 不存在`,
            available_channels: availableChannels
        });
    }
    
    try {
        // 生成时间戳（使用整数时间戳，避免PHP中的格式问题）
        const timestamp = Math.floor(Date.now());
        
        // 生成签名
        const signString = `@#@$AXdm123%)(ds${timestamp}api/TVLiveV100/TVChannelList`;
        const sign = ku9.md5(signString);
        
        // 构建API请求URL
        const apiUrl = `https://slstapi.xjtvs.com.cn/api/TVLiveV100/TVChannelList?type=1&stamp=${timestamp}&sign=${sign}`;
        
        // 设置请求头
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": "https://www.xjtvs.com.cn/",
            "Origin": "https://www.xjtvs.com.cn"
        };
        
        // 发送API请求
        const response = ku9.request(apiUrl, 'GET', headers);
        
        // 检查响应状态
        if (!response || !response.body) {
            return JSON.stringify({error: "API请求失败"});
        }
        
        // 解析JSON响应
        let data;
        try {
            data = JSON.parse(response.body);
        } catch (e) {
            return JSON.stringify({error: "API返回数据解析失败"});
        }
        
        // 检查API返回的错误
        if (data.message && data.message === '签名不通过') {
            return JSON.stringify({
                error: "签名验证失败",
                debug: {
                    timestamp: timestamp,
                    apiUrl: apiUrl
                }
            });
        }
        
        // 检查是否有data字段
        if (!data.data || !Array.isArray(data.data)) {
            return JSON.stringify({error: "API返回数据格式错误"});
        }
        
        // 查找对应频道的播放地址
        let playUrl = null;
        const targetChannelId = channelMap[id];
        
        for (const channel of data.data) {
            if (channel.Id === targetChannelId && channel.PlayStreamUrl) {
                playUrl = channel.PlayStreamUrl;
                break;
            }
        }
        
        if (!playUrl) {
            return JSON.stringify({error: `未找到频道 '${id}' 的播放地址`});
        }
        
        // 返回播放地址
        return JSON.stringify({
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.xjtvs.com.cn/"
            }
        });
        
    } catch (e) {
        return JSON.stringify({error: "处理过程中出错: " + e.toString()});
    }
}

// 使用说明：
// 新疆卫视: http://.../xjtv.js?id=xjws
// 新疆维语新闻综合: http://.../xjtv.js?id=xjwyzh
// 新疆哈语新闻综合: http://.../xjtv.js?id=xjhyzh
// 新疆综艺: http://.../xjtv.js?id=xjzy
// 新疆维语影视: http://.../xjtv.js?id=xjwyys
// 新疆经济生活: http://.../xjtv.js?id=xjjjsh
// 新疆哈语综艺: http://.../xjtv.js?id=xjhyzy
// 新疆维语经济生活: http://.../xjtv.js?id=xjwyjjsh
// 新疆体育健康: http://.../xjtv.js?id=xjtyjk
// 新疆信息服务: http://.../xjtv.js?id=xjxxfw
// 新疆少儿频道: http://.../xjtv.js?id=xjse