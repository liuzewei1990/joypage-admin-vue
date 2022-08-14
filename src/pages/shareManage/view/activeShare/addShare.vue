<template>
<!-- 新增/修改分享 -->
  <div class='addShare'>
    <el-form  :size='size' ref="form" :rules="rules" :model="form" label-width="160px">
      <el-form-item label="活动选择："  prop="activityId">
        <el-select @change='checkActive' clearable v-model="form.activityId" placeholder="">
          <el-option v-for='(item,index) in activelist' :key='index' :value='item.id' :label='item.name'>{{item.name}}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分享入口渠道："  prop="appFlag">
        <el-checkbox :indeterminate="isIndeterminate" v-model="appFlagAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="form.appFlag" @change="handleCheckedAppFlagChange">
          <el-checkbox v-for="(item,index) in appFlags" :label="item.value" :value='item.value' :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="分享入口设备选择："  prop="deviceType">
        <el-checkbox :indeterminate="isIndeterminateSystemType" v-model="deviceTypeAll" @change="handleCheckAllChangeSystemType">全选</el-checkbox>
        <!-- <div style="margin: 15px 0;"></div> -->
        <el-checkbox-group v-model="form.deviceType" @change="handleCheckedSystemTypeChange">
          <el-checkbox v-for="(item,index) in systemTypes" :label="item.value" :value='item.value' :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="分享至："  prop="sharePlace">
        <el-select @change='changeShareType' clearable v-model="form.sharePlace" placeholder="">
          <el-option value='' label='请选择'></el-option>
          <el-option value='0' label='微信好友'></el-option>
          <el-option value='1' label='微信朋友圈'></el-option>
          <el-option value='2' label='QQ好友'></el-option>
          <el-option value='3' label='QQ空间'></el-option>
          <el-option value='4' label='短信邀请'></el-option>
          <el-option value='5' v-if='okTTZ' label='扫码邀请'></el-option>
          <!-- <el-option value='5' label='扫码邀请'></el-option> -->
        </el-select>
      </el-form-item>

      <el-form-item v-if='showShareMathods' label="分享方式选择："  prop="shareType">
        <el-select @change='changeShareMathods' clearable v-model="form.shareType" placeholder="">
          <el-option value='' label='请选择'></el-option>
          <el-option value='0' label='图片'></el-option>
          <el-option v-if='showWXMin' value='2' label='小程序'></el-option>
          <el-option value='1' label='链接'></el-option>
        </el-select>
      </el-form-item>
  <!-- 分享方式  为图片 -->
      <div v-if='form.shareType==="0"'>
        <el-form-item  label="分享图片上传："  prop="shareUrl">
          <el-upload
            :model='form.shareUrl'
            class="upload-demo upload-demo1"
            action="customize"
            :http-request="uploadCheckImg1"
            :on-change="fileChange"
            :show-file-list="false"
            >
            <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <small>建议在XXX之内</small> -->
        </el-form-item>
        <el-form-item label="链接生成地址："  prop="shareUrl">
          <el-input
          :disabled="true"
          type="text"
          placeholder=""
          v-model="form.shareUrl"
          maxlength=""
          show-word-limit
          ></el-input>
        </el-form-item>
      </div>
  <!-- 分享方式  为小程序 -->
      <div v-if='form.shareType==2'>
        <el-form-item label="小程序链接："  prop="shareUrl">
          <el-input
          type="text"
          placeholder=""
          v-model="form.shareUrl"
          ></el-input>
        </el-form-item>
        <el-form-item label="小程序分享主题："  prop="shareTitle">
          <el-input
          type="text"
          placeholder=""
          v-model="form.shareTitle"
          ></el-input>
        </el-form-item>
        <el-form-item label="小程序分享内容："  prop="shareContent">
          <el-input
          type="textarea"
          placeholder=""
          v-model="form.shareContent"
          ></el-input>
        </el-form-item>
        <el-form-item  label="小程序图片："  prop="pmpPicUrl">
          <el-upload
            :model='form.pmpPicUrl'
            class="upload-demo upload-demo1"
            action="customize"
            :http-request="uploadCheckImgMin"
            :on-change="fileChange"
            :show-file-list="false"
            >
            <img v-if="imageUrlMin" :src="imageUrlMin" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <small>建议在XXX之内</small> -->
        </el-form-item>
        <div class='second'>
          <el-form-item v-if='showShareMathods' label="备用分享方式："  prop="standbyShareType">
            <el-select clearable v-model="form.standbyShareType" placeholder="">
              <el-option value='' label='请选择'></el-option>
              <el-option value='1' label='链接'></el-option>
            </el-select>
            <small>小程序日活全满量后启用的备用链接</small>
          </el-form-item>
          <el-form-item v-if='showShareMathods' label="备用链接地址："  prop="standbyShareUrl">
            <el-input
            type="text"
            placeholder=""
            v-model="form.standbyShareUrl"
            ></el-input>
          </el-form-item>
          <el-form-item v-if='showShareMathods' label="备用链接分享主题："  prop="standbyShareTitle">
            <el-input
            type="text"
            placeholder=""
            v-model="form.standbyShareTitle"
            ></el-input>
          </el-form-item>
          <el-form-item v-if='showShareMathods' label="备用链接分享内容："  prop="standbyShareContent">
            <el-input
            type="text"
            placeholder=""
            v-model="form.standbyShareContent"
            ></el-input>
          </el-form-item>
        </div>
      </div>
  <!-- 分享方式  为链接  已对接-->
      <div v-if='form.shareType==="1"'>
        <el-form-item v-if='showShareMathods' label="链接地址："  prop="shareUrl">
          <el-input
          type="text"
          placeholder=""
          v-model="form.shareUrl"
          ></el-input>
        </el-form-item>
        <el-form-item v-if='showShareMathods' label="分享主题："  prop="shareTitle">
          <el-input
          type="text"
          placeholder=""
          v-model="form.shareTitle"
          ></el-input>
        </el-form-item>
        <el-form-item v-if='showShareMathods' label="分享内容："  prop="shareContent">
          <el-input
          type="text"
          placeholder=""
          v-model="form.shareContent"
          ></el-input>
        </el-form-item>
      </div>
