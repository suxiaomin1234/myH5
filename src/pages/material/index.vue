<template>
  <div class="materialLibrary">
    <div class="material-top">
      <img
        class="material-banner"
        src="@src/common/images/material/banner.png"
        alt=""
        srcset=""
      />
      <div class="material-nav">
        <img
          class="material-logo"
          src="@src/common/images/main/logo_tic.png"
          alt=""
          srcset=""
        />
        <div class="material-nav-box">
          <span @click="goOther(0)">模板首页</span>
          <span @click="goOther(1)">我的H5</span>
          <span class="active">素材库</span>
        </div>
      </div>
    </div>
    <div class="material-con">
      <div class="material-left">
        <div class="material-left-box">
          <!-- <div :class="{'active': tabNum == 0}" @click="changeTab(0)">
            <i class="el-icon-files"></i>
            <span>模板库</span>
          </div> -->
          <div :class="{ active: tabNum == 1 }" @click="changeTab(1)">
            <i class="el-icon-picture-outline"></i>
            <span>图片库</span>
          </div>
          <div :class="{ active: tabNum == 2 }" @click="changeTab(2)">
            <i class="el-icon-video-play"></i>
            <span>音乐库</span>
          </div>
        </div>
      </div>
      <div class="material-right">
        <div class="search-box">
          <div class="music-search" v-if="showSou">
            <input
              type="text"
              v-model="searchName"
              :placeholder="placeholder"
              @keyup.enter="search"
            />
            <span @click="search">
              <i class="el-icon-search"></i>
            </span>
          </div>
          <div v-show="tabNum == 2" class="music-upload">
            <el-upload
              class="audio-add-ipt"
              action="musicAction"
              :before-upload="beforeUploadMusic"
              accept="mp3,ogg,wav"
              :show-file-list="false"
            >
              <el-button type="primary" size="small" :loading="musicLoading"
                >{{ musicText }}<i class="el-icon-upload el-icon--right"></i
              ></el-button>
            </el-upload>
          </div>
          <div v-show="tabNum == 0" class="template-type">
            <span
              :class="templateType == '1' ? 'active' : ''"
              @click="changeTemplateTtype('1')"
              ><i class="el-icon-picture-outline-round"></i> H5</span
            >
            <span
              :class="templateType == '2' ? 'active' : ''"
              @click="changeTemplateTtype('2')"
              ><i class="el-icon-picture-outline"></i> 长图文</span
            >
          </div>
        </div>
        <div class="con-box">
          <el-scrollbar>
            <!-- <templateDom ref="templateDom" v-show="tabNum == 0" :templateType="templateType" :searchName="searchName" @lengthChange="lengthChange" @setLab="setLab" @setTemp="setTemp" /> -->
            <pictureDom
              ref="pictureDom"
              v-show="tabNum == 1"
              @lengthChange="lengthChange"
              @imgfen="imgfen"
              :searchName="searchName"
              @imgfensts="imgfensts"
              @soushow="soushow"
            />
            <musicDom
              ref="musicDom"
              v-show="tabNum == 2"
              :musicPlay="musicPlay"
              :searchName="searchName"
              @lengthChange="lengthChange"
            />
          </el-scrollbar>
        </div>
        <div class="pagination">
          <el-pagination
            small
            background
            layout="total, prev, pager, next"
            :page-size="pageSize"
            :total="paginationLen"
            @prev-click="changePage"
            @next-click="changePage"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title="H5标签分类"
      :visible.sync="DialogVisible"
      width="30%"
      center
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="H5名称" prop="pass">
          <el-input
            type="input"
            size="small"
            :disabled="true"
            v-model="ruleForm.title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="添加标签" prop="pass">
          <el-input
            type="input"
            size="small"
            v-model="ruleForm.biaqian"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="checkPass">
          <el-upload
            class="avatar-uploader"
            action="xxxx"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="coverPic" :src="coverPic" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              封面图片推荐尺寸750*1024
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="setItem">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="ImgVisible" width="30%" center>
      <el-form
        :model="categoryForm"
        status-icon
        :rules="categoryRules"
        ref="categoryForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            type="input"
            size="small"
            v-model="categoryForm.categoryName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="netImg">取 消</el-button>
        <el-button size="mini" type="primary" @click="setImg('categoryForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import notFundData from "@src/components/notFundData";
