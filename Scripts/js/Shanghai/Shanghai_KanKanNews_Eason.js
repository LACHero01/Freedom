// 上海看看新闻 - 明文 Ku9JS 版本（最终版，无 CryptoJS）
// 用法：sh_kankan.js?id=dfws / shxwzh / shds / dycj / hhxd / wxty / mdy / jsrw

const JSEncrypt = require('jsencrypt');

// ===============================
// Base64 polyfill（酷9环境专用）
// ===============================

// Base64 解码（替代 atob）
function atob_polyfill(b64) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = '';
    let i = 0;

    b64 = b64.replace(/=+$/, '');

    while (i < b64.length) {
        const c1 = chars.indexOf(b64.charAt(i++));
        const c2 = chars.indexOf(b64.charAt(i++));
        const c3 = chars.indexOf(b64.charAt(i++));
        const c4 = chars.indexOf(b64.charAt(i++));

        const n1 = (c1 << 2) | (c2 >> 4);
        const n2 = ((c2 & 15) << 4) | (c3 >> 2);
        const n3 = ((c3 & 3) << 6) | c4;

        str += String.fromCharCode(n1);
        if (c3 !== 64) str += String.fromCharCode(n2);
        if (c4 !== 64) str += String.fromCharCode(n3);
    }

    return str;
}

// Base64 编码（替代 btoa）
function btoa_polyfill(bin) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let b64 = '';
    let i = 0;

    while (i < bin.length) {
        const n1 = bin.charCodeAt(i++);
        const n2 = bin.charCodeAt(i++);
        const n3 = bin.charCodeAt(i++);

        const c1 = n1 >> 2;
        const c2 = ((n1 & 3) << 4) | (n2 >> 4);
        const c3 = ((n2 & 15) << 2) | (n3 >> 6);
        const c4 = n3 & 63;

        if (isNaN(n2)) {
            b64 += chars.charAt(c1) + chars.charAt(c2) + '==';
        } else if (isNaN(n3)) {
            b64 += chars.charAt(c1) + chars.charAt(c2) + chars.charAt(c3) + '=';
        } else {
            b64 += chars.charAt(c1) + chars.charAt(c2) + chars.charAt(c3) + chars.charAt(c4);
        }
    }

    return b64;
}

// ===============================
// Base64 ↔ 字节数组
// ===============================

function b64ToBytes(b64) {
    const bin = atob_polyfill(b64);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
}

function bytesToB64(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) {
        bin += String.fromCharCode(bytes[i]);
    }
    return btoa_polyfill(bin);
}

// ===============================
// 频道映射（来自 PHP）
// ===============================

const channels = {
    dfws:   1,
    shxwzh: 2,
    shds:   4,
    dycj:   5,
    hhxd:   9,
    wxty:   10,
    mdy:    11,
    jsrw:   12
};

// ===============================
// nonce / uuid
// ===============================

function getNonce(length) {
    let s = Math.random().toString(36).replace('.', '');
    while (s.length < length) {
        s += Math.random().toString(36).replace('.', '');
    }
    return s.slice(-length);
}

function getUuid() {
    return '2317c7cbca1543851bbeff55aed1d77b2';
}

// ===============================
// RSA 解密（等价 PHP openssl_public_decrypt）
// ===============================

function decryptAddress(b64str) {

    const publicKey =
        '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDP5hzPUW5RFeE2xBT1ERB3hHZI\n' +
        'Votn/qatWhgc1eZof09qKjElFN6Nma461ZAwGpX4aezKP8Adh4WJj4u2O54xCXDt\n' +
        'wzKRqZO2oNZkuNmF2Va8kLgiEQAAcxYc8JgTN+uQQNpsep4n/o1sArTJooZIF17E\n' +
        'tSqSgXDcJ7yDj5rc7wIDAQAB\n' +
        '-----END PUBLIC KEY-----';

    const rsa = new JSEncrypt();
    rsa.setPublicKey(publicKey);

    const allBytes = b64ToBytes(b64str);
    const partLen = 128; // RSA 1024bit → 每块 128 字节

    let decrypted = '';

    for (let offset = 0; offset < allBytes.length; offset += partLen) {
        const chunk = allBytes.slice(offset, offset + partLen);
        const chunkB64 = bytesToB64(chunk);
        const part = rsa.decrypt(chunkB64);
        if (part) decrypted += part;
    }

    return decrypted;
}

// ===============================
// 主入口
// ===============================

function main(item) {

    const url = item.url || '';
    const idFromUrl = ku9.getQuery(url, 'id');
    const id = item.id || idFromUrl || 'dfws';

    const channelId = channels[id] || channels['dfws'];

    const t = Math.floor(Date.now() / 1000);
    const nonce = getNonce(8);

    const secret = '28c8edde3d61a0411511d3b1866f0636';

    const signBase =
        'Api-Version=v1' +
        '&channel_id=' + channelId +
        '&nonce=' + nonce +
        '&platform=android' +
        '&timestamp=' + t +
        '&version=7.1.14' +
        '&' + secret;

    const sign = ku9.md5(ku9.md5(signBase));

    const headers = {
        'api-version': 'v1',
        'nonce': nonce,
        'm-uuid': getUuid(),
        'platform': 'android',
        'version': '7.1.14',
        'timestamp': t.toString(),
        'sign': sign,
        'Referer': 'https://live.kankanews.com/'
    };

    const apiUrl =
        'https://kapi.kankanews.com/content/app/tv/channel/detail?channel_id=' +
        channelId;

    const body = ku9.get(apiUrl, JSON.stringify(headers));

    if (!body) {
        return JSON.stringify({ err: '接口无响应' });
    }

    let json;
    try {
        json = JSON.parse(body);
    } catch (e) {
        return JSON.stringify({
            err: 'JSON 解析失败',
            sample: body.slice(0, 200)
        });
    }

    if (!json.result || !json.result.touping_address) {
        return JSON.stringify({
            err: '未找到 result.touping_address',
            sample: body.slice(0, 200)
        });
    }

    const enc = json.result.touping_address;

    let playUrl;
    try {
        playUrl = decryptAddress(enc);
    } catch (e) {
        return JSON.stringify({
            err: '解密失败',
            msg: e.message,
            encSample: enc.slice(0, 80)
        });
    }

    if (!playUrl) {
        return JSON.stringify({
            err: '解密结果为空',
            encSample: enc.slice(0, 80)
        });
    }

    return JSON.stringify({
        url: playUrl,
        headers: {
            Referer: 'https://live.kankanews.com/'
        }
    });
}
