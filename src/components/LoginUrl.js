export default {
  computed: {
    loginUrl() {
      const scopes = 'user-read-private user-read-playback-state user-modify-playback-state';
      const redirect_uri = process.env.VUE_APP_SPOTIFY_CALLBACK;
      return ('https://accounts.spotify.com/authorize' +
          '?response_type=token' +
          '&client_id=' + process.env.VUE_APP_SPOTIFY +
          (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
          '&redirect_uri=' + encodeURIComponent(redirect_uri));
    }
  }
}
