<template>
  <view class="home-wrap">
    <!--搜索栏-->
    <view class="search-box cu-bar" :class="{ 'bg-blue': !searchPanelVisible }">
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
          @tap="keywords = ''"
        ></view>
      </view>
      <view
        v-if="searchPanelVisible"
        class="action text-gray"
        @tap="hideSearchPanel"
      >
        取消
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchPanelVisible: false
    }
  },
  onLoad() {},
  methods: {}
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
        background: url('../../static/imgs/data-empty.png') no-repeat center;
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
