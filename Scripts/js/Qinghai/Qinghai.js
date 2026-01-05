// 来源: qhtv.php - 青海电视台
function main(item) {
    var id = ku9.getQuery(item.url, "id") || 'qhws';
    
    var n = {
        "qhws": ["786181204964564992", "32a2c3b4f1b52c58119457d44acdcd49", 1075], // 青海卫视
        "qhjs": ["786227316454875136", "32a2c3b4f1b52c58119457d44acdcd49", 1075], // 青海经视
        "qhds": ["786227009616371712", "32a2c3b4f1b52c58119457d44acdcd49", 1075], // 青海都市
        "adws": ["824587377543962624", "069486993db4acc22c846557c8880d9a", 1077]  // 安多卫视
    };
    
    var channelInfo = n[id];
    if (!channelInfo) {
        return JSON.stringify({ error: "不支持的频道ID: " + id });
    }
    
    var apiUrl = "https://mapi.qhbtv.com.cn/cloudlive-manage-mapi/api/topic/detail?preview=&id=" + 
                 channelInfo[0] + "&app_secret=" + channelInfo[1] + "&tenant_id=0&company_id=" + 
                 channelInfo[2] + "&lang_type=zh";
    
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