import pictureDom from "./compontents/picture";
import musicDom from "./compontents/music";
import templateDom from "./compontents/template";
export default {
  name: "materialLibrary",
  components: {
    notFundData,
    pictureDom,
    musicDom,
    templateDom,
  },
  data() {
    return {
      tabNum: 1,
      placeholder: "请输入分类名称",
      paginationLen: 0, // 总数

      pageSize: 10,
      DialogVisible: false,
      rules: {},
      coverPic: "",
      ruleForm: {
        title: "",
        coverPic: "",
        biaqian: "",
      },

      searchName: "",
      templateType: "",
      musicPlay: false,
      musicText: "上传音乐",
      musicLoading: false,
      ImgVisible: false,
      categoryId: "",
      optionsFen: [],
      offOn: false,
      multiId: "",
      showAdd: 0,
      title:'添加分类',
      categoryForm:{
        categoryName:''
      },
      categoryRules:{
          categoryName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      },
      showSou:true
    };
  },
  created() {
    // this.getCategoryList(0)
  },
  methods: {
    goOther(val) {
      if (val == 0) {
        this.$router.push({
          path: "/main",
          query: {},
        });
      } else if (val == 1) {
        this.$router.push({
          path: "/h5",
          query: {},
        });
      } else if (val == 2) {
        this.$router.push({
          path: "/material",
          query: {},
        });
      }
    },
    changeTab(val) {
      if (this.tabNum == val) return;
      this.tabNum = val;
      this.searchName = "";
      this.paginationLen = 0;
      this.musicPlay = false;
      this.$refs.musicDom.pause();
      if (val == 0) {
        this.placeholder = "请输入模板名称";
        this.$refs.templateDom.getTemplateLibs(1);
      } else if (val == 1) {
        this.placeholder = "请输入分类名称";
      } else if (val == 2) {
        this.placeholder = "请输入音乐名称";
        // this.pageSize = this.musicPageSize
        this.$refs.musicDom.getMusicLibs(1);
      }
    },
    changeTemplateTtype(val) {
      this.templateType = val == this.templateType ? "" : val;
      this.$refs.templateDom.getTemplateLibs(1);
    },
    soushow(val){
      this.showSou = val
    },
    search() {
      if (this.tabNum == 0) {
        // this.getTemplateLibs(1);
      } else if (this.tabNum == 1) {
        this.$refs.pictureDom.getFenList(1,this.searchName);
      } else if (this.tabNum == 2) {
        this.$refs.musicDom.pause();
        this.$refs.musicDom.getMusicLibs(1);
      }
    },
    changePage(val) {
      if (this.tabNum == 0) {
        // this.getTemplateLibs(val);
      } else if (this.tabNum == 1) { 
        this.$refs.pictureDom.getList(val);
      } else if (this.tabNum == 2) {
        this.musicPlay = false;
        this.$refs.musicDom.pause();
        this.$refs.musicDom.getMusicLibs(1);
      }
    },
    lengthChange(val) {
      this.paginationLen = val;
    },
    // 子组件的调用模板标签分类
    setTemp(item) {
      this.DialogVisible = true;
      this.ruleForm = Object.assign({}, item);
      this.coverPic = item.coverPic;
    },
    // 上传
    beforeAvatarUpload(file) {
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error("文件不能超过2M！");
        return false;
      }
      let eqImgFile = new FormData();
      eqImgFile.append("type", "3");
      eqImgFile.append("uploadFile", file);
      this.$axios.post(this.$interParams.h5Inters.upload, eqImgFile).then(
        (res) => {
          if (res.code == "200") {
            this.ruleForm.coverPic = res.data.url;
            this.coverPic = res.data.url;
            // this.ruleForm.id = res.data.id
          }
        },
        (err) => {}
      );
    },
    // h5标签分类编辑
    setItem() {},
    setLab(item) {},


    // 打开分类弹窗
    imgfen(item) {console.log(1111,item)
      this.ImgVisible = true;
      this.title = '修改分类'
      this.categoryForm.categoryName = item.name;
      this.categoryForm.id = item.id;
    },
    // 分类查询
    // getComfen(name) {
    //   let params = { pageSize: 10, pageNo: 1, type: "3", name: name };
    //   this.$axios
    //     .get(this.$interParams.h5Inters.getMultimediaCategoryList, params)
    //     .then(
    //       (data) => {
    //         if (data.code == 200) {
    //           this.optionsFen = data.data.list;
    //         }
    //       },
    //       (err) => {
    //         this.$message.error(err.message);
    //       }
    //     );
    // },

    // 打开分类弹窗
    imgfensts(name) {
      this.categoryForm.id = '';
      this.categoryForm.categoryName = '';
      this.ImgVisible = true;
    },
    // 确定分类
    setImg(formName) {
      // 添加分类
      this.$refs[formName].validate((valid) => {
          if (valid) {
          this.$axios
                .put(this.$interParams.h5Inters.submitCategory,{
                  type:'3',
                  name: this.categoryForm.categoryName,
                  parentId:'0',
                  id:this.categoryForm.id,
                  logo:'',
                  orderNum:'',
                  status:'1'
                })
                .then(
                  (data) => {
                    if (data.code == 200) {
                      this.ImgVisible = false;
                      this.$refs.pictureDom.getFenList(this.categoryForm.categoryName);
                    }
                  },
                  (err) => {
                    this.$message.error(err.message);
                  }
                );
          }else{
            this.$message.error('请添加分类');
          }
        })
    },
    // 取消分类
    netImg() {
      this.ImgVisible = false;
      this.categoryForm.categoryName = '';
      this.categoryForm.id = '';
    },


    beforeUploadMusic(file) {
      let temp1 = file.name.split(".");
      let temp = temp1[temp1.length - 1];
      if (!["mp3", "ogg", "wav"].includes(temp)) {
        this.$message.error("请上传mp3/ogg/wav文件");
        return false;
      }
      this.uploadMusic(file);
      return false;
    },
    uploadMusic(file) {
      this.musicLoading = true;
      this.musicText = "正在上传";
      let params = new FormData();
      params.append("uploadFile", file);
      params.append("type", "1");
      params.append("categoryId", "");
      this.$axios.post(this.$interParams.h5Inters.upload, params).then(
        (data) => {
          this.$message.success("上传成功!");
          this.musicLoading = false;
          this.musicText = "上传音乐";
          this.$refs.musicDom.getMusicLibs(1);
        },
        (err) => {
          this.musicLoading = false;
          this.musicText = "上传音乐";
        }
      );
    },
    // getCategoryList(val) {
    //   let arr = []
    //   this.$axios.get(this.$interParams.h5Inters.getCategoryList).then(
    //     (res) => {
    //       if (res.code == '200') {
    //         arr = res.data.data || []
    //       }
    //     },
    //     (err) => {}
    //   )
    //   if (val == 0) {
    //   }
    // },
  },
};
</script>
<style lang="scss">
$box-shadow: 0px 1px 6px 2px #dadcdf;
.materialLibrary {
  background: #f0f2f5;
  font-family: PingFang SC;
  .material-top {
    position: relative;
    .material-banner {
      width: 100%;
      height: 250px;
    }
    .material-nav {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      padding: 10px;
      height: 55px;
      .material-logo {
        position: absolute;
        left: 10%;
        width: 125px;
      }
      .material-nav-box {
        position: absolute;
        left: 30%;
        height: 70%;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        span {
          border-bottom: 3px solid transparent;
          height: 100%;
          display: inline-block;
          margin: 0 20px;
          box-sizing: border-box;
          padding: 5px 20px;
          cursor: pointer;
          &:hover {
            border-bottom: 3px solid #fff !important;
          }
        }
        .active {
          border-bottom: 3px solid #fff !important;
        }
      }
    }
  }
  .material-con {
    margin: 0 10%;
    display: flex;
    .material-left {
      background: #fff;
      // flex: 1;
      width: 140px;
      margin: 10px;
      padding: 45px 0;
      box-shadow: $box-shadow;
      border-radius: 10px;
      height: 0%;
      .material-left-box {
        display: flex;
        flex-direction: column;
        div {
          color: #666;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 10px;
          margin: 10px 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          box-sizing: border-box;
          border-left: 6px solid transparent;
          span {
            flex: 5;
            margin-left: 15px;
          }
          i {
            flex: 2;
            text-align: center;
            font-size: 22px;
          }
          &:hover {
            color: $main-color;
          }
        }
        .active {
          color: $main-color;
          border-left-color: $main-color;
        }
      }
    }
    .material-right {
      flex: 6;
      margin-top: 10px;
      .search-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
        .music-search {
          width: 400px;
          border: 1px solid #d1d1d1;
          border-radius: 40px;
          padding: 5px 30px;
          background: #fff;
          color: #666;
          display: flex;
          justify-content: space-between;
          box-shadow: $box-shadow;
          input {
            background: none;
            outline: none;
            border: none;
            flex: 6;
          }
          span {
            flex: 1;
            text-align: center;
            cursor: pointer;
            i {
              font-size: 18px;
            }
          }
        }
        .template-type {
          img {
            height: 20px;
            vertical-align: text-top;
          }

          span {
            display: inline-block;
            text-align: center;
            width: 90px;
            height: 30px;
            background: #ffffff;
            border: 1px solid #d1d1d1;
            border-radius: 4px;
            line-height: 28px;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #9a9a9a;
            margin-left: 20px;
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
      }
      .con-box {
        height: calc(100vh - 400px);
        .el-scrollbar {
          height: 100%;
        }
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }

      .pagination {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}
</style>
