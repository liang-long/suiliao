<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
		</view>
		<view class="logo">
			<image src="https://picsum.photos/200/300">logo</image>
		</view>
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" placeholder="请取个名字" class="user" placeholder-style="color:#aaa;font-weight:400;" @blur="matchUser" />
					<view class="employ" v-if="useremploy">已占用</view>
					<image src="../../static/images/sign/right1.png" class="ok" v-if="isuser"></image>
				</view>
				<view class="inputs-div">
					<input type="text" placeholder="请输入邮箱" class="email" placeholder-style="color:#aaa;font-weight:400;" @blur="isEmail" />
					<view class="employ" v-if="emailemploy">已占用</view>
					<view class="invalid" v-if="invalid">邮箱无效</view>
					<image src="../../static/images/sign/right1.png" class="ok" v-if="isemail"></image>
				</view>
				<view class="inputs-div">
					<input :type="type" placeholder="输入密码" class="psw" placeholder-style="color:#aaa;font-weight:400;" @input="getPsw" />
					<image :src="lookurl" class="look" @tap="looks"></image>
				</view>
			</view>
		</view>
		<view :class="[{submit:isok},{submit1:!isok}]" @tap="signUp">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'password',
				isuser: false, //用户名是否可用
				isemail: false, //邮箱是否可用
				look: false, //是否显示密码
				invalid: false, //邮箱是否符合
				useremploy: false, //名字是否被占有
				emailemploy: false, //邮箱是否被占有
				lookurl: '../../static/images/sign/biyan.png',
				email: '', //邮箱
				user: '', //用户名称
				psw: '', //密码
				isok: false, //按钮判断--颜色
			}
		},
		methods: {
			//密码显示隐藏
			looks: function() {
				if (this.look) {
					this.type = "password";
					this.look = !this.look;
					this.lookurl = '../../static/images/sign/biyan.png';
				} else {
					this.type = "text";
					this.look = !this.look;
					this.lookurl = '../../static/images/sign/look.png';
				}
			},
			//判断是否为邮箱格式
			isEmail: function(e) {
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				this.email = e.detail.value;
				if (this.email.length > 0) {
					if (reg.test(this.email)) {
						this.invalid = false;
						//后端验证邮箱是否被占用
						this.matchMail();
					} else {
						this.invalid = true;
						this.emailemploy = false;
						this.isemail = false;
					}
				}else{
					this.invalid = false;
					this.emailemploy = false;
					this.isemail = false;
					this.isOk();
				}
			},
			//匹配邮箱
			matchMail: function(e) {
				uni.request({
					url: this.serverUrl + '/signup/judge',
					data: {
						data: this.email,
						type: 'email',
					},
					method: 'POST',
					success: (data) => {
						//console.log(data);
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							let res = data.data.result;
							if (res > 0) {
								//表示邮箱已存在
								this.emailemploy = true;
								this.isemail = false;
							} else {
								//表示邮箱不存在
								this.emailemploy = false;
								this.isemail = true;
							}
							this.isOk();
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},
			//匹配用户名
			matchUser: function(e) {
				this.user = e.detail.value;
				if (this.user.length > 0) {
					uni.request({
						url: this.serverUrl + '/signup/judge',
						data: {
							data: this.user,
							type: 'name',
						},
						method: 'POST',
						success: (data) => {
							//console.log(data);
							let status = data.data.status;
							//访问后端成功
							if (status == 200) {
								let res = data.data.result;
								if (res > 0) {
									//表示用户已存在
									this.useremploy = true;
									this.isuser = false;
								} else {
									//表示用户不存在
									this.useremploy = false;
									this.isuser = true;
								}
								this.isOk();
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								});
							}
						}
					})
				}else{
					this.useremploy = false;
					this.isuser = false;
					this.isOk();
				}
			},
			//判断用户名密码是否被占有，密码长度是否大于5
			isOk: function() {
				let that = this;
				if (that.isuser && that.isemail && that.psw.length > 5) {
					that.isok = true;
				} else {
					that.isok = false;
				}
				return that.isok;
			},
			//获取密码
			getPsw: function(e) {
				this.psw = e.detail.value;
				this.isOk();
			},
			//返回登录页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//注册提交
			signUp:function(){
				if(this.isOk()){
					uni.request({
						url: this.serverUrl + '/signup/add',
						data: {
							name: this.user,
							mail: this.email,
							pwd:this.psw,
							time:new Date(),
						},
						method: 'POST',
						success: (data) => {
							//console.log(data);
							let status = data.data.status;
							//访问后端成功
							if (status == 200) {
								//注册成功跳转到登录页面
								uni.navigateTo({
									url:'../signin/signin?user='+this.user,
								});
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								});
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.logo {
		text-align: center;

		image {
			padding-top: 256rpx;
			width: 194rpx;
			height: 92rpx;
			margin: 0 auto;
		}
	}

	.main {
		padding: 54rpx $uni-spacing-row-lg 120rpx;

		//width: 100%;
		.title {
			font-size: 48rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 80rpx;
		}

		.inputs {
			padding-top: 8rpx;

			input {
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88px;
				border-bottom: 1px solid $uni-border-color;
			}
		}

		.inputs-div {
			position: relative;
		}

		.employ,
		.invalid {
			position: absolute;
			right: 0;
			top: 40rpx;
			float: right;
			font-size: $uni-font-size-base;
			font-weight: 500;
			color: $uni-color-warning;
			line-height: 88rpx;
		}

		.ok {
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 38rpx;
			height: 30rpx;
		}

		.look {
			position: absolute;
			right: 0;
			top: 76rpx;
			width: 32rpx;
			height: 18rpx;
		}
	}

	.submit {
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: $uni-color-primary;
		border-radius: 48rpx;
		box-shadow: 0px 50px 32px -36px rgba(255, 228, 49, 0.4);
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 48px;
		text-align: center;
	}

	.submit1 {
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: rgba(39, 40, 50, 0.2);
		;
		border-radius: 48rpx;
		font-size: $uni-font-size-lg;
		font-weight: 500;
		color: $uni-text-color-inverse;
		line-height: 48px;
		text-align: center;
	}
</style>
