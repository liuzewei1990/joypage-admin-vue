<template>
<!-- 综合设置 新增/修改 -->
  <div class='editAdvertPosit'>
    <el-form :size='size' ref="form" :rules="rules" :model="form" label-width="140px">
      <!-- <div class='advTypeTxt'>编辑广告位置</div> -->
      <el-form-item  label="活动名称：" prop="activityName">
        <el-input placeholder="" clearable v-model="form.activityName"></el-input>
      </el-form-item>
      
      <el-form-item  label="配置类型：" prop='configType'>
        <!-- 1 是产品2 是其他 -->
        <el-select @change='changeConfigType' clearable  v-model="form.configType" placeholder="">
          <el-option label="产品" value="1"></el-option>
          <el-option label="其他" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="跳转类型：" prop='contentType'>
        <el-select clearable @change='changeContentType' v-model="form.contentType" placeholder="">
          <el-option :disabled='(form.configType=="1"&&item.value!="3")||(form.configType=="2"&&item.value=="3")' v-for='(item,index) in contentTypeList' :key='index' :label="item.name" :value="item.value.toString()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='form.contentType!=""' label="内容" prop='content' style='position:relative'>
        <el-input type='email' v-if='form.contentType=="1"||form.contentType=="6"||form.contentType=="7"' v-model="form.content"></el-input>
        <el-select ref='scrollbar' no-match-text='' class='scrollSelect' @change='changeContent' clearable v-else v-model="form.contentName" :filterable='form.contentType==3||form.contentType==4||form.contentType==5' remote  :remote-method="searchPro" placeholder="">
          <div v-if='form.contentType==3||form.contentType==4||form.contentType==5'>
            <el-option  :class='form.contentType==5?"zixunClass":""' v-for='(item,index) in contentList' :key='index' :label="item.name+'-'+item.value" :value="item.name"></el-option>
          </div>
          <div v-else>
            <el-option  :class='form.contentType==5?"zixunClass":""' v-for='(item,index) in contentList' :key='index' :label="item.name" :value="item.name"></el-option>
          </div>
          <div style='text-align:center'>
            <el-button :disabled='pageParams.pageNum<=1' :size='size' type="text"  @click.stop="prevPage">上一页</el-button>
            <el-button  :disabled='pageParams.pageNum>=this.pageParams.totalPage' :size='size' type="text"  @click.stop="nextPage">下一页</el-button>
            <span style='color:#ccc;font-size:12px'>当前页{{pageParams.pageNum}}</span>
            <span style='color:#ccc;font-size:12px'>总页数{{pageParams.totalPage}}</span>
          </div>
        </el-select>
        
      </el-form-item>







      <el-form-item v-if='form.contentType!="3"&&form.contentType!=""' label="展示类型：" prop='showType'>
        <el-select @change='changeshowType' clearable  v-model="form.showType" placeholder="">
          <el-option v-for='(item,index) in showTypeList' :key='index' :label="item.lable" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  v-if='form.contentType!="3"&&form.contentType!=""' label="标题：" prop="title">
        <el-input clearable placeholder="" v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item v-if='form.contentType!="3"&&form.contentType!=""&&(form.showType=="2"||form.showType=="3"||form.showType=="4")' class='imgDiv' label="图片：" prop="imgUrlVl">
        <el-upload
          :model='form.imgUrl1'
          accept="image/*"
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadCheckImg1"
          :show-file-list="false"
          >
          <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          v-if='form.showType=="4"'
          :model='form.imgUrl2'
          style='margin:0 10px'
          accept="image/*"
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadCheckImg2"
          :show-file-list="false"
          >
          <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          v-if='form.showType=="4"'
          :model='form.imgUrl3'
          accept="image/*"
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadCheckImg3"
          :show-file-list="false"
          >
          <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item class='videoClass' v-if='form.contentType!="3"&&form.contentType!=""&&form.showType=="5"' label="视频：" prop="imgUrlVl">
        <el-upload style='display:inline-block;margin-top:-30px'
          :model='form.videoUrl'
          accept="video/*"
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadCheckVideo"
          :show-file-list="false"
          >
          <video  v-if="VideoUrls" width="320" height="240" controls>
            <source :src="VideoUrls" type="video/mp4">
            <source :src="VideoUrls" type="video/ogg">
          </video>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style='margin:0 10px;margin-top:-30px'>视频背景图：</span>
        <el-upload  style='display:inline-block;margin-top:-30px'
          :model='form.imgUrl1'
          accept="image/*"
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadCheckbackgroundUrls"
          :show-file-list="false"
          >
          <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item  label="排序值：" prop="seqOrder">
        <el-input  clearable placeholder="" v-model="form.seqOrder"></el-input>
      </el-form-item>
      <el-form-item  label="是否置顶：" prop='isTop'>
       <!-- 是否置顶（0.否 1是） -->
        <el-radio v-model="form.isTop" label="1">是</el-radio>
        <el-radio v-model="form.isTop" label="0">否</el-radio>
      </el-form-item>
      <el-form-item  label="角标图片：" prop="lableUrl">
        <el-upload
          :model='form.lableUrl'
          accept="image/*"
          class="upload-demo upload-demo1"
          action="customize"
          :http-request="uploadChecklableUrl"
          :show-file-list="false"
          >
          <img v-if="lableUrl" :src="lableUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item  label="来源：" prop="source">
        <el-input clearable  placeholder="" maxlength="8" v-model="form.source"></el-input>
      </el-form-item>
      <el-form-item label="用户分群：" prop='userGroup'>
        <el-select  clearable   v-model="form.userGroup" placeholder="">
          <el-option v-for='(item,index) in UserLvList' :key='index' :label="item.DIC_NAME" :value="item.DIC_VALUE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label="发布时间：" prop="time">
        <el-date-picker
         clearable 
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="是否下架：" prop='isEndbled'>
        <!-- 是否下架（0.否 1是） -->
        <el-radio v-model="form.isEndbled" label="1">是</el-radio>
        <el-radio v-model="form.isEndbled" label="0">否</el-radio>
        <!-- 监管沙盒ID -->
      </el-form-item>
            <el-form-item  label="监管沙盒ID：" prop='sandboxIds'>
            <el-input clearable placeholder=""  v-model="form.sandboxIds"></el-input>
      </el-form-item>
      <el-form-item class='btnCon'>
        <el-button :size='size' type="primary" :load='saveLoading' @click="onSubmit">保存</el-button>
        <el-button :size='size' @click='cancle()'>取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>排序值重复是否要进行插入操作，点击确定进行插入，原排序值及以后排序值均依次后移</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 接口函数依次：广告列表页查询
