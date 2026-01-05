// 来源: btws.php
function main(item) {
    try {
        // 第一步：获取直播信号ID
        var pageUrl = 'https://www.btzx.com.cn/2024new/new_zhibo/index.shtml';
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://www.btzx.com.cn/"
        };
        
        var pageResponse = ku9.get(pageUrl, JSON.stringify(headers));
        
        if (!pageResponse) {
            return JSON.stringify({ error: "无法获取包头新闻网页面" });
        }
        
        // 使用正则提取信号ID
        var pattern1 = /zbXinhao = "([^"]+)"/;
        var match1 = pageResponse.match(pattern1);
        
        if (!match1 || !match1[1]) {
            return JSON.stringify({ error: "未找到直播信号ID" });
        }
        
        var signalId = match1[1];
        
        // 第二步：获取播放地址
        var apiUrl = 'https://api.btzx.com.cn/mobileinf/rest/cctv/videolivelist/dayWeb?json=%7B%27id%27:%27' + signalId + '%27%7D';
        
        var apiResponse = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!apiResponse) {
            return JSON.stringify({ error: "无法获取API数据" });
        }
        
        // 使用正则提取播放地址
        var pattern2 = /"url(hd)*":"([^"]+)"/;
        var match2 = apiResponse.match(pattern2);
        
        if (!match2 || !match2[2]) {
            return JSON.stringify({ error: "未找到播放地址" });
        }
        
        var playUrl = match2[2];
        
        return JSON.stringify({ url: playUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取兵团卫视播放地址失败: " + e.toString() });
    }
}