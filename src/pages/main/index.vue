<template>
  <div class='main' ref="main">
    <!-- <el-container> -->

    <div class='main-header'>
      <div class="header">
        <el-row>
          <el-col :span="6"><img src="../../common/images/main/logo_tic03.png" alt=""></el-col>
          <el-col :span="12">
            <ul>
              <li>模板首页</li>
              <li @click="enterH5">我的H5</li>
              <li @click="imgStore">素材库</li>
            </ul>
          </el-col>
          <el-col :span="6" class='right'>
            <!-- <div class='login' @click="enterlogin">登录</div> -->
          </el-col>
        </el-row>
      </div>

      <swiper class="swiper-container swi-con" ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-slide flat relative hidden" v-for="(page, i) in 4" :key="i">
          <!-- <img height='615' src="../../common/images/main/banner.png" alt=""> -->
          <div class='sw-img'></div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <div class='main-body'>
      <div class='bg'></div>
      <div class="body-box">
        <div class="nav">
          <el-row>
            <el-col :span="8">
              <div class="max-box">
                <div class="box-card one">
                  <div class='card-head' @click="checks('0')">
                    <img src="../../common/images/main/icon_01.png" alt="">
                    <p>银行业务</p>
                  </div>
                  <div v-for="o in 0" :key="o" class="card-item">
                    {{'列表内容 ' + o }}
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="max-box">
                <div class="box-card two">
                  <div class='card-head' @click="checks('1')">
                    <img src="../../common/images/main/icon_02.png" alt="">
                    <p>节假日</p>
                  </div>
                  <div v-for="o in 0" :key="o" class="card-item">
                    {{'列表内容 ' + o }}
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="max-box">
                <div class="box-card tree">
                  <div class='card-head' @click="checks('2')">
                    <img src="../../common/images/main/icon_03.png" alt="">
                    <p>H5风格</p>
                  </div>
                  <div v-for="o in 0" :key="o" class="card-item">
                    {{'列表内容 ' + o }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <div class='divider'>
            <small>Template Display</small>
            <h4>
              模板展示
            </h4>
          </div>
          <div class='btn'>
            <span :class="btnActive == '1' ? 'active' : ''" @click="changebtn('1')"><i class="el-icon-picture-outline-round"></i> H5</span>
            <span :class="btnActive == '2' ? 'active' : ''" @click="changebtn('2')"><i class="el-icon-picture-outline"></i> 长图文</span>
          </div>
          <div class='mode' v-loading='modeLoding'>
            <el-row :gutter="30">
              <el-col :span="6" v-for="(item,index) in pageList" :key='index'>
                <el-card :body-style="{ padding: '0px' }" class="mode-card">
                  <div class="mode-type">
                    <span v-if="item.sceneType == '2'">长图文</span>
                  </div>
                  <div class='image'>
                    <img :src="item.coverPic |replaceIP " class="">
                  </div>
                  <div class="mode-bg">
                    <div @click='wrapperChange(item.id)'>
                      <img src="../../common/images/main/icon_yl.png" alt="">
                      <p>点击预览</p>
                    </div>
                  </div>
                  <div style="padding: 14px; height: 55px;">
                    <span class="title">{{item.title}}</span>
                    <div>
                      <el-button type="text" class="button" @click="enterEdit(item)">立即制作</el-button>
                      <el-button type="text" class="button" @click="delTemplate(item)" v-if="item.isPublic=='2'">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>

            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class='main-foot'>
      <el-pagination background layout="prev, pager, next" :page-size='searchParams.pageSize' :total="searchParams.totalCount" @current-change='getPage'>
      </el-pagination>

    </div>
    <!-- 登录弹框 -->
    <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-row>
        <el-col :span='12'>
          <div class='login-left'>
            <img class='logo' src="../../common/images/main/logo_tic02.png" alt="">
            <br>
            <img src="../../common/images/main/dl_pic.png" alt="">
          </div>

        </el-col>
        <el-col :span='12'>
          <div class="login-right">
            <h3>欢迎登录</h3>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="账号" prop="pass">
                <el-input type="password" size='small' v-model="ruleForm.pass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="checkPass">
                <el-input type="password" size='small' v-model="ruleForm.checkPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span='18'>
                  <el-form-item label="验证码" prop="age">
                    <el-input size='small' v-model.number="ruleForm.age"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='6'>
                  <div class='yanzheng'>
                    <el-button size='small' type="primary" @click="onSubmit">验证码</el-button>
                  </div>
                </el-col>
              </el-row>

              <el-form-item>
                <el-button class="submitbtn" size='small' type="primary" @click="onSubmit">登录</el-button>
              </el-form-item>
            </el-form>

          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <viewPreview v-if="wrapperShow" :isTemplate="isTemplate" :isRelease="isRelease" :goUrl="goUrl" :pageId="pageId" @closePreview="closePreview" v-loading="loading"
      :rightShow='false'>
    </viewPreview>
  </div>
</template>

<script>
import viewPreview from '../home/components/view-preview'
export default {
  components: {
    viewPreview,
  },
  data() {
    return {
      loading: true,
      modeLoding: false,
      wrapperShow: false,
      pageId: '',
      goUrl: '',
      isTemplate: '1',
      isRelease: '1',
      activeIndex: '1',
      btnActive: '', // 选中按钮
      dialogVisible: false, // 是否显示弹框
      ruleForm: {},
      rules: {},
      searchParams: {
        // 页数
        pageNo: 1,
        pageSize: 12,
        totalCount: 0,
      },
      pageList: [], // 列表
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
        },
        direction: 'horizontal',
        effect: 'slide',
      },
    }
  },
  mounted() {
    if (this.$route.query.token) {
      this.$store.dispatch('updateUserToken', this.$route.query.token)
    }
    this.getPageList()
    // console.log(this.$route.query)
  },
  methods: {
    // 进入素材库
    imgStore(){
      this.$router.push({
          path: '/material',
          query: {},
        })
    },
    // 登录页面选中
    enterlogin() {
      this.dialogVisible = true
    },
    // 进入h5
    enterH5() {
      this.$router.push({
        path: '/h5',
        query: {},
      })
    },
    // 进入编辑
    enterEdit(item) {
      let pathName = ''
      if (item.sceneType == '1') {
        pathName = '/editor'
      } else if (item.sceneType == '2') {
        pathName = '/editor/long'
      }
      this.$router.push({
        path: pathName,
        query: { id: item.id, type: 'template', createType: '1' },
      })
    },
    // 选中按钮
    changebtn(val) {
      if (val == this.btnActive) {
        this.btnActive = ''
      } else {
        this.btnActive = val
      }
      this.searchParams.pageNo = '1'
      this.getPageList()
    },
    // 打开预览
    wrapperChange(id) {
      this.sceneUpdateInfo(id)
    },
    // 关闭预览
    closePreview() {
      document.querySelector('body').removeAttribute('style')
      this.wrapperShow = false
    },
    // 修改页数
    getPage(val) {
      console.log(val)
      this.searchParams.pageNo = val
      this.getPageList()
    },
    onSubmit() {},
    handleClose() {},
    /**
     * 接口部分
     */

    // 获取所有页面
    getPageList(n) {
      this.modeLoding = true
      const searchParams = {
        sceneType: this.btnActive, // 场景类型 1-h5。2-长图文
        categoryId: '', // H5分类编号
        pageNo: String(this.searchParams.pageNo), // 页码
        pageSize: String(this.searchParams.pageSize), // 页数
        tplClassifyCd:n
      }
      this.$axios
        .get(this.$interParams.h5Inters.getTemplateListPage, searchParams)
        .then(
          (res) => {
            if (res.code == '200') {
              this.modeLoding = false
              this.pageList = res.data.list || []
              this.searchParams.totalCount = res.data.totalCount
            }
          },
          (err) => {
            this.modeLoding = false
          }
        )
    },
    // 查询模版详情
    sceneUpdateInfo(id) {
      this.$axios
        .get(this.$interParams.h5Inters.getTemplateByIdDetails + id)
        .then(
          (res) => {
            if (res.code == '200') {
              this.pageId = id
              this.goUrl = res.data.url
              // this.projectData = res.data.editData
              this.$store.dispatch('setPrjectData', JSON.parse(res.data.data))
              document
                .querySelector('body')
                .setAttribute('style', 'overflow:hidden;')
              this.wrapperShow = true
            }
          },
          (err) => {}
        )
    },
    delTemplate(item) {
      this.$confirm('确认删除模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .delete(this.$interParams.h5Inters.deleteTemplate + item.id)
          .then((data) => {
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success',
            })
            this.getPageList()
          })
      })
    },
    checks(n){
      this.getPageList(n)
    }
  },
}
</script>

