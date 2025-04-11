// 导入joi， 对账号和密码进行一个值的验证
const joi = require('joi')

/**
 * 账号的验证 
 * string 只允许是字符串 
 * alphanum只允许值为 a-z A-Z 0-9
 * min 最小长度
 * max 最大长度
 * required 必填项
*/ 
const account = joi.string().alphanum().min(6).max(12).required()
/**密码的验证
 * pattern 传入值正则验证
*/ 
const password = joi.string().pattern(/^(?![0-9]+$)[a-zA-Z0-9]{1,50}$/).min(6).max(12).required()


exports.login_limit = {
	// 表示对 req.body 里面的数据进行验证
	body: {
		account,
		password
	}
}