<template>
    <!-- 配置管理-公共模块-首页标签筛选接口 -->
    <div class="prdSeries">
        <!--标头查询区-->
        <div class="topBox">
            <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                <el-form-item label="标签状态：" prop="isOk">
                    <el-select v-model="topCheckData.isOk" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.isOkList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称：" prop="lableValue">
                    <el-select v-model="topCheckData.lableValue" placeholder="请选择" filterable clearable @change="lableNameListSelect">
                        <el-option v-for="item in allSelectData.lableNameList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能开关：" prop="switchStr">
                    <el-switch
                        v-model="topCheckData.switchStr"
                        active-color="#409EFF"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0"
                        active-text="YES"
                        inactive-text="NO"
                        @change="getuUpdSwitchStr()"></el-switch>
                </el-form-item>
                <el-form-item style="padding-left: 100px">
                    <el-button icon="el-icon-search" type="primary" @click="getQueryLableSelectList('chaxun')">查询</el-button>
                    <el-button icon="el-icon-refresh" @click="resetForm('topData')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-button class="addBtn" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增标签</el-button>
            <!-- 表格内容栏 -->
            <el-table :height="500" size="mini" :data="lableList" style="width: 100%" stripe border="true" @selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
                <el-table-column type="index" label="编号" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orderNum" label="展示位编号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="lableName" label="标签名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="isOk" label="标签状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.isOk == '0'" :size="size">关闭</p>
                        <p v-if="scope.row.isOk == '1'" :size="size">开启</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div class="toolbar" style="padding: 10px 0">
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
        </div>
        <!-- 新增弹框 -->
        <el-dialog :title="!dataForm.ID ? '新增' : '修改'" width="60%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <el-form-item label="展示位编号：" prop="orderNum">
                    <el-input v-model="dataForm.orderNum" type="number" placeholder="请输入展示位编号"></el-input>
                </el-form-item>
                <el-form-item label="标签名称：" prop="lableName">
                    <el-select v-model="dataForm.lableValue" placeholder="请选择" filterable clearable @change="lableNameListSelect">
                        <el-option v-for="item in allSelectData.lableNameList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用：" prop="isOk">
                    <el-switch
                        v-model="dataForm.isOk"
                        active-color="#409EFF"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0"
                        active-text="YES"
                        inactive-text="NO"
                        @change="getuUpdSwitchStr()"></el-switch>
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
    // 接口函数依次：获取所有标签，功能开关，查询列表，新增，修改，删除
    import { getAllLable, updSwitchStr, queryLableSelectList, createLableSelect, updLableSelect, deleteLableSelect } from "../../apis/index";
    import config from "../../config/config.index.js";
    export default {
        name: "fundCompanyManage",
        data() {
            return {
                imageUrl: "", //图片前面有域名的部分地址
                size: "small",
                topCheckData: {
                    //顶部搜索选择的工具内容
                    lableName: "", //标签名称
                    lableValue: "", //标签值
                    isOk: "", //标签状态启用
                    switchStr: "" //功能开关
                },
                dialogUploadVisible: false, //是否显示导入的上传文件的弹框
                totalSize: 0, //总数
                pageRequest: {
                    //请求基金公司列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求基金公司时loading
                lableList: [], //请求回来的基金公司列表数据list
                allSelectData: {
                    lableNameList: [], //基金公司名称
                    isOkList: [
                        {
                            name: "关闭",
                            value: "0"
                        },
                        {
                            name: "开启",
                            value: "1"
                        }
                    ] //状态list
                },
                saveLoading: false, //保存时按钮loading
                // 新增和编辑
                dialogVisible: false, //是否展示新增编辑弹框
                dataForm: {
                    //新增弹框数据
                    ID: "1", //
                    orderNum: Number, //展示位编码
                    lableName: "a标签", //标签名称
                    lableValue: "11", //标签值
                    isOk: "1", //是否开启0，关闭；1开启
                    updId: ""
                },
                formRules: {
                    //弹框校验规则
                    orderNum: [{ required: true, message: "请选择展示位编码", trigger: "blur" }],
                    lableName: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
                    isOk: [{ required: true, message: "请输入标签名称", trigger: "change" }]
                }
            };
        },
        mounted() {
            //图片初始化地址：
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);
            this.getAllLableSelect(); //下拉框基金公司名称数据
            this.getQueryLableSelectList(); //基金公司管理列表
        },
        methods: {
            //请求标有的标签
            getAllLableSelect() {
                let params = "";
                getAllLable(params)
                    .then((res) => {
                        console.log("获取标签名称list", res);
                        if (res.result == true) {
                            //机构列表
                            this.allSelectData.lableNameList = res.data.allLableList;
                        } else {
                            console.log("获取标签名称list失败");
                            this.loading = false;
                            this.$message({ message: res.description, type: "success" });
                        }
                    })
                    .catch((err) => {
                        console.log("标签名称list请求失败err", err);
                        this.loading = false;
                        this.$message({ message: "标签名称请求失败", type: "error" });
                    });
            },
            //点击功能开关请求接口
            getuUpdSwitchStr() {
                let params = {
                    switchStr: this.topCheckData.switchStr //0 、关 1、开
                };
                console.log(params);
                updSwitchStr(params)
                    .then((res) => {
                        console.log("功能开关", res);
                        if (res.result == true) {
                            this.$message({ message: res.description, type: "succes" });
                        }
                    })
                    .catch((err) => {
                        console.log("标签名称list请求失败err", err);
                        this.$message({ message: "标签名称请求失败", type: "error" });
                    });
            },
            // 获取列表数据
            getQueryLableSelectList: function (type) {
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
                    lableName: this.topCheckData.lableName, //基金公司名称
                    lableValue: this.topCheckData.lableValue, //基金公司名称
                    isOk: this.topCheckData.isOk ? parseInt(this.topCheckData.isOk) : null, //标签状态
                    switchStr: this.topCheckData.switchStr //是否启用
                };
                console.log("列表数据入参", params);
                queryLableSelectList(params)
                    .then((res) => {
                        console.log("列表数据", res);
                        if (res.result == true) {
                            this.loading = false;
                            this.lableList = res.data.lableList.data; //列表list
                            this.totalSize = res.data.lableList.totalCount; //总条数
                            this.topCheckData.switchStr = res.data.switchStr; //功能开关
                            console.log(this.topCheckData.switchStr);
                        } else {
                            this.loading = false;
                            this.$message({ message: res.description, type: "error" });
                        }
                    })
                    .catch((err) => {
                        console.log("列表数据请求err", err);
                        this.loading = false;
                        this.$message({ message: "请求列表数据失败", type: "error" });
                    });
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getQueryLableSelectList(); //调基金公司列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getQueryLableSelectList(); //调产品系列列表接口
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
            //选择系列名称
            lableNameListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.lableNameList.find(function (item) {
                    return item.DIC_VALUE === val;
                });
                console.log(obj.DIC_NAME);
                this.topCheckData.lableName = obj.DIC_NAME;
                this.dataForm.lableName = obj.DIC_NAME;
            },
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    orderNum: Number, //展示位编码
                    lableName: "", //标签名称
                    lableValue: "", //标签值
                    isOk: "" //是否开启0，关闭；1开启
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
                                createLableSelect(params)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "success" });
                                            this.dialogVisible = false;
                                            this.getQueryLableSelectList();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "error" });
                                            this.dialogVisible = false;
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("新增接口err", err);
                                        this.$message({ message: err, type: "error" });
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
                                updLableSelect(params)
                                    .then((res) => {
                                        console.log("修改接口", res);
                                        if (res.result == true) {
                                            console.log("修改接口成功", res);
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "success" });
                                            this.dialogVisible = false;
                                            this.getQueryLableSelectList();
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "error" });
                                            this.dialogVisible = false;
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("编辑接口err", err);
                                        this.$message({ message: err, type: "error" });
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消编辑" });
                            });
                    }
                });
            },

            // 单个删除
            handleDelete(index, row) {
                console.log("单个删除", row);
                if (row.fundStatus == "0") {
                    this.$message({ type: "info", message: "该条基金公司数据，已为弃用数据，无需删除，如需使用，可在修改中更改状态！" });
                } else {
                    this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                        .then(() => {
                            this.loading = true;
                            let params = {
                                ID: row.id //必传
                            };
                            console.log("单个删除入参", params);
                            deleteLableSelect(params)
                                .then((res) => {
                                    console.log("删除接口", res);
                                    if (res.result == true) {
                                        this.loading = false;
                                        this.$message({ message: res.description, type: "success" });
                                        this.getQueryLableSelectList(); //刷新当前页
                                    } else {
                                        this.loading = false;
                                        this.$message({ message: res.description, type: "error" });
                                    }
                                })
                                .catch((err) => {
                                    console.log("删除接口err", err);
                                    this.loading = false;
                                    this.$message({ message: err, type: "error" });
                                });
                        })
                        .catch(() => {
                            this.$message({ type: "info", message: "已取消删除" });
                        });
                }
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
    .topBox {
        border-bottom: 1px solid #ebeef5;
    }
    .addBtn {
        margin: 18px 0;
    }
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
</style>
