// 黔西南电视台直播源 - 酷9JS版本
// 转换自黔西南电视台PHP脚本
// 频道参数: 
// id=qxnzh (黔西南综合)
// id=qxngg (黔西南公共)

function main(item) {
    var id = ku9.getQuery(item.url, "id") || "qxnzh";
    
    // 频道映射表
    var channelMap = {
        "qxnzh": 11,    // 黔西南综合
        "qxngg": 14     // 黔西南公共
    };
    
    var channelId = channelMap[id];
    
    if (typeof channelId === "undefined") {
        return JSON.stringify({
            code: 404,
            message: "频道不存在",
            available_channels: {
                "qxnzh": "黔西南综合",
                "qxngg": "黔西南公共"
            }
        });
    }
    
    try {
        var apiUrl = "http://mapi2.qxndt.com/api/v1/channel.php?channel_id=" + channelId;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "http://mapi2.qxndt.com/",
            "Origin": "http://mapi2.qxndt.com"
        };
        
        // 发送GET请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: "无法获取API数据"
            });
        }
        
        // 解析JSON数据
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
        if (!Array.isArray(jsonData) || jsonData.length === 0 || !jsonData[0].m3u8) {
            return JSON.stringify({
                code: 500,
                message: "未找到直播链接",
                raw_data: jsonData
            });
        }
        
        var m3u8Url = jsonData[0].m3u8;
        
        return JSON.stringify({
            code: 200,
            message: "获取成功",
            channel: id === "qxnzh" ? "黔西南综合" : "黔西南公共",
            url: m3u8Url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "http://mapi2.qxndt.com/"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: "处理过程中出错: " + e.toString()
        });
    }
}