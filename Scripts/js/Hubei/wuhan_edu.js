// 武汉教育直播源 - 酷9JS版本
// 转换自: wuhan_edu.php
function main(item) {
    try {
        // API地址
        var apiUrl = 'https://ronghehao.whjyapp.com/v3/media_channel_program/programList';
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://ronghehao.whjyapp.com/",
            "Origin": "https://ronghehao.whjyapp.com"
        };
        
        // 发送GET请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取API数据'
            });
        }
        
        // 解析JSON数据
        var data;
        try {
            data = JSON.parse(response);
        } catch (e) {
            return JSON.stringify({
                code: 500,
                message: 'JSON解析失败: ' + e.toString(),
                raw_response_preview: response.substring(0, 200)
            });
        }
        
        // 检查数据结构
        if (!data || !data.data || !data.data.program_list || !Array.isArray(data.data.program_list)) {
            return JSON.stringify({
                code: 500,
                message: 'API返回数据格式错误',
                api_response: data
            });
        }
        
        var programList = data.data.program_list;
        var playUrl = null;
        
        // 倒序查找第一个有play_url的项（原PHP脚本逻辑）
        for (var i = programList.length - 1; i >= 0; i--) {
            var program = programList[i];
            if (program.play_url && program.play_url.trim() !== '') {
                playUrl = program.play_url;
                break;
            }
        }
        
        // 检查是否找到播放地址
        if (!playUrl) {
            return JSON.stringify({
                code: 404,
                message: '未找到有效的播放地址',
                program_count: programList.length,
                available_programs: programList.map(p => ({ 
                    id: p.id,
                    has_play_url: !!(p.play_url && p.play_url.trim())
                }))
            });
        }
        
        // 验证播放地址格式
        if (!playUrl.startsWith('http://') && !playUrl.startsWith('https://')) {
            return JSON.stringify({
                code: 500,
                message: '播放地址格式错误',
                extracted_url: playUrl,
                note: '地址应该以http://或https://开头'
            });
        }
        
        // 返回播放地址和headers
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://ronghehao.whjyapp.com/",
                "Origin": "https://ronghehao.whjyapp.com"
            },
            info: {
                source: "武汉教育",
                api_endpoint: apiUrl,
                extraction_method: "从program_list倒序查找第一个有play_url的项"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中发生错误: ' + e.toString(),
            stack: e.stack
        });
    }
}

// 使用说明：
// 直接调用该脚本，无需参数
// 例如: http://yourdomain.com/wuhan_edu.js