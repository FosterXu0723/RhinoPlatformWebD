/**
 * 将json格式的数据处理成formData的格式
 * @param {*} data json参数
 */
export function formData(data){
    let ret = ""
    for(let it in data){
        ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&"
    }
    ret = ret.substring(0, ret.lastIndexOf("&"))
    return ret
}
