function main(item) {
    // 获取URL参数
    var id = ku9.getQuery(item.url, "id") || 'cctv1';
    var fmt = ku9.getQuery(item.url, "fmt") || 'hls';
    
    // 频道映射表 - 与原PHP脚本保持一致
    var n = {
        "cctv1": 578,
        "cctv2": 579,
        "cctv3": 580,
        "cctv4": 581,
        "cctv4a": 595,
        "cctv4o": 596,
        "cctv5": 582,
        "cctv5p": 583,
        "cctv6": 584,
        "cctv7": 585,
        "cctv8": 586,
        "cctv9": 587,
        "cctv10": 588,
        "cctv11": 589,
        "cctv12": 590,
        "cctv13": 591,
        "cctv14": 592,
        "cctv15": 593,
        "cctv17": 594,
        "bjws": 608,
        "dfws": 597,
        "tjws": 611,
        "cqws": 607,
        "hljws": 621,
        "jlws": 601,
        "lnws": 620,
        "gsws": 622,
        "qhws": 605,
        "sxws": 603,
        "hbws": 615,
        "sxiws": 624,
        "sdws": 613,
        "ahws": 612,
        "hnws": 616,
        "hubws": 604,
        "hunws": 609,
        "jxws": 602,
        "jsws": 599,
        "zjws": 617,
        "dnws": 618,
        "gdws": 598,
        "szws": 606,
        "gxws": 614,
        "gzws": 619,
        "scws": 610,
        "xjws": 623,
        "hinws": 600
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