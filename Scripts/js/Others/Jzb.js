function main(item) {
    // 获取URL参数
    var id = ku9.getQuery(item.url, "id") || 'cctv1';
    var fmt = ku9.getQuery(item.url, "fmt") || 'hls';
    
    // 频道映射表 - 与原PHP脚本保持一致
    var n = {
        "cctv1": 578, //CCTV-1
        "cctv2": 579, //CCTV-2
        "cctv3": 580, //CCTV-3
        "cctv4": 581, //CCTV-4
        "cctv4a": 595, //CCTV-4美洲
        "cctv4o": 596, //CCTV-4欧洲
        "cctv5": 582, //CCTV-5
        "cctv5p": 583, //CCTV-5+
        "cctv6": 584, //CCTV-6
        "cctv7": 585, //CCTV-7
        "cctv8": 586, //CCTV-8
        "cctv9": 587, //CCTV-9
        "cctv10": 588, //CCTV-10
        "cctv11": 589, //CCTV-11
        "cctv12": 590, //CCTV-12
        "cctv13": 591, //CCTV-13
        "cctv14": 592, //CCTV-14
        "cctv15": 593, //CCTV-15
        "cctv17": 594, //CCTV-17
        "bjws": 608, //北京卫视
        "dfws": 597, //东方卫视
        "tjws": 611, //天津卫视
        "cqws": 607, //重庆卫视
        "hljws": 621, //黑龙江卫视,暂时无法播放
        "jlws": 601, //吉林卫视
        "lnws": 620, //辽宁卫视
        "gsws": 622, //甘肃卫视
        "qhws": 605, //青海卫视
        "sxws": 603, //陕西卫视
        "hbws": 615, //河北卫视
        "sxiws": 624, //山西卫视
        "sdws": 613, //山东卫视,暂时无法播放
        "ahws": 612, //安徽卫视
        "hnws": 616, //河南卫视
        "hubws": 604, //湖北卫视
        "hunws": 609, //湖南卫视
        "jxws": 602, //江西卫视
        "jsws": 599, //江苏卫视
        "zjws": 617, //浙江卫视
        "dnws": 618, //东南卫视,暂时无法播放
        "gdws": 598, //广东卫视
        "szws": 606, //深圳卫视
        "gxws": 614, //广西卫视
        "gzws": 619, //贵州卫视
        "scws": 610, //四川卫视
        "xjws": 623, //新疆卫视,频道内容与实际不符
        "hinws": 600 //海南卫视
    };
    
    // 获取对应的频道ID
    var channelId = n[id] || n['cctv1'];
    
    // API地址
    var apiUrl = "https://jzb123.huajiaedu.com/prod-api/iptv/getIptvList?liveType&deviceType=1";
    
    try {
        // 设置请求头 - 模拟浏览器访问
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://jzb123.huajiaedu.com/",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Origin": "https://jzb123.huajiaedu.com"
        };
        
        // 发送GET请求 - 注意ku9.get的第二个参数应该是headers的JSON字符串
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ 
                error: "API请求失败，无响应数据" 
            });
        }
        
        // 解析JSON响应
        var data = JSON.parse(response);
        
        // 检查数据结构
        if (!data || !data.list || !Array.isArray(data.list)) {
            return JSON.stringify({ 
                error: "API返回数据格式不正确" 
            });
        }
        
        var channelList = data.list;
        var m3u8 = '';
        var flv = '';
        
        // 查找对应频道的播放地址
        for (var i = 0; i < channelList.length; i++) {
            var channel = channelList[i];
            if (channel.id === channelId) {
                // 与原PHP脚本相同的处理逻辑
                m3u8 = channel.play_source_url.replace(/https/g, 'http');
                flv = m3u8.replace(/\.m3u8/, '.flv');
                break;
            }
        }
        
        if (!m3u8) {
            return JSON.stringify({ 
                error: "未找到频道 " + id + " (ID: " + channelId + ") 的播放地址" 
            });
        }
        
        // 根据格式返回对应的URL
        var playUrl = '';
        if (fmt === 'hls' || fmt === '') {
            playUrl = m3u8;
        } else if (fmt === 'flv') {
            playUrl = flv;
        } else {
            return JSON.stringify({ 
                error: "不支持的格式参数: " + fmt 
            });
        }
        
        // 返回播放地址
        return JSON.stringify({ 
            url: playUrl 
        });
        
    } catch (e) {
        // 错误处理
        return JSON.stringify({ 
            error: "获取播放地址失败: " + e.toString() 
        });
    }
}