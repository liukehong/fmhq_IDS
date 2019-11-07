// 请求接口文件
import axios from './api' // 倒入 api
const baseURL = 'https://api.exchangerate.enrich-global.com:8443'
// 登录
export const IBM_ADMIN_LOGIN = data => {
    return axios({
        url: `/ids/admin/login`,
        method: 'post',
        data
    })
}
// 退出
export const IBM_ADMIN_LOGOUT = data => {
    return axios({
        url: `/ids/admin/logout`,
        method: 'post',
        data
    })
}
// 出金流水列表
export const IBM_ADMIN_GETGOLDINFO = data => {
    return axios({
        url: `/ids/admin/getGoldInfo`,
        method: 'post',
        data
    })
}
// 入金流水列表
export const IBM_ADMIN_SETGOLDINFO = data => {
    return axios({
        url: `/ids/admin/setGoldInfo`,
        method: 'post',
        data
    })
}
// 入金回调
export const IBM_UTILS_CALLBACK = data => {
    return axios({
        url: `/ids/utils/callback`,
        method: 'post',
        data
    })
}
// 社区成员净入金
export const IBM_ADMIN_RECHARGECUSTOM = data => {
    return axios({
        url: `/ids/admin/rechargeCustom`,
        method: 'post',
        data
    })
}
// 会员钱包明细列表
export const IBM_ADMIN_WALLETINFO = data => {
    return axios({
        url: `/ids/admin/walletInfo`,
        method: 'post',
        data
    })
}
// 出金审核
export const IBM_ADMIN_AUDITGOLD = data => {
    return axios({
        url: `/ids/admin/auditGold`,
        method: 'post',
        data
    })
}
// 管理员转账
export const IBM_ADMIN_TRANSFER = data => {
    return axios({
        url: `/ids/admin/transfer`,
        method: 'post',
        data
    })
}
// 会员列表
export const IBM_ADMIN_ALLUSERINFO = data => {
    return axios({
        url: `/ids/admin/allUserInfo`,
        method: 'post',
        data
    })
}
// 管理员获取用户详情
export const IBM_ADMIN_INFO = data => {
    return axios({
        url: `/ids/admin/info`,
        method: 'post',
        data
    })
}
// 管理员修改用户信息
export const IBM_ADMIN_UPDATEUSER = data => {
    return axios({
        url: `/ids/admin/updateUser`,
        method: 'post',
        data
    })
}
// 管理员审核用户状态
export const IBM_ADMIN_USEREXAMINE = data => {
    return axios({
        url: `/ids/admin/userExamine`,
        method: 'post',
        data
    })
}
// 配套购买记录列表
export const IBM_ADMIN_MATINFO = data => {
    return axios({
        url: `/ids/admin/matInfo`,
        method: 'post',
        data
    })
}
// 反馈信息列表
export const IBM_ADMIN_SELECT = data => {
    return axios({
        url: `/ids/admin/select`,
        method: 'post',
        data
    })
}
// 回复列表
export const IBM_FEEDBACK_SELECTREPLY = data => {
    return axios({
        url: `/ids/admin/selectReply`,
        method: 'post',
        data
    })
}
// 提交回复
export const IBM_ADMIN_ADDREPLY = data => {
    return axios({
        url: `/ids/admin/addReply`,
        method: 'post',
        data
    })
}
// 公告列表
export const IBM_ADMIN_NOTICEINFO = data => {
    return axios({
        url: `/ids/admin/noticeInfo`,
        method: 'post',
        data
    })
}
// 添加公告
export const IBM_ADMIN_ADDNOTICE = data => {
    return axios({
        url: `/ids/admin/addNotice`,
        method: 'post',
        data
    })
}
// 删除公告
export const IBM_ADMIN_DELECTNOTICE = data => {
    return axios({
        url: `/ids/admin/delectNotice`,
        method: 'post',
        data
    })
}
// 修改公告
export const IBM_ADMIN_UPDATENOTICE = data => {
    return axios({
        url: `/ids/admin/updateNotice`,
        method: 'post',
        data
    })
}
// 新闻资讯列表
export const IBM_JOU_SELECT = data => {
    return axios({
        url: `/ids/jou/select`,
        method: 'post',
        data
    })
}
// 添加新闻
export const IBM_JOU_ADD = data => {
    return axios({
        url: `/ids/jou/add`,
        method: 'post',
        data
    })
}
// 修改新闻
export const IBM_JOU_UPDATE = data => {
    return axios({
        url: `/ids/jou/update`,
        method: 'post',
        data
    })
}
// 删除新闻
export const IBM_JOU_DELETE = data => {
    return axios({
        url: `/ids/jou/delete`,
        method: 'post',
        data
    })
}
// MT4出金列表
export const IBM_ADMIN_MT4GETGOLD = data => {
    return axios({
        url: `/ids/admin/mt4GetGold`,
        method: 'post',
        data
    })
}
// MT4出金审核
export const IBM_ADMIN_AUDITMT4 = data => {
    return axios({
        url: `/ids/admin/auditMt4`,
        method: 'post',
        data
    })
}
// 管理员首页数据
export const IBM_ADMIN_QUERYRECHARGE = data => {
    return axios({
        url: `/ids/admin/queryRecharge`,
        method: 'post',
        data
    })
}
// 管理员登录用户页面
export const IBM_ADMIN_ADMINLOGIN = data => {
    return axios({
        url: `/ids/admin/adminLogin`,
        method: 'post',
        data
    })
}
// 修改邮箱
export const IBM_ADMIN_UPDATEUSEREMAIL = data => {
    return axios({
        url: `/ids/admin/updateUserEmail`,
        method: 'post',
        data
    })
}
// 修改手机号
export const IBM_ADMIN_UPDATEMOBILE = data => {
    return axios({
        url: `/ids/admin/updateMobile`,
        method: 'post',
        data
    })
}
// 获取等级信息
export const IBM_ADMIN_LEVELINFO = data => {
    return axios({
        url: `/ids/admin/levelInfo`,
        method: 'post',
        data
    })
}
// 修改用户等级
export const IBM_ADMIN_UPDATEUSERLEVEL = data => {
    return axios({
        url: `/ids/admin/updateUserLevel`,
        method: 'post',
        data
    })
}
// 重置用户等级
export const IBM_ADMIN_RESETLEVEL = data => {
    return axios({
        url: `/ids/admin/resetLevel`,
        method: 'post',
        data
    })
}
// 修改用户上下级
export const IBM_ADMIN_LADDER = data => {
    return axios({
        url: `/ids/admin/ladder`,
        method: 'post',
        data
    })
}
// 批量出金
export const IBM_ADMIN_BATCHAUDIT = data => {
    return axios({
        url: `/ids/admin/batchAudit`,
        method: 'post',
        data
    })
}
// 管理员注销用户
export const IBM_ADMIN_DELECTUSER = data => {
    return axios({
        url: `/ids/admin/delectUser`,
        method: 'post',
        data
    })
}
// MT4异常信息接口
export const IBM_ADMIN_MT4ERRORINFO = data => {
    return axios({
        url: `/ids/admin/mt4ErrorInfo`,
        method: 'post',
        data
    })
}
// MT4异常状态修改接口
export const IBM_ADMIN_MT4ERRORUPDATESTATE = data => {
    return axios({
        url: `/ids/admin/mt4ErrorUpdateState`,
        method: 'post',
        data
    })
}
// MT4异常删除接口
export const IBM_ADMIN_MT4ERRORDELETE = data => {
    return axios({
        url: `/ids/admin/mt4ErrorDelete`,
        method: 'post',
        data
    })
}
// 查询用户上级ID
export const IBM_ADMIN_QUERYLADDER = data => {
    return axios({
        url: `/ids/admin/queryladder`,
        method: 'post',
        data
    })
}
// 获取未读数量
export const IDS_ADMIN_SELECTCOUNT = data => {
    return axios({
        url: `/ids/admin/selectCount`,
        method: 'post',
        data
    })
}
// 修改会员密码
export const IDS_ADMIN_UPDATEUSERPASSWORD = data => {
    return axios({
        url: `/ids/admin/updateUserPassword`,
        method: 'post',
        data
    })
}

