<template>
<!-- 配置管理-惠普理财账户-收益升级配置 -->
  <div class="prdSeries">
    <CommonTable :isFluid="false" @height="tableHeight=$event">
		<!--标头查询区-->
		<div slot="search">
			<el-form :inline="true" :size="size"  :model="topCheckData" ref='topData'>
				<el-form-item label="关键字：" prop="keywords">
					<el-input v-model="topCheckData.keywords" placeholder="请输入关键字" clearable></el-input>
				</el-form-item>
				<el-form-item label="机构ID：" prop="orgId">
					<el-input v-model="topCheckData.orgId" placeholder="请输入机构ID" clearable></el-input>
				</el-form-item>
				<el-form-item label="系统：" prop="systemTypes">
					<el-select v-model="topCheckData.systemTypes" placeholder="请选择系统" clearable >
						<el-option v-for="item in allSelectData.systemTypeList"
						:key="item.name" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<!-- 操作按钮区 -->
		<div slot="action">
			<el-button class="addBtn" :size="size" icon="el-icon-plus" style="float:left" type="primary" @click="handleAdd()">新增</el-button>
			<el-button class="importBtn" :size="size" icon="el-icon-sort-down" style="float:left" type="primary" @click="dialogUploadVisible = true" >批量导入</el-button>
			<el-button class="exportBtn" :size="size" icon="el-icon-sort-up" style="float:left" type="primary" @click="handleExport()">导出</el-button>
			<el-button icon="el-icon-refresh" :size="size" style="float:right" @click="resetForm()">重置</el-button>
			<el-button icon="el-icon-search" :size="size" style="float:right" type="primary" @click="getEarningsSelect('chaxun')">查询</el-button>
		</div>
		<!-- 表格内容栏 -->
		<el-table :height="tableHeight" size="mini" :data="earningsList" style="width: 100%" stripe border="true"
			@selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
			<el-table-column prop="seqOrder" label="排序" width="50" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orgId" label="机构ID" header-align="center" align="center" width="100px"></el-table-column>
			<el-table-column prop="orgName" label="机构名称" header-align="center" align="center"></el-table-column>
            <el-table-column prop="activityLabels" label="活动标签" header-align="center" align="center"></el-table-column>
            <el-table-column prop="activityLinks" label="活动地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createDatetime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="startDatetime" label="开始时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="endDatetime" label="结束时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="appFlagsNames" label="渠道" header-align="center" align="center"></el-table-column>
			<el-table-column prop="systemTypeNames" label="系统" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
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
			@size-change="handleSizeChange"
			@current-change="refreshPageRequest"
			:current-page="pageRequest.pageNum"
			:page-sizes="[10, 20, 30, 40]"
			:page-size="pageRequest.pageSize">
			</el-pagination>
		</div>
	</CommonTable>
    <!-- 导入文件弹窗 -->
	<el-dialog title="导入文件" ref="upload" class="uploadDialog" :visible.sync="dialogUploadVisible" :destroy-on-close="true" :close-on-click-modal="false">
		<el-upload
			class="upload-demo"
			ref="upload"
			:limit='limitNum'
			:auto-upload="false"
			accept=".xls,.xlsx"
			action="#"
			:before-upload="beforeUploadFile"
			:on-change="fileChange"
			:on-exceed="exceedFile"
			:file-list="fileList"
			:on-remove="remove">
			<el-button size="small" type="primary">点击上传</el-button>
			<span class="el-upload__tip" slot="tip">只能上传xlsx/xls文件，且不超过10M</span>
		</el-upload>
		<div class="uploadBTtn">
			<el-button class="import" size="small" type="success" @click="uploadFile()" :loading="saveLoading">立即导入</el-button>
			<el-button size="small" @click="dialogUploadVisible = false">取消</el-button>
		</div>
	</el-dialog>
	<!-- 新增弹框 -->
	<el-dialog :title="!dataForm.id ? '新增' : dialogTitle" width="630px" :visible.sync="dialogVisible" :before-close="closeDialog">
		<el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size"
			label-position="left" class="addForm">
            <el-form-item label="选择机构：" prop="orgId">
                 <BcSelect v-if="dialogVisible" :apiType="2" v-model="dataForm.orgId" :filterable="true" :remote="true" placeholderText="请输入/选择机构" ref="OrgBcSelect"></BcSelect>
			</el-form-item>
            <el-form-item label="活动标签：" prop="activityLabels">
                <el-input v-model="dataForm.activityLabels" placeholder="请填写活动标签"></el-input>
            </el-form-item>
            <el-form-item label="活动地址（连接）：" prop="activityLinks">
                <el-input v-model="dataForm.activityLinks" placeholder="请填写活动地址（连接）"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="seqOrder">
                <el-input type="number" v-model="dataForm.seqOrder" placeholder="请填写排序"></el-input>
            </el-form-item>
            <el-form-item label="发布时间：" prop="dateTime">
                 <el-date-picker v-model="dataForm.dateTime" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  style="width: 100%;"></el-date-picker>
			</el-form-item>
            <el-form-item label="生效渠道：" prop="appFlags">
                <el-checkbox-group v-model="dataForm.appFlags" :min="1">
					<el-checkbox label="BC" border>识贝比</el-checkbox>
                    <el-checkbox label="PC" border>识贝拼</el-checkbox>
                    <el-checkbox label="PMP" border>小程序</el-checkbox>
                    <el-checkbox label="YIYE" border>异业</el-checkbox>
				</el-checkbox-group>
                <!-- <el-select v-model="dataForm.appFlags" multiple placeholder="请选择渠道">
                    <el-option v-for="item in allSelectData.appFlagList"
                    :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select> -->
			</el-form-item>
             <el-form-item label="生效设备：" prop="systemType">
				<el-checkbox-group v-model="dataForm.systemType" :min="1">
					<el-checkbox label="android" border>安卓</el-checkbox>
                    <el-checkbox label="ios" border>苹果</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="cancleFrom('dataForm')">取消</el-button>
			<el-button :size="size" type="primary" @click.native="submitFormSave('dataForm')" :loading="saveLoading">保存</el-button>
		</div>
	</el-dialog>
  </div>
