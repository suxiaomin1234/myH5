<template>
  <div>
    <p class="page-title text-center">模板库</p>
    <div class="temple-box" v-loading="templeLoading">
      <div v-if="tempList.length > 0" class="temple-list-box">
        <el-scrollbar>
          <ul class="temple-list-wrapper">
            <li class="temple-item" v-for="(item, index) in tempList" :key="index" @click="changeTemple(item)">
              <img :src="item.coverPic | replaceIP" alt="">
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <notFundData v-else />
      <el-pagination :page-size="pageSize" small hide-on-single-page layout="prev, pager, next" :total="templeLen" @prev-click="changePage" @next-click="changePage"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import notFundData from '@src/components/notFundData'
export default {
  name: 'template-libs',
  components: {
    notFundData,
  },
  data() {
    return {
      tempList: [],
      templeLen: 0,
      pageSize: 5,
      templeLoading: false,
    }
  },
  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
    }),
    ...mapGetters(['pageMode']),
  },
  created() {
    this.getTemplateListPage(1)
  },
  methods: {
    getTemplateListPage(pageNo) {
      this.templeLoading = true
      let sceneType = '1'
      if (this.pageMode == 'h5') {
        sceneType = '1'
      } else if (this.pageMode == 'longPage') {
        sceneType = '2'
      }
      const params = {
        sceneType: sceneType,
        categoryId: '',
        title: '',
        pageNo: pageNo,
        pageSize: this.pageSize,
      }
      this.$axios
        .get(this.$interParams.h5Inters.getTemplateListPage, params)
        .then(
          (data) => {
            const list = data.data.list
            this.templeLen = data.data.totalCount
            if (list.length) {
              this.tempList = []
              list.forEach((e) => {
                this.tempList.push(e)
              })
            }
            this.templeLoading = false
          },
          (err) => {
            this.templeLoading = false
          }
        )
    },
    changeTemple(item) {
      this.$confirm('页面模版会覆盖编辑区域已有组件，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$axios
            .get(this.$interParams.h5Inters.getTemplateByIdDetails + item.id)
            .then((data) => {
              if (data.data.data) {
                const newPageData = JSON.parse(data.data.data)
                newPageData.title =this.projectData.title
                newPageData.description =this.projectData.description
                this.$store.dispatch('setPrjectData', newPageData)
              } else {
                this.$message.error('获取模板详情失败，请重试！')
              }
            })
          // this.$store.dispatch('setPrjectData', newPageData)
        })
        .catch(() => {})
    },
    changePage(val) {
      this.getTemplateListPage(val)
    },
  },
}
</script>

<style lang="scss">
.temple-box {
  position: relative;
  min-height: 640px;
  .temple-list-box {
  }
  .el-scrollbar {
    height: 650px;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .temple-list-wrapper {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 120px;
      height: 200px;
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
  .el-pagination {
    position: absolute;
    bottom: 0px;
    right: 0;
  }
}
</style>
