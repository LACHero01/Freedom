// 来源: ybtv.php - 延边电视台
function main(item) {
    var id = ku9.getQuery(item.url, "id") || 'ybws';
    var playseek = ku9.getQuery(item.url, "playseek") || '';
    var starttime = ku9.getQuery(item.url, "starttime") || '';
    var endtime = ku9.getQuery(item.url, "endtime") || '';
    
    var m = {
        "ybws": "CYS",      // 延边卫视
        "ybtv1": "ybtv1",   // 延边朝鲜语综合
        "ybtv2": "ybtv2",   // 延边汉语综合
        "ybjtgb": "FM1059", // 延边交通文艺广播
        "yblygb": "FM1046", // 延边旅游广播
        "ybxwgb": "FM983"   // 延边新闻综合广播
    };
    
    var n = {
        "iybws": "cys",        // 延边卫视
        "iybtv1": "ybtv1",     // 延边朝鲜语综合
        "iybtv2": "ybtv2",     // 延边汉语综合
        "iybwyshgb": "am1206", // 延边文艺生活广播
        "iybxwzhgb": "fm1023", // 延边新闻综合广播
        "iybksgb1": "vradio",  // 延边可视广播
        "iybksgb2": "vraido2"  // 延边可视广播2
    };
    
    try {
        var url = '';
        
        if (m[id]) {
            // 直接获取直播地址
            var type = m[id].indexOf('FM') !== -1 ? 'audio' : 'video';
            url = "https://srs.iyb983.cn/" + type + "/" + m[id] + "/index.m3u8";
        } else if (n[id]) {
            // 通过HTML页面解析获取地址
            var htmlUrl = "https://www.iybtv.com/" + n[id] + "/index.html";
            var headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.iybtv.com/"
            };
            
            var htmlResponse = ku9.get(htmlUrl, JSON.stringify(headers));
            
            if (!htmlResponse) {
                return JSON.stringify({ error: "无法获取HTML页面内容" });
            }
            
            var pattern = /a:'(http.+)',\/\//;
            var match = htmlResponse.match(pattern);
            
            if (!match || !match[1]) {
                return JSON.stringify({ error: "未匹配到播放地址" });
            }
            
            url = match[1];
        } else {
            return JSON.stringify({ error: "频道ID不存在" });
        }
        
        // 处理时间范围请求（简化版，原PHP的时间切片功能较复杂）
        if (playseek || starttime) {
            return JSON.stringify({ 
                error: "酷9JS版本暂不支持时间范围播放功能，请使用直播地址",
                url: url 
            });
        }
        
        return JSON.stringify({ url: url });
        
    } catch (e) {
        return JSON.stringify({ error: "获取延边电视台播放地址失败: " + e.toString() });
    }
}