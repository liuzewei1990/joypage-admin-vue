<!--  -->
<template>
  <div>
    <el-upload class="upload-demo" ref="upload" :limit='limitNum' :auto-upload="false" accept=".xls,.xlsx" action="#" :before-upload="beforeUploadFile" :on-change="fileChange" :on-exceed="exceedFile" :on-remove="remove" :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <span class="el-upload__tip" slot="tip">只能上传xlsx/xls文件，且不超过10M</span>
    </el-upload>
    <div class="uploadBTtn">
      <el-button size="small" type="success" @click="uploadFile()" :loading="saveLoading">立即导入</el-button>
      <el-button size="small" @click="dialogUploadVisible = false">取消</el-button>
    </div>
  </div>
</template>

<script>

import { investImportFile } from "../../apis/index";
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    dialogUploadVisible (newVal) {
      this.$emit("input", newVal)
    },
    value (newVal) {
      this.dialogUploadVisible = newVal
    }
  },
  data () {
    return {
      dialogUploadVisible: false,
      limitNum: 1,
      fileList: [], //要上传的文件列表数组--多个文件
      fileObj: {},
      saveLoading: false
    };
  },
  created () {
    this.dialogUploadVisible = this.value;
  },
  mounted () {

  },
  //方法集合
  methods: {


    //导入调接口
    async uploadFile () {
      if (Object.keys(this.fileObj).length === 0) {
        this.$message.warning('请上传文件');
      } else {
        let form = new FormData();
        form.append('importFile', this.fileObj);
        //调导入接口
        this.saveLoading = true;
        try {
          let data = await investImportFile(form);
          this.$message({ message: "导入成功", type: 'success' });
          this.dialogUploadVisible = false;
          this.$refs.upload.clearFiles();  //清空文件
          this.$emit("success");
        } catch (error) { }
        this.saveLoading = false;
      }
    },

    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile (file) {
      console.log('before upload');
      console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== 'xls' || extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx/.xls的文件');
      }
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M');
      }
    },

    // 文件超出个数限制时的钩子
    exceedFile (files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件`);
    },

    // 文件状态改变时的钩子
    fileChange (file, fileList) {
      this.fileObj = file.raw
      console.log('要上传的文件', this.fileObj);
    },
    remove () {
      this.fileObj = {};
    }

  },
}
</script>
<style lang='less' scoped>
</style>