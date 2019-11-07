// axios的默认配置
const getPath = function (num) {
  switch (num) {
    case 0:
      // 国际版
      return "https://api.idsfx.com:18443"
      break;
    case 1:
      // 本地
      return "http://192.168.1.161:8080"
      break;
    default:
      return "https://api.idsfx.com:18443"
  }
}
export default {
  method: 'post',
  // 基础url前缀
  baseURL: getPath(0),
  // 请求头信息
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: false,
  // 返回数据类型
  responseType: 'json'
}
