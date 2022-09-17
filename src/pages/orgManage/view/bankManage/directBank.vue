<template>
    <!-- 直销银行管理 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <!-- <ProvinceCity v-model="dataForm.orgBranchList"></ProvinceCity> -->
                <!-- {{dataForm.orgBranchList}} -->
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="直销银行名称：" prop="id">
                        <el-select v-model="topCheckData.id" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in allSelectData.directBankNameList" :key="item.id" :label="item.orgName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="签约状态：" prop="isContract">
                        <el-select v-model="topCheckData.isContract" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.isContractList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="银行所属地区：" prop="provinceAdcode">
                        <el-select v-model="topCheckData.provinceAdcode" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.selProvinceList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="机构类型：" prop="orgType">
                        <el-cascader
                            v-model="orgType"
                            :options="allSelectData.orgTypeList"
                            :props="{ checkStrictly: true }"
                            :show-all-levels="true"
                            clearable
                            @change="orgTypeListSelect"></el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作按钮区 -->
            <div slot="action">
                <el-button class="addBtn" style="float: left" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增机构</el-button>
                <!-- <el-button class="addBtn" style="float:left;" :size="size" icon="el-icon-plus" type="primary"  @click="handleAdd('1')">新增直销银行</el-button>
			<el-button class="addBtn" style="float:left;" :size="size" icon="el-icon-plus" type="primary"  @click="handleAdd('2')">新增非银机构</el-button> -->
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm('topData')">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="getdirectBankList('chaxun')">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="directBankList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <el-table-column type="index" label="序号" width="60" header-align="center" align="center"></el-table-column>
                <el-table-column prop="id" label="银行ID" width="100" header-align="center" align="center"></el-table-column>
                <el-table-column prop="commercialBankName" label="银行名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="直销银行名称" header-align="center" align="center"></el-table-column>
                <el-table-column prop="generalBankNo" label="总行号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="levelOneOrgTypeName" label="一级机构类型" header-align="center" align="center"></el-table-column>
                <el-table-column prop="levelTwoOrgTypeName" label="二级机构类型" header-align="center" align="center"></el-table-column>

                <!-- 之前的一级机构和二级机构类型的字段 -->
                <!-- <el-table-column prop="oneLevelOrgType" label="机构类型" header-align="center" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.oneLevelOrgType==1" :size="size">银行机构</p>
					<p v-if="scope.row.oneLevelOrgType==2" :size="size">非银机构</p>
				</template>
			</el-table-column>
			<el-table-column prop="secondLevelOrgType" label="二级机构类型" header-align="center" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.oneLevelOrgType == 1">
						<p v-if="scope.row.secondLevelOrgType==1" :size="size">全国性银行</p>
						<p v-if="scope.row.secondLevelOrgType==2" :size="size">地方性法人银行</p>
					</div>
					<div v-else>
						<p v-if="scope.row.secondLevelOrgType==1" :size="size">基金</p>
						<p v-if="scope.row.secondLevelOrgType==2" :size="size">券商</p>
						<p v-if="scope.row.secondLevelOrgType==3" :size="size">保险</p>
					</div>
				</template>
			</el-table-column> -->

                <el-table-column prop="isContract" label="签约状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.isContract == 1" :size="size">未签约</p>
                        <p v-if="scope.row.isContract == 2" :size="size">已签约</p>
                        <p v-if="scope.row.isContract == 3" :size="size">已签约 即将上线</p>
                    </template>
                </el-table-column>
                <el-table-column prop="isAppVisible" label="是否列表显示" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.isAppVisible == 1" :size="size">显示</p>
                        <p v-if="scope.row.isAppVisible == 2" :size="size">不显示</p>
                    </template>
                </el-table-column>
                <!-- 列表里以前有个    银行所有地区  这个字段，如果是直销银行，那么返回的就是provinceAdName；如果是非银机构，返回的是 orgBranchList 这个数组； -->
                <el-table-column prop="provinceAdName" label="银行所属地区" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.levelOneOrgTypeId == 1" :size="size">{{ scope.row.provinceAdName }}</p>
                        <p v-else :size="size" v-for="item in scope.row.orgBranchList" :key="item">
                            {{ item.provinceName }}
                        </p>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="dicName" label="银行类型" header-align="center" align="center"></el-table-column> -->
                <el-table-column label="操作" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div slot="footer">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    style="float: right"
                    :total="totalSize"
                    @current-change="refreshPageRequest"
                    @size-change="handleSizeChange"
                    :current-page="pageRequest.pageNum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageRequest.pageSize">
                </el-pagination>
            </div>
        </CommonTable>
        <!-- 新增弹框 -->
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="70%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <!-- 一级机构类型，为银行，则展示之前直销银行的新增字段，银行以外的类型，都展示非银机构的字段-->
                <el-form-item label="一级机构类型" prop="levelOneOrgTypeId">
                    <el-select v-model="dataForm.levelOneOrgTypeId" placeholder="请选择" clearable @change="levelOneOrgTypeIdSelect">
                        <el-option v-for="item in allSelectData.orgTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级机构类型：" prop="levelTwoOrgTypeId">
                    <el-select v-model="dataForm.levelTwoOrgTypeId" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.levelTwoOrgTypeIdList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="addType == '1'">
                    <el-form-item label="银行名称：" prop="commercialId">
                        <!-- filterable开启可搜索模式  -->
                        <el-select v-model="dataForm.commercialId" placeholder="请选择" filterable clearable @change="bankNameListSelect">
                            <el-option v-for="item in allSelectData.bankNameList" :key="item.commercialId" :label="item.orgName" :value="item.commercialId"> </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item :label="addType == '1' ? '直销银行名称：' : '机构名称：'" prop="orgName">
                    <el-input v-model="dataForm.orgName" :placeholder="addType == '1' ? '请输入直销银行名称' : '请输入机构名称'"></el-input>
                </el-form-item>
                <el-form-item :label="addType == '1' ? '直销银行名称首字母：' : '机构名称首字母：'" prop="namePy">
                    <el-input
                        v-model="dataForm.namePy"
                        :placeholder="addType == '1' ? '请输入直销银行名称首字母' : '请输入机构名称首字母'"
                        @keyup.native="dataForm.namePy = dataForm.namePy.replace(/[^a-zA-Z]/g, '')"></el-input>
                </el-form-item>
                <!-- 新增非银机构 -->
                <template v-if="addType != '1'">
                    <el-form-item label="机构归属地：" prop="orgLocation">
                        <el-select v-model="dataForm.orgLocation" placeholder="请选择" clearable :style="dataForm.orgLocation == '1' ? 'width:24%;padding-right:15px;float:left' : ''">
                            <el-option v-for="item in allSelectData.orgLocationList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                        <!-- 当选择中国大陆时，联动选择省市 -->
                        <div v-if="dataForm.orgLocation == '1'">
                            <ProvinceCity v-model="dataForm.orgBranchList" v-if="dialogVisible" :orgLocation="dataForm.orgLocation"></ProvinceCity>
                        </div>
                    </el-form-item>
                </template>

                <el-form-item label="隶属于比财公司：" prop="contractCompany">
                    <el-select v-model="dataForm.contractCompany" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.contractCompanyList" :key="item.value" :label="item.contractCompanyName" :value="item.contractCompanyId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约状态：" prop="isContract" :required="addType == 1 ? false : true">
                    <el-select v-model="dataForm.isContract" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.isContractList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 新增直销银行 -->
                <template v-if="addType == '1'">
                    <el-form-item label="是否在“合作银行”展示：" prop="isAppVisible">
                        <el-select v-model="dataForm.isAppVisible" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.isAppVisibleList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否在“行情”展示：" prop="isHangqing">
                        <el-select v-model="dataForm.isHangqing" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.isAppVisibleListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行情机构分类：" prop="hangqingType">
                        <el-select v-model="dataForm.hangqingType" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.hangqingTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="是否在线开户：" prop="isOnline">
                        <el-select v-model="dataForm.isOnline" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.isFlagListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="是否可购买：" prop="isCanBuy">
                        <el-select v-model="dataForm.isCanBuy" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.isFlagListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="银行所属地区：" prop="provinceAdcode">
                        <el-select v-model="dataForm.provinceAdcode" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.selProvinceList" :key="item.DIC_VALUE" :label="item.DIC_NAME" :value="item.DIC_VALUE"> </el-option>
                        </el-select>
                    </el-form-item>
                </template>

                <el-form-item :label="addType == '1' ? ' 银行logo：' : '机构logo：'" prop="logoUrl" :required="addType == 1 ? false : true">
                    <el-upload
                        :model="imageUrl + dataForm.logoUrl"
                        class="upload-demo"
                        ref="upload1"
                        :accept="'.png'"
                        action="#"
                        :limit="limitNum"
                        :on-change="fileChange"
                        :on-exceed="exceedFile"
                        :before-upload="beforeUploadFile"
                        :http-request="uploadDirectBankPictureImg1"
                        :show-file-list="false">
                        <img v-if="dataForm.logoUrl" :src="imageUrl + dataForm.logoUrl" @click="uploadDirectBankPictureImg('upLoad1')" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <span class="el-upload__tip" slot="tip">仅支持一张</span>
                    </el-upload>
                </el-form-item>
                <el-form-item class="fromItemBlue" :label="addType == '1' ? '文字logo：' : '机构文字logo：'" prop="logoWordUrl">
                    <el-upload
                        :model="imageUrl + dataForm.logoWordUrl"
                        class="upload-demo"
                        ref="upload2"
                        :accept="'.png'"
                        action="#"
                        :limit="limitNum"
                        :on-exceed="exceedFile"
                        :http-request="uploadDirectBankPictureImg2"
                        :show-file-list="false">
                        <img v-if="dataForm.logoWordUrl" :src="imageUrl + dataForm.logoWordUrl" class="avatar" @click="uploadDirectBankPictureImg2('upLoad2')" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <span class="el-upload__tip" slot="tip">仅支持一张</span>
                    </el-upload>
                </el-form-item>
                <el-form-item :label="addType == '1' ? '银行主页背景图片：' : '机构主页背景图片：'" prop="logoBackgroundUrl" :required="addType == 1 ? false : true">
                    <el-upload
                        :model="imageUrl + dataForm.logoBackgroundUrl"
                        class="upload-demo"
                        ref="upload3"
                        :accept="'.png'"
                        action="#"
                        :limit="limitNum"
                        :on-exceed="exceedFile"
                        :http-request="uploadDirectBankPictureImg3"
                        :show-file-list="false">
                        <img v-if="dataForm.logoBackgroundUrl" :src="imageUrl + dataForm.logoBackgroundUrl" class="avatar" @click="uploadDirectBankPictureImg3('upLoad3')" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <span class="el-upload__tip" slot="tip">仅支持一张</span>
                    </el-upload>
                </el-form-item>
                <el-form-item :label="addType == '1' ? '银行卡背景图片：' : '账户背景图片：'" prop="bankcardUrl" :required="addType == 1 ? false : true">
                    <el-upload
                        :model="imageUrl + dataForm.bankcardUrl"
                        class="upload-demo"
                        ref="upload4"
                        :accept="'.png'"
                        action="#"
                        :limit="limitNum"
                        :on-exceed="exceedFile"
                        :http-request="uploadDirectBankPictureImg4"
                        :show-file-list="false">
                        <img v-if="dataForm.bankcardUrl" :src="imageUrl + dataForm.bankcardUrl" class="avatar" @click="uploadDirectBankPictureImg4('upLoad4')" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <span class="el-upload__tip" slot="tip">仅支持一张</span>
                    </el-upload>
                </el-form-item>
                <!-- 新增直销银行 -->
                <template v-if="addType == '1'">
                    <el-form-item class="fromItemBlue" label="带半圆银行背景图片：" prop="circleBackgroundUrl">
                        <el-upload
                            :model="imageUrl + dataForm.circleBackgroundUrl"
                            class="upload-demo"
                            ref="upload5"
                            :accept="'.png'"
                            action="#"
                            :limit="limitNum"
                            :on-exceed="exceedFile"
                            :http-request="uploadDirectBankPictureImg5"
                            :show-file-list="false">
                            <img v-if="dataForm.circleBackgroundUrl" :src="imageUrl + dataForm.circleBackgroundUrl" class="avatar" @click="uploadDirectBankPictureImg5('upLoad5')" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <span class="el-upload__tip" slot="tip">仅支持一张</span>
                        </el-upload>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="Android开户地址：" prop="onlineUrlAndriod">
                        <el-input v-model="dataForm.onlineUrlAndriod" placeholder="请输入Android开户地址"></el-input>
                    </el-form-item>
                    <el-form-item label="IOS开户地址：" prop="onlineUrlIos">
                        <el-input v-model="dataForm.onlineUrlIos" placeholder="请输入IOS开户地址"></el-input>
                    </el-form-item>
                    <el-form-item label="Android包名：" prop="packageNameAndriod">
                        <el-input v-model="dataForm.packageNameAndriod" placeholder="请输入Android包名"></el-input>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="IOS包名：" prop="packageNameIos">
                        <el-input v-model="dataForm.packageNameIos" placeholder="请输入IOS包名"></el-input>
                    </el-form-item>
                    <el-form-item label="Android H5链接：" prop="h5UrlAndriod">
                        <el-input v-model="dataForm.h5UrlAndriod" placeholder="请输入Android H5链接"></el-input>
                    </el-form-item>
                    <el-form-item label="IOS H5链接：" prop="h5UrlIos">
                        <el-input v-model="dataForm.h5UrlIos" placeholder="请输入IOS H5链接"></el-input>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="产品覆盖类型：" prop="prdCoverType">
                        <el-checkbox-group v-model="dataForm.prdCoverList" @change="checkedPrdCoverTypeChange">
                            <el-checkbox v-for="(item, index) in prdCoverTypeList" :key="index" :label="item"></el-checkbox>
                            <!-- <el-checkbox label="理财"></el-checkbox>
						<el-checkbox label="存款"></el-checkbox>
						<el-checkbox label="贷款"></el-checkbox> -->
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="渠道覆盖类型：" prop="channelCoverType">
                        <el-checkbox-group v-model="dataForm.chlCoverList" @change="checkedChannelCoverTypeChange">
                            <el-checkbox v-for="(item, index) in channelCoverTypeList" :key="index" :label="item"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="是否银行直连（OPENAPI)：" prop="openapiStatus">
                        <el-select v-model="dataForm.openapiStatus" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.isFlagListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="是否H5直连：" prop="openH5Status">
                        <el-select v-model="dataForm.openH5Status" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.openApiOrH5StatusList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否显示银行过度页：" prop="bankTipsPage">
                        <el-select v-model="dataForm.bankTipsPage" placeholder="请选择">
                            <el-option v-for="item in allSelectData.isFlagListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="允许换绑卡：" prop="isChangeBandCard">
                        <el-select v-model="dataForm.isChangeBandCard" placeholder="请选择">
                            <el-option v-for="item in allSelectData.isFlagListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="允许多绑卡：" prop="isSupportBindMutiCards">
                        <el-select v-model="dataForm.isSupportBindMutiCards" placeholder="请选择">
                            <el-option v-for="item in allSelectData.isSupportBindMutiCardsList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="fromItemBlue" label="是否实名认证：" prop="isRzFlag">
                        <el-select v-model="dataForm.isRzFlag" placeholder="请选择">
                            <el-option v-for="item in allSelectData.isFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="银行对接方式：" prop="bankDockType">
                        <el-select v-model="dataForm.bankDockType" placeholder="请选择">
                            <el-option v-for="item in allSelectData.bankDockTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="银行版本标识：" prop="ctVer">
                        <el-input type="number" v-model="dataForm.ctVer" placeholder="请输入银行版本标识"></el-input>
                    </el-form-item>
                </template>
                <el-form-item v-if="addType != '1'" label="机构对接方式：" prop="bankDockType">
                    <el-select v-model="dataForm.bankDockType" placeholder="请选择">
                        <el-option v-for="item in allSelectData.bankDockTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客服服务时间：" prop="custServiceTime">
                    <el-input v-model="dataForm.custServiceTime" placeholder="请输入客服服务时间"></el-input>
                </el-form-item>
                <el-form-item label="客服电话：" prop="orgHotline">
                    <el-input v-model="dataForm.orgHotline" placeholder="请输入客服电话"></el-input>
                </el-form-item>
                <el-form-item label="可拨打客服电话：" prop="servicePhoneCall">
                    <el-input v-model="dataForm.servicePhoneCall" placeholder="请输入可拨打客服电话"></el-input>
                </el-form-item>
                <el-form-item label="简介：" prop="synopsis">
                    <el-input v-model="dataForm.synopsis" placeholder="请输入简介"></el-input>
                </el-form-item>
                <el-form-item :label="addType == '1' ? '介绍：' : '机构介绍：'" prop="instructionUrl">
                    <!-- 富文本 -->
                    <el-card style="height: 480px" v-loading="quillUpdateImg">
                        <el-upload
                            :model="dataForm.instructionUrl"
                            class="avatar-uploader"
                            :accept="acceptType"
                            action="#"
                            :http-request="quillEditorUploaderImg"
                            :before-upload="qnUpload"
                            :show-file-list="false">
                            <!-- <img v-if="dataForm.instructionUrl&&showType!=2" :src="imageUrl + dataForm.instructionUrl" class="avatar"> -->
                            <!-- <video  v-if="videoLink&&showType==2" width="375" height="240" controls class="">
							<source :src="videoLink" type="video/mp4">
							<source :src="videoLink" type="video/ogg">
						</video> -->
                        </el-upload>
                        <quill-editor v-model="dataForm.instructionUrl" ref="myQuillEditor" style="height: 400px" :options="editorOption" @change="onEditorChangeArea($event)"> </quill-editor>
                    </el-card>

                    <!-- 视频弹窗 -->
                    <div :visible.sync="videoUploadTag" v-if="showType == 2">
                        <el-dialog width="50%" id="video_upload" style="margin-top: 1px" title="视频上传" :visible.sync="videoUploadTag" append-to-body>
                            <el-tabs v-model="activeName" @tab-click="videoSelectTagClick" value="0">
                                <el-tab-pane label="添加视频链接" name="first" aria-selected="true">
                                    <el-upload
                                        :model="dataForm.instructionUrl"
                                        class="avatar-uploader"
                                        :accept="acceptType"
                                        action="#"
                                        :http-request="quillEditorUploaderImg"
                                        :before-upload="qnUpload"
                                        :show-file-list="false">
                                        <video v-if="videoLink && showType == 2" width="375" height="240" controls class="">
                                            <source :src="videoLink" type="video/mp4" />
                                            <source :src="videoLink" type="video/ogg" />
                                        </video>
                                        <el-button size="small" type="primary">上传视频</el-button>
                                    </el-upload>

                                    <el-input type="text" :v-model="videoLink" :value="videoLink" placeholder="请输入视频链接" clearable></el-input>
                                    <el-button type="primary" size="small" style="margin: 20px 0px 0px 0px" @click="addVideoLink()">添加</el-button>
                                </el-tab-pane>
                            </el-tabs>
                        </el-dialog>
                    </div>
                </el-form-item>
                <!-- 新增直销银行 -->
                <template v-if="addType == '1'">
                    <el-form-item label="详情页电子银行功能文本说明：" prop="productEblankFunctionText">
                        <el-input v-model="dataForm.productEblankFunctionText" placeholder="请输入详情页电子银行功能文本说明"></el-input>
                    </el-form-item>
                    <el-form-item label="点击查看文本：" prop="eblankFunctionClickText">
                        <el-input v-model="dataForm.eblankFunctionClickText" placeholder="请输入点击查看文本"></el-input>
                    </el-form-item>
                    <el-form-item label="是否可点击电子银行功能：" prop="isProductEblankFunctionClick">
                        <el-select v-model="dataForm.isProductEblankFunctionClick" placeholder="请选择">
                            <el-option v-for="item in allSelectData.isFlagListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 1081需求新增字段 -->
                    <el-form-item label="自定义标签：" prop="defineLabel">
                        <el-input v-model="dataForm.defineLabel" placeholder="请输入自定义标签"></el-input>
                    </el-form-item>
                    <el-form-item label="是否在国内在售银行展示：" prop="ndSale">
                        <el-select v-model="dataForm.ndSale" placeholder="请选择">
                            <el-option v-for="item in allSelectData.isFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否在香港在售银行展示：" prop="hkSale">
                        <el-select v-model="dataForm.hkSale" placeholder="请选择">
                            <el-option v-for="item in allSelectData.isFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序值：" prop="sortNum" v-if="dataForm.ndSale == 1 || dataForm.hkSale == 1">
                        <el-input v-model="dataForm.sortNum" placeholder="请输入排序值"></el-input>
                    </el-form-item>
                </template>
                <!-- 新增非银机构 -->
                <template v-if="addType != '1'">
                    <el-form-item class="fromItemBlue" label="机构跳转图片：" prop="circleBackgroundUrl">
                        <el-upload
                            :model="imageUrl + dataForm.circleBackgroundUrl"
                            class="upload-demo"
                            ref="upload5"
                            :accept="'.png'"
                            action="#"
                            :limit="limitNum"
                            :on-exceed="exceedFile"
                            :http-request="uploadDirectBankPictureImg5"
                            :show-file-list="false">
                            <img v-if="dataForm.circleBackgroundUrl" :src="imageUrl + dataForm.circleBackgroundUrl" class="avatar" @click="uploadDirectBankPictureImg5('upLoad5')" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <span class="el-upload__tip" slot="tip">仅支持一张</span>
                        </el-upload>
                    </el-form-item>
                    <!-- 机构详情页配图的跳转 -->
                    <el-form-item label="机构跳转地址：" prop="homeJumpUrl">
                        <el-input v-model="dataForm.homeJumpUrl" placeholder="请输入首页合作银行跳转链接"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="首页合作银行是否展示：" prop="homePageDisplay">
                    <el-select v-model="dataForm.homePageDisplay" placeholder="请选择">
                        <el-option v-for="item in allSelectData.isFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="首页合作银行排序值：" prop="homeOrderCol">
                    <el-input v-model="dataForm.homeOrderCol" placeholder="请输入排序值"></el-input>
                </el-form-item>
                <el-form-item label="首页合作银行logo：" prop="homeLogoUrl">
                    <el-upload
                        :model="imageUrl + dataForm.homeLogoUrl"
                        class="upload-demo"
                        ref="upload6"
                        :accept="'.png'"
                        action="#"
                        :limit="limitNum"
                        :on-exceed="exceedFile"
                        :http-request="uploadDirectBankPictureImg6"
                        :show-file-list="false">
                        <img v-if="dataForm.homeLogoUrl" :src="imageUrl + dataForm.homeLogoUrl" class="avatar" @click="uploadDirectBankPictureImg6('upLoad6')" />
                        <!-- <video  v-if="dataForm.homeLogoUrl" width="375" height="240" controls class="" @click="uploadDirectBankPictureImg6('upLoad6')">
						<source :src="imageUrl + dataForm.homeLogoUrl" type="video/mp4">
						<source :src="imageUrl + dataForm.homeLogoUrl" type="video/ogg">
					</video>  -->
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <!-- <el-button size="small" type="primary">上传图片</el-button> -->
                        <span class="el-upload__tip" slot="tip">仅支持一张</span>
                    </el-upload>
                </el-form-item>
                <el-form-item label="首页合作银行名称：" prop="homeOrgName">
                    <el-input v-model="dataForm.homeOrgName" placeholder="请输入首页合作银行名称"></el-input>
                </el-form-item>
                <el-form-item v-if="addType == '1'" label="首页合作银行跳转链接：" prop="homeJumpUrl">
                    <el-input v-model="dataForm.homeJumpUrl" placeholder="请输入首页合作银行跳转链接"></el-input>
                </el-form-item>
                <el-form-item v-if="addType != '1'" label="是否机构直联open API：" prop="openapiStatus">
                    <el-select v-model="dataForm.openapiStatus" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.isFlagListStr" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addType == '1'" label="是否包投融资产品：" prop="isTrz">
                    <el-select v-model="dataForm.isTrz" placeholder="请选择">
                        <el-option v-for="item in allSelectData.isFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addType != '1'" label="机构版本标志：" prop="ctVer">
                    <el-input v-model="dataForm.ctVer" placeholder="请输入机构版本标志"></el-input>
                </el-form-item>
                <!-- 直销银行新增，机构类型，机构二级类型，添加分支机构所在地-->
                <template v-if="addType == '1'">
                    <!-- <el-form-item label="机构类型：" prop="oneLevelOrgType" >
					<p>银行机构</p>
				</el-form-item> -->
                    <el-form-item label="机构二级类型：" prop="secondLevelOrgType">
                        <!-- <BcSelect v-model="dataForm.secondLevelOrgType" :list="allSelectData.bankSecondLevelOrgTypeList" placeholder="请选择机构二级类型"></BcSelect> -->
                        <el-select v-model="dataForm.secondLevelOrgType" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.bankSecondLevelOrgTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="添加分支机构所在地：" prop="orgBranchList">
                        <ProvinceCity v-model="dataForm.orgBranchList"></ProvinceCity>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="cancleFrom('dataForm')">取消</el-button>
                <el-button :size="size" type="primary" v-if="!dataForm.id" @click.native="submitFormSave('dataForm')" :loading="saveLoading">保存</el-button>
                <el-button :size="size" type="primary" v-else @click.native="submitFormSave('dataForm')" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // 接口函数依次：银行名称列表，直销银行名称列表，直销银行列表数据，直销银行新增，直销银行修改，直销银行删除,上传图片的接口，查询省接口，请求银行所属类型/行情机构分类，排序值是否重复
    import {
        queryOrgNameByBankType,
        queryDirectBankNameByBankType,
        queryOrgList,
        createOrg,
        updateOrg,
        deleteOrg,
        forUpload,
        selProvince,
        queryTypeByKey,
        configData,
        checkDuplicateSortNum,
        getOrgTypeList
    } from "../../apis/index";
    import config from "../../config/config.index.js";
    import CommonTable from "@common/finsuit-components/CommonTable";
    import ProvinceCity from "../modules/ProvinceCity";
    import ProvinceCityCopy from "../modules/ProvinceCity_copy";
    import BcSelect from "../../components/BcSelect";

    //富文本引入
    import { quillEditor, Quill } from "vue-quill-editor";
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";
    import "../../assets/css/font.css";
    //富文本工具
    const toolbarOptions = [
        ["bold", "underline", "strike"], // 加粗 斜体'italic',  下划线 删除线
        // ['blockquote', 'code-block'], // 引用  代码块
        // [{ 'header': 1 }, { 'header': 2 }], // 1、2 级标题
        // [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 有序、无序列表
        // [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
        // [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
        // [{'line-height': ['1', '1.5','1.75','2', '3', '4', '5']}], //行间距
        // [{'direction': 'rtl'}], // 文本方向
        [{ size: ["10px", false, "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "32px"] }], // 字体大小
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
        // [{ 'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
        // '宋体', '黑体'] }], // 字体种类
        [{ align: [] }], // 对齐方式
        // ['clean'], // 清除文本格式
        ["image"] // 链接、图片、视频 //link链接 video
    ];
    // 自定义字体大小
    let Size = Quill.import("attributors/style/size");
    Size.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px"];
    Quill.register(Size, true);

    // 自定义字体类型
    var fonts = ["SimSun", "SimHei", "Microsoft-YaHei", "KaiTi", "FangSong", "Arial", "Times-New-Roman", "sans-serif", "宋体", "黑体"];
    var Font = Quill.import("formats/font");
    Font.whitelist = fonts;
    // 这里引入修改过的video模块并注册
    // import Video from '../../assets/quill/video'
    Quill.register(Font, true);

    export default {
        name: "depositProduct",
        components: { CommonTable, BcSelect, ProvinceCity, ProvinceCityCopy },
        data() {
            var isContractRule = (rule, value, callback) => {
                //签约状态
                if (this.addType == 1) {
                    callback();
                } else {
                    if (value === "") {
                        callback(new Error("请选择签约状态"));
                    } else {
                        callback();
                    }
                }
            };
            var logoUrlRule = (rule, value, callback) => {
                //请上传机构logo
                if (this.addType == 1) {
                    callback();
                } else {
                    if (value === "") {
                        callback(new Error("请上传机构logo"));
                    } else {
                        callback();
                    }
                }
            };
            var logoBackgroundUrlRule = (rule, value, callback) => {
                //机构主页背景图片
                if (this.addType == 1) {
                    callback();
                } else {
                    if (value === "") {
                        callback(new Error("请上传机构主页背景图片"));
                    } else {
                        callback();
                    }
                }
            };
            var bankcardUrlRule = (rule, value, callback) => {
                //账户背景图片
                if (this.addType == 1) {
                    callback();
                } else {
                    if (value === "") {
                        callback(new Error("请上传账户背景图片"));
                    } else {
                        callback();
                    }
                }
            };
            var namePyRule = (rule, value, callback) => {
                //机构名称首字母
                if (this.addType == 1) {
                    callback();
                } else {
                    if (value == "") {
                        callback(new Error("请输入机构名称首字母"));
                    } else {
                        callback();
                    }
                }
            };

            var _this = this;
            return {
                tableHeight: 0,
                imageUrl: "", //图片前面有域名的部分地址
                size: "small",
                topCheckData: {
                    //顶部搜索选择的工具内容
                    id: "", //直销银行名称ID，
                    isContract: "", //签约状态
                    provinceAdcode: "", //银行所属地区
                    orgType: [] //机构类型 //一个数字，就是查询一级，2个数字，有逗号，就查询一级下的二级
                },
                dialogUploadVisible: false, //是否显示导入的上传文件的弹框
                limitNum: 1, // 上传excell时，同时允许上传的最大数
                fileObj: {}, // 单个要上传的文件
                fileList: [], //要上传的文件列表数组--多个文件
                //分页
                totalSize: 0, //总数
                pageRequest: {
                    //请求直销银行列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求直销银行时loading
                directBankList: [], //请求回来的直销银行列表数据list
                allSelectData: {
                    orgTypeList: [
                        // {
                        // 	"label":'银行',
                        // 	"value": 1,
                        // 	'children':[
                        // 		{'value': '1', 'label': '国有大型商业银行'	},
                        // 		{'value': '2', 'label': '股份制银行'},
                        // 		{'value': '3', 'label': '城市商业银行'},
                        // 		{'value': '4', 'label': '农村商业银行'},
                        // 		{'value': '5', 'label': '农村合作银行'},
                        // 		{'value': '6', 'label': '民营银行'},
                        // 		{'value': '7', 'label': '外资银行'},
                        // 	]
                        // },{
                        // 	"label":'非银机构',
                        // 	"value": 2,
                        // 	'children':[
                        // 		{
                        // 			"label":'基金',
                        // 			"value": 1
                        // 		},{
                        // 			"label":'券商',
                        // 			"value": 2
                        // 		},{
                        // 			"label":'保险',
                        // 			"value": 3
                        // 		},
                        // 	]
                        // },{
                        // 	"label":'理财子',
                        // 	"value": 3,
                        // 	'children':[
                        // 		{
                        // 			"label":'理财子',
                        // 			"value": 1
                        // 		}
                        // 	]
                        // },{
                        // 	"label":'其他',
                        // 	"value": 4,
                        // 	'children': null
                        // }
                    ], //机构类型
                    // bankTypeList:[], //银行类型
                    hangqingTypeList: [], //行情机构分类list
                    bankNameList: [], //商业银行名称list
                    directBankNameList: [], //直销银行名称list
                    selProvinceList: [], //所以省的合集
                    contractCompanyList: [], //隶属于比财公司
                    isFlagList: [
                        {
                            name: "是",
                            value: 1
                        },
                        {
                            name: "否",
                            value: 0
                        }
                    ], //是否。。。
                    isFlagListStr: [
                        {
                            name: "是",
                            value: "1"
                        },
                        {
                            name: "否",
                            value: "0"
                        }
                    ], //是否。。。
                    isAppVisibleList: [
                        {
                            name: "显示",
                            value: 1
                        },
                        {
                            name: "不显示",
                            value: 2
                        }
                    ], //是否显示列表
                    isAppVisibleListStr: [
                        {
                            name: "显示",
                            value: "1"
                        },
                        {
                            name: "不显示",
                            value: "2"
                        }
                    ], //是否显示列表
                    isContractList: [
                        {
                            name: "未签约",
                            value: 1
                        },
                        {
                            name: "已签约",
                            value: 2
                        },
                        {
                            name: "已签约 即将上线",
                            value: 3
                        }
                    ], //签约状态
                    bankDockTypeList: [
                        {
                            name: "无",
                            value: "0"
                        },
                        {
                            name: "SDK",
                            value: "1"
                        },
                        {
                            name: "BCH5",
                            value: "2"
                        }
                    ], //银行对接方式
                    openApiOrH5StatusList: [
                        {
                            name: "已通",
                            value: "1"
                        },
                        {
                            name: "未通",
                            value: "0"
                        }
                    ], //OPENAPI标识-是否银行直连/打通h5直联标识-是否H5直连
                    isSupportBindMutiCardsList: [
                        {
                            name: "支持",
                            value: "1"
                        },
                        {
                            name: "不支持",
                            value: "0"
                        }
                    ], //是否支持绑定多张卡(1：支持，0：不支持)

                    //新增字段
                    bankSecondLevelOrgTypeList: [
                        {
                            name: "全国性银行",
                            value: 1
                        },
                        {
                            name: "地方性法人银行",
                            value: 2
                        }
                    ], //银行机构---二级机构类型
                    levelTwoOrgTypeIdList: [
                        // {
                        // 	"name":'基金',
                        // 	"value": 1
                        // },{
                        // 	"name":'券商',
                        // 	"value": 2
                        // },{
                        // 	"name":'保险',
                        // 	"value": 3
                        // }
                    ], //之前是非银机构---二级机构类型 //现在是不同一级下的 二级机构类型
                    orgLocationList: [
                        {
                            name: "中国大陆",
                            value: "1"
                        },
                        {
                            name: "中国香港",
                            value: "2"
                        }
                    ] //机构归属地
                }, //所有下拉框数组合集
                // 新增和编辑
                saveLoading: false, //保存时按钮loading
                dialogVisible: false, //是否展示新增编辑弹框
                addType: "", //新增类型
                dataForm: {
                    //新增弹框数据
                    id: "", //主键id
                    orgType: "", //一级机构类型 默认有4个：1、银行，2、非银机构，3、理财子，4、其他
                    bankType: "", //二级机构类型编码.1、银行下：0:未知, 1: 国有商业银行, 2:全国性的股份制银行, 3: 城市商业银行,4: 农村商业银行, 5:农村合作银 6: 网商银行,7: 民营银行, 8:外资银行
                    dicName: "", //机构所属类型名称
                    commercialId: "", //银行机构id
                    commercialBankName: "", //银行名称
                    // commercialBankNamePy:'', //银行名称
                    orgName: "", //机构名称
                    namePy: "", //银行首字母
                    isAppVisible: "", //是否列表显示
                    isHangqing: "", //是否在行情显示
                    hangqingType: "", //行情机构类型
                    isContract: "", //签约状态，1已签约，2未签约
                    isOnline: "", //是否在线开户
                    isCanBuy: "", //是否可购买
                    provinceAdcode: "", //所在省或直辖市编号
                    provinceAdName: "", //所在省或直辖市名称
                    logoUrl: "", //银行logo图片地址
                    logoWordUrl: "", //带文字logo地址
                    logoBackgroundUrl: "", //银行背景图片
                    bankcardUrl: "", //银行卡背景图片
                    circleBackgroundUrl: "", //带半圆银行背景图片
                    onlineUrlAndriod: "", //安卓开户地址
                    onlineUrlIos: "", //IOS开户地址
                    packageNameAndriod: "", //安卓包名
                    packageNameIos: "", //ios包名
                    h5UrlAndriod: "", //安卓h5链接
                    h5UrlIos: "", //iOSh5链接
                    prdCoverType: "", //产品覆盖类型（1理财,2存款,3贷款）
                    channelCoverType: "", //渠道覆盖类型（1安卓,2IOS,3网站,4其他-H5）
                    prdCoverTypes: [], //产品覆盖类型集合
                    channelCoverTypes: [], //渠道覆盖类型集合
                    prdCoverList: [], //产品覆盖类型--选中的数据集合
                    chlCoverList: [], //渠道覆盖类型--选中的数据集合
                    openapiStatus: "", //OPENAPI标识 0.未打通 1.打通-是否银行直连
                    openH5Status: "", //打通h5直联标识 0.未通 1.已通-是否H5直连
                    bankTipsPage: "", //是否显示银行过度页
                    isRzFlag: "", //是否实名认证 0否 1是
                    bankDockType: "", //银行对接方式 0.无,1.SDK
                    ctVer: "", //银行版本标识
                    isSupportBindMutiCards: "", //是否支持绑定多张卡(1：支持，0：不支持)
                    isChangeBandCard: "", //是否可换绑卡(1：是，0：否)
                    orgHotline: "", //机构热线电话--客服电话
                    servicePhoneCall: "", //可拨打客服电话
                    custServiceTime: "", //客服服务时间
                    synopsis: "", //简介
                    instructionUrl: "", //介绍-图片链接
                    appFlag: "BC", //APP应用标识
                    createId: 0, //创建人
                    updId: 1, //最后更新人
                    contractCompany: "", //签约的公司：1：北京比财数据科技有限公司，2：比财数据科技（天津）有限公司，3：比财数据科技（厦门）有限公司
                    productEblankFunctionText: "", //详情页电子银行功能文本说明
                    eblankFunctionClickText: "", // 点击查看文本
                    isProductEblankFunctionClick: "", //是否可点击电子银行功能
                    defineLabel: "", //自定义标签
                    ndSale: "", //是否在国内在售银行展示:0:否,1:是，默认否
                    hkSale: "", //是否在香港在售银行展示:0:否,1:是，默认否
                    sortNum: "", //排序值：0为优先级最高
                    homePageDisplay: "", //首页榜单是否展示，0：否，1：是，默认否
                    homeOrderCol: "", //首页榜单排序值，数值越大，排序越靠前
                    homeLogoUrl: "", //首页榜单银行logo
                    homeOrgName: "", //首页榜单银行名称
                    homeJumpUrl: "", //首页榜单跳转链接
                    isTrz: "", //是否包投融资产品

                    //新增加字段
                    levelOneOrgTypeId: "", //一级机构类型  之前的机构类型是 oneLevelOrgType 这个字段
                    levelTwoOrgTypeId: "", //二级机构类型  之前的非银的二级机构类型是 secondLevelOrgType 这个字段
                    secondLevelOrgType: "", //银行类型下的 机构二级类型
                    orgLocation: "", //机构归属地
                    orgBranchList: [
                        // {},
                        // {
                        // 	type:'array',
                        // 	provinceValue: { provinceCode: "110000", provinceName: "北京" },
                        // 	cityValue: [{ cityCode: "110100", cityName: "北京市市辖区" }]
                        // },
                        // {
                        // 	provinceValue: { provinceCode: "110000", provinceName: "北京11" },
                        // 	cityValue: { cityCode: "110100", cityName: "北京市市辖区2" }
                        // }
                        // {
                        // provinceCode: "110000",
                        // provinceName: "北京",
                        // cityList: [{ cityCode: "110100", cityName: "北京市市辖区" }],
                        // }
                        // {
                        // provinceCode: "110000",
                        // provinceName: "北京",
                        // cityList: [{ cityCode: "110100", cityName: "北京市市辖区" },{ cityCode: "110100", cityName: "北京市市辖区" }],
                        // }
                    ] //省市--机构分支列表
                },
                prdCoverTypeList: ["理财", "存款", "贷款"], //多选-产品覆盖类型初始值
                channelCoverTypeList: ["安卓市场", "苹果商店", "网站", "其他（H5）"], //多选-渠道覆盖类型初始值
                formRules: {
                    //弹框校验规则
                    levelOneOrgTypeId: [
                        //一级机构类型
                        { required: true, message: "请选择一级机构类型", trigger: "change" }
                    ],
                    commercialId: [
                        //银行名称
                        { required: true, message: "请输入直销银行名称", trigger: "blur" }
                    ],
                    orgName: [
                        //直销银行名称
                        { required: true, message: "请选择银行名称", trigger: "change" }
                    ],
                    provinceAdcode: [
                        //地区
                        { required: true, message: "请选择机构名称", trigger: "change" }
                    ],
                    isOnline: [
                        //是否可在线开户
                        { required: true, message: "请选择产品区域", trigger: "change" }
                    ],
                    isCanBuy: [
                        //是否可购买
                        { required: true, message: "请选择币种", trigger: "change" }
                    ],
                    contractCompany: [
                        //隶属于比财公司
                        { required: true, message: "请选择隶属于比财公司", trigger: "change" }
                    ],
                    defineLabel: [
                        //自定义标签
                        { required: false, trigger: "blur" },
                        { min: 0, max: 8, message: "长度最多八个汉字", trigger: "blur" }
                    ],
                    //新增加的校验字段
                    levelTwoOrgTypeId: [
                        //机构二级类型
                        { required: true, message: "请选择机构二级类型", trigger: "change" }
                    ],
                    orgLocation: [
                        //机构归属地
                        { required: true, message: "请选择机构归属地", trigger: "change" }
                    ],

                    //只有非银机构是必填的字段
                    namePy: [{ required: true, validator: namePyRule, trigger: "blur" }], //机构名称首字母
                    isContract: [{ validator: isContractRule, trigger: "change" }], //签约状态
                    logoUrl: [{ validator: logoUrlRule, trigger: "change" }], //机构主页背景图片
                    logoBackgroundUrl: [{ validator: logoBackgroundUrlRule, trigger: "change" }], //机构主页背景图片
                    bankcardUrl: [{ validator: bankcardUrlRule, trigger: "change" }] //账户背景图片
                },
                uploadType: "image/*", //其他上传图片的文件类型--暂时没用动，上面写死了'.png'
                //富文本
                quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
                header: { token: sessionStorage.token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
                showType: 1, //按钮类型
                acceptType: "image/*", //富文本的文件类型
                videoUploadTag: false, //显示插入视频链接弹框的标识
                videoLink: "", //弹框插入的视频链接记录
                editorOption: {
                    placeholder: "请输入内容...",
                    theme: "snow", // or 'bubble'
                    modules: {
                        toolbar: {
                            container: toolbarOptions, //工具栏
                            handlers: {
                                image: function (value) {
                                    //添加图片
                                    if (value) {
                                        console.log("image");
                                        // 触发input框选择图片文件
                                        _this.showType = 1;
                                        _this.acceptType = "image/*";
                                        console.log(_this.showType, _this.acceptType);
                                        setTimeout(() => {
                                            document.querySelector(".avatar-uploader input").click();
                                        }, 500);

                                        // 劫持原来的图片点击按钮事件
                                        // QuillWatch.emit(this.quill.id);
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                },
                                link: function (value) {
                                    // 添加链接
                                    if (value) {
                                        console.log("link");
                                        var href = prompt("请输入需要添加的链接地址");
                                        this.quill.format("link", href);
                                        console.log("href", href);
                                    } else {
                                        this.quill.format("link", false);
                                    }
                                },
                                video: function (value) {
                                    if (value) {
                                        console.log("video");
                                        //第一种、直接输入链接---可行
                                        var href = prompt("请输入需要添加的链接地址");
                                        this.quill.format("video", href);
                                        console.log("video", href);

                                        // var href = prompt('请输入需要添加的链接地址')
                                        // this.quill.format('video', _this.videoLink)
                                        // console.log('video',_this.videoLink)

                                        //第二种、直接调起本地的选择视频---不可行，直接下载
                                        // _this.showType = 2
                                        // _this.acceptType = 'video/*'
                                        // console.log(_this.showType,_this.acceptType)

                                        // setTimeout(()=>{
                                        // 	document.querySelector('.avatar-uploader input').click()
                                        // },1000)

                                        //第三种、触发弹窗---弹窗可行，但是视频不能放到富文本上
                                        // _this.videoUploadTag = true;

                                        // 劫持原来的图片点击按钮事件
                                        // QuillVideoWatch.emit(this.quill.id)
                                    } else {
                                        this.quill.format("video", false);
                                    }
                                }
                            }
                        }
                    }
                }
            };
        },

        mounted() {
            //图片初始化地址：
            // this.imageUrl = config.baseUrlHost +'/finsuitImgDisplay/show?path='; //测试
            this.imageUrl = config.aliyuncHost; //生产
            console.log("图片初始地址-imageUrl", this.imageUrl);

            this.getOrgSelectData(); //初始化下拉框银行名称数据
            this.getdirectBankList(); //直销银行管理列表
        },
        methods: {
            //进入直销银行列表初始化参--所有下拉框数据
            getOrgSelectData() {
                let params = "";
                //请求直销银行名称列表
                queryDirectBankNameByBankType(params)
                    .then((res) => {
                        console.log("获取直销银行名称数据", res);
                        if (res.result == true) {
                            this.allSelectData.directBankNameList = res.data;
                        } else {
                            console.log("直销银行名称据失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求直销银行名称列表数据err", err);
                        this.$message({ message: "请求直销银行名称列表数据失败", type: "error" });
                    });

                //请求银行名称列表
                queryOrgNameByBankType(params)
                    .then((res) => {
                        console.log("获取银行名称数据", res);
                        if (res.result == true) {
                            //银行名称列表
                            this.allSelectData.bankNameList = res.data;
                        } else {
                            console.log("银行名称数据失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求银行名称数据err", err);
                        this.$message({ message: "请求银行名称数据失败", type: "error" });
                    });

                //请求省的接口
                let paramsCity = {
                    CITYCODE: "10000"
                };
                selProvince(paramsCity)
                    .then((res) => {
                        console.log("获取省的数据", res);
                        if (res.result == true) {
                            //银行名称列表
                            this.allSelectData.selProvinceList = res.data;
                        } else {
                            console.log("省获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求市获取失败err", err);
                        this.$message({ message: "请求市失败", type: "error" });
                    });
                // //请求银行所属类型
                queryTypeByKey(params)
                    .then((res) => {
                        console.log("获取机构所属类型的数据", res);
                        if (res.result == true) {
                            this.allSelectData.hangqingTypeList = res.data.hangqingTypes; //行情机构类型
                        } else {
                            console.log("机构所属类型获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求机构所属类型失败err", err);
                        this.$message({ message: "请求机构所属类型失败", type: "error" });
                    });

                //请求机构类型树形结构
                getOrgTypeList()
                    .then((res) => {
                        console.log("获取机构类型树形结构", res);
                        if (res.headerModel.code == 0) {
                            this.allSelectData.orgTypeList = res.datatypeParam.dateList; //机构类型tree结构
                        } else {
                            console.log("获取机构类型树形结构失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求机构所属类型失败err", err);
                        this.$message({ message: "请求机构所属类型失败", type: "error" });
                    });

                //请求 隶属于比财公司
                configData(params)
                    .then((res) => {
                        console.log("获取隶属于比财公司数据", res);
                        if (res.result == true) {
                            //隶属于比财公司
                            this.allSelectData.contractCompanyList = res.data.contractCompany;
                        } else {
                            console.log("隶属于比财公司获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log("请求隶属于比财公司失败err", err);
                        this.$message({ message: "请求隶属于比财公司失败", type: "error" });
                    });
            },
            // 获取直销银行列表数据
            getdirectBankList: function (type) {
                this.loading = true;
                if (type == "chaxun") {
                    console.log("chauxn");
                    this.pageRequest.pageNum = 0; //初始化--第一条开始查
                    this.pageRequest.pageSize = 10; //初始化--查询10条
                }
                let params = {
                    //查询多少页，从0开始, offset=页数乘以条数
                    start: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum - 1) * this.pageRequest.pageSize,
                    length: this.pageRequest.pageSize, //查询多少条
                    id: this.topCheckData.id, //直销银行名称id
                    isContract: this.topCheckData.isContract, //签约状态
                    provinceAdcode: this.topCheckData.provinceAdcode, //银行所属地区
                    orgType: this.topCheckData.orgType //机构类型
                };
                console.log("直销银行数据入参", params);
                queryOrgList(params)
                    .then((res) => {
                        console.log("获取直销银行列表数据", res);
                        this.directBankList = res.data.data;
                        this.totalSize = res.data.totalCount; //总条数
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取直销银行列表数据err", err);
                        this.loading = false;
                    });
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getdirectBankList(); //调直销银行列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getdirectBankList(); //调产品系列列表接口
            },
            //重置
            resetForm(topData) {
                console.log("重置");
                this.$refs.topData.resetFields();
                this.getdirectBankList(); //直销银行管理列表
            },
            //弹框取消按钮
            cancleFrom(dataForm) {
                this.dialogVisible = false;
                this.$refs.dataForm.resetFields(); //清空数据
                location.reload(); //刷新页面
            },
            //点击弹框阴影部分校验
            closeDialog(done) {
                this.$confirm("确认关闭？")
                    .then((_) => {
                        done();
                        this.$refs.dataForm.resetFields(); //清空数据
                        location.reload(); //刷新页面
                    })
                    .catch((_) => {});
            },
            //点击查询条件的机构类型
            orgTypeListSelect(val) {
                console.log("当前value--code", val);
                this.topCheckData.orgType = val.join(); //给后台传值时将数组转为字符串，数组中两个id
                console.log("当前value--code1111", this.topCheckData.orgType);
            },
            //点击一级机构change事件
            levelOneOrgTypeIdSelect(val) {
                this.dataForm.levelTwoOrgTypeId = ""; //每次点击切换一级结构，则二级机构的值清空重选
                console.log("当前value--code", val);
                this.addType = val; //一级机构类型1银行，2非银机构，3理财子，4其他
                this.levelTwoOrgTypeIdListSelect(val);
            },
            //二级机构类型
            levelTwoOrgTypeIdListSelect(val) {
                let obj = {};
                // console.log('orgTypeList',this.allSelectData.orgTypeList)
                obj = this.allSelectData.orgTypeList.find(function (item) {
                    return item.value === val;
                });
                console.log(obj.value, obj.label, obj.children);
                this.allSelectData.levelTwoOrgTypeIdList = obj.children;
            },
            //新增下拉框的lable--机构名称--选中值发生变化时触发
            bankNameListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.bankNameList.find(function (item) {
                    return item.commercialId === val;
                });
                console.log(obj);
                console.log(obj.orgName);
                this.dataForm.commercialBankName = obj.orgName;
            },
            // 显示新增界面弹窗
            handleAdd: function (type) {
                this.dialogVisible = true;
                this.dataForm = {
                    bankType: "", //机构所属类型编码.0:未知, 1: 国有商业银行, 2:全国性的股份制银行, 3: 城市商业银行,4: 农村商业银行, 5:农村合作银行, 6: 网商银行,7: 民营银行, 8:外资银行
                    dicName: "", //机构所属类型名称
                    commercialId: "", //银行机构id
                    commercialBankName: "", //银行名称
                    // commercialBankNamePy:'', //银行名称
                    orgName: "", //直销银行机构名称
                    namePy: "", //直销银行首字母
                    isAppVisible: "", //是否列表显示
                    isHangqing: "", //是否在行情显示
                    hangqingType: "", //行情机构类型
                    isContract: "", //签约状态，1已签约，2未签约
                    isOnline: "", //是否在线开户
                    isCanBuy: "", //是否可购买
                    provinceAdcode: "", //所在省或直辖市编号
                    provinceAdName: "", //所在省或直辖市名称
                    logoUrl: "", //银行logo图片地址
                    logoWordUrl: "", //带文字logo地址
                    logoBackgroundUrl: "", //银行背景图片
                    bankcardUrl: "", //银行卡背景图片
                    circleBackgroundUrl: "", //带半圆银行背景图片
                    onlineUrlAndriod: "", //安卓开户地址
                    onlineUrlIos: "", //IOS开户地址
                    packageNameAndriod: "", //安卓包名
                    packageNameIos: "", //ios包名
                    h5UrlAndriod: "", //安卓h5链接
                    h5UrlIos: "", //iOSh5链接
                    prdCoverType: "", //产品覆盖类型（1理财,2存款,3贷款）
                    channelCoverType: "", //渠道覆盖类型（1安卓,2IOS,3网站,4其他-H5）
                    prdCoverTypes: [], //产品覆盖类型集合
                    channelCoverTypes: [], //渠道覆盖类型集合
                    prdCoverList: [], //产品覆盖类型--选中数据集合
                    chlCoverList: [], //渠道覆盖类型--选中数据集合
                    openapiStatus: "", //OPENAPI标识 0.未打通 1.打通-是否银行直连
                    openH5Status: "", //打通h5直联标识 0.未通 1.已通-是否H5直连
                    bankTipsPage: "", //是否显示银行过度页
                    isRzFlag: "", //是否实名认证 0否 1是
                    bankDockType: "", //银行对接方式 0.无,1.SDK
                    ctVer: "", //银行版本标识
                    isSupportBindMutiCards: "", //是否支持绑定多张卡(1：支持，0：不支持)
                    isChangeBandCard: "", //是否可换绑卡(1：是，0：否)
                    orgHotline: "", //机构热线电话--客服电话
                    servicePhoneCall: "", //可拨打客服电话
                    custServiceTime: "", //客服服务时间
                    synopsis: "", //简介
                    instructionUrl: "", //介绍-图片链接
                    appFlag: "BC", //APP应用标识
                    createId: 0, //创建人
                    contractCompany: 1, //签约的公司：默认选 1：北京比财数据科技有限公司，
                    productEblankFunctionText: "", //详情页电子银行功能文本说明
                    eblankFunctionClickText: "", // 点击查看文本
                    isProductEblankFunctionClick: "0", //是否可点击电子银行功能
                    defineLabel: "", //自定义标签
                    ndSale: 0, //是否在国内在售银行展示:0:否,1:是，默认空，若为是，展示排序值字段
                    hkSale: 0, //是否在香港在售银行展示:0:否,1:是，默认空，若为是，展示排序值字段
                    sortNum: "", //排序值：0为优先级最高，
                    homePageDisplay: 0, //首页榜单是否展示，0：否，1：是，默认空
                    homeOrderCol: "", //首页榜单排序值，数值越大，排序越靠前
                    homeLogoUrl: "", //首页榜单银行logo
                    homeOrgName: "", //首页榜单银行名称
                    homeJumpUrl: "", //首页榜单跳转链接
                    isTrz: "", //是否包投融资产品
                    //新增加字段
                    levelOneOrgTypeId: "", //一级机构类型  之前的机构类型是 oneLevelOrgType 这个字段
                    levelTwoOrgTypeId: "", //二级机构类型  之前的非银的二级机构类型是 secondLevelOrgType 这个字段
                    secondLevelOrgType: "", //银行类型下的 机构二级类型
                    orgLocation: "", //机构归属地
                    orgBranchList: [
                        {
                            provinceValue: {}, //省选中的值
                            cityValue: [] //市，多选则用数组，单选用{}
                        }
                    ] //省市 必须要有一个初始值
                };
                Object.assign(this.dataForm);
            },

            // 显示编辑界面弹框
            handleEdit: function (row) {
                this.addType = row.levelOneOrgTypeId; //新增类型：1直销银行新增；2非银机构新增，3理财子，4其他
                console.log("新增", this.addType);
                console.log("编辑", row);
                this.dialogVisible = true;
                Object.assign(this.dataForm, row);
                //但是老数据中oneLevelOrgType为1为银行时，secondLevelOrgType为null,所以无法回显，直接改为空，有数据时，跟现在数组中的value 值对应不上，所以全部置为空；
                if (row.secondLevelOrgType || row.secondLevelOrgType == null) {
                    row.secondLevelOrgType = "";
                }
                //老数据，回显的时候，新字段levelOneOrgTypeId，levelTwoOrgTypeId为null,所以直接展示老字段
                this.dataForm.levelOneOrgTypeId = row.levelOneOrgTypeId != null ? row.levelOneOrgTypeId + "" : row.oneLevelOrgType + ""; //由于接口返回的都是字符串格式，但是列表修改里的是int类型，所以需要转成字符串格式
                this.dataForm.levelTwoOrgTypeId = row.levelTwoOrgTypeId != null ? row.levelTwoOrgTypeId + "" : row.secondLevelOrgType + ""; //由于接口返回的都是字符串格式，但是列表修改里的是int类型，所以需要转成字符串格式
                this.levelTwoOrgTypeIdListSelect(this.dataForm.levelOneOrgTypeId); //回显二级机构类型，需要调用方法，带出二级机构类型的list

                // if(this.addType == 1){ //回显直销银行时，省市的字段需要转成组件的格式,
                let newArray = [];
                if (row.orgBranchList.length != 0) {
                    row.orgBranchList.map((item) => {
                        console.log("item", item);
                        newArray.push({
                            //只需要这两个值
                            provinceValue: { provinceCode: item.provinceCode, provinceName: item.provinceName },
                            cityValue: item.cityList.map((i) => {
                                return { cityCode: i.cityCode, cityName: i.cityName };
                            })
                        });
                        return newArray;
                    });
                    this.dataForm.orgBranchList = newArray;
                    console.log("newArray = 0", this.dataForm.orgBranchList);
                } else {
                    this.dataForm.orgBranchList = [
                        {
                            provinceValue: {},
                            cityValue: []
                        }
                    ];
                    console.log("newArray > 0", this.dataForm.orgBranchList);
                }
                // }else{  //非银机构中也需要该字段，机构归属地选择中国大陆，则需要选择省市，则用到该字段，所以不需要区分直销银行和非银机构
                // 	this.dataForm.orgBranchList = [{}]
                // }
                console.log("新组合后的dataForm", this.dataForm);
            },

            //点击保存提交---先查看排序值是否重复
            submitFormSave: function (refdataForm) {
                console.log("id", this.dataForm.id);
                //先看排序是否重复
                if (this.dataForm.sortNum !== "") {
                    console.log("排序");
                    let params = {
                        sortNum: this.dataForm.sortNum,
                        orgId: this.dataForm.id ? this.dataForm.id : ""
                    };
                    //先查看排序值是否重复
                    checkDuplicateSortNum(params)
                        .then((res) => {
                            console.log("排序值接口", res);
                            if (res.result == true) {
                                if (res.data == true) {
                                    //排序值重复，则调新增或编辑的接口
                                    this.$confirm("排序值重复是否要进行插入操作", "提示", {})
                                        .then(() => {
                                            //确定
                                            this.$message({ message: "插入成功", type: "success" });
                                            if (!this.dataForm.id) {
                                                //新增
                                                console.log("新增");
                                                this.submitFormAddSave(refdataForm);
                                            } else {
                                                //编辑
                                                console.log("编辑");
                                                this.submitFormEditSave(refdataForm);
                                            }
                                        })
                                        .catch(() => {
                                            //取消
                                            this.$message({ message: "请输入排序值", type: "info" });
                                            this.dataForm.sortNum = "";
                                        });
                                } else {
                                    //排序值不重复，直接赋值-->新增或者保存
                                    console.log("排序值不重复时", this.dataForm.sortNum);
                                    if (!this.dataForm.id) {
                                        //新增
                                        this.submitFormAddSave(refdataForm);
                                    } else {
                                        //编辑
                                        this.submitFormEditSave(refdataForm);
                                    }
                                }
                            } else {
                                this.$message({ message: res.description, type: "error" });
                            }
                        })
                        .catch((err) => {
                            console.log("排序接口err", err);
                            this.$message({ message: err, type: "error" });
                        });
                } else {
                    if (!this.dataForm.id) {
                        //新增
                        this.submitFormAddSave(refdataForm);
                    } else {
                        //编辑
                        this.submitFormEditSave(refdataForm);
                    }
                }
            },
            //提交前重新给orgBranchList赋值
            submitData() {
                // if(this.addType == 1){
                // 	let newArray = []
                // 	this.dataForm.orgBranchList.map(item=>{
                // 		newArray.push({
                // 			provinceCode: item.provinceValue.provinceCode,
                // 			provinceName: item.provinceValue.provinceName,
                // 			cityList: item.cityValue,
                // 		});
                // 		return newArray
                // 	})
                // 	this.dataForm.orgBranchList = newArray
                // 	console.log("newArray",this.dataForm.orgBranchList)
                // }else{
                // 	if(this.dataForm.orgLocation == '1'){ //新增非银机构时，选择中国大陆，则省市的字段需要转一下格式，
                // 		let newArray = []
                // 		this.dataForm.orgBranchList.map(item=>{
                // 			newArray.push({
                // 				provinceCode: item.provinceValue.provinceCode,
                // 				provinceName: item.provinceValue.provinceName,
                // 				cityList: item.cityValue,
                // 			});
                // 			return newArray
                // 		})
                // 		this.dataForm.orgBranchList = newArray
                // 		console.log("newArray",this.dataForm.orgBranchList)
                // 	}else{ //非银机构中，选择中国香港，则orgBranchList要穿空
                // 		this.dataForm.orgBranchList = [{}]
                // 	}
                // }

                //在修改的情况下，并且是中国香港的时候，则orgBranchList字段为空
                if (this.addType != "1" && this.dataForm.orgLocation == "2") {
                    this.dataForm.orgBranchList = [{}];
                } else {
                    let newArray = [];
                    this.dataForm.orgBranchList.map((item) => {
                        newArray.push({
                            provinceCode: item.provinceValue.provinceCode,
                            provinceName: item.provinceValue.provinceName,
                            cityList: item.cityValue
                        });
                        return newArray;
                    });
                    this.dataForm.orgBranchList = newArray;
                }
                console.log("newArray", this.dataForm.orgBranchList);
            },
            //新增保存提交
            submitFormAddSave: function (dataForm) {
                console.log("新增保存");
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                this.submitData(dataForm); //提交前从新给dataForm赋值
                                console.log("提交前的dataForm", this.dataForm);
                                let params = Object.assign({}, this.dataForm);
                                console.log("新增保存入参", params);
                                createOrg(params)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.result == true) {
                                            this.saveLoading = false;
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.dialogVisible = false;
                                            this.getdirectBankList();
                                            // location.reload();  //刷新页面
                                        } else {
                                            this.saveLoading = false;
                                            this.$message({ message: res.description, type: "error" });
                                            this.dialogVisible = false;
                                            this.getdirectBankList();
                                            // location.reload();  //刷新页面
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("新增接口err", err);
                                        this.saveLoading = false;
                                        this.$message({ message: err, type: "error" });
                                        this.dialogVisible = false;
                                    });
                            })
                            .catch(() => {
                                this.saveLoading = false;
                                this.$message({ type: "info", message: "已取消新增" });
                                this.dialogVisible = false;
                            });
                    }
                });
            },
            //编辑保存提交
            submitFormEditSave: function (dataForm) {
                console.log("编辑保存");
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                this.submitData(); //提交前从新给dataForm赋值
                                this.dataForm.levelOneOrgTypeId = parseInt(this.dataForm.levelOneOrgTypeId); //提交的时候还需要转成int类型
                                this.dataForm.levelTwoOrgTypeId = parseInt(this.dataForm.levelTwoOrgTypeId); //提交的时候还需要转成int类型
                                console.log("提交前的dataForm", this.dataForm);
                                let params = Object.assign({}, this.dataForm);
                                console.log("编辑保存入参", params);
                                //请求编辑接口
                                updateOrg(params)
                                    .then((res) => {
                                        console.log("修改接口", res);
                                        if (res.result == true) {
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.saveLoading = false;
                                            this.dialogVisible = false;
                                            this.getdirectBankList();
                                            // location.reload();  //刷新页面
                                        } else {
                                            this.$message({ message: res.description, type: "error" });
                                            this.saveLoading = false;
                                            this.dialogVisible = false;
                                            this.getdirectBankList();
                                            // location.reload();  //刷新页面
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("编辑接口err", err);
                                        this.$message({ message: err, type: "error" });
                                        this.saveLoading = false;
                                        this.dialogVisible = false;
                                        this.getdirectBankList();
                                    });
                            })
                            .catch(() => {
                                this.$message({ type: "info", message: "已取消编辑" });
                                this.saveLoading = false;
                                this.dialogVisible = false;
                                this.getdirectBankList();
                            });
                    }
                });
            },

            // 单个删除
            handleDelete(index, row) {
                console.log("单个删除", row);
                this.$confirm("确定要删除此条内容？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            id: row.id
                        };
                        console.log("单个删除入参", params);
                        deleteOrg(params)
                            .then((res) => {
                                console.log("删除接口", res);
                                if (res.result == true) {
                                    this.$message({ message: "删除成功", type: "success" });
                                    this.loading = false;
                                    this.getdirectBankList(); //刷新当前页
                                } else {
                                    this.$message({ message: res.description, type: "error" });
                                    this.loading = false;
                                    this.getdirectBankList(); //刷新当前页
                                }
                            })
                            .catch((err) => {
                                console.log("删除接口err", err);
                                this.loading = false;
                                this.getdirectBankList(); //刷新当前页
                            });
                    })
                    .catch(() => {
                        this.loading = false;
                        this.getdirectBankList(); //刷新当前页
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },

            //复选框
            checkedPrdCoverTypeChange(value) {
                console.log("产品覆盖类型：", value);
                let arrayStr = [];
                let array = [
                    {
                        coverageId: 1, //理财
                        isCoverage: "0" //
                    },
                    {
                        coverageId: 2, //存款
                        isCoverage: "0" //
                    },
                    {
                        coverageId: 3, //贷款
                        isCoverage: "0" //
                    }
                ];
                this.dataForm.prdCoverList.forEach((item, index) => {
                    if (item == "理财") {
                        arrayStr.push("1");
                        array[0].isCoverage = "1";
                    } else if (item == "存款") {
                        arrayStr.push("2");
                        array[1].isCoverage = "1";
                    } else if (item == "贷款") {
                        arrayStr.push("3");
                        array[2].isCoverage = "1";
                    }
                });
                // console.log('prdCoverType111',arrayStr)
                this.dataForm.prdCoverType = arrayStr.join(",") ? arrayStr.join(",") : null;
                this.dataForm.prdCoverTypes = array; //集合
                console.log("prdCoverType", this.dataForm.prdCoverType); //1,2,3
                console.log("prdCoverTypes", this.dataForm.prdCoverTypes); //1,2,3
            },
            checkedChannelCoverTypeChange(value) {
                console.log("渠道覆盖类型：", value);
                let arrayStr = [];
                let array = [
                    {
                        chlcoverageId: 1, //安卓
                        isCoverage: "0" //
                    },
                    {
                        chlcoverageId: 2, //ios
                        isCoverage: "0" //
                    },
                    {
                        chlcoverageId: 3, //网站
                        isCoverage: "0" //
                    },
                    {
                        chlcoverageId: 4, //其他-h5
                        isCoverage: "0" //
                    }
                ];
                this.dataForm.chlCoverList.forEach((item, index) => {
                    if (item == "安卓市场") {
                        arrayStr.push("1");
                        array[0].isCoverage = "1";
                    } else if (item == "苹果商店") {
                        arrayStr.push("2");
                        array[1].isCoverage = "1";
                    } else if (item == "网站") {
                        arrayStr.push("3");
                        array[2].isCoverage = "1";
                    } else if (item == "其他（H5）") {
                        arrayStr.push("4");
                        array[3].isCoverage = "1";
                    }
                });
                // console.log('channelCoverType111',arrayStr)
                this.dataForm.channelCoverType = arrayStr.join(",") ? arrayStr.join(",") : null;
                this.dataForm.channelCoverTypes = array; //集合
                console.log("channelCoverType", this.dataForm.channelCoverType);
                console.log("channelCoverType", this.dataForm.channelCoverTypes);
            },
            //-------------------------------------------------------------------------------------------------
            //上传图片--------start---------------------------------------
            // 文件超出个数限制时的钩子
            exceedFile(files, fileList) {
                this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
            },
            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
            beforeUploadFile(file) {
                console.log("before upload");
                console.log(file);
                let type = file.name.substring(file.name.lastIndexOf(".") + 1);
                console.log(type);
                const isLt5M = file.size / 1024 / 1024 < 10;
                if (type == "png" || type == "jpeg" || type == "jpg") {
                    if (!isLt5M) {
                        this.$message.error("请上传10M以下的图片");
                        return false;
                    }
                } else {
                    this.$message.warning("请使用 png/jpeg/jpg 类型图片的文件");
                }
            },
            // 文件状态改变时的钩子
            fileChange(file, fileList) {
                this.fileObj = file.raw;
                // console.log('要上传的图片',this.fileObj);
            },
            uploadDirectBankPictureImg1(content) {
                this.uploadDirectBankPictureImg(content, 1);
            },
            uploadDirectBankPictureImg2(content) {
                this.uploadDirectBankPictureImg(content, 2);
            },
            uploadDirectBankPictureImg3(content) {
                this.uploadDirectBankPictureImg(content, 3);
            },
            uploadDirectBankPictureImg4(content) {
                this.uploadDirectBankPictureImg(content, 4);
            },
            uploadDirectBankPictureImg5(content) {
                this.uploadDirectBankPictureImg(content, 5);
            },
            uploadDirectBankPictureImg6(content) {
                this.uploadDirectBankPictureImg(content, 6);
            },
            uploadDirectBankPictureImg(content, type) {
                console.log("file", content);
                console.log("file", this.$refs.upload1);
                const _file = content.file;
                var formData = new FormData();
                formData.append("name", _file);
                console.log("formData", formData);
                forUpload(formData)
                    .then((res) => {
                        console.log(res);
                        if (res.result == true) {
                            if (type == 1) {
                                this.dataForm.logoUrl = res.data[0];
                            } else if (type == 2) {
                                this.dataForm.logoWordUrl = res.data[0];
                            } else if (type == 3) {
                                this.dataForm.logoBackgroundUrl = res.data[0];
                            } else if (type == 4) {
                                this.dataForm.bankcardUrl = res.data[0];
                            } else if (type == 5) {
                                this.dataForm.circleBackgroundUrl = res.data[0];
                            } else if (type == 6) {
                                this.dataForm.homeLogoUrl = res.data[0];
                            }
                            this.$refs["upload" + type].clearFiles(); //清空文件
                        } else {
                            this.$message.error(res.description);
                        }
                    })
                    .catch((err) => {
                        console.log("上传请求失败");
                        // this.$message({ message: '上传请求失败', type: 'error' })
                    });
            },
            //--------------end---------------------------
            //富文本编辑取值
            onEditorChangeArea({ quill, html, text }) {
                if (this.showType == 1) {
                    //插入图片获取的富文本内容
                    console.log("描述富文本html", html);
                    this.dataForm.instructionUrl = html; //介绍
                } else if (this.showType == 2) {
                    //插入视频获取的内容---功能暂未完成
                    console.log("描述富文本text", text);
                    // this.videoLink = text
                    this.dataForm.instructionUrl = html;
                    console.log(this.dataForm.instructionUrl);
                }
            },
            //富文本上传前
            qnUpload(file) {
                console.log("qnUpload", file);
                console.log(this.acceptType);
                let type = file.name.substring(file.name.lastIndexOf(".") + 1); //获取上传的文件名的后缀
                if (this.showType === 1 && this.acceptType == "image/*") {
                    // 如果是点击插入图片
                    const isLt5M = file.size / 1024 / 1024 < 50;
                    if (type == "png" || type == "jpeg" || type == "jpg" || type == "gif") {
                        if (!isLt5M) {
                            this.$message.error("请上传5M以下的图片");
                            return false;
                        }
                    } else {
                        this.$message.warning("请使用 png/jpeg/jpg/gif 类型图片的文件");
                    }
                } else if (this.showType === 2 && this.acceptType == "video/*") {
                    // 如果是点击插入视频
                    const isLt5M = file.size / 1024 / 1024 < 130;
                    if (type == "mp4") {
                        if (!isLt5M) {
                            this.$message.error("请上传不能超过30M");
                            return false;
                        }
                    } else {
                        this.$message.warning("只能上传.mp4的视频");
                    }
                }
            },

            // 富文本上传图片调接口
            quillEditorUploaderImg(content) {
                this.quillUpdateImg = true;
                // 获取富文本组件实例
                const _file = content.file;
                // console.log('_file',_file)
                let formData = new FormData();
                formData.append("name", _file);
                // formData.append(params.uid, _file);
                // formData.append("type", '11');
                forUpload(formData)
                    .then((res) => {
                        console.log(res);
                        if (res.result) {
                            if (this.showType === 1 && this.acceptType == "image/*") {
                                //获取图片地址
                                //获取富文本组件实例
                                let quill = this.$refs.myQuillEditor.quill;
                                // 获取光标所在位置
                                let length = quill.getSelection().index;
                                // 插入图片  res.url为服务器返回的图片地址
                                quill.insertEmbed(length, "image", this.imageUrl + res.data[0]); //this.imageUrl为图片地址前缀域名，res.data[0]为服务器返回的图片的url
                                console.log("quill.insertEmbed", this.imageUrl + res.data[0]);
                                // 调整光标到最后
                                quill.setSelection(length + 1);
                            } else if (this.showType === 2 && this.acceptType == "video/*") {
                                //获取视频地址---功能暂未完成
                                // //获取富文本组件实例
                                // let quill = this.$refs.myQuillEditor.quill
                                // // 获取光标所在位置
                                // let length = quill.getSelection().index;

                                // //隐藏弹框
                                // this.videoUploadTag = false;
                                console.log("this.videoLink", this.imageUrl + res.data[0]);
                                // //插入视频
                                this.videoLink = this.imageUrl + res.data[0];

                                var src = '<iframe frameborder="0" width="100%" height="40%" ' + 'src="' + this.videoLink + '"' + " allowfullscreen></iframe>";
                                this.dataForm.instructionUrl = src;
                                // this.dataForm.instructionUrl = this.imageUrl + res.data[0]
                                console.log(this.dataForm.instructionUrl);

                                // this.dataForm.instructionUrl = 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'

                                // quill.format('video', 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4')
                                // quill.format('video', this.dataForm.instructionUrl) //将链接放到富文本中

                                // quill.insertEmbed(length, 'video', 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4') //this.imageUrl为图片地址前缀域名，res.data[0]为服务器返回的图片的url
                                // quill.insertEmbed(length, 'video', this.imageUrl+res.data[0],Quill.sources.USER) //this.imageUrl为图片地址前缀域名，res.data[0]为服务器返回的图片的url

                                // 调整光标到最后
                                // quill.setSelection(length + 1)
                            }
                        } else {
                            this.$message.error(res.description);
                        }
                        // loading动画消失
                        this.quillUpdateImg = false;
                        this.$refs.myQuillEditor.clearFiles(); //清空文件
                    })
                    .catch((err) => {
                        // loading动画消失
                        this.quillUpdateImg = false;
                        console.log("插入图片失败", err);
                        // this.videoUploadTag = false; //弹窗也消失
                        // this.$message.error('上传失败');
                    });
            },
            //点击添加
            addVideoLink() {
                if (this.videoLink.length == 0) {
                    alert("请输入视频链接或选择本地视频");
                } else {
                    //当编辑器中没有输入文本时，这里获取到的 range 为 null
                    var range = this.$refs.myQuillEditor.quill.getSelection();
                    //视频插入在富文本中的位置
                    var index = 0;
                    if (range == null) {
                        index = 0;
                    } else {
                        index = range.index;
                    }
                    //隐藏弹框
                    this.videoUploadTag = false;

                    //将视频链接插入到当前的富文本当中
                    this.$refs.myQuillEditor.quill.insertEmbed(index, "video", this.dataForm.instructionUrl);
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    /deep/ .el-table__fixed-body-wrapper {
        top: 37px !important;
    }
    .prdSeries {
        padding: 20px;
    }
    // .topBox{
    // 	border-bottom: 1px solid #EBEEF5;
    // }
    // .addBtn{
    // 	margin: 18px 0;
    // }
    /deep/ .addForm {
        // .el-form-item__label-wrap {
        // margin-left: 0px!important;  //新增的所有label 靠左显示
        // }
        .el-table::before {
            left: 0;
            bottom: 0;
            width: 100%;
            height: 0px;
        }
        .el-input {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
        /deep/ .fromItemBlue {
            //左边文字变蓝色
            .el-form-item__label-wrap {
                label.el-form-item__label {
                    color: #3795ff;
                }
            }
        }

        //富文本
        /deep/ .ql-container {
            height: 75% !important;
        }
        /deep/ .ql-toolbar.ql-snow .ql-picker-label {
            border: 1px solid #ccc !important;
        }
        /deep/ .ql-snow .ql-picker-label::before {
            display: inline-block;
            line-height: 22px;
            position: absolute;
            top: 0;
        }
        /deep/ .quill-editor {
            p,
            span {
                line-height: 22px !important;
            }
        }
    }
    /deep/ .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 90px;
        height: 90px;
        line-height: 90px;
        text-align: center;
    }
    /deep/ .avatar-uploader-icon:hover {
        border-color: #409eff;
    }
    .avatar {
        width: 90px;
        height: 90px;
        display: block;
    }
    .el-upload__tip {
        padding-left: 20px;
    }

    /* 解决粘贴后光标会自动弹到文档的初始位置 */
    .editor {
        line-height: normal !important;
        height: 500px;
    }
    .ql-snow .ql-tooltip[data-mode="link"]::before {
        content: "请输入链接地址:";
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-right: 0px;
        content: "保存";
        padding-right: 0px;
    }

    .ql-snow .ql-tooltip[data-mode="video"]::before {
        content: "请输入视频地址:";
    }
    .ql-clipboard {
        position: fixed;
        display: none;
        left: 50%;
        top: 50%;
    }
</style>
