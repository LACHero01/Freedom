function main(item) {
	
	/*
	扬州新闻,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzxw
	扬州民生,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzms
	扬州邗江,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzhj
	扬州江都,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzjd
	扬州,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzsh
	扬州新闻广播,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzxwpl
	扬州交通广播,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzjtpl
	扬州经济音乐广播,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzjjyy
	扬州邗江广播,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzhjgb
	扬州江都广播,http://A/ku9/js/Jiangsu/yangzhou.js?id=yzjdgb
	*/

    let vid = ku9.getQuery(item.url, "id") || "yzxw";
    
    // 如果URL中包含html?id=格式的参数
    if (item.url.includes('html?id=')) {
        const urlParts = item.url.split('html?id=');
        if (urlParts.length > 1) {
            vid = urlParts[1];
        }
    }
    
    const n = {
        'yzxw': 235,
        'yzms': 291,
        'yzsh': 236,
        'yzhj': 292,
        'yzjd': 290,
        'yzxwpl': 293,
        'yzjtpl': 294,
        'yzjjyy': 296,
        'yzhjgb': 295,
        'yzjdgb': 307,

    };
    
    if (!n.hasOwnProperty(vid)) {
        vid = 'yzxw';
    }
    
    const t = new Date().getTime();
    const param = ku9.md5("apiversion%3D29%26params%3DtokenchannelId" + n[vid] + "t" + t + "terminalTypeandroid%26service%3DgetChannelDetail");
    const butelSign = ku9.md5("service=/setsail/external/externalService&securitykey=562db162d30884329cc2f5884b26c787&butelTst=" + t + "&param=" + param);
    
    const data = 'service=getChannelDetail&params={"token":"","channelId":"' + n[vid] + '","t":"' + t + '","terminalType":"android"}&apiVersion=2.9&butelAppkey=yangfanapp&butelTst=' + t + '&butelSign=' + butelSign;
    
    const url = 'https://vapp.96189.com/setsail/external/externalService';
    
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://pc.96189.com/',
            'Origin': 'https://pc.96189.com',
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        
        const res = ku9.request(url, "POST", headers, data, true);
        
        if (res.code === 200 && res.body) {
            const responseData = JSON.parse(res.body);
            
            if (responseData.data && responseData.data.playUrl) {
                const m3u8 = responseData.data.playUrl.split(',')[1].replace('yztv.', 'yztv-');
                
                // 返回M3U8播放地址
                return { url: m3u8 };
            } else {
                return { url: "" };
            }
            
        } else {
            return { url: "" };
        }
        
    } catch (error) {
        return { url: "" };
    }
}