// 宁波电视台直播源 - 酷9JS版本
// 转换自宁波电视台PHP脚本
// 频道参数: 
// id=nbtv1 (宁波新闻综合)
// id=nbtv2 (宁波社会生活) 
// id=nbtv3 (宁波文化娱乐)
// id=nbtv4 (宁波影视剧)

function main(item) {
    var id = ku9.getQuery(item.url, "id") || "nbtv1";
    
    // 频道名称映射
    var channelNames = {
        "nbtv1": "nbtv1",
        "nbtv2": "nbtv2", 
        "nbtv3": "nbtv3",
        "nbtv4": "nbtv4"
    };
    
    var channelName = channelNames[id];
    
    if (!channelName) {
        return JSON.stringify({
            code: 404,
            message: "频道不存在",
            available_channels: {
                "nbtv1": "宁波新闻综合",
                "nbtv2": "宁波社会生活", 
                "nbtv3": "宁波文化娱乐",
                "nbtv4": "宁波影视剧"
            }
        });
    }
    
    try {
        var apiUrl = "https://cms.nj.nbtv.cn?task=get-live&channelName=" + channelName;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.nbtv.cn/",
            "Origin": "https://www.nbtv.cn"
        };
        
        // 发送GET请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: "无法获取API数据"
            });
        }
        
        var jsonData;
        try {
            jsonData = JSON.parse(response);
        } catch (e) {
            return JSON.stringify({
                code: 500,
                message: "API返回数据解析失败: " + e.toString()
            });
        }
        
        // 检查数据结构
        if (!jsonData.data || !jsonData.data.liveUrl) {
            return JSON.stringify({
                code: 500,
                message: "未找到直播链接",
                raw_data: jsonData
            });
        }
        
        var playUrl = jsonData.data.liveUrl;
        
        return JSON.stringify({
            code: 200,
            message: "获取成功",
            channel: id === "nbtv1" ? "宁波新闻综合" : 
                    id === "nbtv2" ? "宁波社会生活" :
                    id === "nbtv3" ? "宁波文化娱乐" : "宁波影视剧",
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.nbtv.cn/",
                "Origin": "https://www.nbtv.cn"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: "处理过程中出错: " + e.toString()
        });
    }
}