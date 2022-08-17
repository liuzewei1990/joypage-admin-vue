import selectJson from "./select.json"
import config from "../../config/config.index.js"

export default function (list = []) {
  return list.map((item) => transformItem(item))
}

function transformItem(item = {}) {
  let newItem = {}

  newItem.id = item.id
  newItem.name = item.awardName
  newItem.prdList = (item.investGiftsDto || []).map((item) => transformItemPrdList(item))
  newItem.totalRewardList = (item.cumulativeGiftsDto || []).map((item) => transformItemRewardList(item))
  newItem.topList = (item.investInjectionDto || []).map((item) => transformItemTopList(item))
  newItem.isTop = item.showRanking
  newItem.user = selectJson.userType.find((el) => el.id == item.userType) || {}
  newItem.startTime = item.startTime
  newItem.endTime = item.endTime
  newItem.channel = selectJson.channel.find((el) => el.id == item.releaseChannel) || {}
  newItem.device = selectJson.device.find((el) => el.id == item.releaseEquipment) || {}
  newItem.activityStatus = item.activityStatus

  return newItem
}

/**
 * 转换产品列表
 * @param {*} item
 * @returns
 */
function transformItemPrdList(item = {}) {
  let newItem = {}

  newItem.prdType = selectJson.prdType.find((el) => el.id == item.prdType) || {}
  newItem.org = item.orgId ? { name: item.orgName, id: item.orgId } : ""
  newItem.prd = item.prdIndexId ? { name: item.prdName, id: item.prdIndexId } : ""
  newItem.amount = item.minInvestAmount
  newItem.rewardType = selectJson.rewardType.find((el) => el.id == item.awardType) || {}
  newItem.rewardValue = Number(item.rewardPercentage || "")
  newItem.rewardName = item.awardName
  newItem.rewardEndDay = item.rewardTime
  newItem.rewardSendType = item.distributionType
  newItem.sortNum = item.sort
  // 非直连 银行banner
  newItem.upload = item.orgUrl ? [{ name: "", url: config.aliyuncHost + item.orgUrl, id: item.orgUrl }] : []
  // 奖励发放状态
  newItem.awardStatus = item.awardStatus

  return newItem
}

/**
 * 转换额外奖励列表
 * @param {*} item
 */
function transformItemRewardList(item = {}) {
  let newItem = {}

  newItem.totalAmount = item.accumulatedInvestAmount
  newItem.rewardType = selectJson.rewardType.find((el) => el.id == item.awardType) || {}
  newItem.rewardValue = Number(item.rewardValue || "")
  newItem.rewardName = item.awardName

  return newItem
}

/**
 * 转换排行榜列表
 * @param {*} item
 */
function transformItemTopList(item = {}) {
  let newItem = {}

  newItem.phoneNum = item.phoneNum
  newItem.amount = item.investAmount

  return newItem
}
