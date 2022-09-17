<template>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="isClose" :show-close="showClose" title="发送预览">
        <div class="dialogCon">
            <div style="justify-content: flex-start">
                <span class="name">
                    <span v-for="(item, index) in message.pushWay" :key="index">
                        <span v-if="item == 2">Push</span>
                        <span v-if="message.pushWay.length > 1">&nbsp;&nbsp;</span>
                        <span v-if="item == 3">站内信 </span>
                    </span>
                </span>
                <!-- <span class='num'>预估人数：<span>1212</span></span> -->
            </div>
            <ul>
                <li>
                    <span class="label">推送方式：</span>
                    <span class="value">
                        <span v-for="(item, index) in message.pushWay" :key="index">
                            <span v-if="item == 2">Push</span>
                            <span v-if="message.pushWay.length > 1"> &nbsp;&nbsp;</span>
                            <span v-if="item == 3">
                                站内信
                                <span v-if="message.infoType == 1">（系统消息）</span>
                                <span v-if="message.infoType == 2">（产品消息）</span>
                                <span v-if="message.infoType == 3">（活动消息）</span>
                            </span>
                        </span>
                    </span>
                </li>
                <li v-if="message.pushWay[0] == 3 || message.pushWay[1] == 3">
                    <span class="label">推送图片：</span>
                    <span class="value">
                        <img style="width: 100px; height: auto" v-if="message.imgUrl !== ''" :src="$Config.aliyuncHost + message.imgUrl" alt="" />
                    </span>
                </li>
                <li>
                    <span class="label">推送标题：</span>
                    <span class="value">{{ message.title }}</span>
                </li>
                <li>
                    <span class="label">通知描述：</span>
                    <span class="value">{{ message.summary }}</span>
                </li>
                <li>
                    <span class="label">跳转地址：</span>
                    <span class="value" v-if="message.clickType === '1'">站外url（{{ message.pushUrl }}）</span>
                    <span class="value" v-if="message.clickType === '2' && (message.PRD_TYPE_ID == '4' || message.PRD_TYPE_ID == '5' || message.PRD_TYPE_ID == '12' || message.PRD_TYPE_ID == '14')"
                        >站内（{{ message.PRD_NAME }}）</span
                    >
                    <span class="value" v-if="message.clickType === '2' && message.PRD_TYPE_ID == '16'">站内（{{ message.actityName }}）</span>
                    <span class="value" v-if="message.clickType === '2' && message.PRD_TYPE_ID == '0'">站内（纯文本）</span>
                    <div class="value" v-if="message.clickType === '20'">
                        自定义（
                        <div v-html="message.dynamicDetails"></div>
                        ）
                    </div>
                </li>
                <li>
                    <span class="label">推送时间：</span>
                    <span class="value" v-if="message.autoSend === 'off'">立即</span>
                    <span class="value" v-else>定时：{{ message.pushTime }}</span>
                </li>
                <li>
                    <span class="label">目标渠道：</span>
                    <span class="value" v-if="message.appFlag === 'ALL'">全部</span>
                    <span class="value" v-if="message.appFlag === 'PC'">拼财</span>
                    <span class="value" v-if="message.appFlag === 'BC'">比财</span>
                </li>
                <li>
                    <span class="label">目标平台：</span>
                    <span class="value" v-if="message.systemType === '0'">全部</span>
                    <span class="value" v-if="message.systemType === '1'">android</span>
                    <span class="value" v-if="message.systemType === '2'">ios</span>
                </li>
                <li>
                    <span class="label">目标人群：</span>
                    <span class="value" v-if="message.pushType === '1'">所有人</span>
                    <span class="value" v-if="message.pushType === '3'">导入用户</span>
                </li>
                <li v-if="status == 'his'">
                    <span class="label">发送状态：</span>
                    <span class="value" v-if="message.status === '1'">待发送</span>
                    <span class="value" v-if="message.status === '2'">已发送</span>
                    <span class="value" v-if="message.status === '3'">发送异常</span>
                    <span class="value" v-if="message.status === '4'">已撤销</span>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="cancelTxt !== ''" :size="size" @click="cancel">{{ cancelTxt }}</el-button>
                <el-button v-if="sureTxt !== ''" :size="size" :loading="saveLoading" type="primary" @click="sure">{{ sureTxt }}</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                dialogVisible: true,
                isClose: false,
                showClose: false,
                size: "small",
                saveLoading: false
            };
        },
        props: ["title", "cancelTxt", "sureTxt", "message", "dialogFormVisible", "status"],
        mounted() {
            console.log(this.message);
        },
        watch: {
            dialogFormVisible(newVal, oldVal) {
                console.log(newVal);
                if (!newVal) {
                    this.message = Object;
                } else {
                    console.log(this.message);
                }
            }
        },
        methods: {
            sure() {
                this.$emit("sure");
            },
            cancel() {
                this.$emit("cancel");
            }
        }
    };
</script>
<style lang="less" scoped>
    .dialogCon {
        border: 1px solid #ccc;
        > div {
            padding: 20px;
            border-bottom: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            .name {
                width: 10em;
                text-align: left;
            }
            .num {
                flex: 1;
                text-align: right;
                span {
                    color: blue;
                }
            }
        }
        ul {
            padding: 20px;
            li {
                display: flex;
                margin-bottom: 20px;
                .label {
                    width: 5em;
                    text-align: left;
                }
                .value {
                    flex: 1;
                    text-align: left;
                }
            }
        }
    }
</style>
