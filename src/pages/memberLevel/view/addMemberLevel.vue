<template>
<!-- 新增/修改会员等级 -->
  <div class='addShare'>
    <el-form  :size='size' ref="form" :rules="rules" :model="form" label-width="160px">
      <el-form-item label="等级名称：" prop="lvName">
        <el-input
          placeholder="请输入等级名称"
          show-word-limit
          v-model="form.lvName"
        ></el-input>
      </el-form-item>
      <el-form-item  label="等级图标："  prop="lvLogo">
        <el-upload
          :model='form.lvLogo'
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadCheckImg1"
          :on-change="fileChange"
          :show-file-list="false"
          >
          <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="等级底色："  prop="lvBackGround">
        <el-select clearable v-model="form.lvBackGround" placeholder="">
          <el-option value='1' label='铜色'></el-option>
          <el-option value='2' label='银色'></el-option>
          <el-option value='3' label='金色'></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="会员等级：" prop="userLv">
        <el-input
          placeholder="请输入会员等级"
          show-word-limit
          v-model="form.userLv"
        ></el-input>
      </el-form-item>
      <el-form-item label="会员等级编号：" prop="lvCode">
        <el-input
          placeholder="请输入会员等级编号"
          show-word-limit
          v-model="form.lvCode"
        ></el-input>
      </el-form-item>
      <el-form-item label="经验值：" prop="exp">
        <el-input
          placeholder="请输入经验值"
          show-word-limit
          v-model="form.exp"
        ></el-input>
      </el-form-item>
      <el-form-item label="积分加成：" prop="integralUp">
        <el-input
          placeholder="请输入积分加成"
          show-word-limit
          v-model="form.integralUp"
        ></el-input>
      </el-form-item>
      <el-form-item label='等级说明：' prop='lvDescribe'>
        <quill-editor id="editor1" @onEditorChange="onEditorChangeDeal" 
				:detailContent="form.lvDescribe" @quillEditorUploaderImgSon="quillEditorUploaderImg">
				</quill-editor>
      </el-form-item>
    </el-form>
      
    <div class='btnCon'>
      <el-button :size='size' :loading='saveLoading' @click='save' type='primary'>提交</el-button>
      <el-button :size='size'  @click='cancle' >取消</el-button>
    </div>
  </div>
</template>
<script>
import {forUpload, createUserLv,updUserLv,queryUserLvList} from '../apis/index'
import QuillEditor from '../components/VueQuillEditor'
export default {
  components:{QuillEditor},
  data () {

    var levelVal = (rule, value, callback) => {
      let  reg = /^([1-9]+[0-9]*|[0])$/;
      if (value=='') {
        callback(new Error("内容不能为空"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正整数"));
      }
    }
    var expVal = (rule, value, callback) => {
      let  reg = /^([1-9]+[0-9]*|[0])(\.\d{1,2})?$/;
      if (value=='') {
        callback(new Error("内容不能为空"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入整数或两位小数"));
      }
    }
    var bonusPointsVal = (rule, value, callback) => {
      let  reg = /^([1-9]+[0-9]*|[0])(\.\d{1,2})?$/;
      if (value=='') {
        callback(new Error("内容不能为空"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入整数或两位小数"));
      }
    }
    
    return {
      form: {
        lvDescribe:"",
        lvName:"",
        lvLogo:"",
        lvBackGround:"",
        userLv:"",
        exp:"",
        integralUp:"",
        lvCode:""
      },
      imageUrl1:"",
      saveLoading:false,
      size: 'small',
      
      rules: {
        // validator: checkappFlag,
        lvCode:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        lvName:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        lvLogo:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        userLv:[ 
          { required: true,validator: levelVal, trigger: 'blur' }
        ],
        lvBackGround:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        lvDescribe:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        exp:[ 
          { required: true, validator: expVal, trigger: 'blur' }
        ],
        integralUp:[ 
          { required: true, validator: bonusPointsVal, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    },
  },
  mounted () {
    if (this.$route.query.id) {
      this.queryUserLvListFUN(this.$route.query.id)
    }
  },
  methods: {
    // 、查询详情
    queryUserLvListFUN (id) {
      let params={
        ID: id
      }
      queryUserLvList(params).then((res) => {
        this.form=res.data.data[0]
        this.imageUrl1 = `${this.$Config.aliyuncHost}${res.data.data[0].lvLogo}`
        console.log(this.form)
      })
    },
    onEditorChangeDeal(html,id){
      console.log(html)
			console.log(id)
			this.form.lvDescribe = html
		},
    // 分享 上传图片
    uploadCheckImg1(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '11');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.lvLogo=res.data[0]
          this.imageUrl1 = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    
    // 取消
    cancle() {
      this.$router.back(1)
    },
    // 提交
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 新建
          if (this.type=='add') {
            let params = this.form
            this.saveLoading=true
            createUserLv(params).then((res) => {
              if (res.result) {
                this.saveLoading=false
                this.$router.push('/memberLevelList')
              } else {
                this.saveLoading=false
                this.$message.error(res.description);
              }
            }).catch((error) => {
              this.saveLoading=false
            })
          }
          // 修改
           if (this.type=='edit') {
            let params = {
              ID: this.form.ID,
              lvName: this.form.lvName,
              lvLogo: this.form.lvLogo,
              lvBackGround: this.form.lvBackGround,
              userLv: this.form.userLv,
              exp: this.form.exp,
              integralUp: this.form.integralUp,
              lvDescribe: this.form.lvDescribe,
              lvCode: this.form.lvCode,
            }
            this.saveLoading=true
            updUserLv(params).then((res) => {
              if (res.result) {
                this.saveLoading=false
                this.$router.push('/memberLevelList')
              } else {
                this.saveLoading=false
                this.$message.error(res.description);
              }
            }).catch((error) => {
              this.saveLoading=false
            })
          }

        } else {
          console.log(this.form)
        }
      })
      
    }
  }
}
</script>
<style lang="less" scoped>
.addShare {
  height: 100%;
  overflow: auto;
  padding: 40px;
  form {
    width: 800px;
    margin: 0 auto;
  }
  small {
    display:block;
    color:#999;
    font-size:12px
  }
  .btnCon {
    display: flex;
    justify-content: center;
  }
  /deep/ .el-checkbox-group {
    display: inline-block;
    margin-left: 20px;
  }
  /deep/ .el-dialog {
    min-width: 600px;
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
  /deep/ .el-input,/deep/ .el-date-editor,/deep/ .el-textarea__inner {
    width: 400px;
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
  .second {
    margin-left: 140px;
    /deep/ .el-form-item__label {
      width: 200px!important;
    }
    /deep/ .el-form-item__content {
      margin-left:200px!important;
    }
  }
  .upload-demo1 {
    display: inline-block;
  }
}

</style>