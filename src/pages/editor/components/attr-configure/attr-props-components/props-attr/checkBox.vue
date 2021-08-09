<template>
  <div>
    <!-- 标题文本 -->
    <el-form-item label="标题文本：">
      <el-input type="text" v-model="text" maxlength="50" show-word-limit>
      </el-input>
    </el-form-item>
    <!-- 主题颜色 -->
    <el-form-item label="主题颜色：">
      <el-color-picker
        size="mini"
        @change="changeColor"
        v-model="valColor"
      ></el-color-picker>
    </el-form-item>
    <!-- 标题颜色 -->
    <el-form-item label="标题颜色：">
      <el-color-picker
        size="mini"
        v-model="activeElement.commonStyle.color"
      ></el-color-picker>
    </el-form-item>
    <!-- 选项背景 -->
    <el-form-item label="选项背景：">
      <el-color-picker
        size="mini"
        @change="changeBgcolor"
        v-model="valueBgColor"
      ></el-color-picker>
    </el-form-item>
    <!-- <el-form-item>
      <template slot="label">
        <span>输入英文表单名<span style="color:red">（必输）</span>：</span>
      </template>
      <el-input type="text" v-model="formname" maxlength="10" show-word-limit>
      </el-input>
    </el-form-item> -->
    <!-- 选项设置 每项最多100字 -->
    <el-form-item>
      <span>选项背景：</span>
      <span class="cfont">每项最多100字</span>
    </el-form-item>
    <el-form-item v-for="(item, index) in checkBox" :key="index">
      <el-col :span="20">
        <el-input type="text" v-model="item.label" maxlength="100"> </el-input>
      </el-col>
      <i class="mages iconfont iconfuzhi" @click="copyCheck(index)"></i>
      <i class="mages iconfont iconshanchu" @click="deltCheck(index)"></i>
    </el-form-item>
    <!-- 设为必填 -->
  </div>
</template>
<script>
import { cloneDeep } from "lodash";
import { mapGetters } from "vuex";
export default {
  name: "attr-qk-checkbox",
  props: {
    title: String,
    checkList: Array,
    bgcolor: String,
    checkbox: Array,
    names: String,
  },
  computed: {
    ...mapGetters(["activeElement"]),
  },
  data() {
    return {
      text: "",
      valueBgColor: "",
      valColor: "",
      checkBox: [],
      // formname: "",
    };
  },
  mounted() {
    this.text = this.title;
    this.valueBgColor = this.bgcolor;
    // this.formname = this.names;
  },
  watch: {
    // formname(val) {
    //   this.formname = val.replace(/[^\a-zA-Z]/g, "");
    //   this.$emit("update:names", this.formname);
    // },
    text(val) {
      this.$emit("update:title", val);
    },
    bgcolor(val) {
      this.valueBgColor = val;
    },
    valColor(val) {
      for (let i in this.checkBox) {
        this.checkBox[i].color = val;
      }
      console.log(333, this.checkBox);
      this.$emit("update:checkbox", this.checkBox);
    },
    checkbox: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.checkBox = this.checkbox;
        if (this.checkBox.length > 0) {
          this.valColor = this.checkBox[0].color;
        }
      },
    },
  },
  methods: {
    changeColor() {
      for (let i in this.checkBox) {
        this.checkBox[i].color = this.valColor;
      }
      console.log(333222, this.checkBox);
    },
    changeBgcolor() {
      console.log(111, this.valueBgColor);
      this.$emit("update:bgcolor", this.valueBgColor);
    },
    copyCheck(n) {
      let copDom = this.checkBox[n];
      //将一个或多个新元素插入到数组的指定位置，插入位置的元素自动后移，返回""
      let arr = cloneDeep(this.checkBox);
      arr.splice(n, 0, copDom);
      this.checkBox = arr;
      this.$emit("update:checkbox", this.checkBox);
    },
    deltCheck(n) {
      this.checkBox.splice(n, 1);
    },
  },
};
</script>
<style scoped>
.cfont {
  color: #cdcdcd;
  text-align: right;
  font-size: 12px;
  float: right;
}
.mages {
  margin: 0px 5px;
}
</style>
