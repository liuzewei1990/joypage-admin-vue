<template>
    <div class="wap">
        <div ref="toolbar" class="toolbar"></div>
        <span v-if="show" class="pla">请输入</span>
        <div ref="text" class="text"></div>
    </div>
</template>
<script>
    // import E from "wangeditor";
    export default {
        model: {
            prop: "inData",
            event: "returnBack"
        },
        computed: {
            inData: {
                set: function (t) {
                    let k = t;
                    if (this.checkVal(t)) {
                        k = "";
                        this.show = true;
                    } else {
                        this.show = false;
                    }
                    this.$emit("returnBack", k);
                },
                get: function (t) {
                    return t.$attrs.inData;
                }
            }
        },
        data() {
            return {
                editor: null,
                show: true
            };
        },
        mounted() {
            // 文档：https://www.kancloud.cn/wangfupeng/wangeditor3/332599
            this.editor = new E(this.$refs.toolbar, this.$refs.text);
            // this.editor.customConfig.uploadImgShowBase64 = true;  // 转成base64
            this.editor.customConfig.uploadImgServer = "http://app-test4.bicai365.com/omp/finsuitFileUpload/forUpload";
            this.editor.customConfig.uploadImgTimeout = 3000; // 上传超时

            this.editor.customConfig.onchangeTimeout = 200;
            this.editor.customConfig.onchange = (html) => {
                this.inData = html;
            };

            // 上传图片到服务器
            this.editor.customConfig.uploadImgHooks = {
                customInsert: function (insertImg, result) {
                    var url = "http://app-test4.bicai365.com/omp/finsuitImgDisplay/show?path=" + result.data[0];
                    insertImg(url);
                }
            };
            this.editor.create();
            if (this.inData !== "") {
                this.editor.txt.html("" + this.inData);
                this.show = false;
            }
        },
        methods: {
            checkVal(str) {
                let num = 0,
                    reg = /<p>(&nbsp;|&nbsp;\s+)+<\/p>|<p>(<br>)+<\/p>/g;
                while (num < str.length && str != "") {
                    num++;
                    let k = str.match(reg);
                    if (k) {
                        str = str.replace(k[0], "");
                    }
                }
                return str == "";
            }
        }
    };
</script>

<style>
    .wap {
        padding: 0;
        position: relative;
        min-width: 420px;
    }
    .toolbar {
        width: 50px;
        display: flex!;
        flex-wrap: wrap;
        border: 1px solid rgb(199, 196, 196);
        width: 100%;
    }
    .toolbar > div {
        padding: 0 3px !important;
    }
    .text {
        width: 100%;
        box-sizing: border-box !important;
        border: 1px solid rgb(199, 196, 196);
        min-height: 205px;
    }
    .w-e-text {
        overflow-y: hidden !important;
    }
    .pla {
        position: absolute;
        left: 15px;
        top: 40px;
        color: rgb(167, 164, 164);
    }
    .w-e-droplist {
        background: rgb(158, 190, 177) !important;
    }
</style>
