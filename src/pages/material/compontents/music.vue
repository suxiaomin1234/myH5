<template>
  <div>
    <div class="music">
      <div class="music-con">
        <div class="music-audio">
          <audio ref="audioPlayersM" id="play-audiom" :src="musicSrc | replaceIP" style="opacity: 0;" controls autoplay preload></audio>
        </div>
        <div v-if="musicList.length" class="items">
          <div class="item" v-for="(item, index) in musicList" :key="index">
            <span class="name">{{ item.name }}</span>
            <span class="operation">
              <img v-show="musicPlay && item.play" src="@src/common/images/material/timg.gif" alt="" srcset="">
              <svg-icon icon-class="del" class-name="icon" @click="musicDel(item)" />
              <svg-icon v-show="!musicPlay || !item.play" icon-class="play" class-name="icon" @click="musicPlayFn(item)" />
              <svg-icon v-show="musicPlay && item.play" icon-class="pause" class-name="icon" @click="musicPause(item)" />
            </span>
          </div>
        </div>
        <notFundData v-else />
      </div>
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
      musicList: [],
      musicPageNo: 1,
      musicPageSize: 10,
      musicLen: 0,
      musicName: '',
      musicSrc: '',
      icon: 'icon',
      musicActive: 'active',
    }
  },
  props: {
    searchName: String,
    musicPlay: Boolean,
  },
  methods: {
    getMusicLibs(pageNo) {
      const params = {
        type: '1',
        name: this.searchName,
        categoryId: '',
        pageNo: pageNo,
        pageSize: this.musicPageSize,
      }
      this.$axios
        .get(this.$interParams.h5Inters.getMultimediaList, params)
        .then((data) => {
          this.musicList = []
          if (data.data.list.length) {
            const list = data.data.list
            this.$emit('update:page-size', this.templatePageSize)
            this.$emit('lengthChange', data.data.totalCount)
            list.forEach((e) => {
              e.play = false
              this.musicList.push(e)
            })
          }
        })
    },

    musicDel(item) {
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
    musicPlayFn(item) {
      this.musicList.forEach((e) => {
        e.play = false
        if (e.id == item.id) {
          e.play = true
          this.musicSrc = e.url
        }
      })
      this.musicPlay = true
      const audioEl = document.getElementById('play-audiom')
      audioEl.load()
    },
    musicPause(item) {
      this.musicList.forEach((e) => {
        e.play = false
      })
      this.musicPlay = false
      const audioEl = document.getElementById('play-audiom')
      audioEl.pause()
    },
    pause() {
      const audioEl = document.getElementById('play-audiom')
      audioEl.pause()
    },
  },
}
</script>
<style lang="scss">
$box-shadow: 0px 1px 6px 2px #dadcdf;
.music {
  .music-con {
    .music-audio {
      height: 0;
    }
    .items {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 48%;
        background: #fff;
        margin: 2px 1%;
        padding: 10px;
        border-radius: 5px;
        box-shadow: $box-shadow;
        color: #666;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          width: 70%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .operation {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 15px;
          }
          .icon {
            width: 30px;
            height: 30px;
            cursor: pointer;
            margin: 0 5px;
            &:hover {
              color: $main-color;
            }
          }
          .active {
            color: $main-color;
          }
        }
      }
    }
  }
}
</style>