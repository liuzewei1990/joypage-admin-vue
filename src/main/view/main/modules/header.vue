<!-- 头部 -->
<template>
  <section class="header-container">
    <!-- 左侧logo -->
    <div class="block block-left" v-show="isCollapse">
      <img class="logo" width="29" src="../../../assets/images/logo.png" alt="" />
      <span class="title">比财运营管理系统</span>
    </div>

    <!-- 中间内容 -->
    <div class="block block-center"></div>

    <!-- 右侧操作按钮 -->
    <div class="block block-right">
      <div class="more-actions">
        <!-- <div class="action-item" @click="clickActionItem('bell')">
          <span class="el-icon-bell"></span>
        </div>
        <div class="action-item" @click="clickActionItem('edit')">
          <span class="el-icon-edit-outline"></span>
        </div> -->
        <div class="action-item" @click="screenfull">
          <span class="iconfont" :class="isFullscreen ? 'icon-tuichuzhuanhuan' : 'icon-quanping'"></span>
        </div>
      </div>

      <el-dropdown @command="handleCommand">
        <!-- 按钮 -->
        <span class="user-actions">
          <span class="el-icon-user-solid"></span>
          <span>{{ userInfo.NAME }}</span
          ><i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <!-- 下拉 -->
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item command="updata">修改信息</el-dropdown-item> -->
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 修改用户信息弹窗 -->
      <el-dialog title="提示" :visible.sync="userInfoDialogVisible" width="30%" :before-close="handleClose">
        <el-form label-position="left" label-width="80px" :model="userInfo">
          <el-form-item label="帐号状态">
            <el-input v-model="userInfo.ADMIN_STATUS" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="当前角色">
            <el-input v-model="userInfo.ROLE_NAME" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="登录帐号">
            <el-input v-model="userInfo.ACCOUNT" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="用户名称">
            <el-input v-model="userInfo.NAME"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确认修改</el-button>
        </span>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import screenfull from "screenfull"
import { mapState, mapActions } from "vuex"
export default {
  components: {},
  data() {
    return {
      isFullscreen: false,
      userInfoDialogVisible: false,
    }
  },
  computed: {
    ...mapState({
      isCollapse: (state) => state.finsuitStoreConfig.isCollapse,
      userInfo: (state) => state.finsuitStoreUserInfo.userInfo,
    }),
  },
  created() {},
  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on("change", this.change)
    }
  },
  //方法集合
  methods: {
    handleCommand(command) {
      switch (command) {
        case "exit":
          this.logout()
          break
        case "updata":
          this.updataUserInfo()
          break
        default:
          break
      }
    },

    // 点击功能按钮
    clickActionItem() {
      this.$message({
        message: "该功能开发中~",
        type: "error",
      })
    },

    // 全屏变化时
    change() {
      if (screenfull.isEnabled) {
        this.isFullscreen = screenfull.isFullscreen
      }
    },

    // 全屏
    screenfull() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning",
        })
        return false
      }
      screenfull.toggle()
    },

    // 退出系统
    async logout() {
      await this.$api.logout()
      this.$logout()
    },

    // 修改用户信息
    updataUserInfo() {
      this.userInfoDialogVisible = true
    },
  },
}
</script>
<style lang="less" scoped>
.header-container {
  display: flex;
  height: 100%;
  color: #606266;
  .block {
    display: flex;
    align-items: center;
  }
  .block-left {
    width: 210px;
    padding-left: 20px;
    .logo {
      margin-right: 10px;
    }
    .min-title {
      font-size: 13px;
      padding-left: 10px;
      padding-top: 4px;
    }
    .title {
      font-weight: 100;
    }
  }
  .block-center {
    flex: 1;
  }
  .block-right {
    width: 400px;
    justify-content: flex-end;
    padding: 0 20px;

    .more-actions {
      display: flex;
      margin: 2px 20px 0;
      .action-item {
        width: 50px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;
      }
    }

    .user-actions {
      cursor: pointer;
    }
  }
}
</style>
