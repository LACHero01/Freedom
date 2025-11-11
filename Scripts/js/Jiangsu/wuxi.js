// 来源: wuxi.php
function main(item) {
    var id = ku9.getQuery(item.url, "id") || 'wxtv1';
    
    var n = {
        'wxtv1': 4,  // 无锡新闻综合
        'wxtv2': 8,  // 无锡娱乐
        'wxtv3': 9,  // 无锡都市资讯
        'wxtv4': 10, // 无锡生活
        'wxtv5': 11  // 无锡经济
    };
    
    var channelId = n[id] || n['wxtv1'];
    var apiUrl = 'http://bb-mapi.wifiwx.com/api/v1/channel.php?channel_id=' + channelId;
    
    try {
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "http://bb-mapi.wifiwx.com/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取无锡电视台数据" });
        }
        
        var data = JSON.parse(response);
        var playUrl = data[0]?.m3u8;
        
        if (!playUrl) {
            return JSON.stringify({ error: "未找到播放地址" });
        }
        
        return JSON.stringify({ url: playUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取无锡电视台播放地址失败: " + e.toString() });
    }
}