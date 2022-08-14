<template>
<!-- 综合设置 新增/修改 -->
  <div class='editAdvertPosit'>
    <el-form :size='size' ref="form" :rules="rules" :model="form" label-width="140px">
     <el-form-item class='imgDiv' label="图片：" prop="imgUrl">
        <el-upload
          :model='form.imgUrl'
          accept="image/*"
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadCheckImg"
          :show-file-list="false"
          >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <small style='color:red'>图片尺寸建议 375*500</small>
      </el-form-item>
      <el-form-item label="按键名称：" prop="buttonName">
        <el-input clearable placeholder="请输入" v-model="form.buttonName"></el-input>
      </el-form-item>
      <el-form-item label="生效渠道：" prop="appFlag">
        <el-checkbox-group v-model="form.appFlag" size="small">
          <el-checkbox label="BC" value='BC' border>识贝比</el-checkbox>
          <el-checkbox label="PC" value='PC' border>识贝拼</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生效设备：" prop="systemType">
        <el-checkbox-group v-model="form.systemType" size="small">
          <el-checkbox label="android"  value='android' border>安卓</el-checkbox>
          <el-checkbox label="ios" value='ios' border>苹果</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生效时间：" prop="effectiveDatetimeStr">
        <el-date-picker
          v-model="form.effectiveDatetimeStr"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="是否启用：" prop='isEnable'>
       <!-- 是否启用 1启用0不启用 -->
        <el-radio v-model="form.isEnable" label="1">是</el-radio>
        <el-radio v-model="form.isEnable" label="0">否</el-radio>
      </el-form-item>
      <el-form-item class='btnCon'>
        <el-button :size='size' type="primary" :load='saveLoading' @click="onSubmit">保存</el-button>
        <el-button :size='size' @click='cancle'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 接口函数依次：广告列表页查询
import { saveWealth,forUpload} from "../../../apis/index"
export default {
	name: 'editAdvert',
	components:{},
	data() {
		return {
      size: 'small',
      saveLoading:false,
      imageUrl:"",
      lableUrl:"",
      UserLvList:[],
      form: {
        buttonName: '开始体验',
        imgUrl: '',
        appFlag:[],
        systemType:[],
        effectiveDatetimeStr:null,
        isEnable:''
      },
      rules: {
        imgUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        buttonName: [
          { required: true, message: '请输入按钮名称', trigger: 'change' }
        ],
        appFlag: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
       systemType: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        effectiveDatetimeStr: [
          { required: true, message: '请选择生效时间', trigger: 'change' }
        ],
        isEnable: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ],
      }
		}
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  created () {
    if (this.$route.query.id) {
      let appFlag=sessionStorage.getItem('detailMsg')==""?this.form:JSON.parse(sessionStorage.getItem('detailMsg')).appFlag
      let systemType=sessionStorage.getItem('detailMsg')==""?this.form:JSON.parse(sessionStorage.getItem('detailMsg')).systemType
      this.form=sessionStorage.getItem('detailMsg')==null?this.form:JSON.parse(sessionStorage.getItem('detailMsg'))
      if (appFlag.indexOf(',')) {
        this.form.appFlag=appFlag.split(",")
      } else {
        this.form.appFlag.push(appFlag)
      }
      if (systemType.indexOf(',')) {
        this.form.systemType=systemType.split(",")
      } else {
        this.form.systemType.push(systemType)
      }
      this.imageUrl=`${this.$Config.aliyuncHost}${this.form.imgUrl}`
      this.form.effectiveDatetimeStr=this.form.effectiveDatetime
    }
  },
  mounted() {
  },

	methods: {
    //  上传图片
    uploadCheckImg(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '1');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.imgUrl=res.data[0]
          this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    
    // 角标图片上传
    uploadChecklableUrl (params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '11');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.lableUrl=res.data[0]
          this.lableUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
  
    cancle () {
      this.$router.push({
        path: "/wealth/logonList"
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveLoading=true
          // 校验排序
          let params= {
            buttonName: this.form.buttonName,
            imgUrl: this.form.imgUrl,
            appFlag:this.form.appFlag.toString(),
            systemType:this.form.systemType.toString(),
            effectiveDatetimeStr:this.form.effectiveDatetimeStr,
            isEnable:this.form.isEnable,
            id: this.$route.query.id?this.$route.query.id:""
          }
          saveWealth(params).then((res) => {
            this.saveLoading=false
            console.log(res)
            if (res.result) {
               this.$router.push({
                path: "/wealth/logonList"
              })
            } else {
              this.$message.error(res.description)
            }
          }).catch((error) => {
            this.saveLoading=false
            this.$message.error("接口失败")
          })
        } else {
          this.$message.error("请完善信息")
        }
      })
    },
    handleAvatarSuccess () {

    },
    beforeAvatarUpload(file) {

    }
	},
	
}
</script>

<style lang="less" scoped>
.editAdvertPosit {
  padding: 20px;
  .advTypeTxt {
    margin-bottom: 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  /deep/ .el-upload {
    border: 1px dashed #DCDFE6;
  }
  /deep/ .el-input {
    width: 400px;
  }
  /deep/ .el-form {
    width: 600px;
    margin: 0 auto;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .btnCon {
    width: 400px;
    text-align: center;
  }
  .imgDiv {
    /deep/ .el-form-item__content {
      display: flex;
    }
    /deep/ .upload-demo {
      display: inline-block;
    }
  }
}
</style>
