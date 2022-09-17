<template>
    <!-- 平台配置  -->
    <div class="platformConfig">
        <el-form :size="size" class="searchForm" :model="searchForm" ref="searchForm">
            <el-form-item label="银行" prop="orgIds">
                <el-select :disabled="searchForm.internalAppFlags.length > 0 || searchForm.externalAppFlags.length > 0" v-model="searchForm.orgIds" filterable clearable multiple placeholder="请选择">
                    <el-option v-for="item in orgs" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="plateformSearch" label="渠道" prop="internalAppFlags">
                <div class="plateformClass">
                    <div>
                        <div class="label">内部渠道</div>
                        <el-checkbox :disabled="searchForm.orgIds.length > 0" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group :disabled="searchForm.orgIds.length > 0" v-model="searchForm.internalAppFlags" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in cities" :label="city.value" :value="city.label" :key="city.value">{{ city.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div>
                        <div class="label">外部渠道</div>
                        <el-checkbox :disabled="searchForm.orgIds.length > 0" :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group :disabled="searchForm.orgIds.length > 0" v-model="searchForm.externalAppFlags" @change="handleCheckedCitiesChange1">
                            <el-checkbox v-for="city in cities1" :label="city.value" :value="city.label" :key="city.value">{{ city.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-form-item>
            <el-form-item style="text-align: right">
                <el-button :size="size" icon="el-icon-search" type="primary" @click="getList">查询</el-button>
                <el-button :size="size" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>

        <div class="addBtn">
            <el-button :size="size" icon="el-icon-plus" type="primary" @click="add">新增</el-button>
            <el-button :size="size" icon="el-icon-delete" v-if="multipleSelection.length > 0" @click="delAll">批量删除</el-button>
        </div>
        <el-table :data="contentList" style="width: 100%" border="true" :loading="tabLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="orgName" label="银行" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.orgName == '' || scope.row.orgName == null">-</span>
                    <span v-else>{{ scope.row.orgName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="internalAppFlagsName" label="内部渠道" width="140" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.internalAppFlagsName == '' || scope.row.internalAppFlagsName == null">-</span>
                    <span v-else>{{ scope.row.internalAppFlagsName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="externalAppFlagsName" label="外部渠道" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.externalAppFlagsName == '' || scope.row.externalAppFlagsName == null">-</span>
                    <span v-else>{{ scope.row.externalAppFlagsName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createDatetime" label="创建时间" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.createDatetime == '' || scope.row.createDatetime == null">-</span>
                    <span v-else>{{ scope.row.createDatetime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                    <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                    <el-button size="mini" type="text" @click="handleCopy(scope.row, scope.$index)">复制</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding: 10px 0">
            <el-pagination
                layout="total,sizes, prev, pager, next, jumper"
                style="float: right"
                :total="pageParams.totalPage"
                @current-change="refreshPageRequest"
                @size-change="handleSizeChange"
                :current-page="pageParams.pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageParams.pageSize">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { query, org, deleteFlag, deleteBatch } from "../../apis/index.js";
    const cityOptions = [
        {
            value: "BC",
            label: "比财APP"
        },
        {
            value: "PC",
            label: "拼财APP"
        },
        {
            value: "PMP",
            label: "拼财小程序"
        }
    ];
    const cityOptions1 = [
        {
            value: "YY",
            label: "异业"
        },
        {
            value: "TY",
            label: "同业"
        },
        {
            value: "ZT",
            label: "直投"
        }
    ];
    export default {
        data() {
            return {
                contentList: [],
                pageParams: {
                    totalPage: 0,
                    pageNum: 1,
                    pageSize: 10
                },
                searchForm: {
                    orgIds: [],
                    internalAppFlags: [],
                    externalAppFlags: [],
                    plateform: ""
                },
                size: "small",
                orgs: [],
                checkAll: false,
                cities: cityOptions,
                isIndeterminate: false,
                checkAll1: false,
                cities1: cityOptions1,
                isIndeterminate1: false,
                multipleSelection: []
            };
        },
        created() {
            this.orgFun();
            this.queryFun();
        },
        methods: {
            handleSizeChange(val) {
                this.pageParams.pageSize = val;
                this.queryFun();
            },
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageParams.pageNum = val;
                this.queryFun();
            },
            // 查询银行机构
            orgFun() {
                org().then((res) => {
                    console.log(res);
                    if (res.headerModel.code == 0) {
                        this.orgs = res.datatypeParam;
                        sessionStorage.setItem("orgs", JSON.stringify(res.datatypeParam));
                    }
                });
            },
            // 表格多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 内部渠道多选
            handleCheckAllChange(val) {
                console.log(val);
                let all = [];
                if (val) {
                    cityOptions.filter((i) => {
                        all.push(i.value);
                    });
                }
                this.searchForm.internalAppFlags = val ? all : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                console.log(this.checkAll);
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            // 外部渠道多选
            handleCheckAllChange1(val) {
                let all = [];
                if (val) {
                    cityOptions1.filter((i) => {
                        all.push(i.value);
                    });
                }
                this.searchForm.externalAppFlags = val ? all : [];
                this.isIndeterminate1 = false;
            },
            handleCheckedCitiesChange1(value) {
                let checkedCount1 = value.length;
                this.checkAll1 = checkedCount1 === this.cities1.length;
                this.isIndeterminate1 = checkedCount1 > 0 && checkedCount1 < this.cities1.length;
            },
            // 获取列表数据
            queryFun() {
                let params = {
                    orgIds: this.searchForm.orgIds.toString(), //多个机构id，以逗号分隔
                    internalAppFlags: this.searchForm.internalAppFlags.toString(), //多个内部渠道
                    externalAppFlags: this.searchForm.externalAppFlags.toString(), //多个外部渠道
                    currentPage: this.pageParams.pageNum //当前页码
                };
                query(params).then((res) => {
                    if (res.headerModel.code == 0) {
                        res.datatypeParam.retList.forEach((i) => {
                            // 处理外部渠道字段
                            if (i.internalAppFlags.indexOf(",") < 0) {
                                switch (i.internalAppFlags) {
                                    case "BC":
                                        i.internalAppFlagsName = "比财";
                                        break;
                                    case "PC":
                                        i.internalAppFlagsName = "拼财";
                                        break;
                                    case "PMP":
                                        i.internalAppFlagsName = "拼财小程序";
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                let arr = i.internalAppFlags.split(",");
                                let arrName = [];
                                arr.forEach((k) => {
                                    switch (k) {
                                        case "BC":
                                            arrName.push("比财");
                                            break;
                                        case "PC":
                                            arrName.push("拼财");
                                            break;
                                        case "PMP":
                                            arrName.push("拼财小程序");
                                            break;
                                        default:
                                            break;
                                    }
                                });
                                i.internalAppFlagsName = arrName.toString();
                            }
                            // 处理内部渠道字段
                            if (i.externalAppFlags.indexOf(",") < 0) {
                                // YY,TY,ZT 异业，同业，直投
                                switch (i.externalAppFlags) {
                                    case "YY":
                                        i.externalAppFlagsName = "异业";
                                        break;
                                    case "TY":
                                        i.externalAppFlagsName = "同业";
                                        break;
                                    case "ZT":
                                        i.externalAppFlagsName = "直投";
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                let arr = i.externalAppFlags.split(",");
                                let arrName = [];
                                arr.forEach((k) => {
                                    switch (k) {
                                        case "YY":
                                            arrName.push("异业");
                                            break;
                                        case "TY":
                                            arrName.push("同业");
                                            break;
                                        case "ZT":
                                            arrName.push("直投");
                                            break;
                                        default:
                                            break;
                                    }
                                });
                                i.externalAppFlagsName = arrName.toString();
                            }
                        });
                        this.contentList = res.datatypeParam.retList;
                        this.pageParams.totalPage = res.datatypeParam.totalCount;
                    } else {
                        this.$message.error(res.headerModel.message);
                    }
                });
            },
            // 查询
            getList() {
                this.pageParams.pageNum = 1;
                this.queryFun();
            },
            // /重置
            reset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.internalAppFlags = [];
                this.searchForm.externalAppFlags = [];
                this.checkAll1 = false;
                this.checkAll = false;
                this.isIndeterminate = false;
                this.isIndeterminate1 = false;
                this.pageParams.pageNum = 1;
                this.queryFun();
            },
            // 新增
            add() {
                this.$router.push({
                    path: "/addPlatformConfig",
                    query: {
                        name: "新增"
                    }
                });
            },
            // 删除
            handleDelete(row, index) {
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        let params = {
                            id: row.id
                        };
                        deleteFlag(params).then((res) => {
                            console.log(res);
                            if (res.headerModel.code == 0) {
                                this.$message.success("删除成功");
                                this.queryFun();
                            } else {
                                this.$message({ type: "info", message: res.headerModel.message });
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 批量删除
            delAll() {
                console.log(this.multipleSelection);
                let idArr = [];
                this.multipleSelection.forEach((i) => {
                    idArr.push(i.id);
                });
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        let params = {
                            ids: idArr.toString()
                        };
                        deleteBatch(params).then((res) => {
                            console.log(res);
                            if (res.headerModel.code == 0) {
                                this.$message.success("删除成功");
                                this.queryFun();
                            } else {
                                this.$message({ type: "info", message: res.headerModel.message });
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // handleEdit修改
            handleEdit(row, index) {
                this.$router.push({
                    path: "/addPlatformConfig",
                    query: {
                        id: row.id,
                        name: "修改"
                    }
                });
            },
            // 复制
            handleCopy(row, index) {
                this.$router.push({
                    path: "/addPlatformConfig",
                    query: {
                        id: row.id,
                        name: "复制"
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .platformConfig {
        padding: 20px;
        .searchForm {
            border-bottom: 1px solid #ebeef5;
        }
        .plateformSearch {
            .plateformClass {
                margin-left: 40px;
                > div {
                    display: flex;
                }
                .label {
                    margin-right: 15px;
                }
            }
            .btnCon {
                display: flex;
                // flex-direction: ;
            }
        }
        .addBtn {
            margin: 20px 0;
        }
    }
</style>
