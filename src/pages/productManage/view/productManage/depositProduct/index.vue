<template>
    <!-- 存款产品管理 -->
    <div class="prdSeries">
        <CommonTable :isFluid="false" @height="tableHeight = $event">
            <!--标头查询区-->
            <div slot="search">
                <el-form :inline="true" :size="size" :model="topCheckData" ref="topData">
                    <el-form-item label="机构名称：" prop="orgId">
                        <el-select v-model="topCheckData.orgId" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in allSelectData.orglist" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="存款类型：" prop="depsoitTypeId">
                        <el-select v-model="topCheckData.depsoitTypeId" placeholder="请选择" clearable @change="searchOrglistSelect">
                            <el-option v-for="item in allSelectData.depositTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="存款系列：" prop="prdSeriesId">
                        <el-select v-model="topCheckData.prdSeriesId" placeholder="请选择" clearable @change="depositSeriesListSelect">
                            <el-option v-for="item in allSelectData.depositSeriesList" :key="item.value" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品名称：" prop="prdName">
                        <el-input v-model="topCheckData.prdName" placeholder="请输入产品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="上下架方式：" prop="autoUpper">
                        <el-select v-model="topCheckData.autoUpper" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in allSelectData.autoUpperList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作人：" prop="updId">
                        <!-- <el-input v-model="topCheckData.updId" placeholder="请输入操作人"></el-input> -->
                        <el-select v-model="topCheckData.updId" placeholder="请选择操作人" filterable clearable>
                            <el-option v-for="item in allSelectData.userList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作时间：" prop="updDate">
                        <el-date-picker
                            v-model="topCheckData.updDate"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="updDateSelect">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="action">
                <el-button class="addBtn" style="float: left" :size="size" icon="el-icon-plus" type="primary" @click="handleAdd()">新增</el-button>
                <el-button class="importBtn" style="float: left" :size="size" icon="el-icon-sort-down" type="primary" @click="dialogUploadVisible = true">导入</el-button>
                <el-button class="exportBtn" style="float: left" :size="size" icon="el-icon-sort-up" type="primary" @click="handleExport()">导出</el-button>
                <el-button icon="el-icon-refresh" style="float: right" :size="size" @click="resetForm('topData')">重置</el-button>
                <el-button icon="el-icon-search" style="float: right" :size="size" type="primary" @click="getPrdDepositList('chaxun')">查询</el-button>
            </div>
            <!-- 表格内容栏 -->
            <el-table
                :height="tableHeight"
                size="mini"
                :data="prdDepositList"
                style="width: 100%"
                stripe
                border="true"
                @selection-change="selectionChange"
                v-loading="loading"
                element-loading-text="loading...">
                <!-- 多选type="selection" 取索引type="index"-->
                <!-- <el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column> -->
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>
                <el-table-column prop="prdIndex.id" label="产品ID" width="100" header-align="center" align="center"></el-table-column>
                <el-table-column prop="prdIndex.orgName" label="机构名称" width="120" header-align="center" align="center"></el-table-column>
                <el-table-column prop="depsoitTypeId" label="存款类型" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.depsoitTypeId == 1">活期存款</p>
                        <p v-if="scope.row.depsoitTypeId == 2">智能存款</p>
                        <p v-if="scope.row.depsoitTypeId == 3">结构性存款</p>
                        <p v-if="scope.row.depsoitTypeId == 4">定期存款</p>
                        <p v-if="scope.row.depsoitTypeId == 5">大额存款</p>
                    </template>
                </el-table-column>
                <el-table-column prop="prdIndex.prdSeriesName" label="存款系列" width="100" header-align="center" align="center"></el-table-column>
                <el-table-column prop="prdIndex.prdName" label="产品名称" width="140" header-align="center" align="center"></el-table-column>
                <el-table-column prop="prdIndex.autoUpper" label="上下架方式" width="100" header-align="center" align="center">
                    <template slot-scope="scope">
                        <p v-if="scope.row.prdIndex.autoUpper == 1" :size="size">自动上下架</p>
                        <p v-if="scope.row.prdIndex.autoUpper == 2" :size="size">手动上下架</p>
                    </template>
                </el-table-column>
                <el-table-column prop="updName" label="操作人" header-align="center" align="center"></el-table-column>
                <el-table-column prop="updTime" label="操作时间" width="150" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" width="230" fixed="right" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row, scope.$index)">修改</el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button size="mini" type="text" @click="handleClone(scope.row, scope.$index)">克隆产品</el-button>
                        <el-button size="mini" type="text" class="copy" @click="handleCopyLink(scope.row, scope.$index)">复制链接</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页栏-->
            <div slot="footer">
                <!-- <el-button :size="size" type="danger" style="float:left;" @click="handleBatchDelete()">批量删除</el-button> -->
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
        <!-- 导入文件弹窗 -->
        <el-dialog title="导入文件" class="uploadDialog" :visible.sync="dialogUploadVisible" :destroy-on-close="true" :close-on-click-modal="false">
            <el-upload
                class="upload-demo"
                ref="upload"
                :limit="limitNum"
                :auto-upload="false"
                accept=".xls,.xlsx"
                action="#"
                :before-upload="beforeUploadFile"
                :on-change="fileChange"
                :on-exceed="exceedFile"
                :file-list="fileList"
                :on-remove="remove">
                <el-button size="small" type="primary">点击上传</el-button>
                <span class="el-upload__tip" slot="tip">只能上传xlsx/xls文件，且不超过10M</span>
            </el-upload>
            <div class="uploadBTtn">
                <el-button size="small" type="success" @click="uploadFile()" :loading="saveLoading">立即导入</el-button>
                <el-button size="small" @click="dialogUploadVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹框 -->
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="80%" :visible.sync="dialogVisible" :before-close="closeDialog">
            <el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size" label-position="left" class="addForm">
                <el-form-item label="存款类型：" prop="depsoitTypeId">
                    <el-select v-model="dataForm.depsoitTypeId" placeholder="请选择" clearable @change="depositTypeListSelect" :disabled="dataForm.id">
                        <el-option v-for="item in allSelectData.depositTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存款类型别名：" prop="depositCategory">
                    <el-input v-model="dataForm.depositCategory" placeholder="请输入存款类型别名"></el-input>
                </el-form-item>
                <el-form-item label="产品区域：" prop="prdIndex.nationalType">
                    <el-select v-model="dataForm.prdIndex.nationalType" placeholder="请选择" clearable @change="nationalTypeListSelect">
                        <el-option v-for="item in allSelectData.nationalTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构名称：" prop="prdIndex.orgId">
                    <!-- filterable开启可搜索模式  -->
                    <el-select v-model="dataForm.prdIndex.orgId" placeholder="选择产品区域后，再选择机构名称" filterable clearable @change="addOrglistSelect">
                        <el-option v-for="item in allSelectData.addOrglist" :key="item.ID" :label="item.orgName" :value="item.orgId"> </el-option>
                    </el-select>
                    <!-- <span class="tipText">选择产品区域后，再选择机构名称</span> -->
                </el-form-item>
                <el-form-item label="币种：" prop="prdIndex.currency">
                    <el-select v-model="dataForm.prdIndex.currency" placeholder="选择产品区域后，再选择币种" clearable>
                        <el-option v-for="item in allSelectData.currencyList" :key="item.currencyCode" :label="item.currencyName" :value="item.currencyCode"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="存款系列：" prop="prdIndex.prdSeriesId">
                    <el-select v-model="dataForm.prdIndex.prdSeriesId" placeholder="请选择类型和机构名称后，再选择系列" clearable @change="depositSeriesListSelect">
                        <el-option v-for="item in allSelectData.depositSeriesList" :key="item.value" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品名称：" prop="prdIndex.prdName">
                    <el-input v-model="dataForm.prdIndex.prdName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item label="产品名称别名：" prop="prdNameAlias">
                    <el-input v-model="dataForm.prdIndex.prdNameAlias" placeholder="请输入产品名称别名"></el-input>
                </el-form-item>
                <el-form-item label="是否在‘行情’展示：" prop="prdIndex.hqPrd">
                    <el-select v-model="dataForm.prdIndex.hqPrd" clearable>
                        <el-option v-for="item in allSelectData.hqPrdList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 利率：单独展示--活期1、结构性3 -->
                <template v-if="dataForm.depsoitTypeId == 1 || dataForm.depsoitTypeId == 3" prop="depositRateList[0]">
                    <!-- 结构行存款的利率：最高利率用rate,利率用低利率lowRate -->
                    <template v-if="dataForm.depsoitTypeId == 3">
                        <el-form-item label="利率（%）：" prop="depositRateList[0].lowRate" :rules="[{ required: true, message: '请输入利率', trigger: 'blur' }]">
                            <el-input v-model="dataForm.depositRateList[0].lowRate" type="number" min="0" placeholder="请输入利率"></el-input>
                        </el-form-item>
                        <el-form-item label="最高利率：" prop="rate">
                            <el-input v-model="dataForm.depositRateList[0].rate" type="number" min="0" placeholder="请输入最高利率"></el-input>
                        </el-form-item>
                    </template>
                    <!-- 活期的利率，用rate -->
                    <el-form-item v-if="dataForm.depsoitTypeId == 1" label="利率（%）：" prop="depositRateList[0].rate" :rules="[{ required: true, message: '请输入利率', trigger: 'blur' }]">
                        <!-- :rules="[{ required: true,validator: validateLilv, trigger: 'blur' }]"-->
                        <el-input v-model="dataForm.depositRateList[0].rate" type="number" min="0" placeholder="请输入利率"></el-input>
                    </el-form-item>
                    <el-form-item label="利率名称：" prop="depositRateName">
                        <el-input v-model="dataForm.depositRateName" :disabled="disabled"></el-input>
                        <!-- <span class="tipText">根据产品大类、产品类型的配置反显</span> -->
                    </el-form-item>
                    <el-form-item label="利率备注：" prop="depositRateList[0].rateRemarks">
                        <el-input v-model="dataForm.depositRateList[0].rateRemarks" placeholder="请输入利率备注"></el-input>
                    </el-form-item>
                    <!-- 结构性有2个字段：期限，锁定期： -->
                    <template v-if="dataForm.depsoitTypeId == 3">
                        <el-form-item label="期限：" prop="depositRateList[0].lengthTime" :rules="[{ required: true, message: '请输入期限', trigger: 'blur' }]">
                            <el-input type="number" min="0" v-model="dataForm.depositRateList[0].lengthTime" placeholder="请输入期限" style="width: 20%"></el-input>
                            <!-- 期限单位 -->
                            <el-select v-model="dataForm.depositRateList[0].rateUnit" placeholder="请选择" clearable style="width: 15%">
                                <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="lockupPeriod" label="锁定期：">
                            <el-input type="number" min="0" v-model="dataForm.depositRateList[0].lockupPeriod" placeholder="请输入锁定期" style="width: 20%"></el-input>
                            <!-- 锁定期单位 -->
                            <el-select v-model="dataForm.depositRateList[0].lockupPeriodUnit" placeholder="请选择" clearable style="width: 15%">
                                <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </template>

                <el-form-item label="产品属性补充标签：" prop="prdIndex.defineLabelSuffix">
                    <el-input v-model="dataForm.prdIndex.defineLabelSuffix" placeholder="请输入产品属性补充标签"></el-input>
                </el-form-item>
                <!-- 用户分群筛选,未加字段  该字段先隐藏-->
                <!-- <el-form-item label="用户分群筛选：" prop="prdIndex.isCheck">
				<el-select v-model="dataForm.prdIndex.isCheck" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.isCheckList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item> -->
                <el-form-item label="是否在首页排行榜展示：" prop="prdIndex.isHomepageRank" v-if="dataForm.depsoitTypeId == 1 || dataForm.depsoitTypeId == 3">
                    <el-select v-model="dataForm.prdIndex.isHomepageRank" placeholder="请选择">
                        <el-option v-for="item in allSelectData.isCheckList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="首页排行榜一句话推荐：" prop="oneWordRecommend" v-if="dataForm.prdIndex.isHomepageRank == 1">
                    <el-input v-model="dataForm.depositRateList[0].oneWordRecommend" placeholder="请输入首页排行榜一句话推荐"></el-input>
                </el-form-item>

                <!-- 利率集合：定期、智能、大额 -->
                <template v-if="dataForm.depsoitTypeId != 1 && dataForm.depsoitTypeId != 3">
                    <el-form-item class="addRate" label="利率：" prop="depositRateList" :rules="[{ required: true, message: '请输入利率333', trigger: 'blur' }]">
                        <el-button :size="size" type="primary" @click="handleAddRate()">新增利率</el-button>
                        <!-- 利率table -->
                        <el-table :data="dataForm.depositRateList" style="width: 100%; border-top: 1px solid #dcdfe6; margin-top: 18px">
                            <el-table-column prop="lengthTime" label="期限" width="60px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input type="number" min="0" v-model="scope.row.lengthTime" placeholder="期限时长"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rateUnit" :label="'期限\n单位'" width="65px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.rateUnit" clearable>
                                        <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rate" :label="'利率\n(%)'" width="80px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.rate" type="number" min="0" placeholder="利率"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rateRemarks" :label="'利率\n备注'" width="70px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.rateRemarks" placeholder="利率备注"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="lockupPeriod" label="锁定期" width="60px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input type="number" min="0" v-model="scope.row.lockupPeriod" placeholder="锁定期"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="lockupPeriodUnit" :label="'锁定\n期单位'" width="65px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.lockupPeriodUnit" clearable>
                                        <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="isCheck" :label="'是否\n榜单展示'" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.isCheck" clearable>
                                        <el-option v-for="item in allSelectData.isCheckList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="homepageLockupPeriodStatu" :label="'榜单锁\n定期展示'" width="80px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.homepageLockupPeriodStatu" clearable>
                                        <el-option v-for="item in allSelectData.homepageLockupPeriodStatuList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="prdCheck" label="产品展示" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.prdCheck" clearable>
                                        <el-option v-for="item in allSelectData.prdCheckList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="homepageRateTxt" :label="'榜单\n期限文案'" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.homepageRateTxt" placeholder="榜单期限文案"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rateTxt" :label="'首页\n利率文案'" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.rateTxt" placeholder="首页利率文案"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="oneWordRecommend" :label="'首页排行榜\n一句话推荐'" header-align="center" align="center" v-if="dataForm.depositRateList[0].isCheck == 1">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.oneWordRecommend" placeholder="排行榜推荐文案"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rateTxtDetail" :label="'产品详情页\n利率文案'" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.rateTxtDetail" placeholder="产品详情页利率文案"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rateTxtBank" :label="'银行\n利率文案'" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.rateTxtBank" placeholder="银行利率文案"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="dataForm.depositRateList.length > 1" prop="depositRateList" label="操作" header-align="center" align="center" width="60px">
                                <template slot-scope="scope">
                                    <el-button :size="size" type="text" @click="handleDeleteRate(scope.row, scope.index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </template>

                <!--定期/智能/结构性/大额： 到期是否转存、支取方式、剩余额度； 定期：没有剩余额度 -->
                <template v-if="dataForm.depsoitTypeId != 1">
                    <el-form-item label="到期是否转存：" prop="expireTransfer">
                        <el-select v-model="dataForm.expireTransfer" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.expireTransferList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- 智能/结构性/大额: 剩余额度 -->
                    <template v-if="dataForm.depsoitTypeId != 4">
                        <el-form-item label="剩余额度：" prop="holdingLimiat">
                            <el-select v-model="dataForm.holdingLimiat" placeholder="请选择" clearable>
                                <el-option v-for="item in allSelectData.holdingLimiatList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <!-- 定期/智能/结构性/大额： 到期是否转存、支取方式 -->
                    <el-form-item label="支取方式：" prop="drawTime">
                        <el-select v-model="dataForm.drawTime" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.drawTimeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <!-- 结构性存款：起售日期、截止日期、起息日、结息日 -->
                <template v-if="dataForm.depsoitTypeId == 3">
                    <el-form-item label="起售日期：" prop="sellStartDate">
                        <el-date-picker v-model="dataForm.sellStartDate" type="date" placeholder="请输入起售日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="截止日期：" prop="sellEndDate">
                        <el-date-picker v-model="dataForm.sellEndDate" type="date" placeholder="请输入截止日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="起息日：" prop="intereatStartDate">
                        <el-date-picker v-model="dataForm.intereatStartDate" type="date" placeholder="请输入起息日" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结息日：" prop="intereatEndDate">
                        <el-date-picker v-model="dataForm.intereatEndDate" type="date" placeholder="请输入结息日" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </template>

                <el-form-item label="起购金额（最大/元）：" prop="prdIndex.maxAmount">
                    <el-input type="number" min="0" v-model="dataForm.prdIndex.maxAmount" placeholder="起购金额（最大/元）"></el-input>
                </el-form-item>
                <el-form-item label="起购金额（最小/元）：" prop="prdIndex.minAmount">
                    <el-input type="number" min="0" v-model="dataForm.prdIndex.minAmount" placeholder="请输入起购金额（最小/元）"></el-input>
                </el-form-item>
                <el-form-item label="递增金额（元）：" prop="increAmount">
                    <el-input type="number" min="0" v-model="dataForm.increAmount" placeholder="请输入递增金额（元）"></el-input>
                </el-form-item>
                <el-form-item label="付息方式：" prop="payInterestType">
                    <el-input v-model="dataForm.payInterestType" placeholder="请输入付息方式"></el-input>
                </el-form-item>
                <el-form-item label="监管属性：" prop="isSupervision">
                    <el-select v-model="dataForm.isSupervision" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.isSupervisionList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否签约：" prop="prdIndex.isPrdContract">
                    <el-select v-model="dataForm.prdIndex.isPrdContract" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.isPrdContractList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 大额：利息计算天数（天）、买方折算年化利率、发行开始时间、发行结束时间、发行量、是否可转让、是否可赎回 -->
                <template v-if="dataForm.depsoitTypeId == 5">
                    <el-form-item label="利息计算天数（天）：" prop="interestDays">
                        <el-input v-model="dataForm.interestDays" placeholder="请输入利息计算天数（天）"></el-input>
                    </el-form-item>
                    <el-form-item label="买方折算年化利率：" prop="annualizedRate">
                        <el-input v-model="dataForm.annualizedRate" placeholder="请输入买方折算年化利率"></el-input>
                    </el-form-item>
                    <el-form-item label="发行开始时间：" prop="publishStartTime">
                        <el-date-picker
                            v-model="dataForm.publishStartTime"
                            type="date"
                            placeholder="请选择发行开始时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="发行结束时间：" prop="publishEndTime">
                        <el-date-picker v-model="dataForm.publishEndTime" type="date" placeholder="请选择发行结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="发行量：" prop="publishAmount">
                        <el-input v-model="dataForm.publishAmount" placeholder="请输入发行量"></el-input>
                    </el-form-item>
                    <el-form-item label="是否可转让：" prop="transferFlag">
                        <el-select v-model="dataForm.transferFlag" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.transferFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否可赎回：" prop="buyBackFlag">
                        <el-select v-model="dataForm.buyBackFlag" placeholder="请选择" clearable>
                            <el-option v-for="item in allSelectData.buyBackFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </template>

                <el-form-item label="产品描述：" prop="depictTextArea">
                    <!-- 富文本组件 -->
                    <MyQuillEditor id="editor1" @onEditorChange="onEditorChangeDeal" :detailContent="dataForm.depictTextArea" @quillEditorUploaderImgSon="quillEditorUploaderImg"> </MyQuillEditor>
                    <!-- <el-card style="height: 450px;" v-loading="quillUpdateImg">
					<el-upload
						:model='imageUrl + dataForm.depictTextArea'
						ref="upload1"
						class="avatar-uploader1"
						accept=".png"
						action="#"
						limit=""
						:http-request="quillEditorUploaderImgCeshi"
						:before-upload="beforeUpload"
						:show-file-list="false"
						>
						<img v-if="dataForm.depictTextArea" :src="imageUrl + dataForm.depictTextArea" class="avatar"
						@click="quillEditorUploaderImgCeshi('upLoad1')">
					</el-upload>
					<quill-editor v-model="dataForm.depictTextArea" ref="myQuillEditor1" style="height: 400px;" 
					:options="editorOption" @change="onEditorChangeArea($event)">
					</quill-editor> 
				</el-card>-->
                </el-form-item>
                <el-form-item label="支取规则：" prop="prdIndex.dealRuleText">
                    <!-- 富文本组件 -->
                    <MyQuillEditor id="editor2" @onEditorChange="onEditorChangeDeal" :detailContent="dataForm.prdIndex.dealRuleText" @quillEditorUploaderImgSon="quillEditorUploaderImg">
                    </MyQuillEditor>
                    <!-- <el-card style="height: 450px;">
					<el-upload
						:model='imageUrl + dataForm.prdIndex.dealRuleText'
						ref="upload2"
						class="avatar-uploader2"
						accept=".png"
						action="#"
						limit=""
						:http-request="quillEditorUploaderImg"
						:before-upload="beforeUpload"
						:show-file-list="false"
						>
						<img v-if="dataForm.prdIndex.dealRuleText" :src="imageUrl + dataForm.prdIndex.dealRuleText" class="avatar"
						@click="quillEditorUploaderImg('upLoad2')">
					</el-upload>
					<quill-editor v-model="dataForm.prdIndex.dealRuleText" ref="myQuillEditor2" style="height: 400px;" 
					:options="editorOption" @change="onEditorChangeDeal($event)">
					</quill-editor> 
				</el-card>-->
                </el-form-item>
                <el-form-item label="计息规则：" prop="prdIndex.rateRuleText">
                    <!-- 富文本组件 -->
                    <MyQuillEditor id="editor3" @onEditorChange="onEditorChangeDeal" :detailContent="dataForm.prdIndex.rateRuleText" @quillEditorUploaderImgSon="quillEditorUploaderImg">
                    </MyQuillEditor>
                    <!-- <el-card style="height: 540px;">
					<el-upload
						:model='imageUrl + dataForm.prdIndex.rateRuleText'
						ref="upload3"
						class="avatar-uploader"
						accept=".png"
						action="#"
						limit=""
						:http-request="quillEditorUploaderImgRate"
						:before-upload="beforeUpload"
						:show-file-list="false"
						>
					</el-upload>
					<quill-editor v-model="dataForm.prdIndex.rateRuleText" ref="myQuillEditor3" style="height: 500px;" 
					:options="editorOption" @change="onEditorChangeRate($event)">
					</quill-editor>
				</el-card> -->
                </el-form-item>
                <!-- 大额：存入规则、转让规则、转出规则 -->
                <template v-if="dataForm.depsoitTypeId == 5">
                    <el-form-item label="存入规则：" prop="depositRule">
                        <!-- 富文本组件 -->
                        <MyQuillEditor id="editor4" @onEditorChange="onEditorChangeDeal" :detailContent="dataForm.depositRule" @quillEditorUploaderImgSon="quillEditorUploaderImg"> </MyQuillEditor>
                        <!-- <el-card style="height: 450px;">
						<el-upload
							:model='imageUrl + dataForm.depositRule'
							ref="upload4"
							class="avatar-uploader"
							accept=".png"
							action="#"
							limit=""
							:http-request="quillEditorUploaderImg4"
							:before-upload="beforeUpload"
							:show-file-list="false"
							>
						</el-upload>
						<quill-editor v-model="dataForm.depositRule" ref="myQuillEditor4" style="height: 400px;" 
						:options="editorOption" @change="onEditorChangeDeposit($event)">
						</quill-editor>
					</el-card> -->
                    </el-form-item>
                    <el-form-item label="转让规则：" prop="makeOverRule">
                        <!-- 富文本组件 -->
                        <MyQuillEditor id="editor5" @onEditorChange="onEditorChangeDeal" :detailContent="dataForm.makeOverRule" @quillEditorUploaderImgSon="quillEditorUploaderImg"> </MyQuillEditor>
                        <!-- <el-card style="height: 540px;">
						<el-upload
							:model='imageUrl + dataForm.makeOverRule'
							ref="upload5"
							class="avatar-uploader"
							accept=".png"
							action="#"
							limit=""
							:http-request="quillEditorUploaderImg5"
							:before-upload="beforeUpload"
							:show-file-list="false"
							>
						</el-upload>
						<quill-editor v-model="dataForm.makeOverRule" ref="myQuillEditor5" style="height: 500px;" 
						:options="editorOption" @change="onEditorChangeMakeOver($event)">
						</quill-editor>
					</el-card> -->
                    </el-form-item>
                    <el-form-item label="转出规则：" prop="turnOutRule">
                        <!-- 富文本组件 -->
                        <MyQuillEditor id="editor6" @onEditorChange="onEditorChangeDeal" :detailContent="dataForm.turnOutRule" @quillEditorUploaderImgSon="quillEditorUploaderImg"> </MyQuillEditor>
                        <!-- <el-card style="height: 450px;">
						<el-upload
							:model='imageUrl + dataForm.turnOutRule'
							ref="upload6"
							class="avatar-uploader"
							accept=".png"
							action="#"
							limit=""
							:http-request="quillEditorUploaderImg6"
							:before-upload="beforeUpload"
							:show-file-list="false"
							>
						</el-upload>
						<quill-editor v-model="dataForm.turnOutRule" ref="myQuillEditor6" style="height: 400px;" 
						:options="editorOption" @change="onEditorChangeTurnOut($event)">
						</quill-editor>
					</el-card> -->
                    </el-form-item>
                </template>
                <el-form-item label="上下架方式：" prop="prdIndex.autoUpper">
                    <el-select v-model="dataForm.prdIndex.autoUpper" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.autoUpperList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否面签：" prop="prdIndex.isInterview">
                    <el-select v-model="dataForm.prdIndex.isInterview" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.isInterviewList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示银行提示页：" prop="prdIndex.bankTipsPage">
                    <el-select v-model="dataForm.prdIndex.bankTipsPage" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.bankTipsPageList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品H5链接：" prop="prdIndex.prdH5Url">
                    <el-input v-model="dataForm.prdIndex.prdH5Url" placeholder="请输入产品H5链接"></el-input>
                </el-form-item>
                <el-form-item label="银行对接方式：" prop="prdIndex.bankDockType">
                    <el-select v-model="dataForm.prdIndex.bankDockType" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.bankDockTypeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自定义跳转链接：" prop="prdIndex.defineUrl">
                    <el-input v-model="dataForm.prdIndex.defineUrl" placeholder="请输入自定义跳转链接"></el-input>
                </el-form-item>
                <el-form-item label="版本标识：" prop="prdIndex.ctVer">
                    <el-input type="number" min="0" v-model="dataForm.prdIndex.ctVer" placeholder="请输入版本标识"></el-input>
                </el-form-item>
                <el-form-item label="openAPI产品是否同步：" prop="prdIndex.isSyncFlag">
                    <el-select v-model="dataForm.prdIndex.isSyncFlag" placeholder="请选择" clearable>
                        <el-option v-for="item in allSelectData.isSyncFlagList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="同一产品标识：" prop="prdIndex.identicalPrdTag">
                    <el-input v-model="dataForm.prdIndex.identicalPrdTag" placeholder="请输入同一产品标识"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
                <el-button :size="size" type="primary" v-if="!dataForm.id" @click.native="submitFormAddSave('dataForm')" :loading="saveLoading">保存</el-button>
                <el-button :size="size" type="primary" v-else @click.native="submitFormEditSave('dataForm')" :loading="saveLoading">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // 接口函数依次：初始化下拉框数据，币种列表/机构列表，存款系列，存款列表数据，请求利率名称，新增保存，修改保存，单个删除，克隆产品，复制链接，存款导入，存款导出
    import {
        forDepositPage,
        getCurrencyAndOrg,
        getSeriesByPrdType,
        forDepositList,
        getPrdTypeByTypeCode,
        getPrdSeriesById,
        addDeposit,
        updateDeposit,
        deleteDeposit,
        cloneDeposit,
        getLongLink,
        importDeposit,
        exportDeposit,
        forUpload
    } from "../../../apis/index";
    import config from "../../../config/config.index.js";
    import CommonTable from "@common/finsuit-components/CommonTable";
    import MyQuillEditor from "../../../components/VueQuillEditor";
    // import {quillEditor,Quill} from 'vue-quill-editor'
    // import 'quill/dist/quill.core.css'
    // import 'quill/dist/quill.snow.css'
    // import 'quill/dist/quill.bubble.css'
    // import '../../../assets/css/font.css'
    // //富文本工具
    // const toolbarOptions = [
    //     ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
    //     ['blockquote', 'code-block'], // 引用  代码块
    //     [{ 'header': 1 }, { 'header': 2 }], // 1、2 级标题
    //     [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 有序、无序列表
    //     [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
    //     [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
    //     // [{'direction': 'rtl'}],                         // 文本方向
    //     [{ 'size': ['10px',false,'14px','16px','18px','20px','22px','24px','26px','28px','32px'] }], // 字体大小
    //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 标题
    //     [{ 'color': [] }, { 'background': [] }], // 字体颜色、字体背景颜色
    //     [{ 'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
    //     '宋体', '黑体'] }], // 字体种类
    //     [{ 'align': [] }], // 对齐方式
    //     ['clean'], // 清除文本格式
    //     // ['link', 'image', 'video'] // 链接、图片、视频
    //     ['link', 'image'] // 链接、图片
    // ];
    // // 自定义字体大小
    // let Size = Quill.import('attributors/style/size')
    // Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px']
    // Quill.register(Size, true)

    // // 自定义字体类型
    // var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif',
    // '宋体', '黑体'
    // ]
    // var Font = Quill.import('formats/font')
    // Font.whitelist = fonts
    // Quill.register(Font, true)
    export default {
        name: "depositProduct",
        components: {
            // quillEditor,
            MyQuillEditor,
            CommonTable
        },
        data() {
            //自定义校验
            // var validateLilv = (rule, value, callback) => {
            // 	if (value === '') {
            // 		callback(new Error("请输入利率222"));
            // 	} else {
            // 		callback();
            // 	}
            // };
            return {
                tableHeight: 0,
                imageUrl: "", //图片前面有域名的部分地址
                size: "small",
                topCheckData: {
                    //顶部搜索选择的工具内容
                    orgId: "", //机构名称
                    depsoitTypeId: "", //存款类型id
                    prdSeriesId: "", //存款系列id
                    prdName: "", //产品名称
                    autoUpper: "", //上下架方式
                    updId: "", //操作人
                    updDate: "", //操作时间数组
                    updDateTimeStart: "", //操作开始时间
                    updDateTimeEnd: "" //操作结束时间
                },
                dialogUploadVisible: false, //是否显示导入的上传文件的弹框
                limitNum: 1, // 上传excell时，同时允许上传的最大数
                fileObj: {}, // 单个要上传的文件
                fileList: [], //要上传的文件列表数组--多个文件
                unitList: [
                    {
                        name: "天",
                        value: 0
                    },
                    {
                        name: "个月",
                        value: 1
                    },
                    {
                        name: "年",
                        value: 2
                    }
                ], //期限单位，锁定期单位
                allSelectData: {
                    autoUpperList: [], //上下架方式列表
                    bankDockTypeList: [], //银行对接方式列表
                    bankTipsPageList: [], //是否显示银行提示页列表
                    buyBackFlagList: [], //是否可以赎回
                    depositTypeList: [], //存款类型列表
                    drawTimeList: [], //支取方式
                    expireTransferList: [], //到期是否转存
                    holdingLimiatList: [], //剩余额度列表
                    isCheckList: [], //是否首页排行榜展示列表
                    isInterviewList: [], //是否面签列表
                    isPrdContractList: [], //是否签约列表
                    isSupervisionList: [], //监管属性列表
                    isSyncFlagList: [], //openAPI产品是否同步列表
                    orglist: [], //机构列表
                    addOrglist: [], //新增里的机构下拉框--自定义
                    transferFlagList: [], //是否可以转让列表
                    homepageLockupPeriodStatuList: [], //榜单锁定期展示
                    prdCheckList: [], //产品展示
                    hqPrdList: [], //行情展示
                    nationalTypeList: [], //产品区域地区合集
                    currencyList: [], //币种合集--自定义
                    depositSeriesList: [], //存款系列--自定义
                    userList: [] //操作人集合
                }, //所有下拉框数组合集
                totalSize: 0, //总数
                pageRequest: {
                    //请求存款产品列表参数
                    pageNum: 0, //当前页数
                    pageSize: 10 //条数
                },
                loading: false, //请求存款产品时loading
                prdDepositList: [], //请求回来的存款产品列表数据list
                saveLoading: false, //保存时按钮loading
                // 新增和编辑
                dialogVisible: false, //是否展示新增编辑弹框
                DEPOSIT_TYPE_ID: "", //1：活期，2：智能，3：结构性，4：定期，5：大额存单
                dataForm: {
                    //新增弹框数据
                    id: "", //主键id
                    prdIndexId: "", //产品id
                    prdIndex: {
                        id: "", //产品id
                        orgId: "", //机构id
                        orgName: "", //机构名称
                        prdName: "", //产品名称
                        prdNameAlias: "", //产品别名
                        nationalType: "", //产品区域
                        currency: "", //币种
                        minAmount: "", //最小起购金额
                        maxAmount: "", //最大起购金额
                        isInterview: "", //是否面签
                        identicalPrdTag: "", //同一产品标识
                        isPrdContract: "", //是否签约
                        autoUpper: "", //上下架方式
                        defineLabelSuffix: "", //产品属性补充标签
                        bankTipsPage: "", //显示银行提示页
                        prdH5Url: "", //产品H5链接
                        bankDockType: "", //银行对接方式
                        ctVer: "", //版本标识
                        defineUrl: "", //自定义跳转链接
                        rateRuleText: "", //计息规则
                        dealRuleText: "", //支取规则
                        isSyncFlag: "", //openAPI产品是否同步
                        hqPrd: "", //是否行情展示
                        isHomepageRank: "", //是否在首页排行榜展示
                        prdSeriesId: "" //产品系列ID3.0
                    },
                    depositSeriesId: "", //产品系列ID
                    depositCategory: "", //存款类型别名
                    depsoitTypeId: "", //存款类型id //1：活期，2：定期，3：智能，4：结构性，5：大额存单
                    depictTextArea: "", //产品描述
                    isSupervision: Number, //监管属性
                    holdingLimiat: "", //剩余额度
                    sellStartDate: "", //起售日期
                    sellEndDate: "", //截止日期
                    intereatStartDate: "", //起息日
                    intereatEndDate: "", //结息日
                    payInterestType: "", //付息方式
                    expireTransfer: "", //到期是否转存
                    depositRule: "", //存入规则
                    makeOverRule: "", //转让规则
                    turnOutRule: "", //转出规则
                    interestDays: "", //利息计算天数
                    annualizedRate: "", //买方折算年化利率
                    publishStartTime: "", //发行开始时间
                    publishEndTime: "", //发行结束时间
                    publishAmount: "", //发行量
                    transferFlag: "", //是否可以转让
                    buyBackFlag: "", //是否可以赎回
                    depositRateName: "", //利率名称
                    increAmount: "", //递增金额
                    depositRateList: [
                        {
                            id: "",
                            rate: "", //其他存款的利率，和结构型存款的最高利率
                            lowRate: "", //机构性存款的利率，
                            lengthTime: "", //期限时长
                            rateUnit: "", //期限单位
                            rateRemarks: "", //利率备注
                            isCheck: "", //是否在榜单排行榜展示
                            oneWordRecommend: "", //排行榜一句话推荐
                            lockupPeriod: "", //锁定期
                            lockupPeriodUnit: "", //锁定期单位
                            homepageLockupPeriodStatu: "", //榜单锁定期展示 0:不显示 1:展示
                            prdCheck: "", //产品展示 1:是 2:否
                            homepageRateTxt: "", //榜单期限文案
                            rateTxt: "", //首页利率文案
                            rateTxtDetail: "", //产品详情页利率文案
                            rateTxtBank: "" //银行利率文案
                        }
                    ]
                },
                selectlistRow: [],
                addFormRate: {},
                formRules: {
                    //弹框校验规则
                    depsoitTypeId: [{ required: true, message: "请选择存款类型", trigger: "change" }],
                    prdIndex: {
                        nationalType: [{ required: true, message: "请选择产品区域", trigger: "change" }],
                        orgId: [{ required: true, message: "请选择机构名称", trigger: "change" }],
                        currency: [{ required: true, message: "请选择币种", trigger: "change" }],
                        prdName: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
                        isInterview: [{ required: true, message: "请选择是否面签", trigger: "change" }]
                    },
                    expireTransfer: [{ required: true, message: "请选择到期是否转存", trigger: "change" }],
                    holdingLimiat: [{ required: true, message: "请选择剩余额度", trigger: "change" }],
                    increAmount: [{ required: true, message: "请输入递增金额", trigger: "blur" }],
                    drawTime: [{ required: true, message: "请选择支取方式", trigger: "change" }],
                    isSupervision: [{ required: true, message: "请选择监管属性", trigger: "change" }]
                },
                //删除
                selections: [], //删除选中项
                rateName: "" //类别的利率名称
                //富文本
                //quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
                // serverUrl: '',  // 这里写你要上传的图片服务器地址
                // header: {token: sessionStorage.token},  // 有的图片服务器要求请求头需要有token之类的参数，写在这里
                // editorOption:{  //如果在本页直接写富文本，那么有多少富文本就需要写多少个editorOption工具，并传给对应的option
                // 	placeholder: '请输入内容...',
                // 	theme: 'snow',  // or 'bubble'
                // 	modules: {
                // 		toolbar: {
                // 			container: toolbarOptions, //工具栏
                // 			handlers: {
                // 				'image': function (value) {
                // 					if (value) {
                // 						// 触发input框选择图片文件
                // 						document.querySelector('.avatar-uploader1 input').click()
                // 					} else {
                // 						this.quill.format('image', false);
                // 					}
                // 				},
                // 				'link': function (value) { // 添加链接
                // 					if (value) {
                // 						var href = prompt('请输入url')
                // 						this.quill.format('link', href)
                // 					} else {
                // 						this.quill.format('link', false)
                // 					}
                // 				},
                // 			}
                // 		}
                // 	}
                // },
            };
        },
        watch: {
            dialogUploadVisible(newVal) {
                this.dialogUploadVisible = newVal;
                console.log("newVal", newVal);
                if (newVal) {
                    this.fileObj = {}; //清空data中数据
                }
            }
        },
        mounted() {
            //图片初始化地址：
            this.imageUrl = config.baseUrlHost + "/finsuitImgDisplay/show?path=";
            console.log("图片初始地址-imageUrl", this.imageUrl);
            this.getPrdDepositSelect(); //初始化下拉框数据
            this.getPrdDepositList(); //存款产品管理列表
        },
        methods: {
            //进入存款产品列表初始化参--所有下拉框数据
            getPrdDepositSelect() {
                let params = "";
                forDepositPage(params)
                    .then((res) => {
                        console.log("获取所有下拉框数据", res);
                        if (res.code == 0) {
                            //存款类型列表
                            this.allSelectData.depositTypeList = res.data.depositTypeList;
                            //监管属性列表
                            this.allSelectData.isSupervisionList = res.data.isSupervisionList;
                            //是否首页排行榜展示列表
                            this.allSelectData.isCheckList = res.data.isCheckList;
                            //银行对接方式列表
                            this.allSelectData.bankDockTypeList = res.data.bankDockTypeList;
                            //支取方式列表
                            this.allSelectData.drawTimeList = res.data.drawTimeList;
                            //剩余额度列表
                            this.allSelectData.holdingLimiatList = res.data.holdingLimiatList;
                            //是否是否签约列表
                            this.allSelectData.isPrdContractList = res.data.isPrdContractList;
                            //是否显示银行提示页列表
                            this.allSelectData.bankTipsPageList = res.data.bankTipsPageList;
                            //机构列表
                            this.allSelectData.orglist = res.data.orglist;
                            //上下架方式列表
                            this.allSelectData.autoUpperList = res.data.autoUpperList;
                            //是否可以转让列表
                            this.allSelectData.transferFlagList = res.data.transferFlagList;
                            //是否面签列表
                            this.allSelectData.isInterviewList = res.data.isInterviewList;
                            //openAPI产品是否同步列表
                            this.allSelectData.isSyncFlagList = res.data.isSyncFlagList;
                            //到期是否转存
                            this.allSelectData.expireTransferList = res.data.expireTransferList;
                            //是否可以赎回
                            this.allSelectData.buyBackFlagList = res.data.buyBackFlagList;
                            //产品区域--地区编码集合
                            this.allSelectData.nationalTypeList = res.data.nationalTypeList;
                            //榜单锁定期展示
                            this.allSelectData.homepageLockupPeriodStatuList = res.data.homepageLockupPeriodStatuList;
                            //产品展示
                            this.allSelectData.prdCheckList = res.data.prdCheckList;
                            //行情展示
                            this.allSelectData.hqPrdList = res.data.hqPrdList;
                            //操作人集合
                            this.allSelectData.userList = res.data.userList;
                        } else {
                            console.log("下拉框数据失败");
                        }
                    })
                    .catch((err) => {
                        console.log("获取所有下拉框数据err", err);
                    });
            },
            // 获取存款产品列表数据
            getPrdDepositList: function (type) {
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
                    orgId: this.topCheckData.orgId, //机构名称id
                    depsoitTypeId: this.topCheckData.depsoitTypeId, //产品子类型编码-产品类型
                    prdSeriesId: this.topCheckData.prdSeriesId, //存款系列id
                    prdName: this.topCheckData.prdName, //产品id
                    autoUpper: this.topCheckData.autoUpper, //产品上下架方式
                    updId: this.topCheckData.updId, //操作人
                    updDateTimeStart: this.topCheckData.updDateTimeStart, //操作开始时间
                    updDateTimeEnd: this.topCheckData.updDateTimeEnd //操作结束时间
                };
                console.log("存款产品数据入参", params);
                forDepositList(params)
                    .then((res) => {
                        console.log("获取存款产品数据", res);
                        this.prdDepositList = res.data.data;
                        this.totalSize = res.data.totalCount; //总条数
                        // this.totalSize = res.data.totalPage; //总页数
                        this.loading = false;
                    })
                    .catch((err) => {
                        console.log("获取存款产品数据err", err);
                        this.loading = false;
                    });
            },
            // 点击页数--分页刷新
            refreshPageRequest: function (val) {
                console.log(`当前页: ${val}`);
                this.pageRequest.pageNum = val;
                this.getPrdDepositList(); //调产品系列列表接口
            },
            // 点击条数--分页刷新
            handleSizeChange(val) {
                console.log(`当前条数: ${val}`);
                this.pageRequest.pageSize = val;
                this.getPrdDepositList(); //调产品系列列表接口
            },
            //标头查询区-点击存款后，请求存款系列
            searchOrglistSelect() {
                this.getSeries(this.topCheckData.depsoitTypeId, "4");
            },
            //点击操作时间
            updDateSelect(date) {
                console.log("当前日期数组-->", date);
                this.topCheckData.updDateTimeStart = date[0];
                this.topCheckData.updDateTimeEnd = date[1];
            },
            //重置
            resetForm(topData) {
                console.log("重置");
                this.$refs.topData.resetFields();
                this.topCheckData.updDateTimeStart = "";
                this.topCheckData.updDateTimeEnd = "";
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
            //存款类型---选中值发生变化时触发---获取下拉框的lable
            depositTypeListSelect(val, id, depositRateName) {
                console.log("当前value--code", val, id, depositRateName);
                let obj = {};
                obj = this.allSelectData.depositTypeList.find(function (item) {
                    return item.value === val;
                });
                console.log("当前存款类型", obj.name);
                // this.dataForm.depsoitTypeName = obj.name

                //先判断编辑里的利率名称是否存在，存在就展示编辑里的，不存在则需要请求类别的利率名称
                if (id && depositRateName != "") {
                    console.log("编辑里的利率名称", depositRateName);
                    this.dataForm.depositRateName = depositRateName; //编辑里修改后的利率名称
                } else {
                    //根据产品大类，产品小类类型---请求类别继承的利率名称
                    let params = {
                        parentTypeCode: "4", // 存款产品大类编码,
                        subtypeTypeCode: val //产品小类编码
                    };
                    console.log("请求类别继承的利率名称-->入参", params);
                    getPrdTypeByTypeCode(params)
                        .then((res) => {
                            console.log("类别继承的利率名称res", res);
                            this.rateName = res.data.rateName; //类别的利率名称
                            this.dataForm.depositRateName = res.data.rateName; //类别的利率名称
                            // console.log(this.dataForm.depositRateName)
                        })
                        .catch((err) => {
                            console.log("类别继承的利率名称err", err);
                        });
                }
                //请求存款系列
                this.getSeries(val, "4", id);
            },

            //根据存款类型和机构ID--请求存款系列
            getSeries(SUBTYPE_CODE, PRDTYPE_CODE, id) {
                this.topCheckData.prdSeriesId = ""; //查询时每次请求系列之前，先将存款系列置空
                if (!id) {
                    this.dataForm.prdIndex.prdSeriesId = ""; //新增时每次请求系列之前，先将存款系列置空
                }
                let params = {
                    SUBTYPE_CODE: SUBTYPE_CODE,
                    PRDTYPE_CODE: PRDTYPE_CODE
                };
                console.log("请求存款系列-->入参", params);
                getSeriesByPrdType(params)
                    .then((res) => {
                        console.log("存款系列res", res);
                        this.allSelectData.depositSeriesList = res.data;
                    })
                    .catch((err) => {
                        console.log("存款系列err", err);
                    });
            },

            //选择系列名称
            depositSeriesListSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.depositSeriesList.find(function (item) {
                    return item.id === val;
                });
                console.log(obj.name);
                // this.dataForm.prdIndex.nationalType = obj.name

                //根据系列名称--请求系列里的利率名称和上下架方式
                let params = {
                    id: val, //系列id
                    prdType: "4" //产品大类id
                };
                if (val != "") {
                    //系列id不为空的时候才能请求该接口
                    console.log("请求系列继承的利率名称-->入参", params);
                    getPrdSeriesById(params)
                        .then((res) => {
                            console.log("系列继承的利率名称res", res);
                            if (res.data.RATE_NAME != "") {
                                this.dataForm.prdIndex.autoUpper = res.data.AUTO_UPPER; // 系列的上下架方式
                                this.dataForm.depositRateName = res.data.RATE_NAME; //系列的利率名称
                                this.dataForm.depositRateList[0].oneWordRecommend = res.data.HOEM_PAGE_WORD; //系列的首页推荐一句话
                                this.dataForm.prdIndex.defineLabelSuffix = res.data.ATTR_ADDED_LABEL; //系列的产品属性补充标签
                            } else {
                                this.dataForm.depositRateName = this.rateName; //类别的利率名称
                            }
                        })
                        .catch((err) => {
                            console.log("系列继承的利率名称err", err);
                        });
                } else {
                    this.dataForm.depositRateName = this.rateName; //类别的利率名称
                }
            },

            // 产品区域
            nationalTypeListSelect(val, id) {
                //每次更换产品区域之前，重新填写机构和币种，所以先置空
                if (!id) {
                    //编辑回显时，不置空
                    this.dataForm.prdIndex.orgId = "";
                    this.dataForm.prdIndex.currency = "";
                }
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.nationalTypeList.find(function (item) {
                    return item.value === val;
                });
                console.log("产品区域name", obj.name);
                // this.dataForm.prdIndex.nationalType = obj.name

                //根据产品区域类型--请求币种和机构
                let params = {
                    nationalType: val
                };
                console.log("请求币种-->入参", params);
                getCurrencyAndOrg(params)
                    .then((res) => {
                        console.log("币种res", res);
                        this.allSelectData.currencyList = res.data.currencyList;
                        this.allSelectData.addOrglist = res.data.orgList;
                        // console.log(this.allSelectData.addOrglist) //机构List
                        // console.log(this.allSelectData.currencyList) //币种List
                    })
                    .catch((err) => {
                        console.log("币种err", err);
                    });
            },
            //机构名称
            addOrglistSelect(val) {
                console.log("当前value--code", val);
                let obj = {};
                obj = this.allSelectData.addOrglist.find(function (item) {
                    return item.orgId === val;
                });
                console.log("机构name", obj.orgName);
                this.dataForm.prdIndex.orgName = obj.orgName;
            },
            // 显示新增界面弹窗
            handleAdd: function () {
                console.log("新增");
                this.dialogVisible = true;
                this.dataForm = {
                    prdIndex: {
                        orgId: "",
                        orgName: "", //机构名称
                        prdName: "", //产品名称
                        prdNameAlias: "", //产品别名
                        nationalType: "", //产品区域
                        currency: "", //币种
                        minAmount: "", //最小起购金额
                        maxAmount: "", //最大起购金额
                        isInterview: "", //是否面签
                        identicalPrdTag: "", //同一产品标识
                        isPrdContract: "", //是否签约
                        autoUpper: "", //上下架方式
                        defineLabelSuffix: "", //产品属性补充标签
                        bankTipsPage: "", //显示银行提示页
                        prdH5Url: "", //产品H5链接
                        bankDockType: "", //银行对接方式
                        ctVer: "", //版本标识
                        defineUrl: "", //自定义跳转链接
                        rateRuleText: "", //计息规则
                        dealRuleText: "", //支取规则
                        isSyncFlag: 1, //openAPI产品是否同步
                        hqPrd: "", //是否行情展示
                        isHomepageRank: "", //是否在首页排行榜展示
                        prdSeriesId: "" //产品系列id 3.0
                    },
                    depositSeriesId: "", //产品系列ID
                    depositCategory: "", //存款类型别名
                    depsoitTypeId: "", //存款类别id
                    depictTextArea: "", //产品描述
                    isSupervision: "", //监管属性
                    holdingLimiat: "", //剩余额度
                    sellStartDate: "", //起售日期
                    sellEndDate: "", //截止日期
                    intereatStartDate: "", //起息日
                    intereatEndDate: "", //结息日
                    payInterestType: "", //付息方式
                    expireTransfer: "", //到期是否转存
                    depositRule: "", //存入规则
                    makeOverRule: "", //转让规则
                    turnOutRule: "", //转出规则
                    interestDays: "", //利息计算天数
                    annualizedRate: "", //买方折算年化利率
                    publishStartTime: "", //发行开始时间
                    publishEndTime: "", //发行结束时间
                    publishAmount: "", //发行量
                    transferFlag: "", //是否可以转让
                    buyBackFlag: "", //是否可以赎回
                    depositRateName: "", //利率名称
                    increAmount: "", //递增金额
                    depositRateList: [
                        {
                            id: "",
                            rate: "", //其他存款的利率，和结构型存款的最高利率
                            lowRate: "", //机构性存款的利率，
                            lengthTime: "", //期限时长
                            rateUnit: "", //期限单位
                            rateRemarks: "", //利率备注
                            isCheck: "", //是否在榜单排行榜展示
                            oneWordRecommend: "", //排行榜一句话推荐
                            lockupPeriod: "", //锁定期
                            lockupPeriodUnit: "", //锁定期单位
                            homepageLockupPeriodStatu: "", //榜单锁定期展示 0:不显示 1:展示
                            prdCheck: "", //产品展示 1:是 2:否
                            homepageRateTxt: "", //榜单期限文案
                            rateTxt: "", //首页利率文案
                            rateTxtDetail: "", //产品详情页利率文案
                            rateTxtBank: "" //银行利率文案
                        }
                    ]
                };
                Object.assign(this.dataForm);
            },
            //-------------------------弹窗中利率集合---------------------------------------
            //利率新增行
            handleAddRate() {
                console.log("增加利率");
                this.dataForm.depositRateList.push({
                    id: "",
                    rate: "", //其他存款的利率，和结构型存款的最高利率
                    lowRate: "", //机构性存款的利率，
                    lengthTime: "", //时长
                    rateUnit: "", //期限单位
                    rateRemarks: "", //利率备注
                    isCheck: "", //是否在榜单排行榜展示
                    oneWordRecommend: "", //排行榜一句话推荐
                    lockupPeriod: "", //锁定期
                    lockupPeriodUnit: "", //锁定期单位
                    homepageLockupPeriodStatu: "", //榜单锁定期展示 0:不显示 1:展示
                    prdCheck: "", //产品展示 1:是 2:否
                    homepageRateTxt: "", //榜单期限文案
                    rateTxt: "", //首页利率文案
                    rateTxtDetail: "", //产品详情页利率文案
                    rateTxtBank: "" //银行利率文案
                });
                console.log("增加利率数组-->", this.dataForm.depositRateList);
            },
            //利率删除选中行
            handleDeleteRate(row) {
                console.log("删除利率", row);
                var index = this.dataForm.depositRateList.indexOf(row);
                console.log(index);
                if (index !== -1) {
                    this.dataForm.depositRateList.splice(index, 1);
                }

                // this.selectlistRow.push(row)
                // let indexDel = 0
                // for (let i = 0; i < this.selectlistRow.length; i++) {
                // 	// 获取选中行的索引的方法
                // 	// 遍历表格中depositRateList数据和选中的val数据，比较它们的id（每一行唯一的数据）,相等则输出选中行的索引
                // 	this.selectlistRow.forEach((val, index) => {
                // 		this.dataForm.depositRateList.forEach((v, i) => {
                // 			console.log(44444,val.id)
                // 			console.log(55555,v.id)
                // 			if (val.id === v.id) {
                // 				//判断至少保留一行不被删除
                // 				if(this.dataForm.depositRateList.length > 1){
                // 					// i 为选中的索引
                // 					this.dataForm.depositRateList.splice(i, 1)
                // 				}
                // 			}
                // 		})
                // 	})
                // }
            },
            //-------------------------弹窗中利率集合---------------------------------------

            // 显示编辑界面弹框
            handleEdit: function (row) {
                console.log("编辑", row);
                console.log("编辑里的利率名称", row.depositRateName);
                this.dialogVisible = true;
                Object.assign(this.dataForm, row);

                let nationalType = row.prdIndex.nationalType;
                console.log("nationalType", nationalType);
                //回显
                this.nationalTypeListSelect(nationalType, row.id); //先根据产品区域请求机构
                this.depositTypeListSelect(row.depsoitTypeId, row.id, row.depositRateName); //根据类型请求利率名称，和系列列表
                //编辑里的利率名称，用修改后的
            },
            //回显,先后顺序

            //点击保存按钮，必填项有未填写内容时，弹框提示，并把光标定为到第一个未录入的输入框
            fromRequired() {
                //获取当前必录的校验词并弹框提示输入具体必录项
                setTimeout(() => {
                    console.log(document.getElementsByClassName("el-form-item__error"));
                    if (document.getElementsByClassName("el-form-item__error").length > 0) {
                        this.$notify.error({
                            title: "提示",
                            message: document.getElementsByClassName("el-form-item__error")[0].innerText
                        });
                    }
                }, 100);
                //获取未录入的第一个必录项的输入框并定位到此处
                setTimeout(() => {
                    console.log(document.getElementsByClassName("is-error is-required"));
                    var isError = document.getElementsByClassName("is-error is-required");
                    if (isError.length > 0) {
                        isError[0].querySelector("input").focus();
                    }
                }, 100);
            },
            //新增保存提交
            submitFormAddSave: function (dataForm) {
                console.log("新增保存");
                // this.fromRequired(); //调用必填项的校验方法
                //最终提交前弹框提示
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm("确认提交吗？", "提示", {})
                            .then(() => {
                                this.saveLoading = true;
                                let params = Object.assign({}, this.dataForm);
                                console.log("新增保存入参", params);
                                addDeposit(params)
                                    .then((res) => {
                                        console.log("新增接口", res);
                                        if (res.code == 0) {
                                            this.$message({ message: "操作成功", type: "success" });
                                            this.saveLoading = false;
                                            this.dialogVisible = false;
                                            this.getPrdDepositList();
                                            this.$refs.dataForm.resetFields(); //清空数据
                                            location.reload(); //刷新页面--富文本也会清空
                                        } else {
                                            this.$message({ message: res.msg, type: "error" });
                                            this.saveLoading = false;
                                            this.dialogVisible = false;
                                            this.getPrdDepositList();
                                            this.$refs.dataForm.resetFields(); //清空数据
                                            location.reload(); //刷新页面--富文本也会清空
                                        }
                                    })
                                    .catch((err) => {
                                        this.saveLoading = false;
                                        console.log("新增接口err", err);
                                    });
                            })
                            .catch(() => {
                                this.saveLoading = false;
                                this.$message({ type: "info", message: "已取消新增" });
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
                                let params = Object.assign({}, this.dataForm);
                                console.log("编辑保存入参", params);
                                //请求编辑接口
                                updateDeposit(params)
                                    .then((res) => {
                                        console.log("修改接口", res);
                                        this.saveLoading = false;
                                        this.$message({ message: "操作成功", type: "success" });
                                        this.dialogVisible = false;
                                        this.getPrdDepositList();
                                    })
                                    .catch((err) => {
                                        this.dialogVisible = false;
                                        console.log("编辑接口err", err);
                                    });
                            })
                            .catch(() => {
                                this.dialogVisible = false;
                                this.$message({ type: "info", message: "已取消编辑" });
                            });
                    }
                });
            },

            // 选中当前行切换,值为单个对象 @current-change="handleCurrentChange"
            // handleCurrentChange: function (val) {
            // 	console.log('选中项 CurrentChange',val)
            // },
            // 单个删除
            handleDelete(index, row) {
                console.log("单个删除", row);
                this.$confirm("此操作将删除该条管理员数据, 是否继续？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let params = {
                            prdIndexId: row.prdIndex.id
                        };
                        console.log("单个删除入参", params);
                        deleteDeposit(params).then((data) => {
                            console.log("删除接口", data);
                            this.$message({ message: "删除成功", type: "success" });
                            this.getPrdDepositList(); //刷新当前页
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            // 选中多选框切换,值为数组
            selectionChange(selections) {
                this.selections = selections;
                console.log("选中项", this.selections);
            },
            // 批量删除---目前未做该功能-----
            handleBatchDelete: function () {
                console.log("批量删除");
                this.$confirm("确认删除选中记录吗？", "提示", { type: "warning" })
                    .then(() => {
                        this.loading = true;
                        let ids = [];
                        this.selections.map((item) => {
                            ids.push(item.id);
                        });
                        let params = {
                            IDS: ids.toString()
                        };
                        console.log("删除params", params);
                        getRoleDeletes(params).then((data) => {
                            console.log("批量删除接口", data);
                            this.$message({ message: "删除成功", type: "success" });
                            this.getPrdDepositList(); //刷新当前页
                            this.loading = false;
                        });
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消删除" });
                    });
            },
            //------------------------------------------------------------
            //克隆产品按钮
            handleClone(row, index) {
                console.log("克隆产品", row);
                this.saveLoading = true;
                let params = row;
                console.log("克隆产品入参-->", params);
                cloneDeposit(params)
                    .then((res) => {
                        console.log("克隆产品", res);
                        this.saveLoading = false;
                        this.$message({ message: "操作成功", type: "success" });
                        this.dialogVisible = false;
                        this.getPrdDepositList();
                    })
                    .catch((err) => {
                        console.log("克隆产品按钮err", err);
                    });
            },
            //复制链接按钮
            handleCopyLink(row) {
                let params = {
                    prdIndexId: row.prdIndex.id
                };
                getLongLink(params)
                    .then((res) => {
                        console.log("复制链接", res);
                        let Url2 = res.data;
                        let oInput = document.createElement("input");
                        oInput.value = Url2;
                        document.body.appendChild(oInput);
                        oInput.select(); // 选择对象
                        document.execCommand("Copy"); // 执行浏览器复制命令
                        oInput.className = "oInput";
                        oInput.style.display = "none";
                        this.$message({ message: "复制链接成功", type: "success" });
                    })
                    .catch((err) => {
                        console.log("复制链接err", err);
                    });
            },
            //导入--上传文件start-------------------------
            // 文件超出个数限制时的钩子
            exceedFile(files, fileList) {
                this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
            },
            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
            beforeUploadFile(file) {
                console.log("before upload");
                console.log(file);
                let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
                let size = file.size / 1024 / 1024;
                if (extension !== "xls" || extension !== "xlsx") {
                    this.$message.warning("只能上传后缀是.xlsx/.xls的文件");
                }
                if (size > 10) {
                    this.$message.warning("文件大小不得超过10M");
                }
            },
            // 文件状态改变时的钩子
            fileChange(file, fileList) {
                this.fileObj = file.raw;
                console.log("要上传的文件", this.fileObj);
            },
            //导入调接口
            uploadFile() {
                if (Object.keys(this.fileObj).length === 0) {
                    this.$message.warning("请上传文件");
                } else {
                    console.log(this.fileObj);
                    let form = new FormData();
                    form.append("importFile", this.fileObj);
                    //调导入接口
                    importDeposit(form)
                        .then((res) => {
                            console.log("导入请求成功", res);
                            this.saveLoading = false;
                            this.$message({ message: res.data ? res.data : "存款导入成功", type: "success" });
                            this.dialogUploadVisible = false;
                            this.$refs.upload.clearFiles(); //清空文件
                            this.fileObj = {}; //清空data中数据
                            this.getPrdDepositList();
                        })
                        .catch((err) => {
                            console.log("存款导入err", err);
                        });
                }
            },
            remove() {
                this.fileObj = {}; //清空data中数据
            },
            //--------------end---------------------------
            //导出调接口
            handleExport() {
                let params = "";
                exportDeposit(params)
                    .then((res) => {
                        console.log("导出", res);
                        this.$message({ message: res.data ? res.data : "存款导出成功", type: "success" });
                    })
                    .catch((err) => {
                        console.log("导出err", err);
                    });
            },

            //------------富文本编辑--用组件的时候取值------------------------------------------
            //子组件传来的值，调用改方法
            onEditorChangeDeal(html, id) {
                console.log(id);
                // console.log('富文本父组件内容',html)
                if (id == "editor1") {
                    this.dataForm.depictTextArea = html; //产品描述
                } else if (id == "editor2") {
                    this.dataForm.prdIndex.dealRuleText = html; //支取规则
                } else if (id == "editor3") {
                    this.dataForm.prdIndex.rateRuleText = html; //计息规则
                } else if (id == "editor4") {
                    this.dataForm.depositRule = html; //存入规则
                } else if (id == "editor5") {
                    this.dataForm.makeOverRule = html; //转让规则
                } else if (id == "editor6") {
                    this.dataForm.turnOutRule = html; //转出规则
                }
            }

            //==========================================================================================================
            //-----------富文本--在本页面直接写富文本，不用组件时--获取各个富文本的值
            // //产品描述富文本取值
            // onEditorChangeArea({quill,html,text}){
            // 	// console.log('描述富文本',html)
            // 	this.dataForm.depictTextArea = html  //产品描述
            // },
            // //支取规则富文本取值
            // onEditorChangeDeal({quill,html,text}){
            // 	// console.log('计息富文本',html)
            // 	this.dataForm.prdIndex.dealRuleText = html  //支取规则
            // },
            // //计息规则富文本取值
            // onEditorChangeRate({quill,html,text}){
            // 	// console.log('支取富文本',html)
            // 	this.dataForm.prdIndex.rateRuleText = html  //计息规则
            // },
            // //存入规则富文本取值
            // onEditorChangeDeposit({quill,html,text}){
            // 	// console.log('支取富文本',html)
            // 	this.dataForm.depositRule = html  //存入规则
            // },
            // //转让规则富文本取值
            // onEditorChangeMakeOver({quill,html,text}){
            // 	// console.log('支取富文本',html)
            // 	this.dataForm.makeOverRule = html  //转让规则
            // },
            // //转出规则富文本取值
            // onEditorChangeTurnOut({quill,html,text}){
            // 	// console.log('支取富文本',html)
            // 	this.dataForm.turnOutRule = html  //计息规则
            // },

            //-----------------富文本--在本页面直接写富文本，不用组件时---调上传图片接口-----------------------------
            // quillEditorUploaderImgArea(content,id){
            // 	console.log('1111',id)
            // 	this.quillEditorUploaderImg(content,1)
            // },
            // quillEditorUploaderImgDeal(content,id){
            // 	console.log('2222',id)
            // 	this.quillEditorUploaderImg(content,2)
            // },
            // quillEditorUploaderImgRate(content){
            // 	console.log('3333')
            // 	this.quillEditorUploaderImg(content,3)
            // },
            // quillEditorUploaderImg4(content){
            // 	console.log('4444')
            // 	this.quillEditorUploaderImg(content,4)
            // },
            // quillEditorUploaderImg5(content){
            // 	console.log('5555')
            // 	this.quillEditorUploaderImg(content,5)
            // },
            // quillEditorUploaderImg6(content){
            // 	console.log('6666')
            // 	this.quillEditorUploaderImg(content,6)
            // },
            // //请求接口
            // quillEditorUploaderImg(content,type,ref) {
            // 	console.log('父组件--》id',type)
            //     // this.quillUpdateImg = true
            // 	console.log('file',content.file)
            // 	// 获取富文本组件实例
            // 	const _file = content.file;
            // 	let formData = new FormData();
            // 	formData.append('name', _file);
            // 	console.log('formData',formData)
            // 	forUpload(formData).then((res) => {
            // 		console.log('富文本上传图片返回值-->',res)
            // 		if (res.result == true) {
            // 			//判断type，获取不同富文本组件实例
            // 			console.log('type',type)
            // 			console.log('ref',ref)
            // 			// let quill = this.$refs['myQuillEditor'+type].quill; //如果是在页面直接用富文本，则用这个type判断不通的ref
            // 			let quill = ref.quill; //如果接口是通过自组件传给父/组件，则直接用传来的ref即可
            // 			// 获取光标所在位置
            // 			let length = quill.getSelection().index;
            // 			console.log('length',length)
            // 			// 插入图片  res.data[0]为服务器返回的图片地址
            // 			quill.insertEmbed(length, 'image', this.imageUrl+res.data[0]) //this.imageUrl为图片地址前缀域名，res.data[0]为服务器返回的图片的url
            // 			// 调整光标到最后
            // 			quill.setSelection(length + 1)
            // 		} else {
            // 			this.$message.error(res.description);
            // 		}
            // 		// loading动画消失
            // 		this.quillUpdateImg = false
            // 		this.$refs['myQuillEditor'+type].resetFields()  //清空文件
            // 	}).catch((err) => {
            // 		 // loading动画消失
            // 		this.quillUpdateImg = false
            // 		console.log('上传失败',err)
            // 		// this.$message({ message: '插入图片失败', type: 'error' })
            // 	})
            // },
            //-------------------------------------------------------------------
        }
    };
</script>

<style lang="less" scoped>
    // /deep/ .el-table__fixed-body-wrapper {
    // 	// padding-top: 37px !important;
    // 	top: 59px !important;
    // }
    .prdSeries {
        padding: 20px;
    }
    // .topBox{
    // 	border-bottom: 1px solid #EBEEF5;
    // }
    // .addBtn{
    // 	margin: 18px 0;
    // }
    .addForm {
        .el-form-item__label-wrap {
            margin-left: 0px !important; //新增的所有label 靠左显示
        }
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
        .tipText {
            padding-left: 12px;
            color: #999;
        }

        /deep/ .el-form-item.addRate.el-form-item--small {
            /deep/ .el-form-item__label-wrap,
            .el-form-item__content {
                //利率集合整体给margin
                margin-left: 108px !important;
            }
            /deep/ .el-table .cell,
            .el-table th div {
                // padding-left: 5px!important;
                // padding-right: 5px!important;
                padding: 0 3px !important;
                white-space: pre-line; //给table中的lable换行
            }
            /deep/ .el-table td,
            .el-table th {
                padding: 5px 0 !important;
            }
            /deep/ .el-table td,
            .el-table th.is-leaf {
                border-bottom: 0 !important;
            }
            .el-input,
            .el-select {
                width: 100%;
                /deep/ .el-input__inner {
                    -webkit-appearance: none;
                    background-color: #fff;
                    background-image: none;
                    border-radius: 2px;
                    border: 1px solid #dcdfe6;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    color: #606266;
                    display: inline-block;
                    font-size: inherit;
                    height: 30px;
                    line-height: 30px;
                    outline: 0;
                    padding: 0 5px;
                    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                    width: 100%;
                }
            }
            .el-table thead {
                color: #909399;
                font-weight: 400;
            }
        }
        //富文本
        /deep/ .ql-container {
            height: 80% !important;
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
    }
    .uploadDialog {
        /deep/ .el-dialog__body {
            padding: 30px 20px 60px;
            // .el-upload-dragger{
            // 	width: 632px;
            // }
            .el-upload__tip {
                padding-left: 20px;
            }
            .uploadBTtn {
                float: right;
            }
        }
    }
</style>
