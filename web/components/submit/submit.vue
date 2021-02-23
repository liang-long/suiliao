<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="records">
					<image :src="toc"></image>
				</view>
				<textarea auto-height="true" class="chat-send btn" :class="{displaynone:isrecord}" @input="inputs" v-model="msg" @focus="focus"/>
				<view class="record btn" :class="{displaynone:!isrecord}" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">按住说话</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/images/submit/emoji.png"></image>
				</view>
				<view class="bt-img" @tap="more">
					<image src="../../static/images/submit/more.png"></image>
				</view>
			</view>
			<view class="emoji" :class="{displaynone:isemoji}">
				<view class="emoji-send">
					<view class="emoji-send-det" @tap="emojiBack"><image src="../../static/images/submit/back.png"></image></view>
					<view class="emoji-send-bt" @tap="emojiSend">发送</view>
				</view>
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
			<view class="more" :class="{displaynone:ismore}">
				<view class="more-list" @tap="sendImg('album')">
					<image src="../../static/images/index/one.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')">
					<image src="../../static/images/index/one.png"></image>
					<view class="more-list-title">拍照</view>
				</view>
				<view class="more-list" @tap="chooseLocation">
					<image src="../../static/images/index/one.png"></image>
					<view class="more-list-title">定位</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/index/one.png"></image>
					<view class="more-list-title">视频</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/index/one.png"></image>
					<view class="more-list-title">文件</view>
				</view>
			</view>
		</view>
		<view class="voice-bg" :class="{displaynone:voicebg}">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width:vlength/0.6+'%'}">{{vlength}}″</view>
			</view>
			<view class="voice-del">上滑取消录音</view>
		</view>
	</view>
</template>

<script>
	import emoji from './emoji/emoji.vue';
	//录音
	const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				isrecord:false,
				isemoji:true,
				ismore:true,
				msg:'',
				toc:"../../static/images/submit/yuyin.png",
				timer:'',//计时器
				vlength:0,//音频时长
				voicebg:true,//语音遮罩层
				pageY:0,
			}
		},
		components:{
			emoji,
		},
		methods: {
			//获取页面高度
			getElementHeight:function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
				  this.$emit('heights',data.height);
				}).exec();
			},
			//点击切换音频
			records:function(){
				//关闭其他项
				this.isemoji=true;
				this.ismore=true;
				setTimeout(()=>{
					this.getElementHeight();
				},10);
				if(this.isrecord){
					this.isrecord=false;
					this.toc="../../static/images/submit/yuyin.png";
				}else{
					this.isrecord=true;
					this.toc="../../static/images/submit/yuyin.png";
				}
			},
			//表情
			emoji:function(){
				this.isemoji=!this.isemoji;
				//关闭其他功能项
				this.ismore=true;
				this.isrecord=false;
				this.toc="../../static/images/submit/yuyin.png";
				setTimeout(()=>{
					this.getElementHeight();
				},10);
			},
			//接收表情
			emotion:function(e){
				this.msg=this.msg+e;
			},
			//文字发送
			inputs:function(e){
				var chatm=e.detail.value;
				var pos=chatm.indexOf('\n');
				if(pos!=-1&&chatm.length>1){
					this.send(this.msg,0);
				}
			},
			//输入框聚焦
			focus:function(){
				this.isemoji=true;
				this.ismore=true;
				setTimeout(()=>{
					this.getElementHeight();
				},10);
			},
			//表情内发送
			emojiSend:function(){
				if(this.msg.length>0){
					this.send(this.msg,0);
				}
			},
			//表情内退格
			emojiBack:function(){
				if(this.msg.length>0){
					this.msg=this.msg.substring(0,this.msg.length-1);
				}
			},
			//更多功能
			more:function(){
				this.ismore=!this.more;
				//关闭其他项
				this.isemoji=true;
				this.isrecord=false;
				setTimeout(()=>{
					this.getElementHeight();
				},10);
			},
			//图片发送
			sendImg:function(e){
				let count=9;
				if(e=='album'){
					count=9;
				}else{
					count=1;
				}
				uni.chooseImage({
				    count: count, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [e], //从相册选择
				    success:  (res)=> {
						const filePaths=res.tempFilePaths;
						for(let i=0;i<filePaths.length;i++){
							this.send(filePaths[i],1);
						}
				    }
				});
			},
			//音频处理
			//开始录音
			touchstart:function(){
				console.log('开始')
				//点击时y轴位置
				this.pageY=e.changedTouches[0].pageY;
				this.voicebg=false;
				let i=1;
				this.timer=setInterval(()=>{
					this.vlength=i;
					i++
					//console.log(i)
					if(i>60){
						clearInterval(this.timer);
						this.touchend();
					}
				},1000)
				recorderManager.start();
			},
			//结束录音
			touchend:function(){
				console.log('结束')
				clearInterval(this.timer);
				recorderManager.stop();
				   recorderManager.onStop((res)=> {
					let data={
						voice:res.tempFilePath,
						time:this.vlength,
					}
					if(!this.voicebg){
						this.send(data,2);
					}
					//时长归位
					this.vlength=0;
					this.voicebg=true;
				});
			},
			//终止录音
			touchmove:function(e){
				if(this.pageY-e.changedTouches[0].pageY>100){
					//关闭语音遮罩层
					this.voicebg=true;
				}
			},
			//选择定位
			chooseLocation:function(){
				uni.chooseLocation({
				    success: res => {
						let data={
							name:res.name,
							address:res.address,
							latitude:res.latitude,
							longitude:res.longitude,
						}
						//json转json字符串
						let stringData=JSON.stringify(data);
						this.send(stringData,3);
				        // console.log('位置名称：' + res.name);
				        // console.log('详细地址：' + res.address);
				        // console.log('纬度：' + res.latitude);
				        // console.log('经度：' + res.longitude);
				    }
				});
			},
			//发送
			send:function(msg,type){
				let data={
					message:msg,
					types:type,
				}
				this.$emit('inputs',data);
				setTimeout(()=>{
					this.msg='';
				},0);
			}
		}
	}
