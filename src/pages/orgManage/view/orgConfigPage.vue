<template>
    <div class="prdSeries">
        <el-form :model="formData" :rules="rules" ref="formData" :inline="true">
            <CommonTable :isFluid="false" @height="tableHeight = $event">
                <div slot="search">
                    <el-page-header @back="cancleFrom('formData')" content="详情页面">返回</el-page-header>
                    <!-- <el-form-item class="back-btn">
                <el-button :size="size" type="primary"  @click.native="cancleFrom('formData')">返回</el-button>
            </el-form-item> -->
                    <el-form-item label="当前位置：">
                        <span>{{ formData.corgCarefullyChosenConf.positionName }}</span>
                    </el-form-item>
                    <el-form-item label="当前配置数量：">
                        <!-- <span>{{formData.corgCarefullyChosenConf.confCount}}个</span> -->
                        <span>{{ formData.dataForm.length }}个</span>
                    </el-form-item>
                    <el-form-item label="前端最大展示数量：">
                        <el-input v-model="formData.corgCarefullyChosenConf.maxCount"></el-input>
                    </el-form-item>
                    <el-form-item label="是否开启：">
                        <template>
                            <el-radio v-model="formData.corgCarefullyChosenConf.isEnabled" :label="1">是</el-radio>
                            <el-radio v-model="formData.corgCarefullyChosenConf.isEnabled" :label="0">否</el-radio>
                        </template>
                    </el-form-item>
                    <el-button style="float: right" :size="size" :type="controlAddButton ? 'primary' : 'info'" @click="addListRow()">添加</el-button>
                </div>
                <!-- <div slot="action">
          <el-button style="float:right" :size="size" :type="controlAddButton ? 'primary' : 'info' " @click="addListRow()">添加</el-button>
        </div> -->

                <!-- table表单元素 -->
                <el-table class="table-content" v-loading="loading" :height="tableHeight" :data="formData.dataForm" border="true">
                    <el-table-column v-for="item in dataFormTitle" :key="item.key" :label="item.label" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-form-item :prop="'dataForm.' + scope.$index + '.' + item.name" :rules="rules[item.name]">
                                <div v-if="item.label == '序号'">
                                    <span>{{ scope.$index + 1 }}</span>
                                </div>
                                <div v-if="item.label == '机构类型'">
                                    <BcSelect
                                        v-model="scope.row.orgOptValue"
                                        :list="orgOption"
                                        :disabled="scope.row.isEdit"
                                        @change="orgSelectValue(scope.row)"
                                        placeholder="请选择机构类型"></BcSelect>
                                </div>
                                <div v-else-if="item.label == '选择机构'">
                                    <BcSelect
                                        v-model="scope.row.orgOptSelValue"
                                        @GetApiData="getOrgSelectData($event, scope.row)"
                                        :disabled="scope.row.isEdit"
                                        :filterable="true"
                                        :remote="true"
                                        placeholder="请选择机构">
                                    </BcSelect>
                                </div>
                                <div v-else-if="item.label == '排序值'">
                                    <el-input v-model.trim="scope.row.orderNum" :disabled="scope.row.isEdit" class="forder-input" placeholder="请输入排序值"></el-input>
                                </div>
                                <div v-else-if="item.label == '操作'">
                                    <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 取消提交按钮 -->
                <div slot="footer" class="footer">
                    <el-button :size="size" @click="cancleFrom('formData')">取消</el-button>
                    <el-button :size="size" type="primary" @click="submitFormEditSave('formData')" :loading="loading">提交</el-button>
                </div>
            </CommonTable>
        </el-form>
    </div>
