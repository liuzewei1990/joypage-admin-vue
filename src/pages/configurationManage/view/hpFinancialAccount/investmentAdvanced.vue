<template>
    <!-- 配置管理-普惠理财账户-投资进阶管理-->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="关键字" prop="keywords">
                        <el-input v-model="topCheckData.keywords" placeholder="请输入关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="产品ID" prop="prdId">
                        <el-input v-model="topCheckData.prdId" placeholder="请输入要查找的ID"></el-input>
                    </el-form-item>
                    <el-form-item label="选择机构" prop="orgId">
                        <BcSelect :apiType="2" v-model="topCheckData.orgId" :filterable="true" :remote="true" :clearable="true" placeholderText="请输入/选择机构"></BcSelect>
                    </el-form-item>
                    <el-form-item label="产品类型" prop="prdType">
                        <BcSelect :apiType="3" v-model="topCheckData.prdType" :filterable="true" :remote="false" :clearable="true" :pageSize="50" placeholderText="请选择类型"></BcSelect>
                    </el-form-item>
                    <el-form-item label="系统" prop="systemType">
                        <el-select v-model="topCheckData.systemType" placeholder="请选择" clearable>
                            <el-option label="全部" value=""></el-option>
                            <el-option label="安卓" value="android"></el-option>
                            <el-option label="苹果" value="ios"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="" style="float: left" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
                <el-button class="importBtn" style="float: left" :size="size" icon="el-icon-sort-down" type="primary" @click="dialogUploadVisible = true">批量导入</el-button>
                <el-button class="exportBtn" style="float: left" :size="size" icon="el-icon-sort-up" type="primary" @click="handleExport()">导出</el-button>
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm()">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="queryDataListBtn()">查询</el-button>
            </div>

            <!-- 表格内容 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="tableData.tableDataList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column prop="prdId" label="原产品ID" header-align="center" align="center" width="100px"></el-table-column>
                <el-table-column prop="prdName" label="产品名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="prdTypeName" label="产品类型" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="机构名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="createDatetime" label="创建时间" header-align="center" align="center" width="150px"></el-table-column>
                <el-table-column prop="startDatetime" label="开始时间" header-align="center" align="center" width="150px"></el-table-column>
                <el-table-column prop="endDatetime" label="结束时间" header-align="center" align="center" width="150px"></el-table-column>
                <el-table-column prop="systemTypeNames" label="系统" header-align="center" align="center" width="100px"></el-table-column>
                <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index, '2')">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row, '3')">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                slot="footer"
                style="float: right"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="topCheckData.pageSize"
                @size-change="handleSizeChange"
                @current-change="currentChange"
                :current-page="topCheckData.currentPage"
                :pager-count="7"
                small
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.totalCount"></el-pagination>
        </CommonTable>

        <!-- 新增弹框 -->
        <el-dialog :title="dialogTitle" width="600px" :visible.sync="dialogVisible" :before-close="closeDialog" @open="dialogOpen">
            <el-form :model="addFromData" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <!-- 解决：重置表单时，id字段也重置 -->
                <el-form-item v-show="false" prop="id"></el-form-item>

                <el-form-item label="选择机构" filterable prop="orgId">
                    <BcSelect
                        :apiType="2"
                        ref="OrgBcSelect"
                        v-if="dialogVisible"
                        v-model="addFromData.orgId"
                        @change="orgIdOnChange"
                        :filterable="true"
                        :remote="true"
                        :disabled="dialogTitle === '编辑'"
                        placeholderText="请输入/选择机构"></BcSelect>
                </el-form-item>

                <el-form-item label="选择产品类型" filterable prop="prdTypeId">
                    <BcSelect
                        :apiType="3"
                        ref="PrdtypeBcSelect"
                        v-if="dialogVisible"
                        v-model="addFromData.prdTypeId"
                        @change="prdTypeOnChange"
                        :filterable="true"
                        :remote="false"
                        :pageSize="50"
                        :disabled="dialogTitle === '编辑'"
                        placeholderText="请输入/选择产品类型）"></BcSelect>
                </el-form-item>

                <el-form-item label="选择产品" filterable prop="prdIndexId">
                    <BcSelect
                        :apiType="1"
                        ref="PrdBcSelect"
                        v-if="dialogVisible"
                        v-model="addFromData.prdIndexId"
                        @change="prdOnChange"
                        @visibleChange="prdBcSelectVisibleChange"
                        :filterable="true"
                        :remote="true"
                        :disabled="dialogTitle === '编辑'"
                        placeholderText="请选择产品，支持模糊查询（不填代表全部产品）"
                        :tooltipContent="`当前机构暂无产品`"
                        :apiAuto="true"></BcSelect>
                </el-form-item>

                <el-form-item label="生效时间" prop="dateTime">
                    <el-date-picker
                        v-model="addFromData.dateTime"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
                </el-form-item>

                <el-form-item label="生效渠道" prop="appFlags">
                    <el-checkbox-group v-model="addFromData.appFlags" size="mini" :min="1">
                        <el-checkbox label="BC" border>识贝比</el-checkbox>
                        <el-checkbox label="PC" border>识贝拼</el-checkbox>
                        <el-checkbox label="PMP" border>小程序</el-checkbox>
                        <el-checkbox label="YIYE" border>异业</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="生效设备" prop="systemType">
                    <el-checkbox-group v-model="addFromData.systemType" size="mini" :min="1">
                        <el-checkbox label="android" border>安卓</el-checkbox>
                        <el-checkbox label="ios" border>苹果</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="cancleFrom('dataForm')">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitFormAddSave('dataForm')" :loading="saveLoading">保存</el-button>
            </div>

            <!-- <div>
        <pre>
              {{addFromData}}
          </pre>
      </div> -->
        </el-dialog>

        <!-- 导入文件弹窗 -->
        <el-dialog title="导入文件" class="uploadDialog" :visible.sync="dialogUploadVisible" :destroy-on-close="true" :close-on-click-modal="false">
            <FileUpload v-model="dialogUploadVisible" @success="toTablePage(1)"></FileUpload>
        </el-dialog>
    </div>
