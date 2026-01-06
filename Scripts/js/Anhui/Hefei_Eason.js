// 合肥广播电视台直播源 - 酷9JS版本（优化版）
// 转换自 Anhui_Hefei.php
// 频道参数: id=1/2/3/4

function main(item) {
    // 获取频道ID
    var channelId = ku9.getQuery(item.url, "id");
    
    if (!channelId) {
        return JSON.stringify({
            error: '请提供频道ID参数',
            available_channels: {
                '1': '合肥新闻',
                '2': '合肥生活',
                '3': '合肥科创',
                '4': '合肥教育法制'
            }
        });
    }
    
    try {
        // 第一步：从网页提取source标签
        var pageUrl = 'https://app.hfbtc.cn/shows/2/' + channelId + '.html';
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://app.hfbtc.cn/"
        };
        
        var pageContent = ku9.get(pageUrl, JSON.stringify(headers));
        
        if (!pageContent) {
            return JSON.stringify({
                error: '无法获取页面内容'
            });
        }
        
        // 第二步：提取source src地址
        var pattern = /source src="(.+?)"/;
        var match = pageContent.match(pattern);
        
        if (!match || !match[1]) {
            return JSON.stringify({
                error: '无法提取M3U8地址'
            });
        }
        
        var m3u8Url = match[1];
        
        // 第三步：尝试获取M3U8内容，判断是否需要进一步处理
        var m3u8Content = ku9.get(m3u8Url, JSON.stringify(headers));
        
        if (!m3u8Content) {
            return JSON.stringify({
                error: '无法获取M3U8内容'
            });
        }
        
        // 第四步：检查是否为索引M3U8（多码率）
        var finalUrl = m3u8Url;
        
        if (m3u8Content.indexOf('#EXT-X-STREAM-INF:') !== -1) {
            // 这是索引文件，需要提取实际播放流
            var lines = m3u8Content.split('\n');
            
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                
                // 找到第一个非注释行
                if (line.length > 0 && line.charAt(0) !== '#') {
                    // 判断是否为绝对路径
                    if (line.indexOf('http://') === 0 || line.indexOf('https://') === 0) {
                        finalUrl = line;
                    } else {
                        // 相对路径，拼接基础URL
                        var baseUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf('/'));
                        finalUrl = baseUrl + '/' + line;
                    }
                    break;
                }
            }
        }
        
        return JSON.stringify({
            url: finalUrl,
            headers: headers
        });
        
    } catch (e) {
        return JSON.stringify({
            error: '处理过程中出错: ' + e.toString()
        });
    }
}