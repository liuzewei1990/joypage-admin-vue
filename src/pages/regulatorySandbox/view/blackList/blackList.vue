<template>
    <!-- 黑名单 手机号管理  -->
    <div class="platformConfig">
        <el-form :size="size" class="searchForm" :model="searchForm" ref="searchForm">
            <div class="inputDiv">
                <el-form-item label="手机号" prop="phoneNum">
                    <el-input v-model="searchForm.phoneNum" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="银行" prop="orgIds">
                    <el-select :disabled="searchForm.prdIndexIds.length > 0" v-model="searchForm.orgIds" filterable clearable multiple placeholder="请选择">
                        <el-option v-for="item in orgs" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品" prop="prdIndexIds">
                    <el-select
                        :disabled="searchForm.orgIds.length > 0"
                        multiple
                        no-match-text=""
                        class="scrollSelect"
                        @change="changeContent"
                        clearable
                        v-model="searchForm.prdIndexIds"
                        filterable
                        remote
                        :remote-method="searchPro"
                        placeholder="请选择">
                        <div>
                            <el-option v-for="item in prdList" :key="item.id" :label="item.prdName" :value="item.id"> </el-option>
                        </div>
                        <div style="text-align: center">
                            <el-button :disabled="pageParams1.pageNum <= 1" :size="size" type="text" @click.stop="prevPage">上一页</el-button>
                            <el-button :disabled="pageParams1.pageNum >= pageParams1.totalPage" :size="size" type="text" @click.stop="nextPage">下一页</el-button>
                            <span style="color: #ccc; font-size: 12px">当前页{{ pageParams1.pageNum }}</span>
                            <span style="color: #ccc; font-size: 12px">总页数{{ pageParams1.totalPage }}</span>
                        </div>
                    </el-select>
                </el-form-item>
            </div>

            <el-form-item class="plateformSearch" label="渠道" prop="internalAppFlags">
                <div class="plateformClass">
                    <div>
                        <div class="label">内部渠道</div>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group v-model="searchForm.internalAppFlags" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in cities" :label="city.value" :value="city.label" :key="city.value">{{ city.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div>
                        <div class="label">外部渠道</div>
                        <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group v-model="searchForm.externalAppFlags" @change="handleCheckedCitiesChange1">
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
            <el-button :size="size" icon="el-icon-plus" type="primary" @click="add">新增一个</el-button>

            <el-upload class="upload-demo" action="" :on-change="handleChange" :show-file-list="false" :auto-upload="false">
                <!-- <el-button :size='size' @click='addAll'>批量新增</el-button> -->
                <el-button :size="size" icon="el-icon-plus" type="primary">批量新增</el-button>
            </el-upload>
            <el-button :size="size" icon="el-icon-delete" v-if="multipleSelection.length > 0" @click="delAll">批量删除</el-button>
        </div>
        <div>批量创建请按照要求上传符合格式的excel文档，示例文件可点击右方按钮进行<a :href="href" style="color: blue; margin-left: 20px">下载示例文件</a></div>
        <el-table :data="contentList" style="width: 100%" border="true" :loading="tabLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="blackUserCode" width="250" label="手机号黑名单编码" header-align="center" align="center"></el-table-column>
            <el-table-column prop="phoneNum" label="手机号" width="140" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.phoneNum == '' || scope.row.phoneNum == null">-</span>
                    <span v-else>{{ scope.row.phoneNum }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="internalAppFlagsName" label="屏蔽渠道" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.internalAppFlagsName == '' || scope.row.internalAppFlagsName == null">-</span>
                    <span v-else>{{ scope.row.internalAppFlagsName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="orgName" label="屏蔽银行" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.orgName == '' || scope.row.orgName == null">-</span>
                    <span v-else>{{ scope.row.orgName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="prdIndexName" label="屏蔽产品" header-align="center" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.prdIndexName == '' || scope.row.prdIndexName == null">-</span>
                    <span v-else>{{ scope.row.prdIndexName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                    <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页栏-->
        <div class="toolbar" style="padding: 10px 0">
            <el-pagination
                layout="total, sizes,prev, pager, next, jumper"
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
    import { BlacklistpageQuery, prdindexall, org, BlacklistDelete } from "../../apis/index.js";
    import XLSX from "xlsx";
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
                href: "",
                proName: "",
                contentList: [],
                pageParams: {
                    totalPage: 0,
                    pageNum: 1,
                    pageSize: 10
                },
                pageParams1: {
                    totalPage: 0,
                    pageNum: 1,
                    pageSize: 10
                },
                searchForm: {
                    orgIds: [],
                    internalAppFlags: [],
                    externalAppFlags: [],
                    prdIndexIds: [],
                    phoneNum: ""
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
            this.href = window.location.origin + window.location.pathname + "phone.xls";
            this.orgFun();
            this.queryFun();
            this.proName = "";
            let params = {
                headerModel: {
                    systemType: "h5",
                    message: "查询产品请求",
                    requesttime: Date.parse(new Date()),
                    version: "",
                    token: "",
                    deviceId: "",
                    appFlag: "",
                    loginUid: ""
                },
                datatypeParam: {
                    currentPage: 1,
                    searchName: ""
                }
            };
            prdindexall(params).then((res) => {
                if (res.headerModel.code == 0) {
                    this.prdList = res.datatypeParam.retList;
                    this.pageParams1.totalPage = res.datatypeParam.totalPage;
                }
            });
        },
        methods: {
            // 核心部分代码(handleChange 和 importfile)
            handleChange(file, fileList) {
                this.fileContent = file.raw;
                const fileName = file.name;
                const fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
                if (this.fileContent) {
                    if (fileType === "xlsx" || fileType === "xls") {
                        this.importfile(this.fileContent);
                    } else {
                        this.$message({
                            type: "warning",
                            message: "附件格式错误，请重新上传！"
                        });
                    }
                } else {
                    this.$message({
                        type: "warning",
                        message: "请上传附件！"
                    });
                }
            },
            importfile(obj) {
                const reader = new FileReader();
                const _this = this;
                this.loadingTbal = true;
                reader.readAsArrayBuffer(obj);
                reader.onload = function () {
                    const buffer = reader.result;
                    const bytes = new Uint8Array(buffer);
                    const length = bytes.byteLength;
                    let binary = "";
                    for (let i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    const XLSX = require("xlsx");
                    const wb = XLSX.read(binary, {
                        type: "binary"
                    });
                    let importPhoneNums = [];
                    let aa = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                    aa.map((v) => {
                        let obj = {};
                        obj.phone = v.手机号;
                        importPhoneNums = importPhoneNums.concat(obj);
                    });
                    _this.$nextTick(() => {
                        sessionStorage.setItem("importPhoneNums", JSON.stringify(importPhoneNums));
                        _this.$router.push({
                            path: "/addBlackList",
                            query: {
                                name: "新增",
                                type: "allAdd"
                            }
                        });
                    });
                };
            },
            // 搜索产品数据
            searchPro(query) {
                this.proName = query;
                let params = {
                    headerModel: {
                        systemType: "h5",
                        message: "查询产品请求",
                        requesttime: Date.parse(new Date()),
                        version: "",
                        token: "",
                        deviceId: "",
                        appFlag: "",
                        loginUid: ""
                    },
                    datatypeParam: {
                        currentPage: this.pageParams1.pageNum,
                        searchName: query
                    }
                };
                prdindexall(params).then((res) => {
                    if (res.headerModel.code == 0) {
                        this.prdList = res.datatypeParam.retList;
                        this.pageParams1.totalPage = res.datatypeParam.totalPage;
                    }
                    // document.getElementsByClassName('scrollSelect')[0].querySelector('.el-input__inner').value=this.proName
                });
            },
            // 广告内容上一页
            prevPage() {
                if (this.pageParams1.pageNum <= 1) {
                    this.pageParams1.pageNum = 1;
                } else {
                    this.pageParams1.pageNum -= 1;
                }
                this.searchPro(this.proName);
            },
            // 广告内容下一页
            nextPage() {
                if (this.pageParams1.pageNum >= this.pageParams1.totalPage) {
                    this.pageParams1.pageNum = this.pageParams1.totalPage;
                } else {
                    this.pageParams1.pageNum += 1;
                }
                this.searchPro(this.proName);
            },
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
                console.log(value);
                console.log(this.searchForm.internalAppFlags);
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
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
                    headerModel: {
                        systemType: "h5",
                        message: "分页查询",
                        requesttime: Date.parse(new Date()),
                        version: "",
                        token: "",
                        deviceId: "",
                        appFlag: "",
                        loginUid: ""
                    },
                    datatypeParam: {
                        pageSize: this.pageParams.pageSize,
                        currentPage: this.pageParams.pageNum,
                        phoneNum: this.searchForm.phoneNum,
                        orgIds: this.searchForm.orgIds.toString(),
                        internalAppFlags: this.searchForm.internalAppFlags.toString(),
                        prdIndexIds: this.searchForm.prdIndexIds.toString(),
                        externalAppFlags: this.searchForm.externalAppFlags.toString()
                    }
                };
                BlacklistpageQuery(params).then((res) => {
                    if (res.headerModel.code == 0) {
                        res.datatypeParam.retList.forEach((i) => {
                            // 处理外部渠道字段
                            if (i.appFlag.indexOf(",") < 0) {
                                switch (i.appFlag) {
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
                                let arr = i.appFlag.split(",");
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
                    path: "/addBlackList",
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
                            headerModel: {
                                systemType: "h5",
                                message: "外链-删除银行或产品配置请求",
                                requesttime: Date.parse(new Date()),
                                version: "",
                                token: "",
                                deviceId: "",
                                appFlag: "",
                                loginUid: ""
                            },
                            datatypeParam: {
                                ids: row.id
                            }
                        };
                        BlacklistDelete(params).then((res) => {
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
                            headerModel: {
                                systemType: "h5",
                                message: "外链-删除银行或产品配置请求",
                                requesttime: Date.parse(new Date()),
                                version: "",
                                token: "",
                                deviceId: "",
                                appFlag: "",
                                loginUid: ""
                            },
                            datatypeParam: {
                                ids: idArr.toString()
                            }
                        };
                        BlacklistDelete(params).then((res) => {
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
                    path: "/addBlackList",
                    query: {
                        id: row.id,
                        name: "修改"
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
            display: flex;
            margin: 20px 0;
            button {
                margin-right: 20px;
            }
        }
    }
    .inputDiv {
        display: flex;
        flex-wrap: wrap;
        > div {
            display: flex;
            margin-right: 20px;
            /deep/ .el-input {
                width: 200px;
            }
            /deep/ .el-select {
                width: 200px;
            }
        }
    }
    // .scrollSelect {
    //   max-height: 100px;
    //   overflow: auto;
    //   padding-right: 20px;
    // }
</style>
