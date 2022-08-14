<template>
<!-- 产品支取管理 -->
  <div class="productDrawingManage">
	<!--标头列表-->
	<div class="topBox">
		<el-form :inline="true" :model="topCheckData" :size="size" ref="topCheckData">
			<el-form-item label="产品名称：">
				<el-input v-model="topCheckData.seriesName" placeholder="请输入存款系列名称"></el-input>
			</el-form-item>
			<el-form-item label="操作日期：">
				<el-date-picker v-model="topCheckData.updDate" type="daterange" range-separator="~"
					start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item style="width:100%; text-align:right;">
				<el-button icon="el-icon-search" type="primary" @click="getListPrdSeries()">查询</el-button>
				<el-button icon="el-icon-refresh" @click="resetForm('topCheckData')">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
	<div class="table">
		<el-button class="addBtn" :size="size" icon="el-icon-plus" type="primary"  @click="handleAdd()">新增</el-button>
		<!-- 表格内容栏 -->
		<el-table :height="400" size="mini" :data="prdSeriesList" style="width: 100%" stripe border="true"
			@selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
			<!-- 多选type="selection" 取索引type="index"-->
			<el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
			<el-table-column type="index" label="序号" width="100" header-align="center" align="center"></el-table-column>
			<el-table-column prop="PRD_TYPE" label="产品名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="PRD_TYPE_NAME" label="产品类型" header-align="center" align="center"></el-table-column>
			<el-table-column prop="PRD_SERIES_NAME" label="产品系列名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="PRD_SERIES_NAME" label="收益日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="AUTO_UPPER" label="状态"  header-align="center" align="center">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.AUTO_UPPER==1" :size="size">有效</el-tag>
					<el-tag v-if="scope.row.AUTO_UPPER==2" :size="size">无效</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
				<template slot-scope="scope">
				<el-button icon="el-icon-edit" size="mini"  @click="handleEdit(scope.row,scope.$index)">修改</el-button>
				<el-button icon="el-icon-delete"  size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页栏-->
		<!-- <div class="toolbar" style="padding:10px 0;">
			<el-button :size="size" type="danger" style="float:left;" @click="handleBatchDelete()">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next, jumper" style="float:right;"
				:total="totalSize"
				@current-change="refreshPageRequest"  
				@size-change="handleSizeChange"
				:current-page="pageRequest.pageNum" 
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageRequest.pageSize">
			</el-pagination>
		</div> -->
	</div>
	
	<!-- 新增/修改弹框 -->
	<el-dialog :title="!dataForm.ID ? '新增' : '修改'" width="60%" :visible.sync="dialogVisible">
		<el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size"
			label-position="left" class="addForm">
			<el-form-item label="产品所属机构名称：" prop="ORG_ID">
				<el-select v-model="dataForm.ORG_ID" placeholder="请选择机构名称" clearable
				@change='orgListSelect'>
					<el-option v-for="item in allSelectData.orgList"
					:key="item.ID" :label="item.ORG_NAME" :value="item.ID">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品名称：" prop="PRD_TYPE">
				<el-select v-model="dataForm.PRD_TYPE" placeholder="请选择产品大类" clearable
				@change='parentTypeListSelect'>
					<el-option v-for="item in allSelectData.parentTypeList"
					:key="item.id" :label="item.typeName" :value="item.typeCode">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="提示类型：" prop="SUBTYPE">
				<el-select v-model="dataForm.SUBTYPE" placeholder="请选择产品类型" clearable
				@change='allSubTypeListSelect'>
					<el-option v-for="item in allSelectData.allSubTypeList"
					:key="item.id" :label="item.typeName" :value="item.typeCode">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="提示内容：" prop="PRD_SERIES_NAME">
				<el-input v-model="dataForm.PRD_SERIES_NAME"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
			<el-button :size="size" type="primary" v-if="!dataForm.ID"  @click.native="submitFormAddSave('dataForm')" :loading="saveLoading">保存</el-button>
			<el-button :size="size" type="primary" v-else @click.native="submitFormEditSave('dataForm')" :loading="saveLoading">保存</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
