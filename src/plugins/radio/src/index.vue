<template>
   <el-row> 
    <el-col :span="24" class="radio-mar">{{title}}</el-col>
    <el-col :style="{'background':bgcolor?bgcolor:''}">
        <el-radio-group v-model="values" class="cColor">
            <el-radio class="radioRow" :name="namedate" :style="{color:item.color}" :label="item.label" v-for="(item , index) in radioValue" :key="index"></el-radio>
        </el-radio-group>
    </el-col>
   </el-row>
</template>
<script>
export default {
  name: 'QkRadio', // 这个名字很重要，它就是未来的标签名<qk-radio></qk-radio>
  props: {
     // 是否必输
    mustLose:{
      type:Boolean,
      default:false
    },
    title: {
      type: String,
      default: '选项标题',
    },
    // resource:{
    //   type: String,
    //   default: '', // 选中
    // },
    bgcolor:{
      type: String,
      default: '', // 选项背景颜色
    },
    radioValue:{
      type: Array,
      default: () => {
        return [
          {
            label:'选项1',
            color:'', // 选项/主题颜色
          },
          {
            label:'选项2',
            color:'',
          },
          {
            label:'选项3',
            color:'',
          },
        ]
      },
    },
    value:{
       type: String,
       default: '', // 选中
    },
    names:{
      type: String,
      default: '', 
    }
  },
  data() {
    return {
      values:'', // 选中
      namedate:''
    }
  },
  watch: {
    // resource(val){
    //     this.values = val
    // },
    values(val){
      this.$emit('input', val)
    },
    radioValue:{
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
　　　　　return newValue
　　　}
    },
  },
  mounted() {
    this.values = this.value
    this.namedate = this.names
  },
  methods:{
  }
}
</script>

<style lang="scss" scoped>
.radio-mar{
    margin: 5px 0;
}
.radioRow{
    width: 100%;
    margin: 5px 0;
    cursor: move;
}
.radioRow .el-checkbox{
   cursor: move;
}
</style>
