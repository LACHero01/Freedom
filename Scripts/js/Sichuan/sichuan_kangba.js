// 四川康巴电视台直播源 - 酷9JS版本
// 转换自 sichuan_kangba.php
// 固定频道: 康巴卫视(channel_id=17)
function main(item) {
    try {
        var apiUrl = 'https://mapi.kangbatv.com/api/v1/channel_detail.php?channel_id=17';
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": "https://mapi.kangbatv.com/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取频道信息'
            });
        }
        
        var jsonData = JSON.parse(response);
        var m3u8Url = jsonData[0]['m3u8'];
        
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