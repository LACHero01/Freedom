// 军号直播源 - 酷9JS版本
// 转换自 ChinkJunhao.php
function main(item) {
    try {
        // API URL
        var apiUrl = 'https://api.junhao.mil.cn/cmsback/api/micro/live/seat/findPage?articleId=5234612';
        
        // 设置请求头
        var headers = {
            "Tenantid": "b81ab1497ae1133dbc41e584912d77aa",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
        };
        
        // 发送GET请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取API数据，请求失败'
            });
        }
        
        // 检查响应状态码（模拟PHP的HTTP状态码检查）
        // 注意：ku9.get()不直接返回状态码，我们需要通过其他方式判断
        // 如果响应包含错误信息，可能是请求失败
        
        // 解析JSON数据
        var data;
        try {
            data = JSON.parse(response);
        } catch (e) {
            return JSON.stringify({
                code: 500,
                message: 'API返回数据解析失败',
                error: e.toString()
            });
        }
        
        // 检查数据结构 - 三层检查
        if (!data || !data.data || !data.data.pageRecords || 
            !Array.isArray(data.data.pageRecords) || 
            data.data.pageRecords.length === 0 || 
            !data.data.pageRecords[0].livePath) {
            
            return JSON.stringify({
                code: 404,
                message: '未找到直播流地址',
                debug: {
                    data_structure: JSON.stringify(data).substring(0, 200) + '...'
                }
            });
        }
        
        // 获取直播流地址
        var livePath = data.data.pageRecords[0].livePath;
        
        // 确保URL是完整的
        if (livePath && !livePath.startsWith('http')) {
            if (livePath.startsWith('//')) {
                livePath = 'https:' + livePath;
            } else {
                livePath = 'https://' + livePath;
            }
        }
        
        // 返回播放地址
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: '军号直播',
            url: livePath,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://api.junhao.mil.cn/",
                "Origin": "https://api.junhao.mil.cn"
            }
        });
        
    } catch (e) {
        // 捕获未处理的异常
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错',
            error: e.toString()
        });
    }
}