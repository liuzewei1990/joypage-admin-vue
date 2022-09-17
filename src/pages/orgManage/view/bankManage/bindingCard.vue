<template>
    <!-- 绑定卡管理 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="银行名称：" prop="elecName">
                        <el-select v-model="topCheckData.elecName" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in allSelectData.elecNameList" :key="item.commercialId" :label="item.orgName" :value="item.orgName"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支持操作类型：" prop="maintainType">
                        <el-select v-model="topCheckData.maintainType" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.maintainTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" style="float: left" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
                <el-button class="importBtn" style="float: left" :size="size" icon="el-icon-delete" type="danger" @click="handleBatchDelete()">批量删除</el-button>
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm('topData')">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="getBndingCardList('chaxun')">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="bindingCardList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
                <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="elecName" label="电子账户名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="bankCardName" label="银行卡名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="maintainType" label="支持操作类型" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p :size="size" v-for="(item, index) in allSelectData.maintainTypeList" :key="index">{{ scope.row.maintainType == item.value ? item.name : "" }}</p>
                        <!-- <p v-if="scope.row.maintainType=='1'" :size="size">开户</p>
					<p v-if="scope.row.maintainType=='2'" :size="size">充值</p>
					<p v-if="scope.row.maintainType=='3'" :size="size">提现</p> -->
                    </template>
                </el-table-column>
                <el-table-column prop="singleRechargeLimit" label="单笔限额（元）" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.maintainType == '2'">{{ scope.row.singleRechargeLimit }}</span>
                        <span v-if="scope.row.maintainType == '3'">{{ scope.row.singleLimitWithdrawal }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accLimitRechargeDay" label="日累计限额（元）" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.maintainType == '2'">{{ scope.row.accLimitRechargeDay }}</span>
                        <span v-if="scope.row.maintainType == '3'">{{ scope.row.accLimitWithdrawalDay }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rechargeMonthlyPaymentLimit" label="月支付限额（元）" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.maintainType == '2'">{{ scope.row.rechargeMonthlyPaymentLimit }}</span>
                        <span v-if="scope.row.maintainType == '3'">{{ scope.row.withdrawalMonthlyPaymentLimit }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div slot="footer">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    style="float: right"
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
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="70%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <el-form-item label="电子账户名称：" prop="elecId">
                    <!-- filterable开启可搜索模式  -->
                    <el-select v-model="dataForm.elecId" placeholder="请选择" filterable clearable @change="elecNameListSelect">
                        <el-option v-for="item in allSelectData.elecNameList" :key="item.commercialId" :label="item.orgName" :value="item.commercialId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行卡名称：" prop="cardId">
                    <el-select v-model="dataForm.cardId" placeholder="请选择" clearable @change="bankCardNameListSelect">
                        <el-option v-for="item in allSelectData.bankCardNameList" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否支持大额转入：" prop="isLargeAmount">
                    <el-select v-model="dataForm.isLargeAmount" placeholder="请选择" clearable @change="isLargeAmountSelect">
                        <el-option v-for="item in allSelectData.isLargeAmountList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支持操作类型：" prop="maintainType">
                    <el-radio-group v-model="dataForm.maintainType" @change="checkedRemindDateChange">
                        <el-radio v-for="(item, index) in allSelectData.maintainTypeList" :key="index" :label="item.value">{{ item.name }}</el-radio>
                        <!-- <el-radio label="1">开户</el-radio>
					<el-radio label="2">提现</el-radio>
					<el-radio label="3">充值</el-radio> -->
                    </el-radio-group>
                </el-form-item>
                <!-- 充值 -->
                <template v-if="dataForm.maintainType == '2'">
                    <template v-if="dataForm.isLargeAmount == '3'">
                        <el-form-item label="充值单笔限额（元）：">
                            <el-input type="number" value="-1" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="充值日累计限额（元）：">
                            <el-input type="number" value="-1" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="充值月支付限额（元）：">
                            <el-input type="number" value="-1" readonly></el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label="充值单笔限额（元）：" prop="singleRechargeLimit">
                            <el-input type="number" v-model="dataForm.singleRechargeLimit" placeholder="请输入充值单笔限额"></el-input>
                        </el-form-item>
                        <el-form-item label="充值日累计限额（元）：" prop="accLimitRechargeDay">
                            <el-input type="number" v-model="dataForm.accLimitRechargeDay" placeholder="请输入充值单笔限额"></el-input>
                        </el-form-item>
                        <el-form-item label="充值月支付限额（元）：" prop="rechargeMonthlyPaymentLimit">
                            <el-input type="number" v-model="dataForm.rechargeMonthlyPaymentLimit" placeholder="请输入充值单笔限额"></el-input>
                        </el-form-item>
                    </template>
                </template>
                <!-- 提现 -->
                <template v-else-if="dataForm.maintainType == '3'">
                    <template v-if="dataForm.isLargeAmount == '3'">
                        <el-form-item label="充值单笔限额（元）：">
                            <el-input type="number" value="-1" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="充值日累计限额（元）：">
                            <el-input type="number" value="-1" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="充值月支付限额（元）：">
                            <el-input type="number" value="-1" readonly></el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label="提现单笔限额（元）：" prop="singleLimitWithdrawal">
                            <el-input type="number" v-model="dataForm.singleLimitWithdrawal" placeholder="请输入提现单笔限额"></el-input>
                        </el-form-item>
                        <el-form-item label="提现日累计限额（元）：" prop="accLimitWithdrawalDay">
                            <el-input type="number" v-model="dataForm.accLimitWithdrawalDay" placeholder="请输入提现日累计限额"></el-input>
                        </el-form-item>
                        <el-form-item label="提现月支付限额（元）：" prop="withdrawalMonthlyPaymentLimit">
                            <el-input type="number" v-model="dataForm.withdrawalMonthlyPaymentLimit" placeholder="请输入提现月支付限额"></el-input>
                        </el-form-item>
                    </template>
                </template>
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
    // 接口函数依次:电子账户名称，银行卡名称，绑定卡名称列表，维护时间管理列表数据，维护时间管理新增，维护时间管理修改，维护时间管理删除,
    import {
        queryDirectBankNameByBankType,
        queryOrgNameByBankType,
        queryBankCard,
        queryElecAccountList,
        createElecAccount,
        updateElecAccount,
        deleteElecAccount,
        deleteElecAccountList
    } from "../../apis/index";
    import config from "../../config/config.index.js";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "depositProduct",
        components: { CommonTable },
        data() {
            return {
                tableHeight: 0,
                imageUrl: "", //图片前面有域名的部分地址
                size: "small",
                topCheckData: {
                    //顶部搜索选择的工具内容
                    elecName: "", //银行名称Name,
                    maintainType: "" //支持开户类型
                },
                //分页
                totalSize: 0, //总数
                pageRequest: {
                    //请求绑定卡列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求绑定卡时loading
                bindingCardList: [
                    // {
                    // 	id:'', //主键id
                    // 	elecId:'11',//电子账户名称id
                    // 	elecName: '百合直销银行', //电子账户名称
                    // 	bankCardId:'232323',//银行卡名称id
                    // 	bankCardName:'百合直销银行卡', //银行卡名称
                    // 	isLargeAmount:'1', //是否支持大额转入(1是2否3仅支持).如果选择是仅支持大额转入下面单笔 日累积 月支付限额额为-1
                    // 	maintainType:'2', //支持操作类型  1开户，2充值，3提现
                    // 	singleRechargeLimit:'100', //充值单笔限额
                    // 	accLimitRechargeDay:'200', //充值日累计限额
                    // 	rechargeMonthlyPaymentLimit:'300', //充值月支付限额
                    // 	singleLimitWithdrawal:'400', //提现单笔限额
                    // 	accLimitWithdrawalDay:'500', //提现日累计限额
                    // 	withdrawalMonthlyPaymentLimit:'600', //提现月支付限额
                    // 	createId: 0, //创建人
                    // 	appFlag:'', //APP应用标识
                    // 	updId:'', //最后更新人
                    // }
                ], //请求回来的绑定卡列表数据list
                allSelectData: {
                    elecNameList: [], //电子账户名称list
                    bankCardNameList: [], //银行卡名称list
                    isLargeAmountList: [
                        {
                            name: "是",
                            value: "1"
                        },
                        {
                            name: "否",
                            value: "2"
                        },
                        {
                            name: "仅支持",
                            value: "3"
                        }
                    ], //是否支持大额转入
                    maintainTypeList: [
                        {
                            name: "开户",
                            value: "1"
                        },
                        {
                            name: "充值",
                            value: "2"
                        },
                        {
                            name: "提现",
                            value: "3"
                        }
                    ] //维护类型
                }, //所有下拉框数组合集
                maintainTypeListCheck: [], //多选---选中的数据
                // 新增和编辑
                saveLoading: false, //保存时按钮loading
                dialogVisible: false, //是否展示新增编辑弹框
                // maintainTypes:'',//列表返回的支持类型
                dataForm: {
                    //新增弹框数据
                    id: "", //主键id
                    elecId: "", //电子账户名称id
                    elecName: "", //电子账户名称
                    cardId: "", //回显的时候用cardId
                    bankCardId: "", //银行卡名称id,传给后台的时候要用到
                    bankCardName: "", //银行卡名称
                    isLargeAmount: "", //是否支持大额转入(1是2否3仅支持).如果选择是仅支持大额转入下面单笔 日累积 月支付限额额为-1
                    maintainType: "", //支持操作类型  1开户，2充值，3提现
                    singleRechargeLimit: "", //充值单笔限额
                    accLimitRechargeDay: "", //充值日累计限额
                    rechargeMonthlyPaymentLimit: "", //充值月支付限额
                    singleLimitWithdrawal: "", //提现单笔限额
                    accLimitWithdrawalDay: "", //提现日累计限额
                    withdrawalMonthlyPaymentLimit: "", //提现月支付限额
                    createId: 0, //创建人
                    appFlag: "", //APP应用标识
                    updId: "" //最后更新人
                },
                formRules: {
                    //弹框校验规则
                    elecId: [{ required: true, message: "请选择电子账户名称", trigger: "blur" }],
                    bankCardId: [{ required: true, message: "请选择银行卡名称", trigger: "blur" }],
                    isLargeAmount: [{ required: true, message: "请选择是否支持大额转入", trigger: "blur" }],
                    maintainType: [{ required: true, message: "请选择支持操作类型", trigger: "blur" }],
                    singleRechargeLimit: [{ required: true, message: "请输入充值单笔限额", trigger: "blur" }],
                    accLimitRechargeDay: [{ required: true, message: "请输入充值日累计限额", trigger: "blur" }],
                    rechargeMonthlyPaymentLimit: [{ required: true, message: "请输入充值月支付限额", trigger: "blur" }],
                    singleLimitWithdrawal: [{ required: true, message: "请输入提现单笔限额", trigger: "blur" }],
                    accLimitWithdrawalDay: [{ required: true, message: "请输入提现日累计限额", trigger: "blur" }],
                    withdrawalMonthlyPaymentLimit: [{ required: true, message: "请输入提现月支付限额", trigger: "blur" }]
                },
                //删除
                selections: [], //删除选中项
                urlAddress: "" //域名地址,请求银行卡要传
            };
        },
        mounted() {
            //图片初始化地址：
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);
            this.getOrgSelectData(); //初始化下拉框银行名称数据
            this.getBndingCardList(); //绑定卡管理列表
        },
        methods: {
            //进入绑定卡列表初始化参--所有下拉框数据
            getOrgSelectData() {
                let params = "";
                //请求电子账户名称--即商业银行名称列表
                queryOrgNameByBankType(params)
                    .then((res) => {
                        console.log("获取电子账户名称的数据", res);
                        if (res.result == true) {
                            //银行名称列表
                            this.allSelectData.elecNameList = res.data;
                        } else {
                            console.log("电子账户名称获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求电子账户名称err", err);
                        this.$message({ message: "请求电子账户名称失败", type: "error" });
                    });
                //请求银行卡名称--即直销银行名称列表
                queryDirectBankNameByBankType(params)
                    .then((res) => {
                        console.log("获取直销银行名称数据", res);
                        if (res.result == true) {
                            //存款类型列表
                            this.allSelectData.bankCardNameList = res.data;
                        } else {
                            console.log("直销银行名称据失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求直销银行名称列表数据err", err);
                        this.$message({ message: "请求直销银行名称列表数据失败", type: "error" });
                    });
            },
            // 获取绑定卡列表数据
            getBndingCardList: function (type) {
                this.loading = true;
                if (type == "chaxun") {
                    console.log("chauxn");
                    this.pageRequest.pageNum = 0; //初始化--第一条开始查
                    this.pageRequest.pageSize = 10; //初始化--查询10条
                }
                let params = {
                    //查询多少页，从0开始, offset=页数乘以条数
                    start: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum - 1) * this.pageRequest.pageSize,
                    length: this.pageRequest.pageSize, //查询多少条
                    elecName: this.topCheckData.elecName, //银行名称
                    maintainType: this.topCheckData.maintainType //支持操作类型
                };
                console.log("绑定卡数据入参", params);
                queryElecAccountList(params)
                    .then((res) => {
                        console.log("获取绑定卡列表数据", res);
                        this.bindingCardList = res.data.data;
                        this.totalSize = res.data.totalCount; //总条数
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取绑定卡列表数据err", err);
                        this.loading = false;
                    });
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getBndingCardList(); //调绑定卡列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getBndingCardList(); //调产品系列列表接口
            },
            //重置
            resetForm(topData) {
                console.log("重置");
                this.$refs.topData.resetFields();
            },
            //弹框取消按钮
            cancleFrom(dataForm) {
                this.dialogVisible = false;
                this.$refs.dataForm.resetFields(); //清空数据
            },
            //点击弹框阴影部分校验
            closeDialog(done) {
                this.$confirm("确认关闭？")
                    .then((_) => {
                        done();
                        this.$refs.dataForm.resetFields(); //清空数据
                        location.reload(); //刷新页面
                    })
                    .catch((_) => {});
            },

            //新增下拉框的lable--电子账户名称---选中值发生变化时触发
            elecNameListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.elecNameList.find(function (item) {
                    return item.commercialId === val;
                });
                console.log(obj.orgName);
                this.dataForm.elecName = obj.orgName;
                //调用银行卡名称
                // this.getQueryBankCard(val)
            },
            // //请求银行卡名称
            // getQueryBankCard(val){
            // 	if(config.baseUrlHost.indexOf('finsuitomp') != -1){ //生产域名
            // 		this.urlAddress='3'
            // 	}else if(config.baseUrlHost.indexOf('app-test') != -1){ //测试域名
            // 		this.urlAddress='2'
            // 	}else{ //开发域名
            // 		this.urlAddress='1'
            // 	}
            // 	let paramsPrd = {
            // 		elecId: val,
            // 		urlAddress: this.urlAddress,
            // 	}
            // 	console.log('银行卡入参',paramsPrd)
            // 	queryBankCard(paramsPrd).then(res => {
            // 		console.log("获取银行卡名称的数据",res)
            // 		if(res.result == true){
            // 			//银行名称列表
            // 			this.allSelectData.bankCardNameList = res.data.data
            // 		}else{
            // 			console.log('获取银行卡名称失败')
            // 		}
            // 	}).catch((err) => {
            // 		console.log("请求银行卡名称err",err);
            // 		this.$message({ message: '请求银行卡名称失败', type: 'error' })
            // 	})
            // },
            //新增下拉框的lable--银行卡名称---选中值发生变化时触发
            bankCardNameListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.bankCardNameList.find(function (item) {
                    return item.id === val;
                });
                console.log(obj.orgName);
                this.dataForm.bankCardId = obj.id; //银行卡id，传给后台的时候要用到，回显的时候用cardId
                this.dataForm.bankCardName = obj.orgName; //银行卡名称
            },

            //是否支持大额转入--每次切换下拉框，则清空下面的数据
            isLargeAmountSelect(value) {
                console.log("是否支持大额转入", value);
                this.dataForm.singleRechargeLimit = 0; //充值单笔限额
                this.dataForm.accLimitRechargeDay = 0; //充值日累计限额
                this.dataForm.rechargeMonthlyPaymentLimit = 0; //充值月支付限额
                this.dataForm.singleLimitWithdrawal = 0; //提现单笔限额
                this.dataForm.accLimitWithdrawalDay = 0; //提现日累计限额
                this.dataForm.withdrawalMonthlyPaymentLimit = 0; //提现月支付限额
            },
            //点击--支持操作类型--清空下面的数据
            checkedRemindDateChange(value) {
                console.log("支持操作类型", value);
                this.dataForm.singleRechargeLimit = 0; //充值单笔限额
                this.dataForm.accLimitRechargeDay = 0; //充值日累计限额
                this.dataForm.rechargeMonthlyPaymentLimit = 0; //充值月支付限额
                this.dataForm.singleLimitWithdrawal = 0; //提现单笔限额
                this.dataForm.accLimitWithdrawalDay = 0; //提现日累计限额
                this.dataForm.withdrawalMonthlyPaymentLimit = 0; //提现月支付限额
            },
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    elecId: "", //电子账户名称id
                    elecName: "", //电子账户名称
                    bankCardId: "", //银行卡名称id
                    bankCardName: "", //银行卡名称
                    isLargeAmount: "", //是否支持大额转入(1是2否3仅支持).如果选择是仅支持大额转入下面单笔 日累积 月支付限额额为-1
                    maintainType: "", //支持操作类型  1开户，2充值，3提现
                    singleRechargeLimit: 0, //充值单笔限额
                    accLimitRechargeDay: 0, //充值日累计限额
                    rechargeMonthlyPaymentLimit: 0, //充值月支付限额
                    singleLimitWithdrawal: 0, //提现单笔限额
                    accLimitWithdrawalDay: 0, //提现日累计限额
                    withdrawalMonthlyPaymentLimit: 0, //提现月支付限额
                    createId: 0, //创建人
                    appFlag: "" //APP应用标识
                };
                Object.assign(this.dataForm);
            },

            // 显示编辑界面弹框
            handleEdit: function (row) {
                console.log("编辑", row);
                this.dialogVisible = true;
                Object.assign(this.dataForm, row);
            },
            //新增保存提交
            submitFormAddSave: function (dataForm) {
                console.log("新增保存");
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                if (this.dataForm.isLargeAmount == "3") {
                                    //仅支持
                                    if (this.dataForm.maintainType == "2") {
                                        this.dataForm.singleRechargeLimit = -1; //充值单笔限额
                                        this.dataForm.accLimitRechargeDay = -1; //充值日累计限额
                                        this.dataForm.rechargeMonthlyPaymentLimit = -1; //充值月支付限额
                                    } else {
                                        this.dataForm.singleLimitWithdrawal = -1; //提现单笔限额
                                        this.dataForm.accLimitWithdrawalDay = -1; //提现日累计限额
                                        this.dataForm.withdrawalMonthlyPaymentLimit = -1; //提现月支付限额
                                    }
                                }
                                let params = Object.assign({}, this.dataForm);
                                console.log("新增保存入参", params);
                                createElecAccount(params)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.dialogVisible = false;
                                            this.getBndingCardList();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "error" });
                                            this.dialogVisible = false;
                                        }
                                        this.$refs.dataForm.resetFields();
                                    })
                                    .catch((err) => {
                                        console.log("新增接口err", err);
                                        this.saveLoading = false;
                                        this.$message({ message: err, type: "error" });
                                        this.dialogVisible = false;
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消新增" });
                            });
                    }
                });
            },
            //编辑保存提交
            submitFormEditSave: function (dataForm) {
                console.log("编辑保存");
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                if (this.dataForm.isLargeAmount == "3") {
                                    //仅支持
                                    if (this.dataForm.maintainType == "2") {
                                        this.dataForm.singleRechargeLimit = -1; //充值单笔限额
                                        this.dataForm.accLimitRechargeDay = -1; //充值日累计限额
                                        this.dataForm.rechargeMonthlyPaymentLimit = -1; //充值月支付限额
                                    } else {
                                        this.dataForm.singleLimitWithdrawal = -1; //提现单笔限额
                                        this.dataForm.accLimitWithdrawalDay = -1; //提现日累计限额
                                        this.dataForm.withdrawalMonthlyPaymentLimit = -1; //提现月支付限额
                                    }
                                }
                                let params = Object.assign({}, this.dataForm);
                                console.log("编辑保存入参", params);
                                //请求编辑接口
                                updateElecAccount(params)
                                    .then((res) => {
                                        console.log("修改接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.dialogVisible = false;
                                            this.getBndingCardList();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "error" });
                                            this.dialogVisible = false;
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("编辑接口err", err);
                                        this.saveLoading = false;
                                        this.$message({ message: err, type: "error" });
                                        this.dialogVisible = false;
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消编辑" });
                            });
                    }
                });
            },

            // 选中当前行切换,值为单个对象 @current-change="handleCurrentChange"
            // handleCurrentChange: function (val) {
            // 	console.log('选中项 CurrentChange',val)
            // },
            // 单个删除
            handleDelete(index, row) {
                console.log("单个删除", row);
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            id: row.id
                        };
                        console.log("单个删除入参", params);
                        deleteElecAccount(params)
                            .then((res) => {
                                console.log("删除接口", res);
                                if (res.result == true) {
                                    this.$message({ message: "删除成功", type: "success" });
                                    this.getBndingCardList(); //刷新当前页
                                    this.loading = false;
                                } else {
                                    this.loading = false;
                                    this.$message({ message: res.description, type: "error" });
                                }
                            })
                            .catch((err) => {
                                console.log("删除接口err", err);
                                this.loading = false;
                            });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 选中多选框切换,值为数组
            selectionChange(selections) {
                this.selections = selections;
                console.log("选中项", this.selections);
            },
            // 批量删除---目前未做该功能-----
            handleBatchDelete: function () {
                console.log("批量删除");
                this.$confirm("确认删除选中记录吗？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let ids = [];
                        this.selections.map((item) => {
                            ids.push(item.id);
                        });
                        let params = {
                            ids: ids
                        };
                        console.log("删除params", params);
                        deleteElecAccountList(params)
                            .then((res) => {
                                console.log("删除接口", res);
                                if (res.result == true) {
                                    this.$message({ message: "删除成功", type: "success" });
                                    this.getBndingCardList(); //刷新当前页
                                    this.loading = false;
                                } else {
                                    this.loading = false;
                                    this.$message({ message: res.description, type: "error" });
                                }
                            })
                            .catch((err) => {
                                console.log("删除接口err", err);
                                this.loading = false;
                            });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            }
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .el-table__fixed-body-wrapper {
        top: 37px !important;
    }
    .prdSeries {
        padding: 20px;
    }
    // .topBox{
    // 	border-bottom: 1px solid #EBEEF5;
    // }
    // .addBtn{
    // 	margin: 18px 0;
    // }
    /deep/ .addForm {
        // .el-form-item__label-wrap {
        // margin-left: 0px!important;  //新增的所有label 靠左显示
        // }
        .el-table::before {
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0px;
        }
        .el-input {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
        /deep/ .fromItemBlue {
            //左边文字变蓝色
            .el-form-item__label-wrap {
                label.el-form-item__label {
                    color: #3795ff;
                }
            }
        }
    }
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
        border-color: #409eff;
    }
    .avatar {
        width: 90px;
        height: 90px;
        display: block;
    }
    .el-upload__tip {
        padding-left: 20px;
    }
</style>
