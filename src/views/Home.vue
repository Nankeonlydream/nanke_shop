<template>
  <div class="area-container">
    <el-container class="home-container">
      <!--头部区-->
      <el-header class="animate__animated animate__fadeInDown">
        <animatedBanner id="banner"
                        v-if="animatedBannerEnabled"
                        :config="position"
                        @change="(v) => (animatedBannerShow = v)"
                        :style="animatedBannerShow ? '' : `background-image: url(${bannerImg})`"
                        :class="animatedBannerShow ? '' : 'staticImg'"
        />
        <div class="floatTopEle">
          <!--logo和标题-->
          <div class="leftHeader">
            <img class="logo" src="../assets/logo.png" alt="">
            <!--音乐播放器-->
            <span>NanKeOnlyDream</span>
          </div>
          <div class="home-music">
            <player />
          </div>
          <el-button class="logoutBtn" icon="el-icon-switch-button" @click="logout"></el-button>
        </div>
      </el-header>
      <!--页面主体区域-->
      <el-container>
        <el-menu
          router
          text-color="#000"
          active-text-color="#fd79a8"
          :default-active="activePath"
          class="el-menu-vertical-demo x-font-weight"
          :collapse="isCollapse"
          unique-opened>
          <div class="menu-box">
            <input type="checkbox" id="menu-btn" :checked="isChecked">
            <label @click="isCollapse =! isCollapse; isChecked =! isChecked"><i class="iconfont icon-yemianfanhui"></i>
            </label>
          </div>
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i style="color: #000" :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span class="leftFont" slot="title">{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!--图标-->
                <i :class="iconsObj[subItem.id]"></i>
                <!--文本-->
                <span class="leftFont" slot="title">{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!--右侧内容主体-->
        <el-main>
          <!--路由占位符-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import animatedBanner from '../components/Banner/animatedBanner'
import position from '../components/Banner/js/position'
import Player from "../components/Player";

export default {
  name: "Home",
  data() {
    return {
      position,
      animatedBannerShow: false,
      animatedBannerEnabled: false,
      title: '',
      titleClass: '',
      // 左侧菜单数据
      menuList: [],
      // 状态是否改变
      isCollapse: false,
      // 是否勾选
      isChecked: false,
      // 用来存储图标的对象组
      iconsObj: {
        '125': 'el-icon-user',
        '103': 'el-icon-unlock',
        '101': 'el-icon-goods',
        '102': 'el-icon-collection-tag',
        '145': 'el-icon-data-analysis',
        '110': 'el-icon-chat-line-square',
        '111': 'el-icon-video-camera',
        '112': 'el-icon-coordinate',
        '104': 'el-icon-help',
        '115': 'el-icon-finished',
        '121': 'el-icon-view',
        '107': 'el-icon-mobile',
        '146': 'el-icon-files'
      },
      // 被激活的链接地址
      activePath: ''
    }
  },
  components: {
    animatedBanner,
    Player
  },
  updated() {
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  computed: {
    bannerImg() {
      return require('../static/static.png')
    }
  },
  // 组件被创建后调用
  created() {
    // 获取菜单数据
    this.getMenuList();
    // 将activePath状态从sessionStorage取出
    this.activePath = window.sessionStorage.getItem('activePath');
    console.log(this.activePath)
  },
  methods: {
    async animatedBanner() {
      // 优先加载展示静态banner
      const staticBannerImg = document.createElement('img')
      staticBannerImg.src = this.bannerImg
      await new Promise((resolve) => (staticBannerImg.onload = resolve()))
      this.animatedBannerEnabled = true
    },
    // 退出登录
    logout() {
      // 清空token
      window.sessionStorage.clear();
      // 将路由跳转到登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const {data: res} = await this.$http.get('menus');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  },
  mounted() {
    this.animatedBanner()
  }
}
</script>

<style scoped lang="scss">
/*顶部区域的样式*/
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  .el-header {
    height: 9.375vw!important;
    min-width: 100% !important;
    #banner {
      border-bottom-right-radius: 20px;
      border-bottom-left-radius: 20px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
      position: absolute;
      z-index: 0;
      min-height: 95px;
      height: 9.375vw;
      min-width: 100%;
      background-color: #f9f9f9;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: center;
      justify-content: center;
      background-repeat: no-repeat;
      background-position: center 0;
      background-size: cover;
    }
    
    .floatTopEle {
      min-height: 95px !important;
      height: 9.375vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: STXingkai;
      font-size: 30px;
      .home-music {
        z-index: 0;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 100%;
        min-width: 300px;
        background: transparent;
      }
      button {
        border: none;
        outline: none;
        width: 90px;
        height: 2.7rem;
        border-radius: 2rem;
        background: linear-gradient(90deg, rgb(255, 160, 203), rgb(189, 223, 253));
        box-shadow: 0 0 8px rgb(142, 197, 245);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        font-size: 1.3rem;
        color: #ccebff;
        font-family: 华文新魏;
        opacity: .9;
        
        &:hover {
          color: #f4f3f3;
          box-shadow: -1px -1px 6px rgb(252, 181, 213), 1px 1px 6px rgb(202, 230, 255);
        }
        
        &:active {
          box-shadow: 1px 1px 2px rgb(248, 193, 218), inset 0px 0px 2px rgb(206, 228, 248);
        }
      }
      
      .leftHeader {
        display: flex;
        justify-content: center;
        align-items: center;
        moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select:none;
        -khtml-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        user-select:none;
        /*logo样式*/
        .logo {
          width: 70px;
          height: 70px;
          opacity: .8;
        }
        
        span {
          z-index: 0;
          color: #fff;
          margin-left: 5px;
        }
      }
    }
  }
}

/*左边导航区*/
.leftFont {
  font-size: 15px !important;
  font-family: 楷体,serif;
}

.menu-box input[type='checkbox'] {
  display: none;
}

.menu-box > label {
  position: absolute;
  top: 48%;
  right: 0;
  z-index: 999;
  border-radius: 100px 0 0 100px;
  width: 19px;
  height: 27px;
  box-shadow: -1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  border: none;
  background-color: var(--color-menu-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.menu-box > input#menu-btn:checked ~ .menu {
  width: 0;
}

.menu-box > label > i {
  font-weight: 900;
  text-indent: -3px;
  opacity: .7;
  transition: transform var(--transition-menu-time);
  transform: rotate(0deg);
}

.menu-box > label:hover {
  box-shadow: -1px 2px 8px 1px rgba(0, 0, 0, 0.2);
  color: var(--font-color-mi-hover);
}

.menu-box > input#menu-btn:checked + label > i {
  transform: rotate(180deg);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  border-right: none;
}

.x-font-weight {
  font-weight: 600;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  background: var(--bg-url);
}

.logoutBtn {
  border: none!important;
  opacity: .7!important;
  border-radius: 20px!important;
  background: linear-gradient(90deg, #fd79a8, rgb(253, 189, 248))!important;
  box-shadow: 0 0 8px #f99bbd !important;
  color: #fff;
  font-size: 18px!important;
}

.logoutBtn:hover {
  color: #fff;
  box-shadow: -1px -1px 5px #f59aba, 2px 2px 10px rgb(247, 146, 240) !important;
}

.logoutBtn:active {
  box-shadow: 1 1 2px #ff93b9, -1px -1px 2px rgb(248, 193, 244)!important;
}
</style>