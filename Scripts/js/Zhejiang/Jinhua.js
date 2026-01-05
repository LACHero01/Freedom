// 金华电视台直播源 - 酷9JS版本
// 转换自 jinhua.php
// 固定频道: 金华电视台 (channel_id=50)
function main(item) {
    try {
        var url = "https://mapi.jcy.jinhua.com.cn/api/hotlive_h5/get_ali_pull_stream_url?channel_id=50&app_id=&noncestr=oFVzaVu8KkYQW4n&timestamp=1741964485&sign=0e2d8a62564f2dc46f6a97ce0718477e";
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": "https://mapi.jcy.jinhua.com.cn/"
        };
        
        var response = ku9.get(url, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取API数据'
            });
        }
        
        var jsonData = JSON.parse(response);
        var m3u8Url = jsonData.data.url;
        
        if (!m3u8Url) {
            return JSON.stringify({
                code: 500,
                message: '无法提取M3U8地址'
            });
        }
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: m3u8Url
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}