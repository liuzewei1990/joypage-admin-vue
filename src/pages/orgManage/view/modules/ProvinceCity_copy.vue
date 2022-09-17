<template>
    <div>
        <el-form :inline="true" :size="size">
            <div v-for="(formItem, index) in formList" :key="index">
                <el-form-item label="添加分支机构所在地：" prop="">
                    <el-select v-model="formItem.provinceValue" placeholder="请选择省份" style="width: 30%; padding-right: 20px" @change="selectValueClick($event, formItem)">
                        <el-option v-for="item in formItem._provinceList" :key="item.provinceCode" :label="item.provinceName" :value="item.provinceCode"></el-option>
                    </el-select>
                    <el-select v-model="formItem.cityValue" placeholder="请选择市" style="width: 30%; padding-right: 20px">
                        <el-option v-for="item in formItem._cityList" :key="item.cityCode" :label="item.cityName" :value="item.cityCode"></el-option>
                    </el-select>
                    <el-button :size="size" type="primary" @click="handleAddLocated()">添加</el-button>
                </el-form-item>
            </div>
        </el-form>

        <!-- <el-form :inline="true" :size="size">
        <div v-for="(formItem,index) in formList" :key="index">
            <el-form-item label="">
                <el-select v-model="formItem.provinceValue" placeholder="请选择省份" value-key="provinceName"  @change="selectValueClick($event,formItem)">
                    <el-option v-show="false" :key="formItem.provinceValue.provinceCode" :value="formItem.provinceValue" :label="formItem.provinceValue.provinceName"></el-option>
                    <el-option v-for="item in formItem._provinceList" :key="item.provinceCode" :label="item.provinceName" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formItem.cityValue" placeholder="请选择市" value-key="cityName">
                    <el-option v-show="false" :key="formItem.cityValue.cityCode" :value="formItem.cityValue" :label="formItem.cityValue.cityName"></el-option>
                    <el-option v-for="item in formItem._cityList" :key="item.cityCode" :label="item.cityName" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-button :size="size" type="primary"  @click="handleAddLocated()">添加</el-button>
        </div>
    </el-form> -->
    </div>
</template>

<script>
    import { getProvinceCityList } from "../../apis/index";
    // import BcSelect from "../../components/BcSelect"
    export default {
        // components:{BcSelect},
        props: {
            value: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                formList: [],
                size: "small",
                dataList: []
            };
        },
        watch: {
            formList: {
                handler: function (newVal, oldVal) {
                    this.$emit("input", newVal);
                }
            }
        },
        async created() {
            await this.provSelectData();
            this.init();
        },
        methods: {
            init() {
                this.formList = this.value.map((formItem) => {
                    return Object.assign(this.createFormItem(), formItem);
                });
            },
            createFormItem() {
                return {
                    _provinceList: this.dataList,
                    provinceValue: {},
                    _cityList: [],
                    cityValue: {}
                };
            },
            // 省市列表
            async provSelectData($event, formItem) {
                let resData = await this.$api.getProvinceCityList();
                console.log("省市接口", resData);
                // this.formList = resData
                this.dataList = resData.data;
            },
            // 省列表change
            selectValueClick(val, formItem) {
                formItem.cityValue = {};
                formItem._cityList = val.cityList;
                // val.cityList = val.provinceList.cityList
            },

            //----------------------------添加机构所在地----------------------------------
            //添加机构所在地新增行
            handleAddLocated() {
                this.formList.push(this.createFormItem());
            },
            //机构所在地删除选中行
            handleDeleteRate(row) {
                console.log("删除利率", row);
                var index = this.dataForm.provinceCityObj.indexOf(row);
                console.log(index);
                if (index !== -1) {
                    this.dataForm.provinceCityObj.splice(index, 1);
                }
            }
            //----------------------------添加机构所在地----------------------------------
        }
    };
</script>
