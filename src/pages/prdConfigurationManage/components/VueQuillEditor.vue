
<template>
    <div>
      <!-- 图片上传组件辅助 -->
      <el-upload
          class="avatar-uploader"
          :action="serverUrl"
          name="img"
          :headers="header"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload">
      </el-upload>
      <el-card v-loading="uillUpdateImg">
        <quill-editor class="editor"
                v-model="detailContent"
                ref="myQuillEditor"
                :options="editorOption"
                @change="onEditorChange($event)"
                @ready="onEditorReady($event)"
        >
        </quill-editor>

        <!-- <quill-editor class="editor" 
        v-model="editor.editor_content" 
        ref="myQuillEditor" 
        :options="editorOption"
          @change="handleEditorChange">
        </quill-editor> -->
       </el-card>
    </div>   
  <!-- <div>
    <script id="editor" type="text/plain"></script>
  </div> -->
</template>
<script>
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
    ['blockquote', 'code-block'], // 引用  代码块
    [{ 'header': 1 }, { 'header': 2 }], // 1、2 级标题
    [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 有序、无序列表
    [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
    [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
    [{'direction': 'rtl'}],                         // 文本方向
    [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ 'color': [] }, { 'background': [] }], // 字体颜色、字体背景颜色
    [{ 'font': [] }], // 字体种类
    [{ 'align': [] }], // 对齐方式
    ['clean'], // 清除文本格式
    ['link', 'image', 'video'] // 链接、图片、视频
    ['link', 'image'] // 链接、图片
];
export default {
    name: 'VueQuillEditor',
    data() {
      return {
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        serverUrl: '',  // 这里写你要上传的图片服务器地址
        header: {token: sessionStorage.token},  // 有的图片服务器要求请求头需要有token之类的参数，写在这里
        detailContent: '', // 富文本内容
        editorOption: {
            placeholder: '',
            theme: 'snow',  // or 'bubble'
            modules: {
                toolbar: {
                    container: toolbarOptions, //工具栏
                    handlers: {
                        'image': function (value) {
                            if (value) {
                                // 触发input框选择图片文件
                                document.querySelector('.avatar-uploader input').click()
                            } else {
                                this.quill.format('image', false);
                            }
                        },
                        'link': function (value) { // 添加链接
                          if (value) {
                            var href = prompt('请输入url')
                            this.quill.format('link', href)
                          } else {
                            this.quill.format('link', false)
                          }
                        },
                    }
                }
            }
        },
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      const _this = this;
      this.editor = VueQuillEditor.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
        handleEditorChange () { // 编辑器中内容改变时，触发的事件。冒泡到父组件，参数为编辑器中内容
          this.$emit('editor-change', this.editor)
        },
         // 获取内容方法
        getUEContent() { // 获取内容方法
            return this.editor.getContent()
        },
        onEditorChange({editor, html, text}) {//内容改变事件
            console.log("---内容改变事件---")
            this.content = html
            console.log(html)
        },
        // 图片上传前
        beforeUpload() {
            // 显示loading动画
            this.quillUpdateImg = true
        },
        // 上传图片成功
        uploadSuccess(res, file) {
            // res为图片服务器返回的数据
            // 获取富文本组件实例
            console.log(res);
            let quill = this.$refs.myQuillEditor.quill
            // 如果上传成功
            if (res.code == 200 ) {
            // 获取光标所在位置
            let length = quill.getSelection().index;
            // 插入图片  res.url为服务器返回的图片地址
            quill.insertEmbed(length, 'image', res.url)
            // 调整光标到最后
            quill.setSelection(length + 1)
            } else {
            this.$message.error('图片插入失败')
            }
            // loading动画消失
            this.quillUpdateImg = false
        },
        // 图片上传失败
        uploadError() {
            // loading动画消失
            this.quillUpdateImg = false
            this.$message.error('图片插入失败')
        },
        submit () { // 提交，冒泡到父组件处理
          this.$refs.editor.validate(valid => {
            if (valid) {
              this.$emit('do-submit')
            } else {
              return false
            }
          })
        }
    },
    destroyed() {
      this.editor.destroy()
    }
    
}
</script>
<style lang="scss" scoped>
  .el-card {
    height: 100%;
    /deep/ .el-card__header {
      padding: 10px;
    }
    /deep/ .el-card__body {
      padding: 10px;
      overflow: auto;
      height: calc(100% - 60px);
      .el-form {
        height: 100%;
        .el-form-item {
          margin-bottom: 20px;
        }
        .form-item-title {
          height: 40px;
          line-height: 40px;
        }
        .form-item-content {
          height: calc(100% - 60px - 20px);
          .el-form-item__content {
            height: 100%;
          }
          .editor {
            height: 100%;
            line-height: normal !important;
            .ql-toolbar {
              height: 70px;
              padding: 10px;
              text-align: left;
            }
            .ql-container {
              overflow: auto;
              height: calc(100% - 70px);
            }
          }
        }
      }
      .avatar-uploader {
        height: 0;
      }
      .ql-snow .ql-tooltip[data-mode=link]::before {
        content: '请输入链接地址:';
      }
      .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
          border-right: 0px;
          content: '保存';
          padding-right: 0px;
      }

      .ql-snow .ql-tooltip[data-mode=video]::before {
          content: '请输入视频地址:';
      }

      .ql-snow .ql-picker.ql-size .ql-picker-label::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: '14px';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
        content: '10px';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
        content: '18px';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
        content: '32px';
      }

      .ql-snow .ql-picker.ql-header .ql-picker-label::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: '文本';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
        content: '标题1';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
        content: '标题2';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
        content: '标题3';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
        content: '标题4';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
        content: '标题5';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
        content: '标题6';
      }

      .ql-snow .ql-picker.ql-font .ql-picker-label::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: '标准字体';
      }
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
        content: '衬线字体';
      }
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
        content: '等宽字体';
      }
    }
  }
</style>