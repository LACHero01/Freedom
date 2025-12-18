// 安徽电视台直播源 - 酷9JS版本（简化版，不支持m3u8重写和缓存）
// 来源: anhui.php
// 频道参数: id=47(安徽卫视), id=71(经济生活), id=73(综艺体育), id=72(影视频道)
//           id=50(安徽公共), id=51(农业科教), id=70(安徽国际), id=68(移动电视)

function main(item) {
    // 频道映射（直接使用数字ID）
    var channelId = ku9.getQuery(item.url, "id") || "47";
    
    try {
        // 1. 获取频道列表
        var apiUrl = "https://mapi.ahtv.cn/api/v1/channel.php?is_audio=0&category_id=1%2C2";
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "Referer": "https://www.ahtv.cn/",
            "Accept": "application/json, text/plain, */*"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取频道列表'
            });
        }
        
        // 2. 解析JSON响应，查找对应频道的m3u8地址
        var jsonData;
        try {
            jsonData = JSON.parse(response);
        } catch(e) {
            return JSON.stringify({
                code: 500,
                message: '频道列表数据解析失败: ' + e.toString(),
                raw_response: response.substring(0, 200)
            });
        }
        
        // 3. 查找目标频道
        var targetChannel = null;
        if (Array.isArray(jsonData)) {
            for (var i = 0; i < jsonData.length; i++) {
                if (jsonData[i].id == channelId) {
                    targetChannel = jsonData[i];
                    break;
                }
            }
        }
        
        if (!targetChannel || !targetChannel.m3u8) {
            return JSON.stringify({
                code: 404,
                message: '未找到对应频道的播放地址',
                channel_id: channelId,
                available_channels: getAvailableChannels(jsonData)
            });
        }
        
        var m3u8Url = targetChannel.m3u8;
        
        // 4. 获取实际的m3u8地址（处理可能的多码率m3u8）
        var m3u8Response = ku9.get(m3u8Url, JSON.stringify(headers));
        
        if (!m3u8Response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取m3u8文件',
                m3u8_url: m3u8Url
            });
        }
        
        var finalM3u8Url = m3u8Url;
        
        // 5. 检查是否为多码率m3u8（包含#EXT-X-STREAM-INF）
        if (m3u8Response.indexOf('#EXT-X-STREAM-INF:') !== -1) {
            // 提取第一个非注释行作为播放地址
            var lines = m3u8Response.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line && !line.startsWith('#')) {
                    // 处理相对路径
                    if (line.startsWith('http')) {
                        finalM3u8Url = line;
                    } else if (line.startsWith('/')) {
                        var baseUrl = m3u8Url.substring(0, m3u8Url.indexOf('/', 8));
                        finalM3u8Url = baseUrl + line;
                    } else {
                        var basePath = m3u8Url.substring(0, m3u8Url.lastIndexOf('/') + 1);
                        finalM3u8Url = basePath + line;
                    }
                    break;
                }
            }
        }
        
        // 6. 返回结果
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: targetChannel.name || ('频道' + channelId),
            url: finalM3u8Url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.ahtv.cn/"
            }
        });
        
    } catch(e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// 获取可用的频道列表
function getAvailableChannels(channelList) {
    var result = {};
    if (Array.isArray(channelList)) {
        for (var i = 0; i < Math.min(channelList.length, 10); i++) {
            var channel = channelList[i];
            if (channel.id && channel.name) {
                result[channel.id] = channel.name;
            }
        }
    }
    return result;
}