// 来源: anhui_anqing.php - 安徽安庆电视台
function main(item) {
    var id = ku9.getQuery(item.url, "id") || '61005770c525480db84eed456cd093c1';
    
    var apiUrl = "https://www.zsaqnews.cn/rftapi/api/rft/getLiveChannelInfo?platform=h5&channelId=" + id + "&siteId=&runType=test";
    
    try {
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://www.zsaqnews.cn/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取安庆电视台数据" });
        }
        
        var data = JSON.parse(response);
        var playUrl = data.url;
        
        if (!playUrl) {
            return JSON.stringify({ error: "未找到播放地址" });
        }
        
        return JSON.stringify({ url: playUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取安庆电视台播放地址失败: " + e.toString() });
    }
}