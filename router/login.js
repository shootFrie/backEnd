// 登录注册模块路由
// 导入express框架
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入login的路由处理模块
const loginHandler = require('../router_handle/login.js')

// 导入expressJoi
const expressJoi = require("@escook/express-joi")
// 导入验证规则
const {
	login_limit
} = require('../limit/login')

// 注册
router.post('/register',expressJoi(login_limit), loginHandler.register)
// 登录
router.post('/login', expressJoi(login_limit), loginHandler.login)

// 向外暴露路由
module.exports = router