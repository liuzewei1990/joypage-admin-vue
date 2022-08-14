<template>
  <div class="productSeries">
	<CommonTable :isFluid="false" @height="tableHeight=$event">
		<!--标头列表-->
		<div slot="search">
			<el-form :inline="true" :model="topCheckData" :size="size" ref="topData">
				<el-form-item label="机构名称：" prop="orgName">
					<el-select v-model="topCheckData.orgName" placeholder="请选择机构名称" filterable clearable>
						<el-option v-for="item in allSelectData.orgList"
						:key="item.ID" :label="item.ORG_NAME" :value="item.ORG_NAME">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品大类：" prop="parentTypeCode">
					<el-select v-model="topCheckData.parentTypeCode" placeholder="请选择产品大类" clearable
					@change='parentTypeListSelect'>
						<el-option v-for="item in allSelectData.parentTypeList"
						:key="item.typeCode" :label="item.typeName" :value="item.typeCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="存款类型：" prop="typeCode">
					<el-select v-model="topCheckData.typeCode" placeholder="请选择存款类型" clearable
					@change='allSubTypeListSelect'>
						<el-option v-for="item in allSelectData.allSubTypeList"
						:key="item.typeCode" :label="item.typeName" :value="item.typeCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="存款系列：" prop="seriesName">
					<el-input v-model="topCheckData.seriesName" placeholder="请输入存款系列名称"></el-input>
				</el-form-item>
				<el-form-item label="操作人：" prop="updateUser">
					<el-input v-model="topCheckData.updateUser" placeholder="请输入操作人名称"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<!-- 操作按钮区 -->
		<div slot="action">
			<el-button class="addBtn" style="float:left;" :size="size" icon="el-icon-plus" type="primary"  @click="handleAdd()">新增</el-button>
			<el-button icon="el-icon-refresh" style="float:right;" :size="size" @click="resetForm('topData')">重置</el-button>
			<el-button icon="el-icon-search" style="float:right;" :size="size" type="primary" @click="getListPrdSeries('chaxun')">查询</el-button>
		</div>
		<!-- 表格内容栏 -->
		<el-table :height="tableHeight" size="mini" :data="prdSeriesList" style="width: 100%" stripe border="true"
			@selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
			<!-- 多选type="selection" 取索引type="index"-->
			<el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column type="index" label="序号" width="100" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="ID" label="存款系列ID" width="100" header-align="center" align="center"></el-table-column>
			<el-table-column prop="ORG_NAME" label="机构名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="PRD_TYPE_NAME" label="产品类型" header-align="center" align="center"></el-table-column>
			<el-table-column prop="PRD_SERIES_NAME" label="产品系列名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="AUTO_UPPER" label="上下架方式"  header-align="center" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.AUTO_UPPER==1" :size="size">自动</p>
					<p v-if="scope.row.AUTO_UPPER==2" :size="size">手动</p>
				</template>
			</el-table-column>
			<el-table-column prop="UPDATE_USER" label="操作人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="UPDATE_TIME" label="上次更新时间" header-align="center" align="center" width="170px"></el-table-column>
			<!-- <el-table-column prop="UPD_TIME" label="更新时间" header-align="center" align="center"></el-table-column> -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center">
				<template slot-scope="scope">
				<el-button  size="mini" type="text"  @click="handleEdit(scope.row,scope.$index)">修改</el-button>
				<el-button  size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页栏-->
		<div slot="footer">
			<!-- <el-button :size="size" type="danger" style="float:left;" @click="handleBatchDelete()">批量删除</el-button> -->
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
	<el-dialog :title="!dataForm.ID ? '新增' : '修改'" width="60%" :visible.sync="dialogVisible" :before-close="closeDialog">
		<el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size"
			label-position="left" class="addForm">
			<el-form-item label="机构名称：" prop="ORG_ID">
				<el-select v-model="dataForm.ORG_ID" placeholder="请选择机构名称" filterable clearable
				@change='orgListSelect'>
					<el-option v-for="item in allSelectData.orgList"
					:key="item.ID" :label="item.ORG_NAME" :value="item.ID">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品大类：" prop="PRD_TYPE">
				<el-select v-model="dataForm.PRD_TYPE" placeholder="请选择产品大类" clearable
				@change='parentTypeListSelect'>
					<el-option v-for="item in allSelectData.parentTypeList"
					:key="item.id" :label="item.typeName" :value="item.typeCode">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品类型：" prop="SUBTYPE">
				<el-select v-model="dataForm.SUBTYPE" placeholder="请选择产品类型" clearable
				@change='allSubTypeListSelect'>
					<el-option v-for="item in allSelectData.allSubTypeList"
					:key="item.id" :label="item.typeName" :value="item.typeCode">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品系列名称：" prop="PRD_SERIES_NAME">
				<el-input v-model="dataForm.PRD_SERIES_NAME" placeholder="请输入产品系列名称"></el-input>
			</el-form-item>
			<el-form-item label="利率名称：" prop="RATE_NAME">
				<el-input v-model="dataForm.RATE_NAME" placeholder="请输入利率名称"></el-input>
			</el-form-item>
			<el-form-item label="产品状态标签：" prop="PRD_LABEL">
				<el-input v-model="dataForm.PRD_LABEL" placeholder="请输入产品状态标签"></el-input>
			</el-form-item>
			<el-form-item label="首页推荐一句话：" prop="HOEM_PAGE_WORD">
				<el-input v-model="dataForm.HOEM_PAGE_WORD" placeholder="请输入首页推荐一句话"></el-input>
			</el-form-item>
			<el-form-item label="产品属性补充标签：" prop="ATTR_ADDED_LABEL">
				<el-input v-model="dataForm.ATTR_ADDED_LABEL" placeholder="请输入产品属性补充标签"></el-input>
			</el-form-item>
			<el-form-item label="上下架方式：" prop="AUTO_UPPER">
				 <el-radio-group v-model="dataForm.AUTO_UPPER">
					<el-radio :label='1'>自动</el-radio>
					<el-radio :label='2'>手动</el-radio>
				 </el-radio-group>
			</el-form-item>
			<el-form-item label="同系列标签是否同步：" prop="AUTO_LABEL">
				<el-select v-model="dataForm.AUTO_LABEL" placeholder="请选择" clearable>
					<el-option v-for="item in autoLableList"
					:key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item  label="多选：">
				<el-checkbox v-model="dataForm.PRD_LABEL_STATUS" label="产品状态标签"></el-checkbox>
				<el-checkbox v-model="dataForm.HOEM_PAGE_WORD_STATUS" label="首页推荐一句话"></el-checkbox>
				<el-checkbox v-model="dataForm.ATTR_ADDED_LABEL_STATUS" label="产品属性补充标签状态"></el-checkbox>
			</el-form-item >
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
// 接口函数依次：产品所有下拉框列表,产品子类,产品系列列表,新增保存，修改保存，删除保存，请求利率名称
import { forPrdSeriesPage,getPrdTypeByParentId,listPrdSeries,addPrdSeries,updPrdSeries,delPrdSeries,getPrdTypeByTypeCode } from "../../apis/index"
import CommonTable from "@common/finsuit-components/CommonTable"
export default {
	name: 'productManage',
	components:{ CommonTable },
	data() {
		return {
			size: 'small',
			topCheckData: { //标头列表输入框数据
				orgName: '', //机构名称
				parentTypeCode:'', //产品大类
				typeCode: '', //存款类型-- 产品子类型编码
				// typeName:'',//产品类型名称
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
				PRD_LABEL:'',//产品状态标签
				HOEM_PAGE_WORD:'', //首页推荐一句话文案
				ATTR_ADDED_LABEL:'', //产品属性补充标签
				AUTO_UPPER: Number,//上下架方式，1手动2自动
				AUTO_LABEL: Number, //同系列标签是否同步
				PRD_LABEL_STATUS: Boolean, //产品状态标签  0:是 1:否
				HOEM_PAGE_WORD_STATUS: Boolean,//首页推荐一句话  0:是 1:否
				ATTR_ADDED_LABEL_STATUS: Boolean, //产品属性补充标签状态 0:是 1:否
				UPDATE_ID:'', //修改人ID
				UPDATE_USER:'', //修改人
			},
			formRules: { //弹框校验规则
				PRD_TYPE:[
					{ required: true, message: '请选择产品大类', trigger: 'change' }
				],
				SUBTYPE:[
					{ required: true, message: '请选择产品类型', trigger: 'change' }
				],
				PRD_SERIES_NAME:[
					{ required: true, message: '请输入产品系列名称', trigger: 'blur' },
					{ min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
				],
				RATE_NAME:[
					{ required: true, message: '请输入利率名称', trigger: 'blur' },
					{ min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
				],
				AUTO_LABEL:[
					{ required: true, message: '请选择同系列标签是否同步', trigger: 'change' },
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
				if(res.code == 0){
					//产品机构名称数组
					this.allSelectData.orgList = res.data.orgList
					//产品父类型数组
					this.allSelectData.parentTypeList = res.data.parentTypeList
					//产品子类型数组://不用这里的子类了
					// this.allSelectData.allSubTypeList = res.data.allSubTypeList
				}else{
					console.log('失败')
				}
			}).catch((err) => {
				console.log("获取产品系列数据err",err);
			})
		},
		// 获取产品系列列表数据
		getListPrdSeries: function(type) {
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
				ORG_NAME: this.topCheckData.orgName, //机构名称
				PARENT_TYPE_CODE: this.topCheckData.parentTypeCode, //产品大类
				TYPE_CODE: this.topCheckData.typeCode, //产品子类型编码
				SERIES_NAME: this.topCheckData.seriesName, //产品系列名称
				UPDATE_USER: this.topCheckData.updateUser, //操作人
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
		// 点击页数--分页刷新 
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.getListPrdSeries() //调产品系列列表接口
		},
		// 点击条数--分页刷新
		handleSizeChange(val){
			console.log(`当前条数: ${val}`);
			this.pageRequest.pageSize = val
			this.getListPrdSeries() //调产品系列列表接口
		},
		//重置按钮
		resetForm(topData){
			console.log('重置')
			this.$refs[topData].resetFields();
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
			this.topCheckData.typeCode = ''; //每次点击产品大类，先将存款类型置空
			console.log('当前表单中value返回的是typeCode-->',val)
			let obj = {}
			obj = this.allSelectData.parentTypeList.find(function(item){
				return item.typeCode === val
			})
			this.dataForm.PRD_TYPE_NAME = obj.typeName

			//根据产品大类id--请求子类
			let params = {
				parentId: obj.typeCode //父类的id,和typeCode,是一个样的
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

			//根据产品大类id和产品子类id--请求利率名称
			let params = {
				parentTypeCode: obj.parentId,  // 存款产品大类编码,
				subtypeTypeCode: val  //产品小类编码
			}
			console.log('请求利率名称-->入参',params)
			getPrdTypeByTypeCode(params).then(res => {
				console.log("获取利率名称",res)
				this.dataForm.RATE_NAME = res.data.rateName //先继承类别里的利率名称
			}).catch((err) => {
				console.log("获取利率名称err",err);
			})
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
				PRD_LABEL:'',//产品状态标签
				HOEM_PAGE_WORD:'', //首页推荐一句话文案
				ATTR_ADDED_LABEL:'', //产品属性补充标签状态 
				AUTO_UPPER: 2,//上下架方式，1手动2自动
				AUTO_LABEL: 0, //同系列标签是否同步，//0是,1否
				PRD_LABEL_STATUS: false, //产品状态标签 //0是,1否
				HOEM_PAGE_WORD_STATUS: false,//首页推荐一句话 //0是,1否
				ATTR_ADDED_LABEL_STATUS: false, //产品属性补充标签 //0是,1否
				CREATE_ID: '', //创建人ID
			};
			Object.assign(this.dataForm);
		},
		// 显示编辑界面弹框
		handleEdit: function(row) {
			console.log('编辑row',row)
			this.dialogVisible = true;
			Object.assign(this.dataForm, row);
			//每次点击修改调用一下大类请求小类的接口
			this.parentTypeListSelect(row.PRD_TYPE)
		},
		//点击保存按钮，必填项有未填写内容时，弹框提示，并把光标定为到第一个未录入的输入框
		fromRequired(){
			//获取当前必录的校验词并弹框提示输入具体必录项
			setTimeout(()=>{
				// console.log(document.getElementsByClassName('el-form-item__error'))
				if(document.getElementsByClassName('el-form-item__error').length>0){
				this.$notify.error({ 
					title: '提示',  
					message: document.getElementsByClassName('el-form-item__error')[0].innerText
				}); 
				}
			},100);
			//获取未录入的第一个必录项的输入框并定位到此处
			setTimeout(()=>{
				// console.log(document.getElementsByClassName('is-error is-required'))
				var isError= document.getElementsByClassName("is-error is-required");
				if(isError.length>0){
					isError[0].querySelector('input').focus();
				}
			},100);
		},
		//新增保存提交
		submitFormAddSave: function (dataForm) {
			this.fromRequired(); //调用必填项的校验方法
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.saveLoading = true
						this.dataForm.PRD_LABEL_STATUS = this.dataForm.PRD_LABEL_STATUS == true ? 0 : 1;
						this.dataForm.HOEM_PAGE_WORD_STATUS = this.dataForm.HOEM_PAGE_WORD_STATUS == true ? 0 : 1;
						this.dataForm.ATTR_ADDED_LABEL_STATUS = this.dataForm.ATTR_ADDED_LABEL_STATUS == true ? 0 : 1;
						let params = Object.assign({}, this.dataForm);
						console.log('新增保存入参',params)
						addPrdSeries(params).then((res) => {
							console.log("新增接口res",res);
							if(res.code == 0){
								this.saveLoading = false
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.getListPrdSeries()
								this.$refs.dataForm.resetFields(); //清空数据
							}else{
								this.saveLoading = false
								this.$message({ message: res.msg, type: 'error' })
								this.dialogVisible = false
								this.getListPrdSeries()
								// this.$refs.dataForm.resetFields(); //清空数据
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
	/deep/ .el-table__fixed-body-wrapper {
		top: 37px !important;
	}
    .productSeries{
        padding: 20px;
    }
	// .topBox{
	// 	border-bottom: 1px solid #EBEEF5;
	// }
	// .addBtn{
	// 	margin: 18px 0;
	// }
	.addForm{
		.el-input,.el-select{
			width: 100%;
		}
		.tipText{
			padding-left: 12px;
			color: #999;
		}
	}
</style>
