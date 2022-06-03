<template>
    <view class="cart">
        <goods-list
            :datas.sync="cart"
            :emptyOptions="emptyOptions"
            right="number"
            paddingBottom="100rpx"
            group
            selectable
            removeable
            @change="cartChange"
        >
        </goods-list>
    </view>
</template>

<script>
import goodsList from '@/components/goods-list/index.vue'
import { setStorageAsync } from '@/lib/storage/index'

export default {
    data() {
        return {
            cart: {},
            emptyOptions: {
                title: '购物车还没有商品',
                text: '赶紧来添加吧'
            }
        }
    },
    components: { goodsList },
    onShow() {
        this.getCartStorage()
    },
    methods: {
        getCartStorage() {
            this.cart = this.$getStorage(this.$constants.CART) || {}
        },

        cartChange() {
            setStorageAsync(this.$constants.CART, this.cart)
        }
    }
}
</script>
