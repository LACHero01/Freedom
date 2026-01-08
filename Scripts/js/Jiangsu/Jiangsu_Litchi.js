//识别名称main

function main( item ) {
    //获取地址和参数
    const url = item.url;
    var channelId = ku9.getQuery( url, "id" ) || "jsws";
    
    // 频道配置数组
    var channels = {
		/*
        'jsws': 'jsws_live', // 江苏卫视
        'jscs': 'jscs_live', // 江苏城市
        'jszy': 'jszy_live', // 江苏综艺
        'jsys': 'jsys_live', // 江苏影视
        'jsxw': 'jsxw_live', // 江苏新闻
        'jsjy': 'jsjy_live', // 江苏教育
        'jsty': 'jsxx_live', // 江苏体育休闲
        'jsgj': 'jsgj_live', // 江苏国际
        'ymkt': 'ymkt_live'  // 优漫卡通
		*/
		'jsws': 'jswspro', //江苏卫视
		'jscs': 'jscspro', //江苏城市
		'jszy': 'jszypro', //江苏综艺
		'jsys': 'jsyspro', //江苏影视
		'jsxw': 'jsxwpro', //江苏新闻
		'jsxx': 'jsxxpro', //江苏体育休闲
		'ymkt': 'ymktpro', //江苏优漫卡通
		'jsgj': 'jsgjpro', //江苏国际
		'jsjy': 'jsjypro', //江苏教育
		'cftx': 'cftxtxjm', //江苏财富天下
		'nanjing': 'nanjing', //南京新闻综合
		'changzhou': 'czpro', //常州新闻综合
		'taizhou': 'taizhou', //泰州新闻综合
		'taixing': 'taixing', //泰兴综合
		'yancheng': 'yancheng', //盐城新闻综合
		'xinghua': 'xinghua', //兴化新闻综合
		'xuzhou': 'xuzhou', //徐州新闻综合
		'xuyi': 'xuyi', //盱眙综合
		'tongshan': 'tongshan', //铜山新闻综合
		'suqian': 'suqian', //宿迁综合
		'xinyi': 'xinyi',//新沂新闻
		'xiangshui': 'xiangshui', //响水综合
		'siyang': 'siyang', //泗阳综合
		'pizhou': 'pizhou', //邳州综合
		'nantong': 'nantong', //南通新闻综合
		'lianyungang': 'lianyungang', //连云港新闻综合
		'jiangyin': 'jiangyin', //江阴新闻综合
		'jiawang': 'jiawang', //贾汪新闻
		'huaian': 'huaian', //淮安综合
		'hongze': 'hongze' //洪泽综合
    };
    
    // 如果是list请求，返回频道列表
    if (channelId == "list") {
        var baseUrl = url.split('?')[0];
        var content = "#EXTM3U\n";
        
        var channelNames = {
			/*
            'jsws': '江苏卫视',
            'jscs': '江苏城市',
            'jszy': '江苏综艺',
            'jsys': '江苏影视',
            'jsxw': '江苏新闻',
            'jsjy': '江苏教育',
            'jsty': '江苏体育休闲',
            'jsgj': '江苏国际',
            'ymkt': '优漫卡通'
			*/
			'jsws': '江苏卫视',
			'jscs': '江苏城市',
			'jszy': '江苏综艺',
			'jsys': '江苏影视',
			'jsxw': '江苏新闻',
			'jsxx': '江苏体育休闲',
			'ymkt': '江苏优漫卡通',
			'jsgj': '江苏国际',
			'jsjy': '江苏教育',
			'cftx': '江苏财富天下',
			'nanjing': '南京新闻综合',
			'changzhou': '常州新闻综合',
			'taizhou': '泰州新闻综合',
			'taixing': '泰兴综合',
			'yancheng': '盐城新闻综合',
			'xinghua': '兴化新闻综合',
			'xuzhou': '徐州新闻综合',
			'xuyi': '盱眙综合',
			'tongshan': '铜山新闻综合',
			'suqian': '宿迁综合',
			'xinyi': '新沂新闻',
			'xiangshui': '响水综合',
			'siyang': '泗阳综合',
			'pizhou': '邳州综合',
			'nantong': '南通新闻综合',
			'lianyungang': '连云港新闻综合',
			'jiangyin': '江阴新闻综合',
			'jiawang': '贾汪新闻',
			'huaian': '淮安综合',
			'hongze': '洪泽综合'
        };
        
        for (var id in channels) {
            content += "#EXTINF:-1," + channelNames[id] + "\n";
            content += baseUrl + "?id=" + id + "\n";
        }
        
        return { m3u8: content };
    }
    
    // 检查频道ID是否有效
    if (!channels[channelId]) {
        return { url: "", message: "无效的频道ID" };
    }
    
    var channelCode = channels[channelId];
    
    // 方案1：直接使用固定的加密签名（可能已过期）
    // 尝试使用已知可用的参数
    var txTime = "65a3a8c8"; // 示例时间戳，可能需要更新
    var txSecret = "b8f8c0c8e4d0e3f8a8d8c0e8f0a8d0c8"; // 示例签名
    
    // 方案2：尝试生成动态签名（可能需要验证正确的加密算法）
    // 尝试使用不同的时间戳和密钥
    var timestamp = Math.floor(Date.now() / 1000);
    // 尝试不同的时间格式
    var txTime1 = (timestamp + 180).toString(16); // 16进制，180秒后
    var txTime2 = timestamp.toString(16); // 当前时间戳
    var txTime3 = (timestamp + 3600).toString(16); // 1小时后
    
    var appSecret = 'tJanAHkyGtaifaQG4dWe'; // 原密钥
    
    // 生成MD5签名
    function generateMD5(str) {
        // 尝试使用ku9.md5
        if (typeof ku9.md5 === 'function') {
            return ku9.md5(str);
        }
        
        // 简化的MD5实现
        function simpleMD5(s) {
            var L = s.length;
            var N = ((L + 8) >>> 6) + 1;
            var M = new Array(N);
            for (var i = 0; i < N * 16; i++) M[i] = 0;
            for (i = 0; i < L; i++) M[i >> 2] |= (s.charCodeAt(i) & 0xff) << ((i % 4) * 8);
            M[i >> 2] |= 0x80 << ((i % 4) * 8);
            M[N * 16 - 2] = L << 3;
            
            var A = 0x67452301, B = 0xefcdab89, C = 0x98badcfe, D = 0x10325476;
            var F = function(x, y, z) { return (x & y) | (~x & z); };
            var G = function(x, y, z) { return (x & z) | (y & ~z); };
            var H = function(x, y, z) { return x ^ y ^ z; };
            var I = function(x, y, z) { return y ^ (x | ~z); };
            
            var FF = function(a, b, c, d, x, s, ac) {
                a += F(b, c, d) + x + ac;
                a = ((a << s) | (a >>> (32 - s))) + b;
                return a;
            };
            
            var GG = function(a, b, c, d, x, s, ac) {
                a += G(b, c, d) + x + ac;
                a = ((a << s) | (a >>> (32 - s))) + b;
                return a;
            };
            
            var HH = function(a, b, c, d, x, s, ac) {
                a += H(b, c, d) + x + ac;
                a = ((a << s) | (a >>> (32 - s))) + b;
                return a;
            };
            
            var II = function(a, b, c, d, x, s, ac) {
                a += I(b, c, d) + x + ac;
                a = ((a << s) | (a >>> (32 - s))) + b;
                return a;
            };
            
            for (i = 0; i < N; i++) {
                var a = A, b = B, c = C, d = D;
                var j = i * 16;
                
                a = FF(a, b, c, d, M[j+0], 7, 0xd76aa478);
                d = FF(d, a, b, c, M[j+1], 12, 0xe8c7b756);
                c = FF(c, d, a, b, M[j+2], 17, 0x242070db);
                b = FF(b, c, d, a, M[j+3], 22, 0xc1bdceee);
                a = FF(a, b, c, d, M[j+4], 7, 0xf57c0faf);
                d = FF(d, a, b, c, M[j+5], 12, 0x4787c62a);
                c = FF(c, d, a, b, M[j+6], 17, 0xa8304613);
                b = FF(b, c, d, a, M[j+7], 22, 0xfd469501);
                a = FF(a, b, c, d, M[j+8], 7, 0x698098d8);
                d = FF(d, a, b, c, M[j+9], 12, 0x8b44f7af);
                c = FF(c, d, a, b, M[j+10], 17, 0xffff5bb1);
                b = FF(b, c, d, a, M[j+11], 22, 0x895cd7be);
                a = FF(a, b, c, d, M[j+12], 7, 0x6b901122);
                d = FF(d, a, b, c, M[j+13], 12, 0xfd987193);
                c = FF(c, d, a, b, M[j+14], 17, 0xa679438e);
                b = FF(b, c, d, a, M[j+15], 22, 0x49b40821);
                
                a = GG(a, b, c, d, M[j+1], 5, 0xf61e2562);
                d = GG(d, a, b, c, M[j+6], 9, 0xc040b340);
                c = GG(c, d, a, b, M[j+11], 14, 0x265e5a51);
                b = GG(b, c, d, a, M[j+0], 20, 0xe9b6c7aa);
                a = GG(a, b, c, d, M[j+5], 5, 0xd62f105d);
                d = GG(d, a, b, c, M[j+10], 9, 0x2441453);
                c = GG(c, d, a, b, M[j+15], 14, 0xd8a1e681);
                b = GG(b, c, d, a, M[j+4], 20, 0xe7d3fbc8);
                a = GG(a, b, c, d, M[j+9], 5, 0x21e1cde6);
                d = GG(d, a, b, c, M[j+14], 9, 0xc33707d6);
                c = GG(c, d, a, b, M[j+3], 14, 0xf4d50d87);
                b = GG(b, c, d, a, M[j+8], 20, 0x455a14ed);
                a = GG(a, b, c, d, M[j+13], 5, 0xa9e3e905);
                d = GG(d, a, b, c, M[j+2], 9, 0xfcefa3f8);
                c = GG(c, d, a, b, M[j+7], 14, 0x676f02d9);
                b = GG(b, c, d, a, M[j+12], 20, 0x8d2a4c8a);
                
                a = HH(a, b, c, d, M[j+5], 4, 0xfffa3942);
                d = HH(d, a, b, c, M[j+8], 11, 0x8771f681);
                c = HH(c, d, a, b, M[j+11], 16, 0x6d9d6122);
                b = HH(b, c, d, a, M[j+14], 23, 0xfde5380c);
                a = HH(a, b, c, d, M[j+1], 4, 0xa4beea44);
                d = HH(d, a, b, c, M[j+4], 11, 0x4bdecfa9);
                c = HH(c, d, a, b, M[j+7], 16, 0xf6bb4b60);
                b = HH(b, c, d, a, M[j+10], 23, 0xbebfbc70);
                a = HH(a, b, c, d, M[j+13], 4, 0x289b7ec6);
                d = HH(d, a, b, c, M[j+0], 11, 0xeaa127fa);
                c = HH(c, d, a, b, M[j+3], 16, 0xd4ef3085);
                b = HH(b, c, d, a, M[j+6], 23, 0x4881d05);
                a = HH(a, b, c, d, M[j+9], 4, 0xd9d4d039);
                d = HH(d, a, b, c, M[j+12], 11, 0xe6db99e5);
                c = HH(c, d, a, b, M[j+15], 16, 0x1fa27cf8);
                b = HH(b, c, d, a, M[j+2], 23, 0xc4ac5665);
                
                a = II(a, b, c, d, M[j+0], 6, 0xf4292244);
                d = II(d, a, b, c, M[j+7], 10, 0x432aff97);
                c = II(c, d, a, b, M[j+14], 15, 0xab9423a7);
                b = II(b, c, d, a, M[j+5], 21, 0xfc93a039);
                a = II(a, b, c, d, M[j+12], 6, 0x655b59c3);
                d = II(d, a, b, c, M[j+3], 10, 0x8f0ccc92);
                c = II(c, d, a, b, M[j+10], 15, 0xffeff47d);
                b = II(b, c, d, a, M[j+1], 21, 0x85845dd1);
                a = II(a, b, c, d, M[j+8], 6, 0x6fa87e4f);
                d = II(d, a, b, c, M[j+15], 10, 0xfe2ce6e0);
                c = II(c, d, a, b, M[j+6], 15, 0xa3014314);
                b = II(b, c, d, a, M[j+13], 21, 0x4e0811a1);
                a = II(a, b, c, d, M[j+4], 6, 0xf7537e82);
                d = II(d, a, b, c, M[j+11], 10, 0xbd3af235);
                c = II(c, d, a, b, M[j+2], 15, 0x2ad7d2bb);
                b = II(b, c, d, a, M[j+9], 21, 0xeb86d391);
                
                A += a; B += b; C += c; D += d;
            }
            
            var hex = function(n) {
                var s = '', v;
                for (var i = 0; i < 4; i++) {
                    v = (n >>> (i * 8)) & 0xff;
                    s += (v < 16 ? '0' : '') + v.toString(16);
                }
                return s;
            };
            
            return hex(A) + hex(B) + hex(C) + hex(D);
        }
        
        return simpleMD5(str);
    }
    
    // 尝试生成签名
    var txSecretTest = generateMD5(appSecret + channelCode + txTime1);
    
    // 尝试多个可能的直播地址
    var possibleUrls = [];
    
	// 尝试原PHP算法的地址1
    possibleUrls.push("https://litchi-play-encrypted.jstv.com/applive/" + channelCode + ".m3u8?txSecret=" + txSecretTest + "&txTime=" + txTime1);

    // 尝试原PHP算法的地址2
    possibleUrls.push("https://litchi-play-encrypted-site.jstv.com/applive/" + channelCode + ".m3u8?txSecret=" + txSecretTest + "&txTime=" + txTime1);
    
	// 尝试其他可能的地址格式
    possibleUrls.push("https://litchi-play-encrypted.jstv.com/applive/" + channelCode + ".m3u8");
	
    // 尝试其他可能的地址格式
    possibleUrls.push("https://litchi-play-encrypted-site.jstv.com/applive/" + channelCode + ".m3u8");
    
    // 尝试江苏广电的其他可能地址
    possibleUrls.push("https://live.jstv.com/" + channelCode + ".m3u8");
    possibleUrls.push("https://play.jstv.com/" + channelCode + "/playlist.m3u8");
    
    // 尝试测试地址（如果有的话）
    // 可能需要从江苏卫视官网获取最新的播放地址
    
    // 设置请求头
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://live.jstv.com/',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    };
    
    // 尝试每个可能的地址
    for (var i = 0; i < possibleUrls.length; i++) {
        var testUrl = possibleUrls[i];
        console.log("尝试地址：" + testUrl);
        
        try {
            var response = ku9.request(testUrl, "GET", headers, "", true);
            
            if (response.code === 200 && response.body && response.body.includes("#EXTM3U")) {
                console.log("成功获取播放列表：" + testUrl);
                
                // 检查是否需要重写TS文件地址
                if (response.body.includes(".ts")) {
                    // 提取base URL
                    var baseUrl = testUrl.substring(0, testUrl.lastIndexOf('/') + 1);
                    
                    // 重写TS文件地址
                    var rewritten = response.body.replace(
                        /([^\n#][^\n]*\.ts[^\n]*)/gi,
                        function(match, tsPath) {
                            if (tsPath.indexOf('http') === 0 || tsPath.indexOf('//') === 0) {
                                // 已经是完整URL
                                return tsPath;
                            } else {
                                // 相对路径，转换为完整URL
                                return baseUrl + tsPath;
                            }
                        }
                    );
                    
                    return {
                        m3u8: rewritten,
                        headers: headers
                    };
                } else {
                    return {
                        m3u8: response.body,
                        headers: headers
                    };
                }
            }
        } catch (e) {
            console.log("地址测试失败：" + testUrl + ", 错误：" + e.message);
        }
    }
    
    // 如果所有地址都失败，返回可能的替代方案
    return { 
        url: "", 
        message: "无法获取江苏卫视直播流。可能原因：1. 直播源已失效；2. 加密算法已更新；3. 需要从官网获取最新播放地址。" 
    };
}