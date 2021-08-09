<template>
  <div class="engine-template-wrapper">
    <div
      class="relative"
      v-for="(page, i) in pageData.pages"
      :key="i"
      :style="getCommonStyle(page.commonStyle, scalingRatio)"
    >
      <!--页面内容区域-->
      <div
        class="quark-page-wrapper"
        :style="
          getCommonStyle(
            {
              ...page.commonStyle,
              top: pageTop,
              height: pageData.height,
              width: pageData.width,
              position: 'relative',
            },
            scalingRatio
          )
        "
      >
        <componentsTemplate
          v-for="(item, index) in page.elements"
          :key="index"
          @handleElementClick="handleElementClick"
          :element="item"
          :style="getCommonStyle(item.commonStyle, scalingRatio)"
        >
        </componentsTemplate>
      </div>
    </div>
  </div>
</template>

<script>
import editorProjectConfig from "@src/pages/editor/DataModel";
import componentsTemplate from "../../components/components-template";
import $config from "@src/config";
import elementEvents from "@src/mixins/elementEvents";
export default {
  name: "engineH5Long",
  components: {
    componentsTemplate,
  },
  mixins: [elementEvents],
  data() {
    return {
      getCommonStyle: editorProjectConfig.getCommonStyle,
      scalingRatio: 1,
      pageTop: 0,
      isTemp: "0",
      sceneId: "blankScene", // 无场景ID
      sceneStatus: "1", // 场景状态
    };
  },
  props: {
    pageData: {},
  },
  created() {
    // this.pageData = window._pageData
    if (this.$route.name == "Exhibite") {
      this.scalingRatio = document.body.clientWidth / $config.canvasH5Width;
      this.pageTop =
        (document.documentElement.clientHeight -
          this.pageData.height * this.scalingRatio) /
        2;
      this.pageTop = Math.max(this.pageTop, 0);
    }
    let id = this.$route.query.id || "";
    let status = this.$route.query.status || ""; // 1未发布 2发布
    let pathUrl = this.$route.path;
    if (pathUrl == "/editor") {
      // 处于编辑路由状态下
      this.isTemp = "1"; // 是否预览临时数据 0：否 1：是
      if (id) {
        this.sceneId = id; // 包含场景ID
      }
      if (status) {
        this.sceneStatus = status; // 场景状态0删除 1未发布 2已发布 3下线
      }
    } else {
      if (status) {
        this.sceneStatus = status; // 场景状态0删除 1未发布 2已发布 3下线
      }
      // 是否是已发布状态
      if (this.sceneStatus == 2) {
        this.isTemp = "0";
      } else {
        this.isTemp = "1";
      }
    }
  },
  methods: {
    /**
     * 按钮点击事件
     * @param eventsData
     */
    async handleElementClick(eventsData, element) {
      // 单独判断表单按钮组件是否绑定事件
      if (element.elName == "qk-button" && element.isForm == true) {
        let onoff = true; // 默认全局提交表单元素
        if (eventsData.length > 0) {
          // 绑定了事件
          this.elentSub(eventsData, element, onoff);
        } else {
          // 没有绑定事件 -- 获取参数
          let { subSure, postNew } = { ...element.propsValue };
          await this._event_btnForm(
            element,
            this.pageData,
            this.sideActive,
            onoff,
            subSure,
            postNew
          ).then((res) => {
            this.submitForm(res);
          });
        }
      } else {
        // 绑定了事件不是表单按钮提交控件
        for (let i = 0, len = eventsData.length; i < len; i++) {
          if (this["_event_" + eventsData[i].type]) {
            await this["_event_" + eventsData[i].type](
              eventsData[i],
              element,
              this.pageData
            ).then((res) => {
              console.log(res);
            });
          }
        }
      }
    },
    async elentSub(eventsData, element, onoff) {
      // 绑定了事件
      for (let i = 0, len = eventsData.length; i < len; i++) {
        if (this["_event_" + eventsData[i].type]) {
          await this["_event_" + eventsData[i].type](
            eventsData[i],
            element,
            this.pageData,
            onoff
          ).then((res) => {
            console.log(res);
            if (res.type == "submitForm") {
              // 表单提交类型
              this.submitForm(res);
            } else {
              // 其他类型
            }
          });
        }
      }
    },
    // 接口表单提交
    submitForm(obj) {
      let that = this;
      let sourceAddress = window.location.href;
      let url = this.$interParams.h5Inters.formSubmit;
      if (obj.apiUrl != "") {
        url = obj.apiUrl;
      }
       // 表单数据加密
      let datas = JSON.stringify(obj.dataArr)
      let codeDatas = this.AES.Encrypt(datas)
      // 表单方式提交
      this.$axios
        .post(url, {
          sceneId: this.sceneId, // 场景ID
          sceneStatus: this.sceneStatus, // 场景状态0删除 1未发布 2已发布 3下线
          userId: obj.phone, // 用户ID
          sourceAddress: sourceAddress, // 来源地址
          isTemp: this.isTemp, // 是否预览临时数据 0：否 1：是
          data: codeDatas,
        })
        .then((res) => {
          if (res.code == "200") {
            this.$toast(res.message);
            // 提交成功清楚表单输入数据
            that.clearFrom(obj.pageData);
          } else {
            this.$toast(res.message);
          }
        })
        .catch((err) => {
          this.$toast(err.message);
        });
    },
    // 清楚提交的表单数据
    clearFrom(pageData) {
      for(let i in pageData){
        if(pageData[i].elements.length>0){
          for (let n in pageData[i].elements) {
            if (
              pageData[i].elements[n].isForm == true &&
              pageData[i].elements[n].elName != "qk-button"
            ) {
              if (typeof pageData[i].elements[n].propsValue.value == "string") {
                pageData[i].elements[n].propsValue.value = "";
              }
              if (typeof pageData[i].elements[n].propsValue.value == "object") {
                pageData[i].elements[n].propsValue.value = [];
              }
            }
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.engine-template-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.relative {
  position: relative;
}

.hidden {
  overflow: hidden;
}
</style>
