<template>
<!-- 新增/复制/修改 监管沙盒外链 银行-->
  <div class='addBank' v-loading="loading">
    <div>{{title}}</div>
    <el-form  :size='size' ref="form" :rules="rules" :model="form" label-width="160px">
      <el-form-item label='银行' prop='orgId'>
        <el-select v-model="form.orgId" @change='checkBank' filterable clearable placeholder="请选择">
          <span class='no'>平台已配置银行</span>
          <el-option
            v-for="item in platformConfigExistArr"
            :key="item.id"
            :label="item.orgName"
            :value="item.id">
          </el-option>
          <span class='ok'>平台未配置银行</span>
          <el-option
            v-for="item in platformConfigExistArrNO"
            :key="item.id"
            disabled
            :label="item.orgName"
            :value="item.id">
          </el-option>
        </el-select>
        <div class='tipTxtClass'>{{tipTxt}}</div>
      </el-form-item>
      <el-form-item label='银行产品' prop='prdIndexId'>
        <el-select :disabled='form.orgId==""' v-model="form.prdIndexId" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in bankProList"
            :key="item.id"
            :label="item.prdName+'-'+item.id"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label='生效时间' prop='times'>
        <el-date-picker
          v-model="form.times"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='配置条件'>
        <config-msg ref='configMsgData' @getconfigMsgData='getconfigMsgData'></config-msg>
      </el-form-item>
      <el-form-item prop='configMsg'></el-form-item>
      <el-form-item>
        <el-button :size='size' :loading='saveLoading' @click='save' type='primary'>提交</el-button>
        <el-button :size='size'  @click='cancle' >取消</el-button>
      </el-form-item>
    </el-form>
    <alert-pop @editOther='editOther' @editSelf='editSelf' :title='titlePOP' :content='content' v-if='showPop'></alert-pop>
  </div>
