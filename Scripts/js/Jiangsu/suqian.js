function main(item) {
	/*
	宿迁综合,http://A/ku9/js/Jiangsu/suqian.js?id=sqzh
	宿迁公共,http://A/ku9/js/Jiangsu/suqian.js?id=sqgg
	*/
    let vid = ku9.getQuery(item.url, "id") || "sqzh";
    
    const n = {
        'sqzh': 10000,
        'sqgg': 10001
    };
    
    // 如果URL中包含html?id=格式的参数
    if (item.url.includes('html?id=')) {
        const urlParts = item.url.split('html?id=');
        if (urlParts.length > 1) {
            vid = urlParts[1];
        }
    }
    
    if (!n.hasOwnProperty(vid)) {
        vid = 'sqzh';
    }
    
    const key = "aba7784d60f414a7a3069c8c8160ac3d";
    const pm = 'appkey=6f2d6e90a4799251721ca8dd5d6e98c6&id=' + n[vid] + '&method=tv.detail&ver=3.1.24';
    const str = 'appkey6f2d6e90a4799251721ca8dd5d6e98c6id' + n[vid] + 'methodtv.detailver3.1.24';
    const sign = ku9.md5(str + key);
    const apiUrl = 'https://api.sqsjt.net/v4/?spm=&' + pm + '&sign=' + sign;
    
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.sqsjt.net/'
        };
        
        const res = ku9.request(apiUrl, "GET", headers, null, true);
        
        if (res.code === 200 && res.body) {
            const data = JSON.parse(res.body);
            const m3u8 = data.data.playurl;
            
            // 返回M3U8链接
            return { url: m3u8 };
        } else {
            return { url: "" };
        }
        
    } catch (error) {
        return { url: "" };
    }
}