<template>
  <div class="login">
    <h3 class="billboard">YouQueue</h3>
    <h4>A flexible Spotify and YouTube mixer</h4>
    <p>Search and watch YouTube videos with automatic switching from your music running in your Spotify player.</p>
    <a class="login-button" :href="loginUrl">
      <img src="../assets/logo.png">
      <div>Log in with Spotify</div>
    </a>
  </div>
</template>

<script>
import LoginUrl from './LoginUrl';

export default {
  name: 'Login',
  mixins: [LoginUrl],
}
</script>

<style scoped lang="scss">
.login {
  max-width: 640px;
  margin: 0 auto;
}
.billboard {
  margin: 40px 0 0;
  font-size: 72px;
  background: linear-gradient(to right, #1ed760, red);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.login-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 28px;
  background: #1ed760;
  color: white;
  font-size: 20px;
  text-decoration: none;
  & img {
    width: 40px;
    height: 40px;
    margin-right: 16px;
  }
}
</style>
