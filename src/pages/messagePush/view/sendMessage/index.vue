<template>
<!-- 添加广告 -->
  <div class='sendMessage' v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <el-form :size='size' ref="form" :rules="rules" :model="form" label-width="160px">
      <el-form-item label="推送方式：" prop="pushWay">
        <el-checkbox-group v-model="form.pushWay" style='display:inline-block'>
          <el-checkbox label="2">Push</el-checkbox>
          <el-checkbox label="3">站内信</el-checkbox>
        </el-checkbox-group>

        <el-form-item prop="infoType" style='display:inline-block'>
          <el-select style='margin-left:20px' v-if='form.pushWay[0]==3 ||form.pushWay[1]==3' v-model="form.infoType" placeholder="请选择消息类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if='form.pushWay[0]==3 ||form.pushWay[1]==3' label="图片："  prop="imgUrl">
        <el-upload
          :model='form.imgUrl'
          class="upload-demo"
          action="customize"
          accept='image/*'
          :http-request="uploadCheckImg"
          :on-change="fileChange"
          :show-file-list="false"
          >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="通知标题："  prop="title">
        <el-input
          type="textarea"
          placeholder="19字以内"
          v-model="form.title"
          maxlength="19"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item label="通知描述："  prop="summary">
        <el-input
          type="textarea"
          placeholder="49字以内"
          v-model="form.summary"
          maxlength="49"
          show-word-limit
        >
      </el-input>
      </el-form-item>
      <el-form-item label="跳转地址："  prop="clickType">
        <!-- <el-checkbox-group v-model="form.urlType"> -->
          <el-radio v-model='form.clickType' label="1">站外url</el-radio>
          <el-radio v-model='form.clickType' label="2">站内</el-radio>
          <el-radio v-if='form.pushWay[0]==3 ||form.pushWay[1]==3' v-model='form.clickType' label="20">自定义</el-radio>
        <!-- </el-checkbox-group> -->
        <div class='childCon'>
<!-- 站外 -->
            <el-form-item label-width='' v-if='form.clickType==1' label=""  prop="clickType">
              <el-input  type="text" placeholder="请输入站外url" v-model="form.pushUrl"></el-input>
            </el-form-item>
<!-- 站内 -->
            <el-form-item  v-if='form.clickType==2' label-width='' label=""  prop="clickType">
              <el-select no-match-text='' class='scrollSelect' @change='changePRD' clearable v-model="form.PRD_TYPE_ID" filterable placeholder="请选择">
                <el-option value=''>请选择</el-option>
                <el-option v-for='(item,index) in PRD_TYPESP' :value='item.value' :label='item.label' :key='index'></el-option>
              </el-select>
              <!-- 产品 -->
              <el-select v-if='form.PRD_TYPE_ID==4||form.PRD_TYPE_ID==5||form.PRD_TYPE_ID==12||form.PRD_TYPE_ID==14' class='scrollSelect' filterable @change='changeLC' clearable v-model="form.prdIndexId"  placeholder="请选择">
                <el-option v-for='(item,index) in PRD_TYPE_ListItem' :value='item.ID' :label='item.ORG_NAME+"---"+item.PRD_NAME' :key='index'></el-option>
              </el-select>
              <!-- 活动 -->
              <el-select  v-if='form.PRD_TYPE_ID==16'  class='scrollSelect' @change='changeAct' filterable  clearable v-model="form.actityId"  placeholder="请选择活动">
                <el-option v-for='(item,index) in actList' :value='item.actId' :label='item.actName' :key='index'></el-option>
              </el-select>
            </el-form-item>
