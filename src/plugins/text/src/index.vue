<!--test.vue-->
<template>
  <div class="qk-text" v-html="tempText">
  </div>
</template>

<script>
export default {
  name: 'QkText', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  props: {
    text: {
      type: String,
      default: '这是一段文字',
    },
  },
  data() {
    return {
      defaultStyle: {
        height: 40,
      },
      str: '',
      tempText:""
    }
  },
  watch: {
    text(n) {
      this.tempText = n.replace(/\n/g,'<br/>').replace(/ /g,' &nbsp')
    }
  },
  mounted() {
    this.tempText = this.text.replace(/\n/g,'<br/>').replace(/ /g,' &nbsp')
    // console.log(this.text)
    // const reg = new RegExp('\s', 'g')
    // this.str = this.text.replace(reg, '<br/>')
    // console.log(this.text)
    // console.log(this.str)
  },
}
</script>

<style lang="scss" scoped>
</style>
