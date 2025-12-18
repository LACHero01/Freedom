// 郑州电视台直播源 - 酷9JS版本
// 来源: zhengzhou2.php
// 频道参数: id=zzxwzh(郑州新闻综合), id=zzsd(郑州商都频道), id=zzwtly(郑州文体旅游)
//           id=zzyj(郑州豫剧频道), id=zzfnet(郑州妇女儿童), id=zzdssh(郑州都市生活)

function main(item) {
    // 频道映射表
    var channelMap = {
        'zzxwzh': '595660085175275520', // 郑州新闻综合
        'zzsd': '595659997191360512',   // 郑州商都频道
        'zzwtly': '595659904266555392', // 郑州文体旅游
        'zzyj': '595659784129105920',   // 郑州豫剧频道
        'zzfnet': '595659666227220480', // 郑州妇女儿童
        'zzdssh': '595659527848742913'  // 郑州都市生活
    };
    
    // 获取频道ID，默认郑州新闻综合
    var id = ku9.getQuery(item.url, "id") || "zzxwzh";
    
    // 验证频道ID
    if (!channelMap.hasOwnProperty(id)) {
        return JSON.stringify({
            code: 404,
            message: '频道不存在',
            available_channels: {
                'zzxwzh': '郑州新闻综合',
                'zzsd': '郑州商都频道',
                'zzwtly': '郑州文体旅游',
                'zzyj': '郑州豫剧频道',
                'zzfnet': '郑州妇女儿童',
                'zzdssh': '郑州都市生活'
            }
        });
    }
    
    try {
        var channelId = channelMap[id];
        var apiUrl = "http://mapi-new.zztv.tv/cloudlive-manage-mapi/api/topic/detail?preview=&id=" + 
                     channelId + "&app_secret=dc302b5bb65d2bb4ad2fa45d282d7763&tenant_id=0&company_id=1015002";
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": "https://h5-new.zztv.tv/",
            "Accept": "application/json, text/plain, */*"
        };
        
        // 发送GET请求
        var response = ku9.get(apiUrl, JSON.stringify(headers));
        
        if (!response) {
            return JSON.stringify({
                code: 500,
                message: '无法获取API数据'
            });
        }
        
        // 解析JSON响应
        var jsonData;
        try {
            jsonData = JSON.parse(response);
        } catch(e) {
            return JSON.stringify({
                code: 500,
                message: 'API返回数据解析失败: ' + e.toString(),
                raw_response: response.substring(0, 200)
            });
        }
        
        // 检查数据结构
        if (!jsonData.topic_camera || 
            !Array.isArray(jsonData.topic_camera) || 
            jsonData.topic_camera.length === 0 ||
            !jsonData.topic_camera[0].streams ||
            !Array.isArray(jsonData.topic_camera[0].streams) ||
            jsonData.topic_camera[0].streams.length === 0 ||
            !jsonData.topic_camera[0].streams[0].hls) {
            
            return JSON.stringify({
                code: 500,
                message: '直播流数据格式错误或为空',
                api_response: jsonData
            });
        }
        
        var hlsUrl = jsonData.topic_camera[0].streams[0].hls;
        
        // 确保URL完整（如果返回的是相对路径，添加基础URL）
        if (hlsUrl && !hlsUrl.startsWith('http')) {
            hlsUrl = "http://live2-new.zztv.tv" + (hlsUrl.startsWith('/') ? '' : '/') + hlsUrl;
        }
        
        // 返回结果
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: getChannelName(id),
            url: hlsUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://h5-new.zztv.tv/"
            }
        });
        
    } catch(e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// 获取频道中文名称
function getChannelName(id) {
    var nameMap = {
        'zzxwzh': '郑州新闻综合',
        'zzsd': '郑州商都频道',
        'zzwtly': '郑州文体旅游',
        'zzyj': '郑州豫剧频道',
        'zzfnet': '郑州妇女儿童',
        'zzdssh': '郑州都市生活'
    };
    return nameMap[id] || '未知频道';
}