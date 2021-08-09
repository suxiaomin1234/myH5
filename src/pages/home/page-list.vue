<template>
  <div class="clearfix my-page-list">
    <div class="page-search-wrapper">
      <el-tabs v-model="searchParams.pageMode" @tab-click="handlePageModeClick">
        <el-tab-pane
          :name="item.value"
          :disabled="item.disabled"
          v-for="(item, index) in pageModeList"
          :key="index"
        >
          <div slot="label">
            <span class="nav-tabs-label">{{ item.label }}</span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-content">
      <!-- <div class="my-page-nav-list">
        <div class="my-page-nav-item" @click="doSearch('my')" :class="{active: searchParams.type === 'my'}">我的作品({{myCount}})</div>
        <div class="my-page-nav-item" @click="doSearch('share')" :class="{active: searchParams.type === 'share'}">
          参与作品({{shareCount}})
        </div>
      </div> -->

      <ul class="page-item-wrapper">
        <li class="page-item create" @click="createNewPage">
          <div class="temp-create">
            <i class="el-icon-plus"></i>
            <p class="paddingT10">
              创建{{ searchParams.pageMode | getLabelText(pageModeList) }}
            </p>
          </div>
        </li>
        <li class="page-item" v-for="(item, index) in pageList" :key="index">
          <span class="unpublish" v-if="item.status != '2'">{{
            item.status | stCgFil
          }}</span>
          <div class="header-mask">
            <div class="details-btn" @click="showPreviewFn(item)">预览</div>
          </div>
          <div class="cover">
            <img
              :src="(item.coverPic || defaultCoverImage) | replaceIP"
              alt=""
            />
          </div>
          <div class="page-item-title border-T">
            <span class="item-title-i">{{ item.title }}</span>
          </div>
          <div class="page-item-data-pv border-T">
            <div class="btn-wrapper">
              <el-button type="text" size="mini" @click="editPage(item.id)"
                >编辑</el-button
              >
            </div>
            <div class="btn-wrapper">
              <el-button type="text" size="mini" @click="setPage(item.id)"
                >设置</el-button
              >
            </div>
            <div class="btn-wrapper">
              <el-button type="text" size="mini" @click="copyPage(item.id)"
                >复制</el-button
              >
            </div>
            <div class="btn-wrapper">
              <el-dropdown placement="top-start">
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini"
                    >更多 <i class="el-icon-more-outline"></i
                  ></el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="searchParams.type === 'my'">
                    <div
                      v-if="item.status == '1' || item.status == '3'"
                      @click="publishPage(item.id, index)"
                    >
                      发布
                    </div>
                    <div
                      v-else-if="item.status == '2'"
                      @click="downPage(item.id, index)"
                    >
                      下线
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="setAsTemplate(item)">复制为模板</div>
                  </el-dropdown-item>
                  <el-dropdown-item disabled>
                    <div @click="showPageData(item.id)">页面数据</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="searchParams.type === 'my'" disabled>
                    <div @click="showAddUser(item.id)">添加成员</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="searchParams.type === 'my'">
                    <div @click="deletePage(item.id, index)">删除</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="searchParams.type === 'share'">
                    <div @click="deleteShareUserPage(item.id, index)">
                      移出我的参与
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
      </ul>
      <div class="page-paginate">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="searchParams.pageNo"
          :page-size="searchParams.pageSize"
          :total="searchParams.totalCount"
          @current-change="getPageList"
        ></el-pagination>
      </div>
    </div>

    <div class="custom-dialog">
      <el-dialog title="添加成员" :visible.sync="dialogVisible" width="500px">
        <el-form class="" label-width="120px">
          <el-form-item label="用户名/姓名:">
            <el-select
              class="full-input-w"
              v-model="addUserForm.userIds"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入用户名/姓名搜索"
              :remote-method="remoteMethod"
              :loading="addUserloading"
            >
              <el-option
                v-for="item in userDataList"
                :key="item._id"
                :label="item.username"
                :value="item._id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="submitAddUser" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>

    <!--预览-->
    <previewPage
      v-if="showPreview"
      :pageId="previewId"
      :previewSt="previewSt"
      :isTemplate="isTemplate"
      :goUrl="goUrl"
      @closePreview="showPreview = false"
    ></previewPage>
    <!-- 设置 -->
    <set-page ref="setPage" @refresh="getPageList" />
  </div>
</template>

<script>
import previewPage from "./components/preview";
import setPage from "./components/setPage";

