<template>
  <viewWrapper :pageId="pageId" :isTemplate="isTemplate" :isRelease="isRelease" @closePreview="closePreview" v-loading="loading">
    <div class="preview-info-wrapper" v-if="!loading">
      <el-form label-width="90px" label-position="top" class="view-box">
        <el-form-item label="页面二维码">
          <QrcodeVue :value="pageLink" :size="150" level="H"></QrcodeVue>
        </el-form-item>
      </el-form>
    </div>
  </viewWrapper>
</template>

<script>
import { mapState } from 'vuex'
import viewWrapper from '@src/components/view-wrapper'
import QrcodeVue from 'qrcode.vue'
export default {
  components: {
    viewWrapper,
    QrcodeVue,
  },
  props: {
    pageId: String,
    isTemplate: String,
    isRelease: String,
    goUrl: String,
  },
  data() {
    return {
      loading: false,
      pageData: {},
    }
  },
  created() {},
  computed: {
    ...mapState({
      proData: (state) => state.editor.projectData,
    }),
    pageLink() {
      // 跳转预览链接
      return `${this.goUrl}/#/exhibite/${this.pageId}/${this.isTemplate}/${this.isRelease}`
    },
  },
  methods: {
    /**
     * 关闭弹窗事件
     */
    closePreview() {
      this.$emit('closePreview', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.preview-info-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.view-box {
  position: absolute;
  top: 30%;
  text-align: center;
}
</style>
<style>
.view-box .el-form-item__label {
  color: #fff;
}
</style>
