<template>
    <div>
        <!-- accordion表示手风琴模式，每次只能打开一个节点 
           default-expand-all	是否默认展开所有节点
           highlight-current	是否高亮当前选中节点，默认值是 false。-->
        <el-popover ref="popover" :placement="placement" trigger="click">
            <el-tree
                :data="data"
                :props="props"
                node-key="nodeKey"
                ref="popupTree"
                accordion
                @current-change="currentChangeHandle"
                :default-expand-all="defaultExpandAll"
                :highlight-current="true"
                :expand-on-click-node="true">
            </el-tree>
        </el-popover>
        <el-input v-model="prop" v-popover:popover :readonly="true" :placeholder="placeholder" style="cursor: pointer"></el-input>
    </div>
</template>

<script>
    export default {
        name: "PopupTreeInput",
        props: {
            data: {
                type: Array,
                default: []
            },
            props: {
                type: Object,
                default: {}
            },
            prop: {
                type: String,
                default: ""
            },
            nodeKey: {
                type: String,
                default: ""
            },
            placeholder: {
                type: String,
                default: "点击选择内容"
            },
            placement: {
                type: String,
                default: "right-start"
            },
            defaultExpandAll: {
                type: Boolean,
                default: false
            },
            currentChangeHandle: {
                type: Function,
                default: null
            }
        },
        mounted() {
            console.log();
        }
    };
</script>

<style scoped></style>
