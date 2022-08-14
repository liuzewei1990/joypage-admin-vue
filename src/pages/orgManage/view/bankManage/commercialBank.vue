<template>
<!-- 银行管理 -->
  <div class="prdSeries">
	<CommonTable :isFluid="false" @height="tableHeight=$event">
		<!--标头查询区-->
		<div slot="search">
			<el-form :inline="true" :size="size" :model="topCheckData" ref='topData'>
				<el-form-item label="银行名称：" prop="orgName">
					<el-select v-model="topCheckData.orgName" placeholder="请选择" filterable clearable>
						<el-option v-for="item in orglist"
						:key="item.commercialId" :label="item.orgName" :value="item.orgName">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<!-- 操作按钮区 -->
		<div slot="action">
			<el-button class="addBtn" icon="el-icon-plus" style="float:left;" :size="size"  type="primary"  @click="handleAdd()">新增</el-button>
			<el-button icon="el-icon-refresh" style="float:right;" :size="size" @click="resetForm('topData')">重置</el-button>
			<el-button icon="el-icon-search" style="float:right;" :size="size" type="primary" @click="getbankList('chaxun')">查询</el-button>
		</div>
		<!-- 表格内容栏 -->
		<el-table :height="tableHeight" size="mini" :data="bankList" style="width: 100%" stripe border="true"
			@selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
			<el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orgName"  label="银行名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="namePy" label="银行名称首字母" header-align="center" align="center"></el-table-column>
			<el-table-column prop="generalBankNo" label="总行号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="logoUrl" label="银行logo" header-align="center" align="center">
				<template slot-scope="scope">
					<img class="table_img" :src="imageUrl + scope.row.logoUrl" alt="">
				</template>
			</el-table-column>
			<el-table-column prop="bankcardUrl" label="银行卡背景图片" header-align="center" align="center">
				<template slot-scope="scope">
					<img class="table_img" :src="imageUrl + scope.row.bankcardUrl" alt="">
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index)">修改</el-button>
					<el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页栏-->
		<div slot="footer">
			<el-pagination layout="total, sizes, prev, pager, next, jumper" style="float:right;"
			:total="totalSize"
			@current-change="refreshPageRequest"  
			@size-change="handleSizeChange"
			:current-page="pageRequest.pageNum" 
			:page-sizes="[10, 20, 30, 40]"
			:page-size="pageRequest.pageSize">
			</el-pagination>
		</div>
	</CommonTable>
	<!-- 新增弹框 -->
	<el-dialog :title="!dataForm.id ? '新增' : '修改'" width="60%" :visible.sync="dialogVisible" :before-close="closeDialog">
		<el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size"
			label-position="left" class="addForm">
			<el-form-item label="银行名称：" prop="orgName">
				<el-input v-model="dataForm.orgName" placeholder="请输入银行名称"></el-input>
			</el-form-item>
            <el-form-item label="银行名称首字母：" prop="namePy">
				<el-input v-model="dataForm.namePy" placeholder="请输入银行名称首字母"></el-input>
			</el-form-item>
			<el-form-item label="总行号：" prop="generalBankNo">
				<el-input v-model="dataForm.generalBankNo" placeholder="请输入总行号"></el-input>
			</el-form-item>
			<el-form-item label="银行logo：" prop="logoUrl">
				<el-upload
					:model='imageUrl + dataForm.logoUrl'
  					class="upload-demo"
					ref="upload1"
					action="#"
					:limit="limitNum"
					:on-exceed="exceedFile"
					:before-upload="beforeUploadFile"
					:http-request="uploadBanklogoImg"
					:show-file-list="false"
					>
					<img v-if="dataForm.logoUrl" :src="imageUrl + dataForm.logoUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					<span class="el-upload__tip" slot="tip">仅支持一张</span>
				</el-upload>
			</el-form-item>
            <el-form-item label="银行卡背景图片：" prop="bankcardUrl">
				<el-upload
					:model='imageUrl + dataForm.bankcardUrl'
  					class="upload-demo"
					ref="upload2"
					action="#"
					:limit="limitNum"
					:on-exceed="exceedFile"
					:before-upload="beforeUploadFile"
					:http-request="uploadBankcardImg"
					:show-file-list="false"
					>
					<img v-if="dataForm.bankcardUrl" :src="imageUrl + dataForm.bankcardUrl" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					<span class="el-upload__tip" slot="tip">仅支持一张</span>
				</el-upload>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="cancleFrom('dataForm')">取消</el-button>
			<el-button :size="size" type="primary" v-if="!dataForm.id" @click.native="submitFormAddSave('dataForm')" :loading="saveLoading">保存</el-button>
			<el-button :size="size" type="primary" v-else @click.native="submitFormEditSave('dataForm')" :loading="saveLoading">保存</el-button>
		</div>
	</el-dialog>
  </div>
