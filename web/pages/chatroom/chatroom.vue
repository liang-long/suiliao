<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					{{fname}}
				</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
				<view class="group-img" v-if="type==1">
					<image :src="fimgurl"></image>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="chat" :scroll-with-animation="swanition" :scroll-into-view="scrollToView"
		 @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="loading" :class="{displaynone:isloading}">
					<image src="../../static/images/index/search.png" class="loading-img" :animation="animationData"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.id">
					<view class="chat-time" v-if="item.time!=''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.fromId!=uid">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message" v-if="item.types==0">
							<!-- 文字 -->
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types==1">
							<!-- 图片 -->
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg"></image>
						</view>
						<view class="message" v-if="item.types==2">
							<!-- 语音 -->
							<view class="msg-text voice" :style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
								<image src="../../static/images/common/back.png" class="voice-img"></image>
								{{item.message.time}}″
							</view>
						</view>
						<view class="message" v-if="item.types==3">
							<!-- 位置 -->
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<!-- <map :latitude="item.message.latitude" :longitude="item.message.longitude" class="map" :markers="covers(item.message)"></map> -->
								<image src="../../static/images/chatroom/map.png" mode="aspectFit" class="map-img"></image>
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.fromId==uid">
						<image :src="item.imgurl" class="user-img"></image>
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types==1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
						<view class="message" v-if="item.types==2">
							<!-- 语音 -->
							<view class="msg-text voice" :style="{width:item.message.time*4+'px'}" @tap="playVoice(item.message.voice)">
								{{item.message.time}}″
								<image src="../../static/images/common/back.png" class="voice-img"></image>
							</view>
						</view>
						<view class="message" v-if="item.types==3">
							<!-- 位置 -->
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<!-- <map :latitude="item.message.latitude" :longitude="item.message.longitude" class="map" :markers="covers(item.message)"></map> -->
								<image src="../../static/images/chatroom/map.png" mode="aspectFit" class="map-img"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="padbt">
				
			</view> -->
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import myfun from '../../commons/js/myfun.js';
	import submit from '../../components/submit/submit.vue';
	//音频
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				uid:'',
				imgurl:'',
				token:'',
				uname:'',
				fid:'',
				fname:'',
				fimgurl:'',
				type:'',//0为好友  1为群
				msgs: [],
				imgMsg: [],
				scrollToView: '',
				oldTime: 0,
				inputh: '72',
				animationData: {},
				nowpage: 0, //页码
				pagesize:10,//一页条数
				loading: '',
				isloading: true,
				swanition:true,
				beginloading:true,//开始加载
			}
		},
		onLoad: function(e) {
			this.fid=e.id;
			this.fname=e.name;
			this.type=e.type;
			this.fimgurl=e.imgurl;
			// console.log(e)
			this.getStorages();
			this.getMsg();
			this.receiveSocketMsg();
			//this.nextPage();
		},
		components: {
			submit,
		},
		methods: {
			//获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.imgurl = this.serverUrl + value.imgurl;
						this.token = value.token;
						this.uname = value.name;
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
			//返回登录页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//处理时间
			changeTime: function(date) {
				return myfun.dateTime1(date);
			},
			//滚动顶部加载下一页
			nextPage: function() {
				if(this.nowpage>0&&this.beginloading){
					//出现loading
					this.isloading = false;
					//禁止重复加载
					this.beginloading=false;
					
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start',
					})
					
					this.animation = animation
					
					this.animationData = animation.export()
					let i = 1;
					this.loading = setInterval(function() {
						animation.rotate(i * 30).step()
						this.animationData = animation.export()
						i++;
						//获取聊天数据
						if (i > 20) {
							this.getMsg(this.nowpage);
						}
					}.bind(this), 100)
				}
			},
			//获取聊天数据
			getMsg: function(page) {
				uni.request({
					url: this.serverUrl + '/chat/msg',
					data: {
						uid: this.uid,
						fid:this.fid,
						nowPage:this.nowpage,
						pageSize:this.pagesize,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						//console.log(this.uid);
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							let msg = data.data.result;
							//将获得的数组倒序
							msg.reverse(msg);
							// console.log(res)
							
							if (msg.length > 0) {
								let oldtime=msg[0].time;
								let imgarr=[];
								for (var i = 1; i < msg.length; i++) {
									msg[i].imgurl =this.serverUrl + msg[i].imgurl;
									//时间间隔
									if (i < msg.length - 1) {
										let t = myfun.spacTime(oldtime, msg[i].time);
										if (t) {
											oldtime = t;
										}
										msg[i].time = t;
									}
									//匹配最大时间
									if(this.nowpage==0){
										if(msg[i].time>this.oldTime){
											this.oldTime=msg[i].time;
										}
									}
									//补充图片地址
									if (msg[i].types == 1) {
										msg[i].message = this.serverUrl + msg[i].message;
										imgarr.push(msg[i].message);
									}
									//json字符串还原
									if (msg[i].types == 3) {
										msg[i].message = JSON.parse(msg[i].message);
									}
									//this.msgs.unshift(msg[i]);
								}
								this.msgs=msg.concat(this.msgs);
								this.imgMsg=imgarr.concat(this.imgMsg);
							}
							//判断nowPage
							if (msg.length ==10) {
								//页数加1
								this.nowpage++;
							} else {
								//数据获取完毕
								this.nowpage = -1;
							}
							//页数加1
							this.$nextTick(function() {
								this.swanition=false;
								this.scrollToView = 'msg' + this.msgs[msg.length-1].id;//11
							})
							clearInterval(this.loading);
							//关闭loading
							this.isloading = true;
							//开启重复加载
							this.beginloading=true;
							//console.log(this.msgs);
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
			//获取聊天数据
			getMsg1: function(page) {
				let msg = datas.message();
				let maxpages = msg.length;//模拟数据长度12
				if (msg.length > (page + 1) * 10) {
					maxpages = (page + 1) * 10;
					//页数加1
					this.nowpage++;
				} else {
					//数据获取完毕
					this.nowpage = -1;
				}
				//0			12
				for (var i = page * 10; i < maxpages; i++) {
					msg[i].imgurl = '../../static/' + msg[i].imgurl;
					//时间间隔
					if (i < msg.length - 1) {
						let t = myfun.spacTime(this.oldTime, msg[i].time);
						if (t) {
							this.oldTime = t;
						}
						msg[i].time = t;
					}
					//补充图片地址
					if (msg[i].types == 1) {
						msg[i].message = '../../static/' + msg[i].message;
						this.imgMsg.unshift(msg[i].message);
						//console.log(msg[i].message);
					}
					this.msgs.unshift(msg[i]);
				}
				//页数加1
				this.$nextTick(function() {
					this.swanition=false;
					this.scrollToView = 'msg' + this.msgs[maxpages-page*10-1].tip;//11
				})
				clearInterval(this.loading);
				//关闭loading
				this.isloading = true;
				//开启重复加载
				this.beginloading=true;
				//console.log(this.msgs);
			},
			//预览图片
			previewImg: function(e) {
				let index = 0;
				for (let i = 0; i < this.imgMsg.length; i++) {
					if (this.imgMsg[i] == e) {
						index = i;
					}
				}
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//音频播放
			playVoice: function(e) {
				innerAudioContext.src = e;
				innerAudioContext.play();
			},
			//地图定位
			covers: function(e) {
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/chatroom/dw.png',
				}]
				return (map);
			},
			//导航
			openLocation: function(e) {
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address: e.address,
					success: function() {
						console.log('success');
					}
				});
			},
			//接收输入内容
			inputs: function(e) {
				this.receiveMsg(e,this.uid,this.imgurl,0);
			},
			//接收消息
			receiveMsg: function(e,id,img,tip) {
				//tip==0表示自己发的。tip==1表示好友发的
				//socket提交
				if(e.types==0||e.types==3){
					//发送给后端
					this.sendSocket(e);
				}
				if (e.types == 1) {
					this.imgMsg.push(e.message);
					//提交图片
					//当前日期文件夹
					let url=myfun.fileName(new Date());
					const uploadTask = uni.uploadFile({
					    url: this.serverUrl+'/files/upload', //仅为示例，非真实的接口地址
					    filePath: e.message,
					    name: 'file',
					    formData: {
					        url: url,
							name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10),
					    },
					    success: (uploadFileRes) => {
							let data={
								message:uploadFileRes.data,
								types:e.types,
							}
							this.sendSocket(data);
							//let path=this.serverUrl+uploadFileRes.data;
							//this.img.push(path);
					        //console.log(uploadFileRes.name);
					    }
					});
									
					uploadTask.onProgressUpdate((res) => {
					    // console.log('上传进度' + res.progress);
					    // console.log('已经上传的数据长度' + res.totalBytesSent);
					    // console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
									
					    // 测试条件，取消上传任务。
					    // if (res.progress > 50) {
					    //     uploadTask.abort();
					    // }
					});
				}
				if (e.types == 2) {
					//提交音频
					//当前日期文件夹
					let url=myfun.fileName(new Date());
					const uploadTask = uni.uploadFile({
					    url: this.serverUrl+'/files/upload', //仅为示例，非真实的接口地址
					    filePath: e.message.voice,
					    name: 'file',
					    formData: {
					        url: url,
							name:new Date().getTime()+this.uid+Math.ceil(Math.random()*10),
					    },
					    success: (uploadFileRes) => {
							let data={
								message:uploadFileRes.data,
								types:e.types,
							}
							this.sendSocket(data);
							//let path=this.serverUrl+uploadFileRes.data;
							//this.img.push(path);
					        //console.log(uploadFileRes.name);
					    }
					});
									
					uploadTask.onProgressUpdate((res) => {
					    // console.log('上传进度' + res.progress);
					    // console.log('已经上传的数据长度' + res.totalBytesSent);
					    // console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
									
					    // 测试条件，取消上传任务。
					    // if (res.progress > 50) {
					    //     uploadTask.abort();
					    // }
					});
				}
				this.swanition=true;
				let len = this.msgs.length - 1;
				let nowTime = new Date();
				//时间间隔
				let t = myfun.spacTime(this.oldTime, nowTime);
				if (t) {
					this.oldTime = t;
				}
				//json字符串还原
				if(e.types==3){
					e.message=JSON.parse(e.message);
				}
				nowTime = t;
				let data = {
					fromId: id,//发送者id
					imgurl: img,
					message: e.message,
					types: e.types,
					time: nowTime,
					id: len,
				};
				this.msgs.push(data);
				// console.log(data);
				this.$nextTick(function() {
					this.scrollToView = 'msg' + len;
				})
				
			},
			//聊天数据发送后端
			sendSocket:function(e){
				if(this.type==0){
					//1对1聊天
					this.socket.emit('msg',e,this.uid,this.fid);
				}else{
					//群消息
					this.socket.emit('groupMsg',e,this.uid,this.fid);
				}
			},
			//socket聊天数据接收
			receiveSocketMsg:function(){
				this.socket.on('msg',(msg,fromid,tip)=>{
					if(fromid==this.fid&&tip==0){
						this.swanition=true;
						let len=this.msgs.length;
						let nowTime = new Date();
						//时间间隔
						let t = myfun.spacTime(this.oldTime, nowTime);
						if (t) {
							this.oldTime = t;
						}
						if(msg.types==1||msg.types==2){
							msg.message=this.serverUrl+msg.message;
						}
						
						nowTime = t;
						let data = {
							fromId: fromid,//发送者id
							imgurl: this.fimgurl,
							message: msg.message,
							types: msg.types,
							time: nowTime,
							id: len,
						};
						this.msgs.push(data);
						//判断是否需要添加ip
						if(msg.types==1){
							this.imgMsg.push(msg.message);
						}
						this.$nextTick(function() {
							this.scrollToView = 'msg' + len;
						})
					}
				})
			},
			//输入框高度
			heights: function(e) {
				this.inputh = e;
				this.goBottom();
			},
			//滚动到底部
			goBottom: function() {
				this.swanition=true;
				this.scrollToView = '';
				this.$nextTick(function() {
					let len = this.msgs.length - 1;
					this.scrollToView = 'msg' + this.msgs[len].id;
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	page {
		height: 100%;
	}

	.content {
		height: 100%;
		background: rgba(244, 244, 244, 1);
	}

	.top-bar {
		background: rgba(244, 244, 244, 0.96);
		border-bottom: 1px solid $uni-border-color;

		.group-img {
			position: absolute;
			bottom: 20rpx;
			right: $uni-spacing-col-base;
			width: 68rpx;
			height: 68rpx;

			image {
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
			}
		}
	}

	.displaynone {
		display: none;
	}

	.chat {
		height: 100%;

		.padbt {
			height: env(safe-area-inset-bottom);
			;
			width: 100%;

		}

		.loading {
			text-align: center;

			.loading-img {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			//padding-bottom: 120rpx;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			.chat-time {
				font-size: $uni-font-size-sm;
				color: rgba(39, 40, 50, 0.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;

				.user-img {
					flex: none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					border-radius: $uni-border-radius-base;
				}

				.message {
					flex: none;
					max-width: 480rpx;
				}

				.msg-text {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx;
				}

				.msg-img {
					max-width: 380rpx;
					border-radius: $uni-border-radius-base;
				}

				.msg-map {
					background: #fff;
					width: 464rpx;
					height: 284rpx;
					overflow: hidden;

					.map-name {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx 0 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-address {
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
						padding: 0rpx 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-img {
						padding-top: 8rpx;
						width: 480rpx;
						height: 180rpx;
					}
				}

				.voice {
					min-width: 80rpx;
					max-width: 250rpx;
				}

				.voice-img {
					width: 28rpx;
					height: 36rpx;
				}
			}

			.msg-left {
				flex-direction: row;

				.msg-text {
					margin-left: 16rpx;
					background-color: #fff;
					border-radius: 0px 20rpx 20rpx 20rpx;
				}

				.msg-img {
					margin-left: 16rpx;
				}

				.msg-map {
					margin-left: 16rpx;
					border-radius: 0px 20rpx 20rpx 20rpx;
				}

				.voice {
					text-align: right;
				}

				.voice-img {
					float: left;
					transform: rotate(180deg);
					width: 28rpx;
					height: 36rpx;
					padding-bottom: 4rpx;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					background-color: #fff260;
					border-radius: 20rpx 0rpx 20rpx 20rpx;
				}

				.msg-img {
					margin-right: 16rpx;
				}

				.msg-map {
					margin-right: 16rpx;
					border-radius: 20px 0rpx 20rpx 20rpx;
				}

				.voice {
					text-align: left;
				}

				.voice-img {
					float: right;
					padding-top: 4rpx;
					width: 28rpx;
					height: 36rpx;
				}
			}
		}
	}
</style>
