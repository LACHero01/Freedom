// 转换难度: ⭐⭐⭐⭐ 部分转换（简化版）
// 文件名: Yunnan.js
// 说明: 去除了缓存和TS代理功能，只提取播放地址

function main(item) {
    // 获取频道ID，默认yunnanweishi
    var channelId = ku9.getQuery(item.url, "id") || 'yunnanweishi';
    
    // 可用频道列表
    var availableChannels = {
        'yunnanweishi': '云南卫视',
        'yunnandushi': '云南都市',
        'yunnanyule': '云南娱乐',
        'yunnangonggong': '康旅频道',
        'yunnanguoji': '澜湄国际',
        'yunnanshaoer': '云南少儿'
    };
    
    try {
        // 第一步：从API获取加密参数
        var apiUrl = 'https://yntv-api.yntv.cn/index/jmd/getRq?name=' + channelId;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "Referer": "https://www.yntv.cn/"
        };
        
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                error: '无法获取频道参数'
            });
        }
        
        var data = JSON.parse(response);
        
        if (!data.url || !data.string || !data.time) {
            return JSON.stringify({
                error: 'API返回数据格式错误'
            });
        }
        
        // 第二步：构建索引M3U8地址
        var indexM3u8Url = 'https://tvlive.yntv.cn' + data.url + 
                          '?wsSecret=' + data.string + 
                          '&wsTime=' + data.time;
        
        // 第三步：获取索引M3U8内容
        var indexContent = ku9.get(indexM3u8Url, JSON.stringify(headers));
        
        if (!indexContent) {
            return JSON.stringify({
                error: '无法获取索引M3U8文件'
            });
        }
        
        // 第四步：解析M3U8，提取实际播放地址
        var actualM3u8Url = indexM3u8Url;
        
        // 检查是否为多码率索引文件
        if (indexContent.indexOf('#EXT-X-STREAM-INF:') !== -1) {
            var lines = indexContent.split('\n');
            
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                
                // 跳过注释行
                if (line.length > 0 && line.charAt(0) !== '#') {
                    // 判断是否为绝对路径
                    if (line.indexOf('http://') === 0 || line.indexOf('https://') === 0) {
                        actualM3u8Url = line;
                    } else {
                        // 相对路径，需要拼接
                        var baseUrl = indexM3u8Url.substring(0, indexM3u8Url.lastIndexOf('/'));
                        actualM3u8Url = baseUrl + '/' + line;
                    }
                    break;
                }
            }
        }
        
        return JSON.stringify({
            url: actualM3u8Url,
            headers: headers,
            warning: '简化版本：已移除缓存和TS代理功能，直接返回播放地址'
        });
        
    } catch (e) {
        return JSON.stringify({
            error: '处理过程中出错: ' + e.toString()
        });
    }
}