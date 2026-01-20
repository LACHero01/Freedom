function main(item) {

    // 读取参数
    var id = ku9.getQuery(item.url, "id") || "zjws";
    var r  = ku9.getQuery(item.url, "r")  || "1080";   // 480 / 720 / 1080

    // 频道映射表
    var map = {
        zjws:   "01", // 浙江卫视
        zjqj:   "02", // 浙江钱江
        zjjjsh: "03", // 浙江经济生活
        zjjkys: "04", // 浙江教科影视
        zjmsxx: "06", // 浙江民生休闲
        zjxw:   "07", // 浙江新闻
        zjse:   "08", // 浙江少儿
        zjgj:   "10", // 浙江国际
        zjhyg:  "11", // 浙江好易购
        zjzjjl: "12"  // 浙江之江纪录
    };

    // 构造路径
    var path = "/live/channel" + map[id] + r + "Pnew.m3u8";

    // 时间戳（秒）
    var ts = Math.floor(Date.now() / 1000);

    // 签名密钥（与 PHP 完全一致）
    var key = "CHWr9VybUeBZE1VB";

    // 生成签名
    var sign = ku9.md5(path + "-" + ts + "-0-0-" + key);

    // auth_key
    var auth_key = ts + "-0-0-" + sign;

    // 随机节点
    //var nodes = ["zwebl02", "zwebl04", "zwebl06"];
	var nodes = ["zwebl02"];
    var host = nodes[Math.floor(Math.random() * nodes.length)];

    // 最终播放地址
    var playurl = "http://" + host + ".cztv.com" + path + "?auth_key=" + auth_key;

    return JSON.stringify({
        url: playurl
    });
}