</script>

<style lang="scss">
	.submit{
		background: rgba(244,244,244,0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 1002;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.displaynone{
		display: none;
	}
	.submit-chat{
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;
		image{
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}
		.btn{
			flex: auto;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
		}
		.chat-send{
			line-height: 44rpx;
		}
		.record{
			line-height: 44rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
		}
		
	}
	.emoji{
		width: 100%;
		height: 450rpx;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0px 0px rgba(0,0,0,0.1);
		.emoji-send{
			width: 300rpx;
			height: 104rpx;
			padding-top: 24rpx;
			background-color: rgba(236,237,238,0.9);
			position: fixed;
			bottom: env(safe-area-inset-bottom);
			right: 0;
			display: flex;
			.emoji-send-bt{
				flex: 1;
				margin: 0 32rpx 0 20rpx;
				height: 88rpx;
				background-color: rgba(255,228,49,1);
				font-size: 32rpx;
				text-align: center;
				line-height: 88rpx;
				border-radius: 12rpx;
			}
			.emoji-send-det{
				flex: 1;
				margin-left: 24rpx;
				height: 82rpx;
				background-color: #fff;
				font-size: 32rpx;
				text-align: center;
				line-height: 88rpx;
				padding-top: 8rpx;
				border-radius: 12rpx;
				image{
					width: 48rpx;
					height: 34rpx;
				}
			}
		}
	}
	.more{
		width: 100%;
		height: 436rpx;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0px 0px rgba(0,0,0,0.1);
		bottom: env(safe-area-inset-bottom);
		padding: 8rpx 20rpx;
		box-sizing: border-box;
		.more-list{
			width: 25%;
			text-align: center;
			float: left;
			padding-top: 32rpx;
			image{
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background: rgba(255,255,255,1);
				border-radius: 24rpx;
			}
			.more-list-title{
				font-size: 24rpx;
				color: rgba(39,40,50,0.5);
				line-height: 34rpx;
			}
		}
	}
	.voice-bg{
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1001;
		.voice-bg-len{
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255,255,255,0.2);
			border-radius: 42rpx;
			text-align: center;
		}
		.voice-bg-time{
			display: inline-block;
			min-width: 120rpx;
			line-height: 84rpx;
			background-color: $uni-color-primary;
			border-radius: 42rpx;
		}
		.voice-del{
			position: absolute;
			bottom: 148rpx;
			margin-bottom: env(safe-area-inset-bottom);
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: $uni-font-size-base;
		}
	}
</style>
