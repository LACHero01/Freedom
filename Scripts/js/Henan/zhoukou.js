// 周口电视台直播源 - 酷9JS版本
// 转换自 zhoukou.php
// 频道参数: id=zkxwzh(周口新闻综合), id=zkgg(周口公共频道), id=zkjy(周口教育频道), id=zkch(周口川汇频道)
function main(item) {
    // 频道映射表
    var channelMap = {
        'zkxwzh': 1, // 周口新闻综合
        'zkgg': 2,   // 周口公共频道
        'zkjy': 3,   // 周口教育频道
        'zkch': 4    // 周口川汇频道
    };
    
    // 获取频道ID
    var id = ku9.getQuery(item.url, "id") || 'zkxwzh';
    
    // 验证频道ID
    if (!channelMap[id]) {
        return JSON.stringify({
            code: 404,
            message: '频道不存在',
            available_channels: {
                'zkxwzh': '周口新闻综合',
                'zkgg': '周口公共频道',
                'zkjy': '周口教育频道', 
                'zkch': '周口川汇频道'
            }
        });
    }
    
    try {
        var channelId = channelMap[id];
        var apiUrl = 'http://mms.yszkapp.cn:18080/mms4.6.3/videoPlayInterface/getChannelInfo.jspa?token=pmqhukcpyipvqmoz&channelId=' + channelId;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": "http://mms.yszkapp.cn/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取频道信息'
            });
        }
        
        var jsonData = JSON.parse(response);
        var streamURL = jsonData.streamList[0].streamURL;
        
        if (!streamURL) {
            return JSON.stringify({
                code: 500,
                message: '无法提取播放地址'
            });
        }
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: streamURL
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}