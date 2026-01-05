// 文件名：dalian.js
// 功能：获取大连电视台直播流地址
// 调用方式：http://你的服务器或本地路径/ku9/js/dalian.js?id=频道ID

function main(item) {
    // 获取请求URL
    const url = item.url;
    
    // 获取频道ID参数，默认为'dlxwzh'
    let id = ku9.getQuery(url, "id") || "dlxwzh";
    
    // 频道ID映射表
    const idn = {
        "dlxwzh": "tcb3IB5", // 大连新闻综合
        "dlsh": "JzcFkF4",   // 大连生活
        "dlwt": "hxT7Fc3",   // 大连文体
        //"dlys": "8cuL6wa",   // 大连影视
        //"dlse": "q6tZ6Ba",   // 大连少儿
        "dlgw": "N4S4uAj"    // 大连乐天购物
    };
    
    // 根据ID获取对应的channelid
    const channelId = idn[id] || idn["dlxwzh"];
    
    // 构建请求URL
    const apiUrl = "http://dlyapp.dltv.cn/apiv4.0/m3u8_notoken.php?channelid=" + channelId;
    
    try {
        // 发送GET请求获取数据
        const response = ku9.get(apiUrl, null);
        
        // 使用正则表达式匹配播放地址
        const regex = /"address":"(.*?)"/g;
        let match;
        const playUrls = [];
        
        while ((match = regex.exec(response)) !== null) {
            playUrls.push(match[1]);
        }
        
        if (playUrls.length > 0) {
            // 处理播放地址（替换转义斜杠）
            const playUrl = playUrls[0].replace(/\\\//g, '/');
            
            // 返回播放地址
            return JSON.stringify({
                url: playUrl
            });
        } else {
            // 没有找到播放地址
            return JSON.stringify({
                error: "未找到播放地址"
            });
        }
    } catch (error) {
        // 处理错误
        return JSON.stringify({
            error: "获取播放地址失败: " + error
        });
    }
}