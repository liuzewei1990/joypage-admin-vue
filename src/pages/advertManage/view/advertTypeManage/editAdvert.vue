<template>
<!-- 修改广告 -->
  <div class='editAdvert'>
    <el-form :size='size' ref="form" :rules="rules" :model="form" label-width="140px">
      <div class='advTypeTxt'>修改{{advTypeTxt}}</div>
      <el-form-item v-if='advType==1||advType==3||advType==4'  label="广告标题：" prop="advTitle">
        <el-input v-model="form.advTitle"></el-input>
      </el-form-item>
        <el-form-item v-if='advType==1'  label="排列方式：" prop="arrangementMode">
         <el-select clearable v-model="form.arrangementMode" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.arrangementList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="弹框标题：" prop="advTitle">
        <el-input v-model="form.advTitle"></el-input>
      </el-form-item>

<!-- 横幅广告 -->
      <!-- <el-form-item v-if='advType==1' label="广告图片："  prop="advImgUrl">
         <el-upload
          :model='form.advImgUrl'
          class="upload-demo"
          action="customize"
          :http-request="uploadCheckImg"
          :show-file-list="false"
          :accept='acceptType'
          >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item v-if='advType==1' label="图片描述：" prop='advImgMemo'>
        <el-input v-model="form.advImgMemo"></el-input>
      </el-form-item> -->

<!-- 弹窗广告 -->
      <el-form-item v-if='advType==2' label="弹框图片："  prop="advImgUrl">
        <el-upload
          :model='form.advImgUrl'
          class="upload-demo"
          action="customize"
          :http-request="uploadCheckImg"
          :show-file-list="false"
          :accept='acceptType'
          >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
<!-- 开屏广告，悬浮广告，横幅广告 -->
      <el-form-item v-if='advType==1||advType==3||advType==4' label="展现形式：" prop='showType'>
        <el-select  @change='changeType' clearable v-model="form.showType" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.showTypeList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='advType==1||advType==3||advType==4' label=""  prop="advImgUrl">
        <el-upload
          :model='form.advImgUrl'
          class="upload-demo"
          action="customize"
          :http-request="uploadCheckImg"
          :show-file-list="false"
          :accept='acceptType'
          >
          <img v-if="imageUrl&&form.showType!=2" :src="imageUrl" class="avatar">
          <video  v-else-if="imageUrl&&form.showType==2" width="320" height="240" controls>
            <source :src="imageUrl" type="video/mp4">
            <source :src="imageUrl" type="video/ogg">
          </video>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      
      <el-form-item  :label="advType==1||advType==3||advType==4?'广告排序：':'弹框排序：'" prop='advOrder'>
        <el-input type='number' v-model="form.advOrder"></el-input>
      </el-form-item>

      <el-form-item label="广告内容类型：" prop='contentType'>
        <el-select clearable @change='changeContentType' v-model="form.contentType" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.contentTypeList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告内容：" prop='content'>
        <el-input type='email' v-if='form.contentType=="1"' v-model="form.content"></el-input>
        <el-select ref='scrollbar' no-match-text='' class='scrollSelect' @change='changeContent' clearable v-else v-model="form.contentName" :filterable='form.contentType==3' remote @blur='blurFun' :remote-method="searchPro" placeholder="">
          <div v-if='form.contentType==3'>
            <el-option v-for='(item,index) in contentList' :key='index' :label="item.name+'-'+item.value" :value="item.name"></el-option>
          </div>
          <div v-else>
            <el-option v-for='(item,index) in contentList' :key='index' :label="item.name" :value="item.name"></el-option>
          </div>
          <div style='text-align:center'>
            <el-button :disabled='pageParams.pageNum<=1' :size='size' type="text"  @click.stop="prevPage">上一页</el-button>
            <el-button  :disabled='pageParams.pageNum>=this.pageParams.totalPage' :size='size' type="text"  @click.stop="nextPage">下一页</el-button>
            <span style='color:#ccc;font-size:12px'>当前页{{pageParams.pageNum}}</span>
            <span style='color:#ccc;font-size:12px'>总页数{{pageParams.totalPage}}</span>
          </div>
        </el-select>
        
      </el-form-item>

      <el-form-item v-if='advType==1' label="广告目的：" prop='purpose'>
        <el-select clearable v-model="form.purpose" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.advGoalList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if='advType==1' label="设计风格：" prop='advStyle'>
        <el-select clearable v-model="form.advStyle" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.advStyleList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if='advType==1||advType==3' label="显示版本：" prop='ctVer'>
        <el-input type='number' v-model="form.ctVer"></el-input>
      </el-form-item>

      <el-form-item label="广告系列：" prop='advSeriesId'>
        <el-select clearable v-model="form.advSeriesId" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.advSeriesList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if='advType==2||advType==3' label="展现时间：" prop='appearPersistTime'>
        <el-input type="number" v-model="form.appearPersistTime"></el-input>
      </el-form-item>

      <el-form-item v-if='advType==2' label="弹窗频率：" prop='tipFrequency'>
        <el-select clearable v-model="form.tipFrequency" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.popUpFrequencyList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if='advType==3' label="展现频率：" prop='tipFrequency'>
        <el-select clearable v-model="form.tipFrequency" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.showFrequencyList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="可见用户：" prop='advVisibleUser'>
        <el-select clearable v-model="form.advVisibleUser" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.availableUserList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='advType==1||advType==2' label="监管沙盒：" prop='sandboxId'>
        <el-input type="text" v-model="form.sandboxId"></el-input>
        <small>请输入产品ID</small>
      </el-form-item>
      <el-form-item label="显示时间：" prop='value1'>
        <el-time-picker
          @input='changeTime'
          is-range
          v-model="form.value1"
          range-separator="~"
          format='HH:mm'
          value-format="yyyy-MM-dd HH:mm:ss"  
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="发布时间：" prop='value2'>
        <el-date-picker
        @input='changeDate'
          v-model="form.value2"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"  
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="广告位置：" prop='advPositId'>
        <el-select @change='advPositChange' clearable v-model="form.advPositId" placeholder="">
          <el-option v-for='(item,index) in advertParamByTypeList.advPositionList' :key='index' :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放渠道：" prop='appFlag'>
        <el-select clearable v-model="form.appFlag" multiple placeholder="请选择">
         <el-option
            v-for="item in advChannelList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放设备：" prop='advPlatform'>
        <el-select clearable v-model="form.advPlatform" multiple placeholder="请选择">
          <el-option
            v-for="item in advDeviceList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class='btnCon'>
        <el-button  :size='size' type="primary" :loading='saveLoading' @click="onSubmit">提交</el-button>
        <el-button :size='size' @click='cancle()'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 接口函数依次：广告列表页查询
