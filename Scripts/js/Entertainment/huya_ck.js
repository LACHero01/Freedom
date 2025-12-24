// 虎牙直播 - 酷9JS版本
// 转换自: huya_ck.php
// 参数: id=虎牙房间号 (默认: 11342412)
function main(item) {
    try {
        // 获取房间号参数
        var roomId = ku9.getQuery(item.url, "id") || "11342412";
        
        // 设置请求头
        var headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": "https://www.huya.com/",
            "Accept": "application/json, text/plain, */*"
        };
        
        // 1. 获取房间信息
        var roomUrl = "https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=" + roomId;
        var response = ku9.request(roomUrl, 'GET', headers);
        
        if (!response || !response.body) {
            return JSON.stringify({error: "无法获取房间信息"});
        }
        
        // 解析JSON数据
        var roomData;
        try {
            roomData = JSON.parse(response.body);
        } catch (e) {
            return JSON.stringify({error: "房间信息解析失败: " + e.toString()});
        }
        
        // 检查数据是否有效
        if (!roomData || !roomData.data) {
            return JSON.stringify({error: "获取房间信息失败，请检查房间号是否正确"});
        }
        
        var data = roomData.data;
        
        // 2. 提取必要信息
        var uid = data.profileInfo && data.profileInfo.uid;
        if (!uid) {
            return JSON.stringify({error: "无法提取用户ID"});
        }
        
        // 提取流名称
        var streamInfoList = data.stream && data.stream.baseSteamInfoList;
        if (!streamInfoList || !Array.isArray(streamInfoList) || streamInfoList.length === 0) {
            return JSON.stringify({error: "未找到流信息"});
        }
        
        var streamName = streamInfoList[0].sStreamName;
        if (!streamName) {
            return JSON.stringify({error: "无法提取流名称"});
        }
        
        // 3. 随机选择CDN线路
        var cdnList = [0, 1, 2, 3]; // 线路索引
        
        // 获取可用线路
        var multiLine = data.stream && data.stream.flv && data.stream.flv.multiLine;
        if (!multiLine || !Array.isArray(multiLine) || multiLine.length === 0) {
            return JSON.stringify({error: "未找到可用线路"});
        }
        
        // 随机选择线路，最多尝试4次
        var selectedIndex = -1;
        var baseUrl = "";
        var maxRetries = 4;
        
        for (var i = 0; i < maxRetries; i++) {
            // 随机选择一个索引
            var randomIndex = Math.floor(Math.random() * cdnList.length);
            selectedIndex = randomIndex;
            
            // 如果索引超出范围，使用第一个
            if (selectedIndex >= multiLine.length) {
                selectedIndex = 0;
            }
            
            // 获取线路URL
            var lineData = multiLine[selectedIndex];
            if (!lineData || !lineData.url) {
                continue; // 尝试下一个
            }
            
            var url = lineData.url;
            
            // 提取基础URL（问号之前的部分）
            var urlParts = url.split('?');
            baseUrl = urlParts[0];
            
            // 检查baseUrl是否有效
            if (baseUrl && baseUrl.trim() !== "") {
                break; // 找到有效URL，退出循环
            }
        }
        
        // 检查是否找到有效URL
        if (!baseUrl || baseUrl.trim() === "") {
            return JSON.stringify({error: "无法找到有效播放线路"});
        }
        
        // 4. 生成反盗链参数
        // 生成seqid: uid + 当前时间戳（毫秒）
        var currentTime = Date.now();
        var seqid = (parseInt(uid) + currentTime).toString();
        
        var ctype = "tars_wap";
        var t = "102";
        
        // 计算ss: md5(seqid|ctype|t)
        var ssInput = seqid + "|" + ctype + "|" + t;
        var ss = ku9.md5(ssInput);
        
        // 生成wsTime: 当前时间+6小时的十六进制
        var currentUnixTime = Math.floor(currentTime / 1000);
        var wsTimeHex = (currentUnixTime + 21600).toString(16);
        
        // 生成wsSecret: 需要替换$0,$1,$2,$3
        var fmTemplate = "DWq8BcJ3h6DJt6TY_$0_$1_$2_$3";
        var fmReplaced = fmTemplate
            .replace("$0", uid)
            .replace("$1", streamName)
            .replace("$2", ss)
            .replace("$3", wsTimeHex);
        
        var wsSecret = ku9.md5(fmReplaced);
        
        // 5. 构建参数对象
        var params = {
            "wsSecret": wsSecret,
            "wsTime": wsTimeHex,
            "ctype": ctype,
            "seqid": seqid,
            "uid": uid,
            "fs": "bgct",
            "ver": "1",
            "t": t
        };
        
        // 6. 构建查询字符串
        var queryString = Object.keys(params)
            .map(function(key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            })
            .join("&");
        
        // 7. 构建最终播放地址
        var playUrl = baseUrl + "?" + queryString;
        
        // 8. 返回播放地址
        return JSON.stringify({
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.huya.com/"
            }
        });
        
    } catch (e) {
        return JSON.stringify({error: "处理过程中出错: " + e.toString()});
    }
}

// 辅助函数：生成随机整数
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}