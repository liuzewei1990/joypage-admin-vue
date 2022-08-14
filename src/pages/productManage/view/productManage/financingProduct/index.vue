<template>
<!-- 理财产品管理 -->
  <div class="prdSeries">
	<CommonTable :isFluid="false" @height="tableHeight=$event">
	<!--标头查询区-->
	<div slot="search">
		<el-form :inline="true" :size="size" :model="topCheckData" ref='topData'>
			<el-form-item label="机构名称：" prop="orgId">
				<el-select v-model="topCheckData.orgId" placeholder="请选择" filterable clearable>
					<el-option v-for="item in allSelectData.orglist"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="理财类型：" prop="prdTypeId">
				<el-select v-model="topCheckData.prdTypeId" placeholder="请选择" clearable
				@change='searchOrglistSelect'>
					<el-option v-for="item in allSelectData.financeTypeList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="理财系列：" prop="prdSeriesId">
				<el-select v-model="topCheckData.prdSeriesId" placeholder="请选择" clearable
				@change='depositSeriesListSelect'>
					<el-option v-for="item in allSelectData.prdSeriesList"
					:key="item.value" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品名称：" prop="prdName">
				<el-input v-model="topCheckData.prdName" placeholder="请输入产品名称"></el-input>
			</el-form-item>
			<el-form-item label="上下架方式：" prop="autoUpper">
				<el-select v-model="topCheckData.autoUpper" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.autoUpperList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
    <div slot="action">
		<el-button class="addBtn" style="float:left;" :size="size" icon="el-icon-plus" type="primary"  @click="handleAdd()">新增</el-button>
		<el-button class="importBtn" style="float:left;" :size="size" icon="el-icon-sort-down" type="primary" 
			@click="handleImport(2)">理财导入</el-button>
		<el-button class="exportBtn" :size="size" icon="el-icon-sort-up" type="primary" plain @click="handleExport(2)">理财导出</el-button>
		<el-button class="importBtn" style="float:left;" :size="size" icon="el-icon-sort-down" type="primary" 
			@click="handleImport(5)">保险理财导入</el-button>
		<el-button class="exportBtn" :size="size" icon="el-icon-sort-up" type="primary" plain @click="handleExport(5)">保险理财导出</el-button>
		<el-button class="importBtn" style="float:left;" :size="size" icon="el-icon-sort-down" type="primary" 
			@click="handleImport(6)">投融资导入</el-button>
		<el-button class="exportBtn" style="float:left;" :size="size" icon="el-icon-sort-up" type="primary" plain @click="handleExport(6)">投融资导出</el-button>
		<el-button icon="el-icon-refresh" style="float:right;" :size="size" @click="resetForm('topData')">重置</el-button>
		<el-button icon="el-icon-search" style="float:right;" :size="size" type="primary" @click="getFinancingProductList('chaxun')">查询</el-button>
	</div>	
		<!-- 表格内容栏 -->
		<el-table :height="tableHeight" size="mini" :data="financingProductList" style="width: 100%" stripe border="true"
			@selection-change="selectionChange" v-loading="loading" element-loading-text="loading...">
			<!-- <el-table-column type="selection" width="50" header-align="center" align="center"></el-table-column> -->
			<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>
			<el-table-column prop="prdIndexDTO.id"  label="产品ID" width="100" header-align="center" align="center"></el-table-column>
			<el-table-column prop="prdIndexDTO.orgName" label="机构名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="prdIndexDTO.prdTypeId" label="理财类型" header-align="center" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.prdIndexDTO.prdTypeId == 2">理财产品</p>
					<p v-if="scope.row.prdIndexDTO.prdTypeId == 5">保险理财</p>
					<p v-if="scope.row.prdIndexDTO.prdTypeId == 6">投融资产品</p>
				</template>
			</el-table-column>
			<el-table-column prop="prdIndexDTO.prdSeriesName" label="理财系列" header-align="center" align="center"></el-table-column>
			<el-table-column prop="prdIndexDTO.prdName" label="产品名称" width="180" header-align="center" align="center"></el-table-column>
			<el-table-column prop="prdIndexDTO.autoUpper" label="上下架方式" header-align="center" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.prdIndexDTO.autoUpper==1" :size="size">自动上下架</p>
					<p v-if="scope.row.prdIndexDTO.autoUpper==2" :size="size">手动上下架</p>
				</template>
			</el-table-column>
            <el-table-column prop="riskLevel" label="风险等级" width="80" header-align="center" align="center">
				<template slot-scope="scope">
					<p v-if="scope.row.riskLevel == -1">暂无</p>
					<p v-if="scope.row.riskLevel == 1">低</p>
					<p v-if="scope.row.riskLevel == 2">中低</p>
					<p v-if="scope.row.riskLevel == 3">中</p>
					<p v-if="scope.row.riskLevel == 4">中高</p>
					<p v-if="scope.row.riskLevel == 5">高</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="240" fixed="right" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="handleEdit(scope.row,scope.$index)">修改</el-button>
					<el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					<el-button size="mini" type="text" @click="handleClone(scope.row,scope.$index)">克隆产品</el-button>
					<el-button size="mini" type="text" @click="handleCopyLink(scope.row,scope.$index)">复制链接</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页栏-->
		<div slot="footer">
			<!-- <el-button :size="size" type="danger" style="float:left;" @click="handleBatchDelete()">批量删除</el-button> -->
			<el-pagination layout="total, sizes, prev, pager, next, jumper" style="float:right;"
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
	<el-dialog :title="dialogUploadTypeTitle +'导入文件'" class="uploadDialog" :visible.sync="dialogUploadVisible" :destroy-on-close="true" :close-on-click-modal="false">
		<el-upload 
			class="upload-demo"
			ref="upload"
			:limit='limitNum'
			:auto-upload="false"
			accept=".xls,.xlsx"
			action="#"
			:before-upload="beforeUploadFile"
			:on-change="fileChange"
			:on-exceed="exceedFile"
			:file-list="fileList"
			:on-remove="remove">
			<el-button size="small" type="primary">点击上传</el-button>
			<!-- <i class="el-icon-upload"></i> -->
			<!-- <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> -->
			<span class="el-upload__tip" slot="tip">只能上传xlsx/xls文件，且不超过10M</span>
		</el-upload>
		<div class="uploadBTtn">
			<el-button size="small" type="success" @click="uploadFile(2)" v-if="dialogUploadTypeTitle == '理财'" :loading="saveLoading">立即导入理财文件</el-button>
			<el-button size="small" type="success" @click="uploadFile(5)" v-if="dialogUploadTypeTitle == '保险理财'" :loading="saveLoading">立即导入保险理财文件</el-button>
			<el-button size="small" type="success" @click="uploadFile(6)" v-if="dialogUploadTypeTitle == '投融资'" :loading="saveLoading">立即导入投融资文件</el-button>
			<el-button size="small" @click="dialogUploadVisible = false">取消</el-button>
		</div>
	</el-dialog>
	<!-- 新增弹框 -->
	<el-dialog :title="!dataForm.id ? '新增' : '修改'" width="80%" :visible.sync="dialogVisible" :before-close="closeDialog">
		<el-form :model="dataForm" label-width="auto" :rules="formRules" ref="dataForm" :size="size"
			label-position="left" class="addForm">
			<el-form-item label="理财类型：" prop="prdIndexDTO.prdTypeId">
				<el-select v-model="dataForm.prdIndexDTO.prdTypeId" placeholder="请选择" clearable
				@change='financeTypeListSelect' :disabled="dataForm.id">
					<el-option v-for="item in allSelectData.financeTypeList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品区域：" prop="prdIndexDTO.nationalType">
				<el-select v-model="dataForm.prdIndexDTO.nationalType" placeholder="请选择" clearable
				@change='nationalTypeListSelect'>
					<el-option v-for="item in allSelectData.nationalTypeList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="机构名称：" prop="prdIndexDTO.orgId">
				<el-select v-model="dataForm.prdIndexDTO.orgId" placeholder="选择产品区域后，再选择机构名称" filterable clearable
				@change='addOrglistSelect'>
					<el-option v-for="item in allSelectData.addOrglist"
					:key="item.ID" :label="item.orgName" :value="item.orgId">
					</el-option>
				</el-select>
				<!-- <span class="tipText">选择产品区域后，再选择机构名称</span> -->
			</el-form-item>
			<el-form-item label="币种：" prop="prdIndexDTO.currency">
				<el-select v-model="dataForm.prdIndexDTO.currency" placeholder="选择产品区域后，再选择币种" clearable>
					<el-option v-for="item in allSelectData.currencyList"
					:key="item.currencyCode" :label="item.currencyName" :value="item.currencyCode">
					</el-option>
				</el-select>
				<!-- <span class="tipText">选择产品区域后，再选择币种</span> -->
			</el-form-item>
			<el-form-item label="理财类型别名：" prop="prdTypeAlias">
				<el-input v-model="dataForm.prdTypeAlias" placeholder="请输入存款类型别名"></el-input>
			</el-form-item>
			<el-form-item label="理财系列：" prop="prdIndexDTO.prdSeriesId">
				<el-select v-model="dataForm.prdIndexDTO.prdSeriesId" placeholder="请选择" clearable
				@change='depositSeriesListSelect'>
					<el-option v-for="item in allSelectData.prdSeriesList"
					:key="item.value" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<!-- 保险理财有： 所属基金公司名称：-->
			<template v-if="dataForm.prdIndexDTO.prdTypeId == 5">
				<el-form-item label="所属基金公司名称：" prop="fundId">
					<el-select v-model="dataForm.fundId" placeholder="请选择" filterable clearable
					@change='fundCompanyListSelect'>
						<el-option v-for="item in allSelectData.fundCompanyList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</template>
			<el-form-item label="产品名称：" prop="prdIndexDTO.prdName">
				<el-input v-model="dataForm.prdIndexDTO.prdName" placeholder="请输入产品名称"></el-input>
			</el-form-item>
			<el-form-item label="产品名称别名：" prop="prdIndexDTO.prdNameAlias">
				<el-input v-model="dataForm.prdIndexDTO.prdNameAlias" placeholder="请输入产品名称别名"></el-input>
			</el-form-item>
			<!-- 理财产品、投融资产品单独展示： 预期年化收益率：-->
			<template v-if="dataForm.prdIndexDTO.prdTypeId != 5" prop="prdIndexDTO.rate3">
				<el-form-item label="预期年化收益率（%）：" prop="prdIndexDTO.rate3">
					<el-input v-model="dataForm.prdIndexDTO.rate3" placeholder="请输入预期年华收益率"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="利率名称：" prop="rateName">
				<el-input v-model="dataForm.rateName" placeholder="请输入利率名称"></el-input>
				<!-- <span class="tipText">根据产品大类、产品类型的配置反显</span> -->
			</el-form-item>
			<!-- 保险理财：七日年化收益率，万份年化收益，预期年化收益，保底收益率 -->
			<template v-if="dataForm.prdIndexDTO.prdTypeId == 5" prop="prdIndexDTO">
				<el-form-item label="七日年化收益率（%）：" prop="prdIndexDTO.rate">
					<el-date-picker v-model="dataForm.prdIndexDTO.rateTime" type="date" format="yyyy-MM-dd" 
					value-format="yyyy-MM-dd" placeholder="请选择七日年化收益率" style="width:20%"></el-date-picker>
					<el-input v-model="dataForm.prdIndexDTO.rate" placeholder="请输入七日年化收益率" style="width:20%"></el-input>
					<el-button class="historyBtn" type="primary">查看管理历史数据</el-button>
				</el-form-item>
				<el-form-item label="万份年化收益（%）：" prop="prdIndexDTO.rate2">
					<el-date-picker v-model="dataForm.prdIndexDTO.rate2Time" type="date" format="yyyy-MM-dd" 
					value-format="yyyy-MM-dd" placeholder="请选择万份年化收益" style="width:20%"></el-date-picker>
					<el-input v-model="dataForm.prdIndexDTO.rate2" placeholder="请输入万份年化收益" style="width:20%"></el-input>
					<el-button class="historyBtn" type="primary">查看管理历史数据</el-button>
				</el-form-item>
				<el-form-item label="预期年化收益（%）：" prop="prdIndexDTO.rate3">
					<el-input v-model="dataForm.prdIndexDTO.rate3" placeholder="预期年化收益（%）"></el-input>
				</el-form-item>
				<el-form-item label="保底收益率（%）：" prop="minYield">
					<el-input v-model="dataForm.minYield" placeholder="请输入保底收益率（%）"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="期限：" prop="prdIndexDTO.period">
				<el-input type="number" min="0"  v-model="dataForm.prdIndexDTO.period" placeholder="请输入期限" style="width:20%"></el-input>
				<!-- 期限单位 -->
				<el-select v-model="dataForm.prdIndexDTO.periodUnit" placeholder="请选择" clearable  style="width:15%">
					<el-option v-for="item in unitList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="期限备注：" prop="periodRemark" placeholder="请输入期限备注">
				<el-input v-model="dataForm.periodRemark"></el-input>
			</el-form-item>
			<el-form-item label="锁定期：" prop="lockupPeriod">
				<el-input type="number" min="0" v-model="dataForm.lockupPeriod" placeholder="请输入锁定期" style="width:20%"></el-input>
				<!-- 锁定期单位 -->
				<el-select  v-model="dataForm.lockupPeriodUnit" placeholder="请选择" clearable style="width:15%">
					<el-option v-for="item in unitList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			
			<!-- 保险理财：起息日、到期日、期次、收益类型 -->
			<template v-if="dataForm.prdIndexDTO.prdTypeId == 5">
				<el-form-item label="起息日：" prop="valueDate">
					<el-date-picker v-model="dataForm.valueDate" type="date" placeholder="请选择起息日"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="到期日：" prop="prdEndDate">
					<el-date-picker v-model="dataForm.prdEndDate" type="date" placeholder="请选择到期日"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="期次：" prop="periodNo">
					<el-input v-model="dataForm.periodNo" placeholder="请输入期次"></el-input>
				</el-form-item>
				<el-form-item label="收益类型：" prop="inomeType">
					<el-input v-model="dataForm.inomeType" placeholder="请输入收益类型"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="产品属性补充标签：" prop="prdIndexDTO.defineLabelSuffix">
				<el-input v-model="dataForm.prdIndexDTO.defineLabelSuffix" placeholder="请输入产品属性补充标签"></el-input>
			</el-form-item>
			<!-- 用户分群筛选,未加字段 -->
			<el-form-item label="用户分群筛选：" prop="prdIndexDTO.isCheck">
				<el-select v-model="dataForm.prdIndexDTO.isCheck" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.isCheckList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否在首页排行榜展示：" prop="prdIndexDTO.isHomepageRank" >
				<el-select v-model="dataForm.prdIndexDTO.isHomepageRank" placeholder="请选择">
					<el-option v-for="item in allSelectData.isCheckList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="首页排行榜一句话推荐：" prop="oneWordRecommend" v-if="dataForm.prdIndexDTO.isHomepageRank == 1">
				<el-input v-model="dataForm.oneWordRecommend" placeholder="请输入首页排行榜一句话推荐"></el-input>
				<!-- <span class="tipText">若首页展示为否，本项不展示不显示</span> -->
			</el-form-item>
			<!-- 理财产品、投融资理财：有以下内容  -->
			<template v-if="dataForm.prdIndexDTO.prdTypeId != 5 ">
				<el-form-item label="风险等级：" prop="riskLevel" >
					<el-select v-model="dataForm.riskLevel" placeholder="请选择">
						<el-option v-for="item in allSelectData.riskLevelList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="剩余额度：" prop="holdingLimiat">
					<el-select v-model="dataForm.holdingLimiat" placeholder="请选择" clearable>
						<el-option v-for="item in allSelectData.holdingLimiatList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="支取方式：" prop="drawTime">
					<el-select v-model="dataForm.drawTime" placeholder="请选择" clearable>
						<el-option v-for="item in allSelectData.drawTimeList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="起息日：" prop="valueDate">
					<el-date-picker  v-model="dataForm.valueDate" type="date" placeholder="请选择起息日" 
					 format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
				</el-form-item>
				<el-form-item label="募集开始日期：" prop="collectStartDate">
					<el-date-picker v-model="dataForm.collectStartDate" type="date" placeholder="请选择募集开始日期"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
				</el-form-item>
				<el-form-item label="募集结束日期：" prop="collectEndDate">
					<el-date-picker v-model="dataForm.collectEndDate" type="date" placeholder="请选择募集结束日期"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
				</el-form-item>
				<el-form-item label="理财开始日期：" prop="finStartDate">
					<el-date-picker v-model="dataForm.finStartDate" type="date" placeholder="请选择理财开始日期"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
				</el-form-item>
				<el-form-item label="理财结束日期：" prop="finEndDate">
					<el-date-picker v-model="dataForm.finEndDate" type="date" placeholder="请选择理财结束日期"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" ></el-date-picker>
				</el-form-item>
			</template>
			<el-form-item label="起购金额（元）：" prop="prdIndexDTO.minAmount">
				<el-input v-model="dataForm.prdIndexDTO.minAmount" placeholder="请输入起购金额（元）"></el-input>
			</el-form-item>
			<!-- 保险理财 最大申购金额（元）-->
			<template v-if="dataForm.prdIndexDTO.prdTypeId == 5 " prop="prdIndexDTO.maxAmount">
				<el-form-item label="最大申购金额（元）：" prop="maxAmount">
					<el-input v-model="dataForm.prdIndexDTO.maxAmount" placeholder="请输入起购金额（元）"></el-input>
				</el-form-item>
			</template>
			<!--保险理财、投融资产品有： 默认存款金额（元） -->
			<template v-if="dataForm.prdIndexDTO.prdTypeId != 2 " prop="prdIndexDTO">
				<el-form-item label="默认购买金额（元）：" prop="defaultBuyAmt">
					<el-input v-model="dataForm.prdIndexDTO.defaultBuyAmt" placeholder="请输入默认存款金额（元）"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="递增金额（元）：" prop="increAmount">
				<el-input v-model="dataForm.increAmount" placeholder="请输入递增金额（元）"></el-input>
			</el-form-item>
			<!-- 保险理财：有以下内容 -->
			<template v-if="dataForm.prdIndexDTO.prdTypeId == 5 ">
				<el-form-item label="是否允许申购：" prop="isPayment">
					<el-select v-model="dataForm.isPayment" placeholder="请选择" clearable>
						<el-option v-for="item in allSelectData.isPaymentList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否允许赎回：" prop="isRedeem">
					<el-select v-model="dataForm.isRedeem" placeholder="请选择" clearable>
						<el-option v-for="item in allSelectData.isRedeemList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="最大赎回金额（元）：" prop="maxRedeemAmount">
					<el-input v-model="dataForm.maxRedeemAmount" placeholder="请输入最大赎回金额（元）"></el-input>
				</el-form-item>
				<el-form-item label="最小赎回金额（元）：" prop="minRedeemAmount">
					<el-input v-model="dataForm.minRedeemAmount" placeholder="请输入最小赎回金额（元）"></el-input>
				</el-form-item>
				<el-form-item label="客户单日最大赎回金额（元）：" prop="dayMaxRedeemAmt">
					<el-input v-model="dataForm.dayMaxRedeemAmt" placeholder="请输入客户单日最大赎回金额（元）"></el-input>
				</el-form-item>
				<el-form-item label="产品剩余额度百分比（%）：" prop="remainPercent">
					<el-input v-model="dataForm.remainPercent" placeholder="请输入产品剩余额度百分比（%）"></el-input>
				</el-form-item>
				<el-form-item label="产品收益率区间最大值：" prop="prdMaxSectionYield">
					<el-input v-model="dataForm.prdMaxSectionYield" placeholder="请输入产品收益率区间最大值"></el-input>
				</el-form-item>
				<el-form-item label="计息基础：" prop="intBasic">
					<el-input v-model="dataForm.intBasic" placeholder="请输入计息基础"></el-input>
				</el-form-item>
				<el-form-item label="产品清算日：" prop="prdSettleDate">
					<el-date-picker v-model="dataForm.prdSettleDate" type="date" placeholder="请选择产品清算日期"
					format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
				<el-form-item label="产品公司名称：" prop="prdCompany">
					<el-input v-model="dataForm.prdCompany" placeholder="请输入产品公司名称"></el-input>
				</el-form-item>
				<el-form-item label="风险等级：" prop="riskLevel">
					<el-select v-model="dataForm.riskLevel" placeholder="请选择风险等级" clearable>
						<el-option v-for="item in allSelectData.riskLevelList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="剩余额度：" prop="holdingLimiat">
					<el-select v-model="dataForm.holdingLimiat" placeholder="请选择" clearable>
						<el-option v-for="item in allSelectData.holdingLimiatList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="到期是否转存：" prop="expireTransfer">
					<el-select v-model="dataForm.expireTransfer" placeholder="请选择" clearable>
						<el-option v-for="item in allSelectData.expireTransferList"
						:key="item.value" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</template>
			<!--保险理财、投融资产品 付息方式 -->
			<template v-if="dataForm.prdIndexDTO.prdTypeId != 2 ">
				<el-form-item label="付息方式：" prop="payInterestWay">
					<el-input v-model="dataForm.payInterestWay" placeholder="请输入付息方式"></el-input>
				</el-form-item>
			</template>
			<el-form-item label="监管属性：" prop="isSupervision">
				<el-select v-model="dataForm.isSupervision" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.isSupervisionList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否签约：" prop="prdIndexDTO.isPrdContract">
				<el-select v-model="dataForm.prdIndexDTO.isPrdContract" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.isPrdContractList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品描述：" prop="depictText">
				<!-- 富文本组件 -->
				<MyQuillEditor id="editor1" @onEditorChange="onEditorChangeDeal" 
				:detailContent="dataForm.depictText" @quillEditorUploaderImgSon="quillEditorUploaderImg">
				</MyQuillEditor>
			</el-form-item>
			<el-form-item label="支取规则：" prop="prdIndexDTO.dealRuleText">
				<!-- 富文本组件 -->
				<MyQuillEditor id="editor2" @onEditorChange="onEditorChangeDeal" 
				:detailContent="dataForm.prdIndexDTO.dealRuleText" @quillEditorUploaderImgSon="quillEditorUploaderImg">
				</MyQuillEditor>
			</el-form-item>
			<el-form-item label="计息规则：" prop="prdIndexDTO.rateRuleText">
				<!-- 富文本组件 -->
				<MyQuillEditor id="editor3" @onEditorChange="onEditorChangeDeal" 
				:detailContent="dataForm.prdIndexDTO.rateRuleText" @quillEditorUploaderImgSon="quillEditorUploaderImg">
				</MyQuillEditor>
			</el-form-item>
			<el-form-item label="上下架方式：" prop="prdIndexDTO.autoUpper">
				<el-select v-model="dataForm.prdIndexDTO.autoUpper" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.autoUpperList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否面签：" prop="prdIndexDTO.isInterview">
				<el-select v-model="dataForm.prdIndexDTO.isInterview" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.isInterviewList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="显示银行提示页：" prop="prdIndexDTO.bankTipsPage">
				<el-select v-model="dataForm.prdIndexDTO.bankTipsPage" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.bankTipsPageList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品H5链接：" prop="prdIndexDTO.prdH5Url">
				<el-input v-model="dataForm.prdIndexDTO.prdH5Url" placeholder="请输入产品H5链接"></el-input>
			</el-form-item>
			<el-form-item label="银行对接方式：" prop="prdIndexDTO.bankDockType">
				<el-select v-model="dataForm.prdIndexDTO.bankDockType" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.bankDockTypeList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="自定义跳转链接：" prop="prdIndexDTO.defineUrl">
				<el-input v-model="dataForm.prdIndexDTO.defineUrl" placeholder="请输入自定义跳转链接"></el-input>
			</el-form-item>
			<el-form-item label="版本标识：" prop="prdIndexDTO.ctVer">
				<el-input type="number" min="0" v-model="dataForm.prdIndexDTO.ctVer" placeholder="请输入版本标识"></el-input>
			</el-form-item>
			<el-form-item label="openAPI产品是否同步：" prop="prdIndexDTO.isSyncFlag">
				<el-select v-model="dataForm.prdIndexDTO.isSyncFlag" placeholder="请选择" clearable>
					<el-option v-for="item in allSelectData.isSyncFlagList"
					:key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="同一产品标识：" prop="prdIndexDTO.identicalPrdTag">
				<el-input v-model="dataForm.prdIndexDTO.identicalPrdTag" placeholder="请输入同一产品标识"></el-input>
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
import {forFinancePage,getCurrencyAndOrg,getSeriesByPrdType,forFinanceList,getPrdTypeByTypeCode,getPrdSeriesById,
addFinance,updateFinance,deleteFinance,cloneFinance,getLongLinkFinance,
importFinance,exportFinance,importInsuranceFina,exportInsuranceFina,importInvestFina,exportInvestFina } from "../../../apis/index"
import config from '../../../config/config.index.js'
import MyQuillEditor from '../../../components/VueQuillEditor'
import CommonTable from "@common/finsuit-components/CommonTable"
export default {
	name: 'depositProduct',
	components:{
		MyQuillEditor,
		CommonTable
	},
	data() {
		return {
			tableHeight: 0,
			imageUrl:'', //图片前面有域名的部分地址
			size: 'small',
			topCheckData: { //顶部搜索选择的工具内容
				orgId: '', //机构名称
				prdTypeId: '', //存款类型id
				prdSeriesId:'', //产品系列id
				prdName:'', //产品id
				autoUpper: '',//上下架方式
			},
			dialogUploadTypeTitle:'',  //导入弹框中，标题
			dialogUploadVisible: false, //是否显示导入的上传文件的弹框
			limitNum: 1,  // 上传excell时，同时允许上传的最大数
			fileObj: {},   // 单个要上传的文件
        	fileList: [],   // 上传excel文件列表
			unitList:[
				{
					"name":'天',
					"value": 0
				},
				{
					"name":'个月',
					"value": 1
				},
				{
					"name":'年',
					"value": 2
				}
			], //期限单位，锁定期单位
			allSelectData:{ 
				autoUpperList:[], //上下架方式
				bankDockTypeList:[], //银行对接方式
				bankTipsPageList:[], //是否显示银行提示页
				isRedeemList:[], //是否允许赎回
				isPaymentList:[], //是否允许申购
				financeTypeList:[], //理财类型
				drawTimeList:[], //支取方式
				expireTransferList:[], //到期是否转存
				riskLevelList:[], //风险等级
				holdingLimiatList:[], //剩余额度
				isCheckList:[], //是否首页排行榜展示列表
				isInterviewList:[], //是否面签
				isPrdContractList:[], //是否签约
				isSupervisionList:[], //监管属性
				isSyncFlagList:[], //openAPI产品是否同步
				orglist:[], //机构列表
				addOrglist:[], //新增里的机构下拉框--自定义
				transferFlagList:[], //是否可以转让
				nationalTypeList:[], //产品区域地区合集
				currencyList:[],//币种合集--自定义
				prdSeriesList:[],//存款系列--自定义
				fundCompanyList:[], //所属基金公司名称
			}, //所有下拉框数组合集
			totalSize: 0, //总数
			pageRequest: { //请求存款产品列表参数
                pageNum: 0, //当前页数
                pageSize: 10  //条数
			},
			loading:false, //请求存款产品时loading
			financingProductList: [], //请求回来的存款产品列表数据list
			saveLoading: false,  //保存时按钮loading
			// 新增和编辑
			dialogVisible: false, //是否展示新增编辑弹框
			DEPOSIT_TYPE_ID:'', //1：活期，2：智能，3：结构性，4：定期，5：大额存单
			dataForm: {  //新增弹框数据
				id:'', //主键id
				prdIndexId: '', //产品id
				prdIndexDTO:{
					id: '', //产品id
					prdTypeId: '',//产品类型id //1：理财产品，2：保险理财，3：投融资产品
					prdName:'', //产品名称
					orgId: '', //机构id
					orgName:'',//机构名称
					rate:'', //货基、保险理财时为7日年化，理财为预期收益，纯债为3个月涨幅
					rateTime:'', //rate的收益时间
					rate2:'', //货基、保险理财时为万份收益，纯债为6月涨幅
					rate2Time:'', //rate2的收益时间
					rate3:'', //收益率3<保险理财时为预期收益，纯债为1年涨幅>
					minAmount:'', //最小起购金额
					maxAmount:'', //最大起购金额
					period:'', //期限
					defaultBuyAmt:'', //默认购买金额
					isInterview: '', //是否面签
					isHomepageRank:'', //是否需要首页排行
					fundId:'', //所属基金公司id
					identicalPrdTag:'', //同一产品标识
					prdSeriesId:'', //产品系列id
					isPrdContract: '', //是否签约
					autoUpper: '', //上下架方式
					defineLabelSuffix:'', //产品属性补充标签
					bankTipsPage:'', //显示银行提示页
					prdH5Url:'', //产品H5链接
					bankDockType:'', //银行对接方式
					nationalType: '', //产品区域
					currency:'', //币种
					ctVer: '', //版本标识
					defineUrl:'', //自定义跳转链接
					periodUnit:'', //期限单位
					prdNameAlias:'', //产品名称别名
					rateRuleText:'', //计息规则
					dealRuleText:'', //支取规则
					isSyncFlag: '', //openAPI产品是否同步
				},
				prdTypeAlias:'', //产品类型别名
				rateName:'', //利率名称
				periodRemark:'', //期限备注
				lockupPeriod:'',  //锁定期
				lockupPeriodUnit:'',//锁定期单位
				oneWordRecommend:'', //排行榜一句话推荐
				riskLevel:'',//风险等级
				holdingLimiat: '',//剩余额度
				drawTime:'', //支取方式
				valueDate:'', //起息日
				prdEndDate:'', //到期日
				collectStartDate:'', //募集开始时间
				collectEndDate:'', //募集结束时间
				finStartDate:'', //理财开始日期
				finEndDate:'', //理财结束日期
				increAmount:'', //递增金额
				isSupervision: '', //监管属性
				depictText:'', //产品描述
				minYield:'', //保底收益率
				periodNo:'', //期次
				inomeType:'', //收益类型
				isPayment:'', //是否允许申购
				isRedeem:'', //是否允许赎回
				maxRedeemAmount:'', //最大赎回金额
				minRedeemAmount:'', //最小赎回金额
				dayMaxRedeemAmt:'', //客户单日最大赎回金额
				remainPercent:'', //产品剩余额度百分比
				prdMaxSectionYield:'', //产品收益率区间最大值
				intBasic:'', //计息基础
				prdSettleDate:'', //产品清算日
				prdCompany:'', //产品公司名称
				expireTransfer:'', //到期是否转存
				payInterestWay:'', //付息方式
			},
			selectlistRow:[],
			addFormRate:{},
			formRules: { //弹框校验规则
				prdIndexDTO:{
					prdTypeId: [
						{ required: true, message: '请选择存款类型', trigger: 'change' },
					],
					nationalType:[
						{ required: true, message: '请选择产品区域', trigger: 'change' },
					],
					orgId:[
						{ required: true, message: '请选择机构名称', trigger: 'blur' },
					],
					currency:[
						{ required: true, message: '请选择币种', trigger: 'blur' },
					],
					prdName:[
						{ required: true, message: '请输入产品名称', trigger: 'blur' },
					],
					rate:[
						{ required: true, message: '请输入七日年化收益率', trigger: 'blur' },
					],
					rate2:[
						{ required: true, message: '请输入万份年化收益', trigger: 'blur' },
					],
					rate3:[
						{ required: true, message: '请输入预期年化收益', trigger: 'blur' },
					],
					isInterview:[
						{ required: true, message: '请选择是否面签', trigger: 'change' },
					],
					period:[
						{ required: true, message: '请输入期限', trigger: 'blur' },

					]
				},
				period:[
					{ required: true, message: '请输入期限', trigger: 'blur' },
				],
				expireTransfer:[
					{ required: true, message: '请选择到期是否转存', trigger: 'change' },
				],
				riskLevel:[
					{ required: true, message: '请选择风险等级', trigger: 'change' },
				],
				holdingLimiat:[
					{ required: true, message: '请选择剩余额度', trigger: 'change' },
				],
				drawTime:[
					{ required: true, message: '请选择支取方式', trigger: 'change' },
				],
				increAmount:[
					{ required: true, message: '请输入递增金额', trigger: 'blur' },
				],
				isSupervision:[
					{ required: true, message: '请选择监管属性', trigger: 'change' },
				],
			},  
			//删除
			selections: [], //删除选中项
			rateName:'', //类别的利率名称
		}
	},
	watch: {
		dialogUploadVisible(newVal){
			this.dialogUploadVisible = newVal
			console.log('newVal',newVal)
			if(newVal){
				this.fileObj = {} //清空data中数据
			}
		},
	},
  	mounted() {
		//图片初始化地址：
		this.imageUrl = config.baseUrlHost+'/finsuitImgDisplay/show?path=';
		console.log('图片初始地址-imageUrl',this.imageUrl)
		this.getFinancingProductSelect() //初始化下拉框数据
		this.getFinancingProductList() //存款产品管理列表
	},
	methods: {
		//进入存款产品列表初始化参--所有下拉框数据
		getFinancingProductSelect(){
			let params = ''
			forFinancePage(params).then(res => {
				console.log("获取所有下拉框数据",res)
				if(res.code == 0){
					//理财类型列表
					this.allSelectData.financeTypeList = res.data.financeTypeList //
					//是否允许赎回
					this.allSelectData.isRedeemList = res.data.isRedeemList //
					//监管属性列表
					this.allSelectData.isSupervisionList = res.data.isSupervisionList //
					//是否首页排行榜展示列表
					this.allSelectData.isCheckList = res.data.isCheckList //
					//风险等级
					this.allSelectData.riskLevelList = res.data.riskLevelList //
					//银行对接方式列表
					this.allSelectData.bankDockTypeList = res.data.bankDockTypeList //
					//支取方式列表
					this.allSelectData.drawTimeList = res.data.drawTimeList //
					//剩余额度列表
					this.allSelectData.holdingLimiatList = res.data.holdingLimiatList //
					//是否签约列表
					this.allSelectData.isPrdContractList = res.data.isPrdContractList //
					//是否显示银行提示页列表
					this.allSelectData.bankTipsPageList = res.data.bankTipsPageList //
					//机构列表
					this.allSelectData.orglist = res.data.orglist //
					//上下架方式列表
					this.allSelectData.autoUpperList = res.data.autoUpperList //
					//是否允许申购
					this.allSelectData.isPaymentList = res.data.isPaymentList //
					//是否可以转让列表
					this.allSelectData.transferFlagList = res.data.transferFlagList
					//是否面签列表
					this.allSelectData.isInterviewList = res.data.isInterviewList //
					//openAPI产品是否同步列表
					this.allSelectData.isSyncFlagList = res.data.isSyncFlagList //
					//到期是否转存
					this.allSelectData.expireTransferList = res.data.expireTransferList //
					//产品区域--地区编码集合
					this.allSelectData.nationalTypeList = res.data.nationalTypeList
					//所属基金公司名称
					this.allSelectData.fundCompanyList = res.data.fundCompanyList
				}else{
					console.log('下拉框数据失败')
				}
			}).catch((err) => {
				console.log("获取所有下拉框数据err",err);
			})
		},
		// 获取存款产品列表数据
		getFinancingProductList: function(type) {
			this.loading = true;
			if(type == 'chaxun'){
				console.log('chauxn')
				this.pageRequest.pageNum = 0; //初始化--第一条开始查
				this.pageRequest.pageSize = 10; //初始化--查询10条
			}
			let params = {
				//查询多少页，从0开始, offset=页数乘以条数
				start: this.pageRequest.pageNum == 0 ? 0 : parseInt(this.pageRequest.pageNum-1)*this.pageRequest.pageSize, 
				length: this.pageRequest.pageSize, //查询多少条
				orgId: this.topCheckData.orgId, //机构名称id
				prdTypeId: this.topCheckData.prdTypeId, //产品子类型编码-产品类型
				prdSeriesId: this.topCheckData.prdSeriesId,  //产品系列id
				prdName: this.topCheckData.prdName, //产品id
				autoUpper: this.topCheckData.autoUpper, //产品上下架方式
			}
			console.log('存款产品数据入参',params)
			forFinanceList(params).then(res => {
				console.log("获取存款产品数据",res)
				this.financingProductList = res.data.data
				this.totalSize = res.data.totalCount; //总条数
				this.loading = false;
			}).catch((err) => {
				console.log("获取存款产品数据err",err);
				this.loading = false;
			})
		},
		// 点击页数--分页刷新  
		refreshPageRequest: function (val) {
			console.log(`当前页: ${val}`);
			this.pageRequest.pageNum = val
			this.getFinancingProductList() //调存款产品列表接口
		},
		// 点击条数--分页刷新
		handleSizeChange(val){
			console.log(`当前条数: ${val}`);
			this.pageRequest.pageSize = val
			this.getFinancingProductList() //调产品系列列表接口
		},
		//标头查询区-点击存款后，请求存款系列
		searchOrglistSelect(){
			this.getSeries(this.topCheckData.prdTypeId,'13')
		},
		//重置
		resetForm(topData){
			console.log('重置')
			this.$refs[topData].resetFields();
		},
		//点击弹框阴影部分校验
		closeDialog(done){
		　　this.$confirm('确认关闭？')
		　　.then(_ => {
			　　 done();
				this.$refs.dataForm.resetFields(); //清空数据
				location.reload();  //刷新页面
			})
			.catch(_ => { });
		},
		//理财类型---选中值发生变化时触发---获取下拉框的lable
		financeTypeListSelect(val,id,financeRateName){
			console.log('当前value--code',val,id,financeRateName)
			let obj = {}
			obj = this.allSelectData.financeTypeList.find(function(item){
				return item.value === val
			})
			console.log('当前理财类型',obj.name)
			// this.dataForm.depsoitTypeName = obj.name

			//先判断编辑里的利率名称是否存在，存在就展示编辑里的，不存在则需要请求类别的利率名称
			if(id && financeRateName != ''){
				console.log('编辑里的利率名称',financeRateName)
				this.dataForm.rateName = financeRateName //编辑里修改后的利率名称
			}else{
				//根据产品大类，产品小类类型---请求利率名称
				let params = {
					parentTypeCode: '13',  // 存款产品大类编码,
					subtypeTypeCode: val  //产品小类编码
				}
				console.log('请求利率名称-->入参',params)
				getPrdTypeByTypeCode(params).then(res => {
					console.log("利率名称res",res)
					this.rateName = res.data.rateName; //类别的利率名称
					this.dataForm.rateName = res.data.rateName //类别的利率名称
					console.log(this.dataForm.rateName) 
				}).catch((err) => {
					console.log("利率名称err",err);
				})
			}
			//请求存款系列
			this.getSeries(val,'13',id)
		},
		//根据存款类型和机构ID--请求存款系列
		getSeries(SUBTYPE_CODE,PRDTYPE_CODE,id){
			this.topCheckData.prdSeriesId = '' // 每次请求系列之前，先将存款系列置空
			if(!id){
				this.dataForm.prdIndexDTO.prdSeriesId = ''; //新增时每次请求系列之前，先将存款系列置空
			}
			let params = {
				'SUBTYPE_CODE': SUBTYPE_CODE,
				'PRDTYPE_CODE': PRDTYPE_CODE, 
			}
			console.log('请求存款系列-->入参',params)
			getSeriesByPrdType(params).then(res => {
				console.log("存款系列res",res)
				this.allSelectData.prdSeriesList = res.data
			}).catch((err) => {
				console.log("存款系列err",err);
			})
		},
		//选择系列名称
		depositSeriesListSelect(val){
			console.log('当前value--code',val)
			let obj = {}
			obj = this.allSelectData.prdSeriesList.find(function(item){
				return item.id === val
			})
			console.log(obj.name)
			// this.dataForm.prdIndex.nationalType = obj.name
			
			//根据系列名称--请求系列里的利率名称和上下架方式
			let params = {
				id: val, //系列id
				prdType:'13' //产品大类id
			}
			if(val != ''){ //系列id不为空的时候才能请求该接口
				console.log('请求系列继承的利率名称-->入参',params)
				getPrdSeriesById(params).then(res => {
					console.log("系列继承的利率名称res",res)
					if(res.data.RATE_NAME != ''){
						this.dataForm.prdIndexDTO.autoUpper = res.data.AUTO_UPPER; // 系列的上下架方式
						this.dataForm.rateName = res.data.RATE_NAME; //系列的利率名称
						this.dataForm.oneWordRecommend = res.data.HOEM_PAGE_WORD; //系列的首页推荐一句话
						this.dataForm.prdIndexDTO.defineLabelSuffix = res.data.ATTR_ADDED_LABEL; //系列的产品属性补充标签
					}else{
						this.dataForm.rateName = this.rateName; //类别的利率名称
					}
				}).catch((err) => {
					console.log("系列继承的利率名称err",err);
				})
			}else{
				this.dataForm.rateName = this.rateName; //系列的利率名称
			}
		},
		// 产品区域
		nationalTypeListSelect(val,id){
			//每次更换产品区域之前，重新填写机构和币种，所以先置空
			if(!id){ //编辑回显时，不置空
				this.dataForm.prdIndexDTO.orgId = '';
				this.dataForm.prdIndexDTO.currency = '';
			}
			console.log('当前value--code',val)
			let obj = {}
			obj = this.allSelectData.nationalTypeList.find(function(item){
				return item.value === val
			})
			console.log(obj.name)
			// this.dataForm.prdIndex.nationalType = obj.name

			//根据产品区域类型--请求币种和机构
			let params = {
				nationalType: val
			}
			console.log('请求币种-->入参',params)
			getCurrencyAndOrg(params).then(res => {
				console.log("币种res",res)
				this.allSelectData.currencyList = res.data.currencyList
				this.allSelectData.addOrglist = res.data.orgList
				console.log(this.allSelectData.addOrglist)
				console.log(this.allSelectData.currencyList)
			}).catch((err) => {
				console.log("币种err",err);
			})
		},
		//机构名称
		addOrglistSelect(val){
			console.log('当前value--code',val)
			let obj = {}
			obj = this.allSelectData.addOrglist.find(function(item){
				return item.orgId === val
			})
			console.log(obj.orgName)
			this.dataForm.prdIndexDTO.orgName = obj.orgName
		},
		//基金公司名称--选中值发生变化时触发---获取下拉框的lable
		fundCompanyListSelect(val){
			console.log('当前value--code',val)
			let obj = {}
			obj = this.allSelectData.fundCompanyList.find(function(item){
				return item.value === val
			})
			console.log('1111',obj.name)
			// this.dataForm.fundCompany = obj.name //可以不传
		},	
		// 显示新增界面弹窗
		handleAdd: function() {
			// this.getFinancingProductSelect() //初始化下拉框数据
			console.log('新增')
			this.dialogVisible = true;
			this.dataForm = { 
				prdIndexDTO:{
					prdTypeId: '',//产品类型id //1：理财产品，2：保险理财，3：投融资产品
					prdName:'', //产品名称
					orgId: '', //机构id
					orgName:'',//机构名称
					rate:'', //货基、保险理财时为7日年化，理财为预期收益，纯债为3个月涨幅
					rateTime:'', //rate的收益时间
					rate2:'', //货基、保险理财时为万份收益，纯债为6月涨幅
					rate2Time:'', //rate2的收益时间
					rate3:'', //收益率3<保险理财时为预期收益，纯债为1年涨幅>
					minAmount:'', //最小起购金额
					maxAmount:'', //最大起购金额
					period:'', //期限
					defaultBuyAmt:'', //默认购买金额
					isInterview: '', //是否面签
					isHomepageRank:'', //是否需要首页排行
					fundId:'', //所属基金公司id
					identicalPrdTag:'', //同一产品标识
					prdSeriesId:'', //产品系列id
					isPrdContract: '', //是否签约
					autoUpper: '', //上下架方式
					defineLabelSuffix:'', //产品属性补充标签
					bankTipsPage:'', //显示银行提示页
					prdH5Url:'', //产品H5链接
					bankDockType:'', //银行对接方式
					nationalType: '', //产品区域
					currency:'', //币种
					ctVer: '', //版本标识
					defineUrl:'', //自定义跳转链接
					periodUnit:'', //期限单位
					prdNameAlias:'', //产品名称别名
					rateRuleText:'', //计息规则
					dealRuleText:'', //支取规则
					isSyncFlag: 1, //openAPI产品是否同步
				},
				prdTypeAlias:'', //存款类型别名
				rateName:'', //利率名称
				periodRemark:'', //期限备注
				lockupPeriod:'',  //锁定期
				lockupPeriodUnit:'',//锁定期单位
				oneWordRecommend:'', //排行榜一句话推荐
				riskLevel:'',//风险等级
				holdingLimiat: '',//剩余额度
				drawTime:'', //支取方式
				valueDate:'', //起息日
				prdEndDate:'', //到期日
				collectStartDate:'', //募集开始时间
				collectEndDate:'', //募集结束时间
				finStartDate:'', //理财开始日期
				finEndDate:'', //理财结束日期
				increAmount:'', //递增金额
				isSupervision: '', //监管属性
				depictText:'', //产品描述
				minYield:'', //保底收益率
				periodNo:'', //期次
				inomeType:'', //收益类型
				isPayment:'', //是否允许申购
				isRedeem:'', //是否允许赎回
				maxRedeemAmount:'', //最大赎回金额
				minRedeemAmount:'', //最小赎回金额
				dayMaxRedeemAmt:'', //客户单日最大赎回金额
				remainPercent:'', //产品剩余额度百分比
				prdMaxSectionYield:'', //产品收益率区间最大值
				intBasic:'', //计息基础
				prdSettleDate:'', //产品清算日
				prdCompany:'', //产品公司名称
				expireTransfer:'', //到期是否转存
				payInterestWay:'', //付息方式
			};
			Object.assign(this.dataForm);
		},
		// 显示编辑界面弹框
		handleEdit: function(row) {
			// this.getFinancingProductSelect() //初始化下拉框数据
			console.log('编辑',row)
			console.log('编辑里的利率名称',row.rateName)
			this.dialogVisible = true;
			Object.assign(this.dataForm, row);

			let nationalType = row.prdIndexDTO.nationalType
			console.log('nationalType',nationalType)
			//回显
			this.nationalTypeListSelect(nationalType,row.id) //先根据产品区域请求机构
			this.financeTypeListSelect(row.prdIndexDTO.prdTypeId,row.id,row.rateName) //根据类型请求利率名称，和系列列表
		},
		//点击保存按钮，必填项有未填写内容时，弹框提示，并把光标定为到第一个未录入的输入框
		fromRequired(){
			//获取当前必录的校验词并弹框提示输入具体必录项
			setTimeout(()=>{
				// console.log(document.getElementsByClassName('el-form-item__error'))
				if(document.getElementsByClassName('el-form-item__error').length>0){
				this.$notify.error({ 
					title: '提示',  
					message: document.getElementsByClassName('el-form-item__error')[0].innerText
				}); 
				}
			},100);
			//获取未录入的第一个必录项的输入框并定位到此处
			setTimeout(()=>{
				// console.log(document.getElementsByClassName('is-error is-required'))
				var isError= document.getElementsByClassName("is-error is-required");
				if(isError.length>0){
					isError[0].querySelector('input').focus();
				}
			},100);
		},
		//新增保存提交
		submitFormAddSave: function (dataForm) {
			console.log('新增保存')
			this.fromRequired(); //调用必填项的校验方法
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.saveLoading = true
						let params = Object.assign({}, this.dataForm);
						console.log('新增保存入参',params)
						addFinance(params).then((res) => {
							console.log("新增接口",res);
							if(res.code == 0){
								this.$message({ message: '操作成功', type: 'success' })
								this.saveLoading = false
								this.dialogVisible = false
								this.getFinancingProductList()
								this.$refs.dataForm.resetFields(); //清空数据
								location.reload();  //刷新页面--富文本也会清空
							}else{
								this.$message({ message: res.msg, type: 'error' })
								this.saveLoading = false
								this.dialogVisible = false
								this.getFinancingProductList()
								this.$refs.dataForm.resetFields(); //清空数据
								location.reload();  //刷新页面--富文本也会清空
							}
						}).catch((err) => {
							console.log("新增接口err",err);
						})
					}).catch(() => {
						this.$message({type: 'info',message: '已取消新增'});        
					});
				}
			})
		},
		//编辑保存提交
		submitFormEditSave: function (dataForm) {
			console.log('编辑保存')
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.saveLoading = true
						let params = Object.assign({},this.dataForm);
						console.log('编辑保存入参',params)
						//请求编辑接口
						updateFinance(params).then((res) => {
							console.log("修改接口",res);
							this.saveLoading = false
							this.$message({ message: '操作成功', type: 'success' })
							this.dialogVisible = false
							this.getFinancingProductList()
						}).catch((err) => {
							console.log("编辑接口err",err);
						})
					}).catch(() => {
						this.$message({type: 'info',message: '已取消编辑'});          
					});
				}
			})
		},

		// 选中当前行切换,值为单个对象 @current-change="handleCurrentChange"
		// handleCurrentChange: function (val) {
		// 	console.log('选中项 CurrentChange',val)
		// },
		// 单个删除
		handleDelete (index, row) {
			console.log('单个删除',row)
			this.$confirm('此操作将删除该条管理员数据, 是否继续？', '提示', {type: 'warning'}).then(() => {
				this.loading = true
				let params ={
					prdIndexId: row.prdIndexDTO.id,
				}
				console.log('单个删除入参',params)
				deleteFinance(params).then(data => {
					console.log("删除接口",data);
					this.$message({message: '删除成功', type: 'success'})
					this.getFinancingProductList() //刷新当前页
					this.loading = false
				})
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});          
			});
		},
		// 选中多选框切换,值为数组
		selectionChange (selections) {
			this.selections = selections
			console.log('选中项',this.selections)
		},
		// 批量删除---目前未做该功能
		handleBatchDelete: function () {
			console.log('批量删除')
			this.$confirm('确认删除选中记录吗？', '提示', {type: 'warning'}).then(() => {
				this.loading = true
				let ids = []
				this.selections.map(item => {
					ids.push(item.id)
				})
				let params = {
					'IDS': ids.toString()
				}
				console.log('删除params',params)
				getRoleDeletes(params).then(data => {
					console.log("批量删除接口",data);
					this.$message({message: '删除成功', type: 'success'})
					this.getFinancingProductList() //刷新当前页
					this.loading = false
				})
			}).catch(() => {
				this.$message({type: 'info',message: '已取消删除'});          
			});
		},
		//---------------------------------------------------------------
		//克隆产品按钮
		handleClone(row,index){
			console.log('克隆产品',row)
			this.saveLoading = true
			let params = row;
			console.log('克隆产品入参-->',params)
			cloneFinance(params).then((res) => {
				console.log('克隆产品',res)
				this.saveLoading = false
				this.$message({ message: '操作成功', type: 'success' })
				this.dialogVisible = false
				this.getFinancingProductList()
			}).catch((err) => {
				console.log("克隆产品按钮err",err);
			})
		},
		//复制链接按钮
		handleCopyLink(row){
			let params = {
				prdIndexId: row.prdIndexDTO.id,
			}
			getLongLinkFinance(params).then((res) => {
				console.log('复制链接',res)
				let Url2 = res.data
				let oInput = document.createElement("input");
				oInput.value = Url2;
				document.body.appendChild(oInput);
				oInput.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				oInput.className = "oInput";
				oInput.style.display = "none";
				this.$message({ message: '复制链接成功', type: 'success' })
			}).catch((err) => {
				console.log("复制链接err",err);
			})
		},
		//导入上传文件=======================================
		handleImport(type){
			console.log('handleImport-type-',type)
			this.dialogUploadVisible = true
			if(type == 2){ //理财
				this.dialogUploadTypeTitle = '理财'
			}else if(type == 5){
				this.dialogUploadTypeTitle = '保险理财'
			}else if(type == 6){
				this.dialogUploadTypeTitle = '投融资'
			}
		},
		// 文件超出个数限制时的钩子
		exceedFile(files, fileList) {
			this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
		},
		// 文件状态改变时的钩子
		fileChange(file, fileList) {
			this.fileObj = file.raw
			console.log('要上传的文件',this.fileObj);
		},
		// 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
		beforeUploadFile(file) {
			console.log('before upload');
			console.log(file);
			let extension = file.name.substring(file.name.lastIndexOf('.')+1);
			let size = file.size / 1024 / 1024;
			if(extension !== '.xls' || extension !== 'xlsx') {
			this.$message.warning('只能上传后缀是.xls/.xlsx的文件');
			}
			if(size > 10) {
			this.$message.warning('文件大小不得超过10M');
			}
		},
		//导入调接口
		uploadFile(type) {
			if (Object.keys(this.fileObj).length === 0){
				this.$message.warning('请上传文件');
			} else {
				let form = new FormData();
				form.append('importFile', this.fileObj);
				//调导入接口
				if(type == 2){ //理财产品
					importFinance(form).then((res) => {
						console.log('理财导入请求成功',res)
						this.saveLoading = false
						this.$message({ message: res.data ? res.data:'理财导入成功', type: 'success' })
						this.dialogUploadVisible = false
						this.$refs.upload.clearFiles()  //清空文件
						this.fileObj = {} //清空data中数据
						this.getFinancingProductList()
					}).catch((err) => {
						console.log("理财导入err",err);
					})
				}else if(type == 5){ //保险理财
					importInsuranceFina(form).then((res) => {
						console.log('保险理财导入请求成功',res)
						this.saveLoading = false
						this.$message({ message: res.data ? res.data:'保险理财导入成功', type: 'success' })
						this.dialogUploadVisible = false
						this.$refs.upload.clearFiles()  //清空文件
						this.fileObj = {} //清空data中数据
						this.getFinancingProductList()
					}).catch((err) => {
						console.log("保险理财导入err",err);
					})
				}else if(type == 6){ //投融资产品
					importInvestFina(form).then((res) => {
						console.log('投融资导入请求成功',res)
						this.saveLoading = false
						this.$message({ message: res.data ? res.data:'投融资导入成功', type: 'success' })
						this.dialogUploadVisible = false
						this.$refs.upload.clearFiles()  //清空文件
						this.fileObj = {} //清空data中数据
						this.getFinancingProductList()
					}).catch((err) => {
						console.log("投融资导入err",err);
					})
				}
			}
		},
		remove(){
			this.fileObj = {} //清空data中数据
		},
		//导出
		handleExport(type){
			let params = ''
			if(type == 2){ //理财产品
				exportFinance(params).then((res) => {
					console.log('理财导出',res)
					this.$message({ message: res.data ? res.data:'理财导出成功', type: 'success' })
				}).catch((err) => {
					console.log("理财导出err",err);
				})
			}else if(type == 5){ //保险理财
				exportInsuranceFina(params).then((res) => {
					console.log('保险理财导出',res)
					this.$message({ message: res.data ? res.data:'险理财导出成功', type: 'success' })
				}).catch((err) => {
					console.log("保险理财导出err",err);
				})
			}else if(type == 6){ //投融资产品
				exportInvestFina(params).then((res) => {
					console.log('投融资导出',res)
					this.$message({ message: res.data ? res.data:'投融资导出成功', type: 'success' })
				}).catch((err) => {
					console.log("投融资导出err",err);
				})
			}
			
		},

		//富文本子组件传来的值，调用改方法
		onEditorChangeDeal(html,id){
			console.log(id)
			if(id == 'editor1'){
				this.dataForm.depictText = html  //产品描述
				// console.log('富文本父组件内容1',this.dataForm.depictText)
			}else if(id == 'editor2'){
				this.dataForm.prdIndexDTO.dealRuleText = html  //支取规则
				// console.log('富文本父组件内容2',this.dataForm.prdIndexDTO.dealRuleText)
			}else if(id == 'editor3'){
				this.dataForm.prdIndexDTO.rateRuleText = html  //计息规则
				// console.log('富文本父组件内容3',this.dataForm.prdIndexDTO.rateRuleText)
			}
		},

	},
	
}
</script>

