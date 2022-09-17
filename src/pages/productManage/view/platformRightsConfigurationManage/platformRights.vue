<template>
    <!-- 平台权益配置管理 -->
    <div class="platformRights">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头列表-->
            <div slot="search">
                <el-form :inline="true" :model="topCheckData" :size="size" ref="topData">
                    <el-form-item label="平台权益付息规则：" prop="payRule">
                        <el-select v-model="topCheckData.payRule" placeholder="请选择平台权益付息规则" clearable>
                            <el-option v-for="item in allSelectData.payRuleList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="补贴渠道：" prop="appFlag">
                        <el-select v-model="topCheckData.appFlag" placeholder="请选择补贴渠道" clearable>
                            <el-option v-for="item in allSelectData.appFlagList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="补贴平台：" prop="systemType">
                        <el-select v-model="topCheckData.systemType" placeholder="请选择补贴平台" clearable>
                            <el-option v-for="item in allSelectData.systemTypeList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="补贴状态：" prop="subsidyStatus">
                        <el-select v-model="topCheckData.subsidyStatus" placeholder="请选择补贴状态" clearable>
                            <el-option v-for="item in allSelectData.statusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="平台权益名称：" prop="name">
                        <el-input v-model="topCheckData.name" placeholder="请输入平台权益名称"></el-input>
                    </el-form-item>
                    <el-form-item label="银行名称：" prop="orgName">
                        <el-select v-model="topCheckData.orgName" placeholder="请选择银行名称" filterable clearable>
                            <el-option v-for="item in allSelectData.orgList" :key="item.id" :label="item.orgName" :value="item.orgName"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品名称：" prop="prdName">
                        <el-select v-model="topCheckData.prdName" placeholder="请选择产品名称" filterable clearable>
                            <el-option v-for="item in allSelectData.prdNameList" :key="item.id" :label="item.prdName" :value="item.prdName"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" style="float: left" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增补贴配置</el-button>
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm('topData')">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="getPlatformRightsList('chaxun')">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="platformRightsList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <!-- 多选type="selection" 取索引type="index"-->
                <el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column>
                <el-table-column prop="id" label="编号" width="70" header-align="center" align="center"></el-table-column>
                <el-table-column prop="name" label="平台权益名称" width="180" header-align="center" align="center"></el-table-column>
                <el-table-column prop="prdName" label="补贴对应产品名称" width="120" header-align="center" align="center"></el-table-column>
                <el-table-column prop="floatRate" label="补贴利率" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="personGroupName" label="可见用户" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span :size="size" v-for="(item, index) in scope.row.personGroupName" :key="index">{{ item }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payRule" label="付息规则" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.payRule == '1'" :size="size">满期结息</p>
                        <p v-if="scope.row.payRule == '2'" :size="size">周期付息 不倒扣利息</p>
                        <p v-if="scope.row.payRule == '3'" :size="size">周期付息 倒扣利息</p>
                        <p v-if="scope.row.payRule == '4'" :size="size">固定利率结息</p>
                        <p v-if="scope.row.payRule == '5'" :size="size">按实际持仓天数结息</p>
                        <p v-if="scope.row.payRule == '6'" :size="size">日终余额结息</p>
                    </template>
                </el-table-column>
                <el-table-column prop="subsidyStatus" label="状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.subsidyStatus == '1'" :size="size">开启</p>
                        <p v-if="scope.row.subsidyStatus == '0'" :size="size">关闭</p>
                    </template>
                </el-table-column>
                <el-table-column prop="appFlag" label="渠道" header-align="center" align="center">
                    <template slot-scope="scope">
                        <!-- <p v-if="scope.row.appFlag=='0'" :size="size">全部</p> -->
                        <!-- <span v-if="scope.row.appFlag=='BC'" :size="size">比财App</span>
					<span v-if="scope.row.appFlag=='PC'" :size="size">拼财App</span>
					<span v-if="scope.row.appFlag=='PMP'" :size="size">拼财小程序</span>
					<span v-if="scope.row.appFlag=='YIYE'" :size="size">异业</span> -->
                        <span :size="size" v-for="(item, index) in scope.row.appFlag" :key="index">{{ item }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="systemType" label="设备" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.systemType == 'android'" :size="size">android</p>
                        <p v-if="scope.row.systemType == 'ios'" :size="size">ios</p>
                        <p v-if="scope.row.systemType == 'all'" :size="size">全部</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div slot="footer">
                <!-- <el-button :size="size" type="danger" style="float:left;" @click="handleBatchDelete()">批量删除</el-button> -->
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
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="60%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <el-form-item label="权益补贴名称：" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入权益补贴名称"></el-input>
                    <el-checkbox v-model="dataForm.isShowName" label="勾选后页面不显示" name="type"></el-checkbox>
                </el-form-item>
                <el-form-item label="银行产品ID：" prop="bankCode">
                    <el-input v-model="dataForm.bankCode" placeholder="银行产品ID"></el-input>
                </el-form-item>
                <el-form-item label="权益补贴对应产品：" prop="prdIndexId">
                    <el-select v-model="dataForm.prdIndexId" placeholder="请选择权益补贴对应产品" filterable clearable @change="prdNameListSelect">
                        <el-option v-for="item in allSelectData.prdNameList" :key="item.id" :label="item.prdName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="补贴利率（%）：" prop="floatRate">
                    <el-input v-model="dataForm.floatRate" placeholder="请输入补贴利率（%）"></el-input>
                    <el-checkbox v-model="dataForm.isShowRate" label="勾选后页面不显示" name="type"></el-checkbox>
                </el-form-item>
                <el-form-item label="利率期限（用于公式）：" prop="timeLimit">
                    <el-select v-model="dataForm.timeLimit" placeholder="请输入利率期限（用于公式）" clearable>
                        <el-option v-for="item in allSelectData.timeLimitList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台权益付息规则：" prop="payRule">
                    <el-select v-model="dataForm.payRule" placeholder="请选择平台权益付息规则" clearable @change="payRuleListSelect">
                        <el-option v-for="item in allSelectData.payRuleList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付息周期（天）：" prop="payInterestPero" v-if="dataForm.payRule == '2' || dataForm.payRule == '3'">
                    <el-input type="number" min="0" v-model="dataForm.payInterestPero" placeholder="请输入付息周期（天）"></el-input>
                </el-form-item>
                <el-form-item label="最低持仓时间要求（天）：" prop="minDays" v-if="dataForm.payRule == '4' || dataForm.payRule == '6'">
                    <el-input type="number" min="0" v-model="dataForm.minDays" placeholder="最低持仓时间要求（天）"></el-input>
                </el-form-item>
                <el-form-item label="最低日终金额：" prop="minAmount" v-if="dataForm.payRule == '4' || dataForm.payRule == '6'">
                    <el-input type="number" min="0" v-model="dataForm.minAmount" placeholder="最低日终金额(元)"></el-input>
                </el-form-item>
                <el-form-item label="最低金额：" prop="minAmountType" v-if="dataForm.payRule != '6'">
                    <el-select v-model="dataForm.minAmountType" placeholder="请选择最低金额类型" clearable style="width: 35%">
                        <el-option v-for="item in allSelectData.minAmountTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                    <el-input type="number" min="0" v-model="dataForm.minAmount" placeholder="最低金额" style="width: 35%"></el-input>
                </el-form-item>

                <el-form-item label="低补贴利率（%）：" prop="minFloatRate" v-if="dataForm.payRule == '3'">
                    <el-input v-model="dataForm.minFloatRate" placeholder="请输入低补贴利率（%）"></el-input>
                </el-form-item>
                <el-form-item label="补贴展示渠道：" prop="appFlagList">
                    <!-- multiple多选，此时绑定值为数组形式 -->
                    <el-select v-model="dataForm.appFlagList" placeholder="请选择补贴展示渠道" clearable multiple>
                        <el-option v-for="item in allSelectData.appFlagList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 1186渠道名称不上二期再上 针对返回值-->
                <el-form-item label="渠道名称：" prop="yiyeChannelId">
                    <el-select v-model="dataForm.yiyeChannelId" placeholder="请选择渠道名称" clearable>
                        <el-option v-for="item in allSelectData.yiyeChannelIdList" :key="item.channelId" :label="item.channelName" :value="item.channelId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="补贴展示平台：" prop="systemType">
                    <el-select v-model="dataForm.systemType" placeholder="请选择补贴展示平台" clearable>
                        <el-option v-for="item in allSelectData.systemTypeList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户分群：" prop="personGroupList">
                    <el-select v-model="dataForm.personGroupList" placeholder="请选择用户分群" clearable multiple>
                        <el-option v-for="item in allSelectData.personGroupList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="补贴状态：" prop="subsidyStatus">
                    <el-select v-model="dataForm.subsidyStatus" placeholder="请选择补贴状态：" clearable>
                        <el-option v-for="item in allSelectData.statusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <div class="bottom_text">配置过程中请避免“补贴展示平台”与“用户分群”两字段交叉配置，同一用户同时在不同分群，补贴利率不同，取最高利率</div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
                <el-button :size="size" type="primary" v-if="!dataForm.ID" @click.native="submitFormAddSave('dataForm')" :loading="saveLoading">保存</el-button>
                <el-button :size="size" type="primary" v-else @click.native="submitFormEditSave('dataForm')" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // 接口函数依次：所有下拉框列表,产品的下拉框,平台权益列表,新增保存，修改保存，删除保存,异业渠道
    import { queryParameter, queryPrdList, queryPrdFloatRateList, createPrdFloatRate, updPrdFloatRate, deletePrdFloatRate, getYiYeChannel } from "../../apis/index";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "productManage",
        components: { CommonTable },
        data() {
            return {
                tableHeight: 0,
                size: "small",
                topCheckData: {
                    //标头列表输入框数据
                    payRule: "", //平台权益付息规则
                    appFlag: "", //补贴渠道，单选时为字符串，
                    systemType: "", ///补贴平台
                    subsidyStatus: "", //补贴状态
                    name: "", //平台权益名称
                    orgName: "", //银行名称
                    prdName: "" //产品名称
                },
                allSelectData: {
                    //所有下拉框数组合集
                    appFlagList: [], //补贴渠道
                    systemTypeList: [], //补贴平台
                    personGroupList: [], //用户分群
                    prdNameList: [], //权益补贴对应产品,也是产品名称查询要用的数组
                    orgList: [], //机构名称数组
                    payRuleList: [
                        //付息规则
                        {
                            label: "满期结息",
                            value: "1"
                        },
                        {
                            label: "周期付息 不倒扣利息",
                            value: "2"
                        },
                        {
                            label: "周期付息 倒扣利息",
                            value: "3"
                        },
                        {
                            label: "固定利率结息",
                            value: "4"
                        },
                        {
                            label: "按实际持仓天数结息",
                            value: "5"
                        },
                        {
                            label: "日终余额结息",
                            value: "6"
                        }
                    ],
                    statusList: [
                        //补贴状态
                        {
                            label: "开启",
                            value: "1"
                        },
                        {
                            label: "关闭",
                            value: "0"
                        }
                    ],
                    timeLimitList: [
                        //利率期限
                        {
                            label: "360",
                            value: "1"
                        },
                        {
                            label: "365",
                            value: "2"
                        }
                    ],
                    minAmountTypeList: [
                        {
                            label: "最低持仓金额",
                            value: 1
                        },
                        {
                            label: "最低充值金额",
                            value: 2
                        }
                    ],
                    yiyeChannelIdList: [] //异业渠道
                },
                totalSize: 0, //总数
                pageRequest: {
                    //请求平台权益列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求平台权益时loading
                platformRightsList: [], //请求回来的平台权益列表数据list
                saveLoading: false, //保存时按钮loading
                // 新增和编辑
                dialogVisible: false, //是否展示新增编辑弹框
                dataForm: {
                    //新增弹框数据
                    id: Number,
                    name: "", //权益补贴名称
                    prdIndexId: Number, //产品id
                    prdName: "", //权益补贴对应产品
                    hisNum: "", //版本编号（新增时默认为0）
                    isSubsidy: "", //是否补贴平台权益
                    floatRate: "", //补贴利率
                    timeLimit: "", //期限
                    minFloatRate: "", //低补贴利率
                    personGroup: "", //所属人群
                    personGroupList: [], //用户分群多选
                    subsidyStatus: "", //补贴状态（1开启、0 关闭）
                    systemType: "", //平台 android\ios
                    payInterestPero: "", //付息周期
                    minDays: "", //最低持仓时间要求
                    appFlag: "", //渠道 bc、pc、小程序、异业
                    appFlagList: [], // 补贴渠道，多选时为数组
                    payRule: "", //平台权益付息规则
                    createBy: "", //创建人
                    createTime: "", //创建时间
                    updateBy: "", //修改人
                    updateTime: "", //修改时间
                    //1186新增字段
                    isShowName: "", // 1是0否 ，是否显示补贴名称
                    isShowRate: "", // 1是0否 ，是否显示补贴利率
                    yiyeChannelId: "", //异业渠道id
                    yiyeChannelName: "", //异业渠道名称
                    minAmountType: "", //最低金额类型  1最低持仓2最低充值
                    minAmount: "", //最低金额
                    bankCode: "" //银行单号
                },
                formRules: {
                    //弹框校验规则
                    prdIndexId: [{ required: true, message: "请输入权益补贴对应产品", trigger: "blur" }],
                    floatRate: [{ required: true, message: "请输入补贴利率", trigger: "blur" }],
                    timeLimit: [{ required: true, message: "请选择利率期限", trigger: "change" }],
                    payRule: [{ required: true, message: "请选择平台权益付息规则", trigger: "change" }],
                    payInterestPero: [{ required: true, message: "请选择付息周期", trigger: "change" }],
                    minDays: [{ required: true, message: "请输入最低持仓时间要求（天）", trigger: "blur" }],
                    systemType: [{ required: true, message: "请选择补贴展示平台", trigger: "change" }],
                    personGroup: [{ required: true, message: "请选择用户分群", trigger: "change" }],
                    subsidyStatus: [{ required: true, message: "请选择补贴状态", trigger: "change" }],
                    minAmountType: [{ required: true, message: "请选择最低金额", trigger: "change" }],
                    minAmount: [{ required: true, message: "请输入最低金额", trigger: "blur" }]
                },
                //删除
                selections: [] //删除选中项
            };
        },
        mounted() {
            this.getSelect(); //初始化下拉框数据
            this.getQueryPrdList(); //获取产品名称和机构名称下拉框数据
            this.getPlatformRightsList(); //平台权益列表展示数据
            this.getYiYeChannel(); //获取异业渠道
        },
        methods: {
            //进入平台权益列表初始化参--所有下拉框数据
            getSelect() {
                let params = "";
                queryParameter(params)
                    .then((res) => {
                        console.log("获取所有下拉框数据", res);
                        if (res.result == true) {
                            //补贴渠道数组
                            this.allSelectData.appFlagList = res.data.appFlagList;
                            //补贴平台数组
                            this.allSelectData.systemTypeList = res.data.systemTypeList;
                            //用户分群数组:
                            this.allSelectData.personGroupList = res.data.groupList;
                        } else {
                            console.log("失败");
                        }
                    })
                    .catch((err) => {
                        console.log("获取下拉框数据err", err);
                    });
            },
            //请选择权益补贴对应产品的下拉框
            getQueryPrdList() {
                let params = {
                    prdName: ""
                };
                queryPrdList(params)
                    .then((res) => {
                        console.log("获取产品下拉框数据", res);
                        // console.log("获取所有下拉框数据",res)
                        if (res.result == true) {
                            //补贴渠道产品名称数组
                            this.allSelectData.prdNameList = res.data.prdList;
                            //机构名称数组
                            this.allSelectData.orgList = res.data.orgList;
                        } else {
                            console.log("失败");
                        }
                    })
                    .catch((err) => {
                        console.log("获取产品下拉框数据err", err);
                    });
            },
            //获取异业渠道
            getYiYeChannel() {
                getYiYeChannel().then((res) => {
                    console.log("获取异业渠道", res);
                    // let res={
                    // 	result: true,
                    // 	description: "查询成功",
                    // 	data: [
                    // 		{
                    // 			channelId: 1260,
                    // 			channelName: "SM2",
                    // 			channelCode: "SM2N8N6VGUBLKFJSEPL7CTZCFUPVFF",
                    // 			queryCode: "003z"
                    // 		},
                    // 		{
                    // 			channelId: 1261,
                    // 			channelName: "SM其他",
                    // 			channelCode: "SMQTCZK88U0WVL9WTXUPADA3DMXECE",
                    // 			queryCode: "0040"
                    // 		}
                    // 	],
                    // 	parameterData: null
                    // }
                    // console.log("获取异业渠道111",res)
                    if (res.result == true) {
                        //异业渠道数组
                        this.allSelectData.yiyeChannelIdList = res.data;
                    } else {
                        console.log("失败");
                    }
                });
            },
            // 获取平台权益列表数据
            getPlatformRightsList: function (type) {
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
                    payRule: this.topCheckData.payRule, //付息规则
                    appFlag: this.topCheckData.appFlag, //补贴渠道
                    systemType: this.topCheckData.systemType, //补贴平台
                    subsidyStatus: this.topCheckData.subsidyStatus, //补贴状态
                    name: this.topCheckData.name, //平台权益名称
                    orgName: this.topCheckData.orgName, //银行名称
                    prdName: this.topCheckData.prdName //产品名称
                };

                console.log("平台权益数据入参", params);
                //调用平台权益列表接口
                queryPrdFloatRateList(params)
                    .then((res) => {
                        // let res = {
                        // 		data:{
                        // 			recordsTotal:'100',
                        // 			data:[{
                        // 				id:'1',
                        // 				prdIndexId: '11212',
                        // 				name: "晋中银行",
                        // 				prdName:'aaaa',
                        // 				hisNum: 0,
                        // 				isSubsidy: '1',
                        // 				floatRate: "1.2",
                        // 				timeLimit: '0',
                        // 				minFloatRate: "1",
                        // 				personGroup: '0',
                        // 				subsidyStatus: "1",
                        // 				systemType: "1",
                        // 				payInterestPero: "4",
                        // 				payRule: "1",
                        // 				appFlag: "1",
                        // 			}],
                        // 		}
                        // 	}
                        console.log("获取平台权益列表展示数据", res);
                        if (res.result == true) {
                            this.platformRightsList = res.data.data;
                            this.totalSize = res.data.recordsTotal; //总条数
                            this.loading = false;

                            // this.platformRightsList.forEach(element => {
                            // 	conosole.log(element.personGroup)

                            // 	let obj = {}
                            // 	obj = this.allSelectData.prdNameList.find(function(item){
                            // 		return item.DIC_VALUE === element.personGroup
                            // 	})
                            // 	console.log(obj.DIC_NAME)
                            // 	element.personGroupName = obj.DIC_NAME
                            // 	console.log(element)
                            // });
                        } else {
                            this.loading = false;
                            console.log(res.description);
                        }
                    })
                    .catch((err) => {
                        console.log("获取平台权益数据err", err);
                        this.loading = false;
                    });
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getPlatformRightsList(); //调平台权益列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getPlatformRightsList(); //调平台权益列表接口
            },
            //重置按钮
            resetForm(topData) {
                console.log("重置");
                this.$refs[topData].resetFields();
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
            //权益补贴对应产品：选中值发生变化时触发---获取下拉框的lable
            prdNameListSelect(val) {
                console.log("当前value--ID", val);
                let obj = {};
                obj = this.allSelectData.prdNameList.find(function (item) {
                    return item.id === val;
                });
                console.log(obj.prdName);
                this.dataForm.prdName = obj.prdName;
            },
            radioGroupChange(val) {
                console.log("当前value--ID", val);
            },
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    prdIndexId: "", //产品id
                    name: "", //权益补贴名称
                    prdName: "", //权益补贴对应产品
                    hisNum: 0, //版本编号（新增时默认为0）
                    isSubsidy: "", //是否补贴平台权益
                    floatRate: "", //补贴利率
                    timeLimit: "", //期限
                    minFloatRate: "", //低补贴利率
                    personGroup: "", //所属人群
                    personGroupList: [], //用户分群多选
                    subsidyStatus: "1", //补贴状态（1开启、0 关闭）
                    systemType: "", //平台 android\ios
                    payInterestPero: "", //付息周期
                    minDays: "", //最低持仓时间要求
                    appFlag: "", //渠道 bc、pc、小程序、异业
                    appFlagList: [], // 补贴渠道，多选时为数组
                    payRule: "", //平台权益付息规则
                    createBy: "", //创建人
                    createTime: "", //创建时间
                    updateBy: "", //修改人
                    updateTime: "", //修改时间
                    //1186新增字段
                    isShowName: "", // 1是0否 ，是否显示补贴名称
                    isShowRate: "", // 1是0否 ，是否显示补贴利率
                    yiyeChannelId: "", //异业渠道
                    minAmountType: "", //最低金额类型  1最低持仓2最低充值
                    minAmount: "", //最低金额
                    bankCode: "" //银行单号
                };
                Object.assign(this.dataForm);
            },
            // 显示编辑界面弹框
            handleEdit: function (row) {
                console.log("编辑row", row);
                this.dialogVisible = true;
                Object.assign(this.dataForm, row);
                this.dataForm.isShowName = row.isShowName == 1 ? true : false; // 1是0否 ，是否显示补贴名称
                this.dataForm.isShowRate = row.isShowRate == 1 ? true : false; // 1是0否 ，是否显示补贴利率
            },
            //必填项的校验方法 -- 点击保存按钮，必填项有未填写内容时，弹框提示，并把光标定为到第一个未录入的输入框
            fromRequired() {
                //获取当前必录的校验词并弹框提示输入具体必录项
                setTimeout(() => {
                    // console.log(document.getElementsByClassName('el-form-item__error'))
                    if (document.getElementsByClassName("el-form-item__error").length > 0) {
                        this.$notify.error({
                            title: "提示",
                            message: document.getElementsByClassName("el-form-item__error")[0].innerText
                        });
                    }
                }, 100);
                //获取未录入的第一个必录项的输入框并定位到此处
                setTimeout(() => {
                    // console.log(document.getElementsByClassName('is-error is-required'))
                    var isError = document.getElementsByClassName("is-error is-required");
                    if (isError.length > 0) {
                        isError[0].querySelector("input").focus();
                    }
                }, 100);
            },
            //新增保存提交
            submitFormAddSave: function (dataForm) {
                console.log("新增保存");
                this.fromRequired(); //调用必填项的校验方法
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                this.dataForm.minAmountType = this.dataForm.payRule == "6" ? 2 : this.dataForm.minAmountType; //规则等于6的时候，minAmountType默认为2，
                                this.dataForm.isShowName = this.dataForm.isShowName == true ? 1 : 0; // 1是0否 ，是否显示补贴名称
                                this.dataForm.isShowRate = this.dataForm.isShowRate == true ? 1 : 0; // 1是0否 ，是否显示补贴利率
                                let params = Object.assign({}, this.dataForm);
                                console.log("新增保存入参", params);
                                createPrdFloatRate(params)
                                    .then((res) => {
                                        console.log("新增接口res", res);
                                        if (res.result == true) {
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.saveLoading = false;
                                            this.dialogVisible = false;
                                            this.getPlatformRightsList();
                                            this.$refs.dataForm.resetFields(); //清空数据
                                        } else {
                                            this.$message({ message: res.description, type: "error" });
                                            this.saveLoading = false;
                                            this.dialogVisible = false;
                                            this.getPlatformRightsList();
                                            this.$refs.dataForm.resetFields(); //清空数据
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("新增接口err", err);
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
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                this.dataForm.minAmountType = this.dataForm.payRule == "6" ? 2 : this.dataForm.minAmountType; //规则等于6的时候，minAmountType默认为2，
                                this.dataForm.isShowName = this.dataForm.isShowName == true ? 1 : 0; // 1是0否 ，是否显示补贴名称
                                this.dataForm.isShowRate = this.dataForm.isShowRate == true ? 1 : 0; // 1是0否 ，是否显示补贴利率
                                let params = Object.assign({}, this.dataForm);
                                console.log("编辑保存入参", params);
                                //请求编辑接口
                                updPrdFloatRate(params)
                                    .then((res) => {
                                        console.log("编辑保存接口res", res);
                                        if (res.result == true) {
                                            this.$message({ message: "操作成功", type: "success" });
                                        } else {
                                            this.$message({ message: res.description, type: "error" });
                                        }
                                        this.saveLoading = false;
                                        this.dialogVisible = false;
                                        this.getPlatformRightsList();
                                    })
                                    .catch((err) => {
                                        console.log("编辑接口err", err);
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
            handleDelete: function (index, row) {
                console.log("单个删除", row);
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            id: row.id //系列ID
                        };
                        console.log("单个删除入参", params);
                        deletePrdFloatRate(params).then((res) => {
                            console.log("删除res", res);
                            this.$message({ message: "删除成功", type: "success" });
                            this.getPlatformRightsList(); //刷新当前页
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 选中多选框切换,值为数组
            selectionChange: function (selections) {
                this.selections = selections;
                console.log("选中项", this.selections);
            },
            // 批量删除
            handleBatchDelete: function () {
                console.log("批量删除");
                this.$confirm("确认删除选中记录吗？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let ids = [];
                        this.selections.map((item) => {
                            ids.push(item.ID);
                        });
                        let params = {
                            IDS: ids.toString()
                        };
                        console.log("删除params", params);
                        getRoleDeletes(params).then((data) => {
                            this.$message({ message: "删除成功", type: "success" });
                            this.getPlatformRightsList(); //刷新当前页
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
    // /deep/ .el-table__fixed-body-wrapper {
    // top: 37px !important;
    // }
    .platformRights {
        padding: 20px;
    }
    // .topBox{
    // 	border-bottom: 1px solid #EBEEF5;
    // }
    // .addBtn{
    // 	margin: 18px 0;
    // }
    .addForm {
        .el-input,
        .el-select {
            width: 70%;
        }
        .el-checkbox {
            padding-left: 10px;
        }
        .el-radio {
            margin-right: 12px;
        }
        .radio_input {
            width: 70%;
            margin-bottom: 18px;
        }
        .tipText {
            padding-left: 12px;
            color: #999;
        }
        .bottom_text {
            color: rgb(178, 85, 85);
            text-align: center;
            line-height: 28px;
        }
    }
</style>
