<!--  -->
<template>
  <section class="slide-menu-container">
    <!-- ----------------------左侧一级菜单-------------------------- -->
    <div class="main-slide">
      <div class="top">
        <img width="29" src="../../../assets/images/logo.png" alt="" />
        <!-- <span>比财</span> -->
      </div>
      <div class="main-menu">
        <ul class="main-menu-group">
          <li :class="{ active: index === menuListCode }" v-for="(item, index) in menuList" :key="index" @click="clickOneMenu(index)" @mouseover="mouseoverSetIndexThrottle(index)" @mouseenter="mouseoverEnter" @mouseleave="mouseoutLeave">
            <span class="link-icon" :class="item.attributes.icon || 'el-icon-menu'"></span>
            <!-- <span class="link-icon el-icon-menu"></span> -->
            <span class="link-text">{{ item.text.slice(0, 2) }}</span>
            <!-- <span class="right-icon el-icon-arrow-right" v-show="item.children.length > 0"></span> -->
          </li>
          <li class="no-menu-list" v-show="menuList.length === 1">
            <span>无数据</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- --------------------------右侧二级折叠菜单------------------------------ -->
    <div class="sub-slide" v-show="menuList[menuListCode].children.length > 0">
      <!-- 标题 -->
      <div class="sub-slide-title">
        <p>{{ menuList[menuListCode].text.slice(0, 4) }}</p>
      </div>

      <!-- element-ui 菜单组件 -->
      <div class="sub-slide-main">
        <el-menu :default-active="activeIndex2" :default-openeds="defaultOpeneds" class="finsuit-el-menu" @select="handleMenuSelect" background-color="#fff" text-color="#323233">
          <!-- 没有子级菜单 -->
          <el-menu-item class="ellipsis m-menu-item" :index="item.id" v-for="item in menuList[menuListCode].children" :key="item.id" v-show="!(item.children && item.children.length > 0)">
            <el-tooltip class="item" effect="dark" :content="item.text" :disabled="item.text.length <= 7" placement="right-start">
              <span>{{ item.text }}</span>
            </el-tooltip>
          </el-menu-item>

          <!-- 有自己菜单 -->
          <el-submenu class="el-submenu-item" :index="item.id" v-for="item in menuList[menuListCode].children" :key="item.id" v-show="item.children && item.children.length > 0">
            <template slot="title">
              <span style="color: #999">{{ item.text }}</span>
            </template>
            <el-menu-item class="ellipsis" v-for="subItem in item.children" :key="subItem.id" :index="subItem.id">
              <el-tooltip class="item" effect="dark" :content="subItem.text" :disabled="subItem.text.length <= 7" placement="right-start">
                <span>{{ subItem.text }}</span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <!-- 底部更多箭头 -->
      <div class="sub-slide-footer">
        <span class="icon el-icon-arrow-down"></span>
      </div>
    </div>

    <!-- -------------------------------右侧二级折叠菜单 hover显示效果---------------------------------- -->
    <div class="sub-slide sub-slide-copy" v-show="mouseoverOneMenuShow && menuList[mouseoverOneMenuIndex].children.length > 0" @mouseenter="mouseoverEnter2" @mouseleave="mouseoutLeave2">
      <!-- 标题 -->
      <div class="sub-slide-title">
        <p>{{ menuList[mouseoverOneMenuIndex].text.slice(0, 4) }}</p>
      </div>

      <!-- element-ui 菜单组件 -->
      <div class="sub-slide-main">
        <el-menu :default-active="activeIndex2" :default-openeds="defaultOpeneds2" class="finsuit-el-menu" @select="handleMenuSelectHover" background-color="#fff" text-color="#323233">
          <!-- 没有子级菜单 -->
          <el-menu-item class="ellipsis m-menu-item" :index="item.id" v-for="item in menuList[mouseoverOneMenuIndex].children" :key="item.id" v-show="!(item.children && item.children.length > 0)">
            <el-tooltip class="item" effect="dark" :content="item.text" :disabled="item.text.length <= 7" placement="right-start">
              <span>{{ item.text }}</span>
            </el-tooltip>
          </el-menu-item>

          <!-- 有自己菜单 -->
          <el-submenu class="el-submenu-item" :index="item.id" v-for="item in menuList[mouseoverOneMenuIndex].children" :key="item.id" v-show="item.children && item.children.length > 0">
            <template slot="title">
              <span style="color: #999">{{ item.text }}</span>
            </template>
            <el-menu-item class="ellipsis" v-for="subItem in item.children" :key="subItem.id" :index="subItem.id">
              <el-tooltip class="item" effect="dark" :content="subItem.text" :disabled="subItem.text.length <= 7" placement="right-start">
                <span>{{ subItem.text }}</span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <!-- 底部更多箭头 -->
      <div class="sub-slide-footer">
        <span class="icon el-icon-arrow-down"></span>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
