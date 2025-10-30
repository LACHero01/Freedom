function main(item) {
	/*
	成都,#genre#
	成都新闻综合,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cdtv1
	成都经济资讯,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cdtv2
	成都都市生活,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cdtv3
	成都影视文艺,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cdtv4
	成都公共,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cdtv5
	成都少儿,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cdtv6
	成都蓉城先锋,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cdrcxf

	成华有线,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=chyx
	崇州综合,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=cztv
	都江堰电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=djytv
	大邑综合,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=dytv
	高新电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=gxtv
	锦江电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=jjtv
	金牛电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=jntv
	金堂电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=jttv
	简阳新闻综合,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=jyxwzh
	郫都新闻综合,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=pdxwzh
	蒲江电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=pjtv
	彭州电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=pztv
	青白江电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=qbjtv
	双流综合,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=slzh
	青羊电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=qytv
	武侯电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=whtv
	温江电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=wjtv
	新都综合,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=xdtv
	新津电视台,https://你的服务器地址/k-web/ku9/js/cdtv2.js?id=xjtv
	*/
	
    // 获取请求参数
    const url = item.url;
    const id = ku9.getQuery(url, "id") || "cdtv1";
    const t = ku9.getQuery(url, "t") || "hd";
    
    // 频道映射配置
    const n = {
        'cdtv1': 1,
        'cdtv2': 2,
        'cdtv3': 3,
        'cdtv4': 45,
        'cdtv5': 5,
        'cdtv6': 6,
        'cdrcxf': 15,
    };

    const m = {
        'chyx': 1319,
        'cztv': 1257,
        'djytv': 1314,
        'dytv': 790,
        'gxtv': 722,
        'jjtv': 1541,
        'jntv': 556,
        'jttv': 840,
        'jyxwzh': 1698,
        'lqzh': 882,
        'pdxwzh': 845,
        'pjtv': 828,
        'pztv': 796,
        'qbjtv': 966,
        'qltv': 1427,
        'qytv': 910,
        'slzh': 557,
        'whtv': 1766,
        'wjtv': 559,
        'xdtv': 1712,
        'xjtv': 760,
    };

    let apiUrl = null;
    
    // 构建API URL
    if (n[id]) {
        apiUrl = "http://mob.api.cditv.cn/show/192-" + n[id] + ".html";
    } else if (m[id]) {
        apiUrl = "http://mob.api.cditv.cn/show/192-" + m[id] + ".html";
    } else {
        return JSON.stringify({ error: "Invalid channel ID: " + id });
    }

    try {
        // 设置请求头
        const headers = {
            'User-Agent': 'okhttp/3.12.11',
            'Content-Type': 'application/json'
        };
        
        // 发送GET请求
        const response = ku9.get(apiUrl, headers);
        
        if (!response) {
            return JSON.stringify({ error: "Failed to fetch data from API." });
        }
        
        // 解析JSON响应
        const jsonData = JSON.parse(response);
        
        if (!jsonData || !jsonData.data) {
            return JSON.stringify({ error: "Invalid JSON response from API." });
        }

        let targetUrl = "";
        
        if (n[id]) {
            // 处理n类型的频道
            const m3u8_sd = jsonData.data.android_url ? jsonData.data.android_url.replace(/^http:/i, 'https:') : '';
            const m3u8_hd = jsonData.data.android_HDlive_url ? jsonData.data.android_HDlive_url.replace(/^http:/i, 'https:') : '';
            
            if (!m3u8_sd && !m3u8_hd) {
                return JSON.stringify({ error: "No stream URL available for this channel." });
            }
            
            targetUrl = (t === 'hd' && m3u8_hd) ? m3u8_hd : m3u8_sd;
            
        } else if (m[id]) {
            // 处理m类型的频道
            targetUrl = jsonData.data.android_url || '';
            
            if (!targetUrl) {
                return JSON.stringify({ error: "No stream URL available for this county channel." });
            }
        }

        // 返回播放地址
        return JSON.stringify({ 
            url: targetUrl,
            headers: headers
        });
        
    } catch (error) {
        return JSON.stringify({ error: "Request failed: " + error });
    }
}