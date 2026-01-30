function main(item) {
    const CryptoJS = require("crypto");
    const id = item.id;
    const data = Date.now().toString();
    const key = CryptoJS.enc.Utf8.parse('BkOcnMPiGKh9WkmPftgZBMVM2gWw33v0');
    const iv = CryptoJS.enc.Utf8.parse('fReE9dQL0PPuEaey');
    const blockSize = 16;
    const paddingLength = blockSize - (data.length % blockSize);
    const paddedData = data + '\0'.repeat(paddingLength);
    const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(paddedData),
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.NoPadding
        }
    );
    const authorization = '{"timestamp":' + data + ',"encryption":"' + encrypted.toString() + '"}';
    const headers = {
        'authorization': authorization,
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; SM-A5560 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Mobile Safari/537.36',
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
    };    
    const url = 'https://cyrm.app.cygbdst.com:1443/api/gettvlivebyid';
    const body = 'tvliveid=' + id;
    const response = ku9.post(url, headers, body);
    const jsonData = JSON.parse(response);
    return { url: jsonData.data.path };
}