<style lang="scss" >
.main {
  // box-sizing: border-box;
  .el-header {
    position: relative;
  }
}
.main-header {
  width: 100%;
  position: relative;
  .header {
    position: absolute;
    z-index: 1100;
    width: 100%;
    img {
      margin-left: 106px;
      margin-top: 10px;
      width: 200px;
      // height: 52px;
    }
    ul {
      overflow: hidden;
      margin-bottom: 0;
      li {
        float: left;
        margin: 10px 25px;
        font-size: $moddle-font;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 35px;
        cursor: pointer;
      }
    }
    .right {
      text-align: right;
      .login {
        display: inline-block;
        width: 108px;

        background: #fff;
        border-radius: 4px;
        text-align: center;
        font-size: $small-font;
        font-family: PingFang SC;
        font-weight: 500;
        color: $main-color;
        line-height: 29px;
        margin: 10px 112px 0 0;
        padding: 2px 0;
        cursor: pointer;
      }
    }
  }
  .sw-img {
    height: 315px;
    width: 100%;
    background-image: url('../../common/images/main/banner.png');
    background-position: center center;
    background-size: 100% 100%;
  }
}
.main-body {
  position: relative;
  .bg {
    position: absolute;
    z-index: 101;
    top: -320px;
    width: 100%;
    height: 600px;
    //background-image: url('../../common/images/main/bg_gd.png');
    // background-size: 100% 100%;
    background-position: center center;
    background-size: cover;
  }
  .max-box {
    padding: $max-font;
  }
  .body-box {
    position: relative;
    top: -140px;
    width: $box-width;
    margin: 0 auto;
    z-index: 102;
  }

  .box-card {
    background-position: center center;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    padding: 40px 55px;
    height: 180px;
    .card-head {
      text-align: center;
      img {
        height: 62px;
      }
      p {
        margin-top: 10px;
        font-size: $max-font;
        font-family: PingFang SC;
        font-weight: 600;
        color: #343434;
      }
    }
    .card-item {
      float: left;
      text-align: center;
      width: 33.3333333333%;
      font-size: $small-font;
      padding: 5px 0;
      font-family: PingFang SC;
      font-weight: 600;
      cursor: pointer;
      color: #6a788e;
      &:hover {
        color: $main-color;
      }
    }
  }
  .one {
    background-image: url('../../common/images/main/pic_01.png');
  }
  .two {
    background-image: url('../../common/images/main/pic_02.png');
  }
  .tree {
    background-image: url('../../common/images/main/pic_03.png');
  }
  .content {
    margin-top: 30px;
    padding: 0 30px;
    .divider {
      text-align: center;
      small {
        font-size: $moddle-font;
        font-family: PingFang SC;
        font-weight: 600;
        color: #ccd0d6;
      }
      h4 {
        font-size: $h-font;
        font-family: PingFang SC;
        font-weight: 600;
        color: #343434;
      }
    }
    .btn {
      img {
        height: 20px;
        vertical-align: text-top;
      }

      span {
        display: inline-block;
        text-align: center;
        width: 120px;
        height: 34px;
        background: #ffffff;
        border: 1px solid #d1d1d1;
        border-radius: 4px;
        line-height: 32px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9a9a9a;
        margin-right: 28px;
        cursor: pointer;
        &:hover {
          border: 1px solid $main-color;
          color: $main-color;
        }
      }
      .active {
        border: 1px solid $main-color;
        color: $main-color;
      }
    }
    .mode {
      margin-top: 25px;
      min-height: 300px;
      transition: all 0.3s;
      .mode-type {
        position: absolute;
        top: 0;
        right: 0;
        width: 52px;
        z-index: 100;
        span {
          display: block;
          width: 52px;
          height: 23px;
          background: url('../../common/images/main/pic_04.png') no-repeat
            center;
          background-size: cover;
          text-align: center;
          font-size: 12px;
          color: #fff;
          line-height: 23px;
        }
      }
      .mode-card {
        cursor: pointer;
        position: relative;
        margin-bottom: 30px;
        .mode-bg {
          position: absolute;
          display: flex;
          background: rgba(0, 0, 0, 0.5);
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 380px;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s;
          div {
            text-align: center;
          }
          p {
            margin-top: 10px;
            font-size: $moddle-font;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
        }

        &:hover {
          .mode-bg {
            opacity: 1;
          }
        }
      }
      span.title {
        font-size: $max-font;
        font-family: PingFang SC;
        font-weight: 500;
        color: #343434;
      }
      time {
        font-size: 13px;
        color: #999;
      }

      .bottom {
        line-height: 12px;
      }

      .button {
        margin-top: 8px;
        padding: 0;
        float: right;
      }

      .image {
        width: 100%;
        height: 380px;
        display: flex;
        overflow: hidden;
        align-items: center;
        img {
          width: 100%;
        }
      }

      .clearfix:before,
      .clearfix:after {
        display: table;
        content: '';
      }

      .clearfix:after {
        clear: both;
      }
    }
    [class*='el-col-'] {
      float: left;
    }
  }
}
.main-foot {
  position: relative;
  text-align: center;
  top: -100px;
}
.login-left {
  padding: 20px;
  .logo {
    position: relative;
    top: -46px;
  }
}
.login-right {
  position: relative;
  padding: 20px;
  .yanzheng {
    padding: 3px 0 0 10px;
  }
  .submitbtn {
    width: 70%;
  }
  h3 {
    position: relative;
    top: -30px;
    margin-left: 30px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #343434;
  }
}
</style>
