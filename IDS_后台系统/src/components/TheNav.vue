<template>
  <div class="menuBox" style="width:2.8rem;">
    <!-- logo -->
    <div class="menu_bg"></div>
    <!-- 名称 -->
    <el-scrollbar style="height: 100%;">
      <div class="title_wrap">
        <div class="name">{{ userInfo.username }}</div>
        <div class="id">ID：{{ userInfo.userId }}</div>
      </div>
      <!-- 菜单 -->
      <el-menu
        class="el-menu-vertical-demo navBox"
        :unique-opened="true"
        router
        :default-active="default_active"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <template v-for="item1 in menuList">
          <!-- 只有一级菜单 -->
          <el-menu-item v-if="isShowThree1(item1.haschildren,item1.index)" :index="item1.index" :key="item1.index">
            <div v-if="item1.index != 'admin_feedback'">
              <i :class="item1.icon"></i>
              <span slot="title">{{ item1.name }}</span>
            </div>

            <el-badge
              v-if="item1.index == 'admin_feedback'"
              :value="$main.newsNum"
              class="admin_badge_item"
            >
              <i :class="item1.icon"></i>
              {{ item1.name }}
            </el-badge>
            <!-- <el-badge v-if="item1.index == 'admin_feedback'" :value="num" class="badge_item">
              <span slot="title">{{ item1.name }}</span>
            </el-badge>-->
          </el-menu-item>
          <!-- 有二级 -->
          <el-submenu :index="item1.index" v-if="!!item1.haschildren" :key="item1.index">
            <template slot="title">
              <i :class="item1.icon"></i>
              <el-badge
                v-if="item1.index == 'member_back'"
                :value="$main.newsNum"
                class="badge_item"
              >
                <span>{{ item1.name }}</span>
              </el-badge>
              <span v-if="item1.index!='member_back'">{{ item1.name }}</span>
            </template>
            <template v-for="item1_1 in item1.list">
              <!-- 没有三级 -->
              <el-menu-item
                v-if="isShowThree(item1_1.haschildren,item1_1.index)"
                :index="item1_1.index"
                :key="item1_1.index"
              >
                <el-badge
                  v-if="item1_1.index == '/user/feedback/history'"
                  :value="$main.newsNum"
                  class="badge_item"
                >{{ item1_1.name }}</el-badge>
                <span v-if="item1_1.index != '/user/feedback/history'">{{ item1_1.name }}</span>
              </el-menu-item>
              <!-- 有三级 -->
              <el-submenu v-if="!!item1_1.haschildren" :key="item1_1.index" :index="item1_1.index">
                <template slot="title">{{ item1_1.name }}</template>
                <el-menu-item
                  v-for="item1_1_1 in item1_1.list"
                  :key="item1_1_1.index"
                  :index="item1_1_1.index"
                >{{ item1_1_1.name }}</el-menu-item>
              </el-submenu>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import comData from "../utils/data.js";
export default {
  name: "TheNav",
  props: ["userInfo"],
  inject: ["$main"],
  data: function() {
    return {
      dept: 11, // 11什么都不变  21改变
      num: 0,
      user: {
        username: "", // 用户名
        userId: "" // 用户id
      },
      default_active: "", // 值是menuList里的index，这里index对应的是跳转路径
      menuList: []
    };
  },
  mounted: function() {
    let active = this.$route.path;
    this.default_active = active;

    if (!!window.localStorage.getItem("userInfo")) {
      this.dept = JSON.parse(window.localStorage.getItem("userInfo")).dept;
    }

    this.initMenuList();
    this.$main.fnGetNewsNum();
    // this.fnGetNews();
    // this.fnInit();
  },
  methods: {
    isShowThree1 (haschildren, index) {
      if(!!!haschildren){
        if(comData.os_type == 1){
          return true;
        }else{
          if(this.dept == 21){
            if(index == '/user/lowerList'){
              return false;
            }else{
              return true;
            }
          }else{
            return true;
          }
        }
      }else{
        return false;
      }
    },
    isShowThree(haschildren, index) {
      // 21 的时候  不要银行卡、转账
      if (!!!haschildren) {
        if (this.dept == 21) {
          if (comData.os_type == 1) {
            // 正式版
            // 银行卡、转账
            if(index == '/user/account/bank'||index == '/user/account/asset'){
              return false;
            }else{
              return true;
            }
          } else {
            // 阉割版
            // 银行卡、转账、电子钱包
            if(index == '/user/account/bank'||index == '/user/account/asset'||index == '/user/wallet/ele'){
              return false;
            }else{
              return true;
            }
          }
        }else{
          return true;
        }
        /* if (this.dept == 21) {
          if(index == '/user/account/bank'||index == '/user/account/asset'){
            return false;
          }else{
            return true;
          }
        } else {
          return true;
        } */
      } else {
        return false;
      }
    },
    // 获取未读数量
    /* fnGetNews() {
      let vm = this;
      if (vm.$route.matched[0].name == "admin") {
        // 管理员端
        vm.$api.IDS_ADMIN_SELECTCOUNT().then(res => {
          console.log(res, 22);
          if (res.code == 0) {
            vm.num = res.data ? parseInt(res.data) : 0;
          }
        });
      } else {
        // 用户端
        vm.$api.IDS_FEEDBACK_SELECTCOUNT().then(res => {
          console.log(res);
          if (res.code == 0) {
            vm.num = res.data ? parseInt(res.data) : 0;
          }
        });
      }
    }, */
    handleSelect(index, indexPath) {
      let vm = this;
      let w = document.documentElement.offsetWidth || document.body.offsetWidth;
      if (w < 700) {
        vm.$emit("selectMenu");
      }
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    initMenuList() {
      console.log(1);
      let num;
      // 0 用户菜单  1 管理员
      if (this.$route.matched[0].name == "admin") {
        num = "1";
      } else {
        num = "0";
      }
      this.menuList = comData.menuList(num, this);
    }
    /* fnInit () {
      let vm = this;
      // 获取用户信息
      vm.fnGetNewInfo().then(res=>{
        vm.user.userId = res.userId;
        vm.user.username = res.username;
      })
    } */
  },
  watch: {
    $route(to, from) {
      let active = to.path;
      this.default_active = active;
      if (to.matched[0].name != from.matched[0].name) {
        // this.fnGetNews();
        this.$main.fnGetNewsNum();
        this.initMenuList();
      }
    }
  }
};
</script>
<style lang='scss'>
.el-badge__content {
  border: none !important;
}
.badge_item {
  margin-top: 10px;
  margin-right: 40px;
}

.menuBox {
  height: 100%;
  overflow: auto;
  width: 2.75rem;
  position: relative;
  .admin_badge_item {
    margin-top: 0px !important;
    .el-badge__content.is-fixed {
      top: 10px !important;
      border: none !important;
      right: 0px !important;
    }
  }
  .badge_item {
    margin-top: 0px !important;
    .el-badge__content.is-fixed {
      top: 10px !important;
      right: 1px !important;
      border: none !important;
    }
  }

  .menu_bg {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 111px;
    background: url("../../static/image/menu_bg.png") no-repeat;
    background-size: cover;
  }
}
.navBox {
  background: #070e38;
}
.title_wrap {
  width: 100%;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  text-align: center;
  color: #fff;
  .name {
    font-size: 0.24rem;
    font-weight: bold;
  }
  .id {
    font-size: 0.18rem;
    font-weight: 400;
    opacity: 0.6;
  }
}
</style>
