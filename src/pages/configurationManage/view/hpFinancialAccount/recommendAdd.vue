<template>
    <section>

      <el-header style="background:rgb(250 250 250);height:40px;margin-bottom:25px">
        <el-page-header style="line-height:40px" :content="`${pageType}`" @back="cancleFrom()"></el-page-header>
      </el-header>

      <el-form :model="addFromData" :rules="rules" ref='addFromData' label-width="150px" :size="size">
        <el-form-item label="展现形式" prop="showType">
          <BcSelect @change="changeTap" v-model="addFromData.showType" :list="showType"></BcSelect>
          <!-- <BcSelect @change="changeTap" v-model="addFromData.showType" :disabled="isTypeDisabled" :list="showType"></BcSelect> -->
        </el-form-item>
        <!-- 上传图片 -->
        <el-form-item v-show="type == 2" label="广告图" prop="advImgUrl" :required="type == 2 ? true : false">
            <el-upload
					:model='imageUrl + addFromData.advImgUrl'
  					class="upload-demo"
					ref="upload1"
					action="#"
					:limit="limitNum"
					:on-exceed="exceedFile"
					:before-upload="beforeUploadFile"
					:http-request="uploadImg"
					:show-file-list="false"
					>
					<!-- <img v-if="addFromData.advImgUrl" :src="imageUrl + addFromData.advImgUrl" class="avatar"> -->
                    <el-image v-if="addFromData.advImgUrl" :src="imageUrl + addFromData.advImgUrl" class="avatar" fit="contain"></el-image>
                    <el-button v-else size="small" type="primary">点击上传</el-button>
					<span class="el-upload__tip" slot="tip">仅支持一张</span>
				</el-upload>
        </el-form-item>

        <el-form-item label="备注">
            <el-input v-model="addFromData.advImgMemo"></el-input>
        </el-form-item>

        <div v-show="type == 1">
            <el-form-item label="选择机构" prop="orgId" :required="type == 1 ? true : false">
                <BcSelect
                    @GetApiData="orgSelectData($event)"
                    v-model="addFromData.orgId"
                    :filterable="true"
                    @change="orgIdOnChange"
                    placeholder="请输入/选择机构"
                    :clearable="true">
                </BcSelect>
            </el-form-item>

            <el-form-item label="选择产品" prop="prdIndexId" :required="type == 1 ? true : false">
                <BcSelect
                    @GetApiData="orgProSelectData($event)"
                    :disabled="this.addFromData.orgId == '' ||  this.addFromData.orgId.id == null"
                    v-model="addFromData.prdIndexId"
                    :filterable="true"
                    placeholder="请选择产品，支持模糊查询（不填代表全部产品）"
                    :clearable="true"
                    >
                </BcSelect>
            </el-form-item>
        </div>

        <!-- 选项是否展示 -->
        <div v-show="type == 2">
            <el-form-item label="跳转类型" prop="contentType" :required="type == 2 ? true : false">
                <BcSelect
                    @GetApiData="JumpTap($event)"
                    @change="JumpTapChange"
                    v-model="addFromData.contentType"
                    placeholder="请选择跳转类型"
                    :clearable="true">
                 </BcSelect>
            </el-form-item>
            <el-form-item v-if="isProductType" label="跳转内容" prop="content" :required="type == 2 ? true : false">
                <!-- input -->
                <el-input v-model="addFromData.content" placeholder="请输入跳转内容" :disabled="this.addFromData.contentType == '' || this.addFromData.contentType.value == null"></el-input>
            </el-form-item>
            <el-form-item v-else label="跳转内容" prop="content" :required="type == 2 ? true : false">
                <!-- 下拉框 :key="addFromData.contentType.value" 根据跳转内容重载组件-->
                <BcSelect v-model="addFromData.content"
                    :disabled="this.addFromData.contentType == '' || this.addFromData.contentType.value == null"
                    @GetApiData="getOrgSelectData($event)"
                    :key="addFromData.contentType.value"
                    :filterable="true"
                    :remote="true"
                    :clearable="true"
                    placeholder="请输入跳转内容">
                </BcSelect>
            </el-form-item>
        </div>

        <el-form-item label="排序" prop="advOrder">
            <el-input v-model="addFromData.advOrder" type="number"></el-input>
        </el-form-item>

        <el-form-item label="可见用户" prop="advVisibleUesr">
            <BcSelect
                @GetApiData="advVisibleUesrChange"
                v-model="addFromData.advVisibleUesr"
                :list="advVisibleUesrList"
                :clearable="true"
                placeholder="请选择可见用户">
            </BcSelect>
        </el-form-item>

        <el-form-item label="监管沙盒">
            <el-input v-model="addFromData.sandboxId" placeholder="请输入产品ID"></el-input>
        </el-form-item>

        <el-form-item label="投放渠道" prop="appFlag">
            <!--  @GetApiData="appFlagChange" -->
            <BcSelect
                v-model="addFromData.appFlag"
                :list="appFlagList"
                :multiple="true"
                :clearable="true"
                placeholder="请选择投放渠道">
             </BcSelect>
        </el-form-item>

        <el-form-item label="发布设备" prop="advPlatform">
            <BcSelect v-model="addFromData.advPlatform" :list="advPlatformList" :multiple="true" :clearable="true" placeholder="请选择发布设备"></BcSelect>
        </el-form-item>

        <!-- 取消提交按钮 -->
        <div class="footer">
          <el-button :size="size" @click="cancleFrom('addFromData')">取消</el-button>
          <el-button :size="size" type="primary" @click="submitForm('addFromData')" :loading="loading">提交</el-button>
        </div>

      </el-form>

    </section>
