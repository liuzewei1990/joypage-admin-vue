<template>
    <div class="errPage-container">
        <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back"> 返回 </el-button>
        <el-row>
            <el-col :span="12">
                <h1 class="text-jumbo text-ginormous">Oops!</h1>
                <h2>你没有权限去该页面</h2>
                <h6>如有不满请联系你领导</h6>
                <ul class="list-unstyled">
                    <li>或者你可以去:</li>
                    <li class="link-type">
                        <a href="../main"> 回首页 </a>
                    </li>
                    <li class="link-type">
                        <a href="https://www.taobao.com/">随便看看</a>
                    </li>
                    <li><a href="#" @click.prevent="dialogVisible = true">点我看图</a></li>
                </ul>
            </el-col>
            <el-col :span="12">
                <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream." />
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible" title="随便看">
            <img :src="ewizardClap" class="pan-img" />
        </el-dialog>
    </div>
</template>

<script>
    import errGif from "./401.gif";
    export default {
        data() {
            return {
                errGif: errGif + "?" + +new Date(),
                ewizardClap: "https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646",
                dialogVisible: false
            };
        },
        methods: {
            back() {
                history.back();
            }
        }
    };
</script>

<style lang="less" scoped>
    .errPage-container {
        width: 800px;
        max-width: 100%;
        margin: 100px auto;
        padding: 0 20px;
        box-sizing: border-box;
        .pan-back-btn {
            background: #008489;
            color: #fff;
            border: none !important;
        }
        .pan-gif {
            margin: 0 auto;
            display: block;
        }
        .pan-img {
            display: block;
            margin: 0 auto;
            width: 100%;
        }
        .text-jumbo {
            font-size: 60px;
            font-weight: 700;
            color: #484848;
        }
        h1 {
            font-size: 26px;
            margin: 20px 0;
        }
        h2 {
            font-weight: 100;
            font-size: 26px;
            margin: 20px 0;
        }
        h6 {
            font-weight: 100;
            font-size: 13px;
            margin: 20px 0;
        }

        .list-unstyled {
            font-size: 14px;
            li {
                padding-bottom: 5px;
            }
            a {
                color: #008489;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
