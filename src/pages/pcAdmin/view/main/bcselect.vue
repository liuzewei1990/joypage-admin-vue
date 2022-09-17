<!--  -->
<template>
    <section class="">
        <el-row>
            同步demo：
            <br />
            v-modle的值：{{ val1 }}
            <br />
            <BcSelect v-model="val1" :isAutoWidth="false" itemNameKey="label" itemValueKey="id" :list="list"></BcSelect>
            <el-button @click="val1 = { label: '香蕉', id: '2' }">回显已知数据</el-button>
            <el-button @click="val1 = { label: '大象', id: '8' }">回显未知数据</el-button>
        </el-row>
        <el-row>
            异步demo单选：
            <br />
            v-modle的值：{{ val2 }}
            <br />
            <BcSelect v-model="val2" :isAutoWidth="true" itemNameKey="name" itemValueKey="value" @GetApiData="getOrgSelectData($event)" :filterable="openRemote" :remote="openRemote"></BcSelect>
            <el-button @click="val2 = { name: '步步为赢', value: '2000001599 ' }">回显已知数据</el-button>
            <el-button @click="val2 = { name: '大象', value: '8' }">回显未知数据</el-button>
            <el-button @click="openRemote = !openRemote">{{ openRemote ? "关闭" : "开启" }}模糊查询</el-button>
        </el-row>
        <el-row>
            异步demo多选：
            <br />
            v-modle的值：{{ val3 }}
            <br />
            <BcSelect
                v-model="val3"
                :isAutoWidth="true"
                itemNameKey="name"
                itemValueKey="value"
                @GetApiData="getOrgSelectData($event)"
                multiple
                :filterable="openRemote"
                :remote="openRemote"></BcSelect>
            <el-button @click="val3 = [{ name: '步步为赢', value: '2000001599 ' }]">回显已知数据</el-button>
            <el-button
                @click="
                    val3 = [
                        { name: '大象', value: '8' },
                        { name: '吃', value: '9' },
                        { name: '蚂蚁', value: '10' }
                    ]
                "
                >回显未知数据</el-button
            >
            <el-button @click="openRemote = !openRemote">{{ openRemote ? "关闭" : "开启" }}模糊查询</el-button>
        </el-row>
    </section>
</template>

<script>
    import BcSelect from "@common/finsuit-components/BcSelect";
    export default {
        components: { BcSelect },
        data() {
            return {
                val1: {},
                val2: {},
                val3: [],
                list: [
                    {
                        label: "苹果",
                        id: "1"
                    },
                    {
                        label: "香蕉",
                        id: "2"
                    },
                    {
                        label: "橘子",
                        id: "3"
                    },
                    {
                        label: "梨",
                        id: "4"
                    }
                ],
                openRemote: false
            };
        },
        created() {},
        mounted() {},
        //方法集合
        methods: {
            // 当获取焦点时获取转跳内容类型
            async getOrgSelectData($event) {
                let { query, callback } = $event;

                let params = {
                    pageNum: query.currentPage,
                    pageSize: 10,
                    contentTypeId: 3,
                    name: query.keywords //后端仅支持产品模糊查询，机构和资讯都没有
                };

                let data = await this.$api.getContentByContentType(params).then((res) => res.data || {});

                callback({ list: data.data, total: data.totalCount });
            }
        }
    };
</script>
<style lang="less" scoped></style>
