<template>
<!-- 新增/修改 手机号白名单-->
  <div class='addShare' v-loading='loading'>
    <!-- 编辑 -->
    <el-form :size='size' ref="form" :rules="rules" :model="form" label-width="170px">
      <el-form-item label='人员信息：' prop='phoneNum'>
        <el-form-item label="手机号：" class='phoneNUM' label-width="80px">
            <el-input disabled v-model='form.phoneNum' placeholder="请输入"></el-input>
          </el-form-item>
      </el-form-item>
      <el-form-item label='人员身份设置：' prop='internalOrExternalPeople'>
        <el-radio v-model="form.internalOrExternalPeople" label="1">内部人员</el-radio>
        <el-radio v-model="form.internalOrExternalPeople" label="2">外部人员</el-radio>
      </el-form-item>
      <el-form-item v-if='form.internalOrExternalPeople=="2"' class='plateformSearch' label='屏蔽渠道：' prop="platform">
        <div class='plateformClass'>
          <div>
            <div class='label'>内部渠道</div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 0 15px;"></div>
            <el-checkbox-group v-model="form.internalAppFlags" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city.value" :value='city.label' :key="city.value">{{city.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        
          <div>
            <div class='label'>外部渠道</div>
            <el-checkbox disabled :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
            <div style="margin: 0 15px;"></div>
            <el-checkbox-group disabled v-model="form.externalAppFlagS" @change="handleCheckedCitiesChange1">
              <el-checkbox v-for="city in cities1" :label="city.value" :value='city.label' :key="city.value">{{city.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if='form.internalOrExternalPeople=="2"' label='银行：'>
        <el-select v-model="form.orgId" class='scrollSelect'  multiple filterable clearable placeholder="请选择">
          <el-option
            v-for="item in orgs"
            :key="item.id"
            :label="item.orgName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='form.internalOrExternalPeople=="2"' label='银行产品：'>
       <el-select  multiple no-match-text='' class='scrollSelect' clearable  v-model="form.prdName" filterable remote :remote-method="searchPro" placeholder="请选择">
          <div>
            <el-option
            v-for="item in prdList"
            :key="item.id"
            :label="item.prdName+'-'+item.id"
            :value="item.prdName+'-'+item.id">
            </el-option>
          </div>
          <div style='text-align:center'>
            <el-button :disabled='pageParams1.pageNum<=1' :size='size' type="text"  @click.stop="prevPage">上一页</el-button>
            <el-button  :disabled='pageParams1.pageNum>=pageParams1.totalPage' :size='size' type="text"  @click.stop="nextPage">下一页</el-button>
            <span style='color:#ccc;font-size:12px'>当前页{{pageParams1.pageNum}}</span>
            <span style='color:#ccc;font-size:12px'>总页数{{pageParams1.totalPage}}</span>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :size='size' :loading='saveLoading' @click='save' type='primary'>提交</el-button>
        <el-button :size='size'  @click='cancle' >取消</el-button>
      </el-form-item>
    </el-form>
    <alert-pop @sureChild='sureChild' :title1='title1' :type1='type1'  :content='content' v-if='popShow'></alert-pop>
  </div>
</template>
<script>
import alertPop from './alertPOP'
import {Whitelistsave,WhitelistselectOne,org,prdindexall,Whitelistcheck} from '../../apis/index'
import prvCity from '../../config/prvCity.json'
import XLSX from 'xlsx'
const cityOptions = [
  {
    value: 'BC',
    label: '比财APP'
  },
  {
    value: 'PC',
    label: '拼财APP'
  },
  {
    value: 'PMP',
    label: '拼财小程序'
  }
  ];
const cityOptions1 = [
  {
    value: 'YY',
    label: '异业'
  },
  {
    value: 'TY',
    label: '同业'
  },
  {
    value: 'ZT',
    label: '直投'
  }
];
export default {
  components:{alertPop},
  data () {
    // 银行和产品
    var bankAndProductVal =(rule, value, callback) => {
      if (this.form.orgId.length==0&&this.ids.length==0) {
        callback(new Error('银行和银行产品至少选择一项'));
      } else {
        callback()
      }
    }
    // 渠道  目前为默认值
    var platformVal = (rule, value, callback) => {
      if (this.form.internalAppFlags.length==0) {
        callback(new Error('请选择内部渠道'));
      } else {
        callback();
      }
    }

    // /省市数据处理
    var eareVlVal= (rule, value, callback) => {
      let isOk=0
      this.form.userRegionList.forEach((i) => {
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
      disabledSave:true,
      loading:false,
      popShow:false,
      fileContent:"",
      prdList:[],
      proName:"",
      pageParams1: {
        totalPage:0,
        pageNum:1,
        pageSize:10
      },
      cityList:[],
      prvList:[],
      orgs:[], // 银行
      checkAll: true,
      cities: cityOptions,
      isIndeterminate: true,
      checkAll1: false,
      cities1: cityOptions1,
      isIndeterminate1: false,
      saveLoading:false,
      importPhoneNums:[],//批量导入手机号
      form:{
        phoneNum:'', // 多个手机号
        orgId:[],
        prdIndexId:[],
        prdName:[],
        internalAppFlags:[],
        externalAppFlags: [],
        id:"",
        internalOrExternalPeople:""
      },
      rules:{
        platform:[ 
          { required: true, validator: platformVal, trigger: 'change' }
        ],
        bankAndProduct:[ 
          { required: true, validator: bankAndProductVal, trigger: 'change' }
        ],
        eareVl:[ 
          { required: false, validator: eareVlVal, trigger: 'change' }
        ],
      },
      oldMsg:"",
      title1:"",
      content:"",
      type1:""
    }
  },
  computed: {
    type() {
      return this.$route.query.type
    },
    title() {
      return `${this.$route.query.name}手机号白名单`
    },
    ids () {
      let ids=[]
      this.form.prdName.forEach((i) =>{
        ids.push(i.split('-').pop())
      })
      return ids
    }
  },
  async created () {
    this.prvList=prvCity.provinces
    this.$route.meta.title=`${this.$route.query.name}手机号白名单`
    if (JSON.parse(sessionStorage.getItem('orgs'))) {
      this.orgs=JSON.parse(sessionStorage.getItem('orgs'))
    } else {
      this.orgsFun()
    }
    this.selectOneFun()
  },
  mounted () {
   
  },
  methods: {

    // 新增限制区域
    addArea () {
      let obj = {
        province:"",
        city:"",
        regPhoneNumCheck:"",
        idCardAddressCheck:"",
        gpsLocationCheck:"",
      }
      this.form.userRegionList.push(obj)
    },
    // 删除限制区域
    delArea (index) {
      this.form.userRegionList.splice(index,1)
    },
    // 通过省获取市
    changePrv (item) {
      console.log('44')
      console.log(item)
      // if (value)
      if (item.province=='') {
        item.city=''
      }
      this.prvList.forEach((i) => {
        if (item.province==i.provinceName) {
          this.cityList=i.citys
        }
      })
    },
    //处理数据
    dataFun () {
      
    },
    // 搜索产品数据
    searchPro(query) {
      this.proName=query
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
          currentPage: this.pageParams1.pageNum,
          searchName:this.proName
        }
      }
      prdindexall(params).then((res) =>{
        if (res.headerModel.code==0) {
          this.prdList = res.datatypeParam.retList
          this.pageParams1.totalPage= res.datatypeParam.totalPage
        }
      })
    },
    // 广告内容上一页
    prevPage () {
      if (this.pageParams1.pageNum<=1) {
        this.pageParams1.pageNum=1
      } else {
        this.pageParams1.pageNum-=1
      }
      this.searchPro(this.proName)
    },
    // 广告内容下一页
    nextPage () {
      if (this.pageParams1.pageNum>=this.pageParams1.totalPage) {
        this.pageParams1.pageNum=this.pageParams1.totalPage
      } else {
        this.pageParams1.pageNum+=1
      }
      this.searchPro(this.proName)
    },
    // 获取银行数据
    orgsFun () {
      org().then((res) =>{
        if (res.headerModel.code==0) {
          this.orgs=res.datatypeParam
        }
      })
    },
    // 删除手动新加 手机号数据
    deleteFun (index) {
      this.form.phoneNums.splice(index,1)
    },
    deleteimportFun (e) {
      e.target.parentNode.parentNode.remove()
    },
    // 查询详情
    selectOneFun () {
      let params= {
        headerModel:{
          systemType: 'h5',
          message:'单个白名单查询',
          requesttime:Date.parse(new Date()),
          version:"",
          token:"",
          deviceId:"",
          appFlag:"",
          loginUid:"",
        },
        datatypeParam:{
          id:this.$route.query.id
        }
      }
      WhitelistselectOne(params).then((res) => {
        console.log(res)
        if (res.headerModel.code==0) {
          this.proName=res.datatypeParam.prdIndexName==null?"":res.datatypeParam.prdIndexName
          this.form.phoneNum=res.datatypeParam.phoneNum
         if (res.datatypeParam.internalOrExternalPeople=='1') {
           this.form.orgId=[]
           this.form.prdName=[]
           
           this.form.externalAppFlags=[]
           this.handleCheckAllChange()
           this.form.internalAppFlags=['BC','PC','PMP']
           this.form.internalOrExternalPeople='1'
         } else {
           this.form.internalOrExternalPeople='2'
           if (res.datatypeParam.orgId==null||res.datatypeParam.orgId=='') {
             this.form.orgId=[]
           } else {
             this.form.orgId.push(res.datatypeParam.orgId)
           }
           if (res.datatypeParam.prdIndexId==null||res.datatypeParam.prdIndexId=='') {
             this.form.prdName=[]
           } else {
             this.form.prdName.push(res.datatypeParam.prdIndexName+"-"+res.datatypeParam.prdIndexId)
           }
          if (res.datatypeParam.appFlag==''&&res.datatypeParam.appFlag==null) {
            this.form.internalAppFlags=[]
          } else if (res.datatypeParam.appFlag.indexOf(",")<0) {
            this.form.internalAppFlags.push(res.datatypeParam.appFlag)
          } else {
            this.form.internalAppFlags=res.datatypeParam.appFlag.split(',')
          }
         }
          this.searchPro(this.proName)
          this.oldMsg=JSON.stringify(this.form)
        } else {
          this.$message.error(res.headerModel.message);
        }
      }).catch((error) => {
        this.$message.error('查询失败');
      })
    },
    // 内部渠道多选
    handleCheckAllChange(val) {
      let all =[]
      if (val) {
        cityOptions.filter((i) =>{
          all.push(i.value)
        })
      }
      this.form.internalAppFlags = val ? all : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
     // 外部渠道多选
    handleCheckAllChange1(val) {
      let all =[]
      if (val) {
        cityOptions.filter((i) =>{
          all.push(i.value)
        })
      }
      this.searchForm.externalAppFlags = val ? all : [];
      this.isIndeterminate1 = false;
    },
    handleCheckedCitiesChange1(value) {
      let checkedCount1 = value.length;
      this.checkAll1 = checkedCount1 === this.cities1.length;
      this.isIndeterminate1 = checkedCount1 > 0 && checkedCount1 < this.cities1.length;
    },
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading=true
          console.log(555)
          this.saveLoading=true
          let params= {
            headerModel:{
              systemType: 'h5',
              message:'保存白名单',
              requesttime:Date.parse(new Date()),
              version:"",
              token:"",
              deviceId:"",
              appFlag:"",
              loginUid:"",
            },
            datatypeParam:{
              phoneNums:this.form.phoneNum,
              internalAppFlags:this.form.internalOrExternalPeople=='1'?"":this.form.internalAppFlags.toString(),
              externalAppFlags:this.form.internalOrExternalPeople=='1'?"":this.form.externalAppFlags.toString(),
              orgIds:this.form.internalOrExternalPeople=='1'?"":this.form.orgId.toString(),
              prdIndexIds:this.form.internalOrExternalPeople=='1'?"":this.ids.toString(),
              id: this.$route.query.id,
              internalOrExternalPeople:this.form.internalOrExternalPeople
            }
          }
          Whitelistcheck(params).then((res) => {
            this.loading=false
            if (res.datatypeParam.nonConfig.listData.length==0&&res.datatypeParam.phone.listData.length==0) {
              Whitelistsave(params).then((res) => {
                this.loading=false
                this.saveLoading=false
                if (res.headerModel.code==0) {
                  this.$router.push('/whiteList')
                } else {
                  this.$message.error(res.headerModel.message);
                }
              })
            } else {
              if (res.datatypeParam.nonConfig.listData.length>0&&res.datatypeParam.phone.listData.length==0) {
                this.popShow=true
                this.content=res.datatypeParam.nonConfig.listData
                this.type1="2"
                this.title1='选择的以下银行或产品未设置沙盒监管，请确认'
              }
              if (res.datatypeParam.phone.listData.length>0&&res.datatypeParam.nonConfig.listData.length==0) {
                this.popShow=true
                this.content=res.datatypeParam.phone.listData
                this.type1='1'
                this.title1='以下手机号白名单存在重复配置，提交成功后数据将自动合并'
              }
              if (res.datatypeParam.nonConfig.listData.length>0&&res.datatypeParam.phone.listData.length>0) {
                this.popShow=true
                this.type1="3"
                this.content=[res.datatypeParam.phone.listData,res.datatypeParam.nonConfig.listData]
                this.title1='以下手机号存在重复，数据将自动合并；银行或产品未设置沙盒监管，请确认'
              }
            }
          }).catch((error) => {
            this.loading=false
            this.saveLoading=false
          })
        } else {
          console.log(valid)
        }
      })
    },
    sureChild () {
      let params= {
        headerModel:{
          systemType: 'h5',
          message:'保存白名单',
          requesttime:Date.parse(new Date()),
          version:"",
          token:"",
          deviceId:"",
          appFlag:"",
          loginUid:"",
        },
        datatypeParam:{
          phoneNums:this.form.phoneNum,
          internalAppFlags:this.form.internalOrExternalPeople=='1'?"":this.form.internalAppFlags.toString(),
          externalAppFlags:this.form.internalOrExternalPeople=='1'?"":this.form.externalAppFlags.toString(),
          orgIds:this.form.internalOrExternalPeople=='1'?"":this.form.orgId.toString(),
          prdIndexIds:this.form.internalOrExternalPeople=='1'?"":this.ids.toString(),
          id: this.$route.query.id,
          internalOrExternalPeople:this.form.internalOrExternalPeople
        }
      }
      Whitelistsave(params).then((res) => {
        this.loading=false
        this.saveLoading=false
        if (res.headerModel.code==0) {
          this.$router.push('/whiteList')
        } else {
          this.$message.error(res.headerModel.message);
        }
      })
    },
    // 取消
    cancle () {
      if (this.oldMsg!=JSON.stringify(this.form)) {
        this.$confirm('还要继续吗？', '现在取消已编辑的内容将无法保存', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
          showClose:false
        }).then(() => {
          this.$router.push('/whiteList')
        }).catch(() => {
         
        });
      } else {
        this.$router.push('/whiteList')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.addONe {
  margin-right: 20px;
}
.phoneNUM {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 20px 0;
  border-radius: 14px;
}
.el-icon-delete {
  font-size: 1.6em;
  margin-left: 20px;
  cursor: pointer;
}
.addShare {
  height: 100%;
  overflow: auto;
  padding: 40px;
  form {
    width: 800px;
    margin: 0 auto;
    /deep/ .el-input {
      width: max-content;
    }
    .scrollSelect  {
      max-height: 100px;
      min-width: 400px;
      overflow-y: auto;
      /deep/ .el-input {
        width: 100%;
      }
    }
    .area {
      display: flex;
      background: #f1f1f1;
      padding: 15px 20px;
      width: 900px;
      /deep/ .el-input {
        width: max-content;
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
  }
  .btnCon {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .bankClass {
    display: flex;
    >div {
      display: flex;
      margin-right: 30px;
    }
  }
  .plateformSearch  {
    .plateformClass {
      >div {
        display: flex;
      }
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
// /deep/ .el-scrollbar__wrap {
.ok,.no {
  padding: 2px 20px;
  font-size: 10px;
  width: 100%;
  display: inline-block;
  background: #ccc;
  box-sizing: border-box;
}
// }

</style>