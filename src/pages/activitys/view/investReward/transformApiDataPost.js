import selectJson from "./select.json";
import config from "../../config/config.index.js";

export default function (form = {}) {
    let params = {};
    // 记录id
    params.id = form.id;
    params.awardName = form.name;
    params.userType = form.user.id;
    params.startTime = form.startTime;
    params.endTime = form.endTime;
    params.releaseChannel = form.channel.id;
    params.releaseEquipment = form.device.id;
    params.showRanking = form.isTop;
    params.investGiftsDto = form.prdList.map((item) => transformItemPrdList(item));
    params.cumulativeGiftsDto = form.totalRewardList.map((item) => transformItemRewardList(item));
    params.investInjectionDto = form.topList.map((item) => transformItemTopList(item));
    params.activityStatus = form.activityStatus || "2"; // 默认禁用
    return params;
}

/**
 * 转换产品列表
 * @param {*} item
 * @returns
 */
function transformItemPrdList(item = {}) {
    let newItem = {};
    // 记录id
    newItem.id = item.id || "";
    newItem.prdType = item.prdType.id;
    newItem.orgId = item.org.id;
    newItem.prdIndexId = item.prd.id;
    newItem.minInvestAmount = item.amount;
    newItem.awardType = item.rewardType.id;
    newItem.rewardPercentage = item.rewardValue;
    newItem.awardName = item.rewardName;
    newItem.rewardTime = item.rewardEndDay;
    newItem.distributionType = item.rewardSendType;
    newItem.orgUrl = item.upload[0] ? item.upload[0].id : "";
    newItem.sort = item.sortNum;

    return newItem;
}

/**
 * 转换额外奖励列表
 * @param {*} item
 */
function transformItemRewardList(item = {}) {
    let newItem = {};
    // 记录id
    newItem.id = item.id || "";
    newItem.accumulatedInvestAmount = item.totalAmount;
    newItem.awardType = item.rewardType.id;
    newItem.rewardValue = item.rewardValue;
    newItem.awardName = item.rewardName;

    return newItem;
}

/**
 * 转换排行榜列表
 * @param {*} item
 */
function transformItemTopList(item = {}) {
    let newItem = {};
    // 记录id
    newItem.id = item.id || "";
    newItem.phoneNum = item.phoneNum;
    newItem.investAmount = item.amount;

    return newItem;
}