</template>
<script>
// 接口函数依次：查询银行名称，查询列表，新增，修改，删除
import {queryOrgNameByBankType,queryCommercialBankList,createCommercialBank,updateCommercialBank,deleteCommercialBank,forUpload} from "../../apis/index"
import config from '../../config/config.index.js'
import CommonTable from "@common/finsuit-components/CommonTable"
export default {
	name: 'depositProduct',
	components: { CommonTable },
	data() {
		return {
			tableHeight: 0,
			imageUrl:'', //图片前面有域名的部分地址
			size: 'small',
			topCheckData: { //顶部搜索选择的工具内容
				orgName: '', //银行名称
			},
			dialogUploadVisible: false, //是否显示导入的上传文件的弹框
			orglist:[], //银行列表
			totalSize: 0, //总数
			pageRequest: { //请求银行动态列表参数
                pageNum: 0, //当前页数
                pageSize: 10  //条数
			},
			loading:false, //请求银行动态时loading
			bankList: [], //请求回来的银行动态列表数据list
			saveLoading: false,  //保存时按钮loading
			limitNum:'', //上传图片数量
			// 新增和编辑
			dialogVisible: false, //是否展示新增编辑弹框
			dataForm: {  //新增弹框数据
				id:'', //
				commercialId:'', //机构id
				orgName:'', //机构名称
				namePy:'', //名称首字母
				generalBankNo:'', //总行号
				logoUrl:'', //银行logo图片地址
				bankcardUrl:'', //银行背景图片地址
			},
			formRules: { //弹框校验规则
				orgName:[
					{ required: true, message: '请输入银行名称', trigger: 'blur' },
				],
				generalBankNo:[
					{ required: true, message: '请输入总行号', trigger: 'blur' },
				],
			},  
			//删除
			selections: [], //删除选中项
		}
  	},
  	mounted() {
		//图片初始化地址：
		this.imageUrl = config.baseUrlHost+'/finsuitImgDisplay/show?path=';
		console.log('图片初始地址-imageUrl',this.imageUrl)
		this.getOrgNameByBankType() //下拉框银行名称数据
		this.getbankList() //银行动态管理列表
	},
	methods: {
		//请求银行名称列表
		getOrgNameByBankType(){
			let params = ''
			queryOrgNameByBankType(params).then(res => {
				console.log("获取银行名称",res)
				if(res.result == true){
					//机构列表
					this.orglist = res.data
				}else{
					console.log('获取银行名称失败')
					this.loading = false;
					this.$message({ message: res.description, type: 'error' })
				}
			}).catch((err) => {
				console.log("银行名称请求失败err",err);
				this.loading = false;
				this.$message({ message: '银行名称请求失败', type: 'error' })
			})
		},
		// 获取银行动态列表数据
		getbankList: function(type) {
			this.loading = true;
			if(type == 'chaxun'){
				console.log('chauxn')
				this.pageRequest.pageNum = 0; //初始化--第一条开始查
				this.pageRequest.pageSize = 10; //初始化--查询10条
			}
			let params = {
				//查询多少页，从0开始, offset=页数乘以条数
				start: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum-1)*this.pageRequest.pageSize, 
				length: this.pageRequest.pageSize, //查询多少条
				orgName: this.topCheckData.orgName, //机构名称id
			}
			console.log('银行管理数据入参',params)
			queryCommercialBankList(params).then(res => {
				console.log("获取银行列表数据",res)
				if(res.result == true){
					this.loading = false;
					this.bankList = res.data.data
					this.totalSize = res.data.totalCount; //总条数
				}else{
					this.loading = false;
					this.$message({ message: res.description, type: 'error' })
				}
			}).catch((err) => {
				console.log("银行管理数据入参err",err);
				this.loading = false;
				this.$message({ message: '请求银行列表数据失败', type: 'error' })
			})
		},
		// 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.getbankList() //调银行动态列表接口
		},
		// 点击条数--分页刷新
		handleSizeChange(val){
			console.log(`当前条数: ${val}`);
			this.pageRequest.pageSize = val
			this.getbankList() //调产品系列列表接口
		},
		//机构名称
		orglistSelect(val){
			console.log('当前value--code',val)
			let obj = {}
			obj = this.orglist.find(function(item){
				return item.commercialId === val
			})
			console.log(obj.orgName)
			this.dataForm.orgName = obj.orgName
			//请求存款系列
		},
		//重置
		resetForm(topData){
			console.log('重置')
			this.$refs.topData.resetFields();
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
				commercialId:'', //机构id
				orgName:'', //机构名称
				namePy:'', //名称首字母
				generalBankNo:'', //总行号
				logoUrl:'', //银行logo图片地址
				bankcardUrl:'', //银行背景图片地址
			};
			Object.assign(this.dataForm);
		},
		// 显示编辑界面弹框
		handleEdit: function(row) {
			console.log('编辑',row)
			this.dialogVisible = true;
			Object.assign(this.dataForm, row);
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
						createCommercialBank(params).then((res) => {
							console.log("新增接口",res);
							if(res.result == true){
								this.saveLoading = false
								this.$message({ message: res.description, type: 'success' })
								this.dialogVisible = false
								this.getbankList()
							}else{
								this.saveLoading = false
								this.$message({ message: res.description, type: 'error' })
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
						updateCommercialBank(params).then((res) => {
							console.log("修改接口",res);
							if(res.result == true){
								console.log("修改接口成功",res);
								this.saveLoading = false
								this.$message({ message: res.description, type: 'success' })
								this.dialogVisible = false
								this.getbankList()
							}else{
								this.saveLoading = false
								this.$message({ message: res.description, type: 'error' })
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
		handleDelete (index, row) {
			console.log('单个删除',row)
			this.$confirm('确定要删除此条内容？', '提示', {type: 'warning'}).then(() => {
				this.loading = true
				let params ={
					id: row.id, //必传
					updId: row.updId 
				}
				console.log('单个删除入参',params)
				deleteCommercialBank(params).then(res => {
					console.log("删除接口",res);
					if(res.result == true){
						this.loading = false
						this.$message({message: res.description, type: 'success'})
						this.getbankList() //刷新当前页
						
					}else{
						this.loading = false
						this.$message({ message: res.description, type: 'error' })
					}
				}).catch((err) => {
					console.log("删除接口err",err);
					this.loading = false
					this.$message({ message: err, type: 'error' })
				})
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});          
			});
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
		uploadBanklogoImg(content) {
			const _file = content.file;//取需要上传的file值
			var formData = new FormData();
			formData.append('name', _file);
			console.log('formData',formData)
			forUpload(formData).then((res) => {
				console.log(res)
				if (res.result) {
					this.dataForm.logoUrl = res.data[0]
					// this.imageUrlBank = `${this.$Config.aliyuncHost}${res.data[0]}`  //生产地址
					this.$refs.upload1.clearFiles()  //清空文件
				} else {
					this.$message.error(res.description);
				}
			}).catch((err) => {
				console.log("上传接口err",err);
				this.$message({ message: err, type: 'error' })
			})
		},
		//上传图片调接口--银行卡背景图
		uploadBankcardImg(content) {
			const _file = content.file;
			var formData = new FormData();
			formData.append('name', _file);
			console.log('formData',formData)
			forUpload(formData).then((res) => {
				console.log(res)
				if (res.result) {
					this.dataForm.bankcardUrl = res.data[0]
					// this.imageUrlBankCard = `${this.$Config.aliyuncHost}${res.data[0]}`
					this.$refs.upload2.clearFiles()  //清空文件
				} else {
					this.$message.error(res.description);
				}
			}).catch((err) => {
				console.log("上传接口err",err);
				this.$message({ message: err, type: 'error' })
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
	
</style>
