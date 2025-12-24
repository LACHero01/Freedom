// 齐齐哈尔电视台直播源 - 酷9JS版本
// 转换自: heilongjiang_qqhe.php
// 频道参数: id=4/6/7/8/9
// 使用说明:
// 齐齐哈尔新闻综合: http://.../heilongjiang_qqhe.js?id=4
// 齐齐哈尔经济法治: http://.../heilongjiang_qqhe.js?id=6
// 齐齐哈尔综合广播: http://.../heilongjiang_qqhe.js?id=9
// 齐齐哈尔交通广播: http://.../heilongjiang_qqhe.js?id=8
// 齐齐哈尔乡村广播: http://.../heilongjiang_qqhe.js?id=7

function main(item) {
    // 获取频道ID参数
    const id = item.id || '4'; // 默认新闻综合
    
    // 频道ID映射说明
    const channelInfo = {
        '4': '齐齐哈尔新闻综合',
        '6': '齐齐哈尔经济法治',
        '9': '齐齐哈尔综合广播',
        '8': '齐齐哈尔交通广播',
        '7': '齐齐哈尔乡村广播'
    };
    
    // 检查ID是否有效
    if (!channelInfo.hasOwnProperty(id)) {
        const availableChannels = Object.entries(channelInfo).map(([key, name]) => `${key}=${name}`).join(', ');
        return JSON.stringify({
            error: `无效的频道ID: ${id}`,
            available_channels: availableChannels,
            examples: {
                '齐齐哈尔新闻综合': 'id=4',
                '齐齐哈尔经济法治': 'id=6',
                '齐齐哈尔综合广播': 'id=9',
                '齐齐哈尔交通广播': 'id=8',
                '齐齐哈尔乡村广播': 'id=7'
            }
        });
    }
    
    try {
        // 构建API URL
        const apiUrl = `https://qqhrnews.com/addons/jianlive/api?id=${id}`;
        
        // 设置请求头
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": "https://qqhrnews.com/",
            "Origin": "https://qqhrnews.com"
        };
        
        // 发送请求
        const response = ku9.request(apiUrl, 'GET', headers);
        
        // 检查响应
        if (!response || !response.body) {
            return JSON.stringify({
                error: "API请求失败",
                channel: channelInfo[id],
                id: id
            });
        }
        
        // 解析JSON
        let jsonData;
        try {
            jsonData = JSON.parse(response.body);
        } catch (e) {
            return JSON.stringify({
                error: "JSON解析失败: " + e.toString(),
                raw_response: response.body.substring(0, 200) // 显示部分原始响应用于调试
            });
        }
        
        // 检查数据结构
        if (!jsonData || !jsonData.data || !jsonData.data.MediaUrl) {
            return JSON.stringify({
                error: "API返回数据格式错误",
                api_response: jsonData,
                channel: channelInfo[id],
                id: id
            });
        }
        
        const playUrl = jsonData.data.MediaUrl;
        
        // 检查播放地址是否为空
        if (!playUrl || playUrl.trim() === '') {
            return JSON.stringify({
                error: "播放地址为空",
                channel: channelInfo[id],
                id: id,
                api_response: jsonData
            });
        }
        
        // 返回播放地址和headers
        return JSON.stringify({
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://qqhrnews.com/",
                "Origin": "https://qqhrnews.com"
            },
            channel: channelInfo[id],
            id: id
        });
        
    } catch (e) {
        return JSON.stringify({
            error: "处理过程中出错: " + e.toString(),
            channel: channelInfo[id] || '未知频道',
            id: id
        });
    }
}