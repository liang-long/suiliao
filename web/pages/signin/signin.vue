<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar">
			<view class="top-bar-right" @tap="toSignUp">
				<view class="text">注册</view>
			</view>
		</view>
		<view class="logo">
			<image src="https://picsum.photos/id/237/200/300">logo</image>
		</view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好，欢迎来到 随聊！</view>
			<view class="inputs">
				<input type="text" v-model="user" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa;font-weight:400;" />
				<input type="password" v-model="psw" placeholder="密码" class="psw" placeholder-style="color:#aaa;font-weight:400;" />
			</view>
			<view class="tips" :style="{display:mon}">输入用户名或密码错误！</view>
		</view>
		<view class="submit" @tap="login">
			<view class="su-bt">登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '',
				psw: '',
				token: '',
				mon: 'none',
			}
		},
		onLoad: function(e) {
			if (e.user) {
				this.user = e.user;
				uni.showToast({
					title: '注册成功',
					icon: 'none',
					duration: 2000
				});
			} else if (e.name) {
				this.user = e.name;
				uni.showToast({
					title: '登入过期请重新登录',
					icon: 'none',
					duration: 2000
				});
			} else if (e.cgpwd) {
				this.user = e.cgpwd;
				uni.showToast({
					title: '修改成功请重新登录',
					icon: 'none',
					duration: 1500
				});
			}
		},
		methods: {
			//跳转到注册页面
			toSignUp: function() {
				uni.navigateTo({
					url: '../signup/signup',
				})
			},
			// 登入提交
			login: function() {
				if (this.user && this.psw) {
					uni.request({
						url: this.serverUrl + '/signin/match',
						data: {
							data: this.user,
							pwd: this.psw,
						},
						method: 'POST',
						success: (data) => {
							//console.log(data);
							let status = data.data.status;
							//访问后端成功
							if (status == 200) {
								//登录成功
								let res = data.data.back;
								this.mon = 'none';
								//本地存储用户信息
								try {
									uni.setStorageSync('user', {
										'id': res.id,
										'name': res.name,
										'imgurl': res.imgurl,
										'token': res.token
									});
								} catch (e) {
									// error
									console.log('数据存储出错')
								}
								//跳转到首页
								uni.navigateTo({
									url: '../index/index',
								});
							} else if (status == 400) {
								//用户匹配失败
								this.mon = 'block';
								this.psw = '';
							} else if (status == 500) {
								//服务器失败
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

		.slogan {
			font-size: 40rpx;
			color: $uni-text-color-grey;
			line-height: 56rpx;
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

		.tips {
			float: left;
			font-size: $uni-font-size-lg;
			font-weight: 500;
			color: $uni-color-warning;
			line-height: 56px;
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

	.submit .su-bt {
		text-align: center;
	}

	.su-bt {
		font-weight: 500;
		color: $uni-text-color;
		line-height: 48px;
	}

	.submit::before {
		width: 520rpx;
		height: 96rpx;
		background: linear-gradient(90deg, #03a9f4, #f441a5, #03a9f4);
	}

	.submit:before,
	.submit {
		animation: sun 8s infinite;
	}

	@keyframes sun {
		100% {
			background-position: -400% 0;
		}
	}
</style>
