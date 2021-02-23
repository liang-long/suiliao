<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/common/back.png" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					详情
				</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head" v-if="id==uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
					<image :src="cropFilePath" class="user-img" v-if="id!=uid"></image>
				</view>
				<view class="row" @tap="modify('explain','签名',user.explain,false)" v-if="id==uid">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">
						{{changeTime(user.time)}}
					</view>
				</view>
			</view>
			<view class="column">
				<view class="row" @tap="modify('name','昵称',user.name,false)" v-if="id==uid">
					<view class="title">昵称</view>
					<view class="cont">
						{{user.name}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('markname','昵称',markname,false)" v-if="id!=uid">
					<view class="title">昵称</view>
					<view class="cont">
						{{markname}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array" v-if="id==uid">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{array[index]}}</view>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" v-if="id==uid">
							<view class="uni-input">{{date}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{date}}</view>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('phone','电话',user.phone,false)" v-if="id==uid">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
				</view>
				<view class="row" @tap="modify('email','邮箱',user.email,true)" v-if="id==uid">
					<view class="title">邮箱</view>
					<view class="cont">
						{{user.email}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">邮箱</view>
					<view class="cont">
						{{user.email}}
					</view>
				</view>
			</view>
			<view class="column" v-if="id==uid" @tap="modify('psw','密码','',true)">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">
						******
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="bt2" v-if="uid==id" @tap="quit">退出登录</view>
			<view class="bt2" v-if="uid!=id" @tap="deleteFriend">删除好友</view>
		</view>
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">{{modifyTitle}}</view>
				<view class="define" @tap="modifyStbmit">确定</view>
			</view>
			<view class="modfiy-main">
				<input type="text" v-model="pwd" class="modfiy-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa;font-weight:400;"
				 :style="{display:ispwd}" />
				<textarea v-model="data" class="modfiy-content" />
				</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from "@/commons/js/myfun.js";
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				id:'',
				uid:'',
				myname:'',
				token:'',
				user:'',
				markname:'',
				cropFilePath: '../../static/logo.png',
				array: ['男', '女', '未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				headimg: '',
				modifyTitle:'',							//修改标题
				data:'',								//修改内容
				oldData:'',								//原始数据
				ispwd:false,							//是否显示密码项
				pwd:undefined,									//原密码
				type:'',								//修改项
				animationData:{},						//动画
				isModfiy:false,							//动画开关
				widHeight:'1000',							//页面高度
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		components: {
			ImageCropper
		},
		onLoad:function(e){
			this.id=e.id;
			this.getStorages();
			this.getUser();
			this.getMarkName();
		},
		onReady:function(){
				this.getElementStyle();
		},
		methods: {
			//返回登录页面
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.token = value.token;
						this.myname=value.name;
						//this.cropFilePath = this.serverUrl + '/user/' + value.imgurl;
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
			//获取用户信息
			getUser:function(){
				uni.request({
					url: this.serverUrl + '/user/detial',
					data: {
						id: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						//console.log(data);
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							let res = data.data.result;
							//console.log(res);
							//处理头像链接
							this.cropFilePath=this.serverUrl + res.imgurl;
							//处理简介
							if(res.explain==undefined){
								res.explain='这个人很懒，什么都没有留下~';
							}
							//处理生日
							if(res.birth==undefined){
								res.date='00000-00-00';
							}else{
								let birth= myfun.detialTime1(res.birth)
								this.date=birth;
							}
							//处理电话
							if(res.phone==undefined){
								res.phone='000';
							}
							//处理markname
							if(this.markname.length==0){
								this.markname=res.name;
							}
							this.sexJudge(res.sex);
							this.user=res;
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						}else if(status==300){
							//token过期跳转到登录页面
							uni.navigateTo({
								url:'../signin/signin?name='+this.myname,
							});
						}
					}
				})
			},
			//性别判断
			sexJudge:function(e){
				if(e=='female'){
					//女性
					this.index=1;
				}else if(e=='male'){
					//男性
					this.index=0;
				}else{
					this.index=2;
				}
			},
			//获取好友昵称
			getMarkName:function(){
				if(this.id!=this.uid){
					uni.request({
						url: this.serverUrl + '/user/getmarkname',
						data: {
							uid: this.uid,
							fid:this.id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							//console.log(data);
							let status = data.data.status;
							//访问后端成功
							if (status == 200) {
								let res = data.data.result;
								if(res.markname!=undefined){
									//如果存在
									this.markname=res.markname;
								}
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								});
							}else if(status==300){
								//token过期跳转到登录页面
								uni.navigateTo({
									url: '../signin/signin?name=' + this.myname,
								});
							}
						}
					})
				}
			},
			//时间处理
			changeTime:function(date){
				return myfun.detialTime(date);
			},
			// 性别选择器
			bindPickerChange: function(e) {
				//console.log('picker发送选择改变，携带值为', e.target.value)
				let oldIndex=this.index;
				this.index = e.target.value
				if(this.index!=oldIndex){
					let sex='asexual';
					if(this.index==0){
						//男
						sex='male';
					}else if(this.index=1){
						//女
						sex='female';
					}
					this.update(sex,'sex',undefined);
				}
			},
			//日期选择器
			bindDateChange: function(e) {
				let oldDate=this.date;
				this.date = e.target.value
				if(this.date!=oldDate){
					this.update(this.date,'birth',undefined);
				}
			},
			//获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},

			//头像裁剪
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			confirm(e) {
				this.tempFilePath = '';
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;

				uni.uploadFile({
					url:this.serverUrl +'/files/upload',  //后端地址上传图片接口地址
					filePath: this.headimg,
					name: 'file',
					fileType: 'image',
					formData:{
						url:'user',
						name:this.uid,
						token:this.token,
					},											//传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						//本地存储用户信息修改
						try {
						    uni.setStorageSync('user', {'id':this.uid,'name':this.myname,'imgurl':backstr,'token':this.token});
						} catch (e) {
						    // error
							console.log('数据存储出错')
						}
						//修改头像保存到数据库
						this.update(backstr,'imgurl',undefined);
					},
					complete() {
						//console.log("this is headimg"+this.headimg)   
					},
					fail(e) {
						console.log("this is errormes " + e.message)
					}

				});

				
			},
			cancel() {
				console.log('canceled')
			},
			//修改数据
			update:function(d,type,pwd){
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.uid,
						data:d,
						type:type,
						pwd:pwd,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						//console.log(data);
						let status = data.data.status;
						//console.log(data.data);
						//访问后端成功
						if (status == 200) {
							// console.log(data.data);
							//this.modify();
							this.user[type]=d;
							if(type=='psw'){
								//清除缓存
								uni.removeStorage({
								    key: 'user',
								    success: function (res) {
								        console.log('success');
								    }
								});
								//用户需要重新登录
								uni.navigateTo({
									url: '../signin/signin?cgpwd=' + this.myname,
								});
							}
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						}else if(status == 300){
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
							});
						}else if(status == 400){
							//密码匹配失败
							uni.showToast({
								title: '输入原始密码错误！',
								icon: 'none',
								duration: 2000
							});
						}else if(status == 600){
							//修改项已被占用
							uni.showToast({
								title: '已被占用！',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},
			//获取页面高度
			getElementStyle:function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  this.widHeight=data.height;
				}).exec();
			},
			//修改项弹窗
			modify:function(t,type,data,ispwd){
				if(ispwd){
					this.ispwd='block';
					this.pwd='0';
				}else{
					this.ispwd='none';
					this.pwd=undefined;
				}
				this.type=t;
				this.modifyTitle=type,
				this.oldData=data;
				this.data=data;
				this.isModfiy=!this.isModfiy;
				var animation = uni.createAnimation({
				    duration: 300,
				    timingFunction: 'ease',
				})
				
				if(this.isModfiy){
					animation.bottom(0).step()
				}else{
					animation.bottom(-this.widHeight).step()
				}
				 this.animationData = animation.export()
			},
			//弹窗修改确定
			modifyStbmit:function(){
				//提交修改
				
				if(this.data.length>0&&this.data!=this.oldData){
					//console.log('p:'+this.pwd+',data:'+this.data+',type:'+this.type);
					if(this.type=='markname'){
						this.updateFriendName();
						this.markname=this.data;
					}else if(this.type=='email'){
						//匹配邮箱格式
						let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
						if (reg.test(this.data)) {
							this.update(this.data,this.type,this.pwd);
							//前端替换修改
							//this.user[this.type]=this.data;
						}else{
							uni.showToast({
								title: '邮箱格式错误！',
								icon: 'none',
								duration: 2000
							});
						}
					}else{
						this.update(this.data,this.type,this.pwd);
						//前端替换修改
						//this.user[this.type]=this.data;
					}
				}
				//关闭弹窗
				this.modify();
			},
			//好友昵称修改
			updateFriendName:function(){
				if(this.data.length>0&&this.data!=this.oldData){
					uni.request({
						url: this.serverUrl + '/user/updatemarkname',
						data: {
							uid: this.uid,
							fid:this.id,
							name:this.data,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							//console.log(data);
							let status = data.data.status;
							//访问后端成功
							if (status == 200) {
								console.log('ok');
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错啦！',
									icon: 'none',
									duration: 2000
								});
							}else if(status==300){
								//token过期跳转到登录页面
								uni.navigateTo({
									url: '../signin/signin?name=' + this.myname,
								});
							}
						}
					})
				}
			},
			//退出登录
			quit:function(){
				uni.removeStorage({
				    key: 'user',
				    success: function (res) {
				        console.log('success');
				    }
				});
				uni.navigateTo({
					url: '../signin/signin',
				});
			},
			//删除好友
			deleteFriend:function(){
				uni.showModal({
				    title: '提示',
				    content: '确定删除该好友吗？',
				    success: (res)=> {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.request({
								url: this.serverUrl + '/friend/deletefriend',
								data: {
									uid: this.uid,
									fid:this.id,
									token: this.token,
								},
								method: 'POST',
								success: (data) => {
									//console.log(data);
									let status = data.data.status;
									//访问后端成功
									if (status == 200) {
										//删除成功，跳到首页
										uni.navigateTo({
											url: '../index/index',
										});
									} else if (status == 500) {
										uni.showToast({
											title: '服务器出错啦！',
											icon: 'none',
											duration: 2000
										});
									}else if(status==300){
										//token过期跳转到登录页面
										uni.navigateTo({
											url: '../signin/signin?name=' + this.myname,
										});
									}
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
	}

	.main {
		padding-top: 140rpx;
		display: flex;
		flex-direction: column;

		.column {
			display: flex;
			flex-direction: column;
			padding-top: 12rpx;
			width: 100%;
			border-bottom: 1px solid $uni-border-color;

			.row {
				display: flex;
				flex-direction: row;
			}

			.title {
				flex: none;
				padding: 0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
			}

			.head {
				height: 118rpx;
				display: flex;
				align-items: center;
			}

			.user-head {
				flex: auto;
			}

			.user-img {
				width: $uni-img-size-lg;
				height: $uni-img-size-lg;
				border-radius: $uni-border-radius-base;
			}

			.cont {
				flex: auto;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
				line-height: 112rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.more {
				flex: none;
				height: 112rpx;
				display: flex;
				align-items: center;

				image {
					width: 80rpx;
					height: 28rpx;
				}
			}
		}

		.bt2 {
			margin-top: 180rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 88rpx;
		}
	}
	// 修改弹窗
	.modify{
		position: fixed;
		z-index: 1002;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
		.modify-header{
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			.close{
				padding-left:$uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title{
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define{
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-color-success;
				line-height: 44rpx;
			}
		}
		.modfiy-main{
			display: flex;
			padding: $uni-spacing-col-base;
			flex-direction: column;
			.modfiy-pwd{
				margin-bottom: $uni-spacing-col-base;
				padding: 0 20rpx;
				box-sizing: border-box;
				flex: auto;
				width: 100%;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.modfiy-content{
				padding: 16rpx 20rpx;
				box-sizing: border-box;
				flex: auto;
				width: 100%;
				height: 386rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
</style>
