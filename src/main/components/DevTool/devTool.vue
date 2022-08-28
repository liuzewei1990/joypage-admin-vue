<!-- 调试工具 -->
<template>
  <section class="dev-tools">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>打开一个Tab</span>
          </div>
          <div>
            <el-form ref="form" :model="tabForm" label-width="80px" size="mini">
              <el-form-item label="Tab_ID">
                <el-input v-model="tabForm.id"></el-input>
              </el-form-item>
              <el-form-item label="Tab名称">
                <el-input v-model="tabForm.title"></el-input>
              </el-form-item>
              <el-form-item label="Tab链接">
                <el-input v-model="tabForm.href"></el-input>
              </el-form-item>

              <el-form-item size="large">
                <el-button type="primary" @click="openTab">添加</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>添加本地地址到----->左侧菜单中</span>
          </div>
          <div>
            <el-form ref="form" :model="menuForm" label-width="80px" size="mini">
              <el-form-item label="菜单ID">
                <el-input v-model="menuForm.id"></el-input>
              </el-form-item>
              <el-form-item label="菜单名称">
                <el-input v-model="menuForm.title"></el-input>
              </el-form-item>
              <el-form-item label="菜单链接">
                <el-input v-model="menuForm.href"></el-input>
              </el-form-item>

              <el-form-item size="large">
                <el-button type="primary" @click="openMenu">添加</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      tabForm: {
        id: Math.floor(Math.random() * 1000000),
        title: "Tab名称",
        href: "/omp/static/html/template/",
      },
      menuForm: {
        id: Math.floor(Math.random() * 1000000),
        title: "模版",
        href: "/omp/static/html/template/",
      },
    }
  },
  created() {},
  mounted() {},
  //方法集合
  methods: {
    // 添加本地菜单到缓存中
    openTab() {
      let tabObj = {
        id: this.tabForm.id,
        title: this.tabForm.title,
        href: this.tabForm.href,
        icon: "icon-text",
        spread: false,
      }
      window.parent.postMessage({ message: "addTab", data: tabObj })

      this.close()
    },

    // 添加菜单
    openMenu() {
      let menuItem = {
        id: this.tabForm.id,
        text: this.menuForm.title,
        checked: false,
        attributes: {
          icon: "el-icon-date",
          url: this.menuForm.href,
        },
        children: [],
      }
      window.parent.postMessage({ message: "addMenu", data: menuItem })

      this.close()
    },

    close() {
      this.$emit("close")
    },
  },
}
</script>
<style lang="less" scoped>
.dev-tools {
  //   margin: 10px 100px;
  //   background: #fff;
  min-height: 80vh;

  width: 80%;
  background: #fff;
  border-radius: 5px;
  margin: 5vh auto;

  .box-card {
    margin: 20px 30px;
  }
}
</style>
