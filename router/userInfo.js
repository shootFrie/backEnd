const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 涉及修改密码
const expressJoi = require('@escook/express-joi')
// 导入验证规则
const {
	name_limit, 
	email_limit, 
	pwd_limit
} = require('../limit/user')

const userInfoHandler = require('../router_handle/UserInfo')
// 上传头像
router.post('/uploadAvatar',userInfoHandler.uploadAvatar)
// 头像绑定账号
router.post('/bindAccount',userInfoHandler.bindAccount)
// 修改密码
router.post('/changePwd',expressJoi(pwd_limit),userInfoHandler.changePwd)
// 获取用户信息
router.post('/getUserInfo',userInfoHandler.getUserInfo)
// 修改用户姓名
router.post('/changeName', expressJoi(name_limit), userInfoHandler.changeName)
// 修改用户性别
router.post('/changeSex', userInfoHandler.changeSex)
// 修改用户邮箱
router.post('/changeEmail', expressJoi(email_limit), userInfoHandler.changeEmail)

module.exports = router