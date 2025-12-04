// 内蒙古草原云直播源 - 酷9JS版本
// 转换自内蒙古草原云PHP脚本
// 频道参数:
// id=zgezh (准格尔旗综合)
// id=dmzh (达茂综合)
// id=nmzh (奈曼综合)
// id=ewkzh (鄂温克综合)

function main(item) {
    var id = ku9.getQuery(item.url, "id") || "dmzh";
    
    // 频道映射表
    var channelMap = {
        'zgezh': ['zge', '25'], // 准格尔旗综合
        'dmzh': ['yxdm', '12'], // 达茂综合
        'nmzh': ['nmqrmt', '2'], // 奈曼综合
        'ewkzh': ['ewkrm', '12'] // 鄂温克综合
    };
    
    var channelInfo = channelMap[id];
    
    if (!channelInfo) {
        return JSON.stringify({
            code: 404,
            message: "频道不存在",
            available_channels: {
                'zgezh': '准格尔旗综合',
                'dmzh': '达茂综合',
                'nmzh': '奈曼综合',
                'ewkzh': '鄂温克综合'
            }
        });
    }
    
    try {
        var domain = channelInfo[0];
        var tvId = channelInfo[1];
        var apiUrl = "http://" + domain + ".nmgcyy.com.cn/tvradio/Tv/getTvInfo?tv_id=" + tvId;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "http://" + domain + ".nmgcyy.com.cn/",
            "Origin": "http://" + domain + ".nmgcyy.com.cn"
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
        
        if (!jsonData.data || !jsonData.data.url) {
            return JSON.stringify({
                code: 500,
                message: "未找到直播链接",
                raw_data: jsonData
            });
        }
        
        var playUrl = jsonData.data.url;
        
        return JSON.stringify({
            code: 200,
            message: "获取成功",
            channel: id === 'zgezh' ? '准格尔旗综合' : 
                    id === 'dmzh' ? '达茂综合' : 
                    id === 'nmzh' ? '奈曼综合' : '鄂温克综合',
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "http://" + domain + ".nmgcyy.com.cn/"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: "处理过程中出错: " + e.toString()
        });
    }
}