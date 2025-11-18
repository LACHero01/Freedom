// CGTN直播源 - 酷9JS版本
// 转换自 cgtn.php
// 参数: id=频道, playseek=回看时间范围 (格式: 2024-01-01 20:00:00-2024-01-01 21:00:00)
function main(item) {
    var id = ku9.getQuery(item.url, "id") || 'cgtn';
    var playseek = ku9.getQuery(item.url, "playseek") || '';
    
    // 清理ID参数（移除查询字符串部分）
    var idMatch = id.match(/(.*?)(?:\?.*|\$.*)/);
    if (idMatch && idMatch[1]) {
        id = idMatch[1];
    }
    
    try {
        var playUrl;
        
        if (playseek) {
            // 回看模式
            playUrl = get_playback_url(id, playseek);
        } else {
            // 直播模式
            playUrl = get_live_url(id);
        }
        
        if (!playUrl) {
            return JSON.stringify({
                code: 500,
                message: '无法获取播放地址'
            });
        }
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: playUrl,
            mode: playseek ? '回看' : '直播',
            channel: id
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// 获取直播URL
function get_live_url(id) {
    var channelMap = {
        'cgtn': ['english-livetx.cgtn.com', 'yypdyyctzb'],
        'cgtnd': ['english-livetx.cgtn.com', 'yypdjlctzb'],
        'cgtne': ['espanol-livews.cgtn.com', 'LSveOGBaBw41Ea7ukkVAUdKQ220802LSTexu6xAuFH8VZNBLE1ZNEa220802cd'],
        'cgtnf': ['francais-livews.cgtn.com', 'LSvev95OuFZtKLc6CeKEFYXj220802LSTeV6PO0Ut9r71Uq3k5goCA220802cd'],
        'cgtna': ['arabic-livews.cgtn.com', 'LSveq57bErWLinBnxosqjisZ220802LSTefTAS9zc9mpU08y3np9TH220802cd'],
        'cgtnr': ['russian-livews.cgtn.com', 'LSvexABhNipibK5KRuUkvHZ7220802LSTeze9o8tdFXMHsb1VosgoT220802cd']
    };
    
    if (!channelMap[id]) {
        id = 'cgtn'; // 默认使用CGTN
    }
    
    var host = channelMap[id][0];
    var path = channelMap[id][1];
    
    return "https://" + host + "/hls/" + path + "/playlist.m3u8";
}

// 获取回看URL
function get_playback_url(id, playseek) {
    var channelMap = {
        'cgtn': ['api.cgtn.com/website/api/live/channel', 1],
        'cgtnd': ['api.cgtn.com/website/api/live/channel', 12],
        'cgtne': ['espanol-api.cgtn.com/api', 2],
        'cgtnf': ['francais-api.cgtn.com/api', 3],
        'cgtna': ['arabic-api.cgtn.com/api', 4],
        'cgtnr': ['russian-api.cgtn.com/api', 5]
    };
    
    if (!channelMap[id]) {
        id = 'cgtn'; // 默认使用CGTN
    }
    
    var apiHost = channelMap[id][0];
    var channelId = channelMap[id][1];
    
    // 解析时间范围
    var timeArr = playseek.split('-');
    if (timeArr.length !== 2) {
        throw new Error('时间格式错误，应为: 2024-01-01 20:00:00-2024-01-01 21:00:00');
    }
    
    var startTime = parseDateTime(timeArr[0]) * 1000; // 转为毫秒
    var endTime = (parseDateTime(timeArr[1]) - 1) * 1000; // 结束时间减1秒
    
    // 第一步：获取EPG列表
    var listUrl = 'https://' + apiHost + '/epg/list?channelId=' + channelId + 
                  '&startTime=' + startTime + '&endTime=' + endTime;
    
    var listData = send_request(listUrl, 1);
    var listJson = JSON.parse(listData);
    
    var epgList;
    var selectedIndex;
    
    if (listJson.status !== 200) {
        // 第一次请求失败，放宽开始时间（提前1小时）
        startTime -= 3600000;
        listUrl = 'https://' + apiHost + '/epg/list?channelId=' + channelId + 
                  '&startTime=' + startTime + '&endTime=' + endTime;
        
        listData = send_request(listUrl, 3);
        listJson = JSON.parse(listData);
        
        if (listJson.status !== 200) {
            throw new Error('EPG列表接口请求失败');
        } else {
            epgList = listJson.data;
            // 选择最接近的节目
            if (Math.abs(epgList[0].endTime - endTime) > Math.abs(epgList[1].endTime - endTime)) {
                selectedIndex = 1;
            } else {
                selectedIndex = 0;
            }
        }
    } else {
        // 第一次请求成功
        epgList = listJson.data;
        
        if (!epgList || epgList.length === 0) {
            // 无数据，放宽开始时间（提前15分钟）
            startTime -= 900000;
            listUrl = 'https://' + apiHost + '/epg/list?channelId=' + channelId + 
                      '&startTime=' + startTime + '&endTime=' + endTime;
            
            listData = send_request(listUrl, 3);
            listJson = JSON.parse(listData);
            epgList = listJson.data;
        }
        
        selectedIndex = epgList.length - 1;
    }
    
    if (!epgList || epgList.length === 0) {
        throw new Error('未找到对应的节目');
    }
    
    var epgInfo = epgList[selectedIndex];
    var epgId = epgInfo.epgId;
    var finalStartTime = epgInfo.startTime;
    var finalEndTime = epgInfo.endTime;
    
    // 确定回看API端点
    var playbackEndpoint;
    if (channelId === 1 || channelId === 12) {
        playbackEndpoint = 'playback';
    } else {
        playbackEndpoint = 'playBack';
    }
    
    // 第二步：获取回看播放地址
    var playbackUrl = 'https://' + apiHost + '/epg/' + playbackEndpoint + 
                      '?channelId=' + channelId + 
                      '&startTime=' + finalStartTime + 
                      '&endTime=' + finalEndTime + 
                      '&epgId=' + epgId;
    
    var playbackData = send_request(playbackUrl, 1);
    var playbackJson = JSON.parse(playbackData);
    
    if (playbackJson.status !== 200) {
        // 重试一次
        playbackData = send_request(playbackUrl, 3);
        playbackJson = JSON.parse(playbackData);
        
        if (playbackJson.status !== 200) {
            throw new Error('回看接口请求失败');
        }
    }
    
    return playbackJson.data;
}

// 解析日期时间字符串为时间戳
function parseDateTime(dateTimeStr) {
    // 格式: "2024-01-01 20:00:00"
    var dateTime = dateTimeStr.trim();
    var dateObj = new Date(dateTime);
    
    if (isNaN(dateObj.getTime())) {
        throw new Error('日期时间格式错误: ' + dateTimeStr);
    }
    
    return Math.floor(dateObj.getTime() / 1000); // 返回秒级时间戳
}

// 发送HTTP请求（模拟PHP的curl_get）
function send_request(url, timeout) {
    var headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        "Referer": "https://www.cgtn.com/tv"
    };
    
    var response = ku9.request(url, 'GET', JSON.stringify(headers), '');
    
    if (!response || !response.body) {
        throw new Error('请求失败: ' + url);
    }
    
    return response.body;
}