<!--  选择短信邀请下方功能为-->
      <div v-if='form.sharePlace==="4"' class='second'>
        <el-form-item label="短信发送文案："  prop="msgContent">
          <el-input
          type="textarea"
          placeholder=""
          v-model="form.msgContent"
          maxlength=""
          show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="邀请间隔天数："  prop="msgIntervalDays">
          <el-input
          type="text"
          placeholder=""
          v-model="form.msgIntervalDays"
        ></el-input>
        </el-form-item>
      </div>

      <!-- 选择扫码邀请（该功能目前仅对连连赚活动生效） -->
      <div v-if='form.sharePlace==="5"'  class='second'>
        <el-form-item label="二维码分享入口设备选择："  prop="extendDeviceType">
          <el-checkbox :indeterminate="isIndeterminateSystemType1" v-model="extendDeviceTypeAll" @change="handleCheckAllChangeSystemType1">全选</el-checkbox>
          <el-checkbox-group v-model="form.extendDeviceType" @change="handleCheckedSystemTypeChange1">
            <el-checkbox v-for="(item,index) in systemTypes1" :label="item.value" :value='item.value' :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="二维码页分享按键文案："  prop="extendButtonText">
          <el-input
            type="text"
            placeholder=""
            v-model="form.extendButtonText"
          ></el-input>
        </el-form-item>
        <el-form-item label="二维码分享至："  prop="extendSharePlace">
          <el-select clearable v-model="form.extendSharePlace" placeholder="">
            <el-option value='' label='请选择'></el-option>
             <el-option value='0' label='微信好友'></el-option>
            <el-option value='1' label='微信朋友圈'></el-option>
            <el-option value='2' label='QQ好友'></el-option>
            <el-option value='3' label='QQ空间'></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="是否开启："  prop="status">
        <el-radio v-model="form.status" v-for='(item,index) in statusOptions' :key='index' :label='item.value'>{{item.label}}</el-radio>
      </el-form-item>
    </el-form>
      
    <div class='btnCon'>
      <el-button :size='size' :loading='saveLoading' @click='save' type='primary'>提交</el-button>
      <el-button :size='size'  @click='cancle' >取消</el-button>
    </div>
  </div>
