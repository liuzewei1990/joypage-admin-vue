<template>
    <!-- 新增小程序  模块 -->
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="isClose" :show-close="showClose">
        <ul>
            <li>
                <el-form :size="size" ref="form" :rules="rules" :model="form" label-width="160px">
                    <el-form-item label="小程序ID：" prop="appId">
                        <el-input type="text" placeholder="请输入" v-model="form.appId"> </el-input>
                    </el-form-item>
                    <el-form-item label="小程序名称：" prop="appName">
                        <el-input type="text" placeholder="请输入" v-model="form.appName"> </el-input>
                    </el-form-item>
                    <el-form-item label="小程序Secret：" prop="appSecret">
                        <el-input type="text" placeholder="请输入" v-model="form.appSecret"> </el-input>
                    </el-form-item>
                    <el-form-item label="小程序原始id：" prop="originalId">
                        <el-input type="text" placeholder="请输入" v-model="form.originalId"> </el-input>
                    </el-form-item>
                </el-form>
            </li>
        </ul>
        <div class="btnCon">
            <el-button :size="size" :loading="saveLoading" @click="save" type="primary">提交</el-button>
            <el-button :size="size" @click="cancle">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { addApplet, updateApplet } from "../apis/index";
    export default {
        data() {
            return {
                saveLoading: false,
                size: "small",
                dialogVisible: true,
                isClose: false,
                showClose: false,
                rules: {
                    appName: [{ required: true, message: "请输入小程序名称", trigger: "blur" }],
                    appId: [{ required: true, message: "请输入小程序Id", trigger: "blur" }],
                    appSecret: [{ required: true, message: "请输入小程序Secret", trigger: "blur" }],
                    originalId: [{ required: true, message: "请输入小程序原始id", trigger: "blur" }]
                }
            };
        },
        mounted() {
            console.log(this.form);
        },
        props: ["form", "status"],
        methods: {
            // 取消
            cancle() {
                this.$emit("cancle");
            },
            // 提交
            save() {
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        // 新建
                        if (this.status == "add") {
                            let params = {
                                appName: this.form.appName,
                                appId: this.form.appId,
                                appSecret: this.form.appSecret,
                                originalId: this.form.originalId,
                                imgUrl: "",
                                useStatus: "",
                                useStartTime: "",
                                useOrder: ""
                            };
                            this.saveLoading = true;
                            addApplet(params).then((res) => {
                                if (Number(res.code) === 0) {
                                    this.saveLoading = false;
                                    this.$emit("save");
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error(res.message);
                                }
                            });
                        }
                        // 修改
                        if (this.status == "edit") {
                            let params = {
                                appName: this.form.appName,
                                appId: this.form.appId,
                                appSecret: this.form.appSecret,
                                originalId: this.form.originalId,
                                id: this.form.id,
                                imgUrl: "",
                                useStatus: "",
                                useStartTime: "",
                                useOrder: ""
                            };
                            this.saveLoading = true;
                            updateApplet(params).then((res) => {
                                if (Number(res.code) === 0) {
                                    this.saveLoading = false;
                                    this.$emit("save");
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error(res.message);
                                }
                            });
                        }
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .btnCon {
        display: flex;
        justify-content: center;
    }
</style>
