<template>
  <div class="material-picture">
    <div class="filex">
      <div v-if="ofen" class="uploadImg-box" style="margin-bottom:10px;">
        <el-button
          class="btn"
          size="small"
          type="primary"
          @click="goback"
          >返回 <i class="el-icon-back"></i
        ></el-button>
        <el-button
          class="btn"
          size="small"
          type="primary"
          :loading="imgLoading"
          @click="childMethod"
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
      </div>
      <div
        v-if="ofen"
        class="uploadImg-box"
        style="margin-bottom:10px;margin-left:10px;"
      >
        <el-button
          v-if="isCheck == false"
          class="btn"
          size="small"
          type="primary"
          @click="deltCheck"
          >批量删除 <i class="el-icon-upload el-icon-delete"></i
        ></el-button>
        <div v-else>
          <el-button
            size="small"
            type="primary"
            :loading="imgLoading"
            @click="noCheck"
            >取消</el-button
          >
          <el-button v-if="checkDate"
            size="small"
            type="primary"
            :loading="imgLoadings"
            @click="delts"
            >确定</el-button
          >
        </div>
      </div>
      <div v-if="nodata==true">
      <el-button
        v-if="ofen == false"
        size="small"
        type="primary"
        :loading="imgLoadings"
        @click="handleOpenFile"
        >添加分类<i class="el-icon-upload el-icon--right"></i
      ></el-button>
      </div>
    </div>
    <div v-if="nodata">
      <el-row :gutter="10" v-if="ofen == false">
        <el-col :span="4" v-for="(item, index) in optionsFen" :key="index">
          <el-card :body-style="{ padding: '0px' }" class="mode-card">
            <div
              class="image"
              style="text-align: center;"
              @click="addshowImg(item)"
            >
              <div style="width:100%">
                <i class="el-icon-circle-plus-outline"></i>添加图片
              </div>
              <!-- <img :src="item.url | replaceIP" /> -->
            </div>
            <div style="padding: 14px; height: 55px;text-align: right;">
              <el-button type="text">{{ item.name }}</el-button>
              <el-button type="text" @click="deltsFen(item)">删除</el-button>
              <el-button type="text" @click="fenChens(item)">设置</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="ofen == true">
        <el-col :span="24">
          <span class="nameFenImg">{{ imgFenName }}</span>
        </el-col>
        <el-col :span="4" v-for="(item, index) in List" :key="index">
          <el-card :body-style="{ padding: '0px' }" class="mode-card">
            <div class="checkImg" @click="checkImg(index)" v-if="isCheck">
              <i
                class="el-icon-check"
                :class="[item.isActive == true ? 'checkOrg' : 'checkblue']"
              ></i>
            </div>
            <div class="image">
              <img :src="item.url | replaceIP" />
            </div>
            <div style="padding: 14px; height: 55px;text-align: right;">
              <el-button type="text" @click="delTemplate(item)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else class="imgTen">
      <el-button
        class="btn"
        size="small"
        type="primary"
        :loading="imgLoading"
        @click="handleOpenFile(0)"
        >创建分类<i class="el-icon-upload el-icon--right"></i
      ></el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nodata: false,
      imgLoading: false,
      imgAction: `/H5QuickBuild${this.$interParams.h5Inters.upload}`,
      fileList: [],
      List: [],
      optionsFen: [], // 分类列表
      isCheck: false,
      checkDate: false,
      categoryId: "", // 分类id
      multiId: "", // 图片id
      imgFenName: "", // 图片名称
      pageNo: 1,
      imgListLen: 0,
      imgLoadings: false,
      ofen: false,
      imgLoadingFen: false,
      pageSize:10
    };
  },
  props: {
    searchName: String,
  },
  mounted() {
    this.getFenList(1);
    this.$emit("soushow", true);
  },
  methods: {
    // 单个删除图片
    delTemplate(item) {
      this.$confirm("确认删除图片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.$interParams.h5Inters.deleteMultimedByid + item.id)
            .then((data) => {
              this.getList(1);
            });
        })
        .catch(() => {});
    },
    // 删除按钮展示
    deltCheck() {
      this.isCheck = true;
    },
    // 删除按钮展示
    noCheck() {
      // 找出所有选择的
      for (let i in this.List) {
        this.List[i].isActive = false
      }
      this.isCheck = false;
      this.checkDate = false;
    },
    checkImg(index) {
      this.List[index].isActive = !this.List[index].isActive;
      this.$set(this.List, index, this.List[index]);
      // 按钮展示
      this.checkDate = true;
    },
    // 查询是否有分类
    getFenList(pageNo, name) {
      let params = { type: "3", name: name };
      this.$axios.get(this.$interParams.h5Inters.getCategoryList, params).then(
        (data) => {
          if (data.code == 200) {
            this.optionsFen = data.data.cateList;
            if (this.optionsFen) {
              this.nodata = true;
              // this.$emit("update:page-size", pageNo);
              this.$emit("lengthChange", this.optionsFen.length);
            } else {
              this.nodata = false;
            }
          }
        },
        (err) => {
          this.$message.error(err.message);
        }
      );
    },
    // 添加修改分类
    handleOpenFile(num) {
      // 选择前先选择图片分类
      this.$emit("imgfensts", num);
    },
    // 删除分类
    deltsFen(item) {
      this.$confirm("确认删除分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.$interParams.h5Inters.deleteCategory, {
              id: item.id,
              status:'0'
            })
            .then((data) => {
              this.getFenList(1);
            });
        })
        .catch(() => {});
    },
    // 修改分类
    fenChens(item) {
      // 通知父弹窗
      this.$emit("imgfen", item);
    },
    // 点击展示添加图片dom
    addshowImg(item) {
      this.ofen = true;
      // 通知父组件搜索框隐藏
      this.$emit("soushow", false);
      this.categoryId = item.id;
      this.imgFenName = item.name;
      // 调用分类下图片查询
      this.getList(1);
    },
    // 返回分类
    goback() {
      // 通知父组件搜索框显示
      this.$emit("soushow", true);
      this.ofen = false;
      this.categoryId = "";
      this.imgFenName = "";
      this.getFenList(1);
    },
    // 点击上传图片
    childMethod() {
      this.$refs.fileEls.dispatchEvent(new MouseEvent("click"));
    },
    onchange(names) {
      // 获取文件数量
      let abArr = this.$refs[names].files;
      let arr = [];
      for (let x of abArr) {
        var params = {
          name: x.name,
          size: x.size,
          file: x,
        };
        arr.push(params);
      }
      this.fileList = arr;
      if (this.onExceed(this.fileList) == false) return;
      if (this.onSize(this.fileList) == false) return;
      if (this.onImgs(this.fileList) == false) return;
      this.uploadPsd(this.fileList);
    },
    // 限制文件个数
    onExceed(file) {
      if (file.length > 6) {
        this.$message.error("最大选择不超过6个！");
        this.fileList = [];
        return false;
      }
      return true;
    },
    onSize(file) {
      for (let i in file) {
        if (file[i].size > 2 * 1024 * 1024) {
          this.$message.error("单个文件不能超过2M！");
          this.fileList = [];
          return false;
        }
      }
      return true;
    },
    onImgs(file) {
      for (let i in file) {
        let temp1 = file[i].name.split(".");
        let temp = temp1[temp1.length - 1];
        if (
          !["jpg", "jpeg", "png", "gif", "JPG", "JPEG", "PNG", "GIF"].includes(
            temp
          )
        ) {
          this.$message.error("请上传jpg/jpeg/png/gif文件");
          this.fileList = [];
          return false;
        }
      }
      return true;
    },
    uploadPsd(file) {
      let len = file.length;
      let i = 0;
      i < len;
      let that = this;
      let categoryId = this.categoryId;
      let uploads = function() {
        that.imgLoading = true;
        that.imgText = "正在上传";
        let params = new FormData();
        params.append("uploadFile", file[i].file);
        params.append("type", "3");
        params.append("categoryId", categoryId);
        that.$axios.post(that.$interParams.h5Inters.upload, params).then(
          (data) => {
            //如果还有照片，继续上传
            i++;
            if (i < len) {
              uploads();
            } else {
              that.$message.success("上传成功!");
              that.imgLoading = false;
              params = "";
              that.getList(1);
            }
          },
          (err) => {
            that.imgLoading = false;
            that.$message.error(err.message);
          }
        );
      };
      uploads();
    },
    getList(pageNo) {
      this.isCheck = false;
      this.checkDate = false;
      const params = {
        type: "3",
        categoryName: this.imgFenName,
        categoryId: this.categoryId,
        pageNo: pageNo,
        pageSize: this.pageSize,
      };
      this.$axios
        .get(this.$interParams.h5Inters.getMultimediaList, params)
        .then((data) => {
          console.log(data)
          if (data.code == 200) {
            this.List = data.data.list;
            if (data.data.list.length) {
              // this.$emit("update:page-size", this.pageSize);
              this.$emit("lengthChange", data.data.totalCount);
              this.List.forEach((e) => {
                e.isActive = false;
              });
            }
          } else {
            // this.$emit("update:page-size", this.pageSize);
            this.$emit("lengthChange", data.data.totalCount);
          }
        });
    },
    // 确定批量删除
    delts() {
      // 找出所有选择的
      let arr = [];
      for (let i in this.List) {
        if (this.List[i].isActive == true) {
          arr.push(this.List[i].id);
        }
      }

      let params = {
        ids: arr.toString(),
      };
      this.$axios
        .post(this.$interParams.h5Inters.deleteSceneInfByIds, params)
        .then((data) => {
          if (data.code == 200) {
            this.$message.success(data.message);
            this.getList(1);
            this.isCheck = false;
            this.checkDate = false;
          } else {
            this.$message.error(data.message);
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.filex {
  position: fixed;
  right: 10%;
  top: 270px;
  z-index: 2000;
}
.el-scrollbar__view {
  width: 100%;
  height: 100%;
}
.material-picture {
  width: 100%;
  height: 100%;
  position: relative;
}
.imgTen {
  text-align: center;
  margin-top: 50px;
}
.uploadImg-box {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: none;
}
.uploadImg-box .inputs {
  display: none;
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
    height: 200px;
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
.image {
  width: 100%;
  height: 200px;
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
  content: "";
}

.clearfix:after {
  clear: both;
}
.checkImg {
  width: 20px;
  height: 20px;
  background: rgb(238, 238, 238);
  float: right;
  overflow: hidden;
  position: relative;
}
.checkOrg {
  color: #fc9004;
  font-size: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.checkblue {
  color: #f5f5f5;
  font-size: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.nameFenImg {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  width: 100%;
  margin: 26px 0;
}
</style>
