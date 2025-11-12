// 安徽电视台直播源 - 酷9JS版本
// 转换自 anhuisx.php
// 频道参数: ahwssx=安徽卫视, jjshtv=安徽经济生活, ystv=安徽影视, ggtv=安徽公共, nykjtv=安徽农业科教, zytytv=安徽综艺体育, gjtv=安徽国际, aqpd=安庆新闻综合, latv=六安综合, hbxw=淮北新闻综合, szxw=宿州新闻综合, whxw=芜湖新闻综合, xctv=宣城综合, bbtv=蚌埠新闻
function main(item) {
    // 获取频道ID
    var id = ku9.getQuery(item.url, "id") || 'ahwssx';
    
    try {
        // 生成加密的播放URL
        var playUrl = com_mediacloud_app_newsmodule_utils_encodeUrl('https://live.ahsx.ahtv.cn/live', id);
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: playUrl
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '生成播放地址失败: ' + e.toString()
        });
    }
}

function com_mediacloud_app_newsmodule_utils_encodeUrl(liveDomain, channelId) {
    var tx_auth_key = AppFactoryGlobalConfig_ServerAppConfigInfo_OtherConfig_tx_auth_key();
    var hexString = Long_toHexString((System_currentTimeMillis() + EFFECTIVETIME()) / TimeConstants_SEC());
    var md5Hash = MD5Util_MD5Encode(tx_auth_key + channelId + hexString, "utf-8");
    
    var finalUrl = liveDomain + '/' + channelId + ".m3u8?txSecret=" + md5Hash + "&txTime=" + hexString;
    
    return finalUrl;
}

function MD5Util_MD5Encode(str, encoding) {
    return ku9.md5(str);
}

function TimeConstants_SEC() {
    return 1000;
}

function EFFECTIVETIME() {
    return 7200000;
}

function System_currentTimeMillis() {
    return Date.now();
}

function Long_toHexString(number) {
    return Math.floor(number).toString(16).toUpperCase();
}

function AppFactoryGlobalConfig_ServerAppConfigInfo_OtherConfig_tx_auth_key() {
    return '3PyAeRCExDGfWezz6pGs';
}