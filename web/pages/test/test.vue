<template>
	<view>
		<view class="upload" @tap="upload">上传图片</view>
		<image v-for="(item,index) in img" :key="index" :src="item"></image>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				id:'asdfg',
				img:[],
			}
		},
		methods: {
			//当前日期文件夹
			upload:function(){
			let url=myfun.fileName(new Date());
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						for(let i=0;i<tempFilePaths.length;i++){
							const uploadTask = uni.uploadFile({
							    url: this.serverUrl+'/files/upload', //仅为示例，非真实的接口地址
							    filePath: tempFilePaths[i],
							    name: 'file',
							    formData: {
							        url: url,
									name:new Date().getTime()+this.id+i,
							    },
							    success: (uploadFileRes) => {
									let path=this.serverUrl+uploadFileRes.data;
									this.img.push(path);
							        //console.log(uploadFileRes.name);
							    }
							});
											
							uploadTask.onProgressUpdate((res) => {
							    console.log('上传进度' + res.progress);
							    console.log('已经上传的数据长度' + res.totalBytesSent);
							    console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
											
							    // 测试条件，取消上传任务。
							    // if (res.progress > 50) {
							    //     uploadTask.abort();
							    // }
							});
						}
				        
				    }
				});
			},
			searchUser: function(e) {
				uni.request({
					url: this.serverUrl + '/cath/msg',
					data: {
						data: e,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						//console.log(data);
						let status = data.data.status;
						//访问后端成功
						if (status == 200) {
							let arr = data.data.result;
							//let exp = eval("/" + e + "/g");
							for (let i = 0; i < arr.length; i++) {
								//if (arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
									this.isFriend(arr[i],e);
								//}
							}
						} else if (status == 300) {
							//token过期跳转到登录页面
							uni.navigateTo({
								url: '../signin/signin?name=' + this.myname,
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
			},
		}
	}
</script>

<style lang="scss">
	.upload{
		padding-top: 40rpx;
		text-align: center;
	}
</style>
