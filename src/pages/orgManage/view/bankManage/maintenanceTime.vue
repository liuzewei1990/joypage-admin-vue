<template>
    <!-- 银行产品维护时间管理 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="银行名称：" prop="orgName">
                        <el-select v-model="topCheckData.orgName" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in allSelectData.orgNameList" :key="item.commercialId" :label="item.orgName" :value="item.orgName"> </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 产品名称暂时不要 -->
                    <!-- <el-form-item label="产品名称：" prop="prdName">
					<el-select v-model="topCheckData.prdName" placeholder="请选择" clearable>
						<el-option v-for="item in allSelectData.prdNameList"
						:key="item.id" :label="item.prdName" :value="item.prdName">
						</el-option>
					</el-select>
				</el-form-item> -->
                    <el-form-item label="操作类型：" prop="maintainType">
                        <el-select v-model="topCheckData.maintainType" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.maintainTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm('topData')">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="getMaintainTimeList('chaxun')">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="maintainTimeList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="银行名称" header-align="center" align="center"></el-table-column>
                <!-- <el-table-column prop="prdName" label="产品名称" header-align="center" align="center"></el-table-column> -->
                <el-table-column prop="maintainType" label="操作类型" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p :size="size" v-for="(item, index) in allSelectData.maintainTypeList" :key="index">{{ scope.row.maintainType == item.value ? item.name : "" }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="remindDateName" label="重复" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span :size="size" v-for="(item, index) in scope.row.remindDateName" :key="index">{{ item }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="startDate" label="开始时间" header-align="center" align="center"></el-table-column>
                <el-table-column prop="endDate" label="结束时间" header-align="center" align="center"></el-table-column>
                <el-table-column prop="dateDescribe" label="时间描述" header-align="center" align="center"></el-table-column>
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
                <el-form-item label="银行名称：" prop="orgId">
                    <!-- filterable开启可搜索模式  -->
                    <el-select v-model="dataForm.orgId" placeholder="请选择" filterable clearable @change="orgNameListSelect">
                        <el-option v-for="item in allSelectData.orgNameList" :key="item.commercialId" :label="item.orgName" :value="item.commercialId"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="产品名称：" prop="prdId">
				<el-select v-model="dataForm.prdId" placeholder="请选择" clearable
				@change='prdNameListSelect'>
					<el-option v-for="item in allSelectData.prdNameList"
					:key="item.id" :label="item.prdName" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item> -->
                <el-form-item label="操作类型：" prop="maintainType">
                    <el-select v-model="dataForm.maintainType" placeholder="请选择" clearable @change="maintainTypeListSelect">
                        <el-option v-for="item in allSelectData.maintainTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="重复：" prop="remindDate">
                    <el-radio v-model="dataForm.remindDate" label="0" @change="checkedRemindDateOnly">仅一次</el-radio>
                    <el-checkbox-group v-model="remindDateListCheck" @change="checkedRemindDateChange">
                        <el-checkbox v-for="(item, index) in remindDateList" :key="index" :label="item"></el-checkbox>
                        <!-- <el-cfheckbox v-for="(item,index) in remindDateList" :key="index" :label="item.name"></el-cfheckbox> -->
                    </el-checkbox-group>
                </el-form-item>
                <!-- 仅一次时，时间展示年月日时分秒 -->
                <template v-if="dataForm.remindDate == '0'">
                    <el-form-item label="开始时间：" prop="startDate">
                        <el-date-picker
                            v-model="dataForm.startDate"
                            type="datetime"
                            placeholder="开始日期时间"
                            :picker-options="pickerOptionsStart"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width: 50%"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间：" prop="endDate">
                        <el-date-picker
                            v-model="dataForm.endDate"
                            type="datetime"
                            placeholder="结束日期时间"
                            :picker-options="pickerOptionsEnd"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width: 50%"></el-date-picker>
                    </el-form-item>
                </template>
                <!-- 每周几，则分开选日期和时间 -->
                <template v-else>
                    <el-form-item label="开始时间：" prop="startDate">
                        <el-date-picker
                            v-model="dataForm.startDate"
                            type="date"
                            placeholder="开始时间"
                            :picker-options="pickerOptionsStart"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width: 50%"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间：" prop="endDate">
                        <el-date-picker
                            v-model="dataForm.endDate"
                            type="date"
                            placeholder="结束时间"
                            :picker-options="pickerOptionsEnd"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="width: 50%"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="每天开始时间：" prop="nowStartDate">
                        <el-time-picker
                            v-model="dataForm.nowStartDate"
                            :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                            }"
                            format="HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="每天开始时间">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="每天结束时间：" prop="nowEndDate">
                        <el-time-picker
                            v-model="dataForm.nowEndDate"
                            :picker-options="{
                                selectableRange: '00:00:00 - 23:59:59'
                            }"
                            format="HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="每天结束时间">
                        </el-time-picker>
                    </el-form-item>
                </template>
                <el-form-item label="时间描述：" prop="dateDescribe">
                    <el-input v-model="dataForm.dateDescribe" placeholder="请输入时间描述"></el-input>
                </el-form-item>
                <el-form-item label="同步：" prop="synchro">
                    <el-checkbox-group v-model="synchroListCheckList" @change="synchroListChange">
                        <el-checkbox label="公告"></el-checkbox>
                        <el-checkbox label="动态"></el-checkbox>
                    </el-checkbox-group>
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
    // 接口函数依次：银行名称列表，直销银行名称列表，维护时间管理列表数据，维护时间管理新增，维护时间管理修改，维护时间管理删除,
    import { queryOrgNameByBankType, queryPrdByOrgId, queryBankProductsWeiList, createBankProductsWei, updBankProductsWei, delBankProductsWei } from "../../apis/index";
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
                    orgName: "", //银行名称Name,
                    prdName: "", //产品名称
                    maintainType: "" //维护类型
                },
                //分页
                totalSize: 0, //总数
                pageRequest: {
                    //请求维护时间管理列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求直销银行时loading
                maintainTimeList: [
                    // {
                    // 	id:'', //主键id
                    // 	orgId: '1002', //机构ID
                    // 	orgName:'平安银行', //机构名称
                    // 	prdId: '033', //产品id
                    // 	prdName:'存款', //产品名称
                    // 	maintainType: '5', //维护类型  0全部，1开户，2充值，3提现，4购买，5赎回
                    // 	remindDate:'0',//提醒日期--重复
                    // 	remindDateList:[],
                    // 	startDate:'2020-07-21 09:00:00', //提醒开始时间
                    // 	endDate:'2020-07-29 18:00:00', //提醒结束时间
                    // 	nowStartDate:'2020-07-30 10:30:00', //每天开始时间
                    // 	nowEndDate:'2020-07-30 18:30:00', //每天结束时间
                    // 	dateDescribe:'描述', //时间描述
                    // 	synchro:'1，2', //同步，0全部， 1公告，2动态
                    // 	createId: 0, //创建人
                    // 	appFlag:'', //APP应用标识
                    // 	updId:'', //最后更新人
                    // }
                ], //请求回来的维护时间管理列表数据list
                allSelectData: {
                    orgNameList: [], //商业银行名称list
                    prdNameList: [], //银行类型
                    maintainTypeList: [
                        {
                            name: "全部",
                            value: "0"
                        },
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
                        },
                        {
                            name: "购买",
                            value: "4"
                        },
                        {
                            name: "赎回",
                            value: "5"
                        }
                    ] //维护类型
                }, //所有下拉框数组合集
                // 新增和编辑
                saveLoading: false, //保存时按钮loading
                dialogVisible: false, //是否展示新增编辑弹框
                dataForm: {
                    //新增弹框数据
                    id: "", //主键id
                    orgId: "", //机构ID
                    orgName: "", //机构名称
                    prdId: "", //产品id
                    prdName: "", //产品名称
                    maintainType: "", //维护类型  0全部，1开户，2充值，3提现，4购买，5赎回
                    remindDate: "", //提醒日期--重复
                    startDate: "", //提醒开始时间
                    endDate: "", //提醒结束时间
                    nowStartDate: "", //每天开始时间
                    nowEndDate: "", //每天结束时间
                    dateDescribe: "", //时间描述
                    synchro: "", //同步，0全部， 1公告，2动态
                    createId: 0, //创建人
                    appFlag: "", //APP应用标识
                    updId: "" //最后更新人
                },
                remindDateStr: "", //从列表中解析除，remindDate为0 时，展示仅一次
                remindDateArr: [],
                remindDateList: ["每周一", "每周二", "每周三", "每周四", "每周五", "每周六", "每周日"], //多选-产品覆盖类型初始值
                // remindDateList:[
                // 	{
                // 		"name":'每周一',
                // 		"value": '0'
                // 	},{
                // 		"name":'每周二',
                // 		"value": '1'
                // 	},{
                // 		"name":'每周三',
                // 		"value": '2'
                // 	},{
                // 		"name":'每周四',
                // 		"value": '3'
                // 	},{
                // 		"name":'每周五',
                // 		"value": '4'
                // 	},{
                // 		"name":'每周六',
                // 		"value": '5'
                // 	},{
                // 		"name":'每周日',
                // 		"value": '6'
                // 	}
                // ],
                remindDateListCheck: [], //多选-产品覆盖类型--选中的数据
                synchroListList: ["公告", "动态"], //多选-渠道覆盖类型初始值
                synchroListCheckList: [], //多选-渠道覆盖类型-选中的数据
                formRules: {
                    //弹框校验规则
                    orgId: [
                        //银行名称
                        { required: true, message: "请选择银行名称", trigger: "blur" }
                    ],
                    maintainType: [
                        //直销银行名称
                        { required: true, message: "请选择操作类型", trigger: "blur" }
                    ],
                    startDate: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
                    endDate: [{ required: true, message: "请选择结束日期", trigger: "blur" }],
                    nowStartDate: [{ required: true, message: "请选择每天开始时间", trigger: "blur" }],
                    nowEndDate: [{ required: true, message: "请选择每天结束时间", trigger: "blur" }]
                },
                //删除
                selections: [], //删除选中项
                //结束时间大于开始时间
                pickerOptionsStart: {
                    disabledDate: (time) => {
                        let endDateVal = this.dataForm.endDate;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: (time) => {
                        let beginDateVal = this.dataForm.startDate;
                        if (beginDateVal) {
                            return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000 + 1;
                        }
                    }
                }
            };
        },
        mounted() {
            //图片初始化地址：
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);
            this.getOrgSelectData(); //初始化下拉框银行名称数据
            this.getMaintainTimeList(); //直销银行管理列表
        },
        methods: {
            //进入维护时间管理列表初始化参--银行名称下拉框数据
            getOrgSelectData() {
                let params = "";
                //请求银行名称列表
                queryOrgNameByBankType(params)
                    .then((res) => {
                        console.log("获取银行名称数据", res);
                        if (res.result == true) {
                            //银行名称列表
                            this.allSelectData.orgNameList = res.data;
                        } else {
                            console.log("银行名称数据获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求银行名称数据err", err);
                        this.$message({ message: "请求银行名称失败", type: "error" });
                    });
            },
            // 获取维护时间管理列表数据
            getMaintainTimeList: function (type) {
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
                    orgName: this.topCheckData.orgName, //银行名称
                    prdName: this.topCheckData.prdName, //产品名称
                    maintainType: this.topCheckData.maintainType //操作类型
                };
                console.log("获取维护时间管理数据入参", params);
                queryBankProductsWeiList(params)
                    .then((res) => {
                        console.log("获取维护时间管理列表数据", res);
                        this.maintainTimeList = res.data.data;
                        this.totalSize = res.data.totalCount; //总条数
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取维护时间管理列表数据err", err);
                        this.loading = false;
                    });
            },
            // 请求分页换页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getMaintainTimeList(); //调维护时间管理列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getMaintainTimeList(); //调产品系列列表接口
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

            //新增下拉框的lable--机构名称--选中值发生变化时触发
            orgNameListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.orgNameList.find(function (item) {
                    return item.commercialId === val;
                });
                console.log(obj.orgName);
                this.dataForm.orgName = obj.orgName; //弹窗中银行名称
                // this.topCheckData.orgName = obj.orgName //查询里的银行名称
                //调用产品名称
                // this.getQueryPrdByOrgId(val)
            },
            //请求产品名称
            getQueryPrdByOrgId(val) {
                //根据银行id请求--产品名称
                let paramsPrd = {
                    id: val
                };
                queryPrdByOrgId(paramsPrd)
                    .then((res) => {
                        console.log("获取产品名称的数据", res);
                        if (res.result == true) {
                            //银行名称列表
                            this.allSelectData.prdNameList = res.data;
                        } else {
                            console.log("产品名称获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求产品名称err", err);
                        this.$message({ message: "请求产品名称失败", type: "error" });
                    });
            },
            //新增下拉框的lable--产品名称---选中值发生变化时触发
            prdNameListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.prdNameList.find(function (item) {
                    return item.id === val;
                });
                console.log(obj.prdName);
                this.dataForm.prdName = obj.prdName;
            },
            //新增下拉框的lable--操作类型---选中值发生变化时触发
            maintainTypeListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.maintainTypeList.find(function (item) {
                    return item.value === val;
                });
                console.log(obj.name);
            },
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    orgId: "", //机构ID
                    orgName: "", //机构名称
                    prdId: "", //产品id
                    prdName: "", //产品名称
                    maintainType: "", //维护类型  0全部，1开户，2充值，3提现，4购买，5赎回
                    remindDate: "", //提醒日期--重复
                    startDate: "", //提醒开始时间
                    endDate: "", //提醒结束时间
                    nowStartDate: "", //每天开始时间
                    nowEndDate: "", //每天结束时间
                    dateDescribe: "", //时间描述
                    synchro: "", //同步，0全部， 1公告，2动态
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
                                let params = Object.assign({}, this.dataForm);
                                console.log("新增保存入参", params);
                                createBankProductsWei(params)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.dialogVisible = false;
                                            this.getMaintainTimeList();
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
                                let params = Object.assign({}, this.dataForm);
                                console.log("编辑保存入参", params);
                                //请求编辑接口
                                updBankProductsWei(params)
                                    .then((res) => {
                                        console.log("修改接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.dialogVisible = false;
                                            this.getMaintainTimeList();
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
                            id: row.id,
                            synchro: row.synchro
                        };
                        console.log("单个删除入参", params);
                        delBankProductsWei(params)
                            .then((res) => {
                                console.log("删除接口", res);
                                if (res.result == true) {
                                    this.$message({ message: "删除成功", type: "success" });
                                    this.getMaintainTimeList(); //刷新当前页
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
            //单选仅一次：
            checkedRemindDateOnly(value) {
                console.log("单选：", value);
                if (this.dataForm.remindDate == 0) {
                    this.remindDateListCheck = [];
                }
            },
            //复选框--每周几
            checkedRemindDateChange(value) {
                console.log("多选每周：", value);
                let array = [];
                //遍历选中的数组，降对应的编码push到新的array数组中
                this.remindDateListCheck.forEach((item, index) => {
                    if (item == "每周一") {
                        array.push("1");
                    } else if (item == "每周二") {
                        array.push("2");
                    } else if (item == "每周三") {
                        array.push("3");
                    } else if (item == "每周四") {
                        array.push("4");
                    } else if (item == "每周五") {
                        array.push("5");
                    } else if (item == "每周六") {
                        array.push("6");
                    } else if (item == "每周日") {
                        array.push("7");
                    }
                });
                console.log("remindDate111", array);
                this.dataForm.remindDate = array.join(","); //将最终的新数组转为字符串,传给后台
                console.log("remindDate", this.dataForm.remindDate);
            },

            //点击同步--多选
            synchroListChange(value) {
                console.log("同步：", value);
                let array = [];
                //遍历选中的数组，降对应的编码push到新的array数组中
                this.synchroListCheckList.forEach((item, index) => {
                    if (item == "公告") {
                        array.push("1");
                    } else if (item == "动态") {
                        array.push("2");
                    }
                });
                console.log("synchro111", array);
                this.dataForm.synchro = array.join(","); //将最终的新数组转为字符串
                console.log("synchro", this.dataForm.synchro);
            }

            // startDateChange(value){
            // 	console.log('开始时间：',value)
            // 	console.log('开始时间转对象：',Date.parse(this.dataForm.startDate));
            // 	console.log('当前时间', new Date().getTime());
            // },
            // //每天结束时间
            // endDateChange(value){
            // 	console.log('结束时间：',value)
            // 	console.log('开始时间转对象：',Date.parse(this.dataForm.endDate));
            // 	console.log('当前时间', new Date().getTime());
            // 	if(Date.parse(this.dataForm.startDate) >= Date.parse(this.dataForm.endDate)){
            // 		alert('结束时间是需要大于开始日期')
            // 		// this.$message({ message: '结束时间是需要大于开始日期', type: 'info' })
            // 		this.dataForm.endDate = new Date(this.dataForm.endDate).getTime()
            // 		console.log('返回', this.dataForm.endDate);
            // 		// return  this.dataForm.endDate
            // 	}
            // },
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
