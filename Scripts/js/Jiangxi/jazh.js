//����TV
function main(item) {
    const id = item.id || 'jazh';
    const n = { 
        'jazh' : 2, //�����ۺ�Ƶ��
        'jagg' : 3, //��������Ƶ��
        'jagb' : 8, //�����ۺϹ㲥
        'jajt' : 9, //������ͨ�㲥
    }; 
    const url = 'https://www.ijatv.com/m2o/channel/channel_info.php?id=' + n[id];
    const res = ku9.request(url);
    const data = JSON.parse(res.body);
    const playurl = data[0].channel_stream[0].m3u8; 
    return { url: playurl };
}