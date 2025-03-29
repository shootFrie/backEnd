const db = require('../db/index.js')
// 导入bcrypt加密中间件
const bcrypt = require("bcryptjs")
// 导入jwt，用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件，用于加密解密
const jwtconfig = require('../jwt_config/index')

exports.register = (req, res) => {
	/** req 是前端传过来的数据，也就是request
	 *  res 是返回给前端的数据，也就是result
	*/
   const reginfo = req.body;
   console.log('=====', reginfo)
   // 判断前端传过来的数据有没有空
   if(!reginfo.account || !reginfo.password) {
	   return res.send({
		   status: 1,
		   message: '账号或者密码不能为空'
	   })
   }
   // 第二步，判断前端传过来的账号是否存在数据表中
   const sql = "select * from users where account = ?"
   /**sql 执行语句
    * reginfo.account 参数
	* 第三个是一个函数，用于处理结果
	* 
	*/ 
   db.query(sql, reginfo.account, (err, results) => {
	   if(results.length > 0) { // 获取数据库数据是否存在
		   return res.send({
			   status: 1,
			   message: '账号已存在'
		   })
	   }
	   // 第三步，对密码进行加密
	   // 使用加密中间件bcrypt.js
	   // bcrypt.hashSync第一个参数是传入的密码，第二个参数是加密后的长度
	   reginfo.password = bcrypt.hashSync(reginfo.password, 10)
	   // 第四步，把账号跟密码插入到users表里面
	   const sql_insert = "insert into users set ?"
	   // 注册身份
	   const identity = '用户'
	   // 创建时间
	   const create_time = new Date()
	   db.query(sql_insert, {
		   account: reginfo.account,
		   password: reginfo.password,
		   identity, // 身份
		   create_time,
		   status: 0 // 初始未冻结的状态为0
	   }, (err, results) => {
		   // 第一种情况：插入失败
		   // 插入失败，数据行数不为1
		   console.log("???",results, err)
		   // 数据库有个id属性没设置自增长的话，这里没加id，results会返回undefined，需要看err
		   if(!results || results.affectedRows !== 1) { // affectedRows 表示数据库操作影响的行数
			   return res.send({
				   status: 1,
				   message: "注册账号失败"
			   })
			   throw err
		   }
		   // 第二种情况：注册成功
		   res.send({
			   status: 1,
			   message: "注册账号成功"
		   })
	   })
   })
}

exports.login = (req, res) => {
	const logInfo = req.body
	// 1. 查看数据表中有没有前端传入的账号
	const sql = 'select * from users where account = ?'
	db.query(sql, logInfo.account, (err, results) => {
		// 使用错误中间件执行sql语句失败的情况, 一般在数据库断开的时候
		if(err) return res.cc(err)
		if(results.length !== 1) return res.cc('登录失败')
		// 2. 对前端传过来的密码进行解密
		const compareResult = bcrypt.compareSync(logInfo.password, results[0].password)
		if(!compareResult) {
			return res.cc('登录失败')
		}
		// 3.对账号是否冻结做判定
		if(results[0].status == 1) {
			return res.cc('账号被冻结')
		}
		
		// 4.生成返回给前端的token
		// 剔除加密后的密码，头像，创建时间，更新时间
		const user = {
			...results[0],
			password: '',
			imageUrl: '',
			create_time:'',
			update_time:''
		}
		
		// 设置token的有效时常， 有效期为7个小时
		const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
			expiresIn: '7h'
		})
		res.send({
			results:results[0],
			status: 0,
			message: '登录成功',
			token:'Bearer' + tokenStr
		})
	})
}