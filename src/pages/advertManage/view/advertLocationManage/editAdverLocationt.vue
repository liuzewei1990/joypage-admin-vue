<template>
<!-- 修改广告位置 -->
  <div class='editAdvertPosit'>
    <el-form :size='size' ref="form" :rules="rules" :model="form" label-width="140px">
      <div class='advTypeTxt'>编辑广告位置</div>
      <el-form-item  label="广告位置：" prop="name">
        <el-input placeholder="" v-model="form.name" :disabled="true"></el-input>
      </el-form-item>
      
      <el-form-item  label="广告类型：" prop='advType'>
        <el-select :disabled="true" clearable  v-model="form.advType" placeholder="">
          <el-option v-for='(item,index) in optionLists.advTypeList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="投放渠道：" prop='appFlag'>
        <el-select  multiple clearable   v-model="form.appFlag" placeholder="">
          <el-option v-for='(item,index) in optionLists.advChannelList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="投放设备：" prop='advPlatform'>
        <el-select  multiple clearable   v-model="form.advPlatform" placeholder="">
          <el-option v-for='(item,index) in optionLists.advDeviceList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

<!-- 只有资讯信息流广告有文章间隔数量 -->
      <el-form-item v-if='form.name=="资讯信息流广告"' label="文章间隔数量：" prop='articleSpacingCount'>
        <el-input v-model="form.articleSpacingCount"></el-input>
      </el-form-item>

      <el-form-item  label="最大展现数量：" prop='showCount'>
        <el-input v-model="form.showCount"></el-input>
      </el-form-item>

      <el-form-item  label="是否开启：" prop='status'>
        <el-select v-model="form.status"  placeholder="请选择">
          <el-option v-for='(item,index) in statusList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item class='btnCon'>
        <el-button :size='size' type="primary" :load='saveLoading' @click="onSubmit">提交</el-button>
        <el-button :size='size' @click='cancle()'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 接口函数依次：广告列表页查询
import { advPositDetail,forAdvertPositPage, updateAdvPosit } from "../../apis/index"
export default {
	name: 'editAdvert',
	components:{},
	data() {
		return {
      size: 'small',
      saveLoading:false,
      form: {
        name:'',
        advType: '',
        appFlag: [],
        advPlatform: [],
        showCount: '',
        status: '',
        articleSpacingCount: ''
      },
      statusList:[
        {
          name: '是',
          value: 0
        },
        {
          name: '否',
          value: 1
        }
      ],
      optionLists: [],
      rules: {
        // name: [
        //   { required: true, message: '请输入广告标题', trigger: 'blur' }
        // ]
      }
		}
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted() {
    this.advPositDetailFun()
    this.forAdvertPositPageFun()
	},
	methods: {
    // 修改广告位置
    changePosition (advPositCode) {
      this.optionLists.advPositionList.forEach((i) => {
        if (i.advPositCode==advPositCode) {
          this.form.name=i.name
        }
      })
    },
    // 修改广告位置
    updateAdvPositFun() {
      let params = {
        id: this.id, //广告位置id
        name: this.form.name, // 广告位置名称
        showCount: this.form.showCount, //展示数量
        advType: this.form.advType, //广告类型
        appFlag: Array.isArray(this.form.appFlag)?this.form.appFlag.toString():"", //渠道,多个渠道中间以","隔开
        advPlatform: Array.isArray(this.form.advPlatform)?this.form.advPlatform.toString():"", // 设备,多个设备中间以","隔开
        status: this.form.status, // 是否开启
        articleSpacingCount: this.form.articleSpacingCount, // 文章间隔数量
      }
      updateAdvPosit(params).then((res) =>{
        if (Number(res.code)===0) {
          this.saveLoading=false
          this.$router.push(
            {
              path: '/adverLocationtList'
            }
          ) 
        } else {
          this.saveLoading=false
          this.$message.error('修改失败');
        }
      })
    },
     // 初始化广告位置管理页面参数
    forAdvertPositPageFun () {
      let params=""
      forAdvertPositPage(params).then((res) => {
        if (Number(res.code)===0) {
          this.optionLists=res.data
          
        }
      })
    },
    // 获取详情
    advPositDetailFun () {
      let params= ''
      advPositDetail(params, this.id).then((res) => {
        if (Number(res.code) ===0) {
          this.form= res.data
          if (res.data.advPlatform.indexOf(",")>-1) {
            this.$set(this.form,'advPlatform',res.data.advPlatform.split(","))
          } else if (res.data.advPlatform=='') {
            this.$set(this.form,'advPlatform',null)
          } else {
            this.$set(this.form,'advPlatform',[res.data.advPlatform])
          }

          let appFlag=[]
          if (res.data.appFlag.indexOf(",")>-1) {
            appFlag=res.data.appFlag.split(",")
            this.$set(this.form,'appFlag',appFlag)
          } else if (res.data.appFlag=='') {
            this.$set(this.form,'appFlag',null)
          } else{
            appFlag.push(res.data.appFlag)
            this.$set(this.form,'appFlag',appFlag)
          }
        }
      })
    },
    cancle () {
      this.$router.push({
        path: '/adverLocationtList'
      })
    },
    onSubmit() {
      this.saveLoading=true
      this.updateAdvPositFun()
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
}
</style>
