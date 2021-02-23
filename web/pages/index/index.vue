<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id='+uid" hover-class="none" class="top-bar-left">
				<image :src="imgurl" class="my-img"></image>
			</navigator>
			<view class="top-bar-center">
				<image src="https://picsum.photos/200/300" class="logo">logo</image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/index/search.png"></image>
				</view>
				<view class="add">
					<image src="../../static/images/index/add.png"></image>
				</view>
			</view>
		</view>
		<!-- 消息 -->
		<view class="main">
			<view class="refresh" v-if="!refresh">
				<image src="../../static/images/search/search.png"></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<view class="noone" v-if="noone">
				<image src="../../static/images/index/logo.png"></image>
				<view class="no-title">你还没有好友~</view>
				<view class="search-bt" @tap="toSearch">搜索好友</view>
			</view>
			<view class="apply"></view>
			<view class="friends" v-if="requestData>0" @tap="goRequest">
				<view class="friend-list">
					<view class="friend-list-l">
						<text class="tip">{{requestData}}</text>
						<image src="../../static/images/index/one.png"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{changeTime(requestTime)}}</view>
						</view>
						<view class="news">茫茫人海，相聚便是缘分</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friend-list" v-for="(item,index) in friends" :key="index" @tap="toChatRoom(item)">
					<view class="friend-list-l">
						<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friend-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{changeTime(item.lastTime)}}</view>
						</view>
						<view class="news">{{item.msg}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				friends: [],
				uid: '', //用户id
				imgurl: '', //用户头像
				token: '', //token
				myname: '',
				requestData: 0, //好友申请数
				requestTime: '', //最后申请时间
				refresh: false, //下拉刷新状态
				noone: false, //是否没有好友
				test:true,
			}
		},
		onLoad() {
			this.getStorages();
			this.friendRequest();
			this.getFriends();
			this.join(this.uid);
			this.receiveSocketMsg();
		},
		onPullDownRefresh() {
			this.getStorages();
			this.friends = [];
			this.friendRequest();
			this.getFriends();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			changeTime: function(date) {
				return myfun.dateTime(date);
			},
			//获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.imgurl = this.serverUrl + value.imgurl;
						this.token = value.token;
						this.myname = value.name;
					} else {
						//如果没有用户缓存，跳转到登录页面
						uni.navigateTo({
							url: '../signin/signin',
						});
					}
				} catch (e) {
					// error
				}
			},
			//好友申请
			friendRequest: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 2,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
					// console.log(data);
						this.refresh = true;
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							this.noone = false;
							let res = data.data.result;
							// console.log(res);
							this.requestData = res.length;
							if (res.length > 0) {
								this.requestTime = res[0].lastTime;
								for (let i = 0; i < res.length; i++) {
									if (this.requestTime < res[i].lastTime) {
										this.requestTime = res[i].lastTime;
									}
								}
							} else {
								this.noone = true;
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
							});
						}
					}
				});
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 1,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
					// console.log(data);
						this.refresh = true;
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							this.noone = false;
							let res = data.data.result;
							// console.log(res);
							this.requestData = res.length;
							if (res.length > 0) {
								this.requestTime = res[0].lastTime;
								for (let i = 0; i < res.length; i++) {
									if (this.requestTime < res[i].lastTime) {
										this.requestTime = res[i].lastTime;
									}
								}
							} else {
								this.noone = true;
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
							});
						}
					}
				})
			},
			//好友
			getFriends: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 0,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						//console.log(this.uid);
						this.refresh = true;
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							// console.log(data);
							let res = data.data.result;
							// console.log(res);
							if (res.length > 0) {
								this.noone = false;
								for (let i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									if (res[i].markname) {
										res[i].name = res[i].markname;
									}
									this.friends.push(res[i]);
								}
								this.friends = myfun.paixu(this.friends, 'lastTime', 0);
								//获取好友内消息
								for (let i = 0; i < this.friends.length; i++) {
									// this.getLastMsg(this.friends[i].id,i);
								}
							} else {
								//this.noone = true;
							}
							//群列表
							this.getGroup();
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
							});
						}
					}
				})
			},
			//群
			getGroup: function() {
				uni.request({
					url: this.serverUrl + '/index/getgroup',
					data: {
						uid: this.uid,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							let res = data.data.result;
							//console.log(res);
							if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									this.friends.push(res[i]);
								}
							}
							this.friends = myfun.paixu(this.friends, 'lastTime', 0);
							//获取好友内消息
							for (let i = 0; i < this.friends.length; i++) {
								this.getLastMsg(this.friends, i);
								this.getUnread(this.friends, i);
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
							});
						}
					}
				})
			},
			//获取最后消息
			getLastMsg: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/getlastmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						// console.log(status);
						// console.log(data);
						//访问后端成功
						if (status == 200) {
							let res = data.data.result;
							if (res.types == 0) {
								//文字
							} else if (res.types == 1) {
								//图片
								res.message = '[图片]';
							} else if (res.types == 2) {
								//音频
								res.message = '[音频]';
							} else if (res.types == 3) {
								//位置
								res.message = '[位置]';
							}
							let e = arr[i];
							e.msg = res.message;
							arr.splice(i, 1, e);
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
							});
						}
					}
				})
			},
			//未读消息数
			getUnread: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/unreadmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							let res = data.data.result;
							let e = arr[i];
							e.tip = res;
							arr.splice(i, 1, e);
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 300) {
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
							});
						}
					}
				})
			},
			//socket模块
			//用户登录socket注册
			join:function(uid){
				this.socket.emit('login',uid);
			},
			//socket聊天数据接收
			receiveSocketMsg:function(){
				this.socket.on('msg',(msg,fromid)=>{
					let nmsg='';
					if(msg.types==0){
						nmsg=msg.message;
					}else if(msg.types==1){
						nmsg='[图片]';
					}else if(msg.types==2){
						nmsg='[语音]';
					}else if(msg.types==3){
						nmsg='[位置]';
					}
					//对比到对应项，修改
					for(let i=0;i<this.friends.length;i++){
						if(this.friends[i].id==fromid){
							let e = this.friends[i];
							e.lastTime=new Date();
							e.msg = nmsg;
							e.tip++;
							//删除原来数据项
							this.friends.splice(i, 1);
							//新消息插入到最底部
							this.friends.unshift(e);
						}
					}//this.friends
				})
			},
			//跳转搜索页面
			toSearch: function() {
				uni.navigateTo({
					url: '../search/search',
				})
			},
			//进入申请页面
			goRequest: function() {
				uni.navigateTo({
					url: '../friendrequest/friendrequest',
				})
			},
			toChatRoom:function(data){
				// console.log(data.imgurl);
				uni.navigateTo({
					url: '../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type,
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
		.top-bar-right{
			image {
				padding: 38rpx 0 0 38rpx;
				width: 24px;
				height: 24px;
			}
		}
	}

	// 消息
	.main {
		padding-top: 140rpx;
		padding-bottom: $uni-spacing-col-base;
		// border: 1px solid red;
	}

	.refresh {
		text-align: center;
		padding-top: 400rpx;

		image {
			width: 32rpx;
			height: 32rpx;
		}

		.ref-title {
			padding-top: 10rpx;
			font-size: $uni-font-size-base;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}
	}

	.noone {
		text-align: center;
		padding-top: 400rpx;

		image {
			height: 250rpx;
			width: 158rpx;
		}

		.no-title {
			padding: 32rpx 0;
			font-size: $uni-font-size-base;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}

		.search-bt {
			display: inline-block;
			width: 240rpx;
			height: 96rpx;
			background: $uni-color-primary;
			box-shadow: 0px 52rpx 36rpx -32rpx rgba(255, 228, 49, 0.4);
			border-radius: 48rpx;
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 96rpx;
		}
	}

	.friend-list {
		height: 96rpx;
		padding: 16rpx $uni-spacing-col-base;

		&:active {
			background-color: $uni-bg-color-grey;
		}

		.friend-list-l {
			position: relative;
			float: left;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-primary;
			}

			.tip {
				position: absolute;
				z-index: 10;
				top: -8rpx;
				left: 68rpx;
				min-width: 20rpx;
				padding: 0 8rpx;
				height: 36rpx;
				background: $uni-color-warning;
				border-radius: 18rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-inverse;
				line-height: 36rpx;
				text-align: center;
			}
		}

		.friend-list-r {
			padding-left: 128rpx;

			.top {
				height: 50rpx;

				.name {
					float: left;
					font-size: 36rpx;
					font-weight: 400;
					color: $uni-text-color;
					line-height: 50rpx;
				}

				.time {
					float: right;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					line-height: 50rpx;
				}
			}
		}

		.news {
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
	}
</style>
