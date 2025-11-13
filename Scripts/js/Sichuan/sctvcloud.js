// 四川电视台云平台直播源 - 酷9JS版本
// 转换自 sctvcloud.php
// 频道参数: id=频道代码, t=格式(hls/flv，默认为hls)
function main(item) {
    // 频道映射表
    var channelMap = {
        "cd_jy1": "jypull.jianyangrongmei.cn&fb9eea7d019310009e23a40200000000", //成都简阳新闻综合

        "my1": "fjgcl.myxwcm.cn&9ff5a9b001971000b986a10c00000000", //绵阳新闻综合
        "my2": "fjgcl.myxwcm.cn&9ff6671801971000c0df254f00000000", //绵阳科教生活
        "my_az1": "azpull.myaztv.cn&2cd42a81018f10007b6e374500000000", //绵阳安州综合
        "my_yt1": "ytpull.ytxrmt.cn&73957476019110000fa2d07e00000000", //绵阳盐亭综合
        "my_zt1": "ztpull.ztrmfb.cn&b98e28f7019310006d65e1b500000000", //绵阳梓潼综合

        "ab1": "apppull.aba-news.com.cn&be5325350190100009f6751d00000000", //阿坝新闻综合
        "ab2": "apppull.aba-news.com.cn&be57fb5401901000b611a82100000000", //阿坝藏语综合
        "ab_reg1": "regpull.regrmt.cn&fba4bdf0019310007748ce6c00000000", //阿坝若尔盖综合

        "nj_dx1": "dxpull.njdxrm.cn&93f6de420192100084d4e49300000000", //内江东兴新闻
        "nj_zz1": "zzpull.zzrmtzx.cn&75c3758a0193100092e8cea100000000", //内江资中综合

        "dy_gh1": "dcpull.ghrmt.cn&5c2bdb1a018f100098165ffc00000000", //德阳广汉综合

        "ls_nn1": "nnpull.ningnan.gov.cn&bd3e289e018f100042d46e9300000000", //凉山宁南综合
        "ls_zj1": "dcpull.sctvcloud.com&4bb3c2bd01881000e843b73a00000000", //凉山昭觉综合
        "ls_gl1": "glpull.glxrmtzx.cn&2a1603a1019410001fedc3cd00000000", //凉山甘洛综合
        "ls_mn1": "mnpull.sichuanmianning.cn&1a5459a9019410003d361ee300000000", //凉山冕宁电视

        "ga_ws1": "wspull.wsxrmt.com.cn&fb899c55019310000893a7cd00000000", //广安武胜综合

        "ms1": "mspull.scmstv.cn&ce36a16001931000ae80bca700000000", //眉山综合
        "ms2": "mspull.scmstv.cn&ce37b20c019310008a26359200000000", //眉山文旅乡村
        "ms_dl1": "dlpull.2289869471.com&08f432a6018f10004816cbcd00000000", //眉山丹棱综合

        "sn_px1": "pxpull.pengxiyun.cn&03c29776018f10002512b07f00000000", //遂宁蓬溪新闻综合

        'nc1': "ncrmpull.cnncw.cn&8f7b908601931000dd6ee79a00000000", //南充综合
        'nc2': "ncrmpull.cnncw.cn&8f7f8d3101931000ffbe3ba700000000" //南充科教生活
    };
    
    var id = ku9.getQuery(item.url, "id") || 'cd_jy1';
    var format = ku9.getQuery(item.url, "t") || 'hls';
    
    // 验证频道ID
    if (!channelMap[id]) {
        return JSON.stringify({
            code: 404,
            message: '频道不存在',
            available_channels: Object.keys(channelMap)
        });
    }
    
    try {
        var channelInfo = channelMap[id].split("&");
        var host = channelInfo[0];
        var streamId = channelInfo[1];
        
        var key = "5df6d8b743257e0e38b869a07d8819d2";
        var wsTime = Math.floor(Date.now() / 1000) + 60000;
        
        var playUrl = "";
        
        if (format === "hls" || format === "") {
            var hlsurl = "http://" + host + "/live/" + streamId + "/playlist.m3u8";
            var hlsuri = "/live/" + streamId + "/playlist.m3u8";
            var hlswsSecret = ku9.md5(key + hlsuri + wsTime);
            playUrl = hlsurl + "?wsSecret=" + hlswsSecret + "&wsTime=" + wsTime;
        } else if (format === "flv") {
            var flvurl = "http://" + host + "/live/" + streamId + ".flv";
            var flvuri = "/live/" + streamId + ".flv";
            var flvwsSecret = ku9.md5(key + flvuri + wsTime);
            playUrl = flvurl + "?wsSecret=" + flvwsSecret + "&wsTime=" + wsTime;
        } else {
            return JSON.stringify({
                code: 400,
                message: '不支持的格式，请使用hls或flv'
            });
        }
        
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            url: playUrl,
            format: format
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}