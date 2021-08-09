<template>
  <div class="h5">
    <div class='h5-header'>
      <div class="header">
        <div class="h5-flex">
          <el-row>
            <el-col :span="6"><img src="../../common/images/main/logo_tic02.png" alt=""></el-col>
            <el-col :span="12">
              <ul>
                <li @click="enterMain">模板首页</li>
                <li class='active'>我的H5</li>
                <li @click="imgStore">素材库</li>
              </ul>
            </el-col>
            <el-col :span="6" class='right'>
              <!-- <div class='login' @click="enterlogin">登录</div> -->
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col :span='24'>
            <div class='h5-bg'></div>
          </el-col>
          <!-- <img src="http://hnh5.scrm.host:10580/gallery141/201905/2206091680.png" alt=""> -->
        </el-row>
        <el-row>
          <el-col :span='24'>
            <div class='h5-title'>
              快捷的体验，全闭环一站式服务
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class='h5-body'>
      <div class='tab'>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-body">
          <el-tab-pane label="用户管理" name="first">
            <span slot="label" class='tab-box'>
              <i class="el-icon-basketball"></i>
              <div class='tab-title'>全部</div>
            </span>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            <span slot="label" class='tab-box'>
              <i class="el-icon-pie-chart"></i>
              <div class='tab-title'>已发布</div>
            </span>
          </el-tab-pane>
          <el-tab-pane label="角色管理" name="third">
            <span slot="label" class='tab-box'>
              <i class="el-icon-circle-check"></i>
              <div class='tab-title'>未发布</div>
            </span>
          </el-tab-pane>
          <!-- <el-tab-pane label="定时任务补偿" name="fourth">
            <span slot="label" class='tab-box'>
              <i class="el-icon-circle-plus-outline"></i>
              <div class='tab-title'>有修改</div>
            </span>
          </el-tab-pane> -->
          <el-tab-pane label="定时任务补偿" name="fier">
            <span slot="label" class='tab-box'>
              <i class="el-icon-circle-close"></i>
              <div class='tab-title'>已下线</div>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="tab-item">
        <div class='mode' v-loading='modeLoding'>
          <el-row :gutter="60">
            <el-col :span="6">
              <el-card :body-style="{ padding: '0px' }" class="mode-card first">
                <div class='moban' @click="create(0)">
                  <i class="el-icon-crop"></i>
                  <div>模板创建</div>
                </div>
                <div class='addmoban' @click="create(1)">
                  <i class="el-icon-folder-add"></i>
                  <div>空白创建</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6" v-for="(item,index) in pageList" :key='index'>
              <el-card :body-style="{ padding: '0px' }" class="mode-card">
                <div class='mode-type'>
                  <img v-if="item.status == '1'" src="../../common/images/main/pic_wfb.png" alt="">
                  <img v-if="item.status == '2'" src="../../common/images/main/pic_yfb.png" alt="">
                  <span v-if="item.status == '3'" class="mode-type-t-gray">已下线</span>
                  <span v-if="item.type == '2'" class="mode-type-t">长图文</span>
                  <!--<img v-if="item.editStatus == '2'" src="../../common/images/main/pic_yxg.png" alt=""> -->
                </div>
                <div class='image'>
                  <img :src="item.coverPic | replaceIP">
                  <!--<img :src="item.coverPic">-->
                </div>
                <div class="mode-bg">
                  <div>
                    <div v-show="item.status != '2'" class='mode-bg-item' @click="enterH5(item.id, item.type,item.status)">
                      <i class="el-icon-edit"></i>
                      <p>编辑</p>
                    </div>
                    <div class='mode-bg-item' @click='wrapperChange(item.id)'>
                      <i class="el-icon-view"></i>
                      <p>预览</p>
                    </div>
                    <!-- <div class='mode-bg-item'>
                      <i class="el-icon-picture-outline"></i>
                      <p>数据</p>
                    </div> -->
                  </div>
                </div>
                <div style="padding: 14px;">
                  <span class="title" :title="item.title">{{item.title}}</span>
                  <!-- <el-button type="text" class="button">立即制作</el-button> -->
                  <div class='time'>{{item.udtTm}}</div>
                </div>
                <div class="item-setting">
                  <el-row>
                    <el-col :span='6'>
                      <el-link :underline="false" type="info" @click="copySceneInf(item.id)">复制</el-link>
                    </el-col>
                    <el-col :span='6'>
                      <el-link :underline="false" :disabled="item.status == '2'" type="info" @click='deleteSceneInf(item.id)'>删除</el-link>
                    </el-col>
                    <el-col :span='6'>
                      <el-link :underline="false" :disabled="item.status == '2'" type="info" @click='setSceneInf(item)'>设置</el-link>
                    </el-col>
                    <el-col :span='6'>
                      <!-- <el-link :underline="false" type="info" @click='publishScene(item.id)'>发布</el-link> -->
                      <el-dropdown placement="top-start">
                        <span class="">
                          <!-- <el-button type="text" size="mini">更多 <i class="el-icon-more-outline"></i></el-button> -->
                          <el-link :underline="false" type="info"> <i class="el-icon-more-outline"></i></el-link>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <div v-if="item.status == '1' || item.status == '3'" @click="publishScene(item.id, index)">发布</div>
                            <div v-else-if="item.status == '2'" @click="downPage(item.id, index)">下线</div>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <div @click="setAsTemplate(item.id)">复制为模板</div>
                          </el-dropdown-item>
                          <!-- <el-dropdown-item :disabled="item.status == '2'">
                            <div @click="publishScene(item.id)">发布</div>
                          </el-dropdown-item> -->

                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>

          </el-row>
        </div>
      </div>
    </div>
    <div class='h5-foot'>
      <el-pagination background layout="prev, pager, next" :page-size='searchParams.pageSize' :total="searchParams.totalCount" @current-change='getPage'>
      </el-pagination>
    </div>
    <viewPreview v-if="wrapperShow" :pageData="projectData" :isRelease="isRelease" :isTemplate="isTemplate" :goUrl="goUrl" :pageId="pageId" @closePreview="closePreview"
      v-loading="loading" :rightShow='false'>
    </viewPreview>

    <el-dialog :title="centerDialogVisibleTitle" :visible.sync="centerDialogVisible" width="30%" center>
      <div class='center'>
        <el-button size="mini" @click="pageMode = 'h5'" plain>&nbsp;&nbsp;&nbsp;h 5&nbsp;&nbsp;&nbsp;</el-button> &nbsp;&nbsp;&nbsp; <el-button @click="pageMode = 'longPage'"
          size="mini" plain>长图文</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="createNewPage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="H5信息" :visible.sync="DialogVisible" width="30%" center>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="H5名称" prop="pass">
          <el-input type="input" size='small' v-model="ruleForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="checkPass">
          <el-upload class="avatar-uploader" action="xxxx" :show-file-list="false" :before-upload="beforeAvatarUpload">

            <img v-if="coverPic" :src="coverPic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">封面图片推荐尺寸750*1024</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="setItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import previewWrapper from '@src/components/preview-wrapper'
