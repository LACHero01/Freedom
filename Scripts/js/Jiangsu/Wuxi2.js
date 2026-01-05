// 来源: wuxi2.php
function main(item) {
    var id = ku9.getQuery(item.url, "id") || "2";
    
    var apiUrl = "https://v2.thmz.com/m2o/channel/channel_info.php?id=" + id;
    
    try {
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://v2.thmz.com/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取无锡明珠宽频数据" });
        }
        
        var data = JSON.parse(response);
        var m3u8Url = data[0]?.m3u8;
        
        if (!m3u8Url) {
            return JSON.stringify({ error: "未找到播放地址" });
        }
        
        // 添加https前缀
        var playUrl = m3u8Url.startsWith('https:') ? m3u8Url : 'https:' + m3u8Url;
        
        return JSON.stringify({ url: playUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取无锡明珠宽频播放地址失败: " + e.toString() });
    }
}