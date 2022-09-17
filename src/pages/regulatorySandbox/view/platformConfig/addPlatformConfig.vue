<template>
    <!-- 新增/复制 平台配置-->
    <div class="addShare">
        <div>{{ title }}</div>
        <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="160px">
            <el-form-item label="银行" prop="orgId">
                <el-select class="orgClass" :disabled="$route.query.name == '修改'" v-model="form.orgId" filterable clearable placeholder="请选择">
                    <span class="ok">平台未配置银行</span>
                    <el-option v-for="item in platformConfigExistArrNO" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
                    <span class="no">平台已配置银行</span>
                    <el-option v-for="item in platformConfigExistArr" :key="item.id" disabled :label="item.orgName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="plateformSearch" label="渠道" prop="platform">
                <div class="plateformClass">
                    <div>
                        <div class="label">内部渠道</div>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group v-model="form.internalAppFlags" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in cities" :label="city.value" :value="city.label" :key="city.value">{{ city.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>

                    <div>
                        <div class="label">外部渠道</div>
                        <el-checkbox disabled :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                        <div style="margin: 0 15px"></div>
                        <el-checkbox-group disabled v-model="form.externalAppFlags" @change="handleCheckedCitiesChange1">
                            <el-checkbox v-for="city in cities1" :label="city.value" :value="city.label" :key="city.value">{{ city.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button :size="size" :loading="saveLoading" @click="save" type="primary">提交</el-button>
                <el-button :size="size" @click="cancle">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { save, selectOne, org } from "../../apis/index";
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
            var platformVal = (rule, value, callback) => {
                if (this.form.internalAppFlags.length == 0) {
                    callback(new Error("请选择内部渠道"));
                } else {
                    callback();
                }
            };
            return {
                platformConfigExistArr: [], // 平台未配置银行
                platformConfigExistArrNO: [], // 平台已配置银行
                checkAll: true,
                cities: cityOptions,
                isIndeterminate: true,
                checkAll1: false,
                cities1: cityOptions1,
                isIndeterminate1: false,
                saveLoading: false,
                form: {
                    orgId: "",
                    internalAppFlags: [],
                    externalAppFlags: [],
                    id: ""
                },
                rules: {
                    orgId: [{ required: true, message: "请选择银行", trigger: "change" }],
                    platform: [{ required: true, validator: platformVal, trigger: "change" }]
                },
                oldMsg: ""
            };
        },
        computed: {
            type() {
                return this.$route.query.type;
            },
            title() {
                return `${this.$route.query.name}平台配置`;
            }
        },
        created() {
            this.$route.meta.title = `${this.$route.query.name}平台配置`;
            if (this.$route.query.id) {
                this.selectOneFun();
            } else {
                this.handleCheckAllChange();
                this.form.internalAppFlags = ["BC", "PC", "PMP"];
            }
            org().then((res) => {
                console.log(res);
                if (res.headerModel.code == 0) {
                    let orgs = res.datatypeParam;
                    let platformConfigExistArr = [];
                    let platformConfigExistArrNO = [];
                    orgs.forEach((i) => {
                        if (i.platformConfigExist == 1) {
                            platformConfigExistArr.push(i);
                        } else {
                            platformConfigExistArrNO.push(i);
                        }
                    });
                    this.platformConfigExistArr = platformConfigExistArr;
                    this.platformConfigExistArrNO = platformConfigExistArrNO;
                }
            });
            this.oldMsg = JSON.stringify(this.form);
        },
        mounted() {},
        methods: {
            // 查询详情
            selectOneFun() {
                let params = {
                    id: this.$route.query.id
                };
                selectOne(params).then((res) => {
                    console.log(res);
                    if (res.headerModel.code == 0) {
                        this.form.id = res.datatypeParam.id;
                        this.form.orgId = res.datatypeParam.orgId;
                        this.form.orgName = res.datatypeParam.orgName;
                        if (res.datatypeParam.internalAppFlags.indexOf(",") < 0) {
                            this.form.internalAppFlags.push(res.datatypeParam.internalAppFlags);
                        } else {
                            console.log(res.datatypeParam.internalAppFlags.split(","));
                            if (res.datatypeParam.internalAppFlags.split(",").length >= 3) {
                                this.handleCheckAllChange();
                            }
                            this.form.internalAppFlags = res.datatypeParam.internalAppFlags.split(",");
                        }
                        if (res.datatypeParam.externalAppFlags.indexOf(",") < 0) {
                            this.form.externalAppFlags.push(res.datatypeParam.externalAppFlags);
                        } else {
                            this.form.externalAppFlags = res.datatypeParam.externalAppFlags.split(",");
                        }
                        if (this.$route.query.name == "复制") {
                            this.form.orgId = "";
                        }
                        this.oldMsg = JSON.stringify(this.form);
                    } else {
                        this.$message.error(res.headerModel.message);
                    }
                });
            },
            // 内部渠道多选
            handleCheckAllChange(val) {
                let all = [];
                if (val) {
                    cityOptions.filter((i) => {
                        all.push(i.value);
                    });
                }
                this.form.internalAppFlags = val ? all : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            // 外部渠道多选
            handleCheckAllChange1(val) {
                let all = [];
                if (val) {
                    cityOptions.filter((i) => {
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
            // /提交
            save() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.saveLoading = true;
                        let params = {};
                        if (this.$route.query.name == "新增" || this.$route.query.name == "复制") {
                            params = {
                                orgId: this.form.orgId,
                                internalAppFlags: this.form.internalAppFlags.toString(),
                                externalAppFlags: this.form.externalAppFlags.toString()
                            };
                        } else if (this.$route.query.name == "修改") {
                            params = {
                                orgId: this.form.orgId,
                                internalAppFlags: this.form.internalAppFlags.toString(),
                                externalAppFlags: this.form.externalAppFlags.toString(),
                                id: this.$route.query.id
                            };
                        }
                        save(params)
                            .then((res) => {
                                this.saveLoading = false;
                                if (res.headerModel.code == 0) {
                                    this.$router.push("/platformConfigList");
                                } else {
                                    this.$message.error(res.headerModel.message);
                                }
                            })
                            .catch((error) => {
                                this.$message.error("接口错误");
                                this.saveLoading = false;
                            });
                    }
                });
            },
            // 取消
            cancle() {
                if (this.oldMsg != JSON.stringify(this.form)) {
                    this.$confirm("还要继续吗？", "现在取消已编辑的内容将无法保存", {
                        confirmButtonText: "继续",
                        cancelButtonText: "取消",
                        type: "warning",
                        showClose: false
                    })
                        .then(() => {
                            this.$router.push("/platformConfigList");
                        })
                        .catch(() => {});
                } else {
                    this.$router.push("/platformConfigList");
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .addShare {
        height: 100%;
        overflow: auto;
        padding: 40px;
        form {
            width: 800px;
            margin: 0 auto;
        }
        .btnCon {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
        }
        .plateformSearch {
            .plateformClass {
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
    }
    // /deep/ .el-scrollbar__wrap {
    .ok,
    .no {
        padding: 2px 20px;
        font-size: 10px;
        width: 100%;
        display: inline-block;
        background: #ccc;
        box-sizing: border-box;
    }
    // }
</style>