<!-- 自定义 -->
            <el-form-item label-width='' v-if='form.clickType==20' label=""  prop="clickType">
              <!-- <quill-editor v-model="form.dynamicDetails" ref="myQuillEditor"
							 @change="onEditorChangeArea($event)"></quill-editor> -->
               <quill-editor id="editor1" @onEditorChange="onEditorChangeDeal" 
                v-model="form.dynamicDetails" @quillEditorUploaderImgSon="quillEditorUploaderImg">
                </quill-editor>
            </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="发送时间：" prop="autoSend">
        <el-radio v-model="form.autoSend" label="off">立即</el-radio>
        <el-radio v-model="form.autoSend" label="on">定时</el-radio>
      </el-form-item>
      <el-form-item class='time' v-if='showTime'  prop="datetime">
        
        <el-date-picker 
          :clearable="clearable"
          v-model="form.datetime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd_HH:mm:ss"  
          placeholder="选择日期时间">
        </el-date-picker>
        <el-button  :size='size' type="primary" @click='addTime'>加入时间列表</el-button>
        <el-button  :size='size' type="primary" @click='form.pushTimes=[]'>清空时间列表</el-button>
      </el-form-item>
      
      <el-form-item  v-if='showTime' label="设定发送的时间列表：" prop="pushTimes">
        <div style='width:100%;height:80px;border:1px solid #ddd'>{{form.pushTimes.toString()}}</div>
      </el-form-item>
      <el-form-item label="目标渠道：" prop="appFlag">
        <el-radio v-model="form.appFlag" label="ALL">全部</el-radio>
        <el-radio v-model="form.appFlag" label="PC">拼财</el-radio>
        <el-radio v-model="form.appFlag" label="BC">比财</el-radio>
      </el-form-item>
      <el-form-item label="目标平台：" prop="systemType">
        <el-radio v-model="form.systemType" label="0">全部</el-radio>
        <el-radio v-model="form.systemType" label="1">android</el-radio>
        <el-radio v-model="form.systemType" label="2">ios</el-radio>
      </el-form-item>
      <el-form-item label="目标人群：" prop="pushType" style='width:100%'>
        <el-radio v-model="form.pushType" label="1">所有人</el-radio>
        <!-- <el-radio v-model="form.person" label="2">用户分群</el-radio>
        <el-select v-model="form.personItem" placeholder="请选择用户人群">
          <el-option  label="全部" value="0"></el-option>
        </el-select> -->
        <div class='upFile'>
          <el-radio v-model="form.pushType" label="3">导入用户发送</el-radio>
          <el-upload  v-if='form.pushType==3' style='display:inline'
          :model='form.file'
          accept='.xls,.xlsx'
          action="customize"
          :http-request="uploadFile"
          :on-change="fileChange"
          :show-file-list="false"
          >
            <el-button  :size='size' type="primary" >上传文件</el-button>
            <span>{{fileName}}</span>
          </el-upload>
          <a v-if='form.pushType==3' :href="$Config.baseUrlHost+'/bankImportInfo/dowmImportTemplate?FILE_TYPE=6'">下载模板</a>
        </div>
      </el-form-item>

      <el-form-item class='btnCon'>
        <el-button  :size='size' type="primary" :loading='saveLoading' @click="onSubmit">发送预览</el-button>
      </el-form-item>
    </el-form>

    <message-preview ref='messagePreview' :message='form' v-if='dialogFormVisible' :dialogFormVisible='dialogFormVisible' @sure='sure' @cancel='cancel'  title='发送预览' cancelTxt='取 消' sureTxt='确 定'></message-preview>  
  </div>
</template>

