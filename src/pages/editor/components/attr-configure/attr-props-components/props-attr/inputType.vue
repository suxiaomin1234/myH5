<template>
<div>
  <el-form-item label="输入类型：">
    <el-select v-model="temType" placeholder="请选择" size="small">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </el-form-item>
  <!-- <el-form-item>
      <template slot="label" >
        <span>输入英文表单名<span style="color:red">（必输）</span>：</span>
      </template>
      <el-input type="text" v-model="formname" maxlength="10" show-word-limit>
      </el-input>
  </el-form-item> -->
  <!-- 输入文本 -->
  <!-- <el-form-item label="文本：">
    <el-input
        type="text"
        v-model="text"
        maxlength="12"
        show-word-limit
      >
    </el-input>
  </el-form-item> -->
</div>
</template>

<script>
export default {
  name: 'attr-qk-type',
  props: {
    type: String,
    value:String,
    names:String
  },
  data() {
    return {
      temType: '',
      options: [
        {
          label: '文本框',
          value: 'text',
        },
        {
          label: '密码输入框',
          value: 'password',
        },
        {
          label: '电话号码',
          value: 'tel',
        },
        {
          label: 'email地址',
          value: 'email',
        },
        {
          label: '数字',
          value: 'number',
        },
      ],
      text:"",
      // formname:''
    }
  },
  mounted() {
    this.temType = this.type
    // this.formname = this.names
    this.getValue()
  },
  watch: {
    type(val) {
      this.temType = val
      this.getValue()
    },
    temType() {
      this.$emit('update:type', this.temType)
    },
    text(val){
      this.$emit('update:value', val)
      // this.$emit('update:tempValue', val)
    },
    // formname(val){
    //     this.formname = val.replace(/[^\a-zA-Z]/g,'')
    //     this.$emit('update:names', this.formname)
    // }
  },
  methods:{
    getValue(){
      for(let i in this.options){
        if(this.options[i].value == this.temType && this.temType!='number'){
          // this.text = this.options[i].label
        }
        if(this.options[i].value == this.temType && this.temType =='number'){
          // this.text = ''
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
