// 来源: gansu.php - 甘肃电视台（网页版）
function main(item) {
    var n = ku9.getQuery(item.url, "n") || '%E5%8D%AB%E8%A7%86'; // 默认甘肃卫视
    
    var apiUrl = 'https://www.gstv.com.cn/zxc.jhtml';
    
    try {
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
            "Referer": "https://www.gstv.com.cn/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取甘肃电视台页面数据" });
        }
        
        // 使用正则匹配播放地址
        var pattern = new RegExp("data-url='(.+?)'>.*?" + n);
        var match = response.match(pattern);
        
        if (!match || !match[1]) {
            return JSON.stringify({ error: "未找到频道 " + decodeURIComponent(n) + " 的播放地址" });
        }
        
        var playUrl = match[1].replace('hls', 'liveout');
        
        return JSON.stringify({ url: playUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取甘肃电视台播放地址失败: " + e.toString() });
    }
}