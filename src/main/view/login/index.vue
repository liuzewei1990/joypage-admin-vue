<template>
    <div class="login-container">
        <el-form :model="ruleForm2" :rules="rules2" status-icon ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-page">
            <p class="title">运营系统登录</p>
            <el-form-item prop="username">
                <el-input type="text" v-model="ruleForm2.username" name="username" autocomplete="off" placeholder="用户名" :autofocus="false"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="ruleForm2.password" name="password" autocomplete="off" placeholder="密码" :show-password="false"></el-input>
            </el-form-item>
            <!-- <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox> -->
            <el-form-item style="width: 100%">
                <el-button type="primary" style="width: 100%" @click="handleSubmit" :loading="logining">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    username: "",
                    password: ""
                },
                rules2: {
                    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                    password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
                },
                checked: false
            };
        },
        methods: {
            handleSubmit(event) {
                this.$refs.ruleForm2.validate(async (valid) => {
                    if (valid) {
                        this.logining = true;

                        try {
                            //  登录
                            let data = await this.$api.login({
                                ACCOUNT: this.ruleForm2.username,
                                PASSWORD: this.ruleForm2.password
                            });

                            // 获取用户信息
                            let userInfo = await this.$api.setting();
                            this.$store.commit("USER_INFO", userInfo);

                            // 记录前端登录标记，并跳转路由
                            this.$store.dispatch("login", "1");
                            this.$router.push({ path: "/" });
                        } catch (error) {
                            console.log(error);
                        }

                        this.logining = false;
                    } else {
                        console.log("error submit!");
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .login-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        /* width: 100%; */
        /* height: 100%; */
        background: #eee;
        background: url("../../assets/images/bgimg.jpg") no-repeat;
        background-size: cover;
        background-position: center center;
    }
    .login-page {
        -webkit-border-radius: 5px;
        border-radius: 10px;
        /* margin: 180px auto; */
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        padding: 35px 35px;
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid #eaeaea;
        .title {
            margin-bottom: 30px;
            color: #fff;
            font-size: 30px;
            font-weight: 100;
        }
        /* box-shadow: 0 0 25px #cac6c6; */
    }
    label.el-checkbox.rememberme {
        margin: 0px 0px 15px;
        text-align: left;
    }
</style>
