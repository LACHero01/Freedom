// 盐城电视台直播源 - 酷9JS版本
// 转换自: yancheng.php
// 使用说明：
// xxx.js?id=24  //盐城新闻综合
// xxx.js?id=25  //盐城法制生活  
// xxx.js?id=26  //盐城公共
function main(item) {
    try {
        // 获取频道ID参数
        var channelId = ku9.getQuery(item.url, "id");
        
        // 验证参数
        if (!channelId) {
            return JSON.stringify({
                code: 400,
                message: '请指定频道ID',
                available_channels: {
                    '24': '盐城新闻综合',
                    '25': '盐城法制生活',
                    '26': '盐城公共'
                }
            });
        }
        
        // 检查频道ID是否有效
        var validIds = ['24', '25', '26'];
        if (validIds.indexOf(channelId) === -1) {
            return JSON.stringify({
                code: 400,
                message: '无效的频道ID',
                requested_id: channelId,
                available_channels: {
                    '24': '盐城新闻综合',
                    '25': '盐城法制生活',
                    '26': '盐城公共'
                }
            });
        }
        
        // 构建API URL
        var apiUrl = "https://mapiyc.0515yc.cn/api/v1/channel.php?channel_id=" + channelId;
        
        // 设置请求头（需要Referer）
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "http://www.0515yc.cn/",
            "Origin": "http://www.0515yc.cn"
        };
        
        // 第一步：获取m3u8地址
        var apiResponse = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!apiResponse) {
            return JSON.stringify({
                code: 500,
                message: '无法获取API数据',
                channel_id: channelId,
                api_url: apiUrl
            });
        }
        
        // 解析JSON数据
        var data;
        try {
            data = JSON.parse(apiResponse);
        } catch (e) {
            return JSON.stringify({
                code: 500,
                message: '解析JSON数据失败',
                error: e.toString(),
                raw_response: apiResponse.substring(0, 200)
            });
        }
        
        // 检查数据结构
        if (!Array.isArray(data) || data.length === 0 || !data[0].m3u8) {
            return JSON.stringify({
                code: 500,
                message: 'API返回数据格式错误或缺少m3u8字段',
                raw_data: data
            });
        }
        
        var m3u8 = data[0].m3u8;
        
        // 检查是否找到有效的m3u8地址
        if (!m3u8 || m3u8.trim() === '') {
            return JSON.stringify({
                code: 404,
                message: '找不到有效的m3u8播放地址',
                channel_id: channelId,
                api_data: data[0]
            });
        }
        
        // 如果m3u8地址是相对路径，转换为绝对路径
        if (!m3u8.startsWith('http://') && !m3u8.startsWith('https://')) {
            if (m3u8.startsWith('/')) {
                m3u8 = 'https://mapiyc.0515yc.cn' + m3u8;
            } else {
                // 获取基础URL
                var baseUrl = 'https://mapiyc.0515yc.cn';
                var lastSlashIndex = baseUrl.lastIndexOf('/');
                if (lastSlashIndex > 8) { // 确保不是协议部分
                    baseUrl = baseUrl.substring(0, lastSlashIndex + 1);
                }
                m3u8 = baseUrl + m3u8;
            }
        }
        
        // 第二步：检查m3u8文件内容，如果是m3u8清单，直接返回地址
        // 如果是实际播放地址（包含.m3u8扩展名），直接返回
        if (m3u8.toLowerCase().indexOf('.m3u8') !== -1) {
            // 直接返回m3u8地址
            return JSON.stringify({
                code: 200,
                message: '获取成功',
                channel: getChannelName(channelId),
                url: m3u8,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "http://www.0515yc.cn/",
                    "Origin": "http://www.0515yc.cn"
                },
                info: {
                    channel_id: channelId,
                    source: "盐城电视台",
                    m3u8_type: "播放列表",
                    note: "直接返回m3u8播放地址，播放器将自行处理TS文件"
                }
            });
        } else {
            // 如果返回的不是m3u8地址，可能是重定向或其他格式
            // 我们尝试获取这个地址的内容
            var m3u8Response = ku9.get(m3u8, JSON.stringify(headers));
            
            if (!m3u8Response) {
                return JSON.stringify({
                    code: 500,
                    message: '无法获取m3u8文件内容',
                    m3u8_url: m3u8
                });
            }
            
            // 检查是否是m3u8文件（以#EXTM3U开头）
            if (m3u8Response.trim().startsWith('#EXTM3U')) {
                // 这是m3u8文件内容，我们需要提取其中的实际播放地址
                var lines = m3u8Response.split('\n');
                var playUrl = null;
                
                // 查找不以#开头的行（即实际的播放地址）
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line && !line.startsWith('#') && 
                        (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('/'))) {
                        playUrl = line;
                        break;
                    }
                }
                
                if (playUrl) {
                    // 如果是相对路径，转换为绝对路径
                    if (playUrl.startsWith('/')) {
                        var domain = m3u8.match(/^(https?:\/\/[^\/]+)/);
                        if (domain && domain[1]) {
                            playUrl = domain[1] + playUrl;
                        } else {
                            playUrl = 'https://mapiyc.0515yc.cn' + playUrl;
                        }
                    }
                    
                    return JSON.stringify({
                        code: 200,
                        message: '获取成功',
                        channel: getChannelName(channelId),
                        url: playUrl,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            "Referer": "http://www.0515yc.cn/",
                            "Origin": "http://www.0515yc.cn"
                        },
                        info: {
                            channel_id: channelId,
                            source: "盐城电视台",
                            m3u8_type: "嵌套播放列表",
                            note: "从m3u8文件中提取的实际播放地址"
                        }
                    });
                }
            }
            
            // 如果以上都不行，直接返回原始m3u8地址
            return JSON.stringify({
                code: 200,
                message: '获取成功（返回原始地址）',
                channel: getChannelName(channelId),
                url: m3u8,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer": "http://www.0515yc.cn/",
                    "Origin": "http://www.0515yc.cn"
                },
                info: {
                    channel_id: channelId,
                    source: "盐城电视台",
                    note: "返回API提供的原始地址"
                }
            });
        }
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中发生错误: ' + e.toString(),
            stack: e.stack
        });
    }
}

// 获取频道名称
function getChannelName(channelId) {
    var nameMap = {
        '24': '盐城新闻综合',
        '25': '盐城法制生活',
        '26': '盐城公共'
    };
    return nameMap[channelId] || '未知频道(ID: ' + channelId + ')';
}

// 使用说明示例：
// https://yourdomain.com/yancheng.js?id=24
// https://yourdomain.com/yancheng.js?id=25
// https://yourdomain.com/yancheng.js?id=26