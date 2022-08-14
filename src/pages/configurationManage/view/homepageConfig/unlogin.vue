<template>
<!-- 配置管理-首页配置-未登陆 -->
  <div class="prdSeries">
	<CommonTable :isFluid="false" @height="tableHeight=$event">
		<!--标头查询区-->
		<div slot="search">
			<el-form :inline="true" :size="size" ref='topData'>
				<el-form-item label="渠道配置：" style="padding-right:100px">
					<p>比财</p>
				</el-form-item>
				<el-form-item label="功能开关：" prop="switch" style="padding-right:100px">
					<!-- <el-select v-model="topCheckData.switch" placeholder="请选择" clearable disabled >
						<el-option v-for="item in allSelectData.isOkList"
						:key="item.name" :label="item.name" :value="item.value">
						</el-option>
					</el-select> -->
					<p>{{topCheckData.switch == 0 ? "已开启" : "已关闭"}}</p>
				</el-form-item>
				<el-form-item label="功能开关：" prop="switch">
					<!-- active-color="#13ce66" inactive-color="#ff4949" -->
					<el-switch v-model="topCheckData.switch" class="switch"
					:active-value="0" :inactive-value="1" 
					active-text="YES" inactive-text="NO" 
					@change="updateSwitch()"></el-switch>
				</el-form-item>
			</el-form>
		</div>
		<!-- 操作按钮区 -->
		<div slot="action">
			<el-button class="addBtn" :size="size" icon="el-icon-plus" type="primary"  @click="handleAdd()">新增</el-button>
		</div>	
		<!-- 表格内容栏 -->
		<el-table :height="tableHeight" size="mini" :data="configList" style="width: 100%" stripe border="true"
			@selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
			<el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
			<el-table-column prop="imgUrl" label="图片" header-align="center" align="center">
				<template slot-scope="scope">
					<img class="table_img" :src="imageUrl + scope.row.imgUrl" alt="">
				</template>
			</el-table-column>
			<el-table-column prop="contentTypeName" label="内容类型" header-align="center" align="center"></el-table-column>
			<el-table-column prop="contentName" label="URL" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orderNumber" label="排序" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" width="200px" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="configDetail(scope.row,scope.$index,'1')">查看</el-button>
					<el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index,'2')">修改</el-button>
					<el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row,'3')">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</CommonTable>
	<!-- 新增弹框 -->
	<el-dialog :title="!dataForm.id ? '新增' : dialogTitle" width="60%" :visible.sync="dialogVisible" :before-close="closeDialog">
		<el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size"
			label-position="left" class="addForm">
			<el-form-item label="图片：" prop="imgUrl">
				<el-upload
					:model='imageUrl + dataForm.imgUrl'
  					class="upload-demo"
					ref="upload1"
					action="#"
					:limit="limitNum"
					:on-exceed="exceedFile"
					:before-upload="beforeUploadFile"
					:http-request="uploadImg"
					:show-file-list="false"
					>
					<img v-if="dataForm.imgUrl" :src="imageUrl + dataForm.imgUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					<span class="el-upload__tip" slot="tip">仅支持一张</span>
				</el-upload>
			</el-form-item>
			<el-form-item label="内容：">
				<el-form-item label="类型：" prop="contentType">
					<el-select v-model="dataForm.contentType" placeholder="请选择" filterable clearable
					@change="changeContentType">
						<el-option v-for="item in allSelectData.contentTypeList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="内容：" prop="content" style='position:relative'>
					<el-input type='email' v-if="dataForm.contentType=='1' || dataForm.contentType=='8' " v-model="dataForm.content" placeholder="请输入内容"></el-input>
					<el-select ref='scrollbar' no-match-text='' class='scrollSelect' @change='changeContent' clearable 
					v-else v-model="dataForm.contentName" :filterable='dataForm.contentType==3' 
					remote @blur='blurFun' :remote-method="searchPro" placeholder="">
						<div v-if='dataForm.contentType==3'>
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
				
			</el-form-item>
			<el-form-item label="排序：" prop="orderNumber">
				<el-input v-model="dataForm.orderNumber" type="number" placeholder="请输入排序"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="cancleFrom('dataForm')">取消</el-button>
			<block v-if="dialogTitle != '查看'">
				<el-button :size="size" type="primary" v-if="!dataForm.id" @click.native="submitFormAddSave('dataForm')" :loading="saveLoading">保存</el-button>
				<el-button :size="size" type="primary" v-else @click.native="submitFormEditSave('dataForm')" :loading="saveLoading">保存</el-button>
			</block>
		</div>
	</el-dialog>
  </div>
