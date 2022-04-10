<template>
    <el-card>
        <el-row>
            <h2 class="content-title">
                <i class="el-icon-tickets"></i> 基本信息
            </h2>
            <section class="goods-panel">
                <el-carousel
                    class="goods-images"
                    :autoplay="false"
                    height="240px"
                >
                    <el-carousel-item v-for="item in imagesList" :key="item">
                        <safe-img
                            :src="item"
                            width="240px"
                            height="240px"
                        ></safe-img>
                    </el-carousel-item>
                </el-carousel>
                <div class="goods-data">
                    <h3 class="goods-name">{{ goodsData.name }}</h3>
                    <p>
                        类别：<span class="text-bold">{{
                            goodsData.categoryName
                        }}</span>
                    </p>
                    <p>
                        规格：<span class="text-bold">{{
                            goodsData.spec
                        }}</span>
                    </p>
                    <p>
                        单位：<span class="text-bold">{{
                            goodsData.unitName
                        }}</span>
                    </p>
                    <p>
                        售价：<span class="text-red text-bold"
                            >¥ {{ goodsData.salePrice }}</span
                        >
                    </p>
                    <p>
                        状态：
                        <!-- <span
                            class="badge"
                            :class="goods.status | formatGoodsStatusToClass"
                        >
                            {{ goods.status | formatGoodsStatusToCN }}
                        </span> -->
                    </p>
                </div>
            </section>
        </el-row>
        <el-row class="mt-20">
            <h2 class="content-title">
                <i class="el-icon-goods"></i> 商品介绍
            </h2>
            <div class="goods-info">{{ goodsData.info || '暂无介绍' }}</div>
        </el-row></el-card
    >
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { goodsDetail } from '@/apis/goods'

export default defineComponent({
    name: 'goodsView',

    setup() {
        // 路由
        const route = useRoute()

        const goodsData = reactive({
            name: '',
            categoryUuid: '',
            spec: '',
            unitName: '',
            status: '',
            salePrice: 0,
            goodsInfo: '',
            thumbnail: '',
            imagesJsonStr: ''
        })

        const imagesList = ref([])
        // 获取商品
        const getGoodsDetail = () => {
            goodsDetail({ uuid: route.query.goodsUuid }).then(
                ({ code, data }) => {
                    if (code === 200) {
                        data.salePrice = +data.salePrice
                        imagesList.value =
                            (data.imagesJsonStr &&
                                JSON.parse(data.imagesJsonStr)) ||
                            []
                        Object.assign(goodsData, data)
                    }
                }
            )
        }
        getGoodsDetail()

        return {
            imagesList,
            goodsData
        }
    }
})
</script>

<style lang="scss" scoped>
.goods-panel {
    width: 100%;
    display: flex;

    .goods-images {
        flex: 0 0 240px;
        border: 1px solid #eee;
        border-radius: 6px;
        background: url('../../../assets/no-pic.png') no-repeat;
        background-size: 70%;
        background-position: 50% 50%;
    }

    .goods-data {
        flex: 1;
        padding-left: 30px;
        font-size: 16px;
        line-height: 2.2;

        .goods-name {
            font-size: 22px;
            font-weight: bold;
        }
    }
}
</style>
