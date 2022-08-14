<template>
<!-- 广告位置管理--券商活动H5落地页-->
  <div class="prdSeries" >
		<!--标头查询区-->
    <!-- <CommonTable :isFluid="false" @height="tableHeight=$event"> -->
		<div slot="search">
			<el-form :inline="true" :size="size"  :model="backgroudColor" ref='topData'>
                <el-form-item label="页面底色：" prop="backgroudColor">
					<el-input v-model="backgroudColor" placeholder="请点击有边颜色按钮选择修改颜色"></el-input>
                </el-form-item>
                <el-color-picker ref="dropdown" :size="size" v-model="backgroudColor"  @change="colorChange"></el-color-picker>

				<el-form-item style="padding-left:10px">
                    <el-button size="mini" type="primary" @click="handleSure()">修改</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 父表格内容栏 -->
		<el-table height='200px' size="mini" :data="positionList" style="width: 100%;" stripe border="true"
			@selection-change="selectionChange" v-loading="" element-loading-text="loading...">
			<el-table-column type="index" prop="id" label="序号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="位置名称" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="handleCheck(scope.row,scope.$index)">{{scope.row.name}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="showType" label="显示类型" header-align="center" align="center" width="80px">
				<template slot-scope="scope">
					<p v-if="scope.row.showType==1" :size="size">列表</p>
				</template>
			</el-table-column>
			<el-table-column prop="appFlagsNames" label="投放渠道" header-align="center" align="center"></el-table-column>
			<el-table-column prop="systemTypeNames" label="发布设备" header-align="center" align="center"></el-table-column>
			<el-table-column prop="count" label="已投广告数量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="state" label="是否开启" header-align="center" align="center">
                <template slot-scope="scope">
                    <p v-if="scope.row.state==0" :size="size">已开启</p>
                    <p v-if="scope.row.state==1" :size="size">已停用</p>
                </template>
            </el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="handleUpdateState(scope.row,scope.$index,0)" v-if='scope.row.state==1'>开启</el-button>
					<el-button size="mini" type="text" @click="handleUpdateState(scope.row,scope.$index,1)" v-else>停用</el-button>
					<!-- <el-button size="mini" type="text" @click="handleCheck(scope.row,scope.$index)">查看列表</el-button> -->
					<el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index)">修改位置</el-button>
				</template>
			</el-table-column>
		</el-table>
	<!-- </CommonTable> -->
	<!-- 修改弹框 -->
	<el-dialog title="修改" width="40%" :visible.sync="dialogVisible" :before-close="closeDialog">
		<el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size"
			label-position="left" class="addForm">
			 <el-form-item label="位置名称：" prop="name">
				<el-input v-model="dataForm.name" placeholder="请输入位置名称"></el-input>
			</el-form-item>
			 <el-form-item label="备注：" prop="remark">
				<el-input v-model="dataForm.remark" placeholder="请输入备注"></el-input>
			</el-form-item>
            <el-form-item label="显示类型：" prop="showType">
				<el-select v-model="dataForm.showType" placeholder="请选择显示类型" clearable >
					<el-option v-for="item in allSelectData.showTypeList"
					:key="item.name" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			 <el-form-item label="投放渠道：" prop="appFlag">
				<el-select v-model="dataForm.appFlag" placeholder="请选择投放渠道" multiple clearable >
					<el-option v-for="item in allSelectData.appFlagList"
					:key="item.name" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			 <el-form-item label="发布设备：" prop="advPlatform">
				<el-select v-model="dataForm.advPlatform" placeholder="请选择发布设备" multiple clearable >
					<el-option v-for="item in allSelectData.advPlatformList"
					:key="item.name" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
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
import {getPositionList,getUpdatePosition,getUpdatePositionSave,getUpdateState,getSelectBackgroud,getUpdateBackgroudColor} from "../../apis/index";
import BcSelect from "@common/finsuit-components/BcSelect"
import config from '../../config/config.index.js'
import CommonTable from "@common/finsuit-components/CommonTable"
export default {
    name: 'EarningsUpgrades',
    components: {CommonTable,BcSelect},
	data() {
		return {
			tableHeight:0, //内容高度
            headerModel:{
                systemType:'h5',
				appFlag:'BC'
            }, //接口入参
			imageUrl:'', //图片前面有域名的部分地址
			size: 'small',
			backgroudColor: '#EEFDFF', //默认值  #EEFDFF
			loading:false, //请求列表时loading
			pageRequest:{ //内容分页
				pageNum:'1',
				pageSize:'10',
				totalPage:'0',
			},
			positionList:[],
			allSelectData:{
				showTypeList:[
					{
						'name':'列表',
						'id': '1'
                    },
                    // {
					// 	'name':'轮播',
					// 	'id': '2'
					// }
				], //展示类型list
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
				], //投放渠道list
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
			},
			saveLoading: false,  //保存时按钮loading
			dialogVisible: false, //是否展示修改位置的弹框
			dataForm: {  //修改弹框数据
				id:'', //
				name:'', //位置名称
				showType: '', //'展现形式，1列表,2轮播
				remark:'', //备注
				appFlag: [], //渠道
				appFlagsNames: [],
				advPlatform: [], //设备
				systemTypeNames: [],
				state:'', //状态
			},
			 //修改位置校验规则
            formRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
				],
				showType: [
                    { required: true, message: '请选择类型', trigger: 'change' },
				],
				appFlag: [
                    { required: true, message: '请选择渠道', trigger: 'change' },
				],
				advPlatform: [
                    { required: true, message: '请选择设备', trigger: 'change' },
                ],
			},
		}
	},
	watch: {
		dialogUploadVisible(newVal){
			this.dialogUploadVisible = newVal
			console.log('newVal',newVal)
			if(newVal){
				this.fileObj = {} //清空data中数据
			}
		},
	},
  	mounted() {
		this.getBrokersList() //列表数据
		this.getSelectBackgroud() //查询背景色
	},
	methods: {
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

		//点击颜色选择器的确定按钮，最终显示的值
		colorChange(val){
			console.log('colorChange',val)
			this.backgroudColor = val
			this.getUpdateBackgroudColor() //颜色选择器确定时，调修改接口
		},
        // 颜色修改/确定
        handleSure(){
			// console.log(this.$refs.dropdown)
			this.$refs.dropdown.showPicker = true //是否展示选择器
		},
		//查询背景色
		async getSelectBackgroud(){
			let res = await getSelectBackgroud().then(res)//调查询背景色
			console.log('查询背景色',res)
			this.backgroudColor = res.backgroundColor
		},
		//点击修改背景色
		async getUpdateBackgroudColor(){
			let params = {
				backgroundColor: this.backgroudColor 
			}
            console.log('状态入参',params)
			let res = await getUpdateBackgroudColor(params)//调查询背景色
			// console.log('修改背景色',res)
		},

        // 获取列表数据
		async getBrokersList() {
			this.loading = true;
			try {
				let resList = await getPositionList()//位置列表接口
				console.log("列表数据",resList)
				this.loading = false;
				this.positionList = resList  //位置列表list
			} catch (error) {
				this.$message({ message: '数据获取异常', type: 'error' })
			}
			setTimeout(() => {
				this.loading = false;
			}, 100);
		},
		//点击开启/停用，请求状态接口修改开关
		async handleUpdateState(row,index,type){
			let params = {
                id: row.id,
                state: row.state==0 ? 1 : 0, //0 、关 1、开
			}
            // console.log('状态入参',params)
			let res = await getUpdateState(params).then(res)//调状态接口
			// console.log(res)
            this.getBrokersList() //成功后刷新接口改变state的值
		},

		//点击位置名称/查看列表--跳转到子列表
		handleCheck(row){
			//跳页
            this.$router.push({
                path: '/brokersLocationListSub',
                query: {
                    positionId: row.id,
                }
            })
		},

		// 点击修改--弹出弹窗-并调接口回显数据
        handleEdit(row){
			console.log('修改',row)
			this.dialogVisible = true
            let param = {
                id: row.id,
            }
            this.$api.getUpdatePosition(param).then(res =>{
                console.log("回显数据新接口",res)
				let data = res.success
				this.dataForm.id = data.id //名称
                this.dataForm.name = data.name //名称
                this.dataForm.showType = data.showType //类型
                this.dataForm.remark = data.remark //备注
				if (data.appFlag) this.dataForm.appFlag = (data.appFlag + "").split(","); //渠道回显 //字符串转数组
				if (data.advPlatform) this.dataForm.advPlatform = (data.advPlatform + "").split(","); //设备回显 //字符串转数组
            })
        },
		
		//位置修改-保存提交
		submitFormSave (dataForm) {
			console.log('保存')
			let params = {
               
				id: this.dataForm.id,
				name: this.dataForm.name, //位置名称 //组件回来的orgId为对象,直接去对象中id即可
				showType: this.dataForm.showType, //'展现形式，1列表,2轮播
				remark: this.dataForm.remark,   //备注
				appFlag: this.dataForm.appFlag.join(),   //渠道 //将数组转为字符串
				advPlatform: this.dataForm.advPlatform.join(), //设备 //将数组转为字符串
			};
			console.log('保存入参',params)
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						getUpdatePositionSave(params).then((resData) => {
							console.log("保存接口",resData);
							if(resData.success){
								this.saveLoading = false
								this.$message({ message: "修改成功", type: 'success' })
								this.dialogVisible = false
								this.getBrokersList() //刷新列表
							}
						}).catch((err) => {
							console.log("新增接口err",err);
							this.$message({ message: err, type: 'error' })
						})
					}).catch(() => {
                        this.$message({type: 'info',message: '已取消修改'});  
                        this.saveLoading = false
					});
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
		// background: url(../../asset/image.png) repeat left top;
		// background-size: 100%;
	}
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
