// 转换自: yy.php
function main(item) {
    var id = item.id || '1354210357';
    
    try {
        // 第一步：获取HLS地址
        var firstUrl = 'http://interface.yy.com/hls/new/get/' + id + '/' + id + '/1200?source=wapyy&callback=jsonp3';
        
        var firstHeaders = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "http://www.yy.com/"
        };
        
        var firstResponse = ku9.get(firstUrl, JSON.stringify(firstHeaders));
        
        if (!firstResponse) {
            return JSON.stringify({ error: "无法获取YY直播数据" });
        }
        
        // 正则匹配HLS地址
        var hlsRegex = /"hls":"(.*?)"/;
        var hlsMatch = firstResponse.match(hlsRegex);
        
        if (!hlsMatch || !hlsMatch[1]) {
            return JSON.stringify({ error: "未找到有效的HLS地址" });
        }
        
        var hlsUrl = hlsMatch[1].replace(/\\\//g, '/');
        
        // 第二步：获取最终跳转地址
        var secondHeaders = {
            "Referer": "https://wap.yy.com/",
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        };
        
        // 使用GET请求获取最终地址（酷9JS会自动处理跳转）
        var finalResponse = ku9.get(hlsUrl, JSON.stringify(secondHeaders));
        
        // 由于酷9JS会自动跟随跳转，我们直接返回请求的URL
        // 如果需要手动处理跳转，可能需要更复杂的逻辑
        
        return JSON.stringify({ 
            url: hlsUrl,
            headers: {
                "Referer": "https://wap.yy.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });
        
    } catch (e) {
        return JSON.stringify({ error: "获取YY直播地址失败: " + e.toString() });
    }
}