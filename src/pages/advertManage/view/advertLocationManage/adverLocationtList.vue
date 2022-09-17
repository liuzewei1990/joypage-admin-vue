<template>
    <!-- 广告位置管理 -->
    <div class="adverLocationtList">
        <el-form :size="size" :model="formSearch" ref="formSearch" :inline="true" class="searchForm demo-form-inline">
            <el-form-item label="广告位置" prop="name">
                <el-select clearable v-model="formSearch.name" placeholder="">
                    <el-option v-for="(item, index) in optionLists.advPositionList" :key="index" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="广告类型" prop="advertType">
                <el-select clearable v-model="formSearch.advertType" placeholder="">
                    <el-option v-for="(item, index) in optionLists.advTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投放渠道" prop="appFlag">
                <el-select clearable v-model="formSearch.appFlag" placeholder="">
                    <el-option v-for="(item, index) in optionLists.advChannelList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投放设备" prop="advPlatform">
                <el-select clearable v-model="formSearch.advPlatform" placeholder="">
                    <el-option v-for="(item, index) in optionLists.advDeviceList" :key="index" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button :size="size" icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
                <el-button :size="size" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开-->
        <el-table :data="advertList" style="width: 100%" border="true">
            <el-table-column type="index" :index="indexMethod" label="编号" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column min-width="180px" prop="name" label="广告位置" header-align="center" align="center"></el-table-column>
            <el-table-column prop="advType" label="广告类型" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.advType == 1">横幅广告</span>
                    <span v-if="scope.row.advType == 2">弹窗广告</span>
                    <span v-if="scope.row.advType == 3">开屏广告</span>
                    <span v-if="scope.row.advType == 4">悬浮广告</span>
                </template>
            </el-table-column>
            <el-table-column prop="advCount" label="广告数量" header-align="center" align="center"></el-table-column>
            <el-table-column min-width="200px" prop="appFlag" label="投放渠道" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.appFlag.indexOf(',') > -1">
                        <span v-for="(item, index) in scope.row.appFlag.split(',')" :key="index">
                            <span v-if="item == 'BC'">比财 </span>
                            <span v-if="item == 'PC'">拼财 </span>
                            <span v-if="item == 'PMP'">小程序 </span>
                            <span v-if="item == 'H5'">站外H5 </span>
                        </span>
                    </span>
                    <span v-else>
                        <span v-if="scope.row.appFlag == 'BC'">比财 </span>
                        <span v-if="scope.row.appFlag == 'PC'">拼财 </span>
                        <span v-if="scope.row.appFlag == 'PMP'">小程序 </span>
                        <span v-if="scope.row.appFlag == 'H5'">站外H5 </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column min-width="200px" prop="advPlatform" label="投放设备" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.advPlatform.indexOf(',') > -1">
                        <span v-for="(item, index) in scope.row.advPlatform.split(',')" :key="index">
                            <span v-if="item == 'android'">安卓 </span>
                            <span v-if="item == 'ios'">苹果 </span>
                        </span>
                    </span>
                    <span v-else>
                        <span v-if="scope.row.advPlatform == 'ios'">苹果 </span>
                        <span v-if="scope.row.advPlatform == 'android'">安卓 </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="showCount" label="展现数量" header-align="center" align="center"></el-table-column>
            <el-table-column prop="status" label="是否开启" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">已开启</span>
                    <span v-if="scope.row.status == 1">未开启</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding: 10px 0">
            <el-pagination
                layout="total, prev, pager, next, jumper"
                style="float: right"
                :total="totalSize"
                @current-change="refreshPageRequest"
                @size-change="handleSizeChange"
                :current-page="pageRequest.pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageRequest.pageSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    // 接口函数依次：广告列表页查询
    import { getAdvertPositPage, forAdvertPositPage } from "../../apis/index";
    export default {
        name: "adverLocationtManage",
        components: {},
        data() {
            return {
                size: "small",
                formSearch: {
                    advertPosit: "",
                    advertType: "",
                    appFlag: "",
                    advPlatform: "",
                    name: ""
                },
                totalSize: 0, //总数
                pageRequest: {
                    pageNum: 1,
                    pageSize: 10
                },
                advType: "",
                loading: false, //请求产品类别时loading
                advertList: [], //请求回来的产品类别列表数据list
                // 编辑
                editFormVisible: false, //是否展示编辑弹框
                optionLists: []
            };
        },
        mounted() {
            this.forAdvertPositPageFun();
            this.getAdvertPositPageFun();
        },
        methods: {
            // 初始化广告位置管理页面参数
            forAdvertPositPageFun() {
                let params = "";
                forAdvertPositPage(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.optionLists = res.data;
                    }
                });
            },
            // 查询列表数据
            getAdvertPositPageFun() {
                let params = {
                    advType: this.formSearch.advertType,
                    advPlatform: this.formSearch.advPlatform,
                    appFlag: this.formSearch.appFlag,
                    name: this.formSearch.name,
                    pageNum: this.pageRequest.pageNum,
                    pageSize: this.pageRequest.pageSize
                };
                getAdvertPositPage(params).then((res) => {
                    if (Number(res.code) === 0) {
                        this.advertList = res.data.data;
                        this.totalSize = res.data.totalCount;
                    } else {
                        this.$message.error("查询列表失败");
                    }
                });
            },
            // 重置
            reset() {
                this.$refs.formSearch.resetFields();
                this.pageRequest.pageNum = 1;
                this.getAdvertPositPageFun();
            },
            handleSizeChange() {},
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getAdvertPositPageFun(); //调产品系列列表接口
            },

            // 修改
            handleEdit(row, index) {
                this.$router.push({
                    path: "/editAdverLocationt",
                    query: {
                        type: this.advType,
                        id: row.id
                    }
                });
            },
            indexMethod(index) {
                return (this.pageRequest.pageNum - 1) * this.pageRequest.pageSize + (index + 1);
            },

            onSubmit() {
                this.pageRequest.pageNum = 1;
                this.getAdvertPositPageFun();
            }
        }
    };
</script>

<style lang="less" scoped>
    .adverLocationtList {
        padding: 20px;

        .btnCon {
            display: flex;
            justify-content: flex-end;
        }
        .editBtn {
            margin-bottom: 20px;
        }
        .el-table thead {
            color: #909399;
            font-weight: 500;
            font-size: 14px;
        }
        .el-table--mini td,
        .el-table--mini th {
            padding: 10px 0;
        }
        .el-select.el-select--small {
            width: 100%;
        }
    }
    /deep/ .searchForm .el-input,
    /deep/ .searchForm .el-select {
        width: 180px;
    }
</style>
