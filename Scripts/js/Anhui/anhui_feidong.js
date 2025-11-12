// 肥东电视台直播源 - 酷9JS版本
// 转换自 anhui_feidong.php
// 频道参数: id=752(肥东新闻综合), id=753(肥东经济生活)
function main(item) {
    // 获取频道ID
    var id = ku9.getQuery(item.url, "id") || '752';
    
    try {
        var targetUrl = "http://wxfx.feidongtv.com/mag/livevideo/v1/video/wapVideoView?id=" + id;
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": "http://wxfx.feidongtv.com/"
        };
        
        // 发送请求获取页面内容
        var response = ku9.get(targetUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取页面内容'
            });
        }
        
        // 使用正则表达式匹配视频地址
        // 原PHP正则: /video .+?src="(.+?)"/
        var pattern = /video[^>]+src="([^"]+)"/;
        var match = response.match(pattern);
        
        if (!match || !match[1]) {
            return JSON.stringify({
                code: 500,
                message: '无法提取视频地址'
            });
        }
        
        var playUrl = match[1];
        
        // 返回播放地址
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: playUrl
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}