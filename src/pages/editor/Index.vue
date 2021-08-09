<template>
  <div class="content" v-loading="loading">
    <div class="page-header-wrapper">
      <page-header></page-header>
    </div>
    <div class="page-editor editor-wrapper">
      <!--左侧导航-->
      <div class="editor-side-bar border-R">
        <el-tabs tab-position="left" v-model="activeSideBar" style="height: 100%;">
          <template v-for="(item, index) in sidebarMenus">
            <el-tab-pane :name="item.value" :key="index" v-if="!item.pageMode || (item.pageMode && item.pageMode === pageMode)">
              <el-tooltip slot="label" class="item" effect="dark" :content="item.label" placement="right">
                <i :class="item.elementUiIcon"></i>
              </el-tooltip>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <!--组件&页面&模板-->
      <div class="editor-page-edit-wrapper">
        <componentLibs v-if="activeSideBar === 'componentLibs'" />
        <pageManage v-if="activeSideBar === 'pageManage'" />
        <templateLibs v-if="activeSideBar === 'templateLibs'" />
        <musicLibs v-if="activeSideBar === 'musicLibs'"></musicLibs>
      </div>
      <!--页面编辑区域-->
      <div class="editor-main">
        <div class="control-bar-wrapper">
          <controlBar :scale.sync="canvasConfig.scale" 
          @import-psd-data="importPsdData" @showPreview="showPreviewFn" @cancel="cancelFn" 
          @publish="publishFn" @save="saveFn" />
        </div>
        <editorPan ref="editorPan" :scale.sync="canvasConfig.scale" />
        <!-- 新增页面按钮 -->
       <!--  <div class="el-h5-add">
          <el-button type="primary" size="small" @click="addPage()">新增空页面</el-button>
        </div> -->
      </div>
      <!-- H5 页面选择滑动条 -->
      <div class="el-h5-page-con">
        <el-tabs tab-position="left" v-model="activePageU" @tab-click="handelPage()" style="height: 200px;">
          <template v-for="(item, i) in projectData.pages">
            <el-tab-pane :name="item.uuid" :key="i">
              <el-tooltip slot="label" class="item" effect="dark" :content="`第 ${(i + 1)} 页`" placement="left">
                <span class="h5-page-tip"
                  :style="{backgroundColor: item.commonStyle.backgroundColor, backgroundImage: 'url(' + item.commonStyle.backgroundImage +')', backgroundSize: item.commonStyle.backgroundSize}"></span>
              </el-tooltip>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <!--属性编辑区域-->
      <div class="el-attr-edit-wrapper scrollbar-wrapper">
        <el-tabs v-model="activeAttr" stretch>
          <el-tab-pane label="属性" name="属性">
            <attrEdit></attrEdit>
          </el-tab-pane>
          <el-tab-pane label="事件" name="事件">
            <eventEdit></eventEdit>
          </el-tab-pane>
          <el-tab-pane label="动画" name="动画">
            <animationEdit></animationEdit>
          </el-tab-pane>
          <!-- <el-tab-pane label="JS脚本" name="脚本">
          <scriptEdit></scriptEdit>
        </el-tab-pane> -->
          <el-tab-pane label="页面" name="页面属性">
            <pageAttrEdit></pageAttrEdit>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--预览-->
      <previewPage v-if="showPreview" :pageData="projectData" :pageId="id" @closePreview="showPreview = false" @publishFn="publishFn" @saveFn="saveFn"></previewPage>
      <!--我的图片-->
      <imageLibs />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/page-header'
import componentLibs from './components/component-libs/Index'
import pageManage from './components/page-manage'
import templateLibs from './components/template-libs'
import editorPan from './components/editor-panel/Index'
import musicLibs from './components/music-libs'

// 属性编辑相关组件
import attrEdit from './components/attr-configure/attr-edit'
import animationEdit from './components/attr-configure/animation-edit'
import eventEdit from './components/attr-configure/event-edit'
import pageAttrEdit from './components/attr-configure/page-attr-edit'
// import scriptEdit from './components/attr-configure/script-edit'

// 头部
import controlBar from './components/control-bar'

import previewPage from './components/preview'
import imageLibs from '@src/components/image-libs'

import { mapState, mapGetters } from 'vuex'
import html2canvas from 'html2canvas'
import editorProjectConfig from '../editor/DataModel'

