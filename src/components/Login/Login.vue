<template>
  <div>
    <video src="../../assets/video/video.mp4" type="mp4" autoplay loop style="z-index: -9999;position: absolute;opacity: 0;"></video>
    <!--中间部分-->
    <div class="container">
      <img class="animate__animated animate__fadeInDownBig" src="https://pic.imgdb.cn/item/6191f05f2ab3f51d9113f00c.jpg"
           alt=""/>
      <div class="panel">
        <div class="content login">
          <div class="switch">
            <div class="animate__animated animate__fadeInRight">
              <span class="active">登录</span>
            </div>
            <br>
            <div class="animate__animated animate__fadeInLeft">
              <span class="active">Login</span>
            </div>
          </div>
          <div class='form' id="fromLogin">
            <!--用户名-->
            <div class="input animate__animated animate__fadeInDown">
              <input @keyup.enter="loginAgree" ref="usernameInputFormRef" :class='isShowUserNameInfo'
                     v-model='loginForm.username'
                     type="text" name="username"
                     id="Username"/>
              <label>用户名</label>
            </div>
            <!--密码-->
            <div class="input animate__animated animate__fadeInUp">
              <input @keyup.enter="loginAgree" :class='isShowPasswordInfo' v-model='loginForm.password' type="password"
                     name="password" id="Password"/>
              <label>密码</label>
            </div>
            <div :class="errorAnimateAction">
              <span class="errorPrompt" v-text="errorMessage"></span>
            </div>
            <!--登录按钮-->
            <button class="animate__animated animate__fadeInRight" type="submit" @click='loginAgree'>登录</button>
            <button class="clearBtn animate__animated animate__fadeInLeft" @click='resetLoginForm'>清空</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 背景区域 -->
    <div class="slidershow">
      <div class="slidershow--image"
           style="background-image: url('https://pic.imgdb.cn/item/6192366c2ab3f51d912c90b7.jpg')"></div>
      <div class="slidershow--image"
           style="background-image: url('https://pic.imgdb.cn/item/619235d52ab3f51d912c6504.png')"></div>
      <div class="slidershow--image"
           style="background-image: url('https://pic.imgdb.cn/item/61920ced2ab3f51d911e8bb5.jpg')"></div>
      <div class="slidershow--image"
           style="background-image: url('https://pic.imgdb.cn/item/619235572ab3f51d912c3697.png')"></div>
    </div>
  </div>
</template>

<script>

import {ThrottleBy} from "../../utils/util";

export default {
  name: "Login",
  data() {
    return {
      active: 'login',
      // 这是登录表单的数据绑定对象
      loginForm: {username: '', password: ''},
      // 绑定提示错误信息样式名
      errorAnimateAction: 'errorPromptEle',
      // 输入错误时提示用户修改的信息
      errorMessage: ''
    }
  },
  computed: {
    isShowUserNameInfo() {
      if (this.loginForm.username) {
        this.errorAnimateAction = ''
        this.errorMessage = ''
        return "hasValue"
      }
    },
    isShowPasswordInfo() {
      if (this.loginForm.password) {
        this.errorAnimateAction = ''
        this.errorMessage = ''
        return "hasValue"
      }
    }
  },
  methods: {
    // 登录节流
    loginAgree: ThrottleBy(async function () {
      this.errorAnimateAction = 'errorPromptEle animate__animated animate__flash'
      const userReg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
      const pwdReg = /^[A-Za-z0-9]{4,40}$/;
      // 验证用户名和密码是否为空
      if (!(this.loginForm.username === "" || this.loginForm.password === "")) {
        if (!userReg.test(this.loginForm.username)) { // 用户名验证
          this.errorMessage = '用户名至少为5位字母或数字组成'
        } else if (!pwdReg.test(this.loginForm.password)) {// 密码验证
          this.errorMessage = '密码至少为4位字母或数字组成'
        } else {
          const {data: res} = await this.$http.post("login", this.loginForm);
          if (res.meta.status !== 200) {
            // 登录失败的不同状态
            this.errorMessage = res.meta.msg;
          } else {
            // 登录成功
            this.errorMessage = res.meta.msg;
            // 将登录成功之后的token，保存到客户端的sessionStrage中
            window.sessionStorage.setItem('token', res.data.token);
            // 跳转到
            this.$router.push('/home');
          }
        }
      } else {
        this.errorMessage = '用户名或密码不能为空'
      }
    }, 1500),
    // 清空表单
    resetLoginForm() {
      this.errorAnimateAction = ''
      this.loginForm.username = '';
      this.isShowUserNameInfo = '';
      this.loginForm.password = '';
      this.isShowPasswordInfo = '';
      this.errorMessage = ''
    },
  }
}
</script>

<style scoped lang="scss">
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
  -webkit-text-fill-color: #000 !important;
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}

