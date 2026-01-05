// 江西吉安电视台直播源 - 酷9JS版本
// 转换自江西吉安电视台PHP脚本
// 频道参数: 吉安综合,id=19814 或 吉安公共,id=19815

function main(item) {
    var id = ku9.getQuery(item.url, "id") || "19814";
    
    try {
        var tenantId = "a33433adbbe5d17cacaa7fcc97556ebc";
        var apiUrl = "https://www.jarmt.cn/cmsback/api/article/getMyArticleDetail?tenantId=" + tenantId + "&articleId=" + id;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.jarmt.cn/",
            "Origin": "https://www.jarmt.cn"
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
        if (!jsonData.data || !jsonData.data.videoUrl) {
            return JSON.stringify({
                code: 500,
                message: "未找到视频链接",
                raw_data: jsonData
            });
        }
        
        var playUrl = jsonData.data.videoUrl;
        
        return JSON.stringify({
            code: 200,
            message: "获取成功",
            channel: id === "19814" ? "江西吉安频道1" : "江西吉安频道2",
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.jarmt.cn/"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: "处理过程中出错: " + e.toString()
        });
    }
}