export default {
  components: {
    componentLibs,
    pageManage,
    templateLibs,
    imageLibs,
    musicLibs,
    editorPan,
    attrEdit,
    animationEdit,
    eventEdit,
    pageAttrEdit,
    // scriptEdit,
    controlBar,
    previewPage,
    PageHeader,
  },
  data() {
    return {
      id: '', // 当前页面id
      type: '', // 是否为模板页面
      createType: '1', // 创建类型 0 模板创建 1 空白内容创建
      loading: false,
      showPreview: false,
      activeAttr: '属性',
      activeSideBar: 'componentLibs',
      sidebarMenus: [
        {
          label: '组件列表',
          value: 'componentLibs',
          elementUiIcon: 'el-icon-s-operation',
        },
        {
          label: '页面管理',
          pageMode: 'h5',
          value: 'pageManage',
          elementUiIcon: 'el-icon-document',
        },
        {
          label: '模板库',
          value: 'templateLibs',
          elementUiIcon: 'el-icon-files',
        },
        {
          label: '音乐库',
          value: 'musicLibs',
          elementUiIcon: 'el-icon-video-play',
        },
      ],
      canvasConfig: {
        scale: 1,
      },
      activePageU: '',
      info: '', // 返回信息内容
      oldPageData:{}
    }
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID,
    }),
    ...mapGetters(['pageMode', 'activePage']),
  },
  created() {
    this.initPageData()
  },
  methods: {
    /**
     * 初始化页面数据
     */
    initPageData() {
      this.id = this.$route.query.id
      this.type = this.$route.query.type
      if(this.$route.query.createType){
        this.createType = this.$route.query.createType
      }
      this.loading = true
      if (this.type == 'template') {
        this.$axios
          .get(this.$interParams.h5Inters.getTemplateByIdDetails + this.id)
          .then(
            (data) => {
              if (data.data.data) {
                let newPageData = JSON.parse(data.data.data)
                newPageData.pageMode = 'h5'
                newPageData.coverImage = data.data.coverPic

                newPageData.title = data.data.title
                newPageData.tplClassifyCd = data.data.tplClassifyCd
                this.$store.dispatch('setPrjectData', newPageData)
                this.info = data.data
              }
              // this.showPreview = false
              this.loading = false
            },
            (err) => {
              this.loading = false
            }
          )
      } else {
        if (this.id) {
          // 获取数据，注入模板
          this.$axios
            .get(this.$interParams.h5Inters.sceneUpdateInfo + this.id)
            .then(
              (data) => {
                if (data.data.editData) {
                  let newPageData = JSON.parse(data.data.editData)
                  this.oldPageData = JSON.parse(data.data.editData)
                  newPageData.id = data.data.id
                  newPageData.sn = data.data.sn
                  newPageData.pageMode = 'h5'
                  newPageData.coverImage = data.data.coverPic

                  newPageData.title = data.data.title
                  newPageData.tplClassifyCd = data.data.tplClassifyCd
                  this.$store.dispatch('setPrjectData', newPageData)
                  this.info = data.data
                }
                // this.showPreview = false
                this.loading = false
              },
              (err) => {
                this.loading = false
              }
            )
        } else {
          // 进入此type是H5
          // 引入数据模型 -- 调用配置方法
          let newPageData = editorProjectConfig.getProjectConfig()
          newPageData.pageMode = 'h5'
          // 存储到仓库
          this.$store.dispatch('setPrjectData', newPageData)
          this.loading = false
        }
      }
    },
    // 页面选择滑动条
    handelPage() {
      console.log(this.activePageU,'页面id')
      this.$store.dispatch('setActivePageUUID', this.activePageU)
    },
    /**
     * 新增页面
     */
    addPage(item) {
      this.$store.dispatch('addPage', item ? item.uuid : '')
    },
    //页面信息校验
    checkPageInfo(){
      //限制标题长度
      let tit = this.projectData.title;
      //限制背景图片地址长度
      let bgUrl = this.projectData.pages[0].commonStyle.backgroundImage;
      //限制文本长度,图片组件地址长度
      let txtAry = [];
      let picAry = [];
      for(let i in this.projectData.pages[0].elements){
        let it = this.projectData.pages[0].elements[i];
        if(it.elName=='qk-text'){
          txtAry.push(it);
        }else if(it.elName=='qk-image'){
          picAry.push(it);
        }
      }
      let overTxt = txtAry.find(it=>{
        return it.propsValue.text.length>1000;
      });
      let overPic = picAry.find(it=>{
        return it.propsValue.imageSrc.length>200;
      });
      if(tit.length>100){
        this.$message.warning('标题长度不能超过100');
        return false;
      }else if(bgUrl&&bgUrl.length>200){
        this.$message.warning('背景图片地址长度不能超过200');
        return false;
      }else if(overTxt) {
        this.$message.warning('文字内容不能超过1000个字');
        return false;
      }else if(overPic) {
        this.$message.warning('图片地址长度不能超过200');
        return false;
      }else {
        return true;
      }
    },
    /**
     * 保存
     */
    async saveFn(item) {
      console.log('保存', this.projectData)
      // let pages = this.projectData.pages
      // for(let i in pages){
      //    for(let n in pages[i].elements){
      //      if(pages[i].elements[n].propsValue.names == '' && pages[i].elements[n].isForm == true){
      //        this.$message.error('请输入英文表单必输项')
      //        return
      //      }
      //    }
      // }
      if(!this.checkPageInfo()){
        return false;
      }
      // 提交数据再预览
      this.loading = true;
      await this.screenshots();
      if (this.type == 'template') {
        let params = {
          tplClassifyCd: item || this.projectData.tplClassifyCd,
          title: this.projectData.title,
          coverPic: this.projectData.coverImage,
          editData: JSON.stringify(this.projectData),
          formHeader: '',
          type: '1',
          shareSet: JSON.stringify(this.projectData.shareConfig),
        }
        this.$axios.post(this.$interParams.h5Inters.addScene, params).then(
          (data) => {
            if (data.code) {
              this.$message.success('保存成功!')
              this.$router.back(-1)
            }
            // this.showPreview = false
          },
          (err) => {
            this.loading = false
          }
        )
      } else {
        if (!this.id) {
          if (this.createType == '0') {
            // 保存模板
            let params = {
              tplClassifyCd:item || '2',
              title: this.projectData.title,
              coverPic: this.projectData.coverImage,
              sceneType: '1',
              isPublic: '1',
              type: '1',
              data: JSON.stringify(this.projectData),
              status: '1',
              firstIsShow: '1',
              orderNum: '1',
            }
            this.$axios
              .post(this.$interParams.h5Inters.addTemplate, params)
              .then(
                (data) => {
                  if (data.code == '200') {
                    this.$message.success('保存成功!')
                    this.$router.push({
                      path: '/main',
                      query: {},
                    })
                  }
                },
                (err) => {
                  this.loading = false
                }
              )
          } else if (this.createType == '1') {
            // 保存空白内容
            let params = {
              tplClassifyCd:item || '2',
              title: this.projectData.title,
              coverPic: this.projectData.coverImage,
              editData: JSON.stringify(this.projectData),
              formHeader: '',
              type: '1',
              shareSet: JSON.stringify(this.projectData.shareConfig),
            }
            this.$axios.post(this.$interParams.h5Inters.addScene, params).then(
              (data) => {
                if (data.code) {
                  this.$message.success('保存成功!')
                  this.$router.back(-1)
                }
                // this.showPreview = false
              },
              (err) => {
                this.loading = false
              }
            )
          }
        } else {
          let params = {
            tplClassifyCd:item || this.projectData.tplClassifyCd,
            id: this.id,
            sn: this.projectData.sn,
            title: this.projectData.title,
            coverPic: this.projectData.coverImage,
            editData: JSON.stringify(this.projectData),
            status: "1",
            formHeader: '',
            type: '1',
            shareSet: JSON.stringify(this.projectData.shareConfig),
          }
          this.$axios
            .put(this.$interParams.h5Inters.updateSceneByid, params)
            .then(
              (data) => {
                if (data.code) {
                  this.$message.success('修改成功!')
                  this.$router.back(-1)
                }
                // this.showPreview = false
              },
              (err) => {
                this.loading = false
              }
            )
        }
      }
    },
    /**
     * 发布
     */
    async publishFn() {
      if(!this.checkPageInfo()){
        return false;
      }
      // await this.screenshots()
      // 提交数据再预览
      if (!this.id) {
        this.$message.warning('请先保存当前H5!')
      } else {
        if(JSON.stringify(this.oldPageData)!=JSON.stringify(this.projectData)){
          this.$message.warning('H5页面发生过修改，请先保存H5再发布!')
          return;
        }
        this.$axios
          .put(this.$interParams.h5Inters.publishScene + this.id)
          .then(() => {
            this.$message.success('发布成功!')
            // this.showPreview = false
            this.$router.back(-1)
          })
      }
    },
    async showPreviewFn() {
      // await this.screenshots()
      // 提交数据再预览
      this.showPreview = true
      // this.$axios.post('/page/update/' + this.id, this.projectData).then(() => {
      //   this.showPreview = true
      // })
    },
    /**
     * 退出
     */
    cancelFn() {
      this.$confirm('确认退出编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$router.back(-1)
        })
        .catch(() => {})
    },
    /**
     * 提供截屏作为项目主图
     */
    screenshots() {
      return new Promise((resolve, reject) => {
        // 取消全部选定
        this.$store.dispatch('setActiveElementUUID', '')
        setTimeout(() => {
          // 开始截图
          const el = document.querySelector('#canvas-panel');

          function getVideoFirstFrame(src, img, width, height) {
              var video = document.createElement('video');
              video.crossOrigin = "anonymous";
              video.addEventListener('loadeddata', function () {
                  var canvas = document.createElement("canvas"); // 创建一个画布
                  canvas.width = width;
                  canvas.height = height;
                  canvas.getContext('2d').drawImage(video, 0, 0, width, height); // getContext:设置画布环境；drawImage:画画 
                  img.src = canvas.toDataURL("image/png"); // 获取图片的url
              });
              video.src = src;
          }

          html2canvas(el, {
            // proxy: `${this.$config.baseURL}/common/html2canvas/corsproxy`,
            allowTaint: true,
            logging:false,
            useCORS: true,
          }).then((canvas) => {
             // canvas为转换后的Canvas对象
            //  console.log(canvas)
            const dataUrl = canvas.toDataURL('image/jpeg', 1)
            // console.log(dataUrl)
            const blob = this.$mUtils.dataURItoBlob(dataUrl)
            const file = new window.File([blob], +new Date() + '.png', {
              type: 'image/jpeg',
            })
            let params = new FormData()
            params.append('uploadFile', file)
            params.append('type', '4')//保存封面不记录成type3
            params.append('categoryId', '')
            this.$axios.post(this.$interParams.h5Inters.upload, params).then(
              (data) => {
                this.projectData.coverImage = data.data.url
                this.loading = false
                resolve(data.data.url)
              },
              (err) => {
                this.loading = false
                reject(err)
              }
            )
          })
        }, 1)
      })
    },
    /**
     *
     * @param dataList
     */
    importPsdData(psdData) {
      let elementsList = psdData.elements
      let psdWidth = psdData.document.width
      let scalingRatio = this.projectData.width / psdWidth
      elementsList.forEach((item) => {
        let { width, height, top, left, imageSrc, opacity, zIndex } = item
        setTimeout(() => {
          this.$store.dispatch('addElement', {
            elName: 'qk-image',
            defaultStyle: {
              width: width * scalingRatio,
              height: height * scalingRatio,
              top: top * scalingRatio,
              left: left * scalingRatio,
              zIndex: zIndex,
              opacity,
            },
            needProps: {
              imageSrc: imageSrc,
            },
          })
        }, 10)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-wrapper {
  display: flex;
  height: 100%;
  position: relative;
  .editor-side-bar {
    width: 55px;
  }
  .editor-page-edit-wrapper {
    width: 280px;
    padding: 0 1px;
  }
  .editor-main {
    flex: 1;
    background: #f0f2f5;
    position: relative;
  }
  .el-attr-edit-wrapper {
    width: 380px;
    padding: 0;
  }
}
.el-h5-page-con {
  display: flex;
  align-items: center;
  width: 50px;
  border-right: 1px solid #e4e7ed;
}
.el-h5-add {
  position: absolute;
  top: 720px;
  left: 0;
  right: 0;
  text-align: center;
}
.h5-page-tip {
  width: 20px;
  height: 34px;
  display: inline-block;
  line-height: 34px;
  box-shadow: 0 0 5px #ccc;
  margin: 5px auto;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;
}
.control-bar-wrapper {
  position: absolute;
  top: -44px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 1000;
}
</style>
<style lang="scss">
.editor-side-bar {
  .el-tabs__item.is-active {
    background: rgba(37, 165, 137, 0.09);
  }
}

.el-attr-edit-wrapper {
  .el-tabs {
    height: 100%;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 10px;
  }
  .el-tabs__content {
    height: calc(100% - 55px);
    & > div {
      height: 100%;
    }
    .attr-edit-inner {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
}
.content {
  padding-top: 48px;
}
</style>
