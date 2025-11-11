// 来源: Shanghai_setv.php
function main(item) {
    var apiUrl = 'https://www.setv.sh.cn/static/tvshow/overview.json';
    
    try {
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://www.setv.sh.cn/",
            "Accept": "application/json, text/plain, */*"
        };
        
        // 发送GET请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ error: "无法获取上海教育电视台数据" });
        }
        
        // 解析JSON
        var data = JSON.parse(response);
        var m3u8 = data.data?.liveLink;
        
        if (!m3u8) {
            return JSON.stringify({ error: "未找到直播链接" });
        }
        
        return JSON.stringify({ url: m3u8 });
        
    } catch (e) {
        return JSON.stringify({ error: "获取播放地址失败: " + e.toString() });
    }
}