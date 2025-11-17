// 深圳台直播源 - 酷9JS版本
// 转换自 shenzhen.php
// 参数: channel=频道名称 (深圳卫视, 深圳少儿, 深圳财经, 深圳电视剧, 宜和购物, 深圳都市, 深圳国际, 深圳移动, 深圳卫视4k)
function main(item) {
    // 设置时区（虽然酷9JS环境可能不支持，但保留）
    try {
        // 尝试设置时区，如果不支持则忽略
        var timezone = 'Asia/Shanghai';
    } catch (e) {
        // 时区设置失败，继续执行
    }
    
    var channel = ku9.getQuery(item.url, "channel") || "深圳卫视";
    channel = channel.toLowerCase();
    
    // 频道映射
    var channelMap = {
        '深圳卫视': 'AxeFRth',
        '深圳少儿': '1SIQj6s', 
        '深圳财经': '3vlcoxP',
        '深圳电视剧': '4azbkoY',
        '宜和购物': 'BJ5u5k2',
        '深圳都市': 'ZwxzUXr',
        '深圳国际': 'sztvgjpd',
        '深圳移动': 'wDF6KJ3',
        '深圳卫视4k': 'R77mK1v'
    };
    
    // 验证频道
    if (!channelMap[channel]) {
        return JSON.stringify({
            code: 400,
            message: '频道名称无效',
            available_channels: {
                '深圳卫视': '深圳卫视',
                '深圳少儿': '深圳少儿频道',
                '深圳财经': '深圳财经频道', 
                '深圳电视剧': '深圳电视剧频道',
                '宜和购物': '深圳宜和购物频道',
                '深圳都市': '深圳都市频道',
                '深圳国际': '深圳国际频道',
                '深圳移动': '深圳移动电视',
                '深圳卫视4k': '深圳卫视4K'
            }
        });
    }
    
    try {
        var hosts = "https://sztv-hls.sztv.com.cn";
        var key = "bf9b2cab35a9c38857b82aabf99874aa96b9ffbb";
        
        // 计算时间戳（当前时间+2小时）
        var currentTime = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
        var dectime = (currentTime + 7200).toString(16); // 2小时后并转为16进制
        
        var rate = "500";
        var channelId = channelMap[channel];
        var pathName = generate_pathname(channelId);
        var path = '/' + channelId + '/' + rate + '/' + pathName + '.m3u8';
        
        // 计算MD5签名
        var sign = ku9.md5(key + path + dectime);
        
        var liveURL = hosts + path + "?sign=" + sign + "&t=" + dectime;
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: liveURL,
            channel: channel
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// 生成路径名（对应PHP中的pathname函数）
function generate_pathname(e) {
    // 获取当天0点的时间戳（毫秒）
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var o = today.getTime();
    
    var a = 0;
    var r = 0;
    var d = -1;
    var p = 0;
    var l = 0;
    
    // 计算r和l
    for (a = 0; a < e.length; a++) {
        p = e.charCodeAt(a);
        r = r + p;
        if (d !== -1) {
            l = l + (d - p);
        }
        d = p;
    }
    
    r = r + l;
    var s = decimalToBase36(r);
    var c = decimalToBase36(o);
    
    var u = 0;
    for (a = 0; a < c.length; a++) {
        u = u + c.charCodeAt(a);
    }
    
    // 重新排列c：取第5位之后的部分 + 前5位
    c = c.substring(5) + c.substring(0, 5);
    var f = Math.abs(u - r);
    c = reverseString(s) + c;
    var g = c.substring(0, 4);
    var w = c.substring(4);
    
    // 获取星期几（0=周日, 1=周一, ... 6=周六）
    var weekDay = new Date().getDay();
    var b = weekDay % 2;
    
    var m = [];
    
    for (a = 0; a < e.length; a++) {
        if (a % 2 == b) {
            var index = a % c.length;
            m.push(c.charAt(index));
        } else {
            var hIndex = a - 1;
            if (hIndex >= 0) {
                var h = e.charAt(hIndex);
                var v = g.indexOf(h);
                if (v === -1) {
                    m.push(h);
                } else {
                    m.push(w.charAt(v));
                }
            } else {
                var gIndex = a % g.length;
                m.push(g.charAt(gIndex));
            }
        }
    }
    
    var result = reverseString(decimalToBase36(f)) + m.join('');
    result = result.substring(0, e.length);
    return result;
}

// 十进制转36进制（模拟PHP的base_convert）
function decimalToBase36(num) {
    return num.toString(36);
}

// 字符串反转
function reverseString(str) {
    return str.split('').reverse().join('');
}