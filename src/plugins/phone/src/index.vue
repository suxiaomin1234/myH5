<template>
  <el-row>
    <el-col :span="24">
      <input
        :style="{
          background: valColor ? valColor : 'transparent',
          height: vheight + 'px',
          'border-width': vBorder + 'px',
          'border-color': vborderColor,
          'border-style': vborderStyle,
          'border-radius': vborderRadius + 'px',
        }"
        class="qk-input-item"
        v-model="phoneNum"
        :placeholder="placeholder"
        maxlength="11"
        type="tel"
      />
    </el-col>
    <el-col :span="24">
      <el-row class="magetop">
        <el-col :span="12">
          <input
            :style="{
              background: valColor ? valColor : 'transparent',
              height: vheight + 'px',
              'border-width': vBorder + 'px',
              'border-color': vborderColor,
              'border-style': vborderStyle,
              'border-radius': vborderRadius + 'px',
            }"
            class="qk-input-item"
            v-model="codeVal"
            :placeholder="codeholder"
            maxlength="6"
            type="tel"
          />
        </el-col>
        <el-col :span="11" style="float:right">
          <div
            @click="getCodes"
            class="qk-button-code"
            :style="{
              background: bgcolor,
              'border-color': bgcolor,
              'border-width': vBorder + 'px',
              'border-style': vborderStyle,
              'border-radius': vborderRadius + 'px',
              color: codColor,
              height: vheight + 'px',
            }"
          >
            <span v-if="onoff">{{ button }}</span>
            <span v-else>{{ times }}s后重新获取</span>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "QkPhone",
  props: {
    placeholder: {
      type: String,
      default: "请输入手机号",
    },
    codeholder: {
      type: String,
      default: "请输入验证码",
    },
    phone: {
      require: true,
    },
    // 输入框背景颜色
    valColor: {
      type: String,
      default: "",
    },
    // 按钮背景颜色
    bgcolor: {
      type: String,
      default: "#ccc",
    },
    // 按钮文字颜色
    codColor: {
      type: String,
      default: "#fff",
    },
    // 输入框高度
    vheight: {
      type: Number,
      default: 40,
    },
    // 输入框边框尺寸
    vBorder: {
      type: Number,
      default: 1,
    },
    // 输入框边框颜色
    vborderColor: {
      type: String,
      default: "#333",
    },
    // 边框样式
    vborderStyle: {
      type: String,
      default: "solid",
    },
    // 边框圆弧
    vborderRadius: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
    },
    names: {
      type: String,
      default: "",
    },
    title:{
      type: String,
      default: "手机号验证",
    }
  },
  data() {
    return {
      type: Number,
      phoneNum: "",
      codeVal: "",
      button: "获取验证码",
      fontSize: "",
      onoff: true,
      times: 60,
    };
  },
  watch: {
    phoneNum(val) {
      this.phoneNum = val.replace(/[^\d]/g, ""); //清除“数字”以外的字符
    },
    // 输入验证码
    codeVal(val) {
      this.codeVal = val.replace(/[^\d]/g, ""); //清除“数字”以外的字符
      let str = this.phoneNum + "-" + this.codeVal;
      this.$emit("input", str);
    },
  },
  mounted() {},
  methods: {
    getCodes() {
      // 验证手机号
      let zom = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[6]([8|6])\d{5}$/;
      if (!zom.test(this.phoneNum)) {
        this.$toast("请输入正确手机号");
        return;
      }
      this.onoff = false;
      this.setTim();
      // 请求接口
      this.$axios
        .post(this.$interParams.h5Inters.sendVCode, {
          mobileNo: this.phoneNum,
        })
        .then((data) => {
          if (data.code == "200") {
            this.onoff = false;
            this.setTim();
          } else {
            this.onoff = true;
            this.$toast(data.message);
          }
        })
        .catch((err) => {
          this.onoff = true;
          this.$toast(err.message);
        });
    },
    // 60秒倒计时
    setTim() {
      let that = this;
      clearTimeout(tim);
      // 计时器开始
      let tim = setTimeout(() => {
        if (that.times > 0) {
          that.times--;
          that.setTim();
        }
        if (that.times == 0) {
          clearTimeout(tim);
          this.onoff = true;
          that.times = 60;
        }
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.qk-input-item {
  display: block;
  width: 100%;
  height: 40px;
  padding: 0 10px;
}
.magetop {
  margin-top: 10px;
}
.qk-button-code {
  display: block;
  width: 100%;
  height: 40px;
  background: #ccc;
  line-height: 40px;
  text-align: center;
  color: #fff;
  position: relative;
  border-width: 1px;
  border-color: #ccc;
}
.qk-button-code span {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
