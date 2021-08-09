<template>
  <el-dialog
    class="components-image-libs-wrapper"
    title="我的图片"
    :visible.sync="dialogVisible"
    width="600px"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick($event)">
      <el-tab-pane v-for="(item,index) in fenList" :key="index" :label="item.name" :name="item.name">
        <div class="components-image-libs">
          <div class="image-lib-side-bar"></div>
          <div class="image-lib-inner">
            <div class="image-lib-btn">
              <el-upload
                :action="imgAction"
                :before-upload="beforeUpload"
                accept="jpg,jpeg,png,gif,JPG,JPEG,GIF"
                :show-file-list="false"
              >
                <el-button size="small" type="primary" :loading="imgLoading">{{
                  imgText
                }}</el-button>
                <span slot="tip" class="el-upload__tip marginL20"
                  >只能上传jpg/jpeg/png/gif/JPG/JPEG/GIF文件，且不超过2M</span
                >
              </el-upload>
            </div>
            <ul class="image-list-wrapper" v-if="imageList.length">
              <li
                class="image-item"
                v-for="(item, index) in imageList"
                :key="index"
              >
                <img
                  :src="item.url | replaceIP"
                  alt=""
                  @click="handleImageClick(item.url)"
                />
                <i class="el-icon-delete" @click="deleteImg(item)"></i>
              </li>
            </ul>
            <div class="padding60 text-center gray" v-else>暂无数据</div>
          </div>
          <el-pagination
            small
            hide-on-single-page
            layout="prev, pager, next"
            :total="imgListLen"
            @prev-click="changePage"
            @next-click="changePage"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="素材库" name="two">
        <div class="music-search">
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
        <!-- <div class="uploadImg-box">
          <el-button
            class="btn"
            size="small"
            type="primary"
            :loading="imgLoading"
            @click="handleOpenFile()"
            >点击上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
          <input
            class="inputs"
            ref="fileEls"
            accept="image/*"
            type="file"
            multiple="multiple"
            @change="onchange('fileEls')"
          />
        </div> -->
        <!--<ul class="image-list-wrapper" v-if="List.length">
              <li
                class="image-item"
                v-for="(item, index) in List"
                :key="index"
              >
                <img
                  :src="item.url | replaceIP"
                  alt=""
                  @click="handleImageClick(item.url)"
                />
              </li>
            </ul>
            <div class="padding60 text-center gray" v-else>暂无数据</div>
            <el-pagination
            small
            hide-on-single-page
            layout="prev, pager, next"
            :total="ListLen"
            @prev-click="listChangePage"
            @next-click="listChangePage"
            @current-change="listChangePage"
          >
          </el-pagination>
      </el-tab-pane> -->
    </el-tabs>
  </el-dialog>
</template>

<script>
import $bus from "@src/eventBus";

export default {
  name: "image-libs",
  data() {
    return {
      fenList:[],
      activeName: "",
      searchName:'',
      placeholder:"请输入图片分类名称",
      nodata:false,
      imgLoading:false,
      List:[],
      ListLen:0,

      dialogVisible: false,
      uploading: false,
      hasLoadData: false,
      imageList: [],
      selectId: "",
      imgAction: `/H5QuickBuild${this.$interParams.h5Inters.upload}`,
      imgLoading: false,
      imgText: "点击上传",
      imgListLen: 0,
    };
  },
  created() {
    $bus.$on("show-select-image", (selectId) => {
      this.dialogVisible = true;
      this.selectId = selectId;
    });
  },
  watch: {
    dialogVisible(val) {
      if (val && !this.uploading) {
        // this.getMyImages(1);
        // 查询分类
        this.getFenList(1)
      }
    },
  },
  methods: {
    // 查询分类
    getFenList(){
      let params = { type: "3", name: '' };
      this.$axios.get(this.$interParams.h5Inters.getCategoryList, params).then(
        (data) => {
          if (data.code == 200) {
            this.fenList = data.data.cateList;
            if (this.fenList) {
              this.activeName = data.data.cateList[0].name;  
              this.categoryId = data.data.cateList[0].id
              this.getMyImages(1)  
            }
          }
        },
        (err) => {
          this.$message.error(err.message);
        }
      );
    },
    // tabs选择
    handleClick(tab) {
      this.activeName = tab.name;
      // 获取分类下的图片
      this.categoryId = this.fenList[tab.index].id
      this.getMyImages(1)
    },
    beforeUpload(file) {
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error("文件不能超过2M！");
        return false;
      }
      let temp1 = file.name.split(".");
      let temp = temp1[temp1.length - 1];
      if (
        !["jpg", "jpeg", "png", "gif", "JPG", "JPEG", "PNG", "GIF"].includes(
          temp
        )
      ) {
        this.$message.error("请上传jpg/jpeg/png/gif文件");
        return false;
      }
      this.uploadPsd(file);
      return false;
    },
    uploadPsd(file) {
      this.imgLoading = true;
      this.imgText = "正在上传";
      let params = new FormData();
      params.append("uploadFile", file);
      params.append("type", "3");
      params.append("categoryId", this.categoryId);
      this.$axios.post(this.$interParams.h5Inters.upload, params).then(
        (data) => {
          this.$message.success("上传成功!");
          this.imgLoading = false;
          this.imgText = "点击上传";
          this.getMyImages(1);
        },
        (err) => {
          this.imgLoading = false;
          this.imgText = "点击上传";
        }
      );
    },
    getMyImages(pageNo) {
      this.hasLoadData = true;
      const params = {
        type: "3",
        name: "",
        categoryId: this.categoryId,
        categoryName: this.activeName,
        pageNo: pageNo,
        pageSize: 10,
      };
      this.$axios
        .get(this.$interParams.h5Inters.getMultimediaList, params)
        .then((data) => {
          if (data.data.list.length) {
            this.imageList = [];
            const list = data.data.list;
            this.imgListLen = data.data.totalCount;
            list.forEach((e) => {
              this.imageList.push(e);
            });
          }
        });
    },
    changePage(val) {
      this.getMyImages(val);
    },
    deleteImg(item) {
      this.$confirm("确认删除图片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.$interParams.h5Inters.deleteMultimedByid + item.id)
            .then((data) => {
              this.getMyImages(1);
            });
        })
        .catch(() => {});
    },
    /**
     * 点击图片
     * @param url
     */
    handleImageClick(url) {
      $bus.$emit("select-image", this.selectId, url);
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.image-list-wrapper {
  display: flex;
  flex-wrap: wrap;
  height: 250px;
  padding-top: 20px;
  li {
    width: 100px;
    height: 100px;
    margin: 5px;
    // background: #eee 50% / contain no-repeat;
    border: 1px dashed #eee;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    display: flex;
    transition: all 0.28s;
    position: relative;
    &:hover {
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
      transform: translate3d(0, -2px, 0);
    }
    img {
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
    }
    i {
      position: absolute;
      top: 0;
      right: 0;
      padding: 3px;
      background: #e6e6e6;
    }
  }
}
</style>
<style lang="scss">
$box-shadow: 0px 1px 6px 2px #dadcdf;
.components-image-libs-wrapper {
  .el-dialog__body {
    padding: 0 20px 20px;
  }
  .el-pagination {
    text-align: right;
  }
}
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
.uploadImg-box {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: none;
  margin-top:10px;
}
.uploadImg-box .inputs {
  display: none;
}
</style>