</template>
<script>
// 接口函数依次：获取所有标签，功能开关，查询列表，新增，修改，删除
import {getEarningsSelect,updateEarningsSave,getEarningsDelete,getEarningsImportFile} from "../../apis/index";
import config from '../../config/config.index.js'
import BcSelect from "./BcSelect"
import CommonTable from "@common/finsuit-components/CommonTable"
export default {
    name: 'EarningsUpgrades',
    components: { BcSelect,CommonTable },
	data() {

        //验证排序值是正整数
        let validatorSeqOrder =(rule, value, callback) => {
            if (value ==''){
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

		return {
			tableHeight:0, //内容高度
            headerModel:{
                systemType:'h5',
                appFlag:'BC'
            }, //接口入参
			imageUrl:'', //图片前面有域名的部分地址
			size: 'small',
            topCheckData: { //顶部搜索选择的工具内容
                orgId:'', //机构ID
                keywords:'',  //关键字
                systemTypes:'', //系统
			},
			loading:false, //请求列表时loading
			proName:'', //内容-内容
			pageRequest:{ //内容分页
				pageNum:'1',
				pageSize:'10',
				totalPage:'0',
			},
			earningsList: [], //请求回来的表格列表数据list
			allSelectData:{
                // appFlagList:[
                //     {
                //         name:"识贝比",
                //         id: 'BC'
                //     },
                //     {
                //         name:"识贝拼",
                //         id: 'PC'
                //     },
                //     {
                //         name:"小程序",
                //         id: 'PMP'
                //     },
                //     {
                //         name:"异业",
                //         id: 'YIYE'
                //     }
                // ],
				systemTypeList:[
					{
						'name':'全部',
						'value': 'android,ios'
					},
					{
						'name':'安卓',
						'value': 'android'
                    },
                    {
						'name':'苹果',
						'value': 'ios'
					}
				], //状态list
			},
			dialogTitle:'新增',
			saveLoading: false,  //保存时按钮loading
			// 新增和编辑
			dialogVisible: false, //是否展示新增编辑弹框
			dataForm: {  //修改弹框数据
				id:'', //
				productOrType: '', //1产品id,2产品类型
				orgId:'', //机构
				prdTypeId:'', //类型id
                prdIndexId:'', //产品id
                activityLabels:'',//活动标签
                activityLinks:'',//活动地址（连接）
                seqOrder:'',//排序
                dateTime: '',
				startDatetime: '', //开始时间
                endDatetime: '', //结束时间
                appFlags: [], //渠道
                systemType: [], //系统
            },
            //导入
            dialogUploadVisible: false, //是否显示导入的上传文件的弹框
			limitNum: 1,  // 上传excell时，同时允许上传的最大数
			fileObj: {},   // 单个要上传的文件
            fileList: [], //要上传的文件列表数组--多个文件
            //新增/修改表单校验规则
            formRules: {
                orgId: [{ required: true, message: '请选择机构', trigger: 'change' }],
                seqOrder: [{ required: true, validator: validatorSeqOrder, trigger: 'change' }],
                appFlags:[{required: true, message: '请选择生效渠道', trigger: 'change'}]
			},
		}
	},
	watch: {
		dialogUploadVisible(newVal){
			this.dialogUploadVisible = newVal
			// console.log('newVal',newVal)
			if(newVal){
				this.fileObj = {} //清空data中数据
			}
		},
	},
  	mounted() {
		//图片初始化地址：
		this.imageUrl = config.baseUrlHost+'/finsuitImgDisplay/show?path=';
		// console.log('图片初始地址-imageUrl',this.imageUrl)
		this.getEarningsSelect() //列表数据
	},
	methods: {
        dateFormat (fmt, date) {
            let ret;
            const opt = {
                "Y+": date.getFullYear().toString(),        // 年
                "m+": (date.getMonth() + 1).toString(),     // 月
                "d+": date.getDate().toString(),            // 日
                "H+": date.getHours().toString(),           // 时
                "M+": date.getMinutes().toString(),         // 分
                "S+": date.getSeconds().toString()          // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        },
        // 获取列表数据
		async getEarningsSelect(type) {
			this.loading = true;
			if(type == 'chaxun'){
				console.log('chauxn')
				this.pageRequest.pageNum = 1; //初始化--第一条开始查
				this.pageRequest.pageSize = 10; //初始化--查询10条
			}
			let params = {
                headerModel:this.headerModel,
                datatypeParam:{
                    length: this.pageRequest.pageSize, //查询多少条
                    currentPage: this.pageRequest.pageNum, //当前页数
                    orgId: this.topCheckData.orgId, //机构id
                    keywords: this.topCheckData.keywords, //关键字
                    systemTypes: this.topCheckData.systemTypes, //系统
                }
			}
			console.log('列表数据入参',params)

			try {
				let resData = await getEarningsSelect(params)//接口
				// console.log("列表数据",resData)
				this.loading = false;
				this.earningsList = resData.retList  //列表list
                console.log(resData.retList )
				this.totalSize = resData.totalCount; //总条数
			} catch (error) {
				this.$message({ message: '数据获取异常', type: 'error' })
			}
			setTimeout(() => {
				this.loading = false;
			}, 100);
		},
		// 点击页数--分页刷新
		refreshPageRequest: function (val) {
			// console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.getEarningsSelect() //调基金公司列表接口
		},
		// 点击条数--分页刷新
		handleSizeChange(val){
			// console.log(`当前条数: ${val}`);
			this.pageRequest.pageSize = val
			this.getEarningsSelect() //调产品系列列表接口
		},
		//重置
		resetForm(){
			// console.log('重置')
            this.$refs.topData.resetFields();
            this.getEarningsSelect() //调产品系列列表接口
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
			// console.log('新增')
            this.dialogVisible = true;
            // this.$nextTick(()=>{
            //     this.$refs["OrgBcSelect"].$el.querySelector("input").value = '';
            // })
			this.dataForm = {
				productOrType: '', //1产品id,2产品类型
				orgId:'', //机构
				prdTypeId:'', //类型id
                prdIndexId:'', //产品id
                activityLabels:'',//活动标签
                activityLinks:'',//活动连接
                seqOrder:'',//排序
                dateTime: [this.dateFormat("YYYY-mm-dd HH:MM:SS", new Date()), "2099-12-31 23:59:00"],
				startDatetime: '', //排序
                endDatetime: '', //结束时间
                appFlags:["BC"], //渠道  //新增时默认 识贝比
                systemType:['android','ios'], //系统 //新增时默认全选
			};
            Object.assign(this.dataForm);
		},
		// 显示编辑界面弹框--回显
		handleEdit: function(row,index) {
			// console.log('编辑',row)
			this.dialogTitle = '修改'
            this.dialogVisible = true;
            Object.assign(this.dataForm, row);
            this.dataForm.orgId = { //组件回来的orgId为对象--解决自动匹配机构和类型时因列表中没有该项导致回显失败的问题
                id: row.orgId,
                name: row.orgName
            }
            // this.dataForm.orgId = this.dataForm.orgId.id //组件回来的orgId为对象
            //机构回显时赋值---手动给input赋值，解决自动匹配机构和类型时因列表中没有该项导致回显失败的问题
            // this.$nextTick(()=>{
            //     this.$refs["OrgBcSelect"].$el.querySelector("input").value = row.orgName;
            // })

            //渠道，设备回显，需转为数组
            if (row.appFlags) this.dataForm.appFlags = (row.appFlags + "").split(","); //渠道回显
            if (row.systemType) this.dataForm.systemType = (row.systemType + "").split(","); //设备回显
            if (row.startDatetime && row.endDatetime) { //时间回显
                this.dataForm.dateTime = [row.startDatetime, row.endDatetime];
            }
		},
		//新增/修改稿保存提交
		submitFormSave (dataForm) {
			// console.log('保存')
			let params = {
                headerModel: this.headerModel,
                datatypeParam: {
                    id: this.dataForm.id,
                    orgId: this.dataForm.orgId.id,//组件回来的orgId为对象,直接去对象中id即可
                    activityLabels:this.dataForm.activityLabels,//活动标签
                    activityLinks:this.dataForm.activityLinks,//活动连接
                    seqOrder:this.dataForm.seqOrder,//排序
                    startDatetime: this.dataForm.dateTime[0], //开始时间
                    endDatetime: this.dataForm.dateTime[1],  //结束时间
                    appFlags: this.dataForm.appFlags.join(),  //将数组转为字符串 渠道
                    systemType: this.dataForm.systemType.join(), //将数组转为字符串 设备
                }
			};
			console.log('保存入参',params.datatypeParam)
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						updateEarningsSave(params).then((resData) => {
							console.log("保存接口",resData);
							this.saveLoading = false
							if (this.dialogTitle === "新增") {
								this.$message({ message: "添加成功", type: 'success' })
							} else {
								this.$message({ message: "修改成功", type: 'success' })
							}
							this.dialogVisible = false
							this.getEarningsSelect() //刷新列表
						}).catch((err) => {
							console.log("新增接口err",err);
							this.$message({ message: err, type: 'error' })
						})
					}).catch(() => {
                        this.$message({type: 'info',message: '已取消新增'});
                        this.saveLoading = false
					});
				}
			})
		},

		// 单个删除
		handleDelete (index, row) {
			console.log('单个删除',row)
            this.$confirm('确定要删除此条内容？', '提示', {type: 'warning'}).then(() => {
                this.loading = true
                let params = {
                        headerModel: this.headerModel,
                        datatypeParam:{ ids: row.id }
                    }
                console.log('单个删除入参',params)
                getEarningsDelete(params).then(resData => {
                    console.log("删除接口",resData);
					this.loading = false
					this.$message({message: '删除成功', type: 'success'})
					this.getEarningsSelect() //刷新当前页
                }).catch((err) => {
                    console.log("删除接口err",err);
                    this.loading = false
                    this.$message({ message: err, type: 'error' })
                })
            }).catch(() => {
                this.$message({type: 'info',message: '已取消删除'});
                this.loading = false
            });
		},

        //导入--上传文件-----------start-------------------------
		// 文件超出个数限制时的钩子
		exceedFile(files, fileList) {
			this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
		},
		// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
		beforeUploadFile(file) {
			console.log('before upload');
			console.log(file);
			let extension = file.name.substring(file.name.lastIndexOf('.')+1);
			let size = file.size / 1024 / 1024;
			if(extension !== 'xls' || extension !== 'xlsx') {
				this.$message.warning('只能上传后缀是.xlsx/.xls的文件');
			}
			if(size > 10) {
				this.$message.warning('文件大小不得超过10M');
			}
		},
		// 文件状态改变时的钩子
		fileChange(file, fileList) {
			this.fileObj = file.raw
			console.log('要上传的文件',this.fileObj);
		},
		//导入调接口
		uploadFile() {
			if (Object.keys(this.fileObj).length === 0){
				this.$message.warning('请上传文件');
			} else {
				console.log(this.fileObj)
				let form = new FormData();
				form.append('importFile', this.fileObj);
				//调导入接口
				getEarningsImportFile(form).then((resData) => {
                    console.log('导入请求返回',resData)
					this.saveLoading = false
					this.$message({ message: '文件导入成功', type: 'success' })
					this.dialogUploadVisible = false
					this.$refs.upload.clearFiles()  //清空文件
					this.fileObj = {} //清空data中数据
					this.getEarningsSelect() //刷新当前页
				}).catch((err) => {
					console.log("存款导入err",err);
				})
			}
		},
		remove(){
			this.fileObj = {} //清空data中数据
		},
		//--------------end---------------------------
		//直接动态添加a标签导出
		handleExport(){
			if (this.earningsList.length === 0) {
				this.$message({ message: "没有要导出的数据", type: 'info' })
				return;
			}
            let a = document.createElement('a')
            a.href = config.baseUrlHost + "/cInclusiveAccountProfit/exportFile?"
            + 'orgId=' + this.topCheckData.orgId + '&keywords=' + this.topCheckData.keywords + '&systemTypes=' + this.topCheckData.systemTypes;
            a.click();
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
	// .action{
	// 	padding: 10px 0;
	// 	height: 32px;
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

    .uploadDialog {
		/deep/ .el-dialog__body {
			padding: 30px 20px 60px;
			// .el-upload-dragger{
			// 	width: 632px;
			// }
			.el-upload__tip{
				padding-left: 20px;
			}
			.uploadBTtn{
				float: right;
			}
		}
	}
</style>
