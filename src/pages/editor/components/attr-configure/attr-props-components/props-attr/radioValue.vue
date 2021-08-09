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
      <template slot="label" >
        <span>输入英文表单名<span style="color:red">（必输）</span>：</span>
      </template>
      <el-input type="text" v-model="formname" maxlength="10" show-word-limit>
      </el-input>
  </el-form-item> -->
    <!-- 选项设置 每项最多100字 -->
    <el-form-item>
      <span>选项：</span>
      <span class="cfont">每项最多100字</span>
    </el-form-item>
    <el-form-item v-for="(item, index) in radioVal" :key="index">
      <el-col :span="20">
        <el-input type="text" v-model="item.label" maxlength="100"> </el-input>
      </el-col>
      <i class="mages iconfont iconfuzhi" @click="copyRadio(index)"></i>
      <i class="mages iconfont iconshanchu" @click="deltRadio(index)"></i>
    </el-form-item>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { cloneDeep } from "lodash";
export default {
  name: "attr-qk-radioValue",
  props: {
    title: String,
    value: String,
    bgcolor: String,
    radioValue: Array,
    names:String
  },
  data() {
    return {
      text: "",
      valueBgColor: "",
      valColor: "",
      radioVal: [],
      // formname:''
    };
  },
  computed: {
    ...mapGetters(["activeElement"]),
  },
  mounted() {
    this.text = this.title;
    this.valueBgColor = this.bgcolor;
    // this.formname = this.names
  },
  watch: {
    // formname(val){
    //     this.formname = val.replace(/[^\a-zA-Z]/g,'')
    //     this.$emit('update:names', this.formname)
    // },
    text() {
      this.$emit("update:title", this.text);
    },
    bgcolor(val){
      this.valueBgColor = val;
    },
    valColor(val) {
      for (let i in this.radioVal) {
        this.radioVal[i].color = val;
      }
      this.$emit("update:radioValue", this.radioVal);
    },
    radioValue: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.radioVal = this.radioValue;
        if (this.radioVal.length > 0) {
          this.valColor = this.radioVal[0].color;
        }
      },
    },
    radioVal:{
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.$emit("update:value", '');
      }
    }
  },
  methods: {
    // 选项背景
    changeBgcolor() {
      this.$emit("update:bgcolor", this.valueBgColor);
    },
    // 主题颜色
    changeColor() {
      for (let i in this.radioVal) {
        this.radioVal[i].color = this.valColor;
      }
    },
    // 复制选项
    copyRadio(n) {
      let copDom = this.radioVal[n];
      //将一个或多个新元素插入到数组的指定位置，插入位置的元素自动后移，返回""
      let arr = cloneDeep(this.radioVal);
      arr.splice(n, 0, copDom);
      this.radioVal = arr;
      this.$emit("update:radioValue", this.radioVal);
    },
    // 删除选项
    deltRadio(n) {
      this.radioVal.splice(n, 1);
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
