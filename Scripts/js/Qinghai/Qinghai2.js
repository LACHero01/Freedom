// 来源: qinghai.php - 青海电视台（简化版）
function main(item) {
    var id = ku9.getQuery(item.url, "id") || 'qhws';
    
    var n = {
        "qhws": ["786181204964564992"], // 青海卫视
        "qhjs": ["786227316454875136"], // 青海经视
        "qhds": ["786227009616371712"]  // 青海都市
    };
    
    var channelId = n[id];
    if (!channelId) {
        return JSON.stringify({ error: "不支持的频道ID: " + id });
    }
    
    var apiUrl = "https://mapi.qhbtv.com.cn/cloudlive-manage-mapi/api/topic/detail?preview=&id=" + 
                 channelId[0] + "&app_secret=32a2c3b4f1b52c58119457d44acdcd49&tenant_id=0&company_id=1075&lang_type=zh";
    
    try {
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://mapi.qhbtv.com.cn/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取青海电视台数据" });
        }
        
        var data = JSON.parse(response);
        var playUrl = data.topic_camera?.[0]?.streams?.[0]?.hls;
        
        if (!playUrl) {
            return JSON.stringify({ error: "未找到播放地址" });
        }
        
        return JSON.stringify({ url: playUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取青海电视台播放地址失败: " + e.toString() });
    }
}