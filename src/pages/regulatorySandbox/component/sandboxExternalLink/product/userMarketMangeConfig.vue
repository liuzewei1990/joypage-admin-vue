<template>
<!--  用户营销配置 产品   配置条件  -->
  <div class='config'>
    <!-- <div class='title'>配置条件</div> -->
    <el-form  :size='size' ref="form" :rules="rules" :model="form" label-width="180px">
      <el-form-item label='配置条件可购买状态：' prop='buyStatus'>
        <el-radio v-model="form.buyStatus" label="1">可购买条件</el-radio>
        <el-radio v-model="form.buyStatus" label="0">不可购买条件</el-radio>
      </el-form-item>
      <h5>用户管理配置</h5>
      <el-form-item label="限制地域：" prop='eareVl'>
        <div v-for='(ITEMS1,index11) in form.userRegionConditionList' :key='index11'>
          <div class='area'>
            <el-select placeholder="请选择省" clearable v-model='ITEMS1.province' @change='changePrv(ITEMS1,"prv")'>
              <el-option v-for='(item,index) in prvList' :label='item.provinceName' :value='item.provinceName' :key='index'>{{item.provinceName}}</el-option>
            </el-select>
            <el-select v-model='ITEMS1.city' clearable :disabled='ITEMS1.province==""' @focus='changePrv(ITEMS1,"city")'>
              <el-option v-for='(item,index) in cityList'  :label='item.citysName' :value='item.citysName' :key='index'>{{item.citysName}}</el-option>
            </el-select>
            <div>
              <span>请选择限制条件：</span>
              <el-checkbox v-model="ITEMS1.regPhoneNumCheck">注册手机号归属地</el-checkbox>
              <el-checkbox v-model="ITEMS1.idCardAddressCheck">身份证地址</el-checkbox>
              <el-checkbox v-model="ITEMS1.gpsLocationCheck">GPS地理位置</el-checkbox>
              <i @click='delArea(index11)' v-if='form.userRegionConditionList.length>1' class="el-icon-delete"></i>
            </div>
          </div>
          <div>或</div>
        </div>
        <div>
          <div class='addClass'>
            <span @click='addArea'>新增限制地域</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop='locationNotObtained'>
        <span class='label'>配置未获取地域信息用户:</span>
        <el-tooltip class="item" effect="dark" placement="top-start">
          <div slot="content">1、关表示不配置，执行未知地域信息用户不屏蔽规则，可通过外链购买当前银行产品。<br/>2、开表示配置，此时根据监管规则的可购买状态执行。</div>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        <el-switch
          v-model="form.locationNotObtained"
          active-color="#13ce66"
          inactive-color="#ccc">
        </el-switch>
      </el-form-item>
      <el-form-item label='比财注册状态与时间：'  prop='RegTime'>
        <div class='staTime'>
          <div>
            <span>状态：</span>
            <!-- 1已经注册0注册 -->
            <el-radio v-model="form.userRegStatus"  @click.native.prevent="radioClickURS('1')" label="1">已注册</el-radio>
            <el-radio v-model="form.userRegStatus" @click.native.prevent="radioClickURS('0')" label="0">未注册</el-radio>
          </div>
          <div>
            <span>配置时间：</span>
            <!-- >,<,<=,>= -->
            <el-select :disabled='form.userRegStatus==""||form.userRegStatus=="0"' v-model='form.regStartSymbol' class='fanwei' clearable>
              <el-option value='<' label='<'></el-option>
              <el-option value='>' label='>'></el-option>
              <el-option  value='<=' label='<='></el-option>
              <el-option  value='>=' label='>='></el-option>
            </el-select>
            <el-date-picker
              :disabled='form.userRegStatus==""||form.userRegStatus=="0"'
              v-model="form.regStartTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              :placeholder="form.userRegStatus==''?'请选择注册状态':'选择日期'">
            </el-date-picker>
            <el-radio-group :disabled='form.userRegStatus==""||form.userRegStatus=="0"' v-model="form.regConnectionSymbol" class='radioGroup'>
              <el-radio-button @click.native.prevent="radioClickaRS('1')"  label="1" value='1'>且</el-radio-button>
              <el-radio-button @click.native.prevent="radioClickaRS('2')"  label="2" value='2'>或</el-radio-button>
            </el-radio-group>
            <el-select :disabled='form.userRegStatus==""||form.userRegStatus=="0"' v-model='form.regEndSymbol' class='fanwei' clearable>
              <el-option value='<' label='<'></el-option>
              <el-option value='>' label='>'></el-option>
              <el-option  value='<=' label='<='></el-option>
              <el-option  value='>=' label='>='></el-option>
            </el-select>
            <el-date-picker
              :disabled='form.userRegStatus==""||form.userRegStatus=="0"'
              v-model="form.regEndTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              :placeholder="form.userRegStatus==''?'请选择注册状态':'选择日期'">
            </el-date-picker>
          </div>
        </div>
      </el-form-item>
      <el-form-item label='比财实名状态：'>
        <el-radio v-model="form.realNameStatus" @click.native.prevent="radioClickRNS('1')" label="1">已实名</el-radio>
        <el-radio v-model="form.realNameStatus" @click.native.prevent="radioClickRNS('0')" label="0">未实名</el-radio>
      </el-form-item>
      <el-form-item label='比财开户状态：'>
        <el-radio v-model="form.openAccountStatus" @click.native.prevent="radioClickOAC('1')"  label="1">已开户</el-radio>
        <el-radio v-model="form.openAccountStatus" @click.native.prevent="radioClickOAC('0')"  label="0">未开户</el-radio>
      </el-form-item>
     



      
      
      <h5>营销管理配置 <small style='color:red;display:inline'>(*以下条件至少配置一项)</small></h5>
      <el-form-item label='活动：' prop='activityIds'>
        <el-select v-model="form.activityIds" filterable multiple clearable placeholder="请选择活动">
          <el-option v-for='(item,index) in activityList' :key='index' :label="item.name" :value="item.id.toString()"></el-option>
        </el-select>
      </el-form-item>

      <h5>提示文案配置</h5>
      <el-form-item label='被监管提示文案配置:' prop='buyPromptText' class='inputClass'>
        <el-input v-model='form.buyPromptText' type='text' clearable></el-input>
      </el-form-item>
    </el-form>
    
    <div class='btnCon'>
      <el-button :size='size' :loading='saveLoading' @click='save' type='primary'>保存</el-button>
    </div>
  </div>
