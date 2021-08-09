<!--test.vue-->
<template>
  <div class="qk-image">
    <img :src="imageSrc | replaceIP" alt="">
  </div>
</template>

<script>
export default {
  name: 'QkImage', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  props: {
    imageSrc: {
      type: String,
      // default: require('@src/common/images/4111.jpg'),
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.qk-image {
  width: 100%;
  height: 100%;
}
img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
