function main(item) {
    try {
        // 获取频道ID参数
        var id = ku9.getQuery(item.url, "id") || '7'; // 默认芜湖新闻综合
        
        // 验证ID有效性
        if (!id || (id !== '7' && id !== '9')) {
            return JSON.stringify({
                error: "无效的频道ID",
                code: 400,
                message: "请使用有效的频道ID: 7=芜湖新闻综合, 9=芜湖生活频道",
                availableIds: {
                    '7': '芜湖新闻综合',
                    '9': '芜湖生活频道'
                }
            });
        }
        
        // 构造API请求URL
        var apiUrl = "https://mapi.wuhunews.cn/api/v1/program.php?&channel_id=" + id;
        
        // 请求头配置
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://mapi.wuhunews.cn/",
            "Origin": "https://mapi.wuhunews.cn"
        };
        
        // 发送GET请求获取节目列表
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ 
                error: "无法获取芜湖电视台节目列表",
                code: 500,
                apiUrl: apiUrl
            });
        }
        
        // 解析JSON数据
        var data;
        try {
            data = JSON.parse(response);
        } catch (e) {
            return JSON.stringify({ 
                error: "API返回数据格式错误，无法解析JSON",
                code: 500,
                rawResponse: response.substring(0, 200) // 显示部分原始响应用于调试
            });
        }
        
        // 检查数据结构 - 应该是一个数组
        if (!Array.isArray(data)) {
            return JSON.stringify({ 
                error: "API返回数据格式不正确，期望数组",
                code: 500,
                dataType: typeof data,
                data: data
            });
        }
        
        // 遍历数组，查找第一个有效的m3u8地址
        var m3u8Url = null;
        var programInfo = null;
        
        for (var i = 0; i < data.length; i++) {
            var program = data[i];
            
            // 检查program是否为对象且包含m3u8字段
            if (program && typeof program === 'object' && program.m3u8) {
                m3u8Url = program.m3u8;
                programInfo = program;
                break; // 找到第一个有效的m3u8地址就停止
            }
        }
        
        // 如果找不到有效的m3u8地址
        if (!m3u8Url) {
            // 检查是否至少有一个节目
            if (data.length === 0) {
                return JSON.stringify({
                    error: "当前频道暂无节目",
                    code: 404,
                    channelId: id,
                    channelName: id === '7' ? '芜湖新闻综合' : '芜湖生活频道',
                    message: "该频道当前没有正在播放的节目"
                });
            } else {
                // 返回节目列表供调试
                var programList = [];
                for (var j = 0; j < Math.min(data.length, 5); j++) {
                    var p = data[j];
                    programList.push({
                        index: j,
                        hasM3U8: !!(p && p.m3u8),
                        programName: p ? p.name || p.title || '未知节目' : '无效节目对象'
                    });
                }
                
                return JSON.stringify({
                    error: "未找到有效的直播流地址",
                    code: 404,
                    channelId: id,
                    programsCount: data.length,
                    samplePrograms: programList
                });
            }
        }
        
        // 返回播放地址
        return JSON.stringify({
            url: m3u8Url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://mapi.wuhunews.cn/",
                "Origin": "https://mapi.wuhunews.cn"
            },
            metadata: {
                channelId: id,
                channelName: id === '7' ? '芜湖新闻综合' : '芜湖生活频道',
                programCount: data.length,
                programIndex: programInfo ? data.indexOf(programInfo) : -1
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            error: "获取芜湖电视台直播地址失败: " + e.toString(),
            code: 500,
            stack: e.stack ? e.stack.substring(0, 200) : "无堆栈信息"
        });
    }
}

// 可选：添加版本信息
var version_ = "芜湖电视台直播源 v1.0";