</template>
<script>
import {selectGet,ExternalLinkMCsave} from '../../../apis/index'
import prvCity from '../../../config/prvCity.json'
import axios from "axios"
export default {
  components:{},
  props:['formData','dialogVisible'],
  data () {
    // 注册时间 数据处理
    var RegTimeVal= (rule, value, callback) =>{
      let isOk=0
      this.form.regStartSymbol=this.form.regStartSymbol==null?"":this.form.regStartSymbol
      this.form.regStartTime=this.form.regStartTime==null?"":this.form.regStartTime
      this.form.regEndSymbol=this.form.regEndSymbol==null?"":this.form.regEndSymbol
      this.form.regEndTime=this.form.regEndTime==null?"":this.form.regEndTime
      this.form.regConnectionSymbol=this.form.regConnectionSymbol==null?"":this.form.regConnectionSymbol
      if ((this.form.regStartSymbol!=''&&this.form.regStartTime=="")||(this.form.regStartSymbol==''&&this.form.regStartTime!="")) {
        isOk='符号和日期需要同时填写'
      }
      if ((this.form.regEndSymbol!=''&&this.form.regEndTime=="")||(this.form.regEndSymbol==''&&this.form.regEndTime!="")) {
        isOk='符号和日期需要同时填写'
      }
      if ((this.form.regStartSymbol!=''&&this.form.regStartTime!="")&&(this.form.regEndSymbol!=''&&this.form.regEndTime!="")&&(this.form.regConnectionSymbol=="")) {
        isOk='请选择关联符号'
      }
      if ((this.form.regConnectionSymbol!="")&&(this.form.regStartSymbol==''||this.form.regStartTime==""||this.form.regEndSymbol==''||this.form.regEndTime=="")) {
        isOk='符号和日期不能为空'
      }

      if (isOk==0) {
        callback();
      } else {
        callback(new Error(isOk));
      }
    }
    // /省市数据处理
    var eareVlVal= (rule, value, callback) => {
      let isOk=0
      this.form.userRegionConditionList.forEach((i) => {
        if (i.province=='') {
          isOk='请选择省份'
        }
        if (i.province!=""&&i.gpsLocationCheck==''&&i.idCardAddressCheck==''&&i.regPhoneNumCheck=='') {
          isOk='请选择该地区限制条件'
        }
      })
      if (isOk==0) {
        callback();
      } else {
        callback(new Error(isOk));
      }
    }
    return {
      form: {
        activityIds:[], // 多个活动id
        activityNameList:[],//多个活动名称
        buyPromptText:"该产品本地已售罄，暂不支持购买此产品。",//被监管提示文案
        locationNotObtained:false,//配置未获取地理位置用户 1选中 0未选中
        buyStatus:'1',// 条件可见性  0不可见  1可见
        userRegStatus:'', // 用户注册状态1已经注册0注册
        regStartTime:"", //用户注册开始时间
        regStartSymbol:"", //注册时间条件的开始 可能的值有>,<,<=,>=
        regEndTime:"", //用户注册结束时间
        regEndSymbol:"", //用户注册结束符
        regConnectionSymbol:'', //注册开始时间连接符
        realNameStatus:'', // 实名状态
        openAccountStatus:"", // 开户状态
        userRegionConditionList:[ //地域限制
          {
            province:"",
            city:"",
            regPhoneNumCheck:"",
            idCardAddressCheck:"",
            gpsLocationCheck:"",
          }
        ],
      },
      contentsList:[],
      advList:[],
      activityList:[],
      saveLoading:false,
      size: 'small',
      prdshowList: [],
      cityList:[],
      prvList:[],
      StarttimeString:0,
      EndtimeString:0,
      rules: {
        buyStatus:[ 
          { required: true, message: '请选择可购买状态', trigger: 'change' },
        ],
        eareVl:[ 
          { required: true, validator: eareVlVal, trigger: 'change' }
        ],
        buyPromptText:[ 
          { required: true, message: '请填写被监管提示文案', trigger: 'change' },
        ],
        activityIds:[ 
          { required: true, message: '请选择活动', trigger: 'change' },
        ],
        RegTime:[ 
          { required: false, validator: RegTimeVal, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
  },
  watch: {
    dialogVisible(newVl,oldVl) {
      this.selectGetFun()
      if (newVl) {
        this.dataFun()
      } else {
        this.formData=this.form
      }
    }
  },
  mounted () {
  },
  created() {
    this.prvList=prvCity.provinces
    this.dataFun()
    this.selectGetFun()
    
  },
  mounted () {
    if (this.$route.query.id) {
    }
  },
  methods: {
     // 注册时间 取消选择
    radioClickaRS (e) {
      e === this.form.regConnectionSymbol? (this.form.regConnectionSymbol = ''):(this.form.regConnectionSymbol = e)
    },
    //处理数据
    dataFun () {
      if (this.formData!="") {
      this.formData=JSON.parse(this.formData)
        let actLocations=[]
        if (this.form.locationNotObtained=="1") {
          // 1选中 0未选中
          this.form.locationNotObtained=true
        } else {
          this.form.locationNotObtained=false
        }
        this.formData.userRegionConditionList.forEach((i) => {
          if (i.regPhoneNumCheck=='1') {
            i.regPhoneNumCheck=true
          } else {
            i.regPhoneNumCheck=false
          }

          if (i.idCardAddressCheck=='1') {
            i.idCardAddressCheck=true
          } else {
            i.idCardAddressCheck=false
          }
          if (i.gpsLocationCheck=='1') {
            i.gpsLocationCheck=true
          } else {
            i.gpsLocationCheck=false
          }
        })
        if (this.formData.activityIds  instanceof Array) {
          actLocations=this.formData.activityIds
        } else if (this.formData.activityIds.indexOf(",")<0&&this.formData.activityIds!="") {
          actLocations.push(this.formData.activityIds)
        } else if (this.formData.activityIds.indexOf(",")>=0) {
          actLocations=this.formData.activityIds.split(",")
        }
        this.formData.activityIds=actLocations
        console.log('this.formData.activityIds',this.formData.activityIds)
        this.form=this.formData

      } else {
        this.form= {
          activityIds:[],//多个活动
          buyPromptText:"该产品本地已售罄，暂不支持购买此产品。",//被监管提示文案
          locationNotObtained:false,//配置未获取地理位置用户 1选中 0未选中
          buyStatus:'1',// 条件可见性  0不可见  1可见
          userRegStatus:'', // 用户注册状态1已经注册0注册
          regStartTime:"", //用户注册开始时间
          regStartSymbol:"", //注册时间条件的开始 可能的值有>,<,<=,>=
          regEndTime:"", //用户注册结束时间
          regEndSymbol:"", //用户注册结束符
          regConnectionSymbol:'', //注册开始时间连接符
          realNameStatus:'', // 实名状态
          openAccountStatus:"", // 开户状态
          userRegionConditionList:[ //地域限制
            {
              province:"",
              city:"",
              regPhoneNumCheck:"",
              idCardAddressCheck:"",
              gpsLocationCheck:"",
            }
          ],
        }
      }
    },
    // 获取广告位，活动和内容
    selectGetFun () {
      selectGet().then((res) => {
        if (res.headerModel.code==0) {
          this.contentsList=res.datatypeParam.context
          this.advList=res.datatypeParam.adv
          this.activityList=res.datatypeParam.activity
          this.prdshowList=res.datatypeParam.prdshow
          if (this.formData=='') {
            let arr=[]
            this.activityList.forEach((i) => {
              arr.push(i.id.toString())
            })
            console.log('arr',arr)
            this.form.activityIds=arr
            console.log(this.form.activityIds)
          }
        }
        console.log(res)
      })
    },
    radioClickRNS (e) {
      e === this.form.realNameStatus? (this.form.realNameStatus = ''):(this.form.realNameStatus = e)
    },
    radioClickOAC (e) {
      e === this.form.openAccountStatus? (this.form.openAccountStatus = ''):(this.form.openAccountStatus = e)
    },
    radioClickURS (e) {
      e === this.form.userRegStatus? (this.form.userRegStatus = ''):(this.form.userRegStatus = e)
      if (e=='0') {
        this.form.regStartSymbol=''
        this.form.regStartTime=null
        this.form.regConnectionSymbol=''
        this.form.regEndSymbol=''
        this.form.regEndTime=null
      }
    },
    // 新增限制区域
    addArea () {
      let obj = {
        province:"",
        city:"",
        regPhoneNumCheck:"",
        idCardAddressCheck:"",
        gpsLocationCheck:"",
      }
      this.form.userRegionConditionList.push(obj)
    },
    // 删除限制区域
    delArea (index) {
      this.form.userRegionConditionList.splice(index,1)
    },
    // 通过省获取市
    changePrv (item,type) {
      if (type=='prv') {
        item.city=''
      }
      this.prvList.forEach((i) => {
        if (item.province==i.provinceName) {
          this.cityList=i.citys
        }
      })
    },
    // 提交
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let activityIdsString=JSON.stringify(this.form.activityIds)
          // 重新处理 限制地域数据
          this.form.productOrBank='1'
          this.form.userRegionConditionList.forEach((i) => {
            if (i.gpsLocationCheck) {
              i.gpsLocationCheck="1"
            } else {
              i.gpsLocationCheck='0'
            }

            if (i.idCardAddressCheck) {
              i.idCardAddressCheck="1"
            } else {
              i.idCardAddressCheck="0"
            }
            if (i.regPhoneNumCheck) {
              i.regPhoneNumCheck="1"
            } else {
              i.regPhoneNumCheck="0"
            }
          })
          if (this.form.locationNotObtained) {
            // 1选中 0未选中
            this.form.locationNotObtained="1"
          } else {
            this.form.locationNotObtained="0"
          }
          let activityNameList=[]
          this.form.activityIds.forEach((i) => {
            this.activityList.forEach((j) => {
              if (i==j.id) {
                activityNameList.push(j.name)
              }
            })
          })
          // console.log(this.form.activityIds)
          // console.log(this.form.activityNameList)
          this.form.activityIds=this.form.activityIds.toString()
          this.form.activityNameList=activityNameList
          let params= {
            headerModel:{
              systemType: 'h5',
              message:'新增或修改条件的配置的请求',
              requesttime:Date.parse(new Date()),
              version:"",
              token:"",
              deviceId:"",
              appFlag:"",
              loginUid:"",
            },
            datatypeParam: this.form
          }
          console.log('接口数据：：',this.form)
          ExternalLinkMCsave(params).then((res) => {
            console.log(res)
            if (res.headerModel.code==0) {
              this.form.id=res.datatypeParam.id
              this.form.condConnSymbol=1
              this.$emit('childFun',this.form)
            } else {
              //还原数据
              this.form.activityIds=JSON.parse(activityIdsString)
            }
          }).catch((error) => {
            //还原数据
            this.form.activityIds=JSON.parse(activityIdsString)
          })
          
        } else {
          this.$message.error("请完善信息")
        }
      })
    }
     
  }
}
</script>
<style lang="less" scoped>
.config {
  padding: 20px 40px 40px;
  .title {
    padding: 20px  0;
    border-bottom: 1px solid #ccc;
  }
  form {
    margin: 20px  auto 0;
  }
  h5 {
    margin-bottom: 20px;
    border-left: 6px solid #409EFF;
    padding-left: 10px;
  }
  .inputClass {
    /deep/ .el-input,/deep/ .el-date-editor,/deep/ .el-textarea__inner {
      width: 400px;
    }
  }
  
  .area,.ageDiv,.chicangfengzhi {
    display: flex;
    background: #f1f1f1;
    padding: 15px 20px;
    /deep/ .el-input {
      width: 120px;
    }
    /deep/ .el-select {
      width: 120px;
      margin-right: 20px;
    }
    /deep/ .el-checkbox-group {
      display: inline-block;
    }
    .el-icon-delete {
      font-size: 1.6em;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .chicangfengzhi, .ageDiv {
    background: #fff;
    padding: 0;
    .fanwei  {
      width: 80px!important;
      /deep/ .el-input {
        width: 80px!important;
        margin-right: 20px;
      }
      
    }
    
  }
  .staTime {
    background: #f1f1f1;
    padding: 15px 20px;
  }
  .addClass {
    width: 100%;
    border: 1px dashed #333;
    text-align: center;
    padding: 20px 0;
    span {
      cursor: pointer;
    }
  }
  .fanwei  {
    width: 100px;
    margin-right: 10px;
  }
  .radioGroup {
    margin: 0 10px;
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
}

</style>