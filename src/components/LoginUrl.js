export default {
  computed: {
    loginUrl() {
      const scopes = 'user-read-private user-read-playback-state user-modify-playback-state';
      const redirect_uri = 'http://localhost:8080/callback';
      return ('https://accounts.spotify.com/authorize' +
          '?response_type=token' +
          '&client_id=' + 'c58f6411abb843a6b544fce191bf808c' +
          (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
          '&redirect_uri=' + encodeURIComponent(redirect_uri));
    }
  }
}
