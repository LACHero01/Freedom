// 来源: xiamen.php - 厦门电视台
function main(item) {
    var id = ku9.getQuery(item.url, "id") || '84';
    
    // 频道映射说明
    var channelInfo = {
        '84': '厦门卫视',
        '16': '厦视一套', 
        '17': '厦视二套',
        '52': '厦门电视台移动电视'
    };
    
    var apiUrl = "https://mapi1.kxm.xmtv.cn/api/v1/channel.php?channel_id=" + id;
    
    try {
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://seexm2024.kxm.xmtv.cn/",
            "Accept": "application/json, text/plain, */*"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取厦门电视台API数据" });
        }
        
        var data = JSON.parse(response);
        var m3u8Url = data[0]?.channel_stream?.[0]?.m3u8;
        
        if (!m3u8Url) {
            return JSON.stringify({ 
                error: "未找到频道 " + id + " 的播放地址",
                channel_name: channelInfo[id] || "未知频道"
            });
        }
        
        // 返回播放地址
        return JSON.stringify({ 
            url: m3u8Url,
            headers: headers
        });
        
    } catch (e) {
        return JSON.stringify({ error: "获取厦门电视台播放地址失败: " + e.toString() });
    }
}