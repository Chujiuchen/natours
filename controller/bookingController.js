const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
	// 1. 获取数据库中的旅游信息
	const tour = await Tour.findById(req.params.tourId);
	console.log(tour);
	// 2. 使用Stripe创建一个结账会话
	const session = await stripe.checkout.sessions.create({
		// 支付方式类型为卡
		payment_method_types: ['card'],
		// 成功时的重定向链接
		success_url: `${req.protocol}://127.0.0.1:3000/`,
		// 取消时的重定向链接
		cancel_url: `${req.protocol}://127.0.0.1:3000/tours/${tour.slug}`,
		// 客户参考ID为请求的旅游ID
		client_reference_id: req.params.tourId,
		// 购物车中的商品信息
		line_items: [{
			price_data: {
				// 货币为美元
				currency: 'usd',
				// 产品数据包括名称、图片、描述
				product_data:{
					name: tour.name,
					images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
					description: tour.summary,
				},
				// 单价为旅游的价格乘以100
				unit_amount: tour.price * 100,
			},
			// 数量为1
			quantity: 1,
		}],
		// 模式为支付
		mode: 'payment'
	});
	// 3. 将用户重定向到结账页面
	res.status(200).json({
		success:'success',
		session
	});
});
