function main(item) {
    // 频道名称映射表
    const channelMap = {
        "xwzh": "新闻综合",
        "kjsh": "科教生活", 
        "masxwlb": "马鞍山新闻联播"
      
    };

    // 获取传入的参数
    const inputParam = item.id || item.channel || item.name || "xwzh";
    
    // 根据映射表获取实际的频道名称
    const channelName = channelMap[inputParam] || inputParam;

    // 生成当前时间戳
    const timestamp = new Date().getTime();
    
    // API URL
    const apiUrl = `https://maanshanxinwenwangzhan.masbcx.cn/json/channel/ds/list.json?_t=${timestamp}&appId=pc-4f11e7ed62b349ef8be0035b283a0d9f&siteId=8b233b99cc134eabb6a9c2965c038118`;
    
    try {
        // 发送请求，不自动解压gzip
        const response = ku9.request(apiUrl, "GET", null, null, true);
        
        if (response.code !== 200) {
            return { error: `请求失败，状态码: ${response.code}` };
        }
        
        // 手动处理可能的gzip压缩
        let responseBody = response.body;
        
        // 如果是gzip压缩内容，尝试解压
        if (response.headers && response.headers['content-encoding'] === 'gzip') {
            // 这里需要解压gzip，但ku9环境可能不支持zlib
            // 直接返回原始数据让调用者处理
            return {
                error: "响应为gzip压缩格式，需要解压处理",
                rawData: responseBody,
                headers: response.headers
            };
        }
        
        // 尝试解析JSON
        let data;
        try {
            data = JSON.parse(responseBody);
        } catch (parseError) {
            return { 
                error: `JSON解析失败: ${parseError.message}`,
                rawResponse: responseBody.substring(0, 100) + "..."
            };
        }
        
        // 查找频道
        let targetChannel = null;
        for (const listItem of data.list || []) {
            if (listItem.data && listItem.data.title === channelName) {
                targetChannel = listItem.data;
                break;
            }
        }
        
        if (!targetChannel) {
            return {
                error: `未找到频道: ${channelName}`,
                availableChannels: (data.list || []).map(item => ({
                    title: item.data?.title,
                    id: item.data?.id
                }))
            };
        }
        
        // 获取播放地址
        const playUrl = targetChannel.otherUrl || targetChannel.url;
        
        if (!playUrl) {
            return { 
                error: `频道 ${channelName} 没有播放地址`,
                channelInfo: {
                    title: targetChannel.title,
                    id: targetChannel.id
                }
            };
        }
        
        // 返回播放地址
        return {
            url: playUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.masbcx.cn/'
            },
            channelInfo: {
                title: targetChannel.title,
                id: targetChannel.id,
                inputParam: inputParam
            }
        };
        
    } catch (error) {
        return { 
            error: `请求失败: ${error.message}`,
            inputParam: inputParam,
            channelMap: channelMap
        };
    }
}