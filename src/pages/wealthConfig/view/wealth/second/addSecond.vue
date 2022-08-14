<template>
<!-- 综合设置 新增/修改 -->
  <div class='editAdvertPosit' v-loading="loadingCon">
    <el-form :size='size' ref="form" :rules="rules" :model="form" label-width="140px">
      <el-form-item class='imgDiv' label="标题：" prop="title">
         <el-input clearable placeholder="请输入" v-model="form.title"></el-input>
      </el-form-item>
       <el-form-item label="生效渠道：" prop="appFlags">
        <el-checkbox-group v-model="form.appFlags" size="small">
          <el-checkbox label="BC" value='BC' border>识贝比</el-checkbox>
          <el-checkbox label="PC" value='PC' border>识贝拼</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生效设备：" prop="systemTypes">
        <el-checkbox-group v-model="form.systemTypes" size="small">
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
      <el-form-item  label="模块选择：" prop='templateType'>
        <!-- 1只有1张图，2只有2张图，3只有3张图，4只有4张图，5轮播，6产品推荐 -->
        <ul class='MKXZcON'>
          <li class='MKXZ1'>
            <div>
              <span>1</span>
              <span>2</span>
            </div>
            <div>
              <span>3</span>
              <span>4</span>
            </div>
            <el-radio v-model="form.templateType" label="4">4图</el-radio>
          </li>
          <li class='MKXZ2'>
            <div>
              <div class='span1'>1</div>
              <div class='span2'>
                <div>2</div>
                <div>3</div>
              </div>
            </div>
            <el-radio v-model="form.templateType" label="3">3图</el-radio>
          </li>
          <li class='MKXZ3'>
            <div>
              <div class='span1'>1</div>
              <div class='span2'>2</div>
            </div>
            <el-radio v-model="form.templateType" label="2">2图</el-radio>
          </li>
          <li class='MKXZ4'>
            <div>1</div>
            <el-radio v-model="form.templateType" label="1">1图</el-radio>
          </li>
          <li class='MKXZ5'>
            <div>
              <span class='span1'></span>
              <span class='span2'></span>
              <span class='span3'></span>
            </div>
            <el-radio v-model="form.templateType" label="5">轮播</el-radio>
          </li>
          <li class='MKXZ6'>
            <div>
              <div class='span1'>XXXX</div>
              <div class='span2'>XXXX</div>
            </div>
            <el-radio v-model="form.templateType" label="6">产品推荐</el-radio>
          </li>
        </ul>
      <!-- </el-form-item> -->
      <!-- 模块选择 -->
      <!-- <el-form-item> -->
        <ul class='MKDetail'>
          <li v-for='(item, index) in wealthTwoMenuImgList' :key='index'>
            <div class='imgCon'>
              <el-form-item :label="'图片'+(index-(-1))+'：'" label-width="80px">
                <div @click='uploadonprogress(index)'>
                  <el-upload
                    :model='item.imgUrl'
                    accept="image/*"
                    class="upload-demo upload-demo1"
                    action="customize"
                    :http-request="uploadCheckImg"
                    :show-file-list="false"
                    >
                    <img v-if="item.imageUrl" :src="item.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <small style='color:red'>图片尺寸建议 {{item.size}}</small>
              </el-form-item>
              <el-form-item label="备注：" label-width="100px">
                <el-input @input='changebeizhu(index,item.remarks)' clearable placeholder="请输入" v-model="item.remarks"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="跳转至：" label-width="100px">
                <el-select clearable @change='changeContentType(index,item.contentType)' v-model="item.contentType" placeholder="">
                  <el-option v-for='(item1,index1) in contentTypeList' :key='index1' :label="item1.name" :value="item1.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="请选择："  label-width="100px" style='position:relative'>
                <el-input  @input='changecontent(index,item.content)' type='email' v-if='item.contentType=="1"' v-model="item.content"></el-input>
                <el-select @focus='clickContent(index,item.contentName)' ref='scrollbar' no-match-text='' class='scrollSelect' @change='changeContent(index,item.contentName)' clearable v-else v-model="item.contentName" :filterable='item.contentType==3' remote @blur='blurFun(index,item.contentName)' :loading="loading" :remote-method="searchPro" placeholder="">
                  <div v-if='item.contentType==3'>
                    <el-option  :class='item.contentType==5?"zixunClass":""' v-for='(item1,index1) in contentList' :key='index1' :label="item1.name+'-'+item1.value" :value="item1.name"></el-option>
                  </div>
                  <div v-else>
                    <el-option  :class='item.contentType==5?"zixunClass":""' v-for='(item1,index1) in contentList' :key='index1' :label="item1.name" :value="item1.name"></el-option>
                  </div>
                  <div style='text-align:center'>
                    <el-button :disabled='pageParams.pageNum<=1' :size='size' type="text"  @click.stop="prevPage">上一页</el-button>
                    <el-button  :disabled='pageParams.pageNum>=pageParams.totalPage' :size='size' type="text"  @click.stop="nextPage">下一页</el-button>
                    <span style='color:#ccc;font-size:12px'>当前页{{pageParams.pageNum}}</span>
                    <span style='color:#ccc;font-size:12px'>总页数{{pageParams.totalPage}}</span>
                  </div>
                </el-select>
              </el-form-item>
               <el-form-item label="监管沙盒：" label-width="100px">
                <el-input @input='changeSandboxId(index,item.sandboxId)' clearable placeholder="请输入产品ID" v-model="item.sandboxId"></el-input>
              </el-form-item>
            </div>
            <i  v-if='form.templateType=="5"&&wealthTwoMenuImgList.length>1' @click='deleteFun(index)' class='el-icon-delete'></i>
          </li>
        </ul>
        <!-- 推荐产品 -->
        <el-form-item label='显示产品数量：' v-if='form.templateType=="6"'>
          <el-input v-model='form.prdindexCount' type='number'></el-input>
        </el-form-item>
        <div>
          <el-button v-if='form.templateType=="5"' :size='size' type="primary" @click='addNum'>添加</el-button>
          <el-button  v-if='form.templateType!="6"&&form.templateType!=""' :size='size' type="primary" @click='YLTP'>预览</el-button>
          <ul class='MKXZcONYL' v-if='showYL'>
            <li class='MKXZ1' v-if='form.templateType=="4"'>
              <div>
                <span>
                  <img style='width:151px;height:64px' :src="wealthTwoMenuImgList[0].imageUrl" alt="">
                </span>
                <span>
                  <img style='width:151px;height:64px' :src="wealthTwoMenuImgList[1].imageUrl" alt="">
                </span>
              </div>
              <div>
                <span>
                  <img style='width:151px;height:64px' :src="wealthTwoMenuImgList[2].imageUrl" alt="">
                </span>
                <span>
                  <img style='width:151px;height:64px' :src="wealthTwoMenuImgList[3].imageUrl" alt="">
                </span>
              </div>
            </li>
            <li class='MKXZ2' v-if='form.templateType=="3"'>
              <div>
                <div class='span1'>
                  <img style='width:151px;height:136px' :src="wealthTwoMenuImgList[0].imageUrl" alt="">
                </div>
                <div class='span2'>
                  <div>
                    <img style='width:151px;height:64px' :src="wealthTwoMenuImgList[1].imageUrl" alt="">
                  </div>
                  <div>
                    <img style='width:151px;height:64px' :src="wealthTwoMenuImgList[2].imageUrl" alt="">
                  </div>
                </div>
              </div>
            </li>
            <li class='MKXZ3' v-if='form.templateType=="2"'>
              <div>
                <div class='span1'>
                  <img  style='width:151px;height:136px' :src="wealthTwoMenuImgList[0].imageUrl" alt="">
                </div>
                <div class='span2'>
                  <img style='width:151px;height:136px' :src="wealthTwoMenuImgList[1].imageUrl" alt="">
                </div>
              </div>
            </li>
            <li class='MKXZ4' v-if='form.templateType=="1"'>
              <div>
                <img  style='width:311px;height:136px' :src="wealthTwoMenuImgList[0].imageUrl" alt="">
              </div>
            </li>
            <li class='MKXZ5' v-if='form.templateType=="5"'>
              <div style='width:311px;height:75px;border:1px solid #000'>
                <el-carousel height='75px' interval='1500' indicator-position="none" arrow='never'>
                  <el-carousel-item v-for="(item ,index) in wealthTwoMenuImgList" :key="index">
                    <img  style='width:311px;height:75px' :src="item.imageUrl" alt="">
                  </el-carousel-item>
                </el-carousel>
              </div>
            </li>
          </ul>
        </div>
      </el-form-item>
     
      <el-form-item class='btnCon'>
        <el-button :size='size' type="primary" :load='saveLoading' @click="onSubmit">保存</el-button>
        <el-button :size='size' @click='cancle()'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 接口函数依次：广告列表页查询
