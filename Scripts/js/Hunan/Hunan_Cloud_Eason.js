// 湖南县级电视台直播源 - 酷9JS版本
// 来源: hny.php
// 参数: id=7(桂阳新闻综合), id=18(中方县电视台), id=20(芷江电视台), id=23(新晃综合)
//           id=27(耒阳电视台), id=31(汉寿综合), id=34(靖州综合), id=38(麻阳电视台)
//           id=40(永兴新闻综合), id=131(双峰县电视台), id=134(花垣综合), id=143(吉首综合)
//           id=144(古丈电视台), id=148(临武综合), id=149(汝城电视台), id=157(桃源综合)
//           id=158(攸县新闻综合), id=163(沅江融媒), id=165(湘阴综合), id=166(汨罗综合)
//           id=170(新化电视台), id=174(桂东融媒), id=182(绥宁电视台), id=183(衡阳县电视台)
//           id=184(嘉禾新闻综合), id=185(桑植新闻综合)

function main(item) {
    // 映射表
    var channelMap = {
        '7': '7_7c833e',    // 桂阳综合
		//'13': '13_46d84a',  //邵东电视台
        '18': '18_3aa230',  // 中方县电视台
		//'21': '21_f71392',  //东安电视
        '20': '20_68acda',  // 芷江电视台
        '23': '23_5d556a',  // 新晃综合
		//'24': '24_6c8648',  // 洪江区电视台
		//'26': '26_370917',  // 蓝山电视台,切片卡顿
        '27': '27_e9e1e5',  // 耒阳电视台
        '31': '31_226756',  // 汉寿综合
		//'33': '33_eb14e5',  //祁阳电视
        '34': '34_5156ed',  // 靖州综合
        '38': '38_6f397d',  // 麻阳电视台
        '40': '40_1d0ed0',  // 永兴新闻综合
        '131': '131_acfb72', // 双峰县电视台
        '134': '134_180adf', // 花垣综合
        '143': '143_70175b', // 吉首综合
        '144': '144_4efb38', // 古丈电视台
		//'146': '146_f067fe', // 龙山综合,无画面只有声音
        '148': '148_feda2f', // 临武综合
        '149': '149_a8efd8', // 汝城电视台
        '157': '157_66df9e', // 桃源综合
        '158': '158_423c80', // 攸县新闻综合
        '163': '163_2c7011', // 沅江融媒
        '165': '165_13506b', // 湘阴综合
        '166': '166_a4ad1b', // 汨罗综合
		'168': '168_e04f1e', // 平江综合
		'169': '169_b4d7a4', // 城步电视
        '170': '170_49c556', // 新化电视台
		//'171': '171_daca67', // 新邵新闻综合
        '174': '174_6ab9f8', // 桂东融媒
		//'180': '180_60f888', // 衡东县电视台
        '182': '182_3c0dc6', // 绥宁电视台
        '183': '183_554704', // 衡阳县电视台
        '184': '184_e3af1a', // 嘉禾新闻综合
        '185': '185_938292',  // 桑植新闻综合
		//'203': '203_10cdf5',  //长沙县新闻综合
		//'204': '204_16cb0f'  //安化综合
    };
    
    // 获取ID，默认桂阳新闻综合
    var id = ku9.getQuery(item.url, "id") || "7";
    
    // 验证ID
    if (!channelMap.hasOwnProperty(id)) {
        return JSON.stringify({
            code: 404,
            message: '不存在',
            available_channels: getAvailableChannels()
        });
    }
    
    try {
        // 构建播放地址
        var channelCode = channelMap[id];
        var playUrl = "https://liveplay-srs.voc.com.cn/hls/tv/" + channelCode + ".m3u8";
        
        var headers = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 13; PGZ110 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36",
            "Referer": "https://xhncloud.voc.com.cn/",
            "Accept": "application/vnd.apple.mpegurl, */*"
        };
        
        // 可选：测试m3u8地址是否可访问
        var testResponse = ku9.get(playUrl, JSON.stringify(headers));
        
        if (!testResponse || !testResponse.includes('#EXTM3U')) {
            return JSON.stringify({
                code: 500,
                message: '播放地址无效或无法访问',
                url: playUrl,
                test_response: testResponse ? testResponse.substring(0, 100) : '无响应'
            });
        }
        
        // 返回结果
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: getChannelName(id),
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 13; PGZ110 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Mobile Safari/537.36",
                "Referer": "https://xhncloud.voc.com.cn/"
            }
        });
        
    } catch(e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// 获取中文名称
function getChannelName(id) {
    var nameMap = {
        '7': '桂阳新闻综合',
		//'13': '邵东电视台',
        '18': '中方县电视台',
		//'21': '东安电视',
        '20': '芷江电视台',
        '23': '新晃综合',
		//'24': '洪江区电视台',
		//'26': '蓝山电视台-切片卡顿',
        '27': '耒阳电视台',
        '31': '汉寿综合',
		//'33': '祁阳电视',
        '34': '靖州综合',
        '38': '麻阳电视台',
        '40': '永兴新闻综合',
        '131': '双峰县电视台',
        '134': '花垣综合',
        '143': '吉首综合',
        '144': '古丈电视台',
		//'146': '龙山综合-无画面只有声音',
        '148': '临武综合',
        '149': '汝城电视台',
        '157': '桃源综合',
        '158': '攸县新闻综合',
        '163': '沅江融媒',
        '165': '湘阴综合',
        '166': '汨罗综合',
		'168': '平江综合',
		'169': '城步电视',
        '170': '新化电视台',
		//'171': '新邵新闻综合',
        '174': '桂东融媒',
		//'180': '衡东县电视台',
        '182': '绥宁电视台',
        '183': '衡阳县电视台',
        '184': '嘉禾新闻综合',
        '185': '桑植新闻综合'
		//'203': '长沙县新闻综合',
		//'204': '安化综合'
    };
    return nameMap[id] || '未知';
}

// 获取可用的列表
function getAvailableChannels() {
    var nameMap = getChannelName;
    var result = {};
    for (var key in nameMap) {
        if (nameMap.hasOwnProperty(key) && typeof nameMap[key] === 'function') {
            result[key] = nameMap(key);
        }
    }
    return result;
}