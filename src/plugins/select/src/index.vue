<template>
  <div class="qkselect">
    <el-select
      :style="{ height: heights + 'px' }"
      :popper-append-to-body="true"
      v-model="optins"
      :placeholder="placeholder"
    >
      <el-option
        :style="{ background: vbColor, color: valColor }"
        :label="item.label"
        v-for="(item, index) in select"
        :key="index"
        :value="item.label"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "QkSelect",
  computed: {
    ...mapGetters(["activeElement"]),
  },
  props: {
     // 是否必输
    mustLose:{
      type:Boolean,
      default:false
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    select: {
      type: Array,
      default: () => {
        return [
          {
            label: "选项1",
          },
          {
            label: "选项2",
          },
          {
            label: "选项3",
          },
        ];
      },
      require: true,
    },
    valColor: String,
    vbColor: String,
    value: {
      type: String,
    },
    names: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "请选择",
    },
  },
  watch: {
    "activeElement.commonStyle.height"(val) {
      this.heights = val;
    },
    optins(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      heights: "",
      optins: "",
    };
  },
  mounted() {
    this.heights = this.activeElement.commonStyle.height;
    this.optins = this.value;
  },
};
</script>
<style>
.qkselect .el-select {
  width: 100%;
  height: 100%;
}
.qkselect .el-input {
  height: 95%;
}
.qkselect .el-input input {
  height: 100%;
  border: none;
  background: rgba(0, 0, 0, 0);
}
.el-select-dropdown__list {
  padding: 0 0;
}
.popper__arrow::after {
  border-bottom-color: rgba(0, 0, 0, 0) !important;
}
/* .qkselect .el-input.is-disabled .el-input__inner{
    background-color: #fff;
    border: none;
    box-sizing: border-box;
    color: #333;
    height: 100%;
}
.qkselect .el-select .el-input.is-disabled .el-input__inner:hover{
    border: none;
    height: 100%;
}*/
.qkselect .el-select .el-input .el-input__inner{
  cursor:move;
} 
</style>
