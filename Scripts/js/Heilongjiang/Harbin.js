// 哈尔滨电视台直播源 - 酷9JS版本
// 转换自: heilongjiang_harbin.php
// 使用说明：
// xxx.js?id=xwzh  //新闻综合频道
// xxx.js?id=yspd  //影视频道
// xxx.js?id=shpd  //生活频道
function main(item) {
    try {
        // 频道映射表
        var channels = {
            'xwzh': '3', // 新闻综合频道
            'yspd': '5', // 影视频道
            'shpd': '7'  // 生活频道
        };
        
        // 获取频道代码参数
        var channel = ku9.getQuery(item.url, "id") || '';
        
        // 验证参数
        if (!channel) {
            return JSON.stringify({
                code: 400,
                message: '请指定频道代码',
                available_channels: {
                    'xwzh': '新闻综合频道',
                    'yspd': '影视频道',
                    'shpd': '生活频道'
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
                    'xwzh': '新闻综合频道',
                    'yspd': '影视频道',
                    'shpd': '生活频道'
                }
            });
        }
        
        // 获取频道ID并构建API URL
        var channelId = channels[channel];
        var apiUrl = "https://www.hrbtv.net/m2o/channel/channel_info.php?id=" + channelId;
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.hrbtv.net/",
            "Origin": "https://www.hrbtv.net"
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
        
        // 检查数据结构
        if (!Array.isArray(data) || data.length === 0) {
            return JSON.stringify({
                code: 500,
                message: 'API返回数据格式错误，预期为数组',
                raw_data: data
            });
        }
        
        var info = data[0];
        var m3u8 = '';
        
        // 优先从channel_stream数组中查找m3u8地址
        if (info.channel_stream && Array.isArray(info.channel_stream)) {
            for (var i = 0; i < info.channel_stream.length; i++) {
                var stream = info.channel_stream[i];
                if (stream.m3u8 && stream.m3u8.trim() !== '') {
                    m3u8 = stream.m3u8;
                    break;
                }
            }
        }
        
        // 如果未找到，尝试从根级别获取
        if (!m3u8 && info.m3u8 && info.m3u8.trim() !== '') {
            m3u8 = info.m3u8;
        }
        
        // 检查是否找到有效的m3u8地址
        if (!m3u8) {
            return JSON.stringify({
                code: 404,
                message: '找不到有效的m3u8播放地址',
                channel: channel,
                api_data: info
            });
        }
        
        // 确保URL是有效的（以http://或https://开头）
        if (!m3u8.startsWith('http://') && !m3u8.startsWith('https://')) {
            // 如果是相对路径，尝试添加基础URL
            if (m3u8.startsWith('/')) {
                m3u8 = 'https://www.hrbtv.net' + m3u8;
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
                "Referer": "https://www.hrbtv.net/",
                "Origin": "https://www.hrbtv.net"
            },
            info: {
                channel_id: channelId,
                channel_code: channel,
                source: "哈尔滨电视台",
                api_endpoint: apiUrl
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中发生未知错误',
            error: e.toString(),
            stack: e.stack
        });
    }
}

// 获取频道名称
function getChannelName(channelCode) {
    var nameMap = {
        'xwzh': '新闻综合频道',
        'yspd': '影视频道',
        'shpd': '生活频道'
    };
    return nameMap[channelCode] || '未知频道';
}

// 使用说明示例：
// https://yourdomain.com/harbin.js?id=xwzh
// https://yourdomain.com/harbin.js?id=yspd
// https://yourdomain.com/harbin.js?id=shpd