<template>
  <div>
    <div class="exhibite-load" v-show="loading">
      <img src="../../common/images/loading.gif" alt="">
    </div>
    <div class="exhibite-con">
      <div class="iframe-wrapper" :style="{width: canvasH5Width + 'px', height: canvasH5Height + 'px'}">
        <engine-h5-swiper v-if="pageMode == 'h5'" :pageData="projectData" />
        <el-scrollbar v-if="pageMode == 'longPage'" :style="{width: canvasH5Width + 'px', height: canvasH5Height + 'px'}">
          <engine-h5-long :pageData="projectData" />
        </el-scrollbar>
      </div>
    </div>
    <div class="exhibite-isPreview" v-if="isPreview">
      为防范钓鱼安全风险，预览内容仅供作者预览使用，有效期 {{ isPreviewTime }}，如需供他人预览，请使用发布功能。
    </div>
    <div class="exhibite-isPreview" v-if="isTemplate == '1'">
      当前预览为模板。
    </div>
    <div class="exhibite-overtime" v-if="overtime">
      <span>预览时效已过，请重新生成预览二维码</span>
    </div>
  </div>
</template>

<script>
import {weixCode} from '../../common/js/weixinCode'
// import {}
export default {
  name: 'Exhibite',
  data() {
    return {
      loading: true,
      projectData: {},
      pageMode: 'h5',
      id: '',
      isPreview: false,
      isPreviewTime: '0分钟',
      isTemplate: 0,
      isRelease: 0,
      overtime: false,
      canvasH5Width: this.$config.canvasH5Width,
      canvasH5Height: this.$config.canvasH5Height,
      scalingRatio: 1,
      scalingRatios: 1,
      weixiOff:false
    }
  },
  created() {
    this.scalingRatio = document.body.clientWidth / this.$config.canvasH5Width
    this.scalingRatios =
      document.body.clientHeight / this.$config.canvasH5Height
    this.canvasH5Width = this.scalingRatio * this.canvasH5Width
    this.canvasH5Height = this.scalingRatios * this.canvasH5Height
    // 判断是否在微信环境下
    this.weixiOff = this.$mUtils.isWxBrowser()
    if(this.weixiOff){
      // 在微信端---去默认授权
      console.log('去授权')
      weixCode()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.id = this.$route.params.pageId
      this.isTemplate = this.$route.params.isTemplate
      this.isRelease = this.$route.params.isRelease
      if (this.isTemplate == '1') {
        this.$axios
          .get(this.$interParams.h5Inters.getTemplateByIdDetails + this.id)
          .then(
            (data) => {
              if (data.code == '200') {
                let newPageData = JSON.parse(data.data.data)
                this.projectData = newPageData
                this.pageMode = newPageData.pageMode
                this.loading = false
              }
            },
            (err) => {
              this.loading = false
            }
          )
      } else {
        if (this.isRelease == '1') {
          this.$axios
            .get(this.$interParams.h5Inters.pViewSceneInf + this.id)
            .then(
              (data) => {
                if (data.code == '200') {
                  let newPageData = JSON.parse(data.data.data)
                  this.projectData = newPageData
                  this.pageMode = newPageData.pageMode
                  this.isPreviewTime = this.formatSeconds(data.data.expireTime)
                  this.isPreview = true
                  this.loading = false
                } else {
                  this.overtime = true
                  this.loading = false
                }
              },
              (err) => {
                this.overtime = true
                this.loading = false
              }
            )
        } else if (this.isRelease == '2') {
          this.$axios
            .get(this.$interParams.h5Inters.sViewSceneInf + this.id)
            .then(
              (data) => {
                if (data.code == '200') {
                  let newPageData = JSON.parse(data.data.data)
                  this.projectData = newPageData
                  this.pageMode = newPageData.pageMode
                  this.isPreview = false
                  this.loading = false
                  // 记录用户行为统计
                  this.getSaveCustomerBhvrInfo()
                } else {
                  this.loading = false
                }
              },
              (err) => {
                this.loading = false
              }
            )
        }
      }
    },
    // 记录用户行为统计
    getSaveCustomerBhvrInfo(){
      let myTime = new Date(); //当前时间
      let myyear = myTime.getFullYear();
      let myMonth = (myTime.getMonth() + 1)<10?'0'+(myTime.getMonth() + 1):myTime.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let myData = myTime.getDate()<10?'0'+myTime.getDate():myTime.getDate(); //获取当前日(1-31)
      let myHours = myTime.getHours()<10?'0'+myTime.getHours():myTime.getHours(); //获取当前小时数(0-23)
      let myMinutes = myTime.getMinutes()<10?'0'+myTime.getMinutes():myTime.getMinutes(); //获取当前分钟数(0-59)
      let mySeconds = myTime.getSeconds()<10?'0'+myTime.getSeconds():myTime.getSeconds(); //获取当前秒数(0-59)
      let timesNow = `${myyear}-${myMonth}-${myData}  ${myHours}:${myMinutes}:${mySeconds}`;
    
      this.$axios.get(this.$interParams.h5Inters.saveCustomerBhvrInfo,
        {
          "avyIds":[],
          "avyUserBhvrInfoVOS":[
          {
           usrBhvrInfId:'', // 用户行为信息
           activityId:this.id, // H5活动编号
           openId:'', // 用户open_id
           mblPhNo:'', // 用户手机号
           rcmmOpenId:'', // 推荐人open_id
           platformId:"", // 平台id
           channelId:'', // 渠道id
           event:'browse', // 事件(browse浏览/join参与/share分享/login登陆/register注册夏E站/bind绑定夏E站)
           dataDt:'', // 数据时间
            // "behavior":1,
            // "type":1,
          avyId:this.id,
          createdAt:timesNow,
          crtTm:timesNow,
          nickname:""
            }
          ]
        }
      ).then(
          (data) => {
            console.log(data.message)
          },
          (err) => {
            console.log(err.message)
          }
        )
    },
    getPreview() {
      if (this.isPreview == '1') {
        this.$axios.get(this.$interParams.h5Inters.previewScene + this.id).then(
          (data) => {
            this.loading = false
          },
          (err) => {
            this.isPreview = 0
            this.loading = false
          }
        )
      } else {
        this.loading = false
      }
    },
    formatSeconds(value) {
      let result = parseInt(value)
      let h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      let m =
        Math.floor((result / 60) % 60) < 10
          ? '0' + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
      let s =
        Math.floor(result % 60) < 10
          ? '0' + Math.floor(result % 60)
          : Math.floor(result % 60)

      let res = ''
      if (h !== '00') res += `${h}小时`
      if (m !== '00') res += `${m}分钟`
      res += `${s}秒`
      return res
    },
  },
}
</script>
<style lang="scss" scoped>
.exhibite-load {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #fff;
  img {
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
  }
}
.exhibite-isPreview {
  position: absolute;
  top: 0;
  background: #ff000082;
  color: #fff;
  padding: 10px;
  z-index: 1008;
  left: 0;
  right: 0;
  text-align: center;
}
.exhibite-overtime {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 10098;
  background: #fff;
  span {
    position: absolute;
    top: 30%;
    text-align: center;
    left: 0;
    right: 0;
    color: #393939;
    font-size: 16px;
  }
}
</style>