</template>
<script>
import configMsg from '../../../component/sandboxExternalLink/product/configMsg'
import alertPop from '../../../component/sandboxExternalLink/alertPOP'
import {ExternalLinkBankPrdselectOne,ExternalLinkBankPrdsave,org,bankPrd} from '../../../apis/index'
export default {
  components: {configMsg,alertPop},
  data () {
    var timesVl = (rule, value, callback) => {
      if (value==''||value==null) {
        callback(new Error("请选择时间"));
      } else if (value[0]==value[1]) {
        callback(new Error("结束时间不可早于或等于开始时间"));
      }  else {
        callback();
      }
    }
    var configMsgVal = (rule, value, callback) => {
      let isOk=0
      if (this.configMsgData.oneLevelUserCondition==undefined) {
        isOk="请配置限制条件"
      } else {
        if (this.configMsgData.oneLevelUserCondition.filter(a => a.dataType!='3' &&a.buyStatus!='').length==0) {
          isOk="请配置限制条件"
        }
        if (this.configMsgData.oneLevelUserCondition.filter(a => a.dataType!='3')[0].buyStatus==''){
          isOk="一级条件的第一项必填"
        }
        this.configMsgData.oneLevelUserCondition.filter(a => a.dataType!='3' &&a.buyStatus!='').forEach((i,index) => {
          let length=this.configMsgData.oneLevelUserCondition.filter(a => a.dataType!='3' &&a.buyStatus!='').length
          if (i.condConnSymbol==""||i.condConnSymbol==null&&index<length-1) {
            isOk='请选择二级条件之间的关系'
          }
        })
        this.configMsgData.twoLevelUserCondition.filter(a => a.dataType!='3' &&a.buyStatus!='').forEach((i,index) => {
          let length=this.configMsgData.twoLevelUserCondition.filter(a => a.dataType!='3' &&a.buyStatus!='').length
          if (i.condConnSymbol==""||i.condConnSymbol==null&&index<length-1) {
            isOk='请选择二级条件之间的关系'
          }
        })
       
      }
      if (isOk==0) {
        callback();
      } else {
        this.$message.error(isOk)
       callback(new Error(isOk));
      }
    }
    return {
      titlePOP:"",
      content:"",
      showPop:false,
      tipTxt:"",// 选择银行后  下面的提示文字
      bankProList:[],// 银行产品数据
      platformConfigExistArr:[], // 平台未配置银行
      platformConfigExistArrNO:[], // 平台已配置银行
      saveLoading:false,
      loading:false,
      configMsgData:{},
      form:{
        orgId:"",
        effectiveStartTime:null,
        effctiveEndTime:null,
        prdIndexId:"",
        times:null,
      },
      rules:{
        times:[ 
          { required: true, validator: timesVl, trigger: 'change' }
        ],
        orgId:[
          { required: true, message: '请选择银行', trigger: 'change' }
        ],
        prdIndexId:[
          { required: true, message: '请选择银行产品', trigger: 'change' }
        ],
        configMsg:[
          { required: true, validator: configMsgVal, trigger: 'change' }
        ],
      },
      StarttimeString:0,
      EndtimeString:0,
      oldMsg:"",
      oldMsgConfig:""
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    },
    title() {
      return `${this.$route.query.name}产品外链配置`
    },
    // configMsgData(){
    //   return this.$refs.configMsg
    // }
  },
  
  created () {
    this.$route.meta.title=`${this.$route.query.name}产品外链配置`
    if (this.$route.query.id) {
      this.BankPrdselectOneFun()
    } else {
      this.oldMsg=JSON.stringify(this.form)
      this.oldMsgConfig=JSON.stringify({
        oneLevelUserCondition:[],
        twoLevelUserCondition:[],
        oneAndTwoLevelSymbol:2
      })
    }
    this.orgFun()
  },
  mounted () {
   
  },
  methods: {
    // 选择银行
    checkBank (value) {
      this.form.prdIndexId=''
      let params= {
        headerModel:{
          systemType: 'h5',
          message:'查询产品请求',
          requesttime:Date.parse(new Date()),
          version:"",
          token:"",
          deviceId:"",
          appFlag:"",
          loginUid:"",
        },
        datatypeParam:{
          orgId:value
        }
      }
      if (value=='') {
        this.tipTxt=''
        this.form.prdIndexId=''
        this.bankProList=[]
      } else {
        bankPrd(params).then((res) => {
          if (res.headerModel.code==0) {
            this.bankProList=res.datatypeParam
          }
        })
        this.platformConfigExistArr.forEach((i) => {
          if (value==i.id) {
            if (i.internalOrgConfigExist==1) { //0是没有规则，1是有规则
              this.tipTxt='请注意：已对银行设置用户营销规则'
            } else {
              this.tipTxt=''
            }
          }
        })
      }
    },
    // 获取子组件的数据
    getconfigMsgData (msg) {
      console.log("删除后去东湖",msg)
      this.configMsgData=msg
      this.sumFun()
    },
    // 一二级关系 判断方法
    // 1、分为一级条件、二级条件。一级条件最多2个，一级条件可由n个二级组合。当一级条件配置的可见状态不一致时默认逻辑关系为或，此时逻辑关系且为置灰不可选状态；当配置的条件的可见状态一致时逻辑关系可选择且/或。
    // 2、一级、二级条件的关系可以随意切换。但每个一级下的二级关系切换后必须保持一致。当二级条件配置的可见状态不一致时默认逻辑关系为或，此时逻辑关系且为置灰不可选状态；当配置的条件的可见状态一致时逻辑关系可选择且/或，二级条件内部都是“且”的关系。
    sumFun () {
      // let isSame=0 // 配置的可见状态相同
      let isSame=0 // 一级配置的可见状态相同
      let oneisSame=0 // 一级配置的可见状态相同
      let twoisSame=0 // 一级配置的可见状态相同
      this.configMsgData.twoDisableRadio=false
      this.configMsgData.oneDisableRadio=false
      
      this.configMsgData.oneLevelUserCondition.filter(a => a.dataType!='3' &&a.buyStatus!='').forEach((i) => {
        if (this.configMsgData.twoLevelUserCondition.filter(i => i.dataType!='3'&&i.buyStatus!='' ).length==1&&this.configMsgData.twoLevelUserCondition.filter(i => i.dataType!='3' &&i.buyStatus!='')[0].buyStatus=='') {
          this.$refs.configMsgData.disabledRadio2=false
        } else {
          
          this.configMsgData.twoLevelUserCondition.filter(b => b.dataType!='3'&&b.buyStatus!='' ).forEach((j) => {
            // debugger
            if (i.buyStatus!=j.buyStatus) {
              isSame=1  // 配置的可见状态不相同
            }
            if (this.configMsgData.twoLevelUserCondition.filter(i => i.dataType!='3'&&i.buyStatus!='' ).length>1) {
              let buyStatus=this.configMsgData.twoLevelUserCondition.filter(i => i.dataType!='3'&&i.buyStatus!='' )[0].buyStatus
              if (j.buyStatus!=buyStatus) {
                twoisSame=1
              }
              console.log('twoisSame',twoisSame)
              if (twoisSame==1) {
                this.configMsgData.twoLevelUserCondition.filter(i => i.dataType!='3'&&i.buyStatus!='' ).forEach((k) => {
                  k.condConnSymbol=2
                  console.log('k::',k)
                })
                this.$refs.configMsgData.twoDisableRadio=true
              } else {
                j.condConnSymbol=j.condConnSymbol
                this.$refs.configMsgData.twoDisableRadio=false
              }
            } else {
              j.condConnSymbol=j.condConnSymbol
              this.$refs.configMsgData.twoDisableRadio=false
            }
          })
        }


        if (this.configMsgData.oneLevelUserCondition.filter(i => i.dataType!='3'&&i.buyStatus!='' ).length>1) {
          let buyStatus=this.configMsgData.oneLevelUserCondition.filter(i => i.dataType!='3'&&i.buyStatus!='' )[0].buyStatus
          if (i.buyStatus!=buyStatus) {
            oneisSame=1
          }
          if (oneisSame==1) {
            this.configMsgData.oneLevelUserCondition.filter(i => i.dataType!='3'&&i.buyStatus!='' ).forEach((k) => {
              k.condConnSymbol=2
            })
            this.$refs.configMsgData.oneDisableRadio=true
          } else {
            i.condConnSymbol=i.condConnSymbol
            this.$refs.configMsgData.oneDisableRadio=false
          }
        } else {
          i.condConnSymbol=i.condConnSymbol
          this.$refs.configMsgData.oneDisableRadio=false
        }
      })
      if (isSame==1) {
        this.$refs.configMsgData.oneAndTwoLevelSymbol=2
        this.$refs.configMsgData.disabledRadio2=true
      } else {
        this.$refs.configMsgData.disabledRadio2=false
      }
      this.$forceUpdate()
    },
    // 查询银行机构
    orgFun () {
      org().then((res) => {
        console.log(res)
        if (res.headerModel.code==0) {
          let orgs=res.datatypeParam
          let platformConfigExistArr=[]
          let platformConfigExistArrNO=[]
          orgs.forEach(i => {
            if (i.platformConfigExist==1) {
              platformConfigExistArr.push(i)
            } else {
              platformConfigExistArrNO.push(i)
            }
          });
          this.platformConfigExistArr=platformConfigExistArr
          this.platformConfigExistArrNO=platformConfigExistArrNO
        }
      })
    },
    // 获取详情
    BankPrdselectOneFun () {
      this.loading=true
      let params= {
        headerModel:{
          systemType: 'h5',
          message:'单个查询产品或银行的配置',
          requesttime:Date.parse(new Date()),
          version:"",
          token:"",
          deviceId:"",
          appFlag:"",
          loginUid:"",
        },
        datatypeParam:{
          id:this.$route.query.id,
          productOrBank:'1', //1产品2银行
        }
      }
      ExternalLinkBankPrdselectOne(params).then((res) => {
        this.loading=false
        if (res.headerModel.code==0) {
          this.checkBank(res.datatypeParam.orgId)
          this.form.times=[res.datatypeParam.effectiveStartTime,res.datatypeParam.effctiveEndTime]
          this.form.orgId=res.datatypeParam.orgId
           this.form.prdIndexId=res.datatypeParam.prdIndexId
          this.form.effctiveEndTime=res.datatypeParam.effctiveEndTime
          this.form.effectiveStartTime=res.datatypeParam.effectiveStartTime
          this.oldMsg=JSON.stringify(this.form)
          this.oldMsgConfig=JSON.stringify({
            oneLevelUserCondition:res.datatypeParam.oneLevelUserCondition,
            twoLevelUserCondition:res.datatypeParam.twoLevelUserCondition,
            oneAndTwoLevelSymbol:res.datatypeParam.oneAndTwoLevelSymbol
          })
          if (this.$route.query.name=='复制') {
            this.form.orgId=''
            this.form.prdIndexId=''
            this.tipTxt=''
            this.form.times=null
          }
        }
      }).catch((error) => {
        this.loading=false
      })
    },
    // 获取开始时间
    changeStarttime (value) {
      this.StarttimeString=Date.parse(new Date(value))
    },
    // 获取结束时间
    changeEndtime (value) {
      this.EndtimeString=Date.parse(new Date(value))
    },
    // 取消
    cancle () {
      let newMsgConfig = JSON.stringify({
        oneLevelUserCondition:this.configMsgData.oneLevelUserCondition,
        twoLevelUserCondition:this.configMsgData.twoLevelUserCondition,
        oneAndTwoLevelSymbol:this.configMsgData.oneAndTwoLevelSymbol
      })
      if (this.oldMsg!=JSON.stringify(this.form)||newMsgConfig!=this.oldMsgConfig) {
        this.$confirm('还要继续吗？', '现在取消已编辑的内容将无法保存', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
          showClose:false
        }).then(() => {
      this.$router.push('/sandboxExternalLink/productList')
        }).catch(() => {
         
        });
      } else {
      this.$router.push('/sandboxExternalLink/productList')
      }
    },
    // /提交
    save () {
      let arr1 =[]
      let arr2 =[]
      console.log(this.configMsgData.oneLevelUserCondition)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.configMsgData.oneLevelUserCondition.forEach(element => {
            if (element.id) {
              let obj = {
                id:element.id,
                condConnSymbol:element.condConnSymbol,
                dataType:element.dataType?element.dataType:undefined
              }
              arr1.push(obj)
            }
          });
          this.configMsgData.twoLevelUserCondition.forEach(element => {
            if (element.id) {
              let obj = {
                id:element.id,
                condConnSymbol:element.condConnSymbol,
                dataType:element.dataType?element.dataType:undefined
              }
              arr2.push(obj)
            }
            
          });
          let params={
            headerModel:{
              systemType: 'h5',
              message:'保存或更新主表数据',
              requesttime:Date.parse(new Date()),
              version:"",
              token:"",
              deviceId:"",
              appFlag:"",
              loginUid:"",
            },
            datatypeParam:{
              oneLevelUserCondition:arr1,
              twoLevelUserCondition:arr2,
              productOrBank:"1",
              orgId:this.form.orgId,
              prdIndexId:this.form.prdIndexId,
              effectiveStartTime:this.form.times[0],
              effctiveEndTime:this.form.times[1],
              oneAndTwoLevelSymbol: this.configMsgData.oneAndTwoLevelSymbol,
              id:this.$route.query.name=='修改'?this.$route.query.id:undefined
            }
          }
          this.saveLoading=true
          // return
          ExternalLinkBankPrdsave(params).then((res) => {
            console.log('res',res)
            if (res.datatypeParam.success) {
              this.$router.push('/sandboxExternalLink/productList')
            } else {
              if (res.datatypeParam.executionList.length>0) {
                this.showPop=true
                this.content=res.datatypeParam.executionList
                this.titlePOP='本条规则与以下规则生效时间冲突，请修改'
              } else {
                this.$message.error('银行或产品规则可能存在请修改后重新提交');
              }
            }
            this.saveLoading=false
          }).catch((error) => {
            this.$message.error('接口错误');
            this.saveLoading=false
          })
        } else {
          this.$message.error('请完善信息');
        }
      })
    },
    editSelf () {
      this.showPop=false
    },
    editOther () {
      this.$router.push('/bank/bankList')
    }
  }
}
</script>
<style lang="less" scoped>
.tipTxtClass {
  font-size: 10px;
  color: red;
  line-height: 1.5;
}
.addBank {
  height: 100%;
  overflow: auto;
  padding: 40px;
  .timeClass {
    display: flex;
    .top {
      margin: 0 10px;
    }
  }
  form {
    // width: 800px;
    margin: 0 auto;
  }
  .btnCon {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .plateformSearch  {
    .plateformClass {
      >div {display: flex;}
      .label {
        margin-right: 15px;
      }
    }
    .btnCon {
      display: flex;
      // flex-direction: ;
    }
  }
  
}
.endTimeForm {
  /deep/ .el-form-item__content {
    margin-left: 0!important;
  }
}
.ok,.no {
  padding: 2px 20px;
  font-size: 10px;
  width: 100%;
  display: inline-block;
  background: #ccc;
  box-sizing: border-box;
}
</style>