</template>
<script>
    import CommonTable from "@common/finsuit-components/CommonTable";
    import BcSelect from "../components/BcSelect";
    export default {
        components: {
            CommonTable,
            BcSelect
        },
        data() {
            return {
                loading: false,
                tableHeight: 0,
                size: "small",
                isEnabled: "0", //是否开启,
                controlAddButton: "true", //是否可增加数据
                formData: {
                    //弹窗数据提交数据
                    corgCarefullyChosenConf: {
                        confCount: "", //选择机构输入值
                        isEnabled: "0", //是否开启
                        maxCount: "8", //最大可展示数量
                        positionName: "" //当前位置
                    },
                    dataForm: []
                },
                dataFormTitle: [
                    //table表头
                    {
                        name: "序号",
                        width: 150,
                        label: "序号"
                    },
                    {
                        name: "orgOptValue",
                        width: 350,
                        label: "机构类型"
                    },
                    {
                        name: "orgOptSelValue",
                        width: 350,
                        label: "选择机构"
                    },
                    {
                        name: "orderNum",
                        width: 350,
                        label: "排序值"
                    },
                    {
                        name: "操作",
                        width: 350,
                        label: "操作"
                    }
                ],
                orgOption: [
                    {
                        name: "银行机构",
                        id: "1"
                    },
                    {
                        name: "非银行机构",
                        id: "2"
                    }
                ],
                rules: {
                    orgOptSelValue: [{ required: true, message: "请选择机构", trigger: "change" }],
                    orderNum: [{ required: true, message: "请输入排序值", trigger: "change" }]
                }
            };
        },
        created() {
            this.initForm();
            this.getData();
            // document.location.reload()//页面刷新
        },
        methods: {
            // 列表接口
            getData() {
                this.$api.getData().then((res) => {
                    //   console.log('table列表接口',res)
                    this.formData.corgCarefullyChosenConf = res.data.corgCarefullyChosenConf;
                    this.formData.dataForm = res.data.orgCarefullyChosenList;
                    res.data.orgCarefullyChosenList.forEach((item, index) => {
                        item.orgOptSelValue = item.orgName;
                        item.orgOptValue = {};
                        item.isEdit = true;
                        if (item.oneLevelOrgType == "1") {
                            item.orgOptValue.id = "1";
                            item.orgOptValue.name = "银行机构";
                        } else if (item.oneLevelOrgType == "2") {
                            item.orgOptValue.id = "2";
                            item.orgOptValue.name = "非银行机构";
                        }
                    });
                    //   console.log('改造后的数组',this.formData.dataForm)
                });
            },

            // 首次初始化
            initForm() {
                this.formData.dataForm.push(this.newFormItem());
            },

            // 生成新的 row formItem
            newFormItem() {
                return {
                    //机构选型
                    orgOptValue: { name: "银行机构", id: "1" },
                    //选择机构
                    orgOptSelValue: "",
                    // 排序值
                    orderNum: this.formData.dataForm.length + 1
                };
            },

            // 当获取焦点时获取机构列表
            async getOrgSelectData($event, formItem) {
                let { query, callback } = $event;
                let params = {};
                params["onelevelType"] = formItem.orgOptValue.id;
                (params["keywords"] = query.keywords), (params["currentPage"] = query.currentPage);

                let data = await this.$api.selectData(params).then((res) => res.data || {});

                callback({ list: data.list, total: data.totalRow });
            },

            // 类型变化时，机构置空
            orgSelectValue(formItem) {
                formItem.orgOptSelValue = "";
            },

            // 提交按钮
            submitFormEditSave(formData) {
                //   console.log('提交数据dataForm',this.formData.dataForm)
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        console.log("submit--SUCCESS!");
                        this.loading = true;
                        let isAddItem = this.formData.dataForm.find((item) => {
                            return item.orgOptSelValue instanceof Object;
                        });
                        //   console.log('isAddItem',isAddItem)
                        let orgCarefullyChosenList = [];
                        let submitData = {};
                        if (isAddItem) {
                            submitData.orgId = isAddItem.orgOptSelValue.id;
                            submitData.orderNum = isAddItem.orderNum;
                        }
                        orgCarefullyChosenList.push(submitData);
                        let paramsSave = {
                            maxCount: this.formData.corgCarefullyChosenConf.maxCount,
                            confCount: this.formData.dataForm.length,
                            isEnabled: this.formData.corgCarefullyChosenConf.isEnabled,
                            orgCarefullyChosenList: orgCarefullyChosenList
                        };
                        console.log("paramsSave", paramsSave);

                        this.$api
                            .orgSave(paramsSave)
                            .then((res) => {
                                // console.log('提交成功',res)
                                this.controlAddButton = true;
                                this.loading = false;
                                this.$message({ message: "提交成功", type: "success" });
                                this.getData(); //刷新当前页
                            })
                            .catch((err) => {
                                console.log("提交失败", err);
                                this.loading = false;
                                this.$message({ message: "提交失败", type: "success" });
                            });
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },

            // 新增
            addListRow() {
                //每次只可新增一条数据，如果已添加一条，则增加按钮置灰不可再增加
                if (this.controlAddButton) {
                    this.formData.dataForm.push(this.newFormItem());
                    this.controlAddButton = false;
                }
            },
            // 单个删除
            handleDelete(index, row) {
                //   console.log('单个删除',row)
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            id: row.id
                        };
                        // console.log('row.id',row.id)
                        if (row.id) {
                            this.$api
                                .orgDelete(params)
                                .then((res) => {
                                    // console.log("删除接口",res);
                                    this.loading = false;
                                    this.$message({ message: "删除成功", type: "success" });
                                    this.formData.dataForm.splice(index, 1); //删除一行
                                })
                                .catch((err) => {
                                    console.log("删除接口err", err);
                                    this.loading = false;
                                    this.$message({ message: err, type: "error" });
                                });
                        } else {
                            this.loading = false;
                            this.$message({ message: "删除成功", type: "success" });
                            this.formData.dataForm.splice(index, 1); //删除一行
                            this.controlAddButton = true;
                        }
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                        this.loading = false;
                    });
            },
            // 取消
            cancleFrom(formData) {
                this.controlAddButton = true;
                if (!this.controlAddButton) {
                    this.formData.dataForm.splice(-1); //删除一行
                }
                // this.$router.go(-1)
                this.$router.push({ path: "/orgDisplayConfig", query: { sign: true } });
                window.location.reload();
            },
            // 机构表单自定义校验
            orgValidator(rule, value, callback) {
                if (!value.id) {
                    callback(new Error());
                } else {
                    callback();
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    /deep/ .el-page-header__content {
        display: none;
    }
    .prdSeries {
        padding: 20px;
    }
    .footer {
        text-align: center;
    }
    .table-content {
        /deep/ .el-form-item {
            margin-right: 0;
            margin-bottom: 12px;
        }
        /deep/ .el-input__inner {
            height: 30px;
            line-height: 30px;
        }
        /deep/ .el-form-item__error {
            padding-top: 0;
        }
    }
    /deep/ .el-form-item {
        margin-right: 40px;
    }
    /deep/ .el-table th {
        padding: 5px 0;
    }
    /deep/ .el-table td {
        padding: 5px 0;
    }
    .back-btn {
        margin-right: 0;
        display: block;
        text-align: right;
    }
    /deep/ .content-search {
        .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
