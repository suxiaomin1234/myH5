<!--test.vue-->
<template>
  <div class="qk-image-carsousel" style="width: 100%;height: 100%;">
    <!--异步加载轮播图的情况;-->
    <Swiper class="image-carsousel-swiper" v-if="imageSrcList.length > 0&&flag" :autoPlay='true' :showIndicator='true' :interval="interval" duration="500">
      <Slide class="image-carsousel-slide" v-for="(item,index) in imageSrcList" :key="index">
        <img class="image-carsousel-image" :src="item | replaceIP" alt="" crossorigin="anonymous">
      </Slide>
    </Swiper>
  </div>
</template>

<script>
import { Swiper, Slide } from 'vue-swiper-component'
export default {
  name: 'QkImageCarousel', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  components: {
    Swiper,
    Slide,
  },
  props: {
    imageSrcList: {
      type: Array,
      default: () => {
        // return [
        //   require('@src/common/images/4111.jpg'),
        //   require('@src/common/images/4111.jpg'),
        //   require('@src/common/images/4111.jpg'),
        // ]
        return ['', '', '']
      },
    },
    interval: {
      type: Number,
      default: 2500,
    },
  },
  watch: {
    imageSrcList(val) {
      this.flag = false
      let _this = this
      setTimeout(function(){_this.flag = true},50)
    }
  },
  data() {
    return {
      flag:true
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.image-carsousel-swiper,
.image-carsousel-slide,
.image-carsousel-image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.image-carsousel-swiper .wh_swiper {
  height: 100%;
}
.wh_show_bgcolor {
  background: $primary;
}
</style>