.container {
  position: absolute;
  opacity: .9;
  width: 70rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  img {
    width: 70rem;
    border-radius: 2rem;
    box-shadow: inset 0 0 15px rgba(55, 84, 170, 0),
    inset 0 0 20px rgba(255, 255, 255, 0),
    10px 10px 18px rgba(55, 84, 170, 0.55),
    -2px -2px 12px white,
    inset 0px 0px 4px rgba(255, 255, 255, 0.2);
    transition: box-shadow 0.7s ease-in-out;
  }
}

.switch {
  text-align: center;
  margin-top: -2.5rem;
  
  span {
    color: #ccc;
    font-size: 3rem;
    font-family: STXingkai;
    cursor: pointer;
  }
  
  span.active {
    color: rgb(181, 154, 254);
  }
}

.panel {
  width: 30%;
  margin: 10rem 0 0;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
}

.form {
  width: 12rem !important;
  margin: 3rem 0 0 !important;
  
  .input {
    position: relative;
    opacity: 1;
    height: 2rem;
    width: 100%;
    margin: 2rem 0;
    transition: .4s;
    font-family: STXingkai;
    
    input {
      outline: none;
      width: 100%;
      font-weight: 600;
      border: none;
      border-bottom: .1rem solid rgb(181, 154, 254);
      position: relative;
      line-height: 35px;
      background: transparent;
      z-index: 1;
    }
  }
  
  span {
    display: block;
    color: rgb(110, 89, 167);
    font-size: .8rem;
    cursor: pointer;
  }
  
  .errorPromptEle {
    display: flex;
    justify-content: center;
    
    .errorPrompt {
      margin-top: -.3rem;
      text-align: center;
      position: fixed;
      font-size: .9rem;
      background: linear-gradient(to right, #ef88ff, #58a5ff);
      -webkit-background-clip: text;
      color: transparent;
      font-family: 微软雅黑;
      font-weight: 600;
    }
  }
  
  button {
    border: none;
    outline: none;
    margin: 2.5rem 0 0;
    width: 100%;
    height: 3rem;
    border-radius: 3rem;
    background: linear-gradient(90deg, rgb(181, 154, 254), rgb(245, 189, 253));
    box-shadow: 0 0 8px rgb(181, 154, 254);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    font-size: 1.3rem;
    color: white;
    font-family: 华文新魏;
    
    &:hover {
      box-shadow: -2px -2px 7px rgb(205, 188, 247), 2px 2px 5px rgb(197, 180, 244);
    }
    
    &:active {
      box-shadow: inset 1px 1px 2px rgb(207, 192, 248), inset -1px -1px 2px rgb(192, 173, 244);
    }
  }
  
  .clearBtn {
    border: none;
    outline: none;
    margin: 2.5rem 0 0;
    width: 100%;
    height: 3rem;
    border-radius: 3rem;
    background: linear-gradient(90deg, rgb(96, 173, 248), rgb(158, 206, 255));
    box-shadow: 0 0 8px rgb(154, 176, 254);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    font-size: 1.3rem;
    color: white;
    font-family: 华文新魏;
    
    &:hover {
      box-shadow: -2px -2px 7px rgb(163, 177, 247), 2px 2px 5px rgb(155, 185, 241);
    }
    
    &:active {
      box-shadow: inset 1px 1px 2px rgb(192, 225, 248), inset -1px -1px 2px rgb(173, 180, 244);
    }
  }
}

.input label {
  position: absolute;
  left: 0;
  top: 20%;
  font-size: 1.2rem;
  color: rgb(129, 101, 207);
  transition: .3s;
}

.hasValue ~ label, input:focus ~ label {
  top: -50%;
  font-size: 1.1rem;
}

#live2dcanvas {
  border: 0 !important;
}

.slidershow {
  z-index: -1;
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.slidershow--image {
  position: absolute;
  width: 100%;
  height: 100%;
  background: no-repeat 50% 50%;
  background-size: cover;
  -webkit-animation-name: kenburns;
  animation-name: kenburns;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-duration: 16s;
  animation-duration: 16s;
  opacity: 1;
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}

.slidershow--image:nth-child(1) {
  -webkit-animation-name: kenburns-1;
  animation-name: kenburns-1;
  z-index: 3;
}

.slidershow--image:nth-child(2) {
  -webkit-animation-name: kenburns-2;
  animation-name: kenburns-2;
  z-index: 2;
}

.slidershow--image:nth-child(3) {
  -webkit-animation-name: kenburns-3;
  animation-name: kenburns-3;
  z-index: 1;
}

.slidershow--image:nth-child(4) {
  -webkit-animation-name: kenburns-4;
  animation-name: kenburns-4;
  z-index: 0;
}

@-webkit-keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
    transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}

@keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
    transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}

@keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}

@-webkit-keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}

@keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}

@-webkit-keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>