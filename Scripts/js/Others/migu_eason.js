// 电视直播源 - 酷9JS完整版本
// 转换自 hlsbkmgsplive.php
// 频道参数: id=频道缩写 (如 dfws=东方卫视, gdws=广东卫视)
function main(item) {
    // 完整频道映射表 - 每个频道对应四个播放地址
    var channels = {
        'dfws': [ // 东方卫视
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dongfangwshd/3000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dongfangwshd/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dongfangwshd/3000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dongfangwshd/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'shxwzh': [ // 上海新闻综合
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/xinwenzonghehd/3000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/xinwenzonghehd/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/xinwenzonghehd/3000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/xinwenzonghehd/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'dfys': [ // 东方影视
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dianshijuhd/3000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dianshijuhd/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dianshijuhd/3000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/dfl/dianshijuhd/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'dycj': [ // 第一财经
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/bestv/dycj/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/bestv/dycj/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/bestv/dycj/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/bestv/dycj/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'ly': [ // 乐游
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/leyouhd/57/20230411/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/leyouhd/57/20230411/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/leyouhd/57/20230411/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/leyouhd/57/20230411/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'fztd': [ // 法治天地
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/fztdhd/57/20230411/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/fztdhd/57/20230411/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/fztdhd/57/20230411/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/fztdhd/57/20230411/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'hxjc': [ // 欢笑剧场
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hxjchd/57/20230411/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hxjchd/57/20230411/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hxjchd/57/20230411/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hxjchd/57/20230411/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jbty': [ // 劲爆体育
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jinbaotyhd/57/20230411/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jinbaotyhd/57/20230411/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jinbaotyhd/57/20230411/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jinbaotyhd/57/20230411/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'yxfy': [ // 游戏风云
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/youxifengyunhd/3000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/youxifengyunhd/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/youxifengyunhd/3000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/youxifengyunhd/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
		'cetv1': [ // CETV-1
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv1/51/20240709/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv1/51/20240709/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv1/51/20240709/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv1/51/20240709/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'cetv2': [ // CETV-2
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv2/51/20240709/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv2/51/20240709/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv2/51/20240709/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv2/51/20240709/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'cetv4': [ // CETV-4
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv4/51/20240709/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv4/51/20240709/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv4/51/20240709/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cetv4/51/20240709/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
        'fxzl': [ // 发现之旅
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/faxianzhilv/2000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/faxianzhilv/2000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/faxianzhilv/2000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/faxianzhilv/2000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'chcymdy': [ // CHC影迷电影
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/chcymdy/57/20250415/index.m3u8?encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/chcymdy/57/20250415/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/chcymdy/57/20250415/01.m3u8?encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/chcymdy/57/20250415/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'chcjtyy': [ // CHC家庭影院
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/chcjtyy/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/chcjtyy/3000/index.m3u8?encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/chcjtyy/3000/01.m3u8?encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/chcjtyy/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'chcdzdy': [ // CHC动作电影
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/gesee/chcdzdy/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/gesee/chcdzdy/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/gesee/chcdzdy/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/gesee/chcdzdy/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],	
			'ttmlh': [ // 体坛名栏汇
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/titanminglan/51/20250514/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/titanminglan/51/20250514/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/titanminglan/51/20250514/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/titanminglan/51/20250514/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'mg24ty': [ // 咪咕24小时体育台
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/tysy201903/75/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/tysy201903/75/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/tysy201903/75/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/tysy201903/75/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'24csls': [ // 24小时城市联赛轮播台
			'http://hlsbkmgsplive.miguvideo.com/migu/lunbo/ouzhoubei/51/20240603/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/lunbo/ouzhoubei/51/20240603/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/lunbo/ouzhoubei/51/20240603/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/lunbo/ouzhoubei/51/20240603/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'sszjd': [ // 赛事最经典
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/saishijingdian/51/20250514/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/saishijingdian/51/20250514/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/saishijingdian/51/20250514/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/saishijingdian/51/20250514/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'gdjys': [ // 掼蛋精英赛
			'http://hlsbkmgsplive.miguvideo.com/wd_r4/virtuallive/5101059662/150/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r4/virtuallive/5101059662/150/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r4/virtuallive/5101059662/150/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r4/virtuallive/5101059662/150/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'jdxgdy': [ // 经典香港电影
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5100180869/150/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5100180869/150/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5100180869/150/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5100180869/150/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'kzjdy': [ // 抗战经典影片
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100002089-150/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100002089-150/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100002089-150/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100002089-150/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xpfyt': [ // 新片放映厅
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100030975-150/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100030975-150/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100030975-150/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd-virtuallive5100030975-150/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'hmxt': [ // 和美乡途轮播台
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002411/51/20210706/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002411/51/20210706/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002411/51/20210706/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002411/51/20210706/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'gqdp': [ // 高清大片
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/gaoqingdapian/51/20250514/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/gaoqingdapian/51/20250514/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/gaoqingdapian/51/20250514/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/gaoqingdapian/51/20250514/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd0': [ // 熊猫频道0
			'http://hlsbkmgsplive.miguvideo.com/ws_x/2018/xiongmao/HD/2000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/ws_x/2018/xiongmao/HD/2000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/ws_x/2018/xiongmao/HD/2000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/ws_x/2018/xiongmao/HD/2000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd1': [ // 熊猫频道1
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao01/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao01/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao01/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao01/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd2': [ // 熊猫频道2
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao02/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao02/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao02/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao02/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd3': [ // 熊猫频道3
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao03/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao03/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao03/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao03/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd4': [ // 熊猫频道4
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao04/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao04/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao04/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao04/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd5': [ // 熊猫频道5
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao05/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao05/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao05/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao05/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd6': [ // 熊猫频道6
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao06/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao06/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao06/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao06/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd7': [ // 熊猫频道7
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao07/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao07/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao07/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao07/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd8': [ // 熊猫频道8
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao08/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao08/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao08/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao08/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd9': [ // 熊猫频道9
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao09/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao09/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao09/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao09/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xmpd10': [ // 熊猫频道10
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao10/1000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao10/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao10/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xiongmao10/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'zqzy': [ // 最强综艺趴
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zuiqiangzongyi/51/20250514/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zuiqiangzongyi/51/20250514/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zuiqiangzongyi/51/20250514/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zuiqiangzongyi/51/20250514/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'jddh': [ // 经典动画大集合
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jingdiandonghua/51/20250514/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jingdiandonghua/51/20250514/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jingdiandonghua/51/20250514/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jingdiandonghua/51/20250514/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'xdll': [ // 新动力量创一流
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002409/51/20210706/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002409/51/20210706/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002409/51/20210706/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/virtuallive2/5900002409/51/20210706/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'qtj': [ // 钱塘江
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/qiantangjiang/2000/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/qiantangjiang/2000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/qiantangjiang/2000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/cnr/qiantangjiang/2000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'zjl': [ // 周杰伦现场
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/virtuallive/5100170828/75/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/virtuallive/5100170828/75/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/virtuallive/5100170828/75/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r3/virtuallive/5100170828/75/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'hyyt': [ // 华语乐坛最强音
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5102010211/75/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5102010211/75/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5102010211/75/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/wd_r2/virtuallive/5102010211/75/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'btws': [ // 兵团卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/btws/51/20250804/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/btws/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/btws/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/btws/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'cqws': [ // 重庆卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/chongqing/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/chongqing/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/chongqing/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/chongqing/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'dgqws': [ // 大湾区卫视
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/2018/nfmedia/nfws/1000/index.m3u8?&HlsSubType=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/2018/nfmedia/nfws/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/2018/nfmedia/nfws/1000/01.m3u8?&HlsSubType=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r3/2018/nfmedia/nfws/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'dnws': [ // 东南卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/dongnanws/57/20230724/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/dongnanws/57/20230724/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/dongnanws/57/20230724/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/dongnanws/57/20230724/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'gsws': [ // 甘肃卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/gansu/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/gansu/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/gansu/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/gansu/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'gdws': [ // 广东卫视
            'http://hlsbkmgsplive.miguvideo.com/ws_w/gdws/gdws3000/3000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/ws_w/gdws/gdws3000/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/ws_w/gdws/gdws3000/3000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/ws_w/gdws/gdws3000/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'gxws': [ // 广西卫视
            'http://hlsbkmgsplive.miguvideo.com/wd-guangxiwssd-600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-guangxiwssd-600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-guangxiwssd-600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-guangxiwssd-600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'gzhws': [ // 贵州卫视
            'http://hlsbkmgsplive.miguvideo.com/wd-guizhouwssd-600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-guizhouwssd-600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-guizhouwssd-600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-guizhouwssd-600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'hnws': [ // 海南卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/SD/lvyou/711/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/SD/lvyou/711/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/SD/lvyou/711/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/SD/lvyou/711/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'hxws': [ // 海峡卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/haixiaws/57/20230724/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/haixiaws/57/20230724/index.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/haixiaws/57/20230724/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/haixiaws/57/20230724/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt='
        ],
        'henanws': [ // 河南卫视
            'http://hlsbkmgsplive.miguvideo.com/wd-henanwssd-600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-henanwssd-600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-henanwssd-600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-henanwssd-600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'hbws': [ // 湖北卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hubeiwshd/57/20220712/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hubeiwshd/57/20220712/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hubeiwshd/57/20220712/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hubeiwshd/57/20220712/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'hunws': [ // 湖南卫视
            'http://hlsbkmgsplive.miguvideo.com/wd-hunanhd-2500/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-hunanhd-2500/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-hunanhd-2500/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-hunanhd-2500/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jlws': [ // 吉林卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/jilin/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/jilin/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/jilin/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_v/2018/SD/jilin/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
		'jxws': [ // 江西卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jxwshd/57/20190820/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jxwshd/57/20190820/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jxwshd/57/20190820/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jxwshd/57/20190820/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'lnws': [ // 辽宁卫视
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/liaoningwshd/3000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/liaoningwshd/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/liaoningwshd/3000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/ocn/liaoningwshd/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'nmgws': [ // 内蒙古卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/neimeng/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/neimeng/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/neimeng/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/neimeng/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'nxws': [ // 宁夏卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/ningxia/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/ningxia/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/ningxia/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/ningxia/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'nlws': [ // 农林卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zgnlws/51/20250804/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zgnlws/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zgnlws/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zgnlws/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'qhws': [ // 青海卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/qinghai/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/qinghai/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/qinghai/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_w/2018/SD/qinghai/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sdjyws': [ // 山东教育卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sdjyws/51/20250915/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sdjyws/51/20250915/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sdjyws/51/20250915/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sdjyws/51/20250915/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sdws': [ // 山东卫视
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/yg/shandongwshd/3000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/yg/shandongwshd/3000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/yg/shandongwshd/3000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/yg/shandongwshd/3000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sxws': [ // 陕西卫视
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/shan3xiws/57/20220809/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/shan3xiws/57/20220809/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/shan3xiws/57/20220809/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/shan3xiws/57/20220809/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'xzws': [ // 西藏卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xizang/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xizang/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xizang/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/xizang/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'xjws': [ // 新疆卫视
            'http://hlsbkmgsplive.miguvideo.com/wd-xinjiangwssd-600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-xinjiangwssd-600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-xinjiangwssd-600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd-xinjiangwssd-600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'ynws': [ // 云南卫视
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/yunnan/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/yunnan/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/yunnan/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/envivo_x/2018/SD/yunnan/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'zhtc': [ // 中华特产
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zhtc/51/20251103/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zhtc/51/20251103/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zhtc/51/20251103/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/zhtc/51/20251103/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'shdy': [ // 四海钓鱼
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/peoplecn/shdiaoyu/1200/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/peoplecn/shdiaoyu/1200/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/peoplecn/shdiaoyu/1200/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r4/peoplecn/shdiaoyu/1200/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'hqly': [ // 环球旅游
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hqly/51/20250915/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hqly/51/20250915/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hqly/51/20250915/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/hqly/51/20250915/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'gdys': [ // 广东影视
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/nfys/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/nfys/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/nfys/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/nfys/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'gdjjkt': [ // 广东嘉佳卡通
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/jjkt/1000/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/jjkt/1000/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/jjkt/1000/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r1/2018/nfmedia/jjkt/1000/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jscs': [ // 江苏城市
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jschengshi/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jschengshi/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jschengshi/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jschengshi/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jszy': [ // 江苏综艺
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jszongyi/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jszongyi/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jszongyi/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jszongyi/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jsys': [ // 江苏影视
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsyingshi/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsyingshi/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsyingshi/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsyingshi/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jsxw': [ // 江苏新闻
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsgonggong/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsgonggong/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsgonggong/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsgonggong/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jsty': [ // 江苏体育休闲
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jstiyu/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jstiyu/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jstiyu/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jstiyu/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jsymkt': [ // 江苏优漫卡通
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/ymkt/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/ymkt/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/ymkt/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/ymkt/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jsgj': [ // 江苏国际
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsguoji/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsguoji/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsguoji/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsguoji/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'jsjy': [ // 江苏教育
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsjiaoyu/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsjiaoyu/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsjiaoyu/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/jsjiaoyu/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
		'jscftx': [ // 江苏财富天下
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cftx/51/20250804/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cftx/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cftx/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/cftx/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
        'njxwzh': [ // 南京新闻综合
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingxwzh/50/20230719/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingxwzh/50/20230719/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingxwzh/50/20230719/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingxwzh/50/20230719/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'njkj': [ // 南京教科
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingkj/50/20230719/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingkj/50/20230719/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingkj/50/20230719/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingkj/50/20230719/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'njsb': [ // 南京十八生活
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingsb/50/20230719/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingsb/50/20230719/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingsb/50/20230719/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/nanjingsb/50/20230719/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'tzxwzh': [ // 泰州新闻综合
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/tzxinwenzonghe/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/tzxinwenzonghe/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/tzxinwenzonghe/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/tzxinwenzonghe/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
		'yxxwzh': [ // 宜兴新闻综合
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/yxxwzh/51/20250604/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/yxxwzh/51/20250604/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/yxxwzh/51/20250604/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/yxxwzh/51/20250604/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'ycxwzh': [ // 盐城新闻综合
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ycxwzh/51/20250604/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ycxwzh/51/20250604/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ycxwzh/51/20250604/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ycxwzh/51/20250604/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
        'xzxwzh': [ // 徐州新闻综合
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/xzxinwenzonghe/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/xzxinwenzonghe/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/xzxinwenzonghe/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/xzxinwenzonghe/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sqzh': [ // 宿迁综合
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/sqxinwenzonghe/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/sqxinwenzonghe/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/sqxinwenzonghe/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/sqxinwenzonghe/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
		'ntxwzh': [ // 南通新闻综合
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ntxwzh/51/20250604/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ntxwzh/51/20250604/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ntxwzh/51/20250604/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/ntxwzh/51/20250604/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
        'lygxwzh': [ // 连云港新闻综合
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/lygxinwenzonghe/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/lygxinwenzonghe/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/lygxinwenzonghe/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/lygxinwenzonghe/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
		'lsxwzh': [ // 溧水新闻综合
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wxxwzh/51/20250604/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wxxwzh/51/20250604/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wxxwzh/51/20250604/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wxxwzh/51/20250604/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
		'jyxwzh': [ // 江阴新闻综合
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jyxwzh/51/20250604/index.m3u8?&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jyxwzh/51/20250604/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jyxwzh/51/20250604/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
			'http://hlsbkmgsplive.miguvideo.com/migu/kailu/jyxwzh/51/20250604/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		],
        'hazh': [ // 淮安综合
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/haxinwenzonghe/600/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/haxinwenzonghe/600/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/haxinwenzonghe/600/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/wd_r2/jstv/haxinwenzonghe/600/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sxxwzx': [ // 陕西新闻资讯
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxxwzx/51/20250804/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxxwzx/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxxwzx/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxxwzx/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sxdsqc': [ // 陕西都市青春
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxdsqc/51/20250804/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxdsqc/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxdsqc/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxdsqc/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sxyl': [ // 陕西银龄
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxylpd/51/20250804/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxylpd/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxylpd/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxylpd/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sxqq': [ // 陕西秦腔
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxqqpd/51/20250804/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxqqpd/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxqqpd/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxqqpd/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
        'sxty': [ // 陕西体育休闲
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxtyxx/51/20250804/index.m3u8?&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxtyxx/51/20250804/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxtyxx/51/20250804/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
            'http://hlsbkmgsplive.miguvideo.com/migu/kailu/sxtyxx/51/20250804/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
        ],
		'hnwssj': [ // 河南武术世界
        'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wssj/51/20250915/index.m3u8?&encrypt=',
        'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wssj/51/20250915/index.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt=',
        'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wssj/51/20250915/01.m3u8?msisdn=&Channel_ID=&ContentId=&HlsSubType=&HlsProfileId=&encrypt=',
        'http://hlsbkmgsplive.miguvideo.com/migu/kailu/wssj/51/20250915/01.m3u8?msisdn=&mtv_session=&HlsSubType=1&HlsProfileId=1&nphaid=0&encrypt='
		]
		
    };
    
    // 获取频道ID参数
    var channelId = item.id || '';
    
    try {
        // 检查频道是否存在
        if (!channelId || !channels[channelId]) {
            return JSON.stringify({
                code: 404,
                message: '频道不存在',
                available_channels: Object.keys(channels).map(function(key) {
                    return {
                        id: key,
                        name: getChannelName(key)
                    };
                })
            });
        }
        
        // 从该频道的四个地址中随机选择一个
        var urls = channels[channelId];
        var randomIndex = Math.floor(Math.random() * urls.length);
        var selectedUrl = urls[randomIndex];
        
        // 返回播放地址
        return JSON.stringify({
            code: 200,
            message: '获取成功',
            channel: getChannelName(channelId),
            url: selectedUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://www.miguvideo.com/'
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: '处理过程中出错: ' + e.toString()
        });
    }
}

// 辅助函数：获取频道名称
function getChannelName(channelId) {
    var nameMap = {
        'dfws': '东方卫视',
        'shxwzh': '上海新闻综合',
        'dfys': '东方影视',
        'dycj': '第一财经',
        'ly': '乐游',
        'fztd': '法治天地',
        'hxjc': '欢笑剧场',
        'jbty': '劲爆体育',
        'yxfy': '游戏风云',
		'cetv1':'CETV-1',
		'cetv2':'CETV-2',
		'cetv4':'CETV-4',
        'fxzl': '发现之旅',
        'chcymdy': 'CHC影迷电影',
        'chcjtyy': 'CHC家庭影院',
        'chcdzdy': 'CHC动作电影',
        'zgtq': '中国天气',
		'ttmlh': '体坛名栏汇',
		'mg24ty': '咪咕24小时体育台',
		'24csls': '24小时城市联赛轮播台',
		'sszjd': '赛事最经典',
		'gdjys': '掼蛋精英赛',
		'jdxgdy': '经典香港电影',
		'kzjdy': '抗战经典影片',
		'xpfyt': '新片放映厅',
		'hmxt': '和美乡途轮播台',
		'gqdp': '高清大片',
		'xmpd0': '熊猫频道0',
		'xmpd1': '熊猫频道1',
		'xmpd2': '熊猫频道2',
		'xmpd3': '熊猫频道3',
		'xmpd4': '熊猫频道4',
		'xmpd5': '熊猫频道5',
		'xmpd6': '熊猫频道6',
		'xmpd7': '熊猫频道7',
		'xmpd8': '熊猫频道8',
		'xmpd9': '熊猫频道9',
		'xmpd10': '熊猫频道10',
		'zqzy': '最强综艺趴',
		'jddh': '经典动画大集合',
		'xdll': '新动力量创一流',
		'qtj': '钱塘江',
		'zjl': '周杰伦现场',
		'hyyt': '华语乐坛最强音',
		'btws': '兵团卫视',
        'cqws': '重庆卫视',
        'dgqws': '大湾区卫视',
        'dnws': '东南卫视',
        'gsws': '甘肃卫视',
        'gdws': '广东卫视',
        'gxws': '广西卫视',
        'gzhws': '贵州卫视',
        'hnws': '海南卫视',
        'hxws': '海峡卫视',
        'henanws': '河南卫视',
        'hbws': '湖北卫视',
        'hunws': '湖南卫视',
        'jlws': '吉林卫视',
		'jxws': '江西卫视',
        'lnws': '辽宁卫视',
        'nmgws': '内蒙古卫视',
        'nxws': '宁夏卫视',
        'nlws': '农林卫视',
        'qhws': '青海卫视',
        'sdjyws': '山东教育卫视',
        'sdws': '山东卫视',
        'sxws': '陕西卫视',
        'xzws': '西藏卫视',
        'xjws': '新疆卫视',
        'ynws': '云南卫视',
        'zhtc': '中华特产',
        'shdy': '四海钓鱼',
        'hqly': '环球旅游',
        'gdys': '广东影视',
        'gdjjkt': '广东嘉佳卡通',
        'jscs': '江苏城市',
        'jszy': '江苏综艺',
        'jsys': '江苏影视',
        'jsxw': '江苏新闻',
        'jsty': '江苏体育休闲',
        'jsymkt': '江苏优漫卡通',
        'jsgj': '江苏国际',
        'jsjy': '江苏教育',
		'jscftx': '江苏财富天下',
        'njxwzh': '南京新闻综合',
        'njkj': '南京教科',
        'njsb': '南京十八生活',
        'tzxwzh': '泰州新闻综合',
		'yxxwzh': '宜兴新闻综合',
		'ycxwzh': '盐城新闻综合',
        'xzxwzh': '徐州新闻综合',
        'sqzh': '宿迁综合',
		'ntxwzh': '南通新闻综合',
        'lygxwzh': '连云港新闻综合',
		'lsxwzh': '溧水新闻综合',
		'jyxwzh': '江阴新闻综合',
        'hazh': '淮安综合',
        'sxxwzx': '陕西新闻资讯',
        'sxdsqc': '陕西都市青春',
        'sxyl': '陕西银龄',
        'sxqq': '陕西秦腔',
        'sxty': '陕西体育休闲',
		'hnwssj': '河南武术世界'
    };
    return nameMap[channelId] || channelId;
}

// 辅助函数：生成随机数（用于随机选择）
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}