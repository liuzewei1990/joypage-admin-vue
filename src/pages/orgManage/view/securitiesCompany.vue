<template>
    <!-- 证券公司管理 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="证券公司名称：" prop="name">
                        <el-select v-model="topCheckData.name" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in securitiesCompanyNameList" :key="item.id" :label="item.name" :value="item.name"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" style="float: left" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm('topData')">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="getSecuritiesCompanyList('chaxun')">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="securitiesCompanyList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column type="index" label="序号" width="80" header-align="center" align="center"></el-table-column>
                <el-table-column prop="name" label="证券公司名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="code" label="证券公司编码" header-align="center" align="center"></el-table-column>
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
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="60%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <el-form-item label="证券公司名称：" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入证券公司名称"></el-input>
                </el-form-item>
                <el-form-item label="机构logo" prop="logoUrl">
                    <el-upload
                        :model="imageUrl + dataForm.logoUrl"
                        class="upload-demo"
                        ref="upload1"
                        accept=".png"
                        action="#"
                        :limit="limitNum"
                        :on-exceed="exceedFile"
                        :http-request="uploadPictureLogo"
                        :show-file-list="false">
                        <img v-if="dataForm.logoUrl" :src="imageUrl + dataForm.logoUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <span class="el-upload__tip" slot="tip">仅支持一张</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="证券公司编码：" prop="code">
                    <el-input v-model="dataForm.code" placeholder="请输入证券公司编码"></el-input>
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
    // 接口函数依次：查询证券公司名称，查询列表，新增，修改，删除
    import { querySecuritiesNames, querySecuritiesList, createSecurities, updSecurities, deleteSecurities, forUpload } from "../apis/index";
    import config from "../config/config.index.js";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        name: "fundCompanyManage",
        components: { CommonTable },
        data() {
            return {
                imageUrl: "", //图片前面有域名的部分地址
                size: "small",
                topCheckData: {
                    //顶部搜索选择的工具内容
                    name: "", //证券公司名称
                    fundStatus: ""
                },
                dialogUploadVisible: false, //是否显示导入的上传文件的弹框
                securitiesCompanyNameList: [], //证券公司列表
                totalSize: 0, //总数
                pageRequest: {
                    //请求证券公司列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求证券公司时loading
                securitiesCompanyList: [], //请求回来的证券公司列表数据list
                saveLoading: false, //保存时按钮loading
                // 新增和编辑
                dialogVisible: false, //是否展示新增编辑弹框
                dataForm: {
                    //新增弹框数据
                    id: "", //
                    name: "", //证券公司名称
                    code: "", //证券公司编码量
                    updId: "", //修改人
                    logoUrl: "" //logo图片地址
                },
                formRules: {
                    //弹框校验规则
                    name: [{ required: true, message: "请输入证券公司名称", trigger: "blur" }],
                    code: [{ required: true, message: "请输入证券公司编码", trigger: "blur" }],
                    logoUrl: [{ required: true, message: "请上传机构logo", trigger: "blur" }]
                }
            };
        },
        mounted() {
            //图片初始化地址：
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);
            this.getnameByBankType(); //下拉框证券公司名称数据
            this.getSecuritiesCompanyList(); //证券公司管理列表
        },
        methods: {
            //请求证券公司名称列表
            getnameByBankType() {
                let params = "";
                querySecuritiesNames(params)
                    .then((res) => {
                        console.log("获取证券公司名称", res);
                        if (res.result == true) {
                            //机构列表
                            this.securitiesCompanyNameList = res.data;
                        } else {
                            console.log("获取证券公司名称失败");
                            this.loading = false;
                            this.$message({ message: res.description, type: "error" });
                        }
                    })
                    .catch((err) => {
                        console.log("证券公司名称请求失败err", err);
                        this.loading = false;
                        this.$message({ message: "证券公司名称请求失败", type: "error" });
                    });
            },
            // 获取证券公司列表数据
            getSecuritiesCompanyList: function (type) {
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
                    name: this.topCheckData.name //证券公司名称
                };
                console.log("证券公司管理数据入参", params);
                querySecuritiesList(params)
                    .then((res) => {
                        console.log("获取证券公司列表数据", res);
                        if (res.result == true) {
                            this.loading = false;
                            this.securitiesCompanyList = res.data.data;
                            this.totalSize = res.data.totalCount; //总条数
                        } else {
                            this.loading = false;
                            this.$message({ message: res.description, type: "error" });
                        }
                    })
                    .catch((err) => {
                        console.log("证券公司管理数据入参err", err);
                        this.loading = false;
                        this.$message({ message: "请求证券公司列表数据失败", type: "error" });
                    });
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getSecuritiesCompanyList(); //调证券公司列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getSecuritiesCompanyList(); //调产品系列列表接口
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
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    name: "", //证券公司名称
                    code: "", //旗下基金数量
                    createId: 0, //创建人
                    logoUrl: "" //logo图片地址
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
                                createSecurities(params)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "success" });
                                            this.dialogVisible = false;
                                            this.getSecuritiesCompanyList();
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
                                updSecurities(params)
                                    .then((res) => {
                                        console.log("修改接口", res);
                                        if (res.result == true) {
                                            console.log("修改接口成功", res);
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "success" });
                                            this.dialogVisible = false;
                                            this.getSecuritiesCompanyList();
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
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            id: row.id, //必传
                            updId: row.updId
                        };
                        console.log("单个删除入参", params);
                        deleteSecurities(params)
                            .then((res) => {
                                console.log("删除接口", res);
                                if (res.result == true) {
                                    this.loading = false;
                                    this.$message({ message: res.description, type: "success" });
                                    this.getSecuritiesCompanyList(); //刷新当前页
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
            },

            //上传图片-------------start---------------------------------
            // 文件超出个数限制时的钩子
            exceedFile(files, fileList) {
                this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
            },
            //上传图片
            uploadPictureLogo(params) {
                const _file = params.file;
                let extension = _file.name.substring(_file.name.lastIndexOf(".") + 1);
                const isLt5M = _file.size / 1024 / 1024 < 5;
                if (extension !== "png") {
                    this.$message.warning("只能上传后缀是.png的文件");
                }
                if (!isLt5M) {
                    this.$message.error("请上传5M以下的图片");
                    return false;
                }
                var formData = new FormData();
                formData.append("name", _file);
                console.log("formData", formData);
                forUpload(formData)
                    .then((res) => {
                        console.log(res);
                        if (res.result) {
                            this.dataForm.logoUrl = res.data[0];
                            // this.imageUrl = `${this.$Config.aliyuncHost}${res.data[0]}`
                            this.$refs.upload1.clearFiles(); //清空文件
                        } else {
                            this.$message.error(res.description);
                        }
                    })
                    .catch((err) => {
                        this.$message({ message: "上传请求失败", type: "error" });
                    });
            }
            //--------------end---------------------------
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
