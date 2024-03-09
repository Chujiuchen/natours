//catch 语句单独封装起来 next 会自动把错误传送到创建的错误中间键(errorController.js)进行验证
module.exports = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};