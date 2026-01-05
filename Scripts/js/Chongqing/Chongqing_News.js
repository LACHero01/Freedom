// 来源: chongqing_news.php
function main(item) {
    try {
        // 第一层API请求
        var apiUrl1 = "https://rmtapi.cbg.cn/list/4918/1.html?pagesize=20";
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://www.cbg.cn/"
        };
        
        var response1 = ku9.get(apiUrl1, JSON.stringify(headers));
        if (!response1) {
            return JSON.stringify({ error: "第一层API请求失败" });
        }
        
        var data1 = JSON.parse(response1);
        var androidUrl = data1.data?.lists?.[0]?.android_url;
        
        if (!androidUrl) {
            return JSON.stringify({ error: "未找到Android播放地址" });
        }
        
        // 第二层API请求
        var encodedUrl = encodeURIComponent(androidUrl);
        var apiUrl2 = "https://web.cbg.cn/live/getLiveUrl?url=" + encodedUrl;
        
        var response2 = ku9.get(apiUrl2, JSON.stringify(headers));
        if (!response2) {
            return JSON.stringify({ error: "第二层API请求失败" });
        }
        
        var data2 = JSON.parse(response2);
        var finalUrl = data2.data?.url;
        
        if (!finalUrl) {
            return JSON.stringify({ error: "未找到最终播放地址" });
        }
        
        return JSON.stringify({ url: finalUrl });
        
    } catch (e) {
        return JSON.stringify({ error: "获取重庆新闻播放地址失败: " + e.toString() });
    }
}