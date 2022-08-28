<!--  -->
<template>
  <mask-box v-model="visible" :hideOnBlur="maskConfig.hideOnBlur" :isTransparent="maskConfig.isTransparent" @on-show="onShow" @on-hide="onHide">
    <div class="container" @click.self="close"></div>
  </mask-box>
</template>

<script>
import MaskBox from "@common/finsuit-components/MaskBox/index.vue"
export default {
  components: { MaskBox },
  props: {
    appendElement: {
      type: Boolean,
      default: false,
    },
    maskConfig: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  //方法集合
  methods: {
    onShow() {
      this.$emit("onShow")
      this.$modalHelper.open(this.appendElement)
    },
    onHide() {
      this.$emit("onHide")
      this.$modalHelper.close(this.appendElement)
    },
    close() {
      if (this.maskConfig.hideOnBlur) this.visible = false
    },
  },
}
</script>
<style lang="less" scoped></style>
