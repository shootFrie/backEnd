// 导入express框架
const express = require('express')
// 创建express实例
const app = express()

// 导入cors
const cors = require('cors')
// 全局挂载
app.use(cors())

const bodyParser = require("body-parser")
// parse application/x-www-form-urlencoded
// urlencoded url编码 可将字符串以URL编码
// 当extended为false时，值为数组或字符串，当为true时，值可以为任意类型
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// 绑定和侦听指定的主机和端口
app.listen(3007, () => {
	console.log('http://127.0.0.1:3007:')
})