</template>
<script>
// 接口函数依次：获取所有标签，功能开关，查询列表，新增，修改，删除
import {getSwitch,updateSwitch,forConfigPage,configDetail,getConfigList,addConfig,updateConfig,delConfig,forUpload,getContentByContentType} from "../../apis/index";
import config from '../../config/config.index.js'
import CommonTable from "@common/finsuit-components/CommonTable"
export default {
	name: 'Unlogin',
	components: { CommonTable },
	data() {
		return {
			imageUrl:'', //图片前面有域名的部分地址
			size: 'small',
			topCheckData: { //顶部搜索选择的工具内容
				switch:'', //配置开关  0:开 1:关
			},
			dialogUploadVisible: false, //是否显示导入的上传文件的弹框
			loading:false, //请求列表时loading
			proName:'', //内容-内容
			pageParams:{ //内容分页
				pageNum:'1',
				pageSize:'10',
				totalPage:'0',
			},
			contentList: [], //内容的内容数组
			configList: [], //请求回来的表格列表数据list
			allSelectData:{
				contentTypeList:[],//渠道配置 1:链接 2:活动 3:产品 4:机构 5:资讯 8登陆
				isOkList:[
					{
						'name':'已开启',
						'value': 0
					},
					{
						'name':'已关闭',
						'value': 1
					}
				], //状态list
			},
			dialogTitle:'新增',
			saveLoading: false,  //保存时按钮loading
			// 新增和编辑
			dialogVisible: false, //是否展示新增编辑弹框
			dataForm: {  //修改弹框数据
				id:'', //
				imgUrl: '', //图片url
				contentType:'', //内容类型
				content:'', //内容id
				contentName:'', //内容名称
				orderNumber:'', //排序
				updId:'',
			},
			formRules: { //弹框校验规则
				imgUrl:[
					{ required: true, message: '请上传图片', trigger: 'blur' },
				],
				contentType:[
					{ required: true, message: '请选择内容类型', trigger: 'change' },
				],
				content:[
					// { required: true, message: '请输入内容', trigger: 'change'},
				],
				orderNumber:[
					{ required: true, message: '请输入排序', trigger: 'blur' },
				],
			},  
		}
  	},
  	mounted() {
		//图片初始化地址：
		this.imageUrl = config.baseUrlHost+'/finsuitImgDisplay/show?path=';
		console.log('图片初始地址-imageUrl',this.imageUrl)
		this.getSwitch() //获取配置开关
		this.forConfigPage() //内容类型
		this.getConfigList() //获取列表
	},
	methods: {
		//获取配置开关
		getSwitch(){
			let params = ''
			getSwitch(params).then(res => {
				console.log("获取配置开关",res)
				if(res.code == '0'){
					this.topCheckData.switch = res.switch
				}
			}).catch((err) => {
				console.log("获取配置开关失败err",err);
				this.$message({ message: '修改开关失败', type: 'error' })
			})
		},
		//点击功能开关请求接口修改开关
		updateSwitch(){
			let params = {
				switchCode: this.topCheckData.switch //0 、关 1、开
			}
			console.log(params)
			updateSwitch(params).then(res => {
				console.log("获取修改过功能开关",res)
				if(res.code == '0'){
					this.$message({ message: res.message, type: 'success' })
				}
			}).catch((err) => {
				console.log("修改开关err",err);
				this.$message({ message: '修改首页配置开关失败', type: 'error' })
			})
		},
		// 获取列表数据
		getConfigList: function(type) {
			this.loading = true;
			let params = ''
			getConfigList(params).then(res => {
				console.log("列表数据res",res)
				if(res.code == '0'){
					this.loading = false;
					this.configList = res.data.configList  //列表list
				}else{
					this.loading = false;
					this.$message({ message: res.message, type: 'error' })
				}
			}).catch((err) => {
				console.log("列表数据请求err",err);
				this.loading = false;
				this.$message({ message: '请求列表数据失败', type: 'error' })
			})
		},
		//页面初始化接口--获取内容类型列表
		forConfigPage(){
			let params = ''
			forConfigPage(params).then(res => {
				console.log("获取内容类型列表res",res)
				if(res.code == '0'){
				// 	//机构列表
					this.allSelectData.contentTypeList = res.data.contentTypeList //渠道配置
				}else{
					console.log('获取内容类型失败')
					this.loading = false;
					this.$message({ message: res.message, type: 'success' })
				}
			}).catch((err) => {
				console.log("获取内容类型err",err);
				this.loading = false;
				this.$message({ message: '获取内容类型失败', type: 'error' })
			})
		},
		//弹框取消按钮
		cancleFrom(dataForm){
			this.dialogVisible = false
			this.$refs.dataForm.resetFields(); //清空数据
		},
		//点击弹框阴影部分校验
		closeDialog(done){
		　　this.$confirm('确认关闭？')
		　　.then(_ => {
			　　 done();
				this.$refs.dataForm.resetFields(); //清空数据
				location.reload();  //刷新页面
			})
			.catch(_ => { });
		},
		// 显示新增界面弹窗
		handleAdd: function() {
			console.log('新增')
			this.dialogVisible = true;
			this.dataForm = { 
				imgUrl: '', //图片url
				contentType:'', //内容类型
				content:'', //内容id
				contentName:'', //内容名称
				orderNumber:'', //排序
			};
			Object.assign(this.dataForm);
		},
		//获取配置详情--查看单条数据接口
		configDetail(row,index,type){
			console.log('查看',row,type)
			this.dialogTitle = '查看'
			this.dialogVisible = true;
			let params = row.id
			configDetail(params).then(res => {
				console.log("获取查看详情res",res)
				if(res.code == '0'){
					this.dataForm = res.data //当前列表list
				}else{
					console.log('获取单条数据接口失败')
					this.loading = false;
					this.$message({ message: res.message, type: 'success' })
				}
			}).catch((err) => {
				console.log("获取单条数据接口err",err);
				this.loading = false;
				this.$message({ message: '获取配置查看详情失败', type: 'error' })
			})
		},
		// 显示编辑界面弹框
		handleEdit: function(row,index,type) {
			console.log('编辑',row,type)
			this.dialogTitle = '修改'
			this.dialogVisible = true;
			Object.assign(this.dataForm, row);

			//点击编辑后，需要请求当前类型的内容接口并展示
			if(row.contentType!=1&&row.contentType!=8){
				console.log('修改content1',row.contentName)
				this.changeContentType(row.contentType)
				//将编辑里当前item的contentName，赋值给文本上this.dataForm.contentName
				this.dataForm.contentName = row.contentName
			}
		},
		//新增保存提交
		submitFormAddSave: function (dataForm) {
			console.log('新增保存')
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.saveLoading = true
						let params = Object.assign({}, this.dataForm);
						console.log('新增保存入参',params)
						addConfig(params).then((res) => {
							console.log("新增接口",res);
							if(res.code == '0'){
								this.saveLoading = false
								this.$message({ message: res.message, type: 'success' })
								this.dialogVisible = false
								this.getConfigList()
							}else{
								this.saveLoading = false
								this.$message({ message: res.message, type: 'error' })
								this.dialogVisible = false
							}
						}).catch((err) => {
							console.log("新增接口err",err);
							this.$message({ message: err, type: 'error' })
						})
					}).catch(() => {
						this.$message({type: 'info',message: '已取消新增'});        
					});
				}
			})
		},
		//编辑保存提交
		submitFormEditSave: function (dataForm) {
			console.log('编辑保存')
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.saveLoading = true
						let params = Object.assign({},this.dataForm);
						console.log('编辑保存入参',params)
						//请求编辑接口
						updateConfig(params).then((res) => {
							console.log("修改接口",res);
							if(res.code == '0'){
								this.saveLoading = false
								this.$message({ message: res.message, type: 'success' })
								this.dialogVisible = false
								this.getConfigList()
							}else{
								this.saveLoading = false
								this.$message({ message: res.message, type: 'error' })
								this.dialogVisible = false
							}
						}).catch((err) => {
							console.log("编辑接口err",err);
							this.$message({ message: err, type: 'error' })
						})
					}).catch(() => {
						this.$message({type: 'info',message: '已取消编辑'});          
					});
				}
			})
		},
		// 单个删除
		handleDelete (index, row,type) {
			console.log('单个删除',row,type)
			if(row.fundStatus == '0'){
				this.$message({type: 'info',message: '该条基金公司数据，已为弃用数据，无需删除，如需使用，可在修改中更改状态！'});
			}else{
				this.$confirm('确定要删除此条内容？', '提示', {type: 'warning'}).then(() => {
					this.loading = true
					let params = row.id
					console.log('单个删除入参',params)
					delConfig(params).then(res => {
						console.log("删除接口",res);
						if(res.code == '0'){
							this.loading = false
							this.$message({message: res.message, type: 'success'})
							this.getConfigList() //刷新当前页
							
						}else{
							this.loading = false
							this.$message({ message: res.message, type: 'error' })
							this.getConfigList() //刷新当前页
						}
					}).catch((err) => {
						console.log("删除接口err",err);
						this.loading = false
						this.$message({ message: err, type: 'error' })
					})
				}).catch(() => {
					this.$message({type: 'info',message: '已取消删除'});
				});
			}
		},
		//------------------上传图片------------------------
		// 文件超出个数限制时的钩子
		exceedFile(files, fileList) {
			this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
		},
		// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
		beforeUploadFile(file) {
			console.log('before upload');
			console.log(file);
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
			console.log('formData',formData)
			forUpload(formData).then((res) => {
				console.log(res)
				if (res.result) {
					this.dataForm.imgUrl = res.data[0]
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
		//--------------------------通过内容类型对应不同的内容--------------------------------
		// 搜索产品数据
		blurFun () {
			console.log('失去焦点')
			this.proName=''
			this.searchPro(this.proName)
		},
		searchPro(query) {
			console.log('searchPro-内容input值',query)
			this.pageParams.pageNum=1
			this.proName=query
			let params={
				pageNum: 1,
				pageSize:10,
				contentTypeId: this.contentTypeId,
				name: this.proName
			}
			//通过内容类型请求内容接口
			getContentByContentType(params).then((res) =>{
				if (Number(res.code)===0) {
					this.contentList = res.data.data
					this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
					console.log('总页数',this.pageParams.totalPage)
					if (res.data.data.length==0) {
						console.log(this.$refs.scrollbar)
						// .el-scrollbar
						// document.getElementsByClassName('')
					}
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

		// 切换内容类型，请求内容--内容变化
		changeContentType (value) {
			console.log('当前类型value--code',value)
			this.contentList = []
			this.pageParams.totalPage= 0
			this.pageParams.pageNum=1
			this.dataForm.content=''
			this.dataForm.contentName=''
			if (value==1) {} else {
				this.contentTypeId=value
				let params={
					pageNum: this.pageParams.pageNum,
					pageSize:this.pageParams.pageSize,
					contentTypeId: this.contentTypeId,
					name:""
				}
				//切换内容类型请求列表内容
				getContentByContentType(params).then((res) =>{
					if (Number(res.code)===0) {
						this.contentList = res.data.data
						console.log(this.contentList)
						this.pageParams.totalPage= Math.ceil(res.data.totalCount/this.pageParams.pageSize)
						console.log('内容总页数',this.pageParams.totalPage)
					}
				})
			}
		},
		// 内容切换
		changeContent (val){
			console.log('当前选择name',val)
			this.contentList.forEach((i) => {
				if (i.name==val) {
					this.dataForm.content=i.value
					console.log('要传的contentID',this.dataForm.content)
				}
			})
		},
	
	},
	
}
</script>

<style lang="less" scoped>
	/deep/ .el-table__fixed-body-wrapper {
		top: 37px !important;
	}
    .prdSeries{
        padding: 20px;
    }
	// .topBox{
	// 	border-bottom: 1px solid #EBEEF5;
	// }
	// .addBtn{
	// 	margin: 18px 0;
	// }
	.table_img{
		width: 50px;
		height: 50px;
	}
	.table{
		.table_img{
			width: 50px;
			height: 50px;
		}
	}
	.addForm{
		.el-form-item__label-wrap {
			margin-left: 0px!important;   //新增的所有label 靠左显示
		}
		.el-table::before {
			left: 0;
			bottom: 0;
			width: 100%;
			height: 0px;
		}
		.el-input{
			width: 100%;
		}
		.el-select{
			width: 100%;
		}
		.tipText{
			padding-left: 12px;
			color: #999;
		}
	}
	//图片上传
	// /deep/ .avatar-uploader{
	// 	border: 1px dashed #d9d9d9;
	// 	border-radius: 6px;
	// 	cursor: pointer;
	// 	position: relative;
	// 	overflow: hidden;
	// }
	// /deep/ .avatar-uploader .el-upload:hover {
	// 	border-color: #409EFF;
	// }
	/deep/ .avatar-uploader-icon {
		border: 1px dashed #d9d9d9;
		font-size: 28px;
		color: #8c939d;
		width: 90px;
		height: 90px;
		line-height: 90px;
		text-align: center;
	}
	/deep/ .avatar-uploader-icon:hover {
		border-color: #409EFF;
	}
	.avatar {
		width: 90px;
		height: 90px;
		display: block;
	}
	.el-upload__tip{
		padding-left: 20px;
	}	
	
	// /deep/ .switch .el-form-item__content{
	// 	padding-top: 6px;
	// }
</style>