// 接口函数依次：产品所有下拉框列表,产品子类,产品系列列表,新增保存，修改保存，删除保存
import { forPrdSeriesPage,getPrdTypeByParentId,listPrdSeries,addPrdSeries,updPrdSeries,delPrdSeries } from "../../apis/index"
export default {
	name: 'productManage',
	components:{},
	data() {
		return {
			size: 'small',
			topCheckData: { //标头列表输入框数据
				orgName: '', //机构名称
				typeCode: '', //存款类型-- 产品子类型编码
				seriesName:'', //存款系列-- 产品系列名称
				updateUser: '', //操作人-姓名
			},
			allSelectData:{ //所有下拉框数组合集
				orgList:[], //机构名称数组
				allSubTypeList:[], //产品子类数组
				parentTypeList:[],//产品父类型数组
			},
			autoLableList:[
				{
					label:'是',
					value: 0
				},
				{
					label:'否',
					value: 1
				}
			],
			totalSize: 0, //总数
			pageRequest: { //请求产品系列列表参数
                pageNum: 0, //当前页数
                pageSize: 10  //条数
			},
			loading:false, //请求产品系列时loading
			prdSeriesList: [
			// {
				// 	ATTR_ADDED_LABEL: null,
				// 	ATTR_ADDED_LABEL_STATUS: 0,
				// 	AUTO_LABEL: null,
				// 	AUTO_UPPER: 1,
				// 	CREATE_ID: 18,
				// 	CREATE_TIME: "2018-05-04 11:26:43",
				// 	DEFINE_LABEL: "",
				// 	HOEM_PAGE_WORD_STATUS: 0,
				// 	ID: 175,
				// 	IS_SALES_SUM: "1",
				// 	ORG_ID: 176,
				// 	ORG_NAME: "晋中银行",
				// 	PRD_LABEL_STATUS: 0,
				// 	PRD_SERIES_NAME: "久盈宝系列",
				// 	PRD_SERIES_NO: "000000",
				// 	PRD_TYPE: "",
				// 	PRD_TYPE_NAME: "",
				// 	RATE_NAME: "",
				// 	SUBTYPE: "",
				// 	SUBTYPE_NAME: "",
				// 	UPDATE_ID: 18,
				// 	UPDATE_TIME: "2019-09-24 11:12:50",
				// 	UPDATE_USER: "宋畅",
				// }
			], //请求回来的产品系列列表数据list
			saveLoading: false,  //保存时按钮loading
			// 新增和编辑
			dialogVisible: false, //是否展示新增编辑弹框
			dataForm: {  //新增弹框数据
				ID:'',
				ORG_ID:'', //机构id
				ORG_NAME:'', //机构名称
				PRD_TYPE: '',//产品大类编码
				PRD_TYPE_NAME:'', //产品大类名称
				PRD_SERIES_NAME:'', //产品系列名称
				SUBTYPE:'', //产品类型编码-产品小类编码
				SUBTYPE_NAME:'', //产品类型-产品小类名称
				RATE_ID:'', //利率
				RATE_NAME:'', //利率名称
				ATTR_ADDED_LABEL:'', //产品属性补充标签
				AUTO_UPPER: Number,//上下架方式，1手动2自动
				AUTO_LABEL: Number, //同系列标签是否同步
				PRD_LABEL_STATUS: Boolean, //产品状态标签  0:是 1:否
				HOEM_PAGE_WORD_STATUS: Boolean,//首页推荐一句话  0:是 1:否
				ATTR_ADDED_LABEL_STATUS: Boolean, //产品属性补充标签状态 0:是 1:否
			},
			formRules: { //弹框校验规则
				ORG_ID: [
					{ required: true, message: '请选择机构名称', trigger: 'blur' },
				],
				PRD_TYPE:[
					{ required: true, message: '请选择产品大类', trigger: 'change' }
				],
				SUBTYPE:[
					{ required: true, message: '请选择产品类型', trigger: 'change' }
				],
				// PRD_SERIES_NAME:[
				// 	{ required: true, message: '请输入内容', trigger: 'blur' },
				// 	{ min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
				// ],
				RATE_NAME:[
					{ required: true, message: '请输入内容', trigger: 'blur' },
					{ min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
				],
			},  
			//删除
			selections: [], //删除选中项
		}
  },
  mounted() {
	  	this.getPrdSeriesSelect()//初始化下拉框数据
		this.getListPrdSeries()//产品系列列表
	},
	methods: {
		//进入产品系列列表初始化参--所有下拉框数据
		getPrdSeriesSelect(){
			let params = ''
			forPrdSeriesPage(params).then(res => {
				console.log("获取所有下拉框数据",res)
				// let res = {
					// 	data:{
					// 		orgList:[
					// 			{
					// 				ID:'11',
					// 				ORG_NAME:'北京银行'
					// 			},
					// 			{
					// 				ID:'12',
					// 				ORG_NAME:'南京银行'
					// 			}
					// 		],
					// 		allSubTypeList:[
					// 			{
					// 				ID:'13',
					// 				ORG_NAME:'活期存款',
					// 				TYPE_CODE:'1'
					// 			},
					// 			{
					// 				ID:'14',
					// 				ORG_NAME:'智能存款',
					// 				TYPE_CODE:'2'
					// 			}
					// 		],
					// 		parentTypeList:[
					// 			{
					// 				ID:'15',
					// 				ORG_NAME:'存款产品',
					// 				TYPE_CODE:'4'
					// 			},
					// 			{
					// 				ID:'16',
					// 				ORG_NAME:'理财产品',
					// 				TYPE_CODE:'2'
					// 			}
					// 		]
					// 	}
					// }
				// console.log("获取所有下拉框数据",res)
				// if(res.code == 0){
					//产品机构名称数组
					this.allSelectData.orgList = res.data.orgList
					//产品父类型数组
					this.allSelectData.parentTypeList = res.data.parentTypeList
					//产品子类型数组:
					this.allSelectData.allSubTypeList = res.data.allSubTypeList
				// }else{
				// 	console.log('失败')
				// }
			}).catch((err) => {
				console.log("获取产品系列数据err",err);
			})
		},
		// 获取产品系列列表数据
		getListPrdSeries: function() {
			this.loading = true;
			let params = {
				//查询多少页，从0开始, offset=页数乘以条数
				start: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum-1)*this.pageRequest.pageSize, 
				length: this.pageRequest.pageSize, //查询多少条
				ORG_NAME: this.topCheckData.orgName, //机构名称
				TYPE_CODE: this.topCheckData.typeCode, //产品子类型编码
				SERIES_NAME: this.topCheckData.seriesName, //产品系列名称
				UPDATE_USER: this.topCheckData.updateUser, //操作人姓名
			}
			console.log('产品系列数据入参',params)
			//调用产品系列列表接口
			listPrdSeries(params).then(res => {
				// let res = {
					// 	data:{
					// 		data:[{
					// 			ATTR_ADDED_LABEL: null,
					// 			ATTR_ADDED_LABEL_STATUS: 0,
					// 			AUTO_LABEL: null,
					// 			AUTO_UPPER: '1',
					// 			CREATE_ID: 18,
					// 			CREATE_TIME: "2018-05-04 11:26:43",
					// 			DEFINE_LABEL: "",
					// 			HOEM_PAGE_WORD_STATUS: 0,
					// 			ID: 175,
					// 			IS_SALES_SUM: "1",
					// 			ORG_ID: 176,
					// 			ORG_NAME: "晋中银行",
					// 			PRD_LABEL_STATUS: 0,
					// 			PRD_SERIES_NAME: "久盈宝系列",
					// 			PRD_SERIES_NO: "000000",
					// 			PRD_TYPE: "4",
					// 			PRD_TYPE_NAME: "存款管理",
					// 			RATE_NAME: "",
					// 			SUBTYPE: "1",
					// 			SUBTYPE_NAME: "活期存款",
					// 			UPDATE_ID: 18,
					// 			UPDATE_TIME: "2019-09-24 11:12:50",
					// 			UPDATE_USER: "宋畅",
					// 		}],
					// 	}
					// }
				console.log("获取产品系列数据",res)
				this.prdSeriesList = res.data.data
				this.totalSize = res.data.totalCount; //总条数
				this.loading = false;
				this.prdSeriesList.forEach(element => {
					element.PRD_LABEL_STATUS = element.PRD_LABEL_STATUS == 0 ? true:false;
					element.HOEM_PAGE_WORD_STATUS = element.HOEM_PAGE_WORD_STATUS == 0 ? true:false;
					element.ATTR_ADDED_LABEL_STATUS = element.ATTR_ADDED_LABEL_STATUS == 0 ? true:false;
				});
				console.log('遍历后',this.prdSeriesList)
			}).catch((err) => {
				console.log("获取产品系列数据err",err);
				this.loading = false;
			})
		},
		// 请求分页换页刷新 handleCurrentChange
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.getListPrdSeries() //调产品系列列表接口
		},
		//重置按钮
		resetForm(topCheckData){
			console.log('重置')
			this.$refs[topCheckData].resetFields();
		},
		//机构名称选中值发生变化时触发---获取下拉框的lable
		orgListSelect(val){
			console.log('当前value--ID',val)
			let obj = {}
			obj = this.allSelectData.orgList.find(function(item){
				return item.ID === val
			})
			this.dataForm.ORG_NAME = obj.ORG_NAME
		},
		//产品大类选中值发生变化时触发---获取下拉框的lable
		parentTypeListSelect(val){
			console.log('当前表单中value返回的是typeCode-->',val)
			let obj = {}
			obj = this.allSelectData.parentTypeList.find(function(item){
				return item.typeCode === val
			})
			this.dataForm.PRD_TYPE_NAME = obj.typeName

			//根据产品大类id--请求子类
			let params = {
				parentId: obj.id 
			}
			console.log('产品子类-->入参',params)
			getPrdTypeByParentId(params).then(res => {
				console.log("获取产品子类",res)
				this.allSelectData.allSubTypeList = res.data
			}).catch((err) => {
				console.log("产品主类型err",err);
			})
		},
		//产品子类选中值发生变化时触发---获取下拉框的lable
		allSubTypeListSelect(val){
			console.log('当前value--id',val)
			let obj = {}
			obj = this.allSelectData.allSubTypeList.find(function(item){
				return item.typeCode === val
			})
			this.dataForm.SUBTYPE_NAME = obj.typeName
		},
		// 显示新增界面弹窗
		handleAdd: function() {
			console.log('新增')
			this.dialogVisible = true;
			this.dataForm = { 
				ORG_ID:'', //机构id
				ORG_NAME:'', //机构名称
				PRD_TYPE: '',//产品大类编码
				PRD_TYPE_NAME:'', //产品大类名称
				SUBTYPE:'', //产品类型编码-产品小类编码
				SUBTYPE_NAME:'', //产品类型-产品小类名称
				PRD_SERIES_NAME:'', //产品系列名称
				RATE_ID:'', //利率
				RATE_NAME:'', //利率名称
				ATTR_ADDED_LABEL:'', //产品属性补充标签状态 
				AUTO_UPPER: 2,//上下架方式，1手动2自动
				AUTO_LABEL: '', //同系列标签是否同步
				PRD_LABEL_STATUS: false, //产品状态标签 //0是,1否
				HOEM_PAGE_WORD_STATUS: false,//首页推荐一句话 //0是,1否
				ATTR_ADDED_LABEL_STATUS: false, //产品属性补充标签 //0是,1否
			};
			Object.assign(this.dataForm);
		},
		// 显示编辑界面弹框
		handleEdit: function(row) {
			console.log('编辑row',row)
			this.dialogVisible = true;
			Object.assign(this.dataForm, row);
		},
		//新增保存提交
		submitFormAddSave: function (dataForm) {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.saveLoading = true
						// this.dataForm.AUTO_LABEL = this.dataForm.AUTO_LABEL == 1?'是':'否'
						this.dataForm.PRD_LABEL_STATUS = this.dataForm.PRD_LABEL_STATUS == true ? 0 : 1;
						this.dataForm.HOEM_PAGE_WORD_STATUS = this.dataForm.HOEM_PAGE_WORD_STATUS == true ? 0 : 1;
						this.dataForm.ATTR_ADDED_LABEL_STATUS = this.dataForm.ATTR_ADDED_LABEL_STATUS == true ? 0 : 1;
						let params = Object.assign({}, this.dataForm);
						console.log('新增保存入参',params)
						addPrdSeries(params).then((res) => {
							console.log("新增接口res",res);
							if(res.msgCode == 0){
								this.saveLoading = false
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.getListPrdSeries()
							}else{
								this.saveLoading = false
								this.$message({ message: res.msg, type: 'error' })
								this.dialogVisible = false
							}
						}).catch((err) => {
							console.log("新增接口err",err);
						})
					}).catch(() => {
						this.$message({type: 'info',message: '已取消新增'});        
					});
				}
			})
		},
		//编辑保存提交
		submitFormEditSave: function (dataForm) {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.saveLoading = true
						this.dataForm.PRD_LABEL_STATUS = this.dataForm.PRD_LABEL_STATUS == true ? 0 : 1;
						this.dataForm.HOEM_PAGE_WORD_STATUS = this.dataForm.HOEM_PAGE_WORD_STATUS == true ? 0 : 1;
						this.dataForm.ATTR_ADDED_LABEL_STATUS = this.dataForm.ATTR_ADDED_LABEL_STATUS == true ? 0 : 1;
						let params = Object.assign({},this.dataForm);
						console.log('编辑保存入参',params)
						//请求编辑接口
						updPrdSeries(params).then((res) => {
							console.log('编辑保存接口res',res)
							this.saveLoading = false
							this.$message({ message: '操作成功', type: 'success' })
							this.dialogVisible = false
							this.getListPrdSeries()
						}).catch((err) => {
							console.log("编辑接口err",err);
						})
					}).catch(() => {
						this.$message({type: 'info',message: '已取消编辑'});          
					});
				}
			})
		},

		// 选中当前行切换,值为单个对象 @current-change="handleCurrentChange"
		// handleCurrentChange: function (val) {
		// 	console.log('选中项 CurrentChange',val)
		// },
		// 单个删除
		handleDelete: function (index, row) {
			console.log('单个删除',row)
			this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
				this.loading = true
				let params ={
					ID: row.ID, //系列ID
					PRD_TYPE: row.PRD_TYPE //产品大类编码
				}
				console.log('单个删除入参',params)
				delPrdSeries(params).then(res => {
					console.log('删除res',res)
					this.$message({message: '删除成功', type: 'success'})
					this.getListPrdSeries() //刷新当前页
					this.loading = false
				})
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});          
			});
		},
		// 选中多选框切换,值为数组
		selectionChange: function (selections) {
			this.selections = selections
			console.log('选中项',this.selections)
		},
		// 批量删除
		handleBatchDelete: function () {
			console.log('批量删除')
			this.$confirm('确认删除选中记录吗？', '提示', {type: 'warning'}).then(() => {
				this.loading = true
				let ids = []
				this.selections.map(item => {
					ids.push(item.ID)
				})
				let params = {
					'IDS': ids.toString()
				}
				console.log('删除params',params)
				getRoleDeletes(params).then(data => {
					this.$message({message: '删除成功', type: 'success'})
					this.getListPrdSeries() //刷新当前页
					this.loading = false
				})
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});          
			});
		},

	},
	
}
</script>

<style lang="less" scoped>
    .productDrawingManage{
        padding: 20px;
    }
	.topBox{
		border-bottom: 1px solid #EBEEF5;
	}
	.addBtn{
		margin: 18px 0;
	}
	.addForm{
		.el-input,.el-select{
			width: 50%;
		}
		.tipText{
			padding-left: 12px;
			color: #999;
		}
	}
</style>
