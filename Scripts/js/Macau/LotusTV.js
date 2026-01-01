// 澳门莲花卫视直播源 - 酷9JS版本
// 转换自 LotusTV.php
// 功能：获取m3u8并将相对路径转换为绝对路径

function main(item) {
    try {
        // 配置信息
        var masterUrl = 'https://live-hls.macaulotustv.com/lotustv/lotustv.m3u8';
        var referer = 'https://www.lotustv.mo/';
        var baseUrl = 'https://live-hls.macaulotustv.com/';
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": referer,
            "Accept": "*/*"
        };
        
        // 获取主播单
        var response = ku9.get(masterUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({ 
                error: "无法获取m3u8播放列表" 
            });
        }
        
        // 按行分割
        var lines = response.split('\n');
        var processedLines = [];
        
        // 逐行处理
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            
            // 跳过空行
            if (line === '') {
                processedLines.push(line);
                continue;
            }
            
            // 注释行（#开头）保持不变
            if (line.charAt(0) === '#') {
                processedLines.push(line);
                continue;
            }
            
            // 检查是否已经是绝对路径（http或https开头）
            if (line.indexOf('http://') === 0 || line.indexOf('https://') === 0) {
                processedLines.push(line);
                continue;
            }
            
            // 相对路径转换为绝对路径
            // 去除开头的 ./ 或 /
            var relativePath = line.replace(/^\.\//, '').replace(/^\//, '');
            var absolutePath = baseUrl + relativePath;
            
            processedLines.push(absolutePath);
        }
        
        // 合并所有行
        var m3u8Content = processedLines.join('\n');
        
        // 返回处理后的m3u8内容
        return JSON.stringify({
            url: masterUrl,
            type: 'm3u8',
            content: m3u8Content,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": referer
            }
        });
        
    } catch (e) {
        return JSON.stringify({ 
            error: "获取澳门莲花卫视播放地址失败: " + e.toString() 
        });
    }
}