import {forUpload,getContentByContentType,TwoMenusave,TwoMenugeselectOne} from "../../../apis/index"
export default {
	name: 'editAdvert',
	components:{},
	data() {
   // 模块数据处理
    var templateTypeVal= (rule, value, callback) => {
      let isOk=0
      let wealthTwoMenuImgListNew=[]
        if (this.form.templateType=='') {
          isOk='请完善模块信息'
        } else if (this.form.templateType=='6') {
          if (this.form.prdindexCount=='') {
            isOk='请填写显示产品数量'
          }
        } else { //sandboxId监管沙盒不校验，可以为空
          this.wealthTwoMenuImgList.forEach((i) => {
            if (i.imgUrl==''||i.remarks==''||i.contentType==''||i.content=='') {
              isOk='请完善模块信息'
            }
            let obj ={
              imgUrl:i.imgUrl,
              remarks:i.remarks,
              contentType:i.contentType,
              content:i.content,
              contentName: i.contentName,
              id:i.id,
              sandboxId:i.sandboxId,
            }
            wealthTwoMenuImgListNew.push(obj)
          })
        }
        this.wealthTwoMenuImgListNew=wealthTwoMenuImgListNew
        if (isOk==0) {
          callback();
        } else {
          callback(new Error(isOk));
        }
    }
		return {
      loading:false,
      size: 'small',
      saveLoading:false,
      imageUrl:"",
      lableUrl:"",
      UserLvList:[],
      form: {
        effectiveDatetimeStr:"",
        templateType:"",
        title: '',
        appFlags:[],
        systemTypes:[],
        isEnable:"",
        prdindexCount:""
      },
      pageParams: {
        pageSize: 10,
        pageNum: 1,
        totalPage: 0
      },
      loadingCon:false,
      showYL:false,
      wealthTwoMenuImgListNew:[],
      contentTypeList:[
        {name: "链接", value: '1'},
        {name: "活动", value: '2'},
        {name: "产品", value: '3'},
        {name: "机构", value: '4'},
        {name: "资讯", value: '5'}
      ],
      contentList:[],
      contentType:"",
      imgIndex:'', // 当前上传的是哪个图片
      currentType:"",//编辑的时候   一开始选择的模块
      rules: {
        effectiveDatetimeStr: [
          { required: true, message: '请选择生效时间', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        templateType: [
          { required: true, validator: templateTypeVal, trigger: 'change' }
        ],
        systemTypes: [
          { required: true, message: '请选择生效设备', trigger: 'change' }
        ],
        appFlags: [
          { required: true, message: '请选择生效渠道', trigger: 'change' }
        ],
      },

		}
  },
  watch : {
    templateType () {
      this.showYL=false
    }
  },
  computed: {
    templateType () {
      return this.form.templateType
    },
    id () {
      return this.$route.query.id
    },
    wealthTwoMenuImgList () {
      switch (this.form.templateType) {
        case '4':
          if (this.$route.query.id&&this.currentType=='4') {
            return [
              {
                imgUrl:this.form.wealthTwoMenuImgList[0].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[0].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[0].remarks,
                contentType:this.form.wealthTwoMenuImgList[0].contentType,
                content:this.form.wealthTwoMenuImgList[0].content,
                contentName: this.form.wealthTwoMenuImgList[0].contentName,
                id:this.form.wealthTwoMenuImgList[0].id,
                sandboxId:this.form.wealthTwoMenuImgList[0].sandboxId,
                size: '151*64'
              },
              {
                imgUrl:this.form.wealthTwoMenuImgList[1].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[1].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[1].remarks,
                contentType:this.form.wealthTwoMenuImgList[1].contentType,
                content:this.form.wealthTwoMenuImgList[1].content,
                contentName: this.form.wealthTwoMenuImgList[1].contentName,
                id:this.form.wealthTwoMenuImgList[1].id,
                sandboxId:this.form.wealthTwoMenuImgList[1].sandboxId,
                size: '151*64'
              },
              {
                imgUrl:this.form.wealthTwoMenuImgList[2].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[2].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[2].remarks,
                contentType:this.form.wealthTwoMenuImgList[2].contentType,
                content:this.form.wealthTwoMenuImgList[2].content,
                contentName: this.form.wealthTwoMenuImgList[2].contentName,
                id:this.form.wealthTwoMenuImgList[2].id,
                sandboxId:this.form.wealthTwoMenuImgList[2].sandboxId,
                size: '151*64'
              },
              {
                imgUrl:this.form.wealthTwoMenuImgList[3].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[3].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[3].remarks,
                contentType:this.form.wealthTwoMenuImgList[3].contentType,
                content:this.form.wealthTwoMenuImgList[3].content,
                contentName: this.form.wealthTwoMenuImgList[3].contentName,
                id:this.form.wealthTwoMenuImgList[3].id,
                sandboxId:this.form.wealthTwoMenuImgList[3].sandboxId,
                size: '151*64'
              }
            ]
          } else {
            return [
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                contentType:"",
                content:"",
                contentName: '',
                id:'',
                sandboxId:'',
                size: '151*64'
              },
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                contentType:"",
                content:"",
                contentName: '',
                id:'',
                sandboxId:'',
                size: '151*64'
              },
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                contentType:"",
                content:"",
                contentName: '',
                id:'',
                sandboxId:'',
                size: '151*64'
              },
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                contentType:"",
                id:'',
                sandboxId:'',
                content:"",
                contentName: '',
                size: '151*64'
              }
            ]
          }
          
        break;
        case '3':
          if (this.$route.query.id&&this.currentType=='3') { 
            return [
              {
                imgUrl:this.form.wealthTwoMenuImgList[0].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[0].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[0].remarks,
                contentType:this.form.wealthTwoMenuImgList[0].contentType,
                content:this.form.wealthTwoMenuImgList[0].content,
                contentName: this.form.wealthTwoMenuImgList[0].contentName,
                id:this.form.wealthTwoMenuImgList[0].id,
                sandboxId:this.form.wealthTwoMenuImgList[0].sandboxId,
                size: '151*136'
              },
              {
                imgUrl:this.form.wealthTwoMenuImgList[1].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[1].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[1].remarks,
                contentType:this.form.wealthTwoMenuImgList[1].contentType,
                content:this.form.wealthTwoMenuImgList[1].content,
                contentName: this.form.wealthTwoMenuImgList[1].contentName,
                id:this.form.wealthTwoMenuImgList[1].id,
                sandboxId:this.form.wealthTwoMenuImgList[1].sandboxId,
                size: '151*64'
              },
              {
                imgUrl:this.form.wealthTwoMenuImgList[2].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[2].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[2].remarks,
                contentType:this.form.wealthTwoMenuImgList[2].contentType,
                content:this.form.wealthTwoMenuImgList[2].content,
                contentName: this.form.wealthTwoMenuImgList[2].contentName,
                id:this.form.wealthTwoMenuImgList[2].id,
                sandboxId:this.form.wealthTwoMenuImgList[2].sandboxId,
                size: '151*64'
              }
            ]
          } else {
            return [
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                contentType:"",
                content:"",
                contentName: '',
                id:'',
                sandboxId:'',
                size: '151*136'
              },
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                id:'',
                sandboxId:'',
                contentType:"",
                content:"",
                contentName: '',
                size: '151*64'
              },
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                contentType:"",
                id:'',
                sandboxId:'',
                content:"",
                contentName: '',
                size: '151*64'
              }
            ]
          }
          
        break;
        case '2':
          if (this.$route.query.id&&this.currentType=='2') { 
            return [
              {
                imgUrl:this.form.wealthTwoMenuImgList[0].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[0].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[0].remarks,
                contentType:this.form.wealthTwoMenuImgList[0].contentType,
                content:this.form.wealthTwoMenuImgList[0].content,
                id:this.form.wealthTwoMenuImgList[0].id,
                sandboxId:this.form.wealthTwoMenuImgList[0].sandboxId,
                contentName: this.form.wealthTwoMenuImgList[0].contentName,
                size: '151*136'
              },
              {
                imgUrl:this.form.wealthTwoMenuImgList[1].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[1].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[1].remarks,
                contentType:this.form.wealthTwoMenuImgList[1].contentType,
                content:this.form.wealthTwoMenuImgList[1].content,
                contentName: this.form.wealthTwoMenuImgList[1].contentName,
                id:this.form.wealthTwoMenuImgList[1].id,
                sandboxId:this.form.wealthTwoMenuImgList[1].sandboxId,
                size: '151*136'
              },
            ]
          } else {
            return [
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                id:'',
                sandboxId:'',
                contentType:"",
                content:"",
                contentName: '',
                size: '151*136'
              },
              {
                imgUrl:"",
                id:'',
                sandboxId:'',
                imageUrl:"",
                remarks:"",
                contentType:"",
                content:"",
                contentName: '',
                size: '151*136'
              },
            ]
          }
          
        break;
        case '1':
          if (this.$route.query.id&&this.currentType=='1') { 
            return [
              {
                imgUrl:this.form.wealthTwoMenuImgList[0].imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${this.form.wealthTwoMenuImgList[0].imgUrl}`,
                remarks:this.form.wealthTwoMenuImgList[0].remarks,
                contentType:this.form.wealthTwoMenuImgList[0].contentType,
                content:this.form.wealthTwoMenuImgList[0].content,
                contentName: this.form.wealthTwoMenuImgList[0].contentName,
                id:this.form.wealthTwoMenuImgList[0].id,
                sandboxId:this.form.wealthTwoMenuImgList[0].sandboxId,
                size: '311*136'
              }
            ]
          } else {
            return [
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                id:'',
                sandboxId:'',
                contentType:"",
                content:"",
                contentName:'',
                size: '311*136'
              }
            ]
          }
          
        break;
        case '5':
          if (this.$route.query.id&&this.currentType=='5') {
            let newAarr=[]
            this.form.wealthTwoMenuImgList.forEach((i) =>{
              let obj = {
                imgUrl:i.imgUrl,
                imageUrl:`${this.$Config.aliyuncHost}${i.imgUrl}`,
                remarks:i.remarks,
                contentType:i.contentType,
                content:i.content,
                contentName:i.contentName,
                id:i.id,
                sandboxId:i.sandboxId,
                size: '311*75'
              }
              newAarr.push(obj)
            })
            return newAarr
          } else {
            return [
              {
                imgUrl:"",
                imageUrl:"",
                remarks:"",
                contentType:"",
                id:'',
                sandboxId:'',
                content:"",
                contentName: '',
                size: '311*75'
              }
            ]
          }
        // case '6':
        //   this.form.prdindexCount=
        break;
        default:
          return []
          break;
      }
    }
  },
  mounted() {
    // this.forAdvertPageFun()
    // this.queryUserLvListFun()
  },
  created () {
    if (this.$route.query.id) {
      this.loadingCon=true
      let params = {
        id: this.$route.query.id
      }
      TwoMenugeselectOne(params).then((res) => {
        if (res.result) {
          
          this.form=res.data
          if (this.form.appFlags.indexOf(',')) {
            this.form.appFlags=this.form.appFlags.split(",")
          } else {
            this.form.appFlags.push(this.form.appFlags)
          }
          if (this.form.systemTypes.indexOf(',')) {
            this.form.systemTypes=this.form.systemTypes.split(",")
          } else {
            this.form.systemTypes.push(this.form.systemTypes)
          }
          this.currentType=this.form.templateType
          this.wealthTwoMenuImgList=this.form.wealthTwoMenuImgList
          this.form.wealthTwoMenuImgList=this.form.wealthTwoMenuImgList
          this.form.effectiveDatetimeStr=this.form.effectiveDatetime
          this.loadingCon=false
        } else {
          this.loadingCon=false
          this.$message.error(res.description)
        }
      })
      // let appFlag=sessionStorage.getItem('detailMsg1')==null?[]:JSON.parse(sessionStorage.getItem('detailMsg1')).appFlags
      // let systemType=sessionStorage.getItem('detailMsg1')==null?[]:JSON.parse(sessionStorage.getItem('detailMsg1')).systemTypes
      // this.form=sessionStorage.getItem('detailMsg1')==null?this.form:JSON.parse(sessionStorage.getItem('detailMsg1'))
      // if (appFlag.indexOf(',')) {
      //   this.form.appFlags=appFlag.split(",")
      // } else {
      //   this.form.appFlags.push(appFlag)
      // }
      // if (systemType.indexOf(',')) {
      //   this.form.systemTypes=systemType.split(",")
      // } else {
      //   this.form.systemTypes.push(systemType)
      // }
      // this.currentType=this.form.templateType
      // this.wealthTwoMenuImgList=this.form.twoMenuImgList
      // this.form.wealthTwoMenuImgList=this.form.twoMenuImgList
      // this.form.effectiveDatetimeStr=this.form.effectiveDatetime

      // console.log('form::',this.form)
      
    }
  },
	methods: {
    // 预览功能
    YLTP () {
      let isOk=0
      if (this.wealthTwoMenuImgList.length==0) {
        this.$message.error("请选择模块并上传图片")
      } else {
        this.wealthTwoMenuImgList.forEach((i) => {
          if (i.imgUrl==''||i.imgUrl==null) {
            isOk='请上传图片'
          }
        })
        if (isOk==0) {
          this.showYL=true
        } else {
          this.$message.error("请上传图片")
          this.showYL=false
        }
      }
    },
    // 轮播图时 添加事件
    addNum () {
      let obj ={
        imgUrl:"",
        imageUrl:"",
        remarks:"",
        contentType:"",
        content:"",
        sandboxId:'',
        size: '311*75'
      }
      
      this.wealthTwoMenuImgList.push(obj)
      this.$forceUpdate()
      console.log(this.wealthTwoMenuImgList)
    },
    // 为轮播图时的删除
    deleteFun (index) {
      this.wealthTwoMenuImgList.splice(index,1)
      this.$forceUpdate()
    },
    uploadonprogress (index) {
      this.imgIndex=index
      console.log('valkue',index)
    },
   
    // 搜索产品数据
    blurFun (index ,value) {
      // this.$set(this.wealthTwoMenuImgList[index],'content',value)
      this.contentList.forEach((i) => {
        if (i.name==value) {
          this.$set(this.wealthTwoMenuImgList[index],'content',i.value)
        }
      })
      this.$forceUpdate()
    },
    searchPro(query) {
      console.log('ewewe',query)
      console.log("pageParams",this.pageParams)
      this.pageParams.pageNum=1
      console.log(query)
      this.proName=query
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
          // if (this.form.contentType=='5') {
            this.$nextTick(() =>{
              for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
              }
            })
          // }
        }
      })
    },
    // 广告内容上一页
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
      getContentByContentType(params).then((res) =>{
        if (Number(res.code)===0) {
          this.contentList = res.data.data
          this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
          // if (this.form.contentType=='5') {
            this.$nextTick(() =>{
              for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
              }
            })
          // }
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
          // if (this.form.contentType=='5') {
            this.$nextTick(() =>{
              for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
              }
            })
          // }
        }
      })
    },
    // 输入链接
    changecontent (index,value) {
      this.$set(this.wealthTwoMenuImgList[index],'content',value)
      this.$forceUpdate()
    },
    // 输入备注
    changebeizhu (index,value) {
      this.$set(this.wealthTwoMenuImgList[index],'remarks',value)
      this.$forceUpdate()
    },
     // 输入监管沙盒Id
    changeSandboxId (index,value) {
      this.$set(this.wealthTwoMenuImgList[index],'sandboxId',value)
      this.$forceUpdate()
    },
    // 点击 请选择
    clickContent (index,value) {
      // console.log('点击 请选择',this.contentList)
      this.contentList.forEach((i) => {
        if (i.name==value) {
          this.$set(this.wealthTwoMenuImgList[index],'content',i.value)
        } 
      })
      this.contentList=[]
      this.proName=''
      this.pageParams.totalPage= 0
      this.pageParams.pageNum=1
      this.loading=true
      this.$forceUpdate()
      // if (value==1) {} else {
        this.contentTypeId=this.wealthTwoMenuImgList[index].contentType
        let params={
          pageNum: this.pageParams.pageNum,
          pageSize:this.pageParams.pageSize,
          contentTypeId: this.contentTypeId,
          name:this.proName
        }
        getContentByContentType(params).then((res) =>{
          if (Number(res.code)===0) {
            this.contentList = res.data.data
            this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
            this.loading=false
            // if (this.form.contentType=='5') {
              this.$nextTick(() =>{
                for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                  document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
                }
              })
            // }
          }
        })
    },
    // 切换 请选择
    changeContent(index,value) {
       this.contentList.forEach((i) => {
        if (i.name==value) {
          this.$set(this.wealthTwoMenuImgList[index],'content',i.value)
        }
      })
      
      this.$forceUpdate()
    },
    // 切换广告内容类型，广告内容变化
    changeContentType (index,value) {
      this.proName=''
      this.pageParams.totalPage= 0
      this.pageParams.pageNum=1
      this.$set(this.wealthTwoMenuImgList[index],'contentType',value)
      this.$set(this.wealthTwoMenuImgList[index],'content','')
      this.$set(this.wealthTwoMenuImgList[index],'contentName','')
      this.$forceUpdate()
      if (value==1) {} else {
        this.contentTypeId=value
        let params={
          pageNum: this.pageParams.pageNum,
          pageSize:this.pageParams.pageSize,
          contentTypeId: this.contentTypeId,
          name:this.proName
        }
        getContentByContentType(params).then((res) =>{
          if (Number(res.code)===0) {
            this.contentList = res.data.data
            this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
            // if (this.form.contentType=='5') {
              this.$nextTick(() =>{
                for (var i=0;i<document.getElementsByClassName("zixunClass").length;i++) {
                  document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].setAttribute("title",document.getElementsByClassName("zixunClass")[i].getElementsByTagName('span')[0].innerHTML)
                }
              })
            // }
          }
        })
      }
    },
    //  上传图片
    uploadCheckImg(params) {
      const _file = params.file;
      var formData = new FormData();
      formData.append(params.uid, _file);
      formData.append("type", '1');
      console.log('imgIndex',this.imgIndex)
      forUpload(formData).then((res) => {
        if (res.result) {
          this.$set(this.wealthTwoMenuImgList[this.imgIndex],'imgUrl',res.data[0])
          this.$set(this.wealthTwoMenuImgList[this.imgIndex],'imageUrl',`${this.$Config.aliyuncHost}${res.data[0]}`)
          this.$forceUpdate()
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
        path: '/wealth/secondList'
      })
    },
    onSubmit() {
      console.log('保存')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params= {
            title:this.form.title,//菜单名称
            appFlags:this.form.appFlags.toString(),//多个渠道逗号分
            systemTypes:this.form.systemTypes.toString(),//多个设备逗号分
            effectiveDatetimeStr:this.form.effectiveDatetimeStr,//生效时间yyyy-MM-dd HH:mm:ss
            isEnable:this.form.isEnable,//是否启用 1启用0不启用
            templateType:this.form.templateType,//1只有1张图，2只有2张图，3只有3张图，4只有4张图，5轮播，6产品推荐
            prdindexCount:this.form.prdindexCount,//
            wealthTwoMenuImgList: this.wealthTwoMenuImgListNew,
            id: this.$route.query.id?this.$route.query.id:undefined
          }
          this.saveLoading=true
          console.log('提交入参',params)
          TwoMenusave(params).then((res) => {
            if (res.result) {
              this.$router.push({
                path:"/wealth/secondList"
              })
            } else {
              this.saveLoading=false
              this.$message.error(res.description)
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
    width: 1000px;
    // margin: 0 auto;
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
    // width: 400px;
    text-align: right;
    float: right;
  }
  .imgDiv {
    /deep/ .el-form-item__content {
      display: flex;
    }
    /deep/ .upload-demo {
      display: inline-block;
    }
  }
  .MKXZcON {
    display: flex;
    align-items: flex-end;
    li {
      flex: 1;
      margin-right: 50px;
      text-align: center;
    }
    .MKXZ1 {
      >div {
        height: 20px;
        display: flex;
        margin-bottom: 4px;
        span {
          display: inline-block;
          height: 20px;
          width: 50px;
          line-height: 20px;
          text-align: center;
          background: #999;
          border: 1px solid #000;
          margin-right: 2px;
        }

      }
    }
    .MKXZ2{
      >div {
        display: flex;
        .span1 {
          width: 50px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          background: #999;
          border: 1px solid #000;
          margin-right: 2px;
        }
        .span2 {
          div {
            width: 50px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background: #999;
            border: 1px solid #000;
            margin-bottom: 2px;
          }
        }
      }
    }
    .MKXZ3 {
      >div {
        display: flex;
        .span1 {
          width: 50px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          background: #999;
          border: 1px solid #000;
          margin-right: 2px;
        }
        .span2 {
          width: 50px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          background: #999;
          border: 1px solid #000;
          margin-right: 2px;
        }
      }
    }
    .MKXZ4 {
      >div {
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        background: #999;
        border: 1px solid #000;
        margin-right: 2px;
      }
    }
    .MKXZ5{
      >div {
        display: flex;
        border-top:1px solid #000;
        border-left:1px solid #000;
        border-bottom:1px solid #000;
        .span1 {
          display: inline-block;
          width: 80px;
          height: 30px;
          background: #999;
          border-right: 1px solid #000;
        }
        .span2, .span3 {
          display: inline-block;
          width: 10px;
          height: 30px;
          background: #fff;
          border-right: 1px solid #000
        }
      }
    }
    .MKXZ6 {
      >div {
        div {
          width: 100px;
          height: 20px;
          line-height: 20px;
          background: #999;
          border: 1px solid #000;
          margin-bottom: 2px;
        }
      }
    }
  }
  .MKDetail {
    li {
      position: relative;
      border: 1px solid #666;
      padding-top: 10px;
      margin-bottom: 20px;
      .imgCon {
        display: flex;
        /deep/ .el-input {
          width: 160px;
        }
      }
      .el-icon-delete {
        position: absolute;
        right: 50px;
        top: 20px;
        font-size: 1.8em;
      }
    }
  }
  .MKXZcONYL {
    margin-top: 10px;
    .MKXZ1 {
      >div {
        display: flex;
        margin-bottom: 4px;
        span {
          display: inline-block;
          border: 1px solid #000;
          margin-right: 2px;
        }

      }
    }
    .MKXZ2{
      >div {
        display: flex;
        .span1 {
          border: 1px solid #000;
          margin-right: 2px;
          height: max-content;
        }
        .span2 {
          div {
            border: 1px solid #000;
            margin-bottom: 2px;
          }
        }
      }
    }
    .MKXZ3 {
      >div {
        display: flex;
        .span1 {
          border: 1px solid #000;
          margin-right: 2px;
        }
        .span2 {
          border: 1px solid #000;
          margin-right: 2px;
        }
      }
    }
    .MKXZ4 {
      >div {
        border: 1px solid #000;
        max-width: max-content;
        margin-right: 2px;
      }
    }
  }
}
/deep/ .el-select-dropdown__item {
  max-width: 800px;
}
</style>
