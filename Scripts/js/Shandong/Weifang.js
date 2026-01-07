// ==================== 1. 潍坊电视台 ====================
// 转换难度: ⭐ 简单 - 完全可转换
// 文件名: Weifang.js
// 用法: ?id=1 或 ?id=5 或 ?id=7 或 ?id=9

function main(item) {
    // 获取频道ID参数
    var channelId = ku9.getQuery(item.url, "id");
    
    if (!channelId) {
        return JSON.stringify({
            error: '请提供频道ID参数',
            usage: '?id=1 或 ?id=5 或 ?id=7 或 ?id=9',
            example_channels: {
                '1': '潍坊新闻综合',
                '5': '潍坊公共',
                '7': '潍坊科教',
                '9': '潍坊影视'
            }
        });
    }
    
    // 转换为数字类型
    channelId = parseInt(channelId);
    
    try {
        // API地址
        var apiUrl = 'https://app.litenews.cn/v1/app/play/tv/live?_orgid_=635';
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json"
        };
        
        // 发送请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                error: '无法获取频道列表'
            });
        }
        
        // 解析JSON数据
        var result = JSON.parse(response);
        
        if (!result.data || !Array.isArray(result.data)) {
            return JSON.stringify({
                error: 'API返回数据格式错误'
            });
        }
        
        // 遍历查找匹配的频道ID
        var playUrl = null;
        for (var i = 0; i < result.data.length; i++) {
            if (result.data[i].id === channelId) {
                playUrl = result.data[i].stream;
                break;
            }
        }
        
        if (!playUrl) {
            return JSON.stringify({
                error: '未找到对应频道的播放地址',
                requested_id: channelId
            });
        }
        
        return JSON.stringify({
            url: playUrl
        });
        
    } catch (e) {
        return JSON.stringify({
            error: '处理过程中出错: ' + e.toString()
        });
    }
}