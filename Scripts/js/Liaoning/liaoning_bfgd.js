// 全局配置

/*

CCTV-1高清,488
CCTV-2高清,061
CCTV-3高清,062
CCTV-4高清,063
CCTV-5高清,064
CCTV-5+高清,246
CCTV-6高清,065
CCTV-7高清,127
CCTV-8高清,066
CCTV-9高清,128
CCTV-10高清,129
CCTV-11高清,130
CCTV-12高清,131
CCTV-13高清,067
CCTV-14高清,132
CCTV-15高清,133
CCTV-17高清,204
CCTV-女性时尚,176
CCTV-世界地理,177
CCTV-电视指南,164
CCTV-书画频道,180
CGTN,134
CGTN,305
CGTN-西班牙语,306
CGTN-法语,307
CGTN-阿拉伯语,308
CGTN-俄语,309
中央新影-发现之旅,151
中央新影-老故事,166
辽宁卫视高清,058
黑龙江卫视高清,095
吉林卫视高清,097
内蒙古卫视,110
北京卫视高清,083
天津卫视高清,084
河北卫视高清,108
河南卫视高清,339
河南卫视,104
陕西卫视高清,512
陕西卫视,114
宁夏卫视,118
甘肃卫视高清,119
青海卫视,111
山西卫视高清,109
山东卫视高清,099
安徽卫视高清,096
江苏卫视高清,085
浙江卫视高清,094
上海东方卫视高清,093
湖北卫视高清,102
湖南卫视高清,086
江西卫视高清,098
福建东南卫视高清,483
贵州卫视高清,101
四川卫视高清,103
重庆卫视高清,107
云南卫视高清,482
云南卫视,115
新疆卫视,150
西藏卫视,121
广西卫视高清,116
广东卫视高清,092
海南卫视高清,473
吉林延边卫视,117
北京卡酷少儿,106
北京冬奥纪实高清,113
北京车迷频道,146
北京中华特产,158
北京优优宝贝,153
北京四海钓鱼,229
北京生态环境,149
河南国学频道,169
陕西农林卫视,122
甘肃家政,167
山东教育卫视,112
山东收藏天下,155
江苏财富天下,231
江苏靓妆,179
上海法治天地,162
湖北休闲指南,156
湖南金鹰卡通,105
湖南茶频道,181
江西陶瓷,175
贵州天元围棋,144
贵州摄影频道,222
重庆汽摩,168
新疆兵团卫视,124
广东深圳卫视高清,100
辽宁都市高清,610
辽宁都市,068
辽宁影视剧高清,070
辽宁北方高清,071
辽宁体育,072
辽宁生活高清,073
辽宁教育青少高清,075
辽宁经济高清,076
辽宁经济高清,480
辽宁公共高清,077
辽宁公共高清,481
北方导视,187
家庭理财,139
新动漫,140
游戏竞技,142
电子体育,143
网络棋牌,141
沈阳新闻综合高清,059
大连新闻综合高清,273
鞍山新闻综合高清,274
抚顺新闻综合高清,275
本溪新闻综合高清,312
丹东新闻综合高清,276
锦州新闻综合高清,277
营口新闻综合高清,278
阜新新闻综合,279
辽阳新闻综合高清,280
铁岭新闻综合,281
朝阳新闻综合高清,282
盘锦新闻综合高清,283
葫芦岛新闻综合高清,284
葫芦岛连山区综合,491
葫芦岛龙港区综合,490
中国天气,160
中国教育1高清,135
空中课堂,492
环球旅游,147
百姓健康,219
重温经典高清,635
炫动3D,298
漫游世界高清,297
电子竞技高清,296
风尚音乐,294
少儿动漫高清,293
高清娱乐,292
欧美影院高清,291
精品剧场高清,290
亚洲影院高清,289
*/

const NEED_REQUEST_TS = false; // 是否代理ts。不能播放时置为true，并换个服务器。
const NEED_REFRESH_PLAY_TOKEN = false; // 是否刷新播放令牌。不刷新则播放链接是固定的，无需缓存。
const NEED_CACHE = false; // 是否需要缓存。在酷9中使用内置缓存机制

function main(item) {
    try {
        const id = item.id || "";
        if (!id) {
            return { url: "" };
        }
        
        // 获取M3U8 URL
        const m3u8Url = getM3u8Url(id);
        
        // 发送请求获取M3U8内容
        const m3u8Content = sendRequest(m3u8Url);
        
        if (!m3u8Content) {
            return { url: "" };
        }
        
        // 替换TS URL
        const replacedContent = replaceTsUrls(m3u8Content);
        
        return { m3u8: replacedContent };
        
    } catch (error) {
        return { url: "" };
    }
}

function getBaseUrl() {
    return 'http://httplive.slave.bfgd.com.cn:14311';
}

function getAccessToken() {
    return 'R621C86FCU319FA04BK783FB5EBIFA29A0DEP2BF4M340CAC5V0Z339C9W16D7E5AFCA1ADFD1';
}

function getM3u8Url(id) {
    if (NEED_CACHE && !NEED_REFRESH_PLAY_TOKEN) {
        const cached = loadFromCache(id);
        if (cached) {
            return cached;
        }
    }
    
    const url = getM3u8UrlCore(id);
    
    if (NEED_CACHE) {
        saveToCache(id, url);
    }
    
    return url;
}

function getM3u8UrlCore(id) {
    return getBaseUrl() + '/playurl' +
        '?playtype=live' +
        '&protocol=hls' +
        '&accesstoken=' + getAccessToken() +
        '&programid=4200000' + id +
        '&playtoken=' + getPlayToken(id);
}

function getPlayToken(id) {
    const defaultToken = 'ABCDEFGHI';
    
    if (NEED_REFRESH_PLAY_TOKEN) {
        const url = 'http://slave.bfgd.com.cn/media/channel/get_info' +
            '?chnlid=4200000' + id +
            '&accesstoken=' + getAccessToken();
            
        const response = sendRequest(url);
        if (response) {
            try {
                const jsonData = JSON.parse(response);
                return jsonData.play_token || defaultToken;
            } catch (e) {
                return defaultToken;
            }
        }
    }
    
    return defaultToken;
}

function saveToCache(id, m3u8Url) {
    const cacheKey = "bfgd_" + id;
    // 缓存1小时
    ku9.setCache(cacheKey, m3u8Url, 3600000);
}

function loadFromCache(id) {
    const cacheKey = "bfgd_" + id;
    return ku9.getCache(cacheKey);
}

function sendRequest(url) {
    try {
        const res = ku9.request(url, "GET", null, null, false);
        return res && res.body ? res.body : null;
    } catch (error) {
        return null;
    }
}

function replaceTsUrls(m3u8Content) {
    const baseUrl = getBaseUrl();
    
    if (NEED_REQUEST_TS) {
        // 如果需要代理TS，这里需要特殊处理
        // 在酷9中，通常不需要代理TS，播放器会自行处理
        return m3u8Content.replace(/https?:\/\/[^\/]+/gi, baseUrl);
    } else {
        // 只替换M3U8中的TS域名
        return m3u8Content.replace(/https?:\/\/[^\/]+/gi, baseUrl);
    }
}