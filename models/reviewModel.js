const mongoose = require('mongoose');
const tourSchema = require('./tourModel');
//创建评价Model 每个旅游都需要有评论 每个评论都需要有用户
const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			require: [true, 'Review can not be empty!']
		},
		rating: {
			type: Number,
			min: 1,
			max: 5
		},
		createAt: {
			type: Date,
			default: Date.now()
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			require: [true, 'Review must belong to tour.']
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			require: [true, 'Review must belong to a user.']
		}

	}, {
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// 设置索引 保证每个用户给每个旅游的评论只能有一个
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
	//每次查询前执行 把user数据加进tour中对应的user._id
	// this.populate({
	// 	path: 'user',
	// 	select: 'name'
	// }).populate({
	// 	path:'tour',
	// 	select:'name photo'
	// });
	this.populate({
		path: 'user',
		select: 'name photo'
	});
	next();
});


//计算tour的平均评分
reviewSchema.statics.calcAverageRating = async function(tourId) {
	console.log(tourId);
	// 使用聚合管道计算特定旅行的平均评分
	const stats = await this.aggregate([
		{
			$match: { tour: tourId } // 匹配特定旅行的评论
		},
		{
			$group: {
				_id: '$tour', // 按旅游ID分组
				nRating: { $sum: 1 }, // 计算评论的个数
				avgRating: { $avg: '$rating' } // 计算评分的平均值
			}
		}
	]);
	// console.log(stats);
	// 更新旅游的平均评分和评论数量
	if (stats.length > 0) {//判断下如果没有评论了就else
		await tourSchema.findByIdAndUpdate(tourId, {
			//{ _id: 65f3bfd0008b592990f3926b, nRating: 5, avgRating: 4 }
			ratingsAverage: stats[0].avgRating,// 更新旅游的平均评分
			ratingsQuantity: stats[0].nRating // 更新旅游的评论数量
		});
	} else {
		await tourSchema.findByIdAndUpdate(tourId, {
			ratingsAverage: 4.5,// 更新旅游的平均评分为默认值
			ratingsQuantity: 0 // 更新旅游的评论数量为默认值
		});
	}
};

// 在保存操作后，计算旅游的平均评分
reviewSchema.post('save', function() {
	this.constructor.calcAverageRating(this.tour);
});

// 在删除和更新操作后，计算旅游的平均评分 findOneAndUpdate() findOndAndDelete()
reviewSchema.pre(/^findOneAnd/, async function(next) {
	// console.log(111);
	this.r = await this.findOne();
	console.log(this.r);
	next();
});
reviewSchema.post(/^findOneAnd/, async function() {
	// console.log(222);
	await this.r.constructor.calcAverageRating(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;