import { queryParameter, forUpload,createComprehensive,updateComprehensive,isHaveSeqOrder,queryPrdList,getContentByContentType,queryComprehensive,CMgetContentByContentType} from "../../apis/index"
export default {
	name: 'editAdvert',
	components:{},
	data() {
    var imgUrlVlVl = (rule, value, callback) => {
      if (this.form.showType=="4" && (this.form.imgUrl1==""||this.form.imgUrl2==""||this.form.imgUrl3=="")){
        callback(new Error("请上传图片"));
      } else if ((this.form.showType=="2"||this.form.showType=="3")&&this.form.imgUrl1=="") {
        callback(new Error("请上传图片"));
      } else if (this.form.showType=="5"&&(this.form.videoUrl==""||this.form.imgUrl1=='')) {
        callback(new Error("请上传视频和背景图"));
      } else {
        callback();
      }
    }
    var timeVl = (rule, value, callback) => {
      if (this.time==null){
        callback(new Error("请选择发布时间"));
      } else {
        callback();
      }
    }
    var seqOrderlVl = (rule, value, callback) => {
      if (this.form.seqOrder==''){
        callback(new Error("请输入排序值"));
      } else if (isNaN(this.form.seqOrder)) {
        callback(new Error("请输入正确的排序值"));
      } else if (this.form.seqOrder.indexOf(".")>-1) {
        callback(new Error("请输入正确的排序值"));
      } else if (this.form.seqOrder<1) {
        callback(new Error("排序值应大于0"));
      }else {
        callback();
      }
    }
    var contentVl = (rule, value, callback) => {
      if ((this.form.contentType=='1'||this.form.contentType=='6'||this.form.contentType=='7')&&this.form.content==''){
        callback(new Error('内容不能为空'));
      } else if (this.form.contentType=='2'&&this.form.content=='') {
        callback(new Error('内容不能为空'));
      } else if (this.form.contentType=='3'&&this.form.content=='') {
        callback(new Error('内容不能为空'));
      } else if (this.form.contentType=='4'&&this.form.content=='') {
        callback(new Error('内容不能为空'));
      } else if (this.form.contentType=='5'&&this.form.content=='') {
        callback(new Error('内容不能为空'));
      } else {
        callback();
      }
    }
 
		return {
      centerDialogVisible:false,
      size: 'small',
      saveLoading:false,
      imageUrl1:"",
      imageUrl2:"",
      imageUrl3:"",
      VideoUrls:"",
      lableUrl:"",
      time:null,
      UserLvList:[],
      contentTypeList:[],
      contentList: [],
      pageParams: {
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      form: {
        configType:"",
        activityName:'',
        showType: '',
        title: '',
        imgUrl1: '',
        imgUrl2: '',
        endTime: '',
        isEndbled: '',
        imgUrl3: '',
        source: '',
        userGroup: 'all',
        startTime: '',
        videoUrl: '',
        seqOrder: '',
        isTop: '',
        lableUrl:"",
        isHaveSeqOrder:"",
        contentType:"",
        content:"",
        contentName:"",
        sandboxIds:""
      },
      proName:"",
      contentTypeId: '',
      // 展示类型（1、无图，2、单图小，3、单图大，4、三图，5、视频）
      showTypeList: [
        {
          lable:"无图",
          value:"1"
        },
        {
          lable:"单图小",
          value:"2"
        },
        {
          lable:"单图大",
          value:"3"
        },
        {
          lable:"三图",
          value:"4"
        },
        {
          lable:"视频",
          value:"5"
        }
      ],
      options:[],
      loading:false,
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        contentType: [
          { required: true, message: '请选择配置类型', trigger: 'change' }
        ],
        content: [
          { required: true, validator:contentVl, trigger: 'change' }
        ],
        showType: [
          { required: true, message: '请选择展示类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        time: [
          { required: true, validator:timeVl, trigger: 'change' }
        ],
        imgUrlVl: [
          { required: true, validator:imgUrlVlVl, trigger: 'change' }
        ],
        prdId: [
          { required: true, message: '请输入产品id', trigger: 'change' }
        ],
        seqOrder: [
          { required: true,validator:seqOrderlVl, trigger: 'change' }
        ],
        configType: [
          { required: true, message: '请选择配置类型', trigger: 'change' }
        ],
        isEndbled: [
          { required: true, message: '请选择是否下架', trigger: 'change' }
        ],
        isTop: [
          { required: true, message: '请选择是否置顶', trigger: 'change' }
        ]
      }
		}
  },
  computed: {
    id () {
      return this.$route.query.id
    },
  },
  created () {
    if (this.$route.query.id) {
      let params = {
        id: Number(this.id)
      }
      queryComprehensive(params).then((res) => {
        if (res.code=='0') {
          this.form=res.data;
          this.time=[this.form.startTime,this.form.endTime]
          if (this.form.imgUrl1!=""&&this.form.imgUrl1!=null) {
            this.imageUrl1 = `${this.$Config.aliyuncHost}${this.form.imgUrl1}`
          }
          if (this.form.imgUrl2!=""&&this.form.imgUrl2!=null) {
            this.imageUrl2 = `${this.$Config.aliyuncHost}${this.form.imgUrl2}`
          }
          if (this.form.imgUrl3!=""&&this.form.imgUrl3!=null) {
            this.imageUrl3 = `${this.$Config.aliyuncHost}${this.form.imgUrl3}`
          }
          if (this.form.lableUrl!=""&&this.form.lableUrl!=null) {
            this.lableUrl = `${this.$Config.aliyuncHost}${this.form.lableUrl}`
          }
          if (this.form.videoUrl!=""&&this.form.videoUrl!=null) {
            this.VideoUrls = `${this.$Config.aliyuncHost}${this.form.videoUrl}`
            this.imageUrl1 = `${this.$Config.aliyuncHost}${this.form.imgUrl1}`
          }
          this.contentTypeId=this.form.contentType
          let params={
            pageNum: this.pageParams.pageNum,
            pageSize:this.pageParams.pageSize,
            contentTypeId: this.contentTypeId,
            name:""
          }
          CMgetContentByContentType(params).then((res) =>{
            if (Number(res.code)===0) {
              this.contentList = res.data.data
              this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
              console.log( this.pageParams.totalPage)
              if (this.form.contentType=='5') {
                this.$nextTick(() =>{
                  for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                    document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
                  }
                })
              }
            }
          })
        } else {
          this.$message.error(res.description)
        }
      })
      
    }
  },
  mounted() {
    this.queryParameterFun()
  },
  watch: {
    time (newValue, oldValue) {
      if (newValue==null) {
        this.form.endTime=''
        this.form.startTime=''
      } else {
        this.form.endTime=this.time[1]
        this.form.startTime=this.time[0]
      }
    },
  },
	methods: {
    // 切换为产品时  跳转类型隐藏
    changeConfigType (value) {
      if (value=="1") {
        this.contentTypeId='3'
        this.pageParams.pageNum=1
        this.form.contentType='3'
        this.form.contentName=''
        this.form.content=''
        let params={
          pageNum: this.pageParams.pageNum,
          pageSize:this.pageParams.pageSize,
          contentTypeId: this.contentTypeId,
          name:""
        }
        CMgetContentByContentType(params).then((res) =>{
          if (Number(res.code)===0) {
            this.contentList = res.data.data
            this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
            console.log( this.pageParams.totalPage)
            if (this.form.contentType=='5') {
                this.$nextTick(() =>{
                  for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                    document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
                  }
                })
              }
          }
        })
      } else {
        this.form.contentType=''
        this.form.contentName=''
        this.form.content=''
      }
    },
    searchPro(query) {
      this.pageParams.pageNum=1
      console.log(query)
      this.proName=query
      let params={
        pageNum: 1,
        pageSize:10,
        contentTypeId: this.contentTypeId,
        name: this.proName
      }
      CMgetContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          console.log( this.pageParams.totalPage)
          if (this.form.contentType=='5') {
            this.$nextTick(() =>{
              for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
              }
            })
          }
          if (res.data.data.length==0) {
            console.log(this.$refs.scrollbar)
            // .el-scrollbar
            // document.getElementsByClassName('')
          }
        }
      })
    },
    // 初始化广告管理页面参数
    forAdvertPageFun () {
      let params={
        advType: this.advType
      }
      forAdvertPage(params).then((res) => {
        if (Number(res.code)===0) {
          this.advertParamByTypeList=res.data
          console.log(this.advertParamByTypeList)
        }
      })
    },// 广告内容上一页
    prevPage () {
      if (this.pageParams.pageNum<=1) {
        this.pageParams.pageNum=1
      } else {
        this.pageParams.pageNum-=1
      }
      let params={
        pageNum: this.pageParams.pageNum,
        pageSize:this.pageParams.pageSize,
        contentTypeId: this.contentTypeId,
        name: this.proName
      }
      CMgetContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          if (this.form.contentType=='5') {
            this.$nextTick(() =>{
              for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
              }
            })
          }
          console.log( this.pageParams.totalPage)
        }
      })
    },
    // 广告内容下一页
    nextPage () {
      if (this.pageParams.pageNum>=this.pageParams.totalPage) {
        this.pageParams.pageNum=this.pageParams.totalPage
      } else {
        this.pageParams.pageNum+=1
      }
      let params={
        pageNum: this.pageParams.pageNum,
        pageSize:this.pageParams.pageSize,
        contentTypeId: this.contentTypeId,
        name: this.proName
      }
      CMgetContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          if (this.form.contentType=='5') {
            this.$nextTick(() =>{
              for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
              }
            })
          }
          console.log( this.pageParams.totalPage)
        }
      })
    },
     // 广告内容切换
    changeContent (e){
      this.contentList.forEach((i) => {
        if (i.name==e) {
          this.form.content=i.value
        }
      })
    },
    // 切换广告内容类型，广告内容变化
    changeContentType (value) {
      this.contentList = []
      this.pageParams.totalPage= 0
      this.pageParams.pageNum=1
      this.form.content=''
      this.form.contentName=''
      if (value==1) {} else {
        this.contentTypeId=value
        let params={
          pageNum: this.pageParams.pageNum,
          pageSize:this.pageParams.pageSize,
          contentTypeId: this.contentTypeId,
          name:""
        }
        CMgetContentByContentType(params).then((res) =>{
          if (Number(res.code)===0) {
            this.contentList = res.data.data
            this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
            console.log( this.pageParams.totalPage)
            if (this.form.contentType=='5') {
              this.$nextTick(() =>{
                for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                  document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
                }
              })
            }
          }
        })
      }
    },

    changeshowType () {
      this.imageUrl1=''
      this.imageUrl2=''
      this.imageUrl3=''
      this.videoUrls=''
      this.form.imgUrl1=''
      this.form.imgUrl2=''
      this.form.imgUrl3=''
      this.form.videoUrl=''
    },
    // 会员等级查询
    queryParameterFun () {
      let params= {
        
      }
      queryParameter(params) .then((res) => {
        if (res.result) {
          this.UserLvList=res.data.groupList
          this.contentTypeList=res.data.contentTypeList
        }
      })
    },
    //  上传图片
    uploadCheckImg1(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '3');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.imgUrl1=res.data[0]
          this.imageUrl1 = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    uploadCheckImg2(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '3');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.imgUrl2=res.data[0]
          this.imageUrl2 = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    uploadCheckImg3(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '3');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.imgUrl3=res.data[0]
          this.imageUrl3 = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    //  上传视频
    uploadCheckVideo(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '3');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.videoUrl=res.data[0]
          this.VideoUrls = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },
    // 上传视频背景图
    uploadCheckbackgroundUrls (params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '3');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.imgUrl1=res.data[0]
          this.imageUrl1 = `${this.$Config.aliyuncHost}${res.data[0]}`
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
      formData.append("type", '3');
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
        path: '/compositeSettingList'
      })
    },
    sure () {
      if (this.$route.query.id) {
        let params= {
          ID:this.$route.query.id,
          activityName: this.form.activityName,
          content:this.form.content,
          contentType: this.form.contentType,
          showType: this.form.showType,
          title: this.form.title,
          imgUrl1: this.form.imgUrl1,
          imgUrl2: this.form.imgUrl2,
          endTime: this.form.endTime,
          isEndbled: this.form.isEndbled,
          imgUrl3: this.form.imgUrl3,
          source: this.form.source,
          userGroup: this.form.userGroup,
          startTime: this.form.startTime,
          videoUrl: this.form.videoUrl,
          seqOrder: this.form.seqOrder,
          isTop: this.form.isTop,
          lableUrl:this.form.lableUrl,
          isHaveSeqOrder: this.form.isHaveSeqOrder,
          configType:this.form.configType,
          sandboxIds: this.form.sandboxIds,
        }
        updateComprehensive(params).then((res) =>{
          if (res.result) {
            this.$router.push({
              path: '/compositeSettingList'
            })
          } else {
            this.$message.error(res.description)
          }
        }).catch((error) => {
           this.$message.error('接口错误')
        })
      } else {
        let params = this.form
        createComprehensive(params).then((res) =>{
          if (res.result) {
            this.$router.push({
              path: '/compositeSettingList'
            })
          } else {
            this.$message.error(res.description)
          }
        }).catch((error) => {
           this.$message.error('接口错误')
        })
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveLoading=true
          // 校验排序
          let params= {
            seqOrder: this.form.seqOrder,
            ID: this.$route.query.id?this.$route.query.id:""
          }
          isHaveSeqOrder(params).then((res) => {
            if (res.data) {
              this.form.isHaveSeqOrder='true'
              this.centerDialogVisible=true
              this.saveLoading=false
            } else {
              this.form.isHaveSeqOrder='false'
              if (this.$route.query.id) {
                let params= {
                  ID:this.$route.query.id,
                  activityName: this.form.activityName,
                  content:this.form.content,
                  configType:this.form.configType,
                  contentType: this.form.contentType,
                  showType: this.form.showType,
                  title: this.form.title,
                  imgUrl1: this.form.imgUrl1,
                  imgUrl2: this.form.imgUrl2,
                  endTime: this.form.endTime,
                  isEndbled: this.form.isEndbled,
                  imgUrl3: this.form.imgUrl3,
                  source: this.form.source,
                  userGroup: this.form.userGroup,
                  startTime: this.form.startTime,
                  videoUrl: this.form.videoUrl,
                  seqOrder: this.form.seqOrder,
                  isTop: this.form.isTop,
                  lableUrl:this.form.lableUrl,
                  isHaveSeqOrder: this.form.isHaveSeqOrder,
                  sandboxIds: this.form.sandboxIds
                }
                updateComprehensive(params).then((res) =>{
                  if (res.result) {
                    this.$router.push({
                      path: '/compositeSettingList'
                    })
                  } else {
                    this.saveLoading=false
                    this.$message.error(res.description)
                  }
                }).catch((error) => {
                  this.saveLoading=false
                  this.$message.error('接口错误')
                })
              } else {
                let params = this.form
                createComprehensive(params).then((res) =>{
                  if (res.result) {
                    this.$router.push({
                      path: '/compositeSettingList'
                    })
                  } else {
                    this.saveLoading=false
                    this.$message.error(res.description)
                  }
                }).catch((error) => {
                  this.saveLoading=false
                  this.$message.error('接口错误')
                })
              }
            }
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
.videoClass {
  /deep/ .el-form-item__content {
    display: flex;
    width: max-content;
  }
}
/deep/ .el-select-dropdown__item {
  max-width: 800px;
}
</style>
