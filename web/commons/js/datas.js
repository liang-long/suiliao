export default{
	friends:function(){
		let friendarr=[
			{
				id:1,
				imgurl:'logo.png',
				tip:2565,
				name:'哈哈',
				email:'haha@163.com',
				time:new Date(),
				news:'单行溢出1,单行溢出,超出部分显示...或者截取。前提必须有宽度。',
			},
			{
				id:2,
				imgurl:'logo.png',
				tip:0,
				name:'呵呵',
				email:'hehe@163.com',
				time:new Date(),
				news:'单行溢出1,单行溢出,超出部分显示...或者截取。前提必须有宽度。',
			},
			{
				id:3,
				imgurl:'logo.png',
				tip:10,
				name:'拉拉',
				email:'lala@163.com',
				time:new Date(),
				news:'超出部分显示...或者截取。前提必须有宽度。',
			},
			{
				id:4,
				imgurl:'logo.png',
				tip:21,
				name:'嗯呢',
				email:'enna@163.com',
				time:new Date(),
				news:'部分显示...或者截取。前提必须有宽度。',
			}
		];
		return friendarr;
	},
	//好友关系
	isFriend:function(){
		let isfriend=[
			{
				userid:1,
				friend:2,
			},
			{
				userid:1,
				friend:4,
			}
		];
		return isfriend;
	},
	//聊天消息
	message:function(){
		let msgs=[
			{
				id:'b',
				imgurl:'logo.png',
				message:{
					name:'天安门城楼售票处',
					address:'东长安街天安门城楼内',
					latitude:'39.909473',
					longitude:'116.3973089999999',
				},
				types:3,
				time:new Date(),
				tip:0,
			},
			{
				id:'a',
				imgurl:'logo.png',
				message:{
					name:'天安门城楼售票处',
					address:'东长安街天安门城楼内',
					latitude:'39.909473',
					longitude:'116.3973089999999',
				},
				types:3,
				time:new Date(),
				tip:0,
			},
			{
				id:'a',
				imgurl:'logo.png',
				message:{
					voice:'a',
					time:60,
				},
				types:2,
				time:new Date(),
				tip:0,
			},
			{
				id:'b',
				imgurl:'logo.png',
				message:{
					voice:'a',
					time:20,
				},
				types:2,
				time:new Date(),
				tip:0,
			},
			{
				id:'a',
				imgurl:'logo.png',
				message:'即使对方NSA的复合物iu返回王府呢就窝囊废大家看法你的身份被误i服务',
				types:0,
				time:new Date()-1000,
				tip:0,
			},
			{
				id:'a',
				imgurl:'logo.png',
				message:'logo.png',
				types:1,
				time:new Date()-1000*16,
				tip:1,
			},
			{
				id:'b',
				imgurl:'logo.png',
				message:'logo.png',
				types:1,
				time:new Date()-1000*16,
				tip:0,
			},
			{
				id:'b',
				imgurl:'logo.png',
				message:'回复额外回复发生的纠纷不得不的萨芬和',
				types:0,
				time:new Date()-1000*16,
				tip:0,
			},
			{
				id:'b',
				imgurl:'logo.png',
				message:'回复额外回复发生的纠纷不得不的萨芬和',
				types:0,
				time:new Date()-1000*18,
				tip:0,
			},
			{
				id:'b',
				imgurl:'logo.png',
				message:'回复额外回复发生的纠纷不得不的萨芬和',
				types:0,
				time:new Date()-1000*20,
				tip:0,
			},
			{
				id:'b',
				imgurl:'logo.png',
				message:'回复额外回复发生的纠纷不得不的萨芬和',
				types:0,
				time:new Date()-1000*22,
				tip:0,
			},
			{
				id:'b',
				imgurl:'logo.png',
				message:'回复额外回复发生的纠纷不得不的萨芬和',
				types:0,
				time:new Date()-1000*24,
				tip:0,
			},
		]
		return msgs;
	}
}