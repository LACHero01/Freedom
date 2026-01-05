// 河北地方电视台直播源 - 酷9JS版本
// 来源: hebeidf.php
// 频道参数: id=bdxwzh(保定新闻综合), id=bdgg(保定公共), id=bdshjk(保定生活健康) 等

function main(item) {
    // 频道映射数组 - 拼音缩写 => 频道标识
    var channelMap = {
        "bdxwzh": "jybd",          // 保定新闻综合
        "bdgg": "bdxw1",           // 保定公共
        "bdshjk": "bddst",         // 保定生活健康
        "cdxwzh": "cdsxwzhtv",     // 承德新闻综合
        "cdwhly": "cdsggshtv",     // 承德旅游文化
        "hdxwzh": "hdxwzh",        // 邯郸新闻综合
        "hdgg": "hdgg",            // 邯郸公共
        "hdkjjy": "hdkj",          // 邯郸科技教育
        "xtcssh": "xtcsshpd",      // 邢台城市生活
        "xsdst": "jiyunxushui123", // 徐水电视台
        "xinglongzh": "xlzh",      // 兴隆综合
       // "xinlezh": "XLTV",         // 新乐综合
       // "wczh": "wczhpd",          // 围场综合
        "wdds": "wddst",           // 望都电视台
        "slxw": "slxw",            // 双滦新闻
       // "slys": "slys",            // 双滦影视
        "sxxwzh": "SXTV1",         // 涉县新闻综合
        "shzh": "jiyunsanhe3",     // 三河综合
        "rqxwzh": "rqtv1",         // 任丘新闻综合
        "qyxw": "qyxwpd",          // 清苑综合
        "qysh": "qyshpd",          // 清苑综合
        "qhxwzh": "qinghe",        // 清河新闻综合
        //"qhjjzy": "qinghe1",       // 清河经济综艺
        "qxxw": "qxtvlive1",       // 青县新闻
        "pqzh": "pqzh",            // 平泉综合
        "pqys": "pqys",            // 平泉影视
        "npzh": "npdspd",          // 南皮综合
        "nhzh": "NHTV1",           // 南和综合
        "nhys": "NHTV2",           // 南和影视
        "ngdst": "ngtv1",          // 南宫电视台
        "lqzh": "luquanyi",        // 鹿泉综合
        "lqgbdst": "luquaner",     // 鹿泉区广播电视台
        "lhzh": "lhtv",            // 隆化综合
        "lxzh": "lx1",             // 临西综合
        "lxsh": "lx2",             // 临西生活
        "lyzh": "jiyunlaiyuan",    // 涞源综合
        "lsdst": "lsdst",          // 涞水综合
        "gyrm": "gaoyiyitao",      // 高邑融媒
        "fnzh": "fengningzonghe",  // 丰宁综合
        //"fnyl": "fengningyulepindao", // 丰宁娱乐
        "dzxwzh": "xxzhpd",        // 定州新闻综合
        //"dzsh": "shpd",            // 定州生活
        //"dzgxys": "yspd",          // 定州国学影视
        "cldst": "clzhpd"          // 昌黎电视台
    };
    
    // 获取频道ID，默认保定新闻综合
    var id = ku9.getQuery(item.url, "id") || "bdxwzh";
    
    // 检查频道ID是否存在，不存在则使用默认值
    if (!channelMap.hasOwnProperty(id)) {
        id = "bdxwzh"; // 如果频道ID不存在，默认返回保定新闻综合
        
        // 可选：返回错误信息，告知用户使用了默认频道
        // return JSON.stringify({
        //     code: 404,
        //     message: '频道不存在，已切换至默认频道',
        //     default_channel: '保定新闻综合',
        //     available_channels: getChannelList()
        // });
    }
    
    // 构建直播源URL
    var streamId = channelMap[id];
    var playUrl = "http://jwcdnqx.hebyun.com.cn/live/" + streamId + "/1500k/tzwj_video.m3u8";
    
    // 返回结果
    return JSON.stringify({
        code: 200,
        message: '获取成功',
        channel: getChannelName(id),
        id: id,
        url: playUrl,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "http://jwcdnqx.hebyun.com.cn/"
        }
    });
}

// 获取频道中文名称
function getChannelName(id) {
    var nameMap = {
        "bdxwzh": "保定新闻综合",
        "bdgg": "保定公共",
        "bdshjk": "保定生活健康",
        "cdxwzh": "承德新闻综合",
        "cdwhly": "承德旅游文化",
        "hdxwzh": "邯郸新闻综合",
        "hdgg": "邯郸公共",
        "hdkjjy": "邯郸科技教育",
        "xtcssh": "邢台城市生活",
        "xsdst": "徐水电视台",
        "xinglongzh": "兴隆综合",
      //  "xinlezh": "新乐综合",
      //  "wczh": "围场综合",
        "wdds": "望都电视台",
        "slxw": "双滦新闻",
        "slys": "双滦影视",
        "sxxwzh": "涉县新闻综合",
        "shzh": "三河综合",
        "rqxwzh": "任丘新闻综合",
        "qyxw": "清苑综合",
        "qysh": "清苑综合",
        "qhxwzh": "清河新闻综合",
        //"qhjjzy": "清河经济综艺",
        "qxxw": "青县新闻",
        "pqzh": "平泉综合",
        "pqys": "平泉影视",
        "npzh": "南皮综合",
        "nhzh": "南和综合",
        "nhys": "南和影视",
        "ngdst": "南宫电视台",
        "lqzh": "鹿泉综合",
        "lqgbdst": "鹿泉区广播电视台",
        "lhzh": "隆化综合",
        "lxzh": "临西综合",
        "lxsh": "临西生活",
        "lyzh": "涞源综合",
        "lsdst": "涞水综合",
        "gyrm": "高邑融媒",
        "fnzh": "丰宁综合",
        //"fnyl": "丰宁娱乐",
        "dzxwzh": "定州新闻综合",
        //"dzsh": "定州生活",
        //"dzgxys": "定州国学影视",
        "cldst": "昌黎电视台"
    };
    
    return nameMap[id] || "未知频道";
}

// 获取可用的频道列表（如果需要返回给用户）
function getChannelList() {
    var nameMap = getChannelName;
    var result = {};
    for (var key in channelMap) {
        if (channelMap.hasOwnProperty(key)) {
            result[key] = getChannelName(key);
        }
    }
    return result;
}

// 可选：测试播放地址是否有效
function testUrl(url) {
    // 这个函数可以在需要时添加，用于测试m3u8地址是否可访问
    // 但通常不需要，因为直接返回地址让播放器测试即可
    return true;
}