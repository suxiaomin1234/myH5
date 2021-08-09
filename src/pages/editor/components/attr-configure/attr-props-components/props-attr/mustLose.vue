<template>
  <el-form-item label="设为必填">
    <el-switch v-model="mustFill" active-text="是" inactive-text="否">
    </el-switch>
  </el-form-item>
</template>
<script>
export default {
  name: "attr-qk-mustLose",
  props: {
    mustLose: Boolean,
  },
  data() {
    return {
      mustFill: false,
    };
  },
  mounted() {
    this.mustFill = this.mustLose;
  },
  watch: {
    mustLose(val) {
      this.mustFill = val;
    },
    mustFill() {
      this.$emit("update:mustLose", this.mustFill);
    },
  },
};
</script>