import { getAdvDetail,forAdvertPage,forUpload,updateAdvert,getContentByContentType,getFlagAndDeviceTypeByPosit } from "../../apis/index"
export default {
	name: 'editAdvert',
	components:{},
	data() {
		return {
      advChannelList: [],
      advDeviceList: [],
      size: 'small',
      saveLoading: false,
      upLoadUrl: this.$Config.aliyuncHost,
      header: {token: sessionStorage.token},  // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      imageUrl: '',
      options: [],
      form: {
        advTitle: '',
        arrangementMode:'',
        advImgUrl:"",
        advImgMemo: '',
        advOrder: '',
        contentType: '',
        content: '',
        contentName: '',
        purpose: '',
        advStyle: '',
        tipFrequency: '',
        advVisibleUser: '',
        sandboxId:"",
        showStartTime: '',
        showEndTime: '',
        value1: '',
        value2: '',
        startTime: '',
        endTime: '',
        advertExtendList:"",
        advPositId: '',
        appFlag: [],
        advPlatform: [],
        ctVer: ''
      },
      saveImgLists:[],
      acceptType:'image/*',
      proName:"",
      rules: {
        appearPersistTime: [
          { required: true, message: '请输入展现时间', trigger: 'blur' }
        ],
        tipFrequency: [
          { required: true, message: '请选择频率', trigger: 'blur' }
        ],
        ctVer: [
          { required: true, message: '请输入显示版本', trigger: 'blur' }
        ],
        advPlatform: [
          { required: true, message: '请选择投放设备', trigger: 'blur' }
        ],
        appFlag: [
          { required: true, message: '请选择投放渠道', trigger: 'blur' }
        ],
        advTitle: [
          { required: true, message: '请输入广告标题', trigger: 'blur' }
        ],
        advImgUrl: [
          { required: true, message: '请上传广告图片', trigger: 'blur' }
        ],
        showType: [
          { required: true, message: '请选择展现形式', trigger: 'blur' }
        ],
        advOrder: [
          { required: true, message: '请输入广告排序', trigger: 'blur' }
        ],
        contentType: [
          { required: true, message: '请选择广告内容', trigger: 'blur' }
        ],
        advVisibleUser: [
          { required: true, message: '请选择可见用户', trigger: 'blur' }
        ],
        value1: [
          { required: true, message: '请选择显示时间', trigger: 'blur' }
        ],
        value2: [
          { required: true, message: '请选择发布时间', trigger: 'blur' }
        ],
        advPositId: [
          { required: true, message: '请选择广告位置', trigger: 'blur' }
        ],
      },
      id: this.$route.query.id,
      advertParamByTypeList: {},
      formData:'',
      advImgListItems:[], //上传图片的图片路径
      contentList: [],
      pageParams: {
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      contentTypeId: ''
		}
  },
  computed: {
    id () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.imageUrl=''
        this.getAdvDetailFun()
      })
      return this.$route.query.id
    },
    advType () {
      return this.$route.query.type
    },
    advTypeTxt () {
      let type=Number(this.$route.query.type)
      switch (type) {
         case 1:
          return '横幅广告';
          break;
        case 2:
          return  '弹窗广告';
          break;
        case 3:
          return  '开屏广告';
          break;
        case 4:
          return  '悬浮广告';
          break;
        default:
         return '横幅广告';
         break;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.form.resetFields()
      this.imageUrl=''
    })
    this.getAdvDetailFun()
    this.forAdvertPageFun()
	},
	methods: {
    // 搜索产品数据
    blurFun () {
      console.log('4')
      // this.proName=''
      let dd=''
      this.searchPro(dd)
    },
    searchPro(query) {
      this.pageParams.pageNum=1
      console.log('@@@',query)
      this.proName=document.getElementsByClassName('scrollSelect')[0].querySelector('.el-input__inner').value
      console.log('苹果',document.getElementsByClassName('scrollSelect')[0].querySelector('.el-input__inner').value)
      let params={
        pageNum: 1,
        pageSize:10,
        contentTypeId: this.contentTypeId,
        name: this.proName
      }
      getContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          console.log( this.pageParams.totalPage)
        }
      })
    },
    changeType () {
      this.form.advImgUrl=''
      this.imageUrl=''
      if (this.form.showType==2) {
        this.acceptType='video/*'
      } else {
        this.acceptType='image/*'
      }
    },
    // 切换广告位置
    advPositChange () {
      this.form.appFlag= ''
      this.form.advPlatform=''
      this.dvChannelList = []
      this.advDeviceList = []
      this.getFlagAndDeviceTypeByPositFun(this.form.advPositId)
    },
    // 根据广告位置ID获取渠道和设备
    getFlagAndDeviceTypeByPositFun (id) {
      let params = {
        positId: id
      }
      getFlagAndDeviceTypeByPosit(params).then((res) => {
        console.log(res)
        if (Number(res.code==0)){
          this.advChannelList = res.data.advChannelList
          this.advDeviceList = res.data.advDeviceList
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
          name: this.proName
        }
        getContentByContentType(params).then((res) =>{
          if (Number(res.code)===0) {
            this.contentList = res.data.data
            this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
            console.log( this.pageParams.totalPage)
          }
        })
      }
    },
    // 广告内容上一页
    prevPage () {
      console.log(this.proName)
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
      getContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
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
      getContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          console.log( this.pageParams.totalPage)
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
          let arr = [{
            name:'坚排',
            value: '1',
          },{
            name:'滚动排列',
            value: '2',
          }]//排列方式--本地写死
          this.advertParamByTypeList.arrangementList = arr
          console.log('初始化广告管理页面参数',this.advertParamByTypeList)
        }
      })
    },

    uploadCheckImg(params) {
      const _file = params.file;
      const isLt5M = _file.size / 1024 / 1024 < 30;
      if (!isLt5M) {
          this.$message.error("请上传不能超过30M");
          return false;
      }
      this.form.advImgUrl=''
      this.imageUrl = ''
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '11');
      forUpload(formData).then((res) => {
        if (res.result) {
          this.form.advImgUrl=res.data[0]
          this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
        } else {
          this.$message.error(res.description);
        }
      })
    },

    changeTime (e) {
      let _this= this
      _this.$nextTick(() => {
        console.log(e)
        _this.$set(_this.form, "value1", e);
        _this.$forceUpdate();
      });
    },
    changeDate (e) {
      let _this= this
      _this.$nextTick(() => {
        _this.$set(_this.form, "value2", [e[0], e[1]]);
        _this.form.value2= [e[0], e[1]]
        _this.$forceUpdate();
      });
    },
    // 查询详情
    getAdvDetailFun () {
      let params=''
      let id=this.id
      getAdvDetail(params,id).then((res) => {
        console.log('当前详情信息res',res.data)
        if (Number(res.code)===0) {
          let _this =this
          this.form=res.data
          this.form.contentName=res.data.contentName
          this.form.arrangementMode = res.data.arrangementMode //排列方式
          if (this.form.showType==2) {
            this.acceptType='video/*'
          } else {
            this.acceptType='image/*'
          }
          this.getFlagAndDeviceTypeByPositFun(res.data.advertExtendList[0].advPositId)
          if (res.data.advImgList.length>0) {
            this.$set(this.form,'advImgUrl',`${res.data.advImgList[0].advImgUrl}`)
            this.$set(this.form,'advImgMemo',res.data.advImgList[0].advImgMemo)
            this.imageUrl = `${this.$Config.aliyuncHost}${res.data.advImgList[0].advImgUrl}`

            console.log(typeof(res.data.advImgList[0].advImgUrl))
          } else {
             this.$set(this.form,'advImgMemo','')
          }
          // this.form.advImgUrl=res.data[0]
          this.form.value2= [res.data.startTime, res.data.endTime]
          this.form.value1= [res.data.showStartTime[0], res.data.showEndTime[0]]


          let appFlag=""
          let advPlatform=""
          if (res.data.advertExtendList.length>0) {
            if (res.data.advertExtendList[0].appFlag.indexOf(",")==-1) {
              if (res.data.advertExtendList[0].appFlag=='') {
                appFlag=''
              } else {
                appFlag=[res.data.advertExtendList[0].appFlag]
              }
            } else {
              appFlag=res.data.advertExtendList[0].appFlag.split(',')
            }

            if (res.data.advertExtendList[0].advPlatform.indexOf(",")==-1) {
              if (res.data.advertExtendList[0].advPlatform=='') {
                advPlatform=''
              } else {
                advPlatform=[res.data.advertExtendList[0].advPlatform]
              }
            } else {
              advPlatform=res.data.advertExtendList[0].advPlatform.split(',')
            }
          } else {
            appFlag=""
            advPlatform=""
          }
          if (this.form.contentType=="1"){}else {
            this.form.content=Number(res.data.content)
            this.contentTypeId=res.data.contentType
            let params={
              pageNum: this.pageParams.pageNum,
              pageSize:this.pageParams.pageSize,
              contentTypeId: res.data.contentType,
              name: this.proName
            }
            getContentByContentType(params).then((res) =>{
              if (Number(res.code)===0) {
                this.contentList = res.data.data
                this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
                console.log(this.contentList)
              }
            })
            this.$set(this.form, "content", res.data.content==''?null:Number(res.data.content));
          }

          
          this.$nextTick(() => {
            this.$set(this.form, "advPositId", res.data.advertExtendList.length>0?res.data.advertExtendList[0].advPositId:null);
            this.$set(this.form, "appFlag", appFlag);
            this.$set(this.form, "advPlatform", advPlatform);
            this.$forceUpdate();

          });
        } else {
          this.$message.error('获取数据失败');
        }
      })
    },
    cancle () {
      this.$refs.form.resetFields()
      this.$router.push({
        path: `/advertList?type=${this.advType}`
      })
    },
    onSubmit() {
      this.saveLoading=true
      let showStartTime=[]
      let showEndTime=[]
      let advertExtendList=[]
      let advImgList=[]
      showStartTime.push(`${this.form.value1[0]}`)
      showEndTime.push(`${this.form.value1[1]}`)
      advertExtendList.push({
        advPositId:this.form.advPositId,// 广告位置
        appFlag:this.form.appFlag.toString(),// 投放渠道
        advPlatform:this.form.advPlatform.toString()// 投放设备
      })
      let df= {
        "advImgUrl": this.form.advImgUrl,
        "advImgMemo": this.form.advImgMemo
      }
      advImgList.push(df)
      this.$refs['form'].validate((valid) => {
        let params = {}
        if (valid) {
          if (this.advType=='1') { // 1:横幅 2:弹窗 3:开屏 4:悬浮
            params = {
              id:this.id,
              advType:this.advType,// 广告类型
              showType:this.form.showType,// 展现形式
              advTitle: this.form.advTitle,//广告标题
              arrangementMode:this.form.arrangementMode, //排列方式
              advOrder:this.form.advOrder,// 广告排序
              contentType:this.form.contentType,// 广告内容类型
              content:this.form.content,// 广告内容
              purpose:this.form.purpose,// 广告目的
              advStyle:this.form.advStyle,// 设计风格
              advSeriesId:this.form.advSeriesId,// 广告系列
              advVisibleUser: this.form.advVisibleUser,// 可见用户
              sandboxId: this.form.sandboxId,//监管沙漏
              showStartTime: showStartTime,// 显示开始时间
              showEndTime:showEndTime,// 显示结束时间
              startTime: this.form.value2[0],// 发布开始时间
              endTime: this.form.value2[1],// 发布结束时间
              advertExtendList: advertExtendList,
              advImgList:advImgList,
              ctVer:this.form.ctVer
            }
          } else if (this.advType=='2') {
            params= {
              id:this.id,
              advType:this.advType,
              advTitle:this.form.advTitle,// 弹窗标题
              contentType:this.form.contentType,// 广告内容类型
              advSeriesId:this.form.advSeriesId,// 广告系列
              content: this.form.content,// 广告内容
              advOrder:this.form.advOrder,// 弹窗排序
              appearPersistTime:this.form.appearPersistTime,// 展现时间
              tipFrequency:this.form.tipFrequency,// 弹窗频率
              advVisibleUser:this.form.advVisibleUser,// 可见用户
              sandboxId: this.form.sandboxId,//监管沙漏
              showStartTime:showStartTime,// 显示开始时间
              showEndTime:showEndTime,// 显示结束时间
              startTime:this.form.value2[0],// 发布开始时间
              endTime:this.form.value2[1],// 发布结束时间
              advertExtendList:advertExtendList,
              advImgList:advImgList
            }
          } else if (this.advType=='3') {
            params= {
              id:this.id,
              advType:this.advType,
              advTitle:this.form.advTitle,// 广告标题
              showType:this.form.showType,// 展现形式
              contentType:this.form.contentType,// 广告内容类型
              advSeriesId:this.form.advSeriesId,// 广告系列
              content:this.form.content,// 广告内容
              advOrder:this.form.advOrder,// 广告排序
              appearPersistTime:this.form.appearPersistTime,// 展现时间
              tipFrequency:this.form.tipFrequency,// 展现频率
              advVisibleUser:this.form.advVisibleUser,// 可见用户
              showStartTime:showStartTime,// 显示开始时间
              showEndTime:showEndTime,// 显示结束时间
              startTime:this.form.value2[0],// 发布开始时间
              endTime:this.form.value2[1],// 发布结束时间
              advertExtendList:advertExtendList,
              advImgList:advImgList,
              ctVer:this.form.ctVer
            }
          } else if (this.advType=='4') {
            params= {
              advType:this.advType,
              id:this.id,
              advTitle:this.form.advTitle,// 广告标题
              showType:this.form.showType,// 展现形式
              contentType: this.form.contentType,// 广告内容类型
              advSeriesId:this.form.advSeriesId,// 广告系列
              content: this.form.content,// 广告内容
              advOrder: this.form.advOrder,// 广告排序
              advVisibleUser:this.form.advVisibleUser,// 可见用户
              showStartTime:showStartTime,// 显示开始时间
              showEndTime:showEndTime,// 显示结束时间
              startTime:this.form.value2[0],// 发布开始时间
              endTime:this.form.value2[1],// 发布结束时间
              advertExtendList:advertExtendList,
              advImgList:advImgList
            }
          }
          console.log('保存前入参',params)
          updateAdvert (params).then((res) => {
            console.log('修改res',res)
            if (Number(res.code)===0) {
              this.saveLoading=false
              this.$router.push(
                {
                  path: `/advertList?type=${this.advType}`
                }
              )
            } else {
              this.saveLoading=false
              this.$message.error('修改广告失败');
            }
          })
        } else {
          console.log(this.form)
          this.saveLoading=false
           return false;
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
.editAdvert {
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
    width: 620px;
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
