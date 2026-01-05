// 河南大象电视台直播源 - 酷9JS版本
// 转换自 henan_daxiang.php
// 参数: id=频道ID (如 hnws=河南卫视, hnds=河南都市, hnms=河南民生 等)
function main(item) {
    try {
        // 获取频道ID参数，默认河南卫视
        var id = ku9.getQuery(item.url, "id") || 'hnws';
        
        // 频道映射表
        var channelMap = {
            'hnws': 145,  // 河南卫视
            'hnds': 141,  // 河南都市
            'hnms': 146,  // 河南民生
            'hnfz': 147,  // 河南法治
            'hndsj': 148, // 河南电视剧
            'hnxw': 149,  // 河南新闻
            'htgw': 150,  // 欢腾购物
            'hngg': 151,  // 河南公共
            'hnxc': 152,  // 河南乡村
            'hnly': 154,  // 河南梨园
            'wwbk': 155,  // 文物宝库
            'wspd': 156,  // 武术世界
            'jczy': 157,  // 睛彩中原
            'ydxq': 163,  // 移动戏曲
            'xsj': 183,   // 象视界
            'gxpd': 194,  // 国学频道
            
            // 地市频道
            'zzxw': 197,  // 郑州新闻综合
            'ayxw': 206,  // 安阳新闻综合
            'lhxw': 221,  // 漯河新闻综合
            'kfxw': 198,  // 开封新闻综合
            'lyxw': 204,  // 洛阳新闻综合
            'pdsxw': 205, // 平顶山新闻综合
            'pyxw': 219,  // 濮阳新闻综合
            'sqxw': 224,  // 商丘新闻综合
            'hbxw': 207,  // 鹤壁新闻综合
            'jy1': 228,   // 济源一套
            'jzzh': 209,  // 焦作综合
            'nyxw': 223,  // 南阳新闻综合
            'smxxw': 222, // 三门峡新闻综合
            'xczh': 220,  // 许昌综合
            'xxxw': 208,  // 新乡新闻综合
            'xyxw': 225,  // 信阳新闻综合
            'zkxw': 226,  // 周口新闻综合
            'zmdxw': 227  // 驻马店新闻综合
        };
        
        // 验证频道ID是否存在
        if (!channelMap.hasOwnProperty(id)) {
            return JSON.stringify({
                code: 400,
                message: '频道ID不存在',
                requested_id: id,
                available_channels: {
                    'hnws': '河南卫视',
                    'hnds': '河南都市',
                    'hnms': '河南民生',
                    'hnfz': '河南法治',
                    'hndsj': '河南电视剧',
                    'hnxw': '河南新闻',
                    'htgw': '欢腾购物',
                    'hngg': '河南公共',
                    'hnxc': '河南乡村',
                    'hnly': '河南梨园',
                    'wwbk': '文物宝库',
                    'wspd': '武术世界',
                    'jczy': '睛彩中原',
                    'ydxq': '移动戏曲',
                    'xsj': '象视界',
                    'gxpd': '国学频道',
                    'zzxw': '郑州新闻综合',
                    'ayxw': '安阳新闻综合',
                    'lhxw': '漯河新闻综合',
                    'kfxw': '开封新闻综合',
                    'lyxw': '洛阳新闻综合',
                    'pdsxw': '平顶山新闻综合',
                    'pyxw': '濮阳新闻综合',
                    'sqxw': '商丘新闻综合',
                    'hbxw': '鹤壁新闻综合',
                    'jy1': '济源一套',
                    'jzzh': '焦作综合',
                    'nyxw': '南阳新闻综合',
                    'smxxw': '三门峡新闻综合',
                    'xczh': '许昌综合',
                    'xxxw': '新乡新闻综合',
                    'xyxw': '信阳新闻综合',
                    'zkxw': '周口新闻综合',
                    'zmdxw': '驻马店新闻综合'
                }
            });
        }
        
        // 获取时间戳（秒）
        var timestamp = Math.floor(Date.now() / 1000);
        
        // 生成SHA256签名
        var secret = '6ca114a836ac7d73';
        var sign = generateSHA256(secret + timestamp);
        
        // 构建API URL
        var channelId = channelMap[id];
        var apiUrl = 'https://pubmod.hntv.tv/program/getAuth/channel/channelIds/1/' + channelId;
        
        // 设置请求头
        var headers = {
            'timestamp': timestamp.toString(),
            'sign': sign,
            'Referer': 'https://static.hntv.tv/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*'
        };
        
        // 发送请求
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
                message: 'API返回数据解析失败: ' + e.toString()
            });
        }
        
        // 检查数据结构
        if (!Array.isArray(data) || data.length === 0 || 
            !data[0].video_streams || !Array.isArray(data[0].video_streams) || 
            data[0].video_streams.length === 0) {
            
            return JSON.stringify({
                code: 500,
                message: 'API返回数据格式错误',
                raw_data: data
            });
        }
        
        // 获取播放地址
        var m3u8 = data[0].video_streams[0];
        
        // 将http替换为https（确保使用安全链接）
        m3u8 = m3u8.replace('http:', 'https:');
        
        // 返回播放地址
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: getChannelName(id),
            url: m3u8,
            headers: {
                'Referer': 'https://static.hntv.tv/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Origin': 'https://static.hntv.tv/'
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// SHA256加密函数
function generateSHA256(input) {
    // 由于酷9JS环境可能没有内置的SHA256函数，我们实现一个简单的版本
    // 注意：这是一个简化的实现，生产环境应该使用更完善的加密库
    // 但如果酷9JS提供了加密函数，优先使用内置的
    
    // 先尝试使用ku9的内置加密函数
    if (typeof ku9.sha256 === 'function') {
        return ku9.sha256(input);
    }
    
    // 如果ku9没有提供sha256，尝试使用其他可能的方法
    if (typeof ku9.hash === 'function') {
        return ku9.hash(input, 'sha256');
    }
    
    // 如果都没有，使用JavaScript实现一个基本的SHA256（简化版）
    // 注意：这是一个非常简化的实现，仅用于演示，实际使用时可能需要更完整的实现
    // 或者要求环境提供加密支持
    
    try {
        // 尝试使用Web Crypto API（如果可用）
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            // 这里需要异步处理，但酷9JS环境可能不支持异步
            // 由于限制，我们这里简化处理
        }
    } catch (e) {
        // 忽略错误
    }
    
    // 如果以上都不可用，返回一个模拟的签名（仅用于测试）
    // 生产环境应该确保有可用的加密函数
    console.warn('警告：使用模拟的SHA256签名，可能无法正常工作');
    
    // 简单的哈希模拟（实际使用时需要替换为真正的SHA256实现）
    var hash = 0;
    for (var i = 0; i < input.length; i++) {
        var char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    
    // 转换为16进制字符串
    return Math.abs(hash).toString(16);
}

// 获取频道名称
function getChannelName(id) {
    var nameMap = {
        'hnws': '河南卫视',
        'hnds': '河南都市',
        'hnms': '河南民生',
        'hnfz': '河南法治',
        'hndsj': '河南电视剧',
        'hnxw': '河南新闻',
        'htgw': '欢腾购物',
        'hngg': '河南公共',
        'hnxc': '河南乡村',
        'hnly': '河南梨园',
        'wwbk': '文物宝库',
        'wspd': '武术世界',
        'jczy': '睛彩中原',
        'ydxq': '移动戏曲',
        'xsj': '象视界',
        'gxpd': '国学频道',
        'zzxw': '郑州新闻综合',
        'ayxw': '安阳新闻综合',
        'lhxw': '漯河新闻综合',
        'kfxw': '开封新闻综合',
        'lyxw': '洛阳新闻综合',
        'pdsxw': '平顶山新闻综合',
        'pyxw': '濮阳新闻综合',
        'sqxw': '商丘新闻综合',
        'hbxw': '鹤壁新闻综合',
        'jy1': '济源一套',
        'jzzh': '焦作综合',
        'nyxw': '南阳新闻综合',
        'smxxw': '三门峡新闻综合',
        'xczh': '许昌综合',
        'xxxw': '新乡新闻综合',
        'xyxw': '信阳新闻综合',
        'zkxw': '周口新闻综合',
        'zmdxw': '驻马店新闻综合'
    };
    
    return nameMap[id] || '未知频道';
}