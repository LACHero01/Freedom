function main(item) {
    let id = (ku9.getQuery(item.url, "id")) || "1";
    const CHANNEL_MAP = {
        'hbws': 1, //河北卫视
        'hbjj': 2, //河北经济生活
        'nmpd': 3, //农民频道
        'hbds': 4, //河北都市
        'hbys': 5, //河北影视剧
        'hbse': 6, //河北少儿科教
        'hbgg': 7, //河北公共
        'hbsj': 8, //河北三佳购物
    };
        if (CHANNEL_MAP.hasOwnProperty(id.toLowerCase())) {
                id = CHANNEL_MAP[id.toLowerCase()];
        } else {
                id = Math.max(1, parseInt(id));
        }
    const t = Math.floor(Date.now() / 1000) + 10000;    
    const url = "https://console.cmc.hebtv.com/scms/api/com/article/getArticleList?catalogId=32557&siteId=1";
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 8.1.0; JKM-AL00b) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.hebtv.com/'
    };
    
    const errurl = "http://cfss.cc/cdn/hy/23864973.m3u8"; 
    try {
        const res = ku9.request(url, "GET", headers, null, true);
        if (res.code === 200 && res.body){
            let data;
            try {
                data = JSON.parse(res.body);
            } catch (parseError) {
                return { url: errurl };
            }
            
            const newsItem = data.returnData.news[id - 1];
            const liveStream = newsItem.liveVideo[0].formats[0].liveStream;
            const liveUri = newsItem.appCustomParams.movie.liveUri;
            const liveKey = newsItem.appCustomParams.movie.liveKey;
            
            const k = ku9.md5(liveUri + liveKey + t);
            const finalUrl = liveStream + '?t=' + t + '&k=' + k;
            
            return { url: finalUrl };            
        } else {
            return { url: errurl };
        }
        
    } catch (error) {
        //console.log("处理过程中出现错误: " + error);
        return { url: errurl };
    }
}