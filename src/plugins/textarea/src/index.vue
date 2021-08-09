
<template>
  <div class="qk-textarea">
    <textarea class="qk-textarea-item" :readonly="enable" :name="namedate" :placeholder="placeholder" v-model="tempValue" />
  </div>
</template>

<script>
export default {
  name: 'QkTextarea',
  props: {
     // 是否必输
    mustLose:{
      type:Boolean,
      default:false
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    value: {
      require: true,
      default: '',
    },
    textarea:{
      default: '',
      require: true,
    },
    names:{
      type: String,
      default: '',
    },
    enable:{
      type:Boolean,
      default:true
    },
    title:{
      type: String,
      default: '请输入',
    }
  },
  data() {
    return {
      tempValue: '',
      namedate:''
    }
  },
  mounted() {
    this.tempValue = this.value
    this.namedate = this.names
  },
  watch: {
    value(val) {
      this.tempValue = val
    },
    tempValue(val) {
      this.$emit('input', val)
    },
  },
}
</script>

<style lang="scss" scoped>
.qk-textarea-item {
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  cursor: move;
  background: rgba(0,0,0,0);
}
</style>
