<template>
<div>
  <el-form-item>
      <template slot="label" >
        <span>输入英文表单名<span style="color:red">（必输）</span>：</span>
      </template>
      <el-input type="text" v-model="formname" maxlength="10" show-word-limit>
      </el-input>
  </el-form-item>
</div>
</template>

<script>
export default {
  name: 'attr-qk-textarea',
  props: {
    textarea: String,
    value:String,
    names:String
  },
  data() {
    return {
      formname:''
    }
  },
  mounted() {
    this.formname = this.names
  },
  watch: {
    formname(val){
        this.formname = val.replace(/[^\a-zA-Z]/g,'')
        this.$emit('update:names', this.formname)
    }
  },
  methods:{
  }
}
</script>

<style scoped>
</style>
