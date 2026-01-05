// 转换自: Beijing_daxing.php
function main(item) {
    var p = item.p || '2'; // 0=rtmp, 1=flv, 2=hls
    
    try {
        var apiUrl = 'https://euvp.icbtlive.com/player_api/api/live/iframe-enter';
        var postData = '{"id":"r83ee4"}';
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "Origin": "https://euvp.icbtlive.com",
            "Referer": "https://euvp.icbtlive.com/"
        };
        
        var response = ku9.request(
            apiUrl,
            'POST',
            JSON.stringify(headers),
            postData
        );
        
        if (!response || !response.body) {
            return JSON.stringify({ error: "无法获取北京大兴直播数据" });
        }
        
        var jsonData;
        try {
            jsonData = JSON.parse(response.body);
        } catch (e) {
            return JSON.stringify({ error: "API返回数据解析失败" });
        }
        
        // 检查数据结构
        if (!jsonData.data || 
            !jsonData.data.channels || 
            jsonData.data.channels.length === 0 ||
            !jsonData.data.channels[0].streams ||
            jsonData.data.channels[0].streams.length === 0 ||
            !jsonData.data.channels[0].streams[0].play_url) {
            return JSON.stringify({ error: "直播流数据格式错误" });
        }
        
        var playUrlObj = jsonData.data.channels[0].streams[0].play_url[p];
        if (!playUrlObj || !playUrlObj.addr) {
            return JSON.stringify({ 
                error: "未找到对应协议的播放地址",
                available_protocols: Object.keys(jsonData.data.channels[0].streams[0].play_url)
            });
        }
        
        var playUrl = playUrlObj.addr;
        
        return JSON.stringify({ 
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://euvp.icbtlive.com/",
                "Origin": "https://euvp.icbtlive.com"
            }
        });
        
    } catch (e) {
        return JSON.stringify({ error: "获取北京大兴直播地址失败: " + e.toString() });
    }
}