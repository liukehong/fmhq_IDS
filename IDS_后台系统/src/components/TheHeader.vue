<template>
  <div class="header">
    <div class="lgout" @click="fnBack" style="float:right; cursor:pointer;">
      <a>
        <!-- 退出 -->
        <span>{{ !!!isAdminEnter?$t('system_container.logout'):$t('system_container.back') }}</span>
        <i class="el-icon-right"></i>
      </a>
    </div>

    <div class="date" style="float:right;">
      {{ $t('system_container.hello') }}
      <!-- 您好 -->
      ，{{ userInfo.username }}
    </div>
  </div>
</template>

<script>
import comData from "@/utils/data.js";
export default {
  name: "TheHeader",
  props: ["showHeader", "userInfo"],
  inject: ["$main"],
  data() {
    return {
      isAdminEnter: false
    };
  },
  methods: {
    fnBack() {
      let vm = this;
      vm.$main.loading = true;
      // 管理员登录进来会员系统的情况
      if (!!vm.isAdminEnter) {
        vm.$main.loading = false;
        vm.$router.push(comData.conutry_type + "/admin/admin_home");
      } else {
        if (this.$route.matched[0].name == "admin") {
          vm.$api.IBM_ADMIN_LOGOUT().then(res => {
            vm.$main.loading = false;
            vm.$router.push(comData.conutry_type + "/admin_login");
          });
        } else {
          vm.$api.IBM_LOGIN_LOGOUT().then(res => {
            vm.$main.loading = false;
            vm.$router.push(comData.conutry_type + "/login");
          });
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      let vm = this;
      // 管理员登录会员账号，退出操作变成返回操作
      // isAdminEnter  true 是  false 否   默认：false
      // 从管理系统进来，from.name == 'admin'，to.name != 'admin'，此时isAdminEnter = true;
      // 点击返回操作之后，from.name != 'admin'，to.name == 'admin'，此时isAdminEnter = false;

      if (from.matched[0].name == "admin" && to.matched[0].name != "admin") {
        vm.isAdminEnter = true;
      }
      if (from.matched[0].name != "admin" && to.matched[0].name == "admin") {
        vm.isAdminEnter = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@/common/css/base.scss";
.header {
  color: #676f7f !important;
  height: 100%;
  width: 100%;
  font-size: 0.16rem;
  .lgout {
    height: 0.7rem;
    // padding: 0 0.4rem;
    width: 1.75rem;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
    a {
      width: 1.75rem;
      background: #6aba43;
      height: 0.42rem;
      line-height: 0.42rem;
      display: block;
      overflow: hidden;
      font-size: 0.14rem;
      box-shadow: 0px 10px 21px 3px rgba(153, 153, 153, 0.38);
      border-radius: 6px;
      color: #fff;
      padding-left: .4rem;
      font-size: .12rem;
      i {
        height: 0.42rem;
        line-height: 0.42rem;
        float: right;
        padding-right: .12rem;
        font-size: .14rem;
      }
    }
    .back_icon {
      display: inline-block;
      width: 0.2rem;
      height: 0.2rem;
    }
  }
  .date {
    margin-right: 0.25rem;
    font-size: .14rem;
    @media screen and (max-width: $smallSize) {
      display: none;
    }
  }
}
</style>
