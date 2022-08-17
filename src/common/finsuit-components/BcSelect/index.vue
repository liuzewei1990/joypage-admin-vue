<!--  -->
<template>
  <component v-bind="$attrs" v-on="$listeners" ref="SelectRefComponent" :is="types[modelType]"></component>
</template>

<script>
import SelectById from "./SelectById.vue"
import SelectByObj from "./SelectByObj.vue"
export default {
  inheritAttrs: false,
  components: { SelectById, SelectByObj },
  props: {
    modelType: {
      type: String,
      default: "obj",
    },
    autoGetApiData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      types: {
        id: "SelectById",
        obj: "SelectByObj",
      },
    }
  },
  mounted() {
    this.autoGetApiData && this.$refs["SelectRefComponent"].getCommmonSelectList()
  },
}
</script>
<style lang="less" scoped></style>
