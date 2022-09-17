<template>
    <!-- 配置管理-智能投顾配置-模块配置 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" :size="size" icon="el-icon-plus" style="float: left" type="primary" @click="handleAdd()">新增</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="moduleList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <!-- <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column> -->
                <el-table-column prop="id" label="ID" header-align="center" align="center" width="100px"></el-table-column>
                <el-table-column prop="modularName" label="模块名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orderNum" label="排序" header-align="center" align="center"></el-table-column>
                <el-table-column prop="isEnabled" label="是否启用" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isEnabled == 1">是</span>
                        <span v-if="scope.row.isEnabled == 0">否</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150px" header-align="center" align="center">
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
                    @size-change="handleSizeChange"
                    @current-change="refreshPageRequest"
                    :current-page="pageRequest.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageRequest.pageSize">
                </el-pagination>
            </div>
        </CommonTable>
        <!-- 新增弹框 -->
        <el-dialog :title="!dataForm.id ? '新增' : dialogTitle" width="40%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <el-form-item label="模块名称：" prop="modularName">
                    <el-input v-model="dataForm.modularName" type="text" placeholder="请输入模块名称"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接：" prop="linkUrl">
                    <el-input v-model="dataForm.linkUrl" type="text" placeholder="请输入跳转链接"></el-input>
                </el-form-item>
                <el-form-item label="排序值：" prop="orderNum">
                    <el-input v-model="dataForm.orderNum" type="text" placeholder="请输入排序值"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：" prop="isEnabled">
                    <el-radio v-model="dataForm.isEnabled" :label="1">是</el-radio>
                    <el-radio v-model="dataForm.isEnabled" :label="0">否</el-radio>
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
    import { getModuleListData, updateModuleSave, getModuleDelete, forUpload } from "../../apis/index";
    import config from "../../config/config.index.js";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "EarningsUpgrades",
        components: { CommonTable },
        data() {
            return {
                tableHeight: 0, //内容高度
                size: "small",
                loading: false, //请求列表时loading
                proName: "", //内容-内容
                pageRequest: {
                    //内容分页
                    pageNum: "1",
                    pageSize: "10",
                    totalPage: "0"
                },
                moduleList: [], //请求回来的表格列表数据list
                dialogTitle: "新增",
                saveLoading: false, //保存时按钮loading
                // 新增和编辑
                dialogVisible: false, //是否展示新增编辑弹框
                dataForm: {
                    //修改弹框数据
                    id: "",
                    modularName: "", //模块名称
                    linkUrl: "", //跳转链接
                    orderNum: "", //排序
                    isEnabled: "" //是否启用。1启用,是；0未启用，否
                },
                //新增/修改表单校验规则
                formRules: {
                    modularName: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
                    orderNum: [{ required: true, message: "请输入排序值", trigger: "blur" }],
                    isEnabled: [{ required: true, message: "请选择是否启用", trigger: "change" }]
                }
            };
        },
        mounted() {
            this.getModuleListData(); //列表数据
        },
        methods: {
            // 获取列表数据
            async getModuleListData(type) {
                this.loading = true;
                let params = {
                    length: this.pageRequest.pageSize, //查询多少条
                    currentPage: this.pageRequest.pageNum, //当前页数
                    modularName: "" //模块名称
                };
                console.log("列表数据入参", params);
                try {
                    let resData = await getModuleListData(params); //接口
                    console.log("列表数据", resData);
                    this.loading = false;
                    this.moduleList = resData.retList; //列表list
                    this.totalSize = resData.totalCount; //总条数
                } catch (error) {
                    this.$message({ message: "数据获取异常", type: "error" });
                }
                setTimeout(() => {
                    this.loading = false;
                }, 100);
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getModuleListData(); //调基金公司列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getModuleListData(); //调产品系列列表接口
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
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    modularName: "", //模块名称
                    linkUrl: "", //跳转链接
                    orderNum: "", //排序
                    isEnabled: 0 //是否启用。1启用0未启用
                };
                Object.assign(this.dataForm);
            },
            // 显示编辑界面弹框--回显
            handleEdit: function (row, index) {
                console.log("编辑", row);
                this.dialogTitle = "修改";
                this.dialogVisible = true;
                Object.assign(this.dataForm, row);
            },
            //新增/修改稿保存提交
            submitFormSave(dataForm) {
                console.log("保存");
                let params = {
                    id: this.dataForm.id,
                    modularName: this.dataForm.modularName, //模块名称
                    linkUrl: this.dataForm.linkUrl, //跳转链接
                    orderNum: this.dataForm.orderNum, //排序
                    isEnabled: this.dataForm.isEnabled //是否启用。1启用0未启用
                };
                console.log("保存入参", params);
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                updateModuleSave(params)
                                    .then((resData) => {
                                        console.log("保存接口", resData);
                                        if (resData.code == "0") {
                                            this.saveLoading = false;
                                            if (this.dialogTitle === "新增") {
                                                this.$message({ message: "添加成功", type: "success" });
                                            } else {
                                                this.$message({ message: "修改成功", type: "success" });
                                            }
                                            this.dialogVisible = false;
                                            this.getModuleListData(); //刷新列表
                                        } else {
                                            this.$message({ message: resData.description ? resData.description : "排序值不能重复，请重新输入排序值！", type: "info" });
                                            this.dataForm.orderNum = "";
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("新增接口err", err);
                                        this.$message({ message: err, type: "error" });
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消新增" });
                                this.saveLoading = false;
                            });
                    }
                });
            },

            // 单个删除
            handleDelete(index, row) {
                console.log("单个删除", row);
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            ids: row.id
                        };
                        console.log("单个删除入参", params);
                        getModuleDelete(params)
                            .then((resData) => {
                                console.log("删除接口", resData);
                                this.loading = false;
                                this.$message({ message: "删除成功", type: "success" });
                                this.getModuleListData(); //刷新当前页
                            })
                            .catch((err) => {
                                console.log("删除接口err", err);
                                this.loading = false;
                                this.$message({ message: err, type: "error" });
                            });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                        this.loading = false;
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
    // .action{
    // 	padding: 10px 0;
    // 	height: 32px;
    // }
    .table_img {
        width: 50px;
        height: 50px;
    }
    .table {
        .table_img {
            width: 50px;
            height: 50px;
        }
    }

    .addForm {
        .el-form-item__label-wrap {
            margin-left: 0px !important; //新增的所有label 靠左显示
        }
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
        .tipText {
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

    // /deep/ .switch .el-form-item__content{
    // 	padding-top: 6px;
    // }

    .uploadDialog {
        /deep/ .el-dialog__body {
            padding: 30px 20px 60px;
            // .el-upload-dragger{
            // 	width: 632px;
            // }
            .el-upload__tip {
                padding-left: 20px;
            }
            .uploadBTtn {
                float: right;
            }
        }
    }
</style>
