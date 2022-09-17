<!--  -->
<template>
    <!-- value-key如果为id 因为有重复的产品id，会导致回显的输入框显示错误 -->
    <el-tooltip class="item" :disabled="tooltipDisabled" effect="dark" :content="tooltipContent" :open-delay="1500" placement="right">
        <el-select
            class="bc-select"
            ref="el-select"
            v-model="selectVaule"
            @change="$emit('change', $event)"
            @blur="blur"
            @focus="focus"
            value-key="name"
            @visible-change="$emit('visibleChange', $event)"
            :remote-method="remoteMethod"
            :filter-method="filterMethod"
            :disabled="disabled"
            :placeholder="placeholder"
            :filterable="filterable"
            :remote="remote"
            :clearable="clearable">
            <!-- 特殊处理，隐藏域，解决回显的数据在list列表中不存在，导致回显失败的问题 -->
            <!-- <el-option v-show="false" :key="selectVaule.id" :value="selectVaule" :label="selectVaule.name"></el-option> -->
            <!-- 数据列表 -->
            <el-option v-for="item in dataset.list" :key="item.value" :value="item.value" :label="item.name"></el-option>
            <!-- 数据分页 -->
            <!-- <el-pagination @current-change="currentChange" :hide-on-single-page="true" :pager-count="6" small layout="prev,pager,next,jumper,->,total" :page-size="pageSize" prev-text="上一页" next-text="下一页" :total="dataset.total"></el-pagination> -->
        </el-select>
    </el-tooltip>
</template>

<script>
    export default {
        props: {
            /**
             * options列表
             */
            list: {
                type: Array,
                default: () => []
            },
            // /**
            //  * options总条数 可显示分页
            //  */
            // total: {
            //   type: Number,
            //   default: 0
            // },

            // /**
            //  * 分页最大条数大小
            //  */
            // pageSize: {
            //   type: Number,
            //   default: 10
            // },

            /**
             * v-model
             */
            value: {
                type: String,
                default: ""
            },

            /**
             * placeholder
             */
            placeholder: {
                type: String,
                default: ""
            },

            /**
             * 是否禁用
             */
            disabled: {
                type: Boolean,
                default: false
            },

            /**
             * 是否可搜索
             */
            filterable: {
                type: Boolean,
                default: false
            },

            /**
             * 是否为远程搜索
             */
            remote: {
                type: Boolean,
                default: false
            },

            /**
             * 是否可以清空选项
             */
            clearable: {
                type: Boolean,
                default: false
            },

            /**
             * 数据为空时提示信息
             */
            tooltipContent: {
                type: String,
                default: "数据为空"
            }
        },
        watch: {
            selectVaule(newVal) {
                this.$emit("input", newVal);
            },
            value(newVal) {
                this.selectVaule = newVal;
            }
        },
        computed: {
            tooltipDisabled() {
                if (this.isFlag && this.tooltipContent) {
                    return this.dataset.list.length !== 0;
                } else {
                    return true;
                }
            }
        },
        data() {
            return {
                selectVaule: "",
                // 机构列表
                dataset: {
                    list: []
                    // total: 0
                },
                datatypeParam: {
                    // pageSize: 10,
                    // currentPage: 1,
                    keywords: ""
                },
                isFlag: false
            };
        },
        created() {
            this.selectVaule = this.value;
            this.dataset.list = this.list;
            // this.dataset.total = this.total;
        },
        //方法集合
        methods: {
            //  重置
            resetData() {
                // this.datatypeParam.currentPage = 1;
                this.datatypeParam.keywords = "";
            },

            // // 页码变化时调用
            // currentChange (pageNum) {
            //   this.datatypeParam.currentPage = pageNum;
            //   this.getCommmonSelectList();
            // },

            // 获取数据
            async getCommmonSelectList() {
                let query = JSON.parse(JSON.stringify(this.datatypeParam));
                let callback = (dataset = {}) => {
                    this.dataset.list = dataset.list || [];
                    // this.dataset.total = dataset.total || 0;
                };

                this.$emit("GetApiData", { query, callback });
            },

            // 关键字输入时
            remoteMethod(queryValue) {
                // 将分页重置第一页
                // this.datatypeParam.currentPage = 1;
                this.datatypeParam.keywords = queryValue;
                this.getCommmonSelectList();
            },

            // 本地检索
            filterMethod(query) {
                if (query !== "") {
                    setTimeout(() => {
                        this.selectVaule = this.dataset.list.filter((item) => {
                            return item.name.indexOf(query) > -1;
                        })[0];
                    }, 200);
                } else {
                    this.selectVaule = {};
                }
            },

            // 失去焦点情况关键字
            blur() {
                this.datatypeParam.keywords = "";
            },

            // 获取焦点调用数据
            focus() {
                this.isFlag = true;
                this.getCommmonSelectList();
            }
        }
    };
</script>
<style lang="less" scoped>
    .bc-select {
        //   display: block;
        // 自适应宽度
        width: 100%;
    }
</style>
