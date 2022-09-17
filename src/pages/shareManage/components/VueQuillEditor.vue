<template>
    <div>
        <!-- 图片上传组件辅助 -->
        <el-card v-loading="quillUpdateImg" style="height: 450px">
            <el-upload :id="id" class="avatar-uploader" action="#" name="img" :headers="header" :show-file-list="false" :http-request="quillEditorUploaderImg"></el-upload>
            <quill-editor class="editor" style="height: 400px" ref="myQuillEditor" v-model="content" :id="`${id}`" :options="editorOption" @change="onEditorChange($event)">
                <!-- ref公用一个就可以，不同的富文本，需要父组件传不通的id即可 -->
            </quill-editor>
        </el-card>
    </div>
</template>
<script>
    import { forUpload } from "../apis/index";
    import config from "../config/config.index.js";
    import { quillEditor, Quill } from "vue-quill-editor";
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";
    import "../assets/css/font.css";
    //富文本工具
    const toolbarOptions = [
        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
        ["blockquote", "code-block"], // 引用  代码块
        [{ header: 1 }, { header: 2 }], // 1、2 级标题
        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
        [{ script: "sub" }, { script: "super" }], // 上标/下标
        [{ indent: "-1" }, { indent: "+1" }], // 缩进
        // [{'direction': 'rtl'}],                         // 文本方向
        [
            {
                size: ["10px", false, "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "32px"]
            }
        ], // 字体大小
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
        [
            {
                font: ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong", "Arial", "Times-New-Roman", "sans-serif", "宋体", "黑体"]
            }
        ], // 字体种类
        [{ align: [] }], // 对齐方式
        ["clean"], // 清除文本格式
        // ['link', 'image', 'video'] // 链接、图片、视频
        ["link", "image"] // 链接、图片
    ];
    // 自定义字体大小
    let Size = Quill.import("attributors/style/size");
    Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"];
    Quill.register(Size, true);

    // 自定义字体类型
    var fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong", "Arial", "Times-New-Roman", "sans-serif", "宋体", "黑体"];
    var Font = Quill.import("formats/font");
    Font.whitelist = fonts;
    Quill.register(Font, true);
    export default {
        name: "VueQuillEditor",
        components: {
            quillEditor
        },
        props: {
            id: "",
            detailContent: {
                type: String
            }
        },
        data() {
            let _this = this;
            return {
                imageUrl: "", //图片前面有域名的部分地址
                quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
                serverUrl: config.baseUrlHost + "/finsuitFileUpload/forUpload", // 这里写你要上传的图片服务器地址
                header: { token: sessionStorage.token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
                content: this.detailContent, // 富文本内容
                editorOption: {
                    placeholder: "请输入内容...",
                    theme: "snow", // or 'bubble'
                    modules: {
                        toolbar: {
                            id: "#" + _this.id,
                            container: toolbarOptions, //工具栏
                            handlers: {
                                image: function (...value) {
                                    if (value) {
                                        console.log("#" + _this.id + " " + "input");
                                        // 根据父组件不通的id,触发对应的input框选择图片文件
                                        document.querySelector("#" + _this.id + " " + "input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                },
                                link: function (value) {
                                    // 添加链接
                                    if (value) {
                                        let href = prompt("请输入url");
                                        this.quill.format("link", href);
                                        this.content = href;
                                        console.log("link-->", this.content);
                                    } else {
                                        this.quill.format("link", false);
                                    }
                                }
                            }
                        }
                    }
                }
            };
        },

        mounted() {
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("子组件", this.imageUrl);
            // console.log("子组件", this.id);

            // this.myQuillEditor = this.$refs.myQuillEditor
            // console.log("子组件", this.myQuillEditor);
        },
        methods: {
            // 编辑器中内容改变时，触发的事件。冒泡到父组件，参数为编辑器中内容
            onEditorChange({ editor, html, text }) {
                //内容改变事件
                this.content = html;
                this.$emit("onEditorChange", this.content, this.id);
            },

            // 富文本上传图片调接口
            quillEditorUploaderImg(content) {
                console.log("quillEditorUploaderImgSon", content, this.id);
                // this.$emit('quillEditorUploaderImgSon', content,this.id,this.myQuillEditor)//要是在父组件调接口，需要将ref的值传过去
                this.quillUpdateImg = true;
                // 获取富文本组件实例
                const _file = content.file;
                let formData = new FormData();
                formData.append("name", _file);
                forUpload(formData)
                    .then((res) => {
                        console.log("子组件富文本上传图片返回值-->", res);
                        if (res.result) {
                            //获取富文本组件实例
                            let quill = this.$refs.myQuillEditor.quill; //产品描述
                            // 获取光标所在位置
                            let length = quill.getSelection().index;
                            // 插入图片  res.url为服务器返回的图片地址
                            quill.insertEmbed(length, "image", this.imageUrl + res.data[0]); //this.imageUrl为图片地址前缀域名，res.data[0]为服务器返回的图片的url
                            // 调整光标到最后
                            quill.setSelection(length + 1);
                        } else {
                            this.$message.error(res.description);
                        }
                        // loading动画消失
                        this.quillUpdateImg = false;
                    })
                    .catch((err) => {
                        // loading动画消失
                        this.quillUpdateImg = false;
                        console.log("err", err);
                    });
            }
        },
        destroyed() {
            // this.editor.destroy()
        }
    };
</script>
<style lang="less" scoped>
    //富文本
    .el-card {
        height: 100%;
        /deep/ .el-card__header {
            padding: 10px;
        }
        /deep/ .el-card__body {
            // padding: 10px;
            // overflow: auto;
            // height: calc(100% - 20px);
            /deep/ .quill-editor {
                height: 80%;
                line-height: normal !important;
                /deep/ .ql-toolbar.ql-snow {
                    height: auto;
                    padding: 10px;
                    text-align: left;
                }

                /deep/ .ql-container {
                    overflow: auto;
                    height: 85%;
                }
                .ql-container.ql-snow {
                    height: 85%;
                }
                /deep/ .ql-toolbar.ql-snow .ql-picker-label {
                    border: 1px solid #ccc !important;
                }
                /deep/ .ql-snow .ql-picker-label::before {
                    display: inline-block;
                    line-height: 22px;
                    position: absolute;
                    top: 0;
                }
            }

            .avatar-uploader {
                height: 0;
            }
            .ql-snow .ql-tooltip[data-mode="link"]::before {
                content: "请输入链接地址:";
            }
            .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
                border-right: 0px;
                content: "保存";
                padding-right: 0px;
            }

            .ql-snow .ql-tooltip[data-mode="video"]::before {
                content: "请输入视频地址:";
            }
        }
    }
</style>
