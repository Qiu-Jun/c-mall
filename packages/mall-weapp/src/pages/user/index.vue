<template>
    <view class="user-view">
        <view class="user-view-header">
            <view class="avatar xl round">
                <open-data type="userAvatarUrl" />
            </view>
            <view class="margin-top-lg text-xl">
                <open-data type="userNickName"></open-data>
            </view>
        </view>

        <view class="cu-bar bg-white solid-bottom">
            <view class="action sub-title">
                <text class="text-xl text-bold text-blue">我的订单</text>
                <text class="bg-blue" style="width: 5em"></text>
            </view>
            <view class="action">
                <navigator url="/pages/order/list?tabCur=0" hover-class="none"
                    >查看全部订单</navigator
                >
                <text class="cuIcon-right bar-icon-right"></text>
            </view>
        </view>
        <view class="cu-list grid col-4 no-border">
            <view
                class="cu-item"
                v-for="(item, index) in orderGirds"
                :key="item.value"
            >
                <navigator
                    :url="'/pages/order/list?tabCur=' + (index + 1)"
                    hover-class="none"
                >
                    <view :class="ORDER_STATUS_ICON[item.value]"></view>
                    <text>{{ item.label }}</text>
                </navigator>
            </view>
        </view>

        <view class="cu-bar bg-white solid-bottom margin-top">
            <view class="action sub-title">
                <text class="text-xl text-bold text-blue">功能</text>
                <text class="bg-blue" style="width: 2.5em"></text>
            </view>
        </view>
        <view class="cu-list grid col-4 no-border">
            <view class="cu-item">
                <navigator url="/pages/user/address" hover-class="none">
                    <view class="cuIcon-location text-grey"></view>
                    <text>我的地址</text>
                </navigator>
            </view>
            <view class="cu-item">
                <navigator url="/pages/user/merchant" hover-class="none">
                    <view class="cuIcon-info text-grey"></view>
                    <text>商家信息</text>
                </navigator>
            </view>
        </view>
    </view>
</template>

<script>
import constants from '@/config/constants'

export default {
    data() {
        return {
            orderGirds: constants ? constants.ORDER_TABS.slice(1, 5) : '',
            ORDER_STATUS_ICON: constants.ORDER_STATUS_ICON
        }
    },
    methods: {},
    onLoad() {},
    onShow() {}
}
</script>

<style lang="scss">
.user-view {
    &-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 360rpx;
        color: $uni-white;
        overflow: hidden;
        background-image: linear-gradient(0, #1cbbb4, #0081ff);
        .avatar {
            display: inline-block;
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            overflow: hidden;
        }
    }

    .bar-icon-right {
        font-size: 24rpx !important;
    }
}
</style>
