<template>
  <div class="welcomeBody animate__animated animate__fadeIn" ref="body">
    <header>
      <div class="righSide">
        <ul class="sci">
          <li><a href="https://github.com/Nankeonlydream">
            <ion-icon name="logo-github"></ion-icon>
          </a></li>
        </ul>
        <div @click="dayNightClick" ref="dayNight" class="btns dayNight">
          <ion-icon name="moon-outline"></ion-icon>
          <ion-icon name="sunny-outline"></ion-icon>
        </div>
      </div>
    </header>
    <section class="main">
      <div class="videoCenter">
        <video src="../../assets/video/video.mp4" autoplay loop type="mp4"></video>
      </div>
      <img src="../../assets/mask.jpg" class="mask" alt="">
      <h2>南柯一梦</h2>
      <p class="copyrightText">HaoJie - 2021</p>
    </section>
  </div>
</template>

<script>

export default {
  name: "WelCome",
  mounted() {
    this.saveNavState();
  },
  methods: {
    dayNightClick() {
      this.$refs.body.classList.toggle('dark');
      this.$refs.dayNight.classList.toggle('active');
    },
    saveNavState() {
      window.sessionStorage.setItem('activePath', '/welcome');
    }
  }
}
</script>

<style scoped>
.welcomeBody {
  height: 76.5vh;
  width: 100%;
  overflow-x: hidden;
}

:root {
  --black: #333;
  --white: #fff;
}

.copyrightText {
  position: absolute;
  left: 100px;
  bottom: 0;
  z-index: 4;
  font-weight: 500;
  font-size: 1.4em;
  color: var(--black);
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: 华文行楷, serif;
}

.dark {
  --black: #fff;
  --white: #333;
}

.sci {
  position: absolute;
  right: 100px;
  z-index: 4;
  display: flex;
  flex-direction: column;
}

.sci li {
  list-style: none;
  line-height: 45px;
}

.sci li a {
  text-decoration: none;
  color: var(--black);
  font-size: 1.75em;
}


header {
  position: absolute;
  display: flex;
  width: 1100px;
  justify-content: space-between;
  align-items: center;
  padding: 40px 100px;
  z-index: 10000;
}

.btns {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
}

.btns ion-icon {
  font-size: 1.5em;
  color: var(--black);
}

.btns.menuToggle ion-icon {
  font-size: 3em;
}

.btns ion-icon:nth-child(2) {
  display: none;
}

.btns.active ion-icon:nth-child(2) {
  display: block;
}

.btns.active ion-icon:nth-child(1) {
  display: none;
}

.main {
  position: relative;
  width: 100%;
  min-height: 76.5vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main .videoCenter {
  width:88%;
  height: 83%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: cover;
  z-index: 1;
}

.main .videoCenter video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  user-select: none;
  mix-blend-mode: screen;
}

.dark .mask {
  filter: invert(1);
  mix-blend-mode: multiply;
}

.main h2 {
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  z-index: 3;
  font-size: 16vw;
  padding-top: 50px;
  font-family: 华文行楷, serif;
  font-weight: 300;
  color: #fff;
  text-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
}

.navigation li {
  list-style: none;
}

.navigation li a {
  display: inline-flex;
  margin: 5px 0;
  font-size: 1.35em;
  text-decoration: none;
  color: var(--black);
  padding: 5px 20px;
  border-radius: 40px;
}

.navigation li a:hover {
  background: var(--black);
  color: var(--white);
}

@media (max-width: 768px) {
  header {
    padding: 20px;
  }
}
</style>