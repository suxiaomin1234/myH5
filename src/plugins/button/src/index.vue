<!--button.vue-->
<template>
  <div class="qk-button">
    {{ button }}
  </div>
</template>

<script>
export default {
  name: "QkButton", // 这个名字很重要，它就是未来的标签名
  props: {
    button: {
      type: String,
      default: "按 钮",
    },
    // 提交全局表单内容还是当前页面表单内容
    onoff: {
      type: Boolean,
      default: true, // true 提交全局
    },
    // 是否提交到默认地址
    subSure: {
      type: Boolean,
      default: true,
    },
    // 提交表单服务器地址
    postNew: {
      type: String,
      default: "",
    },
    title:{
      type: String,
      default: "按 钮",
    }
  },
  watch: {},
  methods: {
   
  },
};
</script>

<style lang="scss" scoped></style>
