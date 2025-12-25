// 山西阳泉直播源 - 酷9JS版本
// 转换自: Shanxi_yqxl.php
// 使用说明：
// xxx.js?id=yqxwzh  //新闻综合频道
// xxx.js?id=yqkj    //科技频道
function main(item) {
    try {
        // 频道映射表
        var channels = {
            'yqxwzh': 10, // 新闻综合频道
            'yqkj': 11     // 科技频道
        };
        
        // 获取频道代码参数，默认yqxwzh
        var channel = ku9.getQuery(item.url, "id") || 'yqxwzh';
        
        // 验证参数
        if (!channel) {
            return JSON.stringify({
                code: 400,
                message: '请指定频道代码',
                available_channels: {
                    'yqxwzh': '新闻综合频道',
                    'yqkj': '科技频道'
                }
            });
        }
        
        // 检查频道代码是否存在
        if (!channels.hasOwnProperty(channel)) {
            return JSON.stringify({
                code: 400,
                message: '无效的频道代码',
                requested_channel: channel,
                available_channels: {
                    'yqxwzh': '新闻综合频道',
                    'yqkj': '科技频道'
                }
            });
        }
        
        // 获取频道ID并构建API URL
        var channelId = channels[channel];
        var apiUrl = "https://mapi.yqrtv.com/api/v1/channel.php?&channel_id=" + channelId;
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://mapi.yqrtv.com/",
            "Origin": "https://mapi.yqrtv.com"
        };
        
        // 发送GET请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        // 检查响应
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取频道信息',
                channel: channel,
                api_url: apiUrl
            });
        }
        
        // 解析JSON数据
        var data;
        try {
            data = JSON.parse(response);
        } catch (e) {
            return JSON.stringify({
                code: 500,
                message: '解析JSON数据失败',
                error: e.toString(),
                raw_response: response.substring(0, 200)
            });
        }
        
        // 检查数据结构（预期是数组，至少有一个元素）
        if (!Array.isArray(data) || data.length === 0) {
            return JSON.stringify({
                code: 500,
                message: 'API返回数据格式错误，预期为非空数组',
                raw_data: data
            });
        }
        
        // 获取第一个元素的m3u8字段
        var m3u8 = data[0].m3u8;
        
        // 检查是否找到有效的m3u8地址
        if (!m3u8 || m3u8.trim() === '') {
            return JSON.stringify({
                code: 404,
                message: '找不到有效的m3u8播放地址',
                channel: channel,
                channel_id: channelId,
                api_data: data[0]
            });
        }
        
        // 确保URL是有效的（以http://或https://开头）
        if (!m3u8.startsWith('http://') && !m3u8.startsWith('https://')) {
            // 如果是相对路径，尝试添加基础URL
            if (m3u8.startsWith('/')) {
                m3u8 = 'https://mapi.yqrtv.com' + m3u8;
            } else {
                return JSON.stringify({
                    code: 500,
                    message: '播放地址格式错误',
                    extracted_url: m3u8,
                    note: '地址应该以http://或https://开头'
                });
            }
        }
        
        // 返回播放地址和headers
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: getChannelName(channel),
            url: m3u8,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://mapi.yqrtv.com/",
                "Origin": "https://mapi.yqrtv.com"
            },
            info: {
                channel_id: channelId,
                channel_code: channel,
                source: "山西阳泉电视台",
                api_endpoint: apiUrl,
                extraction_method: "直接提取数组第一个元素的m3u8字段"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中发生错误: ' + e.toString(),
            stack: e.stack
        });
    }
}

// 获取频道名称
function getChannelName(channelCode) {
    var nameMap = {
        'yqxwzh': '新闻综合频道',
        'yqkj': '科技频道'
    };
    return nameMap[channelCode] || '未知频道';
}

// 使用说明示例：
// https://yourdomain.com/Shanxi_yqxl.js?id=yqxwzh
// https://yourdomain.com/Shanxi_yqxl.js?id=yqkj