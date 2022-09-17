<template>
    <div>
        <el-form :inline="true" :size="size">
            <div v-for="(formItem, index) in formList" :key="index">
                <el-form-item label="">
                    <!-- value-key,作为 value 唯一标识的键名，绑定值为对象类型时必填,
                如果为provinceCode 因为如果有重复的产品provinceCode，会导致回显的输入框显示错误, -->
                    <el-select v-model="formItem.provinceValue" placeholder="请选择省份" value-key="provinceName" @change="selectValueClick($event, formItem)" filterable>
                        <!-- 特殊处理，隐藏域，解决回显的数据在list列表中不存在，导致回显失败的问题 -->
                        <el-option v-show="false" :key="formItem.provinceValue.provinceCode" :value="formItem.provinceValue" :label="formItem.provinceValue.provinceName"></el-option>
                        <el-option v-for="item in formItem._provinceList" :key="item.provinceCode" :label="item.provinceName" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="formItem.cityValue" placeholder="请选择市" value-key="cityName" multiple clearable @change="selectCityClick($event, formItem)">
                        <!-- 特殊处理，隐藏域，解决回显的数据在list列表中不存在，导致回显失败的问题 -->
                        <!-- <el-option v-show="false" :key="formItem.cityValue.cityCode" :value="formItem.cityValue" :label="formItem.cityValue.cityName"></el-option> -->
                        <el-option v-for="item in formItem.cityList" :key="item.cityCode" :label="item.cityName" :value="item" v-show="false"></el-option>
                        <el-option v-for="item in formItem._cityList" :key="item.cityCode" :label="item.cityName" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="orgLocation != '1'" style="display: inline-block">
                    <el-button :size="size" @click="handleDeleteRate(formItem)" v-if="formList.length > 1">删除</el-button>
                    <el-button :size="size" @click="handleAddLocated()" v-if="formList.length === index + 1">添加</el-button>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
    import { getProvinceCity } from "../../apis/index";
    // import BcSelect from "../../components/BcSelect"
    export default {
        // components:{BcSelect},
        props: {
            value: {
                type: Array,
                default: () => []
            },
            orgLocation: {
                type: String
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
                // console.log('value',this.value)
                this.formList = this.value.map((formItem) => {
                    console.log("初始formItem", formItem);
                    return Object.assign(this.createFormItem(formItem.provinceValue.provinceCode), formItem);
                });
                console.log("初始formList", this.formList);
            },
            createFormItem(provinceCode) {
                //初始值
                //    console.log('dataList',this.dataList)
                return {
                    _provinceList: this.dataList,
                    provinceValue: {},
                    _cityList: this.createCityList(provinceCode),
                    cityValue: [] //多选时是数组，单选时是对象
                };
            },
            //获取市列表
            createCityList(provinceCode) {
                console.log(provinceCode);
                //找到当前列表的对应的省 与 选中的省的code相等时，将对应的市列表找出返回，并处理provinceCode为空的情况
                return (this.dataList.find((item) => item.provinceCode == provinceCode) || {}).cityList || [];

                // let cityList = []
                // if(provinceCode){
                //     this.dataList.map((item)=>{
                //         if(item.provinceCode == provinceCode){
                //             cityList = item.cityList
                //         }
                //     })
                // }
                // return cityList
                // console.log('cityList',cityList)
            },
            // 请求省市列表接口
            async provSelectData($event, formItem) {
                let resData = await this.$api.getProvinceCity(); //调省市接口
                console.log("省市接口", resData);
                this.dataList = resData.data;
            },
            // 点击省列表change
            selectValueClick(val, formItem) {
                console.log("省val", val);
                console.log("省formItem", formItem);
                // formItem.cityValue = [] //市默认空
                // formItem.cityValue = val.cityList //默认全选
                formItem.cityValue = [{ cityCode: "0", cityName: "全部" }]; //市默认全部
                formItem._cityList = val.cityList;
            },
            //点击市列表的事件
            selectCityClick(val, formItem) {
                // console.log('city-val',val)
                // console.log('city-formItem',formItem)
                if (val && val.length != 0) {
                    if (val[val.length - 1].cityCode == "0") {
                        //判断最后一项获取的是否是‘全部’，是全部则晴空之前的选项，只添加全部这一项
                        val = [{ cityCode: "0", cityName: "全部" }];
                    } else {
                        //最后一项不等于0，则不是全部，那么将val数组中的全部去掉
                        val.find((item, index) => {
                            if (item.cityCode == "0") {
                                val.splice(index, 1);
                            }
                            return val;
                        });
                    }
                } else {
                    val.push({ cityCode: "0", cityName: "全部" });
                }
                formItem.cityValue = val;
                console.log("新cityValue", val);
            },
            //添加机构所在地新增行
            handleAddLocated() {
                this.formList.push(this.createFormItem());
            },
            //机构所在地删除选中行
            handleDeleteRate(row) {
                console.log("删除", row);
                var index = this.formList.indexOf(row);
                console.log(index);
                if (index !== -1) {
                    this.formList.splice(index, 1);
                }
            }
        }
    };
</script>
