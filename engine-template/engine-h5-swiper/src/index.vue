<template>
  <div class="engine-template-wrapper">
    <!--swiper-->
    <swiper
      class="swiper-container swi-con"
      ref="mySwiper"
      :key="pageData.pages && pageData.pages.length"
      :options="swiperOptions"
      @transitionEnd="slideChangeTransitionEnd"
    >
      <!-- <div class="swiper-wrapper"> -->
      <swiper-slide
        class="swiper-slide flat relative hidden"
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
            ref="coms"
            v-for="(item, index) in page.elements"
            :key="index"
            @handleElementClick="handleElementClick"
            :element="item"
            :style="getCommonStyle(item.commonStyle, scalingRatio)"
          >
          </componentsTemplate>
        </div>
      </swiper-slide>
      <!-- </div> -->

      <div class="swiper-pagination" slot="pagination"></div>
      <!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
    </swiper>
  </div>
</template>

<script>
import runAnimations from "@src/common/js/runAnimations";
import editorProjectConfig from "@src/pages/editor/DataModel";
import componentsTemplate from "../../components/components-template";
import $config from "@src/config";
import elementEvents from "@src/mixins/elementEvents";
import Swiper from "swiper";
export default {
  name: "engineH5Swiper",
  components: {
    componentsTemplate,
  },
  props: {
    pageData: {},
  },
  mixins: [elementEvents],
  data() {
    return {
      getCommonStyle: editorProjectConfig.getCommonStyle,
      scalingRatio: 1,
      pageTop: 0,
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
        },
        direction: "horizontal",
        effect: "slide",
      },
      sideActive: 0,
      isTemp: "0",
      sceneId: "blankScene", // 无场景ID
      sceneStatus: "1", // 场景状态
    };
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
    // let type = this.$route.query.type || '' // template模板进入 untemplate模板编辑
    // let createType = this.$route.query.createType || '' // 0 模板创建 , 1 空白内容创建
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
  watch: {
    "pageData.flipType": {
      handler: function(val) {
        if (val != undefined) {
          this.InitSwiper();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  // mounted() {},
  methods: {
    slideChangeTransitionEnd(val) {
      if (this.sideActive != val.activeIndex) {
        // 父级页面动画调用
        this.sideActive = val.activeIndex;
        let cssText = val.slides[val.activeIndex].style.cssText;
        let animations =
          this.pageData.pages[val.activeIndex].commonStyle.animations || [];
        runAnimations(val.slides[val.activeIndex], animations, false, () => {
          val.slides[val.activeIndex].style.cssText = cssText;
        });
        // 组件动画调用
        // let cssText_ele = val.slides[val.activeIndex].childNodes[0]
        val.slides[val.activeIndex].childNodes[0].childNodes.forEach(
          (item, i) => {
            let cssText = item.style.cssText;
            let animations =
              this.pageData.pages[val.activeIndex].elements[i].animations || [];
            runAnimations(item, animations, false, () => {
              item.style.cssText = cssText;
            });
          }
        );
      }
    },
    /**
     *  初始化swiper
     */
    InitSwiper() {
      let obj = this.pageData;
      // 设置翻页方式
      if (obj.flipType == 0) {
        this.swiperOptions.direction = "vertical";
      } else {
        this.swiperOptions.direction = "horizontal";
        if (obj.flipType == 2) {
          this.swiperOptions.effect = "fade";
        }
      }
      // 设置页码
      // if (obj.slideNumber) {
      // }
    },
    /**
     * 按钮点击事件
     * @param eventsData
     */
    async handleElementClick(eventsData, element) {
      // 单独判断表单按钮组件是否绑定事件
      if (element.elName == "qk-button" && element.isForm == true) {
        if (eventsData.length > 0) {
          // 绑定了事件
          let { onoff } = { ...element.propsValue };
          this.elentSub(eventsData, element, onoff);
        } else {
          // 没有绑定事件 -- 获取参数
          let { onoff, subSure, postNew } = { ...element.propsValue };
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
        return;
      }

      // 绑定了事件--不是表单元素
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
    },
    async elentSub(eventsData, element, onoff) {
      // 绑定了事件
      for (let i = 0, len = eventsData.length; i < len; i++) {
        if (this["_event_" + eventsData[i].type]) {
          await this["_event_" + eventsData[i].type](
            eventsData[i],
            element,
            this.pageData,
            this.sideActive,
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
      // console.log(this.AES)
      // console.log(obj, "tij");
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
            this.$toast("提交成功");
            this.clearFrom(obj.pageData);
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
      for (let i in pageData) {
        let opkey = Object.keys(pageData[i]);
        if (opkey.toString().indexOf("elements") > -1) {
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
        } else {
          if (pageData[i].isForm == true && pageData[i].elName != "qk-button") {
            if (typeof pageData[i].propsValue.value == "string") {
              pageData[i].propsValue.value = "";
            }
            if (typeof pageData[i].propsValue.value == "object") {
              pageData[i].propsValue.value = [];
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
.swi-con {
  width: 100%;
  height: 100%;
}
</style>