export default {
    IBM_ADMIN_LOGIN,
    IBM_ADMIN_LOGOUT,
    IBM_ADMIN_GETGOLDINFO,
    IBM_ADMIN_SETGOLDINFO,
    IBM_UTILS_CALLBACK,
    IBM_ADMIN_RECHARGECUSTOM,
    IBM_ADMIN_WALLETINFO,
    IBM_ADMIN_AUDITGOLD,
    IBM_ADMIN_TRANSFER,
    IBM_ADMIN_ALLUSERINFO,
    IBM_ADMIN_INFO,
    IBM_ADMIN_UPDATEUSER,
    IBM_ADMIN_USEREXAMINE,
    IBM_ADMIN_MATINFO,
    IBM_ADMIN_SELECT,
    IBM_FEEDBACK_SELECTREPLY,
    IBM_ADMIN_ADDREPLY,
    IBM_ADMIN_NOTICEINFO,
    IBM_ADMIN_ADDNOTICE,
    IBM_ADMIN_DELECTNOTICE,
    IBM_ADMIN_UPDATENOTICE,
    IBM_JOU_SELECT,
    IBM_JOU_ADD,
    IBM_JOU_UPDATE,
    IBM_JOU_DELETE,
    IBM_ADMIN_MT4GETGOLD,
    IBM_ADMIN_AUDITMT4,
    IBM_ADMIN_QUERYRECHARGE,
    IBM_ADMIN_ADMINLOGIN,
    IBM_ADMIN_UPDATEUSEREMAIL,
    IBM_ADMIN_UPDATEMOBILE,
    IBM_ADMIN_LEVELINFO,
    IBM_ADMIN_UPDATEUSERLEVEL,
    IBM_ADMIN_RESETLEVEL,
    IBM_ADMIN_LADDER,
    IBM_ADMIN_BATCHAUDIT,
    IBM_ADMIN_DELECTUSER,
    IBM_ADMIN_MT4ERRORINFO,
    IBM_ADMIN_MT4ERRORUPDATESTATE,
    IBM_ADMIN_MT4ERRORDELETE,
    IBM_ADMIN_QUERYLADDER,
    IDS_ADMIN_SELECTCOUNT,
    IDS_ADMIN_UPDATEUSERPASSWORD
}
