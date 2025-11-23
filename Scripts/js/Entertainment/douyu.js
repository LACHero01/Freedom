// 转换自: douyu.php
function main(item) {
    var id = item.id || '9999';
    
    try {
        var apiUrl = 'https://wxapp.douyucdn.cn/api/nc/stream/roomPlayer';
        var postData = 'room_id=' + id + '&big_ct=cph-androidmpro&did=10000000000000000000000000001501&mt=2&rate=0';
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Content-Type": "application/x-www-form-urlencoded"
        };
        
        var response = ku9.request(
            apiUrl,
            'POST',
            JSON.stringify(headers),
            postData
        );
        
        if (!response || !response.body) {
            return JSON.stringify({ error: "无法获取斗鱼直播数据" });
        }
        
        var jsonData = JSON.parse(response.body);
        var mediaUrl = jsonData.data.live_url;
        
        if (!mediaUrl) {
            return JSON.stringify({ error: "未找到直播地址" });
        }
        
        return JSON.stringify({ 
            url: mediaUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.douyu.com/"
            }
        });
        
    } catch (e) {
        return JSON.stringify({ error: "获取斗鱼直播地址失败: " + e.toString() });
    }
}