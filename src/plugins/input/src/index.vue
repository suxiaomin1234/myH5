<!--input.vue-->
<template>
  <div class="qk-input element-on-edit-pane">
    <input class="qk-input-item" :readonly="enable" :name="nameDate" v-model="templateValue" :placeholder="placeholder" :type="type">
  </div>
</template>

<script>
export default {
  name: 'QkInput',
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
    },
    type: {
      type: String,
      default: 'text',
    },
    tempValue:{
      default: '',
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
      templateValue: '',
      nameDate:''
    }
  },
  created() {
    this.templateValue = this.value;
    this.nameDate = this.names;
  },
  watch: {
    templateValue(val) {
      // 去除空格
      if(val){
        this.templateValue = val.replace(/\s/g,"");
      }
      this.$emit('input', this.templateValue)
    },
    tempValue(val) {
      this.templateValue = val
    },
  },
}
</script>

<style lang="scss" scoped>
.qk-input-item {
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  cursor: move;
  background: rgba(0,0,0,0);
}

</style>
