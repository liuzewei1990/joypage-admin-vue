<template>
    <div class="box-example" :class="{ 'box-example-bg': !isTransparent }" v-show="visible">
        <!-- <div v-show="defaultcloseBtnVisible" class="boxClose icon-close-2">
      <span class="title">{{ title }}</span>
      <span class="btn-close el-icon-close" @click="visible = false"></span>
    </div> -->
        <div class="box-content" @click.self="close">
            <span v-if="showLoading" class="loading loading-bj-icon"></span>
            <slot v-else></slot>
        </div>
        <slot name="footer"> </slot>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            hideOnBlur: {
                type: Boolean,
                default: true
            },
            isTransparent: {
                type: Boolean,
                default: false
            },
            defaultcloseBtnVisible: {
                type: Boolean,
                default: false
            },
            showLoading: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                visible: false,
                key: true
            };
        },
        watch: {
            value(val) {
                this.visible = val;
                if (this.visible) this.$emit("on-show");
                else this.$emit("on-hide");
            },
            visible(val) {
                this.$emit("input", val);
                if (val && this.key) {
                    this.key = false;
                    this.$emit("once-visible", val);
                }
            }
        },
        created() {
            this.visible = this.value;
        },
        methods: {
            close() {
                if (this.hideOnBlur) this.visible = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    @keyframes fideIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    .box-example {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1001;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        animation: fideIn 0.2s linear;
        //   padding: 20px;
        //   box-sizing: border-box;
    }
    .box-example-bg {
        background: rgba(0, 0, 0, 0.4);
    }
    .box-content {
        margin: auto;
        flex: 1;
        position: relative;
        width: 100%;
        overflow: auto;
    }
    .boxClose {
        width: 100%;
        padding: 0 20px 0 20px;
        box-sizing: border-box;
        height: 42px;
        line-height: 42px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #333;
        overflow: hidden;
        background-color: #f8f8f8;
        border-radius: 2px 2px 0 0;

        .btn-close {
            font-weight: 600;
            float: right;
            margin-top: 10px;
            font-size: 20px;
        }
    }
    .loading {
        width: 60px;
        height: 60px;
        display: block;
        margin: 0 auto;
    }
</style>
