// 西藏卫视直播源 - 酷9JS版本
// 转换自 xztv.php
// 频道参数: id=ws(西藏卫视), id=zy(西藏藏语), id=ys(西藏影视)
function main(item) {
    // 频道映射表
    var channelMap = {
        'ws': 0, // 西藏卫视
        'zy': 1, // 西藏藏语
        'ys': 2  // 西藏影视
    };
    
    var id = ku9.getQuery(item.url, "id") || 'ys';
    
    // 验证频道ID
    if (!channelMap.hasOwnProperty(id)) {
        return JSON.stringify({
            code: 404,
            message: '频道不存在',
            available_channels: {
                'ws': '西藏卫视',
                'zy': '西藏藏语',
                'ys': '西藏影视'
            }
        });
    }
    
    try {
        var apiUrl = "https://api.vtibet.cn/xizangmobileinf/rest/xz/cardgroups";
        var postData = 'json=%7B%22cardgroups%22%3A%22LIVECAST%22%2C%22paging%22%3A%7B%22page_no%22%3A%221%22%2C%22page_size%22%3A%22100%22%7D%2C%22version%22%3A%221.0.0%22%7D';
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://api.vtibet.cn/"
        };
        
        // 发送POST请求
        var response = ku9.request(
            apiUrl,
            'POST',
            JSON.stringify(headers),
            postData
        );
        
        if (!response || !response.body) {
            return JSON.stringify({
                code: 500,
                message: '无法获取API数据'
            });
        }
        
        var jsonData = JSON.parse(response.body);
        var channelIndex = channelMap[id];
        
        // 访问嵌套的JSON路径：cardgroups[1]->cards[channelIndex]->video->url_hd
        var playUrl = jsonData.cardgroups[1].cards[channelIndex].video.url_hd;
        
        if (!playUrl) {
            return JSON.stringify({
                code: 500,
                message: '无法提取播放地址'
            });
        }
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: id === 'ws' ? '西藏卫视' : (id === 'zy' ? '西藏藏语' : '西藏影视'),
            url: playUrl
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}