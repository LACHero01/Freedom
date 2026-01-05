// 南昌电视台直播源 - 酷9JS版本
// 转换自 nanchang.php
// 频道参数: n=新闻(新闻综合频道), n=文旅(文旅频道), n=资讯(资讯频道), n=频率(新闻综合频率), n=广播(南昌交通广播)
function main(item) {
    // 获取频道名称参数
    var channelName = ku9.getQuery(item.url, "n") || '新闻';
    
    try {
        var targetUrl = 'https://www.nctv.net.cn/live';
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36"
        };
        
        // 发送请求获取直播页面内容
        var response = ku9.get(targetUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取直播页面内容'
            });
        }
        
        // 构建正则表达式匹配data-url和频道名称
        var pattern = new RegExp('data-url="(.+?)"[\\s\\S]*?' + channelName);
        var match = response.match(pattern);
        
        if (!match || !match[1]) {
            return JSON.stringify({
                code: 500,
                message: '无法提取播放地址，请检查频道参数是否正确'
            });
        }
        
        // HTML实体解码
        var playUrl = htmlspecialchars_decode(match[1]);
        
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

function htmlspecialchars_decode(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ');
}