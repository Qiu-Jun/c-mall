<template>
    <div
        class="safe-img-box"
        :class="{ 'safe-img-error': error || !src }"
        :style="{ width, height }"
    >
        <img
            v-if="!error && src"
            class="safe-img"
            :src="src"
            @error="handleError"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '100%'
    },
    src: {
        type: String,
        required: true
    }
})

const error = ref(false)
const propsSrc = ref(props.src)
watch(propsSrc, () => {
    error.value = false
})
const handleError = () => {
    error.value = true
}
</script>

<style lang="scss" scoped>
.safe-img-box {
    position: relative;
    display: inline-block;
    vertical-align: middle;

    &.safe-img-error {
        background-color: #efefef;
    }

    .safe-img {
        width: 100%;
        height: 100%;
        vertical-align: auto;
    }
}
</style>