import viewPreview from '../home/components/view-preview'
export default {
  components: {
    viewPreview,
  },
  data() {
    return {
      loading: false,
      modeLoding: false,
      wrapperShow: false,
      centerDialogVisible: false,
      centerDialogVisibleTitle: '请选择H5类型',
      createType: '1', // 0 模板创建 , 1 空白内容创建
      DialogVisible: false,
      imageUrl: '',
      pageId: '',
      goUrl: '',
      isTemplate: '0',
      isRelease: '1',
      coverPic: '',
      activeName: 'first',
      lastActiveNAme: '',
      form: {},
      ruleForm: {
        title: '',
        coverPic: '',
      },
      rules: {},
      searchParams: {
        // 页数
        pageNo: 1,
        pageSize: 11,
        totalCount: 0,
      },
      pageList: [], // 列表
      pageMode: 'h5',
      projectData: '',
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
     // 进入素材库
    imgStore(){
      this.$router.push({
          path: '/material',
          query: {},
        })
    },
    // 进入首页
    enterMain() {
      this.$router.push({
        path: '/main',
        query: {},
      })
    },
    handleClick() {
      if (this.lastActiveNAme == this.activeName) return
      this.getPageList()
    },
    enterlogin() {},
    // 进入h5编辑页
    enterH5(id, type, status) {
      let pathName = ''
      if (type == '1') {
        pathName = '/editor'
      } else if (type == '2') {
        pathName = '/editor/long'
      }
      this.$router.push({
        path: pathName,
        query: { id: id, type: 'untemplate',status:status },
      })
      // this.$router.push({
      //     path: 'editor',
      //     query: {
      //         id: id,
      //         type: 'untemplate'
      //     }
      // })
    },
    // 复制
    copySceneInf(id) {
      this.$confirm('是否复制', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.sceneUpdateInfo(id, '0')
      })
    },
    // 设置
    setSceneInf(item) {
      this.DialogVisible = true
      this.ruleForm = Object.assign({}, item)
      console.log('ttt',this.ruleForm)
      this.coverPic = item.coverPic
    },
    // 删除
    deleteSceneInf(id) {
      this.$confirm('此操作将永久删除该模版, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .delete(this.$interParams.h5Inters.deleteSceneInf + id)
          .then((res) => {
            if (res.code == '200') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
              })
              this.getPageList()
            } else {
              this.$notify({
                title: '提示',
                message: res.message,
                type: 'warning',
              })
            }
          })
      })
    },
    // 发布
    publishScene(id) {
      this.$confirm('此操作将发布, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .put(this.$interParams.h5Inters.publishScene + id)
          .then((res) => {
            if (res.code == '200') {
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success',
              })
              this.getPageList()
            } else {
              this.$notify({
                title: '提示',
                message: res.message,
                type: 'warning',
              })
            }
          })
      })
    },
    // 下线
    downPage(id, index) {
      this.$confirm('此操作将下线, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.modeLoding = true
        this.$axios
          .put(this.$interParams.h5Inters.offlineScene + id)
          .then((res) => {
            this.modeLoding = false
            if (res.code == '200') {
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success',
              })
              this.getPageList()
            } else {
              this.$notify({
                title: '提示',
                message: res.message,
                type: 'warning',
              })
            }
          })
          .catch(() => {
            this.modeLoding = false
          })
      })
    },
    // 新增为模版
    setAsTemplate(id) {
      this.$confirm('是否复制为模版', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.sceneUpdateInfo(id, '1')
      })
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
    // 页数
    getPage(val) {
      this.searchParams.pageNo = val
      this.getPageList()
    },
    // 新建模版
    createNewPage() {
      let pathName = ''
      if (this.pageMode == 'h5') {
        pathName = '/editor'
      } else if (this.pageMode == 'longPage') {
        pathName = '/editor/long'
      }
      this.$router.push({
        path: pathName,
        query: { type: 'untemplate', createType: this.createType },
      })
    },
    // 创建新内容（模板创建 空白内容制作）
    create(type) {
      if (type == '0') {
        // this.centerDialogVisibleTitle = '请选择创建H5模板类型'
        // this.createType = '0'
        this.$router.push({
          path: '/main',
          query: {},
        })
      } else {
        this.centerDialogVisibleTitle = '请选择H5类型'
        this.createType = '1'
      }
      this.centerDialogVisible = true
    },
    /**
     * 接口
     */
    // 获取所有页面

    getPageList() {
      this.modeLoding = true
      let params = {
        status: '',
        type: '',
        editStatus: '',
        pageNo: this.searchParams.pageNo,
        pageSize: this.searchParams.pageSize,
      }
      switch (this.activeName) {
        case 'first':
          params.status = ''
          break
        case 'second':
          params.status = '2'
          break
        case 'third':
          params.status = '1'
          break
        case 'fourth':
          params.editStatus = '2'
          break
        case 'fier':
          params.status = '3'
          break
      }
      this.lastActiveNAme = this.activeName
      this.$axios.get(this.$interParams.h5Inters.getSceneSelfList, params).then(
        (res) => {
          this.modeLoding = false
          this.pageList = res.data.list || []
          this.searchParams.totalCount = res.data.totalCount
        },
        (err) => {
          this.modeLoding = false
        }
      )
    },
    // 上传
    beforeAvatarUpload(file) {
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('文件不能超过2M！')
        return false
      }
      let eqImgFile = new FormData()
      eqImgFile.append('type', '3')
      eqImgFile.append('uploadFile', file)
      this.$axios.post(this.$interParams.h5Inters.upload, eqImgFile).then(
        (res) => {
          if (res.code == '200') {
            this.ruleForm.coverPic = res.data.url
            this.coverPic = res.data.url
            // this.ruleForm.id = res.data.id
          }
        },
        (err) => {}
      )
    },
    // h5信息编辑
    setItem() {
      if (this.ruleForm.title && this.ruleForm.title.length > 100) {
        this.$message.warning('H5名称长度不能超过100个字')
        return false
      }
      this.$confirm('是否修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .put(this.$interParams.h5Inters.updateSetSceneById, this.ruleForm)
          .then((res) => {
            if (res.code == '200') {
              this.$notify({
                title: '成功',
                message: res.message,
                type: 'success',
              })
              this.DialogVisible = false
              this.getPageList()
            } else {
              this.$notify({
                title: '提示',
                message: res.message,
                type: 'warning',
              })
            }
          })
      })
    },
    // 查询H5详情
    sceneUpdateInfo(id, val) {
      this.$axios.get(this.$interParams.h5Inters.sceneUpdateInfo + id).then(
        (res) => {
          if (res.code == '200') {
            console.log(res.data)
            this.form = Object.assign({}, res.data)
            if (val == '0') {
              this.addScene()
            } else if (val == '1') {
              this.addTemplate()
            } else {
              this.pageId = id
              this.goUrl = res.data.url
              this.$store.dispatch(
                'setPrjectData',
                JSON.parse(res.data.editData)
              )
              this.isRelease = res.data.status
              this.loading = true
              this.$axios
                .get(this.$interParams.h5Inters.previewScene + id)
                .then((data) => {
                  this.loading = false
                  if (data.code == '200') {
                    document
                      .querySelector('body')
                      .setAttribute('style', 'overflow:hidden;')
                    this.wrapperShow = true
                  } else {
                    this.$message.error(data.message)
                  }
                })
                .catch((err) => {
                  this.loading = false
                })
            }
          }
        },
        (err) => {}
      )
    },
    // 保存详情
    addScene() {
      this.$axios.post(this.$interParams.h5Inters.addScene, this.form).then(
        (res) => {
          if (res.code == '200') {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
            })
            this.getPageList()
          }
        },
        (err) => {}
      )
    },
    // 新增模版
    addTemplate() {
      console.log('xin',this.form)
      const params = {
        tplClassifyCd:this.form.tplClassifyCd,
        title: this.form.title,
        coverPic: this.form.coverPic,
        sceneType: this.form.type,
        isPublic: '1',
        type: this.form.type,
        data: this.form.editData,
        status: '1',
        firstIsShow: '1',
        orderNum: '1',
      }
      this.$axios.post(this.$interParams.h5Inters.addTemplate, params).then(
        (res) => {
          if (res.code == '200') {
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
            })
            this.getPageList()
          }
        },
        (err) => {}
      )
    },
  },
}
</script>