</template>
<script>
import BcSelect from "../../components/BcSelect"
// 最新公共select组件
// import BcSelect from "@common/finsuit-components/BcSelect"
import config from '../../config/config.index.js'
export default {
    components:{
        BcSelect,
    },
    data(){

        //验证广告图片
        let validateadvImgUrl = (rule, value, callback) => {
            if (this.addFromData.advImgUrl === "" && this.type == 2) {
                callback(new Error("请选择广告图片"));

            } else {
                callback();
            }
        };

        // 验证选择机构
        let validateOrgId = (rule, value, callback) => {
            // 当选择机构名称为空值且为必填时，抛出错误，反之通过校验
            if (!this.id && this.addFromData.orgId === "" && this.type == 1){
                callback(new Error("请选择机构"));
            }else if(this.id && this.addFromData.orgId.id == null && this.type == 1){
                callback(new Error("请选择机构"));
            }else{
                callback();
            }
        };

        // 验证选择产品
        let validateprdIndexId = (rule, value, callback) => {
            if (!this.id && this.addFromData.prdIndexId === "" && this.type == 1){
                callback(new Error("请选择产品"));
            }else if(this.id && this.addFromData.prdIndexId.id == null && this.type == 1){
                callback(new Error("请选择产品"));
            }else{
                callback();
            }
        };

        //验证转跳类型
        let validatecontentType = (rule, value, callback) => {
            if (!this.id && this.addFromData.contentType === "" && this.type == 2){
                callback(new Error("请转跳类型"));
            }else if(this.id && this.addFromData.contentType.value == null && this.type == 2){
                callback(new Error("请转跳类型"));
            }else{
                callback();
            }
        };

        //验证跳转内容
        let validatecontent = (rule, value, callback) => {
            if (!this.id && this.addFromData.content === "" && this.type == 2){
                callback(new Error("请选择跳转内容"));
            }else if(this.id && this.addFromData.content.value === "" && this.type == 2){
                callback(new Error("请选择跳转内容"));
            }else if(this.id && this.addFromData.content === "" && this.type == 2){
                callback(new Error("请选择跳转内容"));
            }else{
                callback();
            }
        };

        //验证排序值是正整数
        let validateadvOrder =(rule, value, callback) => {
            // console.log("this.addFromData.advOrder",this.addFromData.advOrder)
            if (this.addFromData.advOrder==''){
                callback(new Error("请输入排序值"));
            } else if (isNaN(this.addFromData.advOrder)) {
                callback(new Error("请输入正确的排序值"));
            } else if (!(/^\d+$/.test(this.addFromData.advOrder))) {
                callback(new Error("请输入正确的排序值，只可为正整数"));
            } else if (this.addFromData.advOrder < 1) {
                callback(new Error("排序值应大于0"));
            }else {
                callback();
            }
        };

        return{
            id: '',
            imageUrl:'', //图片前面有域名的部分地址
            size:"small",
            pageType:"新增",
            saveLoading:false,
            isProductType:true,//true是input，false是选择框
            type: "1",//展现形式 ：1是产品，2是图片
            // isTypeDisabled:false,//展现形式是否可修改
            advVisibleUesrList:'',//可见用户
            // 新增/修改表单
            addFromData: {
                showType: {name: '产品',id: '1'},//展现形式
                advImgUrl:"",//广告图
                advImgMemo:"",//备注
                orgId: "",//选择机构
                prdIndexId: "",//选择产品
                contentType: "",//转跳类型
                contentTypeName: "",//转跳类型
                content:"",//跳转内容
                contentName: "",//跳转内容
                advOrder:"",//排序
                advVisibleUesr:"",//可见用户
                advVisibleUesrName:"",//可见用户
                sandboxId:"",//监管沙盒
                appFlag: [{name:"识贝比",id: 'BC'}],//投放渠道
                advPlatform: [{name: '安卓',id: 'android'},{name: '苹果',id: 'ios'},],//发布设备
            },

            //验证
            rules:{
                showType:[{ required: true, message: '请选择展现形式', trigger: 'change' }],
                advImgUrl:[{ validator: validateadvImgUrl, trigger: 'change' }],
                orgId:[{ validator: validateOrgId,trigger: 'change'}],
                prdIndexId:[{ validator: validateprdIndexId, trigger: 'change' }],
                contentType:[{ validator: validatecontentType, trigger: 'change' }],
                content:[{ validator: validatecontent, trigger: 'change' }],
                advOrder:[{ required: true, validator: validateadvOrder, trigger: 'change' }],
                advVisibleUesr:[{ required: true, message: '请选择可见用户', trigger: 'change' }],
                appFlag:[{ required: true, message: '请选择投放渠道', trigger: 'change' }],
                advPlatform:[{ required: true, message: '请选择发布设备', trigger: 'change' }],
            },

            showType: [
                {
                    name: '产品',
                    id: '1'
                },
                {
                    name: '图片',
                    id: '2'
                }
            ],

            appFlagList:[
                {
                    name:"识贝比",
                    id: 'BC'
                },
                {
                    name:"识贝拼",
                    id: 'PC'
                },
                {
                    name:"小程序",
                    id: 'PMP'
                },
                {
                    name:"异业",
                    id: 'YIYE'
                }
            ],

            advPlatformList:[
                {
                    name: '安卓',
                    id: 'android'
                },
                {
                    name: '苹果',
                    id: 'ios'
                },
            ],
        }
    },
    mounted(){
       let params = JSON.parse(decodeURIComponent(this.$route.query.data))
       if(params){
          this.id = params.id
          this.state = params.state
          this.pageType = params.id == '' ? "新增" : "修改" //获取url传过来的参数，id存在是修改，否则是新增
          //如果页面是修改，回显数据
          if(params.id != ""){
            // this.isTypeDisabled = true
            this.showList()
          }
       }
      //图片地址
       this.imageUrl = config.baseUrlHost+'/finsuitImgDisplay/show?path=';

    },
    methods:{

        //展示回传数据
        showList(){
            let param = {
                id:this.id,
            }
            this.$api.queryById(param).then(res =>{
                console.log("回显数据新接口",res)
                let data = res.success
                this.type = data.showType //展示形式
                this.addFromData.id = data.id
                this.addFromData.showType = this.showType.find(item =>{
                     return data.showType == item.id
                 })
                this.addFromData.advImgUrl = data.advImgUrl
                this.addFromData.advImgMemo = data.advImgMemo
                this.addFromData.orgId = {name:data.orgName,id:data.orgId}
                this.addFromData.prdIndexId = {name:data.prdIndexName,id:data.prdIndexId}
                this.addFromData.contentType = {name:data.contentTypeName,value:data.contentType}

                this.addFromData.advOrder = data.advOrder
                this.addFromData.advVisibleUesr = {name:data.advVisibleUesrName,value:data.advVisibleUesr}
                this.addFromData.sandboxId = data.sandboxId

                //数据回显，根据返回来的跳转类型，判断转跳内容 是input还是select
                this.isProductTypeEvent(this.addFromData.contentType)

                //跳转内容是select 回显需要对象
                this.addFromData.content = this.isProductType ? data.contentName : {name:data.contentName,value:data.content}

                //回显渠道
                let appFlagArr = data.appFlag.split(",")
                this.addFromData.appFlag = this.appFlagList.filter(item =>{
                    return appFlagArr.indexOf(item.id) != -1
                })
                //回显设备 在原始数组中匹配返回的字符串
                let advPlatformArr = data.advPlatform.split(",")
                this.addFromData.advPlatform = this.advPlatformList.filter(item =>{
                    return advPlatformArr.indexOf(item.id) != -1
                })
                console.log("回显数据新接口",this.addFromData)
            })
        },

        // 选择产品图片事件
        changeTap(value){
            this.type = value.id == 1 ? 1 : 2;
        },

        //获取机构下拉框数据
        async orgSelectData($event){
           let { query, callback } = $event;
           let params = {
                orgName :query.keywords
            }
           let data = await this.$api.selectOrgData(params).then(res => res.success || {});
           let listData = data.map(item =>{
               return{
                 id :item.id,
                 name:item.org_name
               }
           })
           callback({ list: listData, total: 0});
        },

        //机构ID下拉选项发生变化
        orgIdOnChange(value){
            // 机构变动时要清空产品信息
            this.addFromData.prdIndexId = "";
        },

        //获取产品数据 根据机构类型id,请求相对应产品
        async orgProSelectData($event){

           let { query, callback } = $event;
           let params = {
                orgId : this.addFromData.orgId.id,
                prdName:query.keywords
            }
           let data = await this.$api.selectProductData(params).then(res => res.success || {});
           let listData = data.map(item =>{
               return{
                 id :item.prdIndexId,
                 name:item.prdIndexName
               }
           })
           // 0 不展示分页
           callback({ list: listData, total: 0});
        },

        //可见用户 0:全部 1:登录用户 2:未登录用户 3:新用户 4:老用户 5:未注册的新设备',
        advVisibleUesrChange(){
           this.$api.getAvailableUser().then(res =>{
               this.advVisibleUesrList = res.data.availableUserList
           })
        },

        //投放渠道
        // async appFlagChange($event){

        //    let { query, callback } = $event;
        //    let data = await this.$api.appFlag().then(res => res.data.appFlagList || {});
        //    console.log("投放渠道",data)
        //    let listData = data.map(item =>{
        //        return{
        //          id: item.DIC_VALUE,
        //          name: item.DIC_NAME
        //        }
        //    })
        //    // 0 不展示分页
        //    callback({ list: listData, total: 0});
        // },


        //当获取焦点时获取转跳类型数据
        async JumpTap ($event) {
            let { query, callback } = $event;
            let data = await this.$api.getAvailableUser().then(res => res.data || {});
            // 0 不展示分页
            callback({ list: data.contentTypeList, total: 0 });
        },

        // 当change事件触发时获取转跳类型
        //跳转类型 1:链接 2:活动 3:产品 4:机构 5:资讯 6:建行链接地址 7:光大银行链接地址  8:登录',
        // 1 6 7 8时展示input,其余展示下拉框，可参考广告活动
        JumpTapChange(param){
            this.addFromData.content = "" //重新选择跳转类型时，跳转内容置空
            this.isProductTypeEvent(param)
        },

        //判断转跳内容 是input还是select
        isProductTypeEvent(param){
            this.isProductType = param.value == 1 || param.value == 6 || param.value == 7 || param.value == 8 ? true :false
        },

        // 当获取焦点时获取转跳内容类型
        async getOrgSelectData ($event) {
            let { query, callback } = $event;

            let params={
                pageNum: query.currentPage,
				pageSize:10,
				contentTypeId: this.addFromData.contentType.value,
                name: query.keywords,
			}
            // console.log("转跳内容params",params)
            let data = await this.$api.getContentByContentType(params).then(res => res.data || {});
            // console.log("转跳内容data",data)
            callback({ list: data.data, total: data.totalCount });
        },

        // 提交
        submitForm(addFromData) {
            this.$refs[addFromData].validate((valid) => {
                if (valid) {
                    console.log('submit!');
                    let advIdArray = this.addFromData.advPlatform.map(item =>{
                        return item.id
                    })
                    console.log("this.addFromData.appFlag",this.addFromData.appFlag)
                    let appFlagArray = this.addFromData.appFlag.map(item =>{
                        return item.id
                    })

                    let advImgUrl,orgId,prdIndexId,contentType,contentTypeName,content,contentName
                    //展现形式是产品,需要把广告图、跳转类型跳转内容数据清空
                    if(this.type == 1){
                        advImgUrl = ''
                        orgId = this.addFromData.orgId ? this.addFromData.orgId.id : '',
                        prdIndexId = this.addFromData.prdIndexId ? this.addFromData.prdIndexId.id :''
                        contentType = ''
                        contentTypeName = ''
                        content = ''
                        contentName = ''
                    }else if(this.type == 2){
                        //展现形式是图片,需要把选择机构、选择产品数据清空
                        advImgUrl = this.addFromData.advImgUrl
                        orgId = '',
                        prdIndexId = ''
                        contentType = this.addFromData.contentType ? this.addFromData.contentType.value : ''
                        contentTypeName = this.addFromData.contentType ? this.addFromData.contentType.name : ''
                        content = this.isProductType ? '' : this.addFromData.content.value
                        contentName = this.isProductType ? this.addFromData.content : this.addFromData.content.name
                    }

                    let params = {
                            id : this.id ? this.id : '',
                            showType: this.addFromData.showType.id,//展现形式
                            // advImgUrl:this.addFromData.advImgUrl,//广告图
                            advImgUrl: advImgUrl,//广告图
                            advImgMemo: this.addFromData.advImgMemo,//备注
                            // orgId: this.addFromData.orgId ? this.addFromData.orgId.id : '',//选择机构
                            // prdIndexId: this.addFromData.prdIndexId ? this.addFromData.prdIndexId.id :'',//选择产品
                            // contentType: this.addFromData.contentType ? this.addFromData.contentType.value : '',//转跳类型
                            // contentTypeName: this.addFromData.contentType ? this.addFromData.contentType.name : '',//转跳类型
                            // content: this.isProductType ? '' : this.addFromData.content.value,//跳转内容
                            // contentName: this.isProductType ? this.addFromData.content : this.addFromData.content.name,//跳转内容
                            orgId: orgId,//选择机构
                            prdIndexId: prdIndexId,//选择产品
                            contentType: contentType,//转跳类型
                            contentTypeName: contentTypeName,//转跳类型
                            content: content,//跳转内容
                            contentName: contentName,//跳转内容

                            advOrder: this.addFromData.advOrder,//排序
                            advVisibleUesr: this.addFromData.advVisibleUesr.value,//可见用户
                            advVisibleUesrName: this.addFromData.advVisibleUesr.name,//可见用户
                            sandboxId:this.addFromData.sandboxId,//监管沙盒
                            // appFlag: this.addFromData.appFlag.id,//投放渠道
                            appFlag: appFlagArray.join(),//投放渠道
                            advPlatform: advIdArray.join(),//发布设备
                    }
                    console.log("保存参数params",params);

                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.saveLoading = true

                            this.$api.getRecommendedSave(params).then((res) => {

                                let data = res.headerModel
                                if(data.code == '0'){
                                    this.saveLoading = false
                                    this.$message({ message: data.message, type: 'success' })
                                }else{
                                    this.saveLoading = false
                                    this.$message({ message: data.message, type: 'error' })
                                }
                                //提交成功返回上一页面 并刷新列表页
                                // this.$router.go(-1)
                                this.cancleFrom()
                            }).catch((err) => {
                                this.$message({ message: err, type: 'error' })
                            })
                        }).catch(() => {
                            this.$message({type: 'info',message: '已取消修改'});
                        });

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        //------------------上传图片------------------------
		// 文件超出个数限制时的钩子
		exceedFile(files, fileList) {
			this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
		},

        // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
		beforeUploadFile(file) {
			// console.log('before upload');
			// console.log(file);
			let extension = file.name.substring(file.name.lastIndexOf('.')+1);
			const isLt5M = file.size / 1024 / 1024 < 5;
			if(extension !== 'png') {
				this.$message.warning('只能上传后缀是.png的文件');
			}
			if (!isLt5M) {
				this.$message.error("请上传5M以下的图片");
				return false;
			}
		},

        //上传图片调接口--银行logo
		uploadImg(content) {
			const _file = content.file;//取需要上传的file值
			var formData = new FormData();
			formData.append('name', _file);
			this.$api.forUpload(formData).then((res) => {
				// console.log(res)
				if (res.result) {
					this.addFromData.advImgUrl = res.data[0]
					// this.imageUrlBank = `${this.$Config.aliyuncHost}${res.data[0]}`  //生产地址
					this.$refs.upload1.clearFiles()  //清空文件
				} else {
					this.$message.error(res.message);
				}
			}).catch((err) => {
				console.log("上传接口err",err);
				this.$message({ message: err, type: 'error' })
			})
		},

        //弹框取消按钮
		cancleFrom(addFromData){
            this.$router.push({ path: '/recommendProducts'});
            window.location.reload();
		},
    }
}
</script>
<style lang="less" scoped>
.el-form{
    margin: 0 auto;
    width: 700px;
}
/deep/ .el-form-item__content{
    width: 400px;
}
/deep/ .el-select{
    width: 100%;
}
.el-upload__tip{
    margin-left: 20px;
}
.footer{
    text-align: center;
}
</style>
