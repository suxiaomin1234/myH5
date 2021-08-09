<template>
  <div v-if="currentElementProps.length">
    <div class="attr-title marginB10 fontBold">组件属性</div>
    <el-form v-if="showHide">    
      <component 
        v-for="item in currentElementProps"
        :key="item"
        :is="'attr-qk-' + item"
        v-bind.sync="activeElement.propsValue"
      />
    </el-form>
  </div>
</template>

<script>
import attrComponents from "./index.js";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    ...attrComponents,
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID,
    }),
    ...mapGetters([
      "currentPageIndex",
      "activeElementIndex",
      "activeElement",
      "activePage",
    ]),
    /**
     * 当前选中元素需要编辑得props 列表
     */
    currentElementProps() {
      if (!this.activeElement.propsValue) {
        return [];
      }
      console.log('key',this.activeElement)
      if(this.activeElement.elName == 'qk-phone' || this.activeElement.elName == 'qk-input' || this.activeElement.elName == 'qk-select' || this.activeElement.elName == 'qk-textarea'){
        // 存储仓库
        this.$store.dispatch('noshow',false)
      }else{
        this.$store.dispatch('noshow',true)
      }
      let keyList = Object.keys(this.activeElement.propsValue);
      let editPropsComponentNameList = Object.keys(attrComponents);
      // 过滤掉找不到对应attr props编辑组件的key
      keyList = keyList.filter((v) => {
        return editPropsComponentNameList.includes("attr-qk-" + v);
      });
      this.showHide = false;
      clearTimeout(time)
      let time = setTimeout(()=>{
        this.showHide = true
      },500)
      
      return keyList;
    },
  },
  data(){
    return{
      showHide:false
    }
  }
};
</script>

<style scoped></style>
