<template>
  <div>
    <!-- 验证码占位提示 -->
    <el-form-item label="验证码占位提示：">
      <el-input type="text" v-model="codetext" maxlength="50" show-word-limit>
      </el-input>
    </el-form-item>
    <!-- 主题颜色 -->
    <el-form-item label="主题颜色：">
      <el-color-picker
        size="mini"
        @change="changeColor"
        v-model="vColor"
      ></el-color-picker>
    </el-form-item>
    <!-- 输入字体颜色 -->
    <el-form-item label="输入字体颜色：">
      <el-color-picker
        size="mini"
        v-model="activeElement.commonStyle.color"
      ></el-color-picker>
    </el-form-item>
    <!-- 按钮背景 -->
    <el-form-item label="按钮背景：">
      <el-color-picker
        size="mini"
        @change="changeBgcolor"
        v-model="valueBgColor"
      ></el-color-picker>
    </el-form-item>
    <el-form-item label="按钮文字颜色：">
      <el-color-picker
        size="mini"
        @change="changeVolor"
        v-model="cdColor"
      ></el-color-picker>
    </el-form-item>
    <el-form-item label="主题高度：">
      <el-input-number
        size="mini"
        v-model="bordHeight"
        controls-position="right"
        :min="0"
      />
    </el-form-item>
    <el-form-item label="主题边框尺寸：">
    
          <el-input-number
            size="mini"
            v-model="borderSty"
            @change="throttle"
            controls-position="right"
            :min="0"
          />
    </el-form-item>   
    <el-form-item label="主题边框颜色：">
          <el-color-picker
            size="mini"
            @change="throttleCol"
            v-model="borderColor"
          ></el-color-picker>
    </el-form-item>
    <el-form-item label="主题边框样式："> 
          <el-select
            v-model="borderStyle"
            @change="throttleSelt"
            size="mini"
          >
            <el-option
              v-for="item in borderStyleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
       
    </el-form-item>
    <el-form-item label="主题边框圆弧：">
      <el-input-number
              size="mini"
              @change="throttleRadius"
              v-model="borderRadius"
              controls-position="right"
              :min="0"
            />
    </el-form-item>
    <!-- 选项设置 每项最多100字 -->
    <!-- <el-form-item>
      <span>选项背景：</span>
      <span class="cfont">每项最多100字</span>
    </el-form-item>
    <el-form-item v-for="(item, index) in checkBox" :key="index">
      <el-col :span="20">
        <el-input type="text" v-model="item.label" maxlength="100"> </el-input>
      </el-col>
      <i class="mages iconfont iconfuzhi" @click="copyCheck(index)"></i>
      <i class="mages iconfont iconshanchu" @click="deltCheck(index)"></i>
    </el-form-item> -->
    <!-- 设为必填 -->
  </div>
</template>
<script>
import { cloneDeep } from "lodash";
import { mapGetters } from "vuex";
export default {
  name: "attr-qk-phone",
  props: {
    codeholder: String,
    valColor: String,
    bgcolor: String,
    codColor: String,
    vheight: Number,
    vBorder: Number,
    vborderColor:String,
    vborderStyle:String,
    vborderRadius:Number,
    names:String
  },
  computed: {
    ...mapGetters(["activeElement"]),
  },
  data() {
    return {
      codetext: "",
      valueBgColor: "",
      vColor: "",
      checkBox: [],
      cdColor: "",
      bordHeight: "",
      borderSty: "",
      borderStyleList: [
        {
          label: "实线",
          value: "solid",
        },
        {
          label: "虚线",
          value: "dashed",
        },
        {
          label: "点状",
          value: "dotted",
        },
        {
          label: "双线",
          value: "double",
        },
      ],
      borderColor:'',
      borderStyle:'',
      borderRadius:''
    };
  },
  mounted() {
    this.vColor = this.valColor;
    this.codetext = this.codeholder;
    this.valueBgColor = this.bgcolor;
    this.cdColor = this.codColor;
    this.bordHeight = this.vheight;
    this.borderSty = this.vBorder;
    this.borderStyle = this.vborderStyle;
    this.borderColor = this.vborderColor;
    this.borderRadius = this.vborderRadius
  },
  watch: {
    codetext(val) {
      this.$emit("update:codeholder", val);
    },
    bordHeight(val) {
      this.$emit("update:vheight", val);
    },
    
  },
  methods: {
    changeColor() {
      this.$emit("update:valColor", this.vColor);
    },
    changeBgcolor() {
      this.$emit("update:bgcolor", this.valueBgColor);
    },
    changeVolor() {
      this.$emit("update:codColor", this.cdColor);
    },
    throttle() {
      this.$emit("update:vBorder", this.borderSty);
    },
    throttleCol(){
      this.$emit("update:vborderColor", this.borderColor);
    },
    throttleSelt(){
      this.$emit("update:vborderStyle", this.borderStyle);
    },
    throttleRadius(){
      this.$emit("update:vborderRadius", this.borderRadius);
    }
  },
};
</script>
<style scoped>
</style>
