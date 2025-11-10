function main(item) {
	/*
	铜山新闻综合,http://A/ku9/js/Jiangsu/tongshan.js?id=tsxwzh
	铜山2,http://A/ku9/js/Jiangsu/tongshan.js?id=tssn
	*/
    const id = item.id || 'tsxwzh';
    const n = {
        'tsxwzh': 10,
        'tssn': 9,
        '4g': 12,
        '4g1': 13,
        'tstv2': 14,
        'qht': 15,
        'llzb': 16,
    };
    
    const url = `http://mapi.tstvxmt.com/api/v1/channel.php?channel_id=${n[id]}`;
    
    const res = ku9.request(url);
    if (res.code === 200) {
        const data = JSON.parse(res.body);
        if (data && data.length > 0 && data[0].m3u8) {
            const m3u8 = data[0].m3u8;
            return { url: m3u8 };
        } else {
            return { error: "URL Error: No m3u8 found" };
        }
    } else {
        return { error: "获取数据出错..." };
    }
}
