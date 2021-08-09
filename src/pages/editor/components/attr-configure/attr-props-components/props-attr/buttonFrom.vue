<template>
  <div>
    <el-form-item label="按钮名称：">
      <el-input type="text" v-model="btnText" maxlength="12" show-word-limit>
      </el-input>
    </el-form-item>
    <el-form-item v-if="projectData.pageMode == 'h5'">
      <el-radio-group v-model="activeElement.propsValue.onoff">
        <el-radio :label="true" class="martop">提交全局表单内容</el-radio>
        <el-radio :label="false" class="martop">提交当前页面表单内容</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否提交到默认地址">
      <el-switch v-model="activeElement.propsValue.subSure" active-text="是" inactive-text="否">
      </el-switch>
    </el-form-item>
    <el-form-item label="输入提交地址" v-if="activeElement.propsValue.subSure == false">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="输入提交地址"
        v-model="newPost"
      >
      </el-input>
    </el-form-item>
  </div>
</template>
<script>
import { mapGetters,mapState } from "vuex";
export default {
  name: "attr-qk-button",
  props: {
    button: String,
    onoff: Boolean,
    subSure: Boolean,
    postNew: String,
    title:String
  },
  data() {
    return {
      btnText: "",
      newPost: "",
    };
  },
  computed: {
    ...mapState({
				projectData: state => state.editor.projectData,
			}),
    ...mapGetters(["activeElement"]),
  },
  mounted() {
    this.btnText = this.button;
    this.message = this.mess;
    this.newPost = this.postNew;
  },
  watch: {
    btnText(val) {
      this.$emit("update:button", this.btnText);
      this.$emit("update:title", this.btnText);
    },
    newPost(val) {
      this.$emit("update:postNew", val);
    },
  },
};
</script>
<style scoped>
.martop {
  margin-top: 5px;
}
</style>
