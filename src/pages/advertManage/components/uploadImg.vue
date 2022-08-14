 <!-- 上传图片 -->
<template>
   <div class="upload-box">
        <el-upload
            class="upload-img"
            action="imageUrl"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="exceedFile"
            :show-file-list="false"
            :before-upload="beforeUploadFile">
            <el-image v-if="imgUrlList" :src="imageUrl + imgUrlList" class="avatar" fit="contain"></el-image>

            <el-button v-else size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">(仅支持一张)</span>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="imgUrlPreview" alt="">
        </el-dialog>
   </div>
</template>
<script>

export default {
    props: {

        //图片域名
        imageUrl:{
          type:String,
          default:false
        },

        value:{
            type: String,
            default: ''
        },
    },
    data(){
        return{
            dialogVisible:false,
            imageUrl: '',
            imgUrlList:'',
            imgUrlPreview:'',
        }
    },
    watch:{
        imgUrlList (newVal) {
            this.$emit("input", newVal)
        },
        value (newVal) {
            this.imgUrlList = newVal
        }
    },
    created () {
        // console.log("this.value",this.value)
    },
    methods:{

		// 文件超出个数限制时的钩子
		exceedFile(files, fileList) {
            // console.log("文件超出个",files, fileList)
			this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
		},

        // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
		beforeUploadFile(file) {
			let extension = file.name.substring(file.name.lastIndexOf('.')+1);
			const isLt5M = file.size / 1024 / 1024 < 5;
			if(extension !== 'png') {
				this.$message.warning('只能上传后缀是.png的文件');
			}
			if (!isLt5M) {
				this.$message.error("请上传5M以下的图片");
				return false;
			}
		},

        // 删除上传图片
        handleRemove(file, fileList) {
            this.imgUrlList = ''
        },

        //查看大图
        handlePictureCardPreview(file) {
            this.imgUrlPreview = file.url;
            this.dialogVisible = true;
        },

        //上传图片调接口
		uploadImg(content) {

            let query = content.file //取需要上传的file值
            let callback = (dataset = {}) => {
                if ( dataset.list.result) {
                     this.imgUrlList = dataset.list.data[0]
                    console.log("this.imgUrlList",this.imgUrlList)
				} else {
					this.$message.error( dataset.list.message);
				}
            }

            this.$emit("GetApiData", { query, callback });

            return
			this.$api.forUpload(formData).then((res) => {
				console.log("上传图片返回参数",res)
				if (res.result) {

                    let files = {url: this.imageUrl + res.data[0]};
					this.imgUrlList.push(files)
                    this.$emit('successHandle', this.imgUrlList)
                    console.log("this.imgUrlList",this.imgUrlList)
				} else {
					this.$message.error(res.message);
				}
			}).catch((err) => {
				console.log("上传接口err",err);
				this.$message({ message: err, type: 'error' })
			})
		},


    }

}
</script>
<style lang="less" scoped>

</style>
