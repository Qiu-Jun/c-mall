<template>
    <view class="home-wrap">
        <!--搜索栏-->
        <view
            class="search-box cu-bar"
            :class="{ 'bg-blue': !searchPanelVisible }"
        >
            <view class="search-form round">
                <text class="cuIcon-search"></text>
                <input
                    type="text"
                    v-model="keywords"
                    placeholder="搜索商品"
                    confirm-type="search"
                    @focus="showSearchPanel"
                    @confirm="search(keywords)"
                />
                <view
                    v-if="keywords"
                    class="action cuIcon-roundclosefill text-gray search-clear"
                    @click="keywords = ''"
                ></view>
            </view>
            <view
                v-if="searchPanelVisible"
                class="action text-gray"
                @click="hideSearchPanel"
            >
                取消
            </view>
        </view>

        <!--搜索面板-->
        <view class="search-panel" :class="{ show: searchPanelVisible }">
            <view v-if="historyKeywordsVisible">
                <view class="cu-bar bg-white">
                    <view class="action border-title">
                        <text class="text-xl text-bold">历史搜索</text>
                        <text class="bg-grey" style="width: 2em"></text>
                    </view>
                    <view class="action" @tap="clearHistoryKeywords">
                        <text class="cuIcon-delete"></text>
                    </view>
                </view>
                <view class="padding">
                    <view
                        class="cu-tag radius"
                        v-for="(item, index) in historyKeywords"
                        :key="index"
                        @click="search(item)"
                    >
                        {{ item }}
                    </view>
                </view>
            </view>

            <view v-else>
                <goods-list
                    :datas.sync="filterGoodsList"
                    :emptyOptions="searchEmptyOptions"
                    right="icon"
                    paddingTop="100rpx"
                    @rightIconTap="showCartModal"
                >
                </goods-list>
            </view>
        </view>

        <!--商品-->
        <goods-list
            :datas.sync="list"
            :emptyOptions="goodsEmptyOptions"
            right="icon"
            paddingTop="100rpx"
            group
            scroll
            @rightIconTap="showCartModal"
        />

        <!--添加购物车弹窗-->
        <view
            class="cu-modal bottom-modal"
            :class="{ show: cartModalVisible }"
            @click="cartModalVisible = false"
        >
            <view
                class="cu-dialog"
                @click.stop="
                    () => {
                        return false
                    }
                "
            >
                <view class="cu-bar bg-white solid-bottom">
                    <view class="action text-blue">添加到购物车</view>
                    <view
                        class="action text-gray"
                        @click="cartModalVisible = false"
                        >取消</view
                    >
                </view>
                <view class="solid-top">
                    <goods-list
                        :datas="selectedGoodsList"
                        right="number"
                        height="auto"
                        @numberChange="cartModalNumChange"
                    >
                    </goods-list>
                    <view class="cu-bar bg-white tabbar border shop">
                        <view class="bg-orange submit" @click="addToCart"
                            >添加到购物车</view
                        >
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import goodsList from '@/components/goods-list/index.vue'
import { getGoodsWidthCate } from '@/apis/goods'
import { setStorageAsync } from '@/lib/storage/index'
export default {
    data() {
        return {
            keywords: '',
            list: [],
            filterGoodsList: [],
            historyKeywords: [],
            selectedGoodsList: [],
            selectedGoods: {},
            cartModalVisible: false,
            searchPanelVisible: false, // 是否显示搜索面板
            historyKeywordsVisible: true, // 是否显示历史记录

            // 搜索无数据提示配置
            searchEmptyOptions: {
                title: '没有查找到商品',
                text: '换个关键词试试吧'
            },
            // 商品无数据提示配置
            goodsEmptyOptions: {
                title: '该商家没有添加商品'
            }
        }
    },
    components: {
        goodsList
    },
    onLoad() {
        this.getGoods()
    },
    methods: {
        async getGoods() {
            this.goodsItems = []
            const result = (await getGoodsWidthCate()) || []
            result.forEach((item = {}) => {
                const { lines } = item

                this.goodsItems = [...this.goodsItems, ...(lines || [])]
            })

            this.list = result
        },

        // 显示搜索面板
        showSearchPanel() {
            this.searchPanelVisible = true
            this.historyKeywords =
                this.$getStorage(this.$constants.HISTORY_KEYWORDS) || []
        },
        // 隐藏搜索面板
        hideSearchPanel() {
            this.keywords = ''
            this.searchPanelVisible = false
        },

        // 清空历史搜索记录
        clearHistoryKeywords() {
            this.historyKeywords = []
            setStorageAsync(this.$constants.HISTORY_KEYWORDS, [])
        },

        search(keywords) {
            if (keywords) {
                const historyKeywordsOld =
                    this.$getStorage(this.$constants.HISTORY_KEYWORDS) || []
                const lines = this.goodsItems.filter((item) =>
                    item.name.includes(keywords)
                )

                if (!historyKeywordsOld.includes(keywords)) {
                    const historyKeywords = [keywords, ...historyKeywordsOld]
                    this.historyKeywords = historyKeywords
                    setStorageAsync(
                        this.$constants.HISTORY_KEYWORDS,
                        historyKeywords
                    )
                }

                this.keywords = keywords
                this.historyKeywordsVisible = false
                this.filterGoodsList = lines.length > 0 ? [{ lines }] : []
            } else {
                this.filterGoodsList = []
            }
        },

        // 显示添加购物车弹窗
        showCartModal(goods = {}) {
            this.selectedGoods = goods
            this.$set(this.selectedGoods, 'quantity', 1)
            this.cartModalVisible = true
        },

        // 添加购物车弹窗数字组件值改变
        cartModalNumChange(data = {}) {
            this.selectedGoods.quantity = data.value
        }
    }
}
</script>

<style lang="scss" scoped>
.home-wrap {
    /*搜索*/
    .search-box {
        z-index: 9;
        transition: all 0.15s ease;

        .search-clear {
            font-size: 32rpx !important;
        }
    }

    .search-panel {
        position: absolute;
        z-index: 8;
        padding-top: 100rpx;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background-color: $uni-white;
        transition: all 0.15s ease;
        overflow: hidden;

        &.show {
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
        }

        .cu-tag {
            margin-right: 20rpx;
            margin-bottom: 20rpx;

            + .cu-tag {
                margin-left: 0;
            }
        }

        .search-empty {
            position: absolute;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;

            &-icon {
                width: 240rpx;
                height: 240rpx;
                background: url('../../static/imgs/empty.png') no-repeat center;
                background-size: contain;
            }
        }
    }

    .cart-add-btn {
        width: 100%;
        border-radius: 0;
    }
}
</style>
