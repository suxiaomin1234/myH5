<template>
  <div>
    <el-dialog title="H5信息" :visible.sync="DialogVisible" width="30%" center>
      <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="H5名称" prop="pass">
          <el-input type="input" size='small' v-model="ruleForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="checkPass">
          <el-upload class="avatar-uploader" action="xxxx" :show-file-list="false" :before-upload="beforeAvatarUpload">

            <img v-if="coverPic" :src="coverPic | replaceIP" class="avatar">
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
export default {
  data() {
    return {
      DialogVisible: false,
      ruleForm: {
        title: '',
        coverPic: '',
      },
      coverPic: '',
    }
  },
  methods: {
    // 上传
    beforeAvatarUpload(file) {
      let eqImgFile = new FormData()
      eqImgFile.append('type', '3')
      eqImgFile.append('uploadFile', file)
      this.$axios.post(this.$interParams.h5Inters.upload, eqImgFile).then(
        (res) => {
          if (res.code == '200') {
            this.ruleForm.coverPic = res.data.url
            this.coverPic = res.data.url
          }
        },
        (err) => {}
      )
    },
    // h5信息编辑
    setItem() {
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
              this.$emit('refresh')
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
  },
}
</script>
<style lang="scss" scoped>
.avatar-uploader /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader /deep/.el-upload:hover {
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
</style>
