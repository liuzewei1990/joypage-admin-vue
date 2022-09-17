<template>
    <!-- 广告系列管理 -->
    <div class="advertList">
        <el-form :inline="true" :size="size" :model="formSearch" ref="formSearch" class="demo-form-inline btnCon">
            <div>
                <el-form-item label="系列名称：" prop="advTitle">
                    <el-input clearable v-model="formSearch.advTitle" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" :size="size" type="primary" @click="onSubmit">查询</el-button>
                    <el-button icon="el-icon-refresh" :size="size" @click="resetForm">重置</el-button>
                </el-form-item>
            </div>
            <el-form-item>
                <el-button :size="size" icon="el-icon-plus" type="primary" @click="add">新增广告系列</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格内容栏 多选el-table-column 中 type="selection" 取索引type="index" default-expand-all 默认全部展开-->
        <el-table :data="advertList" style="width: 100%" border="true" :loading="tabLoading">
            <el-table-column type="index" :index="indexMethod" label="编号" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column prop="advSeriesName" label="广告系列" header-align="center" align="center"></el-table-column>
            <el-table-column prop="advCount" label="广告数量" header-align="center" align="center"></el-table-column>
            <el-table-column prop="updTime" width="220" label="操作时间" header-align="center" align="center"></el-table-column>
            <el-table-column prop="updName" label="操作人" header-align="center" align="center"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
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

        <!-- 新增广告系列弹框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form ref="addForm" label-width="auto" :rules="rules" :model="addForm" label-position="left" class="addForm" :size="size">
                <el-form-item label="广告系列名称：" prop="addName">
                    <el-input v-model="addForm.addName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click="dialogFormVisible = false">取 消</el-button>
                <el-button :size="size" :loading="saveLoading" type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { advSeriesPageList, updateAdvSeries, addAdvSeries, delAdvSeries } from "../../apis/index";
    export default {
        name: "advertListManage",
        components: {},
        data() {
            return {
                formSearch: {
                    advTitle: ""
                },
                dialogTitle: "",
                saveLoading: false,
                addForm: {
                    addName: ""
                },
                rules: {
                    addName: [{ required: true, message: "请输入广告系列名称", trigger: "blur" }]
                },
                dialogFormVisible: false, //是否展示编辑/新增弹框
                totalSize: 0, //总数
                pageRequest: {
                    pageNum: 1,
                    pageSize: 10
                },
                advType: 1,
                size: "small",
                loading: false, //请求产品类别时loading
                advertList: [], //请求回来的产品类别列表数据list
                // 编辑
                isAddOrEdit: "add",
                listDetail: {}, //列表一行的详情数据
                tabLoading: true
            };
        },
        mounted() {},
        created() {
            this.advSeriesPageListFun();
        },
        methods: {
            // 查询列表数据
            advSeriesPageListFun() {
                let params = {
                    pageNum: this.pageRequest.pageNum,
                    pageSize: this.pageRequest.pageSize,
                    name: this.formSearch.advTitle
                };
                advSeriesPageList(params).then((res) => {
                    console.log(res);
                    if (Number(res.code) === 0) {
                        this.advertList = res.data.data;
                        this.totalSize = res.data.totalCount;
                        this.tabLoading = false;
                    } else {
                        this.tabLoading = false;
                        this.$message.error("获取数据失败");
                    }
                });
            },
            // 重置
            resetForm() {
                this.$refs.formSearch.resetFields();
                this.pageRequest.pageNum = 1;
                this.advSeriesPageListFun();
            },
            // 保存
            save() {
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.saveLoading = true;
                        if (this.isAddOrEdit == "edit") {
                            let params = {
                                id: this.listDetail.id,
                                advSeriesName: this.addForm.addName
                            };
                            updateAdvSeries(params).then((res) => {
                                console.log(res);
                                if (Number(res.code) === 0) {
                                    this.dialogFormVisible = false;
                                    this.saveLoading = false;
                                    this.advSeriesPageListFun();
                                } else {
                                    this.$message.error("修改失败");
                                }
                            });
                        } else if (this.isAddOrEdit == "add") {
                            let params = {
                                advSeriesName: this.addForm.addName
                            };
                            addAdvSeries(params).then((res) => {
                                if (Number(res.code) === 0) {
                                    this.dialogFormVisible = false;
                                    this.saveLoading = false;
                                    this.advSeriesPageListFun();
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error("新增失败");
                                }
                            });
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            handleSizeChange() {},
            // 请求分页换页刷新 handleCurrentChange
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.advSeriesPageListFun();
            },
            // 删除
            handleDelete(row, index) {
                console.log(index);
                let _index = index;
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        let params = {
                            id: row.id
                        };
                        delAdvSeries(params).then((res) => {
                            if (Number(res.code) === 0) {
                                this.advSeriesPageListFun();
                            } else {
                                this.$message.error("删除失败");
                            }
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 修改
            handleEdit(row, index) {
                this.listDetail = row;
                this.addForm.addName = row.advSeriesName;
                this.dialogTitle = "修改广告系列";
                this.isAddOrEdit = "edit";
                this.saveLoading = false;
                this.dialogFormVisible = true;
            },
            // 新增广告跳转
            add() {
                this.addForm.addName = "";
                this.dialogTitle = "新增广告系列";
                this.isAddOrEdit = "add";
                this.saveLoading = false;
                this.dialogFormVisible = true;
            },
            indexMethod(index) {
                return (this.pageRequest.pageNum - 1) * this.pageRequest.pageSize + (index + 1);
            },
            onSubmit() {
                this.pageRequest.pageNum = 1;
                this.advSeriesPageListFun();
            }
        }
    };
</script>

<style lang="less" scoped>
    .advertList {
        padding: 20px;
        .tabCon {
            margin-bottom: 20px;
            .tab {
                background: transparent;
                border: none;
                margin-right: 20px;
                outline: none;
                padding: 20px;
                padding-top: 0;
            }
            .active-tab {
                border-bottom: 1.5px solid #409eff;
                color: #409eff;
            }
        }
        .btnCon {
            display: flex;
            justify-content: space-between;
            /deep/ .el-input,
            /deep/ .el-select {
                width: 180px;
            }
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
        .addForm {
            .el-input,
            .el-select {
                width: 50%;
            }
            .tipText {
                padding-left: 12px;
                color: #999;
            }
        }
    }
</style>
