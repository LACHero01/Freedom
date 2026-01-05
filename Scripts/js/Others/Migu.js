// 咪咕视频解析 - 酷9JS版本 (基于Python版本转换)
// 支持参数: id=节目ID, playseek=回看时间范围

function main(item) {
    var id = ku9.getQuery(item.url, "id") || "641886683";
    var playseek = ku9.getQuery(item.url, "playseek") || "";
    
    try {
        // 获取播放地址
        var finalUrl = get_android_url_720p(id);
        
        if (!finalUrl) {
            return JSON.stringify({
                code: 500,
                message: "无法获取播放地址"
            });
        }
        
        // 如果有回看参数，添加到URL
        if (playseek) {
            var parts = playseek.split('-');
            if (parts.length === 2) {
                var starttime = parts[0];
                var endtime = parts[1];
                var separator = finalUrl.includes('?') ? '&' : '?';
                finalUrl += separator + "playbackbegin=" + starttime + "&playbackend=" + endtime;
            }
        }
        
        return JSON.stringify({
            code: 200,
            message: "获取成功",
            url: finalUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36",
                "Referer": "https://play.miguvideo.com/",
                "Origin": "https://play.miguvideo.com"
            }
        });
        
    } catch (e) {
        return JSON.stringify({
            code: 500,
            message: "处理过程中出错: " + e.toString()
        });
    }
}

// 获取当前日期的字符串格式：YYYYMMDD
function get_date_string() {
    var now = new Date();
    var year = now.getFullYear().toString();
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    return year + month + day;
}

// 生成ddCalcu参数
function get_dd_calcu_720p(pu_data, program_id) {
    var keys = "0123456789";
    var dd_calcu = [];
    var length = pu_data.length;
    
    for (var i = 0; i < Math.floor(length / 2); i++) {
        dd_calcu.push(pu_data[length - i - 1]);
        dd_calcu.push(pu_data[i]);
        
        if (i === 1) {
            dd_calcu.push("e");
        } else if (i === 2) {
            var date_str = get_date_string();
            if (date_str.length > 6) {
                dd_calcu.push(keys[parseInt(date_str[6])]);
            } else {
                dd_calcu.push("0");
            }
        } else if (i === 3) {
            if (program_id.length > 2) {
                dd_calcu.push(keys[parseInt(program_id[2])]);
            } else {
                dd_calcu.push("0");
            }
        } else if (i === 4) {
            dd_calcu.push("0");
        }
    }
    
    return dd_calcu.join("");
}

// 将ddCalcu参数添加到URL中
function get_dd_calcu_url_720p(pu_data_url, program_id) {
    if (!pu_data_url.includes("&puData=")) {
        return pu_data_url;
    }
    
    try {
        var url_parts = pu_data_url.split("?");
        var base_url = url_parts[0];
        var query_string = url_parts.length > 1 ? url_parts[1] : "";
        
        // 解析查询参数
        var params = {};
        if (query_string) {
            query_string.split("&").forEach(function(param) {
                var parts = param.split("=");
                if (parts.length === 2) {
                    params[parts[0]] = decodeURIComponent(parts[1]);
                }
            });
        }
        
        var pu_data = params["puData"] || "";
        
        if (!pu_data) {
            return pu_data_url;
        }
        
        var dd_calcu = get_dd_calcu_720p(pu_data, program_id);
        
        // 移除已有的ddCalcu参数
        if (query_string.includes("&ddCalcu=") || query_string.includes("?ddCalcu=")) {
            if (query_string.includes("&ddCalcu=")) {
                query_string = query_string.split("&ddCalcu=")[0];
            } else {
                query_string = query_string.split("?ddCalcu=")[0];
            }
        }
        
        var separator = base_url.includes("?") ? "&" : "?";
        
        if (query_string) {
            return base_url + separator + query_string + "&ddCalcu=" + dd_calcu;
        } else {
            return base_url + separator + "ddCalcu=" + dd_calcu;
        }
        
    } catch (e) {
        return pu_data_url;
    }
}

// 获取安卓端的播放URL
function get_android_url_720p(pid) {
    try {
        var timestamp = Date.now().toString();
        var app_version = "26000009";
        
        var headers = {
            "AppVersion": "2600000900",
            "TerminalId": "android",
            "X-UP-CLIENT-CHANNEL-ID": "2600037000-99000-200300220100002",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36",
            "Accept": "application/json",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Connection": "keep-alive"
        };
        
        var str_to_hash = timestamp + pid + app_version;
        var md5_hash = ku9.md5(str_to_hash);
        
        var salt = "66666601";
        var suffix = "770fafdf5ba04d279a59ef1600baae98migu6666";
        var sign = ku9.md5(md5_hash + suffix);
        
        var rate_type = "3";
        if (pid === "608831231") {
            rate_type = "2";
        }
        
        var base_url = "https://play.miguvideo.com/playurl/v1/play/playurl";
        var params = "?sign=" + sign + "&rateType=" + rate_type + 
                     "&contId=" + pid + "&timestamp=" + timestamp + "&salt=" + salt;
        var full_url = base_url + params;
        
        // 发送请求
        var response = ku9.get(full_url, JSON.stringify(headers));
        
        if (!response) {
            return null;
        }
        
        var resp_data;
        try {
            resp_data = JSON.parse(response);
        } catch (e) {
            return null;
        }
        
        // 检查响应码
        if ((resp_data.code && resp_data.code !== "200") && 
            (resp_data.resultCode && resp_data.resultCode !== "200")) {
            return null;
        }
        
        var body = resp_data.body || {};
        var url_info = body.urlInfo || {};
        var url = url_info.url || "";
        
        if (!url) {
            return null;
        }
        
        // 处理ddCalcu参数
        var res_url = get_dd_calcu_url_720p(url, pid);
        
        return res_url;
        
    } catch (e) {
        return null;
    }
}