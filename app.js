// 导入express框架
const express = require('express')
// 创建express实例
const app = express()

// 导入cors
const cors = require('cors')
// 全局挂载
app.use(cors())

// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件
const multer = require('multer')
// 在server服务端下新建一个public文件，在public文件下新建upload文件用于存放图片
const upload = multer({ dest: './public/upload' })
app.use(upload.any())
// 静态托管
app.use(express.static('./public'))

const bodyParser = require("body-parser")
// parse application/x-www-form-urlencoded
// urlencoded url编码 可将字符串以URL编码
// 当extended为false时，值为数组或字符串，当为true时，值可以为任意类型
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json()) 

// 注册处理错误中间件, 对错误文件进行挂载
app.use((req, res, next) => {
	// status=0为成功，status=1为失败，方便处理失败的情况
	res.cc = (err, status=1) => {
		res.send({
			status,
			// 判断这个error是错误对象还是字符串
			message: err instanceof Error ? err.message : err
		})
	}
	next() // 中间件必须通过next()将控制权传递给下一个中间件或路由，否则请求会一直挂起
})

// 导入jwt
const jwtconfig = require('./jwt_config/index')
const { expressjwt: jwt} = require("express-jwt")
// app.use(jwt({
// 	secret: jwtconfig.jwtSecretKey, 
// 	algorithms: ['HS256'] //使用加密的算法
// }).unless({ //使用中间件去排除不需要在请求端发送token的接口
// 	path: [/^\/api\//] // 排除api开头的，注册和登录在调用时不用携带token
// })) // token是在登录之后生成，并且保留到浏览器的 storage 里面

const loginRouter = require('./router/login')
const Joi = require('joi')
app.use('/api', loginRouter)

const userRouter = require('./router/userInfo.js')
app.use('/user', userRouter)

// 对不符合joi规则的情况进行报错
app.use((err, req, res, next) => {
	if(err instanceof Joi.ValidationError) return res.cc(err)
})

// 绑定和侦听指定的主机和端口
app.listen(3007, () => {
	console.log('http://127.0.0.1:3007:')
})