</template>
<script>
    import { getInvestmentDataList, getCommmonSelectList, getOrgTypeInfo, investSubmitFormAddSave, investDelete } from "../../apis/index";
    import BcSelect from "./BcSelect";
    import FileUpload from "./FileUpload";
    import CommonTable from "@common/finsuit-components/CommonTable";
    export default {
        components: { BcSelect, FileUpload, CommonTable },
        data() {
            return {
                tableHeight: 0,
                //表格loading
                loading: false,
                // 表格数据
                tableData: {
                    tableDataList: [],
                    totalCount: 0
                },

                size: "small",
                //保存时按钮loading
                saveLoading: false,
                // 新增/修改弹出显示
                dialogVisible: false,
                // 文件上传弹窗显示
                dialogUploadVisible: false,
                // 新增/修改弹窗标题
                dialogTitle: "新增",

                // 顶部查询条件
                topCheckData: {
                    prdId: "",
                    orgId: {},
                    keywords: "",
                    prdType: {},
                    systemType: "",
                    currentPage: 1,
                    pageSize: 10
                },

                // 新增/修改表单
                addFromData: {
                    id: "",
                    productOrType: "",
                    orgId: "",
                    prdTypeId: "",
                    prdIndexId: "",
                    dateTime: [this.dateFormat("YYYY-mm-dd HH:MM:SS", new Date()), "2099-12-31 23:59:00"],
                    startDatetime: "",
                    endDatetime: "",
                    appFlags: ["BC"],
                    systemType: ["android", "ios"]
                },

                //新增/修改表单校验规则
                formRules: {
                    orgId: [{ required: true, message: "请选择机构", trigger: "change" }],
                    prdTypeId: [{ required: true, message: "请选择产品类型", trigger: "change" }]
                }
            };
        },

        mounted() {
            this.getDataList();
        },

        methods: {
            // 筛选相关-点击查询
            queryDataListBtn() {
                this.toTablePage(1);
            },

            //筛选相关-点击重置
            resetForm() {
                this.$refs.topData.resetFields();
                this.toTablePage(1);
            },

            // 表格相关-页码变化时调用
            currentChange(pageNum) {
                this.toTablePage(pageNum);
            },

            // 表格相关-pageSize变化时
            handleSizeChange(pageSize) {
                this.topCheckData.pageSize = pageSize;
                this.toTablePage();
            },

            // 表格相关-获取列表数据
            async getDataList() {
                this.loading = true;
                let params = {
                    headerModel: { systemType: "h5", appFlag: "BC" },
                    datatypeParam: { ...this.topCheckData, length: this.topCheckData.pageSize }
                };
                delete params.datatypeParam.pageSize;

                // 转换参数
                params.datatypeParam.orgId = this.topCheckData.orgId.id || "";
                params.datatypeParam.prdType = this.topCheckData.prdType.id || "";

                try {
                    let data = await getInvestmentDataList(params);
                    this.tableData.tableDataList = data.retList;
                    this.tableData.totalCount = data.totalCount;
                } catch (error) {
                    this.$message({ message: "数据获取异常", type: "error" });
                }
                setTimeout(() => {
                    this.loading = false;
                }, 100);
            },

            // 表格相关-单个删除
            handleDelete(index, row, type) {
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.investDelete(row.id);
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },

            // 表格相关-删除接口
            async investDelete(ids) {
                let params = {
                    headerModel: { systemType: "h5", appFlag: "BC" },
                    datatypeParam: { ids: ids }
                };
                let data = await investDelete(params);
                this.$message({ type: "success", message: "操作成功" });
                // 删除完成，刷新数据
                this.getDataList();
            },

            // 表单相关-机构ID下拉选项发生变化,联动产品类型
            async orgIdOnChange(value) {
                // 机构变动时要清空产品信息
                this.addFromData.prdIndexId = "";
                // 查询方法
                this.refreshPrdSelectList(value);
            },

            // 表单相关-刷新产品信息列表
            async refreshPrdSelectList(value) {
                // 先清空产品选择器的查询关键字等信息
                this.$refs["PrdBcSelect"].resetData();
                // 重新指定条件
                this.$refs["PrdBcSelect"].datatypeParam.orgId = value.id;
                // 有机构id type为4，默认为1查询所有
                this.$refs["PrdBcSelect"].datatypeParam.type = 4;
                await this.$refs["PrdBcSelect"].getCommmonSelectList();
            },

            // 表单相关-产品类型下拉选项发生变化
            prdTypeOnChange(v) {},

            // 表单相关-产品下拉框出现隐藏时触发
            prdBcSelectVisibleChange(v) {},

            // 表单相关-产品下拉选项发生变化,自动匹配机构和类型
            prdOnChange(value) {
                this.queryOrgInfo(value.id);
            },

            // 表单相关-根据产品ID查询机构和类型,自动匹配回显机构和产品类型
            async queryOrgInfo(prdId) {
                let params = {
                    headerModel: { systemType: "h5", appFlag: "BC" },
                    datatypeParam: { id: prdId }
                };
                let data = await getOrgTypeInfo(params);
                // 1、判断空 不回显 2、手动给input赋值，解决自动匹配机构和类型时因列表中没有该项导致回显失败的问题
                if (data.orgId && data.orgName) {
                    let orgData = { id: data.orgId, name: data.orgName };
                    this.addFromData.orgId = orgData;
                }
                if (data.prdTypeId && data.prdTypeName) {
                    let prdTypeData = { id: data.prdTypeId, name: data.prdTypeName };
                    this.addFromData.prdTypeId = prdTypeData;
                }
            },

            // 表单相关-弹框取消按钮
            cancleFrom(dataForm) {
                this.dialogVisible = false;
                this.$refs.dataForm.resetFields(); //清空数据
            },

            //表单相关-点击弹框阴影部分校验
            closeDialog(done) {
                this.$confirm("确认关闭？")
                    .then((_) => {
                        done();
                        this.$refs.dataForm.resetFields(); //清空数据
                    })
                    .catch((_) => {});
            },

            // 表单相关-新增-显示新增界面弹窗
            handleAdd() {
                this.dialogVisible = true;
                this.dialogTitle = "新增";
            },

            //表单相关-新增-保存提交 验证
            submitFormAddSave(dataForm) {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {}).then(() => {
                            this.submitFormAddSaveApi();
                        });
                    }
                });
            },

            // 表单相关-新增-保存提交-后台
            async submitFormAddSaveApi() {
                let params = {
                    headerModel: { systemType: "h5", appFlag: "BC" },
                    datatypeParam: {
                        id: this.addFromData.id,
                        // 注：该字段productOrType根据用户是否选择了产品，若选了为：1（产品）, 若未选择为：2（产品类型）
                        productOrType: this.addFromData.prdIndexId ? "1" : "2",
                        orgId: this.addFromData.orgId.id,
                        prdTypeId: this.addFromData.prdTypeId.id,
                        prdIndexId: this.addFromData.prdIndexId && this.addFromData.prdIndexId.id,
                        startDatetime: this.addFromData.dateTime[0],
                        endDatetime: this.addFromData.dateTime[1],
                        appFlags: this.addFromData.appFlags.join(),
                        systemType: this.addFromData.systemType.join()
                    }
                };
                let data = await investSubmitFormAddSave(params);

                this.dialogVisible = false;
                this.$refs.dataForm.resetFields();
                // 保存完成，刷新数据

                if (this.dialogTitle === "新增") {
                    // 新增的返回第一页刷新数据
                    this.$message({ message: "添加成功", type: "success" });
                    this.toTablePage(1);
                } else {
                    // 修改的留在当前页刷新数据
                    this.$message({ message: "修改成功", type: "success" });
                    this.toTablePage();
                }
            },

            // 表单相关-点击修改-回显数据
            async handleEdit(rowData, b, c) {
                this.dialogVisible = true;
                this.dialogTitle = "编辑";

                await this.$nextTick();

                this.addFromData.id = rowData.id;
                this.addFromData.productOrType = rowData.productOrType;

                if (rowData.orgId && rowData.orgName) {
                    let orgData = { id: rowData.orgId, name: rowData.orgName };
                    this.addFromData.orgId = orgData;
                }

                if (rowData.prdTypeId && rowData.prdTypeName) {
                    let prdTypeData = { id: rowData.prdTypeId, name: rowData.prdTypeName };
                    this.addFromData.prdTypeId = prdTypeData;
                }

                if (rowData.prdIndexId && rowData.prdName) {
                    let prdData = { id: rowData.prdIndexId, name: rowData.prdName };
                    this.addFromData.prdIndexId = prdData;
                }

                if (rowData.startDatetime && rowData.endDatetime) this.addFromData.dateTime = [rowData.startDatetime, rowData.endDatetime];
                if (rowData.appFlags) this.addFromData.appFlags = (rowData.appFlags + "").split(",");
                if (rowData.systemType) this.addFromData.systemType = (rowData.systemType + "").split(",");

                //  回显数据时，根据机构id查询对应的产品信息
                this.refreshPrdSelectList(this.addFromData.orgId);
            },

            // 文件导出
            handleExport() {
                if (this.tableData.tableDataList.length === 0) {
                    this.$message({ message: "没有要导出的数据", type: "info" });
                    return;
                }
                let a = document.createElement("a");
                let url = this.$Config.baseUrlHost + "/cInclusiveAdvInvestment/exportFile";
                url += `?orgId=${this.topCheckData.orgId.id || ""}`;
                url += `&prdId=${this.topCheckData.prdId}`;
                url += `&keywords=${this.topCheckData.keywords}`;
                url += `&systemTypes=${this.topCheckData.systemType}`;
                url += `&prdType=${this.topCheckData.prdType.id || ""}`;
                a.href = url;
                a.click();
            },

            // 文件导入完成事件-刷新数据
            toTablePage(page) {
                if (page) this.topCheckData.currentPage = page;
                this.getDataList();
            },

            // 弹窗打开,初始化数据
            dialogOpen() {},

            // 时间格式化
            dateFormat(fmt, date) {
                let ret;
                const opt = {
                    "Y+": date.getFullYear().toString(), // 年
                    "m+": (date.getMonth() + 1).toString(), // 月
                    "d+": date.getDate().toString(), // 日
                    "H+": date.getHours().toString(), // 时
                    "M+": date.getMinutes().toString(), // 分
                    "S+": date.getSeconds().toString() // 秒
                    // 有其他格式化字符需求可以继续添加，必须转化成字符串
                };
                for (let k in opt) {
                    ret = new RegExp("(" + k + ")").exec(fmt);
                    if (ret) {
                        fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
                    }
                }
                return fmt;
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

    .addBtn {
        margin: 18px 0;
    }
    .table_img {
        width: 50px;
        height: 50px;
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

    // /deep/ .switch .el-form-item__content{
    // 	padding-top: 6px;
    // }
</style>
