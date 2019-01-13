<template>
  <div class="now-playing-bar">
    <div class="player" v-if="!music.disabled">
      <img :src="music.image">
      <div class="player-text">
        <div class="track">{{ music.name }}</div>
        <div class="artist">{{ music.artist }}</div>
      </div>
    </div>
    <a v-else class="button-container" :href="loginUrl">
      <img src="../assets/logo.png">
      <div class="description">Log in with Spotify</div>
    </a>
    <div class="button-container" @click="$emit('crossfade')" v-if="videos[0] || videos[1]">
      <button :style="crossfadeButtonStyle">&uarr;</button>
      <svg width="42" height="42">
        <circle :style="crossfadeProgressStyle" stroke="white" stroke-width="3" fill="transparent"
            r="20" cx="21" cy="21"/>
      </svg>
      <div class="description">
        <div v-if="crossfade.start">Fading to {{ crossfade.to_video ? 'video' : 'music' }}...</div>
        <div v-else-if="videos[0] && videos[1]">Fade to next video</div>
        <div v-else-if="music.is_playing">Fade to video now</div>
        <div v-else>Fade to music now</div>
      </div>
    </div>
    <div class="button-container autofade" @click="$emit('update:autofade', !autofade)" :class="{ enabled: autofade }">
      <button v-if="autofade">&#10003;</button>
      <button v-else>&#10555;</button>
      <div class="description">Autofade</div>
    </div>
    <div class="progress-container">
      <div class="elapsed">{{ elapsed | moment("m:ss") }}</div>
      <div class="progress"><div class="inner" :style="musicProgressStyle"></div></div>
      <div class="duration">{{ duration | moment("m:ss")  }}</div>
    </div>
  </div>
</template>

<script>
import LoginUrl from './LoginUrl';
import moment from 'moment'

export default {
  name: 'NowPlayingBar',
  mixins: [LoginUrl],
  props: {
    crossfade_time: {
      type: Number,
      default: 5000
    },
    music: {
      type: Object,
      required: true
    },
    videos: {
      type: Array,
      required: true
    },
    crossfade: {
      type: Object,
      required: true
    },
    autofade: {
      type: Boolean,
    },
  },
  computed: {
    crossfadeButtonStyle() {
      const transform = `rotate(${this.videos[0] && this.videos[1] ? 90 : this.crossfade.to_video ? -90 : 0 }deg)`;
      return { transform };
    },
    crossfadeProgressStyle() {
      const strokeDasharray = [(this.crossfade.start ? 1 : 0) * 40 * Math.PI, 40 * Math.PI].join();
      const transition = `stroke-dasharray linear ${this.crossfade.start ? this.crossfade_time : 0}ms`;
      return { strokeDasharray, transition };
    },
    elapsed() { return moment(this.music.progress); },
    duration() { return moment(this.music.duration); },
    musicProgressStyle() {
      return { width: `${100 * (this.music.progress / this.music.duration)}%` };
    },
  },
}
</script>

<style scoped lang="scss">
.now-playing-bar {
  min-height: 72px;
  background: #282828;
  color: white;
  text-align: left;
  display: flex;
}
.player {
  display: flex;
  flex: 0 1 260px;
  align-items: center;
  font-size: 12px;
  font-weight: 450;
  white-space: nowrap;
  overflow: hidden;
  & img {
    width: 48px;
    height: 48px;
    margin: 12px 10px 12px 12px;
  }
  & .player-text {
    overflow: hidden;
    position: relative;
  }
  & .track {
    height: 20px;
  }
  & .artist {
    color: #b3b3b3;
    font-size: 10px;
  }
}
.spacer {
  flex: 0 4 7%;
}
.button-container {
  margin: 0 8px;
  display: flex;
  align-items: center;
  position: relative;
  color: inherit;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  & button {
    padding: 0;
    min-width: 36px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid white;
    background: none;
    color: white;
    font-size: 24px;
    cursor: inherit;
    outline: none;
    box-sizing: content-box;
    transform-origin: 50% 50%;
    transition: transform ease 500ms;
  }
  & img {
    width: 36px;
    height: 36px;
  }
  & svg {
    position: absolute;
    pointer-events: none;
  }
  & circle {
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }
  & .description {
    margin-left: 10px;
  }
}
.autofade.enabled {
  color: #1ed760;
  & button {
    color: #1ed760;
    border: 1px solid #1ed760;
  }
}
.progress-container {
  flex: 1 260px;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #b3b3b3;
  .elapsed, .duration { width: 35px; }
  .elapsed {
    text-align: right;
    margin-right: 14px;
  }
  .duration {
    margin-left: 14px;
  }
}
.progress {
  flex: 1;
  background: #404040;
  border-radius: 2px;
}
.progress .inner {
  width: 0%;
  height: 4px;
  background: #b3b3b3;
  border-radius: 2px;
  transition: width 500ms ease;
}
</style>