<style lang="less" scoped>
	/deep/ .el-table__fixed-body-wrapper {
		top: 37px !important;
	}
    .prdSeries{
        padding: 20px;
    }
	// .topBox{
	// 	border-bottom: 1px solid #EBEEF5;
	// }
	// .addBtn{
	// 	margin: 18px 0;
	// }
	.addForm{
		.el-form-item__label-wrap {
			margin-left: 0px!important;   //新增的所有label 靠左显示
		}
		.el-table::before {
			left: 0;
			bottom: 0;
			width: 100%;
			height: 0px;
		}
		.el-input{
			width: 100%;
		}
		.el-select{
			width: 100%;
		}
		.tipText{
			padding-left: 12px;
			color: #999;
		}
		.el-form-item.addRate.el-form-item--small{
			/deep/ .el-table .cell, .el-table th div {
				// padding-left: 5px!important;
				// padding-right: 5px!important;
				padding: 0 5px!important;
			}
			/deep/ .el-table td, .el-table th {
				padding: 5px 0!important;
			}
			/deep/ .el-table td, .el-table th.is-leaf {
				border-bottom: 0!important; 
			}
			.el-input,.el-select{
				width: 100%;
				/deep/ .el-input__inner {
					-webkit-appearance: none;
					background-color: #FFF;
					background-image: none;
					border-radius: 2px;
					border: 1px solid #DCDFE6;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					color: #606266;
					display: inline-block;
					font-size: inherit;
					height: 30px;
					line-height: 30px;
					outline: 0;
					padding: 0 5px;
					-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
					transition: border-color .2s cubic-bezier(.645,.045,.355,1);
					width: 100%;
				}
			}
			.el-table thead {
				color: #909399;
				font-weight: 400;
			}
		}
		.historyBtn{
			margin-left: 90px;
		}
		//富文本
		/deep/ .ql-container{
			height: 80%!important;
		}			
		/deep/ .ql-toolbar.ql-snow .ql-picker-label {
			border: 1px solid #ccc!important;
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
			.el-upload__tip{
				padding-left: 20px;
			}
			.uploadBTtn{
				float: right;
			}
		}
	}
	
</style>
