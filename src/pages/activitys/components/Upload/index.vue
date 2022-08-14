<!--  -->
<template>
  <el-dialog :title="title" :visible.sync="visible">
    <el-upload class="upload-demo" accept=".jpg, .png" :action="'/omp/activityMng/forUpload'" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="limit" :on-exceed="handleExceed" list-type="picture" :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">{{ upTip }}</div>
    </el-upload>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    visible: Boolean,
    title: String,
    limit: {
      type: Number,
      default: 1,
    },
    upTip: String,
  },
  data() {
    return {
      fileList: [],
    }
  },
  created() {
    this.fileList = this.value
  },
  watch: {
    visible(newVal) {
      this.$emit("update:visible", newVal)
    },
    fileList(newVal) {
      this.$emit("input", newVal)
    },
    value(newVal) {
      this.fileList = newVal
    },
  },
  methods: {
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.$emit("input", fileList)
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file)
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$emit("handleExceed")
    },
    // 删除文件之前的钩
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      if (response.result === true) {
        for (const url of response.data) {
          this.fileList.push({ name: url, url: this.$Config.aliyuncHost + url, id: url })
          this.$emit("onSuccess")
        }
        this.$msg.success("上传成功")
      } else {
        this.$msg.error(response.description)
      }
    },
  },
}
</script>
<style lang="less" scoped></style>