</template>
<script>
import {addActShare, updateActShare,forUpload,queryActShareById} from '../../apis/index'
const appFlagOptions = [
  {
    name: '比财',
    value: 'BC'
  },
  {
    name: '拼财',
    value: 'PC'
  },
  {
    name: '小程序',
    value: 'PMP'
  }
];
const systemTypeOptions = [
  {
    name: '安卓',
    value: 'ANDROID'
  },
  {
    name: '苹果',
    value: 'IOS'
  }
];
const systemTypeOptions1 = [
  {
    name: '安卓',
    value: 'ANDROID'
  },
  {
    name: '苹果',
    value: 'IOS'
  }
];
export default {
  data () {
    var checkappFlag = (rule, value, callback) => {
      if (this.form.appFlag.length==0) {
        callback(new Error("内容不能为空"));
      } else {
        callback();
      }
    };
    var checksystemType = (rule, value, callback) => {
      if (this.form.deviceType.length==0) {
        callback(new Error("内容不能为空"));
      } else {
        callback();
      }
    };
    var checksystemType1 = (rule, value, callback) => {
      if (this.form.extendDeviceType.length==0) {
        callback(new Error("内容不能为空"));
      } else {
        callback();
      }
    };
    return {
      isLLZ:false,
      activelist: JSON.parse(sessionStorage.getItem('activityList')),
      statusOptions:[
        { 
          value:'1',
          label: '开启'
        },
        { 
          value:'2',
          label: '关闭'
        }
      ],
      form: {
        sharePlace:"",
        status:"",
        shareType:"",
        activityId:'',
        appFlag: [],
        deviceType: [],
        extendDeviceType:[],
        pmpPicUrl:"",
        msgIntervalDays:'',
        msgContent: '',
        extendButtonText:'',
        extendSharePlace:"",
        standbyShareType:"",
        standbyShareUrl:"",
        standbyShareTitle:"",
        standbyShareContent:"",
        shareUrl:"",
        shareTitle:"",
        shareContent:""
      },
      imageUrl1:"",
      imageUrl:"",
      imageUrlMin:"",
      saveLoading:false,
      size: 'small',
      dialogVisible:true,
      // 渠道
      appFlagAll: false,
      appFlags: appFlagOptions,
      isIndeterminate: true,
      // 设备
      systemTypes: systemTypeOptions,
      isIndeterminateSystemType: true,
      deviceTypeAll:false,
      // 扫码 二维码分享入口设备选择
      extendDeviceTypeAll: false,
      systemTypes1: systemTypeOptions1,
      isIndeterminateSystemType1: true,
      isClose:false,
      showClose:false,
      rules: {
        appFlag:[ 
          { required: true, validator: checkappFlag, trigger: 'blur' }
        ],
        deviceType:[ 
          { required: true, validator: checksystemType, trigger: 'blur' }
        ],
        extendDeviceType:[ 
          { required: true, validator: checksystemType1, trigger: 'blur' }
        ],
        sharePlace:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        activityId:[ 
          { required: true, message: '内容不能为空', trigger: 'change' }
        ],
        shareType:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],

        msgIntervalDays:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        msgContent:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        extendButtonText:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        extendSharePlace:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        standbyShareType:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        pmpPicUrl:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        standbyShareUrl:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        standbyShareTitle:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        standbyShareContent:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        shareUrl:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        shareTitle:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        shareContent:[ 
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        status:[ 
          { required: true, message: '内容不能为空', trigger: 'change' }
        ],
      }
    }
  },
  computed: {
    okTTZ() {
      return this.isLLZ
    },
    type() {
      return this.$route.query.type
    },
    // 选择微信好友、QQ好友、QQ空间任一项：显示"分享方式”的配置功能
    showShareMathods () {
      if (this.form.sharePlace=='0'||this.form.sharePlace=='2'||this.form.sharePlace=="3"||this.form.sharePlace=="1") {
        return true
      } else {
        return false
      }
    },
    // 选择朋友圈分享，NO.2“分享方式选择”下拉框仅有图片、链接，其他的与4.1.1相同
    showWXMin () {
      if (this.form.sharePlace=='0'||this.form.sharePlace=='2'||this.form.sharePlace=="3") {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    isLLZ (oldVl,newVl) {
      console.log('newVl',newVl)
    }
  },
  mounted () {
    console.log(this.activelist)
    console.log(this.systemTypes)
  },
  created () {
    if (this.$route.query.id) {
      this.queryActShareByIdFun(this.$route.query.id)
    }
  },
  methods: {
    // 选择活动
    checkActive () {
      this.form.sharePlace=''
      this.changeShareType()
      let isOk=0
      this.activelist.forEach(i => {
        if (i.id==this.form.activityId) {
          if (i.name.indexOf("连连赚")>=0) {
            isOk=1
          }
        }
      });
      if (isOk===1) {
        this.isLLZ=true
      } else {
        this.isLLZ=false
      }
    },
    // 根据ID查询详情数据
    queryActShareByIdFun (ids) {
      let parmas = {
        id: ids
      }
      queryActShareById(parmas).then((res) => {
        if (res.result) {
          this.form=res.data
          if (res.data.appFlag=='TY') {
            this.form.appFlag=['BC','PC','PMP']
            this.appFlagAll=true
          } else if (res.data.appFlag==null) {
            this.form.appFlag=[]
          } else if(res.data.appFlag.indexOf(",")>=0) {
            this.form.appFlag=res.data.appFlag.split(",")
          } else {
            this.form.appFlag.push(res.data.appFlag)
          }

          if (res.data.deviceType=='TY') {
            this.form.deviceType=['ANDROID','IOS']
            this.deviceTypeAll=true
          }else if (res.data.deviceType==null) {
            this.form.deviceType=[]
          } else if(res.data.deviceType.indexOf(",")>=0) {
            this.form.deviceType=res.data.deviceType.split(",")
          } else {
            this.form.deviceType.push(res.data.deviceType)
          }
          if (res.data.extendDeviceType=='TY') {
            this.form.extendDeviceType=['ANDROID','IOS']
            this.extendDeviceTypeAll=true
          }else if (res.data.extendDeviceType==null) {
            this.form.extendDeviceType=[]
          } else if(res.data.extendDeviceType.indexOf(",")>=0) {
            this.form.extendDeviceType=res.data.extendDeviceType.split(",")
          } else {
            this.form.extendDeviceType.push(res.data.extendDeviceType)
          }
          this.imageUrl1=res.data.shareUrl
          this.imageUrlMin=res.data.pmpPicUrl==""?"":`${this.$Config.aliyuncHost}${res.data.pmpPicUrl}`
        }
      })
    },
    // 分享方式切换时
    changeShareMathods () {
      console.log(1)
      this.form.pmpPicUrl=""
      this.form.msgIntervalDays=""
      this.form.msgContent=""
      this.form.extendButtonText=""
      this.form.extendSharePlace=""
      this.form.standbyShareType=""
      this.form.standbyShareUrl=""
      this.form.standbyShareTitle=""
      this.form.standbyShareContent=""
      this.form.shareUrl=""
      this.form.shareTitle=""
      this.form.shareContent=""
    },
    // 分享至 change时
    changeShareType () {
      console.log(2)
      this.form.shareType=''
      this.form.extendDeviceType=[]
      this.form.pmpPicUrl=""
      this.form.msgIntervalDays=""
      this.form.msgContent=""
      this.form.extendButtonText=""
      this.form.extendSharePlace=""
      this.form.standbyShareType=""
      this.form.standbyShareUrl=""
      this.form.standbyShareTitle=""
      this.form.standbyShareContent=""
      this.form.shareUrl=""
      this.form.shareTitle=""
      this.form.shareContent=""
    },
    // 上传图片
    uploadCheckImg(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '11');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    // 分享 上传图片
    uploadCheckImg1(params) {
      const _file = params.file;

      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '11');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.imageUrl1 = `${this.$Config.aliyuncHost}${res.data[0]}`
          this.form.shareUrl=`${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    // 小程序 图片 上传图片
    uploadCheckImgMin(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '11');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.pmpPicUrl=res.data[0]
          this.imageUrlMin = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    // 渠道
    handleCheckAllChange(val) {
      let all =[]
      if (val) {
        appFlagOptions.filter((i) =>{
          all.push(i.value)
        })
      }
      this.form.appFlag = val ? all : [];
      this.isIndeterminate = false;
    },
    handleCheckedAppFlagChange(value) {
      let checkedCount = value.length;
      this.appFlagAll = checkedCount === this.appFlags.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.appFlags.length;
    },
    // 设备
    handleCheckAllChangeSystemType(val) {
      let all =[]
      if (val) {
        systemTypeOptions.filter((i) =>{
          all.push(i.value)
        })
      }
      this.form.deviceType = val ? all : [];
      this.isIndeterminateSystemType = false;
    },
    handleCheckedSystemTypeChange(value) {
      let checkedCount = value.length;
      this.deviceTypeAll = checkedCount === this.systemTypes.length;
      this.isIndeterminateSystemType = checkedCount > 0 && checkedCount < this.systemTypes.length;
    }, 
    // 扫码分享配置  二维码分享入口设备选择
    handleCheckAllChangeSystemType1(val) {
      let all =[]
      if (val) {
        systemTypeOptions1.filter((i) =>{
          all.push(i.value)
        })
      }
      this.form.extendDeviceType = val ? all : [];
      this.isIndeterminateSystemType1 = false;
      console.log(this.form.extendDeviceType)
    },
    handleCheckedSystemTypeChange1(value) {
      let checkedCount = value.length;
      this.extendDeviceTypeAll = checkedCount === this.systemTypes1.length;
      this.isIndeterminateSystemType1 = checkedCount > 0 && checkedCount < this.systemTypes1.length;
    },
    // 取消
    cancle() {
      this.$router.back(1)
    },
    // 提交
    save() {
      let params=JSON.stringify(this.form)
      let params1=JSON.parse(params)
      params1.appFlag=this.form.appFlag.length===appFlagOptions.length?"TY":this.form.appFlag.toString()
      params1.deviceType=this.form.deviceType.length===systemTypeOptions.length?"TY":this.form.deviceType.toString()
      params1.extendDeviceType=this.form.extendDeviceType.length===systemTypeOptions1.length?"TY":this.form.extendDeviceType.toString()
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 新建
          if (this.type=='add') {
            this.saveLoading=true
            addActShare(params1).then((res) => {
              if (res.result) {
                this.saveLoading=false
                this.$router.push('/shareList/activeShareList')
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
            this.saveLoading=true
            updateActShare(params1).then((res) => {
              if (res.result) {
                this.saveLoading=false
                this.$router.push('/shareList/activeShareList')
                // this.$emit('save')
              } else {
                this.saveLoading=false
                this.$message.error(res.description);
              }
            })
          }

        } else {
          console.log(params1)
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