<template>
  <div class="home">
    <div class="content">
      <div class="video-container">
        <div v-show="video">
          <youtube :video-id="video" :player-vars="playerVars" ref="youtube"/>
        </div>
      </div>
      <input v-model="video">
    </div>
    <NowPlayingBar :crossfade-time="crossfade_time" :music="music" :crossfade="crossfade" @crossfade="startCrossfading"/>
  </div>
</template>

<script>
import NowPlayingBar from './NowPlayingBar.vue'; 

class MusicPlayer {
  constructor(fetch) {
    Object.assign(this, {
      id: null,
      name: null,
      image: null,
      start: 0,
      duration: 0,
      progress: 0,
      is_playing: false,
      put: command => fetch(`https://api.spotify.com/v1/me/player/${command}`, { method: 'PUT' })
    });
  }
  async play() {
    this.is_playing = true;
    await this.put('play');
    this.is_playing = true;
  }
  async pause() {
    this.is_playing = false;
    await this.put('pause');
    this.is_playing = false;
  }
  async setVolume(volume) {
    await this.put(`volume?volume_percent=${volume}`);
  }
}

export default {
  name: 'Home',
  components: { NowPlayingBar },
  props: {
    crossfade_time: {
      type: Number,
      default: 5000
    },
  },
  data() {
    return {
      music: new MusicPlayer(this.fetch),
      video: '',
      playerVars: {
        controls: 0,
        start: 5
      },
      crossfade: {
        start: 0,
        to_video: true,
        percentage: 0,
      },
      interval: {}
    };
  },
  computed: {
    valid() {
      return this.video && this.music.id;
    },
    videoPlayer() {
      return this.$refs.youtube.player;
    },
    musicProgressStyle() {
      return { width: `${100 * (this.music.progress / this.music.duration)}%` };
    },
  },
  mounted() {
    this.startUpdates();
    document.addEventListener("visibilitychange", this.visibilityUpdated);
  },
  beforeDestroy() {
    clearInterval(this.interval.update);
    clearInterval(this.interval.progress);
    document.removeEventListener("visibilitychange", this.visibilityUpdated);
  },
  methods: {
    visibilityUpdated() {
      if (document.visibilityState === 'visible') {
        this.startUpdates();  
      } else {
        clearInterval(this.interval.update);
        clearInterval(this.interval.progress);
      }
    },
    async startUpdates() {
      await this.updateMusic();
      clearInterval(this.interval.update);
      this.interval.update = setInterval(this.updateMusic, this.crossfade_time);
    },
    setProgressUpdates() {
      clearInterval(this.interval.progress);
      this.interval.progress = setInterval(this.stepProgress, 500);
    },
    async updateMusic() {
      const res = await this.fetch('https://api.spotify.com/v1/me/player');
      if (res.status == 401) {
        this.$router.push('/login');
        return;
      }
      if (res.status === 204) {
        this.music.id = null;
        return;
      }
      const data = await res.json();
      if (!data.item) {
        this.music.id = null;
        return;
      }
      if (this.music.id !== data.item.id) {
        const start = Date.now() - data.progress_ms;
        const { id, name, duration_ms: duration } = data.item;
        const image = data.item.album.images[2].url;
        const artist = data.item.artists.map(artist => artist.name).join(', ');
        Object.assign(this.music, { id, name, artist, image, start, duration });
      }
      const { progress_ms: progress, is_playing } = data;
      Object.assign(this.music, { progress, is_playing });
      if (!this.crossfade.start) {
        this.crossfade.to_video = !is_playing;
      }
      this.setProgressUpdates();
      this.updateProgress();
    },
    stepProgress() {
      this.music.progress += (this.music.is_playing ? 500 : 0);
      this.updateProgress();
    },
    async updateProgress() {
      if (!this.valid) {
        return;
      }
      // trigger crossfade?
      if (this.crossfade.start === 0) {
        let time_left = Infinity;
        if (this.crossfade.to_video) {
          const [progress, duration] = await Promise.all([this.videoPlayer.getCurrentTime(), this.videoPlayer.getDuration()]);
          if (duration !== 0) {
            time_left = (duration - progress) * 1000;
          }
        } else {
          const { progress, duration } = this.music;
          time_left = Math.max(0, duration - progress);
        }
        if (time_left < this.crossfade_time) {
          this.startCrossfading();
        }
      }
      if (this.crossfade.start !== 0) {
        this.updateCrossfade();
      }
    },
    updateCrossfade() {
      const progress = Date.now() - this.crossfade.start;
      this.crossfade.percentage = Math.min(Math.round(100 * progress / this.crossfade_time), 100);
      // fade volume
      this.updateVolumes(this.crossfade.percentage);
      // done?
      if (this.crossfade.percentage >= 100) {
        this.crossfade.start = 0;
        this.crossfade.percentage = 0;
        if (this.crossfade.to_video) {
          this.music.pause();
        } else {
          this.videoPlayer.stopVideo();
        }
      }
    },
    updateVolumes(percentage) {
      if (this.crossfade.to_video) {
        this.music.setVolume(100 - percentage);
        this.videoPlayer.setVolume(percentage);
      } else {
        this.music.setVolume(percentage);
        this.videoPlayer.setVolume(100 - percentage);
      }
    },
    startCrossfading() {
      if (!this.valid) {
        return;
      }
      if (this.crossfade.start) {
        this.crossfade.to_video = !this.crossfade.to_video;
      } else {
        this.crossfade.to_video = this.music.is_playing;
        this.crossfade.start = Date.now();
        this.music.play();
        this.videoPlayer.playVideo();
        this.updateVolumes(0);
      }
    },
  }
}
</script>

<style scoped lang="scss">
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  & .content { flex: 1; }
}
.video-container {
  height: 360px;
  margin: 8px 0;
  background: black;
}
</style>
