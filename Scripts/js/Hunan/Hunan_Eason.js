// 湖南电视台直播源 - 酷9JS版本
// 来源: hunan.php
// 频道参数: id=hnjs(湖南经视), id=hnyl(湖南娱乐), id=hndy(湖南电影), id=hnds(湖南都市)
//           id=hndsj(湖南电视剧), id=hnaw(湖南爱晚), id=hngj(湖南国际), id=jyjs(金鹰纪实)
//           id=jykt(金鹰卡通), id=xfpy(先锋乒羽), id=klcd(快乐垂钓), id=cpd(茶频道)
//           id=csxwzh(长沙新闻综合), id=cszfpd(长沙政法频道), id=csnxpd(长沙女性频道), id=klg(快乐购)

function main(item) {
    // 频道映射表
    var channelMap = {
        'hnjs': '280',   // 湖南经视
        'hnyl': '344',   // 湖南娱乐
        'hndy': '221',   // 湖南电影
        'hnds': '346',   // 湖南都市
        'hndsj': '484',  // 湖南电视剧
        'hnaw': '261',   // 湖南爱晚
        'hngj': '229',   // 湖南国际
        'jyjs': '316',   // 金鹰纪实
        'jykt': '287',   // 金鹰卡通
        'xfpy': '329',   // 先锋乒羽
        'klcd': '218',   // 快乐垂钓
        'cpd': '578',    // 茶频道
        'csxwzh': '269', // 长沙新闻综合
        'cszfpd': '254', // 长沙政法频道
        'csnxpd': '230', // 长沙女性频道
        'klg': '267'     // 快乐购
    };
    
    // 获取频道ID，默认湖南经视
    var id = ku9.getQuery(item.url, "id") || "hnjs";
    
    // 验证频道ID
    if (!channelMap.hasOwnProperty(id)) {
        return JSON.stringify({
            code: 404,
            message: '频道不存在',
            available_channels: {
                'hnjs': '湖南经视',
                'hnyl': '湖南娱乐',
                'hndy': '湖南电影',
                'hnds': '湖南都市',
                'hndsj': '湖南电视剧',
                'hnaw': '湖南爱晚',
                'hngj': '湖南国际',
                'jyjs': '金鹰纪实',
                'jykt': '金鹰卡通',
                'xfpy': '先锋乒羽',
                'klcd': '快乐垂钓',
                'cpd': '茶频道',
                'csxwzh': '长沙新闻综合',
                'cszfpd': '长沙政法频道',
                'csnxpd': '长沙女性频道',
                'klg': '快乐购'
            }
        });
    }
    
    try {
        // 构建API URL
        var channelId = channelMap[id];
        var apiUrl = "http://pwlp.bz.mgtv.com/v1/epg/turnplay/getLivePlayUrlMPP?version=PCweb_1.0&platform=1&buss_id=2000001&channel_id=" + channelId;
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "http://www.mgtv.com/"
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
        if (!jsonData.data || !jsonData.data.url) {
            return JSON.stringify({
                code: 500,
                message: 'API返回数据格式错误，未找到播放地址',
                api_response: jsonData
            });
        }
        
        var playUrl = jsonData.data.url;
        
        // 返回结果
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: getChannelName(id),
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "http://www.mgtv.com/"
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
        'hnjs': '湖南经视',
        'hnyl': '湖南娱乐',
        'hndy': '湖南电影',
        'hnds': '湖南都市',
        'hndsj': '湖南电视剧',
        'hnaw': '湖南爱晚',
        'hngj': '湖南国际',
        'jyjs': '金鹰纪实',
        'jykt': '金鹰卡通',
        'xfpy': '先锋乒羽',
        'klcd': '快乐垂钓',
        'cpd': '茶频道',
        'csxwzh': '长沙新闻综合',
        'cszfpd': '长沙政法频道',
        'csnxpd': '长沙女性频道',
        'klg': '快乐购'
    };
    return nameMap[id] || '未知频道';
}