export default {
  components: {
    previewPage,
    setPage,
  },
  data() {
    return {
      loading: false,
      defaultCoverImage: require("@src/common/images/quark--pagecover-image.jpg"),
      pageList: [],
      myCount: 0,
      shareCount: 0,
      previewId: "",
      previewSt: "",
      isTemplate: '0',
      goUrl:'',
      showPreview: false,
      dialogVisible: false,
      addUserloading: false,
      userDataList: [],
      pageModeList: [
        {
          value: "h5",
          label: "H5",
          disabled: false,
        },
        {
          value: "longPage",
          label: "长页H5",
          disabled: false,
        },
        {
          name: "relativePage",
          label: "排版图文",
          disabled: true,
        },
        {
          value: "pc",
          label: "PC页面",
          disabled: true,
        },
      ],
      addUserForm: {
        id: "",
        userIds: [],
      },
      searchParams: {
        type: "my",
        pageMode: "h5",
        pageNo: 1,
        pageSize: 10,
        totalCount: 0,
      },
    };
  },
  filters: {
    // 状态码转化 1:未发布;2:已发布;3:下线；0:删除
    stCgFil(val) {
      if (val == "1") {
        return "未发布";
      } else if (val == "2") {
        return "已发布";
      } else if (val == "3") {
        return "下线";
      } else if (val == "0") {
        return "删除";
      }
    },
  },
  created() {
    this.getPageList();
    this.getPagesCount();
    this.previewId = this.$route.query.previewId || "";
    if (this.previewId) {
      this.showPreview = true;
    }
  },
  methods: {
    /**
     * 搜索我的页面，type: my时搜索我的作品， type: share搜索我参与的作品
     */
    doSearch(type) {
      this.searchParams.type = type;
      this.getPageList();
    },
    getPagesCount() {
      // this.$axios.get('/page/myPages/count', this.searchParams).then(res => {
      //   this.myCount =  res.body.my
      //   this.shareCount =  res.body.share
      // })
    },
    /**
     * 获取所有页面
     */
    getPageList() {
      const searchParams = {
        type:
          this.searchParams.pageMode == "h5"
            ? "1"
            : this.searchParams.pageMode == "longPage"
            ? "2"
            : "", // H5类型1:h5模板;2:长图文;
        status: "", // 发布状态 1:未发布;2:已发布;3:下线；0:删除
        editStatus: "", // 编辑状态。1:无修改;2:有修改;
        pageNo: this.searchParams.pageNo, // 页码
        pageSize: this.searchParams.pageSize, // 页数
      };
      this.$axios
        .get(this.$interParams.h5Inters.getSceneSelfList, searchParams)
        .then((res) => {
          if (res.code == "200") {
            this.pageList = res.data.list || [];
            this.searchParams.totalCount = res.data.totalCount;
          }
        });
    },
    /**
     * 创建页面,初始化数据提交接口,然后把id拿到后跳转到编辑器页面
     */
    createNewPage() {
      this.loading = true;
      let pathName = "";
      if (this.searchParams.pageMode == "h5") {
        pathName = "editor";
      } else if (this.searchParams.pageMode == "longPage") {
        pathName = "editor/long";
      }
      this.$router.push({
        path: pathName,
        query: { type: this.searchParams.pageMode },
      });

      // this.$router.push({ path: 'editor', query: { id: '' } })
      // this.$axios
      //   .post('/page/add', {
      //     ...newPageData,
      //     pageMode: this.searchParams.pageMode,
      //     author: this.$store.state.user.userId,
      //   })
      //   .then((res) => {
      //     this.loading = false
      //     if (res.body) {
      //       this.$router.push({ path: 'editor', query: { id: res.body._id } })
      //     }
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    /**
     * 编辑页面
     * @param id
     */
    editPage(id) {
      let pathName = "";
      if (this.searchParams.pageMode == "h5") {
        pathName = "editor";
      } else if (this.searchParams.pageMode == "longPage") {
        pathName = "editor/long";
      }
      this.$router.push({
        path: pathName,
        query: { id: id, type: "untemplate" },
      });
    },
    /**
     * 设置页面
     */
    setPage() {
      this.$refs.setPage.DialogVisible = true;
    },
    /**
     * 复制页面
     */
    copyPage(id) {
      this.loading = true;
      // 获取数据，注入模板
      this.$axios
        .get(this.$interParams.h5Inters.sceneUpdateInfo + id)
        .then((res) => {
          if (res.code == "200") {
            let params = {
              title: res.data.title,
              coverPic: res.data.coverPic,
              editData: res.data.editData,
              formHeader: "",
              type: res.data.type,
              shareSet: res.data.shareSet,
            };
            this.addScene(params);
          }
          this.loading = false;
        });
    },
    /**
     * 新增模板
     */
    async addScene(params) {
      // 保存新的模板
      this.loading = false;
      this.$axios
        .post(this.$interParams.h5Inters.addScene, params)
        .then((res) => {
          if (res.code == "200") {
            this.$message.success("复制成功!");
            this.getPageList();
          }
          this.loading = false;
          // this.showPreview = false
        });
    },
    /**
     * 删除页
     * @param id
     * @param index
     */
    deletePage(id, index) {
      this.$confirm("此操作将永久删除该页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$axios
          .delete(this.$interParams.h5Inters.deleteSceneInf + id)
          .then((res) => {
            this.loading = false;
            // 从页面删除
            if (res.code == "200") {
              this.$alert("页面删除成功！", "操作提示", {
                confirmButtonText: "确定",
              });
              this.getPageList();
            } else {
              this.$alert(res.message, "操作提示", {
                confirmButtonText: "确定",
              });
            }
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    showPreviewFn(item) {
      this.sceneUpdateInfo(item.id)
      this.previewId = item.id;
      this.previewSt = item.status;
    },
     // 查询H5详情
    sceneUpdateInfo(id, val) {
      this.$axios.get(this.$interParams.h5Inters.sceneUpdateInfo + id).then(
        (res) => {
          if (res.code == '200') {
            this.form = Object.assign({}, res.data)
            if (val == '0') {
              this.addScene()
            } else if (val == '1') {
              this.addTemplate()
            } else {
              this.goUrl = res.data.url
              this.$store.dispatch(
                'setPrjectData',
                JSON.parse(res.data.editData)
              )
              this.isRelease = res.data.status
              this.loading = true
              this.showPreview = true;
              // this.$axios
              //   .get(this.$interParams.h5Inters.previewScene + id)
              //   .then((data) => {
              //     this.loading = false
              //     if (data.code == '200') {
              //       document
              //         .querySelector('body')
              //         .setAttribute('style', 'overflow:hidden;')
              //       this.wrapperShow = true
              //     } else {
              //       this.$message.error(data.message)
              //     }
              //   })
              //   .catch((err) => {
              //     this.loading = false
              //   })
            }
          }
        },
        (err) => {}
      )
    },
    /**
     * 显示添加成员弹窗
     */
    showAddUser(id) {
      this.addUserForm.id = id;
      this.dialogVisible = true;
    },
    /**
     * 搜索成员
     */
    remoteMethod(query) {
      if (query !== "") {
        this.addUserloading = true;
        this.$axios
          .get("/user/list/search", { keywords: query })
          .then((res) => {
            this.addUserloading = false;
            this.userDataList = res.body || [];
          })
          .catch(() => {
            this.addUserloading = false;
          });
      } else {
        this.options = [];
      }
    },
    /**
     * 提交添加的用户
     * */
    submitAddUser() {
      this.loading = true;
      this.$axios
        .post("/page/shareToUser/" + this.addUserForm.id, {
          userIds: this.addUserForm.userIds,
        })
        .then(() => {
          this.loading = false;
          this.dialogVisible = false;
          this.$message.success("已添加！");
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 从我的参与作品中移出
     * */
    deleteShareUserPage(id, index) {
      this.$confirm("确认从我的参与作品中删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loading = true;
        this.$axios
          .post("/page/deleteShareToUser/" + id)
          .then(() => {
            this.loading = false;
            // 从页面删除
            this.pageList.splice(index, 1);
            this.getPagesCount();
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    /**
     * 跳转到数据统计页面
     */
    showPageData(id) {
      this.$router.push({ name: "pageDataDetail", query: { id: id } });
    },
    /**
     * 设为模板
     * @param id
     */
    setAsTemplate(item) {
      this.loading = true;
      const params = {
        ...item,
        sceneType:
          this.searchParams.pageMode == "h5"
            ? "1"
            : this.searchParams.pageMode == "longPage"
            ? "2"
            : "", // 场景类型 1-h5。2-长图文
        isPublic: "1", // 模版属性 1-公有。2-私有
        firstIsShow: "1", // 未登陆页是否显示 1-显示 2-隐藏
        orderNum: "", // 排序
        categoryIds: [], // h5模板关联分类编号list
      };
      this.$axios
        .post(this.$interParams.h5Inters.addTemplate, params)
        .then(() => {
          this.loading = false;
          this.$alert("已添加到我的模板库", "操作提示", {
            confirmButtonText: "确定",
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 发布页面
     */
    publishPage(id, index) {
      this.loading = true;
      this.$axios
        .put(this.$interParams.h5Inters.publishScene + id)
        .then((res) => {
          this.loading = false;
          if (res.code == "200") {
            this.$alert("页面发布成功！", "操作提示", {
              confirmButtonText: "确定",
            });
            this.pageList[index].status = "2";
          } else {
            this.$alert(res.message, "操作提示", {
              confirmButtonText: "确定",
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 下线页面
     */
    downPage(id, index) {
      this.loading = true;
      this.$axios
        .put(this.$interParams.h5Inters.offlineScene + id)
        .then((res) => {
          this.loading = false;
          if (res.code == "200") {
            this.$alert("页面下线成功！", "操作提示", {
              confirmButtonText: "确定",
            });
            this.pageList[index].status = "3";
          } else {
            this.$alert(res.message, "操作提示", {
              confirmButtonText: "确定",
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 切换页面类型搜索添加
     * @param data
     */
    handlePageModeClick() {
      this.getPageList();
      this.getPagesCount();
    },
  },
};
</script>

<style lang="scss" scoped>
.my-page-list {
}

.my-page-nav-list {
  height: 40px;
  line-height: 40px;
  z-index: 2;
  margin-bottom: 20px;
  .my-page-nav-item {
    float: left;
    padding-right: 32px;
    text-align: center;
    cursor: pointer;
    &.active {
      color: $primary;
    }
    &:hover {
      color: $primary;
    }
  }
}

.page-item-wrapper:after {
  content: "";
  display: block;
  clear: both;
}

.page-item {
  width: 224px;
  height: 296px;
  border-radius: 4px;
  overflow: hidden;
  float: left;
  margin-bottom: 24px;
  background: white;
  position: relative;
  transition: all 0.28s;
  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
    transform: translate3d(0, -2px, 0);
    .header-mask {
      opacity: 1;
    }
  }
  .unpublish {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
    display: block;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    background-color: #76838f;
    color: #fff;
    border-top-left-radius: 4px;
    border-bottom-right-radius: 12px;
    z-index: 10;
  }
  .header-mask {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.8);
    width: 224px;
    height: 224px;
    border-radius: 4px 4px 0 0;
    padding-top: 92px;
    text-align: center;
    transition: top 0.28s ease, opacity 0.28s ease, height 0.28s ease;
    .details-btn {
      display: inline-block;
      width: 120px;
      height: 44px;
      font-size: 18px;
      line-height: 44px;
      border-radius: 22px;
      border: 1px solid #fff;
      color: #fff;
      cursor: pointer;
    }
  }
  .cover {
    width: 224px;
    height: 224px;
    background-size: cover;
    justify-content: center;
    align-items: center;
    display: flex;
    img {
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .page-item-title {
    .item-title-i {
      display: inline-block;
      width: 85%;
      font-size: 14px;
      height: 36px;
      line-height: 36px;
      color: #111;
      transition: transform 0.2s ease;
      background-color: #fff;
      padding: 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      float: left;
    }
  }
  .page-item-data-pv {
    width: 100%;
    display: flex;
    .btn-wrapper {
      flex: 1;
      text-align: center;
    }
  }
}
.page-paginate {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 10px 0;
}

.page-item:not(:nth-child(4n + 1)) {
  margin-left: calc((100% - 224px * 4) / 3);
}

.page-item.create {
  padding: 16px;
  text-align: center;
  .temp-create {
    display: inline-block;
    width: 192px;
    height: 100%;
    border: 1px solid #e6ebed;
    border-radius: 3px;
    margin-bottom: 18px;
    padding-top: 104px;
    transition: all 0.28s;
    cursor: pointer;
    &:hover {
      color: $primary;
      border-color: $primary;
    }
  }
  .null-create {
    display: inline-block;
    width: 192px;
    height: 42px;
    line-height: 42px;
    border: 1px solid #e6ebed;
    transition: all 0.28s;
    cursor: pointer;
    &:hover {
      color: $primary;
      border-color: $primary;
    }
  }
}

.full-input-w {
  width: 100%;
}

.nav-tabs-label {
  display: inline-block;
  padding: 0 16px;
  height: 60px;
  line-height: 60px;
}
.page-search-wrapper {
  padding: 0;
}
</style>
<style lang="scss">
.my-page-list {
  .page-search-wrapper {
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__nav-wrap {
      padding: 0 30px;
    }
  }
}
</style>
