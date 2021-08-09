<template>
  <div>
    <!-- 选项颜色 -->
    <el-form-item label="选项颜色：">
      <el-color-picker
        size="mini"
        @change="changeColor"
        v-model="valbColor"
      ></el-color-picker>
    </el-form-item>
    <!-- 选项背景 -->
    <el-form-item label="选中颜色：">
      <el-color-picker
        size="mini"
        @change="changeBgcolor"
        v-model="valueColor"
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
      <span>选项：</span>
      <span class="cfont">每项最多100字</span>
    </el-form-item>
    <el-form-item v-for="(item, index) in selectList" :key="index">
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
  name: "attr-qk-select",
  props: {
    valColor: String,
    vbColor:String,
    select:Array,
    names:String,
  },
    computed: {
    ...mapGetters(["activeElement"]),
  },
  data() {
    return {
      valbColor: "",
      valueColor:'',
      selectList:[],
      // formname:''
    };
  },
  mounted() {
    this.valbColor = this.vbColor;
    this.valueColor = this.valColor;
    // this.formname = this.names;
    this.selectList = this.select;
  },
  watch: {
    formname(val) {
      this.formname = val.replace(/[^\a-zA-Z]/g,'')
      this.$emit("update:names", this.formname);
    },
    selectList:{
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.$emit("update:select", newValue);
      }
    }
  },
  methods: {
    // 选项颜色：
    changeColor() {
      this.$emit("update:vbColor", this.valbColor);
    },
    // 选中颜色：
    changeBgcolor() {
      this.$emit("update:valColor", this.valueColor);
    },

    copyRadio(n){
       let copDom = this.selectList[n];
      //将一个或多个新元素插入到数组的指定位置，插入位置的元素自动后移，返回""
      let arr = cloneDeep(this.selectList);
      arr.splice(n, 0, copDom);
      this.selectList = arr;
      this.$emit("update:select", this.selectList);
    },
    deltRadio(n){
        this.selectList.splice(n, 1);
    }
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