<script>
import { forUpload, forFinsuitPrdIndexList, forFinsuitPrdIndexListSelect, getActivityList, importActInfoByExcel, addActInfo,getActInfoById} from "../../apis/index"
import messagePreview from  '../../components/messagePreview'
import QuillEditor from '../../components/VueQuillEditor'
// import treeDiv from  '../../components/tree'
export default {
	name: 'sendMessage',
	components:{messagePreview,QuillEditor},
	data() {
// 验证站内信
    var checkinfoType = (rule, value, callback) => {
      if ((this.form.pushWay[0]==3 ||this.form.pushWay[1]==3)&&value=='') {
        callback(new Error("请选择消息类型"));
      } else {
        callback();
      }
    };
    var checkpushWay = (rule, value, callback) => {
      if (this.form.pushWay.length==0) {
        callback(new Error("请选择推送方式"));
      } else {
        callback();
      }
    };
    var checkPerson =(rule, value, callback) => {
      if (value==3&& this.timestamp==='') {
        callback(new Error("请上传文件"));
      } else if (value=='') {
        callback(new Error("请选择目标人群"));
      } else {
        callback();
      }
    };


		return {
      dialogFormVisible:false,
      clearable:false,
      imageUrl: '',
      size: 'small',
      saveLoading: false,
      header: {token: sessionStorage.token},  // 有的图片服务器要求请求头
      form: {
        dynamicDetails:'', // 富文本
        actityId:'', // 活动ID包含活动ID
        actityName:"",//活动name
        personItem:"",
        pushWay: [] ,// 推送方式
        infoType: '', // 消息类型
        imgUrl: '', // 图片
        title: '',//通知标题
        summary: '', //通知描述
        clickType: [], //
        pushUrl: '',
        znurl: '',
        pushTimes:[],//选择的时间列表
        datetime: '',
        pushType: '',
        appFlag: '',
        PRD_TYPE_ID: '', // 选择站内时  选择是产品还是活动，理财
        prdIndexId: '', // 产品 ID
        PRD_Name: '', // 产品 name
        file:'', //上传文件
        systemType: ''
      },
      rules: {
        clickType:  [
          { required: true, message: '请输入跳转地址', trigger: 'blur' }
        ],
        infoType: [
          { validator: checkinfoType, trigger: 'blur' }
        ],
        pushWay: [
          { required: true, validator: checkpushWay, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入通知标题', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入通知描述', trigger: 'blur' }
        ],
        appFlag: [
          { required: true, message: '请选择目标渠道', trigger: 'blur' }
        ],
        systemType: [
          { required: true, message: '请选择目标平台', trigger: 'blur' }
        ],
        autoSend: [
          { required: true, message: '请选择发送时间', trigger: 'blur' }
        ],
        datetime:  [
          { required: true, message: '请选择发送时间', trigger: 'blur' }
        ],
        pushType:  [
          { required: true,  validator: checkPerson, trigger: 'blur' }
        ],
      },
      typeOptions :[
        {
          name: '系统消息',
          value: '1'
        },
        {
          name: '产品消息',
          value: '2'
        },
        {
          name: '活动消息',
          value: '3'
        }
      ],
      PRD_TYPESP:[
        {
          value: '14',
          label: '银行存款'
        },
        {
          value: '12',
          label: '纯债产品'
        },
        {
          value: '4',
          label: '货币基金'
        },
        {
          value: '5',
          label: '理财产品'
        },
        {
          value: '16',
          label: '活动'
        }
      ],
      PRD_TYPE_ListItem: [],
      actList:[], // 活动数据
      timestamp:'',
      loading:false,
      fileName:''
		}
  },
  computed: {
    showTime () {
      if (this.form.autoSend=='on') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    'form.clickType'(newVl,oldVl) {
      if (newVl==='1') {
        this.form.prdIndexId=''
        this.form.actityId=''
        this.form.actityName=''
        this.form.dynamicDetails=''
      }
      if (newVl==='2') {
        this.form.pushUrl=''
        this.form.dynamicDetails=''
      }
      if (newVl==='3') {
        this.form.pushUrl=''
        this.form.prdIndexId=''
        this.form.actityId=''
        this.form.actityName=''
      }
    },
    'form.autoSend'(newVl,oldVl){
      if (newVl=='off') {
        // this.form.datetime=null
        this.form.pushTimes=[]
      }
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.loading=true
      let params= {
        id: this.$route.query.id
      }
      getActInfoById(params).then((res) => {
        this.loading=false
        if (res.result) {
          this.form=res.data
          if (res.data.autoSend=='on') {
            if (res.data.pushTimes.indexOf(",")>=0) {
              this.form.pushTimes=res.data.pushTimes.split(',')
            } else {
              this.form.pushTimes=[res.data.pushTimes]
            }
          }
          console.log(this.form)
          this.form.pushType=''
          if (res.data.imgUrl=='') {
            this.imageUrl =''
          } else {
            this.imageUrl = `${this.$Config.aliyuncHost}${res.data.imgUrl}`
          }
          if (res.data.clickType==='1' || res.data.clickType=='20' ) {
            this.form.clickType=res.data.clickType
          } else {
            if (res.data.clickType==4||res.data.clickType==5||res.data.clickType==12||res.data.clickType==14) {
              this.forFinsuitPrdIndexListFun(res.data.clickType)
            } else if (res.data.clickType==16) {
              this.forFinsuitPrdIndexListSelectFun()
            }
            this.form.PRD_TYPE_ID=res.data.clickType
            this.form.clickType='2'
          }
          
          // this.form.pushWay=[]
          if (this.form.pushWay!=''||this.form.pushWay!=null) {
            this.form.pushWay=this.form.pushWay.split('')
          }
          
        } else {
          this.$message.error(res.description);
        }
      })
    }
  },
	methods:{
    //富文本编辑取值
		onEditorChangeDeal(html,id){
      console.log(html)
			console.log(id)
			this.form.dynamicDetails = html
		},
    // 选择产品时，获取产品名称
    changeLC (v) {
      this.PRD_TYPE_ListItem.forEach((i) => {
        if (v===i.ID) {
          this.form.PRD_NAME=i.ORG_NAME+"---"+i.PRD_NAME
        }
      })
    },
    // 选择活动时，获取活动名称
    changeAct (v) {
      this.actList.forEach((i) => {
        if (v===i.actId) {
          this.form.actityName=i.actName
        }
      })
    },
    // t添加事件
    addTime () {
      let has=1
      console.log(this.form.pushTimes)
      if (this.form.datetime===''||this.form.datetime===undefined){
        this.$message.error('请选择日期时间');
      }else if (this.form.pushTimes.length==0) {
        this.form.pushTimes.push(this.form.datetime)
      } else {
        this.form.pushTimes.forEach((i) => {
          if (this.form.datetime==i) {
            has=0
          }
        })
        if (has===1) {
          this.form.pushTimes.push(this.form.datetime)
        } else {
          this.$message.error('您记录的时间已经存在了');
        }
      }
    },
    // 查询活动数据
    getActivityListFun() {
      getActivityList().then((res) =>{
        if (res.result) {
          console.log(JSON.parse(res.data.actList))
          this.actList=JSON.parse(res.data.actList)
        }
      })
    },
    // 查询  相关产品 
    forFinsuitPrdIndexListFun (type) {
      // 货币1 理财2 纯债3
      let PRD_TYPE_ID= ''
      if (type==4) {
        PRD_TYPE_ID=1
      } else if(type==5) {
        PRD_TYPE_ID=2
      } else if(type==12) {
        PRD_TYPE_ID=3
      }
      let params = {
        PRD_TYPE_ID: PRD_TYPE_ID,
        PRD_STATUS: 1,
      }
      forFinsuitPrdIndexList(params).then((res) => {
        if (res.result) {
          this.loading=false
          this.PRD_TYPE_ListItem=res.data
        }
      })
    },
    // 获取银行存款
    forFinsuitPrdIndexListSelectFun () {
      let params = {
        PRD_TYPE_ID:4,
        PRD_STATUS:1
      }
      forFinsuitPrdIndexListSelect(params).then((res) => {
        if (res.result) {
          this.loading=false
          this.PRD_TYPE_ListItem=res.data
        }
      })
    },
    // 切换  选择产品
    changePRD (v) {
      this.form.prdIndexId=''
      this.form.actityId=''
      this.PRD_TYPE_ListItem=[]
      this.actList=[]
      let value=Number(v)
      if (value===5||value===12||value===4) {
        this.forFinsuitPrdIndexListFun(value)
      } else if (value===14) {
        this.forFinsuitPrdIndexListSelectFun()
      } else if (value===16) {
        this.getActivityListFun()
      }
    },
    // 弹框点击确认
    sure () {
      let params = {
        infoType: this.form.infoType, // 消息类型
        clickType: (this.form.clickType==1||this.form.clickType==20)?this.form.clickType:this.form.PRD_TYPE_ID, //点击类型   站内时选的是产品。理财还是活动
        prdIndexId:this.form.prdIndexId, //关联产品的时候选择的产品id
        pushUrl:this.form.pushUrl, //外部链接的时候 链接地址
        imgUrl:this.form.imgUrl,
        title:this.form.title, // 标题、
        summary:this.form.summary, // 内容
        pushType: this.form.pushType, // 1 全部用户  3 excel用户
        autoSend:this.form.autoSend,
        pushTimes:this.form.pushTimes.toString(), // 接收前台自定义时间值
        pushWay: this.form.pushWay.toString(), // 活动推送方式，1：短信，2：推送，3：站内信
        actityId: this.form.actityId, // 关联组对应的活动ID
        actityName:this.form.actityName, // 关联活动名称
        timestamp: this.timestamp, // 上传文件时间
        appFlag:this.form.appFlag, // pc bc 小程序等 ALL
        systemType:this.form.systemType, //0全部 1安卓 2iOS
        dynamicDetails:this.form.dynamicDetails
      }
      console.log(params)
      addActInfo(params).then((res) => {
        console.log(res)
        if (res.result) {
          this.showSure=true
          this.$confirm('推送成功，是否去查看推送记录？', '提示',{
            confirmButtonText: '去看看',
            cancelButtonText: '留下来继续发送',
            center: true,
            closeOnClickModal:false,
          }).then(() => {
            this.$refs.form.resetFields()
            this.form.pushUrl=''
            this.form.clickType=''
            this.dialogFormVisible=false
            // 点击确定   //定时消息是on  为定时消息，跳转到定时消息；；若为立即推送，则跳转到推送历史
            if (params.autoSend=='on') {
              let tabObj = {
                pid: 26,
                id: "764",
                href: "/omp/messagePush/index.html#/timingMessage",
                icon: null,
                title: "定时消息"
              }
              window.parent.postMessage({ message: "addTab", data: tabObj });
            } else {
              let tabObj = {
                pid: 26,
                id: "763",
                href: "/omp/messagePush/index.html#/messageHistory",
                icon: null,
                title: "推送历史"
              }
              window.parent.postMessage({ message: "addTab", data: tabObj });
            }
          }).catch(() => {
            // 点击取消按钮
            this.dialogFormVisible=false
          });
        } else {
          this.$message.error(res.description);
        }
      })
      
    },
    cancel () {
      this.$nextTick(() => {
        // this.$refs.messagePreview.dialogVisible=false
        this.dialogFormVisible=false
      })
      
    },
    // 点击发送预览
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        let params = {}
        if (valid) {
          console.log(this.form.clickType)
          console.log(this.form.dynamicDetails)
          if (this.form.clickType==='1'&&this.form.pushUrl==='') {
            this.$message.error('请完善跳转地址');
          } else if (this.form.clickType==='2'&&(this.form.PRD_TYPE_ID===""||this.form.PRD_TYPE_ID==4||this.form.PRD_TYPE_ID==5||this.form.PRD_TYPE_ID==12||this.form.PRD_TYPE_ID==14)&&this.form.prdIndexId==='') {
            this.$message.error('请完善跳转地址');
          } else if (this.form.clickType==='2'&&(this.form.PRD_TYPE_ID===""||this.form.PRD_TYPE_ID==16)&&this.form.actId==='') {
            this.$message.error('请完善跳转地址');
          } else if (this.form.clickType==='20'&&this.form.dynamicDetails==='') {
            this.$message.error('请完善跳转地址');
          } else if (this.showTime&&this.form.pushTimes.length==0) {
            this.$message.error('请选择发送时间');
          }else {
            this.dialogFormVisible=true
          }

        }
      })
    },
    // /上传图片
    uploadCheckImg(params) {
      const _file = params.file;
      const isLt5M = _file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
          this.$message.error("请上传5M以下的图片");
          return false;
      }
      var formData = new FormData();
      formData.append('imgUrl', _file);
      formData.append("type", '16');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.imgUrl=res.data[0]
          this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    // 上传文件
    uploadFile(params) {
      // console.log(this.$config.baseUrlHost)
      const _file = params.file;
      let timestamp=new Date().getTime()
      this.timestamp=timestamp
      var formData = new FormData();
      formData.append('file', _file);
      formData.append("timestamp", timestamp);
      
      console.log(_file)
      importActInfoByExcel(formData).then((res) => {
        if (res.result) {
          this.$message.success(res.description);
          this.fileName=_file.name
        } else {
          this.fileName=''
          this.$message.error(res.description);
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.sendMessage {
  padding: 20px;
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
  .time {
    /deep/ .el-button--small, .el-button--small.is-round {
      padding: 9px 5px;
    }
    // /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    //   width: 185px;
    // }
    /deep/ .el-radio {
      margin-right: 10px;
    }
  }
  
  .upload-demo {
    /deep/ .el-upload {
      border: 1px dashed #DCDFE6;
    }
  } 
  .upFile {
    display: inline-block;
    .el-button--small, .el-button--small.is-round {
      padding: 5px;
    }
  }
  /deep/ .el-form {
    width: 600px;
    margin: 0 auto;
  }
  /deep/ .el-tree {
    border: 1px solid #ccc;
    max-height: 260px;
    overflow: auto;
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
}
// .childCon {
//   // min-width: 512px;
//   // /deep/ .el-form-item__label {
//   //   width: 100px;
//   // }
// }

</style>
