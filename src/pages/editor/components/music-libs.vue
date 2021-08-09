<template>
  <div class="components-image-libs">
    <p class="page-title text-center">音乐库管理</p>
    <div class="audio-bgc">
      <audio ref="audioPlayers" id="play-audio" :src="musicSrc | replaceIP" style="opacity: 1;" controls autoplay preload></audio>
    </div>
    <div class="audio-list">
      <div v-if="musicList.length || musicListDefault.length " class="audio-list-box">
        <div class="audio-item" v-for="(item, i) in (musicList.length ? musicList : musicListDefault)" :key="i">
          <span class="el-animate-title-name">{{ item.name }}</span>
          <span class="el-animate-title-btn" @click="play(item)">
            <i class="el-icon-caret-right"></i>
          </span>
          <span class="el-animate-title-btn" @click="use(item)">
            <i class="el-icon-finished"></i>
          </span>
          <span v-show="musicList.length" class="el-animate-title-btn" @click="deleteMusic(item)">
            <i class="el-icon-delete"></i>
          </span>
        </div>
      </div>
      <notFundData v-else />
    </div>
    <el-pagination small hide-on-single-page layout="prev, pager, next" :total="musicListLen" @prev-click="changePage" @next-click="changePage" @current-change="changePage">
    </el-pagination>
    <div class="audio-add">
      <el-upload class="audio-add-ipt" :action="musicAction" :before-upload="beforeUploadMusic" accept="mp3,wav" :show-file-list="false">
        <el-button size="small" type="primary" :loading="musicLoading">{{ musicText }}</el-button>
        <span slot="tip" class="el-upload__tip marginL20">只能上传mp3/wav文件</span>
      </el-upload>
      <span class="audio-add-text">
        您在上传音乐时，要对您上传的音乐版权负责，请谨慎使用上传功能！
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import notFundData from '@src/components/notFundData'
import $bus from '@src/eventBus'
export default {
  name: 'music-libs',
  components: {
    notFundData,
  },
  data() {
    return {
      musicAction: `/H5QuickBuild${this.$interParams.h5Inters.upload}`,
      musicLoading: false,
      musicText: '上传音乐',
      musicSrc: '',
      musicListLen: 0,
      musicList: [],
      musicListDefault: [],
      // musicListDefault: [
      //   {
      //     name: '倉木麻衣 - Tonight, I Feel Close To You',
      //     type: 'mp3',
      //     url:
      //       '@src/plugins/bg-music/src/倉木麻衣 - Tonight, I Feel Close To You.mp3',
      //   },
      //   {
      //     name: 'music',
      //     type: 'mp3',
      //     url: '@src/plugins/bg-music/src/music.mp3',
      //   },
      //   {
      //     name: 'ZARD - 心を開いて',
      //     type: 'mp3',
      //     url: '@src/plugins/bg-music/src/ZARD - 心を開いて.mp3',
      //   },
      // ],
      audioEl: undefined,
      playing: true,
    }
  },
  computed: {
    ...mapGetters(['getMusicFlag']),
  },
  created() {
    this.getMusicLibs(1)
  },
  watch: {
    getMusicFlag(val) {
      if (val.plug) {
        const audio = this.$refs.audioPlayers
        audio.pause()
      }
    },
  },
  methods: {
    getMusicLibs(pageNo) {
      const params = {
        type: '1',
        name: '',
        categoryId: '',
        pageNo: pageNo,
        pageSize: 10,
      }
      this.$axios
        .get(this.$interParams.h5Inters.getMultimediaList, params)
        .then((data) => {
          this.musicList = []
          if (data.data.list.length) {
            const list = data.data.list
            this.musicListLen = data.data.totalCount
            list.forEach((e) => {
              this.musicList.push(e)
            })
          }
        })
    },
    changePage(val) {
      this.getMusicLibs(val)
    },
    beforeUploadMusic(file) {
      let temp1 = file.name.split('.')
      let temp = temp1[temp1.length - 1]
      if (!['mp3', 'wav'].includes(temp)) {
        this.$message.error('请上传mp3/wav文件')
        return false
      }
      this.uploadMusic(file)
      return false
    },
    uploadMusic(file) {
      this.musicLoading = true
      this.musicText = '正在上传'
      let params = new FormData()
      params.append('uploadFile', file)
      params.append('type', '1')
      params.append('categoryId', '')
      this.$axios.post(this.$interParams.h5Inters.upload, params).then(
        (data) => {
          this.$message.success('上传成功!')
          this.musicLoading = false
          this.musicText = '上传音乐'
          this.getMusicLibs(1)
        },
        (err) => {
          this.musicLoading = false
          this.musicText = '上传音乐'
        }
      )
    },
    play(item) {
      this.audioEl = document.getElementById('play-audio');
      //重置音乐地址,防止重复播放
      if(this.musicSrc) this.musicSrc = "";
      if (!item.url.includes('bg-music')) {
        this.musicSrc = item.url
      } else {
        this.musicSrc = require('../../../plugins/bg-music/src/' +
          item.name +
          '.mp3')
      }
      this.audioEl.load()
      this.$store.commit('setMusicPlayed', {
        plug: false,
        libs: true,
      })
    },
    use(item) {
      //重置音乐地址,防止重复播放
      if(this.musicSrc) this.musicSrc = "";
      this.$store.commit('setMusicObj', item)
      setTimeout(() => {
        $bus.$emit('playMusic')
      }, 1000)
    },
    deleteMusic(item) {
      this.$confirm('确认删除音乐?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$axios
            .delete(this.$interParams.h5Inters.deleteMultimedByid + item.id)
            .then((data) => {
              this.getMusicLibs(1)
            })
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.audio-bgc {
  width: 260px;
  margin: 10px auto;
}
.audio-bgc audio {
  width: 100%;
}
.audio-item {
  display: flex;
  padding: 5px 3px;
  border-bottom: 1px solid #e4e7ed;
}
.el-animate-title-name {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70%;
}
.el-animate-title-type-wrapper {
  display: inline-block;
  width: 164px;
}
.el-animate-title-type {
  display: inline-block;
  vertical-align: middle;
  max-width: 140px;
  height: 24px;
  line-height: 1px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #fafafa;
  border-radius: 60px;
  padding: 4px 16px;
  border: none;
  cursor: pointer;
  margin: 0 20px 0 10px;
  &:hover {
    color: white;
    background: $primary;
  }
}
.el-animate-title-btn {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  color: #666;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  background: rgba(37, 165, 137, 0.08);
  margin-left: 6px;
  &:hover {
    color: white;
    background: $primary;
  }
}
.audio-add {
  padding: 10px;
  margin: 10px auto;
  .audio-add-ipt {
    display: flex;
    align-items: center;
  }
  .audio-add-text {
    margin-top: 20px;
    display: inline-block;
    font-size: 13px;
    color: #8f8f8f;
    &:hover {
      color: $primary;
    }
  }
}
</style>
