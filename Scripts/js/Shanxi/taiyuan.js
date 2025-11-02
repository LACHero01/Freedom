function main(item) {
    const id = item.id || 'tyzh';
    const n = {
        'tyzh': '49VAfrw',  // 太原新闻综合
        'tyjj': 'u8BmT6h',  // 太原经济生活
        'tyfz': 'phsry3e',  // 太原社教法制
        'tyys': 'J4EX72D',  // 太原影视
        'tywt': 'rk8Z088',  // 太原文体
        'tyblg': 'iancgyD',  // 太原佰乐购
        'tycs': 'i88rmGU',  // 太原城市生活
        'tyjy': 'g4XtSCF',  // 太原教育
    };
    const t = Math.floor(Date.now() / 1000);
    const token = ku9.md5(t + n[id] + 'cutvLiveStream|Dream2017');
    const url = `https://hls-api.sxtygdy.com/getCutvHlsLiveKey?t=${t}&token=${token}&id=${n[id]}`;
    const res = ku9.request(url, "GET");
    const playurl = `https://tytv-hls.sxtygdy.com/${n[id]}/500/${res.body}.m3u8`;
    return { url: playurl };
}