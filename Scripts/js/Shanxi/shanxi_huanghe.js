// 来源: shanxi_huanghe.php - 山西黄河电视台
function main(item) {
    var id = ku9.getQuery(item.url, "id") || 'q8RVWgs';
    
    var apiUrl = 'https://dyhhplus.sxrtv.com/apiv4.5/api/m3u8_notoken?channelid=' + id + '&site=53';
    
    try {
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://dyhhplus.sxrtv.com/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取山西电视台数据" });
        }
        
        var data = JSON.parse(response);
        var playUrl = data.data?.address;
        
        if (!playUrl) {
            return JSON.stringify({ error: "未找到播放地址" });
        }
        
        return JSON.stringify({ url: playUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取山西黄河电视台播放地址失败: " + e.toString() });
    }
}