<style lang="scss">
$small-font: 14px;
$moddle-font: 16px;
$max-font: 18px;
$h-font: 30px;
$box-width: 1200px;
.h5 {
  background: #eff2f5;
  padding-top: 55px;
  .center {
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: $main-color;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 270px;
    line-height: 270px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 270px;
    display: block;
  }
  .h5-flex {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 105;
    background: #fff;
  }
  .h5-header {
    width: 100%;
    position: relative;
    .header {
      background: #fff;
      z-index: 100;
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
          padding: 10px 25px;
          font-size: $moddle-font;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.65);
          line-height: 35px;
          cursor: pointer;
          &:hover {
            background: $main-color;
            color: #fff;
          }
        }
        .active {
          background: $main-color;
          color: #fff;
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
    .h5-bg {
      width: 100%;
      height: 127px;
      background-image: url('http://hnh5.scrm.host:10580/gallery141/201905/2206091680.png');
      // background-size: 100% 100%;
      background-position: center center;
      background-size: contain;
    }
    .h5-title {
      width: 100%;
      height: 210px;
      text-align: center;
      color: #333;
      font-size: 32px;
      font-weight: 700;
      padding-top: 70px;
    }
  }
  .h5-body {
    position: relative;
    background: #eff2f5;
    .tab {
      background: #fff;
      text-align: center;
      height: 77px;
      .tab-body {
        display: inline-block;
        .el-tabs__nav-wrap::after {
          background-color: transparent !important;
        }
        i {
          font-size: 36px;
        }
        .tab-title {
          font-size: $max-font;
          position: relative;
          top: -10px;
        }
      }
      .tab-box {
        display: inline-block;
        width: 204px;
        padding: 0 75px;
        height: 76px;
      }
    }
    .tab-item {
      width: 1200px;
      margin: 40px auto 0;
      .first {
        padding: 15px;
        text-align: center;
        color: #657ea8;
        i {
          font-size: 24px;
        }
        div {
          font-size: $moddle-font;
          font-weight: 700;
        }
      }

      .mode {
        margin-top: 25px;
        .moban {
          height: 333px;
          border: 1px dashed #c1cadc;
          padding: 140px 70px;
        }
        .addmoban {
          height: 107px;
          border: 1px dashed #c1cadc;
          padding: 24px 70px;
          margin-top: 10px;
        }
        .mode-card {
          cursor: pointer;
          position: relative;
          margin-bottom: 50px;
          height: 483px;
          .mode-type {
            position: absolute;
            top: 0;
            right: 0;
            width: 52px;
            z-index: 100;
            img {
              display: block;
            }
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
              border-radius: 6px 6px 6px 0;
            }
            .mode-type-t-gray {
              background: #666;
            }
          }
          .mode-bg {
            position: absolute;
            display: flex;
            background: rgba(0, 0, 0, 0.5);
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            height: 344px;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s;
            div {
              text-align: center;
            }
            i {
              font-weight: 400;
              font-size: 28px;
            }
            p {
              margin-bottom: 0;

              font-size: $small-font;
              font-family: PingFang SC;
              font-weight: 400;
            }
          }

          &:hover {
            box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.2);
            .mode-bg {
              opacity: 1;
            }
          }
          .mode-bg-item {
            margin: 30px;
            width: 65px;
            height: 65px;
            text-align: center;
            background: #ffffff;
            color: #657ea8;
            padding: 10px;
            border-radius: 50%;
          }
        }
        span.title {
          display: block;
          height: 24px;
          font-size: $moddle-font;
          font-family: PingFang SC;
          font-weight: 500;
          color: #343434;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time {
          height: 21px;
          color: #949494;
          font-family: PingFang SC;
          font-size: $small-font;
          margin: 5px 0;
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
          height: 344px;
          overflow: hidden;
          display: flex;
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
        .item-setting {
          margin: 0 20px;
          padding: 15px 0 15px;
          text-align: center;
          border-top: 1px solid #efefef;
        }
      }
    }
  }
  .h5-foot {
    position: relative;
    text-align: center;
    padding: 0 0 30px;
    background: #eff2f5;
  }
}
</style>
