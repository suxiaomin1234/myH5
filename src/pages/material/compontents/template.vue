<template>
  <div class="template">
    <div class='mode'>
      <el-row v-if="templateList.length" :gutter="30">
        <el-col :span="6" v-for="(item,index) in templateList" :key='index'>
          <el-card :body-style="{ padding: '0px' }" class="mode-card">
            <div class="mode-type">
              <span v-if="item.sceneType == '2'">长图文</span>
            </div>
            <div class='image'>
              <img :src="item.coverPic | replaceIP" class="">
            </div>
            <div class="title">{{item.title}}</div>
            <div style="padding: 14px; height: 55px;text-align: right;">
              <el-button type="text" @click="delTemplate(item)">删除</el-button>
              <el-dropdown placement="top-start">
                        <span class="">
                          <el-button type="text">设置</el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <div @click='setTemp(item)'>模板标签设置</div>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <div @click='setLab(item)'>分类标签设置</div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <notFundData v-else />
    </div>

  </div>
</template>
<script>
import notFundData from '@src/components/notFundData'
export default {
  components: {
    notFundData,
  },
  data() {
    return {
      templateList: [],
      templatePageNo: 1,
      templatePageSize: 10,
    }
  },
  props: {
    searchName: String,
    templateType: String,
  },
  created() {
    this.getTemplateLibs(1)
  },
  mounted() {
    this.$emit('update:pageSize', this.templatePageSize)
  },
  methods: {
    delTemplate(item) {
      this.$confirm('确认删除模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios
          .delete(this.$interParams.h5Inters.deleteTemplate + item.id)
          .then((data) => {
            this.getTemplateLibs(1)
          })
      })
    },
    getTemplateLibs(pageNo) {
      const searchParams = {
        title: this.searchName,
        sceneType: this.templateType, // 场景类型 1-h5。2-长图文
        categoryId: '', // H5分类编号
        pageNo: pageNo, // 页码
        pageSize: this.templatePageSize, // 页数
      }
      this.$axios
        .get(this.$interParams.h5Inters.getTemplateListPage, searchParams)
        .then(
          (res) => {
            if (res.code == '200') {
              // this.modeLoding = false
              this.$emit('lengthChange', res.data.totalCount)
              this.templateList = res.data.list || []
            }
          },
          (err) => {}
        )
    },
    // 分类标签设置
    setLab(item){
      this.$emit('setLab',item)
    },
    // 模板标签设置
    setTemp(item){
      this.$emit('setTemp',item)
    }
  },
}
</script>
<style lang="scss">
$box-shadow: 0px 1px 6px 2px #dadcdf;
.template {
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
      background: url('../../../common/images/main/pic_04.png') no-repeat center;
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
    border-radius: 10px;
    margin-bottom: 10px;
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
  }
  .title {
    position: absolute;
    bottom: 55px;
    background: rgba(0, 0, 0, 0.15);
    left: 0;
    right: 0;
    padding: 10px 10px;
    color: #fff;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bottom {
    line-height: 12px;
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
</style>