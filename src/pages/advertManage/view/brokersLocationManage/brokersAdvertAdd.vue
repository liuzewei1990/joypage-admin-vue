<template>
    <section>

      <el-header style="background:rgb(250 250 250);height:40px;margin-bottom:25px">
        <el-page-header style="line-height:40px" :content="`${pageType}`" @back="cancleFrom()"></el-page-header>
      </el-header>

      <el-form :model="addFromData" :rules="rules" ref='addFromData' label-width="150px" :size="size">
        <el-form-item label="别名" prop="advertisingAlias">
          <el-input v-model="addFromData.advertisingAlias"></el-input>
        </el-form-item>

        <!-- 上传图片 -->
        <el-form-item label="广告图" prop="advImgUrl">
            <!-- <uploadImg v-model="addFromData.advImgUrl" @GetApiData="imgDataApi" :imageUrl="imageUrl"></uploadImg> -->
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
                    <el-image v-if="addFromData.advImgUrl" :src="imageUrl + addFromData.advImgUrl" class="avatar" fit="contain"></el-image>
                    <el-button v-else size="small" type="primary">点击上传</el-button>
					<span class="el-upload__tip" slot="tip">仅支持一张</span>
				</el-upload>
        </el-form-item>

        <el-form-item label="所属机构" prop="orgId">
            <BcSelect
                @GetApiData="orgSelectData($event)"
                v-model="addFromData.orgId"
                :filterable="true"
                placeholder="请输入/选择机构"
                itemNameKey="org_name"
                itemValueKey="id"
                :clearable="true">
            </BcSelect>
        </el-form-item>

        <!-- 选项是否展示 -->
        <el-form-item label="类型" prop="contentType">
            <!-- {{addFromData.contentType}} -->
            <BcSelect
                @GetApiData="JumpTap($event)"
                @change="JumpTapChange"
                v-model="addFromData.contentType"
                placeholder="请选择类型"
                itemNameKey="name"
                itemValueKey="value"
                :clearable="true">
            </BcSelect>
        </el-form-item>
        <el-form-item v-if="isProductType" label="活动内容" prop="content">
            <!-- input -->
            <el-input v-model="addFromData.content" placeholder="请输入活动内容" :disabled="this.addFromData.contentType == '' || this.addFromData.contentType.value == null"></el-input>
        </el-form-item>
        <el-form-item v-else label="跳转内容" prop="content">
            <!-- 下拉框 :key="addFromData.contentType.value" 根据跳转内容重载组件-->
            <BcSelect v-model="addFromData.content"
                :disabled="this.addFromData.contentType == '' || this.addFromData.contentType.value == null"
                @GetApiData="getOrgSelectData($event)"
                :key="addFromData.contentType.value"
                :filterable="true"
                :remote="true"
                :clearable="true"
                itemNameKey="name"
                itemValueKey="value"
                placeholder="请输入跳转内容">
            </BcSelect>
        </el-form-item>

        <el-form-item label="排序" prop="advOrder">
            <el-input v-model="addFromData.advOrder" type="number"></el-input>
        </el-form-item>

        <el-form-item label="可见用户" prop="advVisibleUesr">
            <BcSelect
                @GetApiData="advVisibleUesrChange($event)"
                v-model="addFromData.advVisibleUesr"
                itemNameKey="name"
                itemValueKey="value"
                placeholder="请选择可见用户"
                :clearable="true">
            </BcSelect>
        </el-form-item>

        <el-form-item label="监管沙盒">
            <el-input v-model="addFromData.sandboxId" placeholder="请输入产品ID"></el-input>
        </el-form-item>

        <el-form-item label="显示时间" prop="value1">
            <el-time-picker
                is-range
                v-model="addFromData.value1"
                range-separator="至"
                format='HH:mm'
                value-format="HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
            </el-time-picker>
        </el-form-item>

        <el-form-item label="发布日期" prop="value2">
           <el-date-picker
                v-model="addFromData.value2"
                type="datetimerange"
                start-placeholder="开始日期"
                range-separator="至"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['12:00:00']">
           </el-date-picker>
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
// 最新公共select组件
import BcSelect from "@common/finsuit-components/BcSelect"
import config from '../../config/config.index.js'
export default {
    components:{
        BcSelect,
    },
    data(){

        // 验证选择机构
        // let validateOrgId = (rule, value, callback) => {
        //     // 当选择机构名称为空值且为必填时，抛出错误，反之通过校验
        //     if (!this.id && value === ""){
        //         callback(new Error("请选择机构"));
        //     }else if(this.id && value.id == null){
        //         callback(new Error("请选择机构"));
        //     }else{
        //         callback();
        //     }
        // };

        //验证类型
        let validatecontentType = (rule, value, callback) => {
            if (!this.id && value === ""){
                callback(new Error("请选择类型"));
            }else if(this.id && value.value == null){
                callback(new Error("请选择类型"));
            }else{
                callback();
            }
        };

        //验证活动内容
        let validatecontent = (rule, value, callback) => {
            if (!this.id && value === ""){
                callback(new Error("请选择活动内容"));
            }else if(this.id && value.value === "" ){
                callback(new Error("请选择活动内容"));
            }else if(this.id && value === "" ){
                callback(new Error("请选择活动内容"));
            }else{
                callback();
            }
        };

        //验证排序值是正整数
        let validateadvOrder =(rule, value, callback) => {
            if (value==''){
                callback(new Error("请输入排序值"));
            } else if (isNaN(value)) {
                callback(new Error("请输入正确的排序值"));
            } else if (!(/^\d+$/.test(value))) {
                callback(new Error("请输入正确的排序值，只可为正整数"));
            } else if (value < 1) {
                callback(new Error("排序值应大于0"));
            }else {
                callback();
            }
        };

        return{
            id: "",
            positionId:"",//位置id
            imageUrl: config.baseUrlHost+'/finsuitImgDisplay/show?path=', //图片前面有域名的部分地址
            size:"small",
            pageType:"新增",
            saveLoading:false,
            isProductType:true,//true是input，false是选择框
            advVisibleUesrList:'',//可见用户
            // 新增/修改表单
            addFromData: {
                advertisingAlias:'',//别名
                advImgUrl:"",//广告图
                orgId: "",//选择机构
                // prdIndexId: "",//选择产品
                contentType: "",//转跳类型
                contentTypeName: "",//转跳类型
                content:"",//跳转内容
                contentName: "",//跳转内容
                advOrder:"",//排序
                advVisibleUesr:"",//可见用户
                advVisibleUesrName:"",//可见用户
                value1:["00:00:00", "23:59:59"],//显示时间
                value2:[],//发布日期
                showStartTime:"",//显示开始时间
                showEndTime:"",//显示结束时间
                startTime:"",//发布开始日期
                endTime:"",//发布结束日期
                sandboxId:"",//监管沙盒
            },

            //验证
            rules:{
                advertisingAlias:[
                    { required: true, message: '请填写别名', trigger: 'change' },
                    { min: 2, max: 20, message: '长度在 2 到 20个字符', trigger: 'blur' }
                ],
                advImgUrl:[{ required: true, message: '请选择广告图片',trigger: 'change' }],
                // orgId:[{ validator: validateOrgId,trigger: 'change'}],
                // prdIndexId:[{ validator: validateprdIndexId, trigger: 'change' }],
                contentType:[{required: true, validator: validatecontentType, trigger: 'change' }],
                content:[{ required: true, validator: validatecontent, trigger: 'change' }],
                advOrder:[{ required: true, validator: validateadvOrder, trigger: 'change' }],
                advVisibleUesr:[{ required: true, message: '请选择可见用户', trigger: 'change' }],
                value1:[{ required: true, message: '请选择显示时间', trigger: 'change' }],
                value2:[{ required: true, message: '请选择发布日期', trigger: 'change' }],
            },

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

       let params = this.$route.query
       console.log(params)
       if(params){
          this.id = params.id ? params.id : ""
          this.positionId = params.positionId
          this.pageType = params.id == '' ? "新增" : "修改" //获取url传过来的参数，id存在是修改，否则是新增
          //如果页面是修改，回显数据
          if(params.id != ""){
            this.showList()
          }
       }

    },
    methods:{

        //上传图片
        // async imgDataApi($event){

        //    let { query, callback } = $event;
        //     var formData = new FormData();
		// 	formData.append('name', query);

        //    let data = await this.$api.forUpload(formData).then(res => res || {});
        //    console.log(data)
        //    callback({ list: data});
        // },

        //展示回传数据
        showList(){
            let param = {
                id: this.id,
            }
            this.$api.dataQueryById(param).then(res =>{
                console.log("回显数据请求数据",res)
                let data = res.success
                this.addFromData.id = data.id
                this.addFromData.advertisingAlias = data.advertisingAlias
                this.addFromData.advImgUrl = data.advImgUrl
                this.addFromData.orgId = {org_name:data.orgName,id:data.orgId}
                this.addFromData.contentType = {name:data.contentTypeName,value:data.contentType}
                this.addFromData.advOrder = data.advOrder
                this.addFromData.advVisibleUesr = {name:data.advVisibleUesrName,value:data.advVisibleUesr}
                this.addFromData.sandboxId = data.sandboxId
                console.log("this.addFromData.advVisibleUesr",this.addFromData.advVisibleUesr)
                this.addFromData.value1.splice(0,2,data.showStartTime,data.showEndTime)
                this.addFromData.value2.push(data.startTime)
                this.addFromData.value2.push(data.endTime)

                //数据回显，根据返回来的跳转类型，判断转跳内容 是input还是select
                this.isProductTypeEvent(this.addFromData.contentType)

                //跳转内容是select 回显需要对象
                this.addFromData.content = this.isProductType ? data.contentName : {name:data.contentName,value:data.content}
                console.log("回显数据",this.addFromData)
            })
        },

        //获取机构下拉框数据
        async orgSelectData($event){
           let { query, callback } = $event;
           let params = {
                orgName :query.keywords
            }
           let data = await this.$api.selectOrgData(params).then(res => res.datatypeParam.success || {});
           callback({ list: data, total: 0});
        },

        // //机构ID下拉选项发生变化
        // orgIdOnChange(value){
        //     // 机构变动时要清空产品信息
        //     this.addFromData.prdIndexId = "";
        // },

        //获取产品数据 根据机构类型id,请求相对应产品
        // async orgProSelectData($event){

        //    let { query, callback } = $event;
        //    let params = {
        //         orgId : this.addFromData.orgId.id,
        //         prdName:query.keywords
        //     }
        //    let data = await this.$api.selectProductData(params).then(res => res.success || {});
        //    let listData = data.map(item =>{
        //        return{
        //          id :item.prdIndexId,
        //          name:item.prdIndexName
        //        }
        //    })
        //    // 0 不展示分页
        //    callback({ list: listData, total: 0});
        // },

        //可见用户 0:全部 1:登录用户 2:未登录用户 3:新用户 4:老用户 5:未注册的新设备',
        async advVisibleUesrChange($event){
            let { query, callback } = $event;
            let data = await this.$api.getAvailableUser().then(res => res.data || {});
            // 0 不展示分页
            // console.log("可见用户",data)
            callback({ list: data.availableUserList, total: 0 });
        },

        //当获取焦点时获取转跳类型数据
        async JumpTap ($event) {
            let { query, callback } = $event;
            let data = await this.$api.getAvailableUser().then(res => res.data || {});
            // 0 不展示分页
            // console.log(data)
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

                    let params = {
                            id : this.id ? this.id : '',
                            positionId : this.positionId,//位置id
                            advertisingAlias: this.addFromData.advertisingAlias,//别名
                            advImgUrl:this.addFromData.advImgUrl,//广告图
                            orgId: this.addFromData.orgId ? this.addFromData.orgId.id : '',//选择机构
                            // prdIndexId: this.addFromData.prdIndexId ? this.addFromData.prdIndexId.id :'',//选择产品
                            contentType: this.addFromData.contentType ? this.addFromData.contentType.value : '',//转跳类型
                            contentTypeName: this.addFromData.contentType ? this.addFromData.contentType.name : '',//转跳类型
                            content: this.isProductType ? '' : this.addFromData.content.value,//跳转内容
                            contentName: this.isProductType ? this.addFromData.content : this.addFromData.content.name,//跳转内容
                            advOrder: this.addFromData.advOrder,//排序
                            advVisibleUesr: this.addFromData.advVisibleUesr.value,//可见用户
                            advVisibleUesrName: this.addFromData.advVisibleUesr.name,//可见用户
                            sandboxId:this.addFromData.sandboxId,//监管沙盒
                            showStartTime:this.addFromData.value1[0],//显示开始时间
                            showEndTime:this.addFromData.value1[1],//显示结束时间
                            startTime:this.addFromData.value2[0],//发布开始日期
                            endTime:this.addFromData.value2[1],//发布结束日期
                    }
                    console.log("保存参数params",params);

                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.saveLoading = true

                            this.$api.brokersSave(params).then((res) => {
                                console.log("提交返回res",res)
                                let data = res.headerModel
                                if(data.code == '0'){
                                    this.saveLoading = false
                                    this.$message({ message: data.message, type: 'success' })
                                }else{
                                    this.saveLoading = false
                                    this.$message({ message: data.message, type: 'error' })
                                }
                                //提交成功返回上一页面 并刷新列表页
                                this.$router.go(-1)
                                // this.cancleFrom()
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
            this.$router.push({ path: '/brokersLocationListSub',query:{positionId:this.positionId}});
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
/deep/ .el-form-item__content,.el-range-editor--small.el-input__inner{
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