export default {
  components: {},
  computed: {
    ...mapGetters(["menuCollapseStatus"]),
    ...mapState({
      isCollapse: (state) => state.finsuitStoreConfig.isCollapse,
      activeIndex2: (state) => state.finsuitStoreMenuTabs.activeIndex2,
      menuListCode: (state) => state.finsuitStoreMenuList.menuListCode,
      defaultActive: (state) => state.finsuitStoreMenuList.defaultActive,
      menuList: (state) => state.finsuitStoreMenuList.menuList,
    }),
    // 子菜单默认展开的数组
    defaultOpeneds2() {
      return this.menuList[this.mouseoverOneMenuIndex].children.map((item, index) => {
        return item.id
      })
    },
    // 子菜单默认展开的数组
    defaultOpeneds() {
      return this.menuList[this.menuListCode].children.map((item, index) => {
        return item.id
      })
    },
  },
  data() {
    return {
      mouseoverOneMenuIndex: 0,
      mouseoverOneMenuShow: false,
      // 索引设置开关，解决太灵敏问题
      flag: false,
      // hover事件节流函数
      mouseoverSetIndexThrottle: () => {},
    }
  },

  created() {},
  mounted() {
    this.mouseoverSetIndexThrottle = this.throttle(this.mouseoverSetIndex, 50, { begin: false, end: true })
  },
  //方法集合
  methods: {
    ...mapActions(["addTab", "removeTab", "removeAllTab", "removeOutTab", "switchTab"]),

    // 点击菜单 -> 打开新的tab content
    handleMenuSelect(key, keyPath) {
      try {
        let oneIndex = keyPath[0]
        let twoIndex = keyPath[1]

        let target = this.menuList[this.menuListCode]
        oneIndex && (target = target.children.find((item) => item.id === oneIndex))
        twoIndex && (target = target.children.find((item) => item.id === twoIndex))

        this.openTab(target, this.menuListCode)
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        })
      }
    },

    // hover效果点击
    handleMenuSelectHover(key, keyPath) {
      try {
        let oneIndex = keyPath[0]
        let twoIndex = keyPath[1]

        let target = this.menuList[this.mouseoverOneMenuIndex]
        oneIndex && (target = target.children.find((item) => item.id === oneIndex))
        twoIndex && (target = target.children.find((item) => item.id === twoIndex))

        this.openTab(target, this.mouseoverOneMenuIndex)
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        })
      }

      // 一级菜单跟随
      //   this.$store.commit("SET_MENU_CODE", this.mouseoverOneMenuIndex);
    },

    // 点击左侧组
    clickOneMenu(index) {
      const clickMenuItem = this.menuList[index]
      clickMenuItem.attributes = clickMenuItem.attributes || {}

      //   this.$store.commit("IS_COLLAPSE", !clickMenuItem.attributes.url);
      if (!clickMenuItem.attributes.url && clickMenuItem.children.length === 0) {
        this.$message({
          type: "error",
          message: `请检查菜单属性是否有效`,
        })
        return
      }

      if (clickMenuItem.attributes.url) {
        this.openTab(clickMenuItem, index)
        // if (clickMenuItem.children.length === 0) {
        // } else {
        //   this.$message({
        //     type: "error",
        //     message: `无法打开${clickMenuItem.attributes.url}，原因是当前菜单存在子节点菜单`
        //   })
        // }
      }

      this.$store.commit("SET_MENU_CODE", index)
    },

    // hover预览设置index
    mouseoverSetIndex(index) {
      setTimeout(() => {
        if (this.flag) return
        this.mouseoverOneMenuIndex = index
      }, 200)
    },

    // 鼠标预览打开
    mouseoverEnter(index) {
      this.mouseoverOneMenuShow = true
    },

    // 鼠标预览关闭
    mouseoutLeave(e) {
      this.mouseoverOneMenuShow = false
    },

    mouseoverEnter2() {
      this.mouseoverEnter()
      this.flag = true
    },
    mouseoutLeave2() {
      this.mouseoutLeave()
      this.flag = false
    },

    // 打开新的tab
    openTab(target = { attributes: {} }, pid) {
      let tabObj = {
        pid: pid,
        id: target.id,
        href: target.attributes.url,
        icon: target.attributes.icon,
        title: target.text,
      }

      this.addTab(tabObj)
    },

    throttle(func, wait, options = {}) {
      let timeout,
        previous = 0

      return function () {
        let now = +new Date()
        let remain = wait - (now - previous)

        if (remain < 0) {
          if (previous === 0 && !options.begin) {
            previous = now
            return
          }

          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }

          previous = now
          func.apply(this, arguments)
        } else if (!timeout && options.end) {
          timeout = setTimeout(() => {
            func.apply(this, arguments)
            timeout = null
          }, wait)
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
@left: 20px;
@slide-w-off: 75px;

/deep/ .finsuit-el-menu {
  border-right: none;
}
/deep/ .finsuit-el-menu .el-submenu__title {
  height: 40px;
  line-height: 40px;
  padding-left: @left !important;
}

/deep/ .finsuit-el-menu .el-menu-item {
  height: 40px;
  line-height: 40px;
  padding: 0 25px;
  padding-left: @left !important;
  min-width: auto;
  font-size: 13px;
}

/deep/ .finsuit-el-menu .el-submenu__icon-arrow {
  margin-top: -4px;
  left: 5px;
  right: auto;
}

.slide-menu-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
}
.is-collapse {
  width: 88px;
  overflow: hidden;
}

.main-slide {
  width: @slide-w-off;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  .top {
    height: 50px;
    line-height: 50px;
    text-align: center;
    overflow: hidden;
    img {
      vertical-align: middle;
      border-style: none;
    }
    span {
      color: #c9d7ec;
      font-size: 14px;
    }
  }
  .main-menu {
    overflow: hidden;
    ul {
      position: relative;
      margin-bottom: 0;
      width: 145px;
      height: calc(100vh - 46px - 10px);
      overflow-y: scroll;
      padding-left: 0;
    }
    li {
      padding-right: 125px - @slide-w-off;
      height: 40px;
      color: #c9d7ec;
      font-size: 14px;
      line-height: 40px;
      overflow: hidden;
      text-indent: 6px;
      cursor: pointer;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    li .link-icon {
      margin-right: 5px;
    }
    li:hover {
      background-color: #1d324f;
      color: #fff;
    }
    .active {
      background-color: #1d324f;
      color: #fff;
    }
    .right-icon {
      font-size: 10px;
      position: relative;
      left: -5px;
    }
    .no-menu-list {
      text-align: center;
      text-indent: 0px;
      font-size: 13px;
      height: calc(100% - 46px - 40px);
      background: #1d324f;
      span {
        display: inline-block;
        width: 0px;
        margin: 0 auto;
        line-height: 18px;
        position: relative;
        left: -10px;
      }
      &::before {
        content: " ";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }
    }
  }
}

.sub-slide {
  position: absolute;
  left: @slide-w-off;
  top: 0;
  height: 100%;
  width: 106px;
  overflow: hidden;
  border-right: 1px solid #e5e5e5;
  background: #fff;

  .sub-slide-title {
    line-height: 40px;
    color: #409eff;
    padding-left: @left;
    font-weight: 100;
    font-size: 15px;
    border-bottom: 1px solid #eee;
  }

  .sub-slide-main {
    position: absolute;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 153px;
    height: calc(100% - 80px);
  }

  .sub-slide-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    width: 100%;
    text-align: center;
    .icon {
      font-size: 25px;
      color: #bbb;
    }
  }

  .el-submenu-item {
    margin-bottom: 8px;
  }
}
.sub-slide-copy {
  //   background: yellowgreen;
}
</style>
