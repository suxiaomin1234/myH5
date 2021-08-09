<template>
  <el-row>
    <el-col :span="24" class="checkbox-mar">{{ title }}</el-col>
    <el-col :span="24" :style="{ 'background': bgcolor?bgcolor:'' }">
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          class="checkboxRow" :style="{color:item.color}" 
          :disabled="item.disabled"
          :label="item.label"
          v-for="(item, index) in checkbox"
          :key="index"
          :name="namedate"
        ></el-checkbox>
      </el-checkbox-group>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "QkCheckbox",
  props: {
     // 是否必输
    mustLose:{
      type:Boolean,
      default:false
    },
    title: {
      type: String,
      default: "选项标题",
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    bgcolor: {
      type: String,
      default: "",
    },
    checkbox: {
      type: Array,
      default: () => {
        return [
          {
            label: "选项1",
            color: "", // 选项/主题颜色
            disabled: false,
          },
          {
            label: "选项2",
            color: "",
            disabled: false,
          },
          {
            label: "选项3",
            color: "",
            disabled: false,
          },
        ];
      },
    },
    names:{
      type: String,
      default: "",
    }
  },
  data() {
    return {
        checkList:[],
        namedate:''
    };
  },
  watch: {
    checkList: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.$emit('input',newValue)
      },
    },
    checkbox: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        return newValue;
      },
    },
  },
};
</script>
<style scoped>
.el-checkbox {
  width: 90%;
  margin-top: 5px;
}
.checkbox-mar{
    margin: 5px 0;
}
.checkboxRow{
    width: 100%;
    margin: 5px 0;
    cursor: move;
}
</style>
