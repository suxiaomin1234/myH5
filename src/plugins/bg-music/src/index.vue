<template>
  <div class="qk-bg-music" :class="{playing: playing}" @click="handleMusicPlay">
    <div class="video-play-audio" v-if="musicSrc">
      <audio :ref="audioPlayer" :id="radioID" :src="musicSrc | replaceIP" style="opacity: 0;" loop controls preload></audio>
    </div>
    <img class="yinyue-img" :src="imageSrc | replaceIP" alt="bg">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $bus from '@src/eventBus'
export default {
  name: 'qkBgMusic',
  props: {
    musicSrc: {
      type: String,
      default: require('./music.mp3'),
      // default: '',
    },
    imageSrc: {
      type: String,
      default: require('./music.png'),
    },
  },
  data() {
    return {
      audioEl: undefined,
      playing: true,
      radioID: '',
      audioPlayer: '',
    }
  },
  beforeMount() {
    const max = 100,
      min = 1
    const ID = `video-play-audio_${
      Math.floor(Math.random() * (max - min)) + min
    }`
    const ref = `audioPlayer_${Math.floor(Math.random() * (max - min)) + min}`
    this.radioID = ID
    this.audioPlayer = ref
  },
  computed: {
    ...mapGetters(['getMusicFlag']),
  },
  watch: {
    musicSrc: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        this.playing = true
      },
    },
    getMusicFlag(obj) {
      if (obj.libs) {
        this.playing = false
        this.audioEl.pause()
      }
    },
  },
  created() {
    $bus.$on('pauseMusic', () => {
      this.playing = false
      this.pause()
    })
    $bus.$on('playMusic', () => {
      this.playing = true
      this.play()
    })
  },
  mounted() {
    // this.audioEl = document.getElementById('video-play-audio')
    this.audioEl = document.getElementById(this.radioID)
    // this.audioEl.play()
    // this.audioEl.load()
    const audio = this.$refs[this.audioPlayer]
    audio.play()
    audio.play().catch(() => {
      this.playError = true
      let event = ['click', 'WeixinJSBridgeReady'] // "touchstart"
      let pageClick = () => {
        if (this.playError) {
          this.playError = false
          audio.load()
          this.$store.commit('setMusicPlayed', {
            plug: true,
            libs: false,
          })
          audio.play().catch(() => {
            this.playError = true
          })
          event.forEach((item) => {
            document.removeEventListener(item, pageClick)
          })
        }
      }
      event.forEach((item) => {
        document.addEventListener(item, pageClick)
      })
    })
  },
  methods: {
    handleMusicPlay() {
      if (!this.musicSrc) return
      if (this.playing) {
        this.pause()
      } else {
        this.play()
      }
    },
    play() {
      this.playing = true
      this.audioEl.play()
      this.$store.commit('setMusicPlayed', {
        plug: true,
        libs: false,
      })
    },
    pause() {
      this.playing = false
      this.audioEl.pause()
      this.$store.commit('setMusicPlayed', {
        plug: false,
        libs: false,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.video-play-audio {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 0;
  height: 0;
  z-index: -1;
  opacity: 1;
  overflow: hidden;
  // position: absolute;
  // left: 0px;
  // top: 0px;
  // width: 100%;
  // height: 100%;
  // z-index: 9999;
  // opacity: 1;
  // overflow: hidden;
}

.yinyue-img {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.qk-bg-music {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  &.playing {
    animation: spin 3s linear infinite;
  }
}

/* 无限旋转 */
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
