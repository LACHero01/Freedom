// 上海魔都眼频道直播源 - 酷9JS版本
// 转换自: Shanghaieye.php
// 来源: https://api.shanghaieye.com.cn/
// 注意: 该API返回上海魔都眼频道的直播地址

function main(item) {
    try {
        // API地址
        const apiUrl = "https://api.shanghaieye.com.cn/wpindex/stream/pullUrl";
        
        // 设置请求头，模拟浏览器请求
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://www.shanghaieye.com.cn/",
            "Origin": "https://www.shanghaieye.com.cn",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        };
        
        // 发送GET请求
        const response = ku9.request(apiUrl, 'GET', headers);
        
        // 检查响应
        if (!response || !response.body) {
            return JSON.stringify({
                error: "API请求失败",
                code: response ? response.code : 0,
                message: "无法获取API响应"
            });
        }
        
        // 解析JSON响应
        let jsonData;
        try {
            jsonData = JSON.parse(response.body);
        } catch (e) {
            return JSON.stringify({
                error: "JSON解析失败",
                message: e.toString(),
                raw_response: response.body.substring(0, 200) // 显示部分原始响应用于调试
            });
        }
        
        // 检查数据结构
        if (!jsonData || !jsonData.data || !jsonData.data.hlsUrl) {
            return JSON.stringify({
                error: "API返回数据格式错误",
                api_response: jsonData,
                expected_path: "data.hlsUrl"
            });
        }
        
        const m3u8Url = jsonData.data.hlsUrl;
        
        // 验证播放地址是否有效
        if (!m3u8Url || typeof m3u8Url !== 'string' || m3u8Url.trim() === '') {
            return JSON.stringify({
                error: "播放地址为空或无效",
                extracted_url: m3u8Url
            });
        }
        
        // 检查是否为有效的URL格式
        if (!m3u8Url.startsWith('http://') && !m3u8Url.startsWith('https://')) {
            return JSON.stringify({
                error: "播放地址格式错误",
                extracted_url: m3u8Url,
                note: "地址应该以http://或https://开头"
            });
        }
        
        // 返回播放地址和headers
        return JSON.stringify({
            url: m3u8Url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.shanghaieye.com.cn/",
                "Origin": "https://www.shanghaieye.com.cn"
            },
            info: {
                channel: "上海魔都眼",
                source: "上海电视台",
                format: "HLS (m3u8)",
                api_endpoint: apiUrl
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            error: "处理过程中发生未知错误",
            message: e.toString(),
            stack: e.stack
        });
    }
}

// 使用说明：
// 直接调用该脚本，无需参数
// 例如: http://yourdomain.com/shanghaieye.js