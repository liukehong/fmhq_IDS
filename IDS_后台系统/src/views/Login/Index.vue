<template>
  <div class="login_bg" v-loading="loading">
    <Enter v-if="pageType == 'login'"></Enter>
    <Forget v-if="pageType == 'forget'"></Forget>
    <RegIster v-if="pageType == 'register'"></RegIster>
  </div>
</template>

<script>
import Utils from "@/utils/encrypt.js";
import comData from "@/utils/data.js";
import axios from "axios";
import Enter from "./Enter";
import Forget from "./Forget";
import RegIster from "./RegIster";
export default {
  name: "MainLogin",
  provide() {
    return {
      p: this
    };
  },
  components: {
    Enter,
    Forget,
    RegIster
  },
  data() {
    return {
      pageType: "login",
      inviteSuper: "",
      parentId: '',
      loading: false
    };
  },
  mounted: function() {
    // 判断
    let vm = this;
    let url = window.location.href;
    let name;
    let id;
    let langType;
    let arrs = url.split("?");
    if (arrs.length > 1) {
      name = (arrs[1].split("=")[1]).split('&')[0];
      id = (arrs[1].split('&')[1]).split('=')[1];
      langType = arrs[1].split('&')[2].split('=')[1];
      this.inviteSuper = name;
      this.parentId = id;
      this.pageType = "register";
      console.log(this.inviteSuper);
      console.log(this.parentId);
      console.log(langType);
      vm.$i18n.locale = langType;
      window.localStorage.setItem("locale", langType);
    }
  }
};
</script>

<style lang="scss">
@import "~@/common/css/base.scss";
.select_wrap .el-input-group__append,
.select_wrap .el-input-group__prepend {
  // background: none;
  border: none;
}
.reg_form .el-form-item__label {
  // color: #000!important;
}
.el-scrollbar__wrap {
  margin-bottom: 0px !important;
}
.login_bg {
  .reset_select {
    width: 0.9rem;
  }
  background-repeat: no-repeat;
  background-position: center;
  background-color: #fff;
  background-image: url("../../../static/image/login_bg.png");
  background-size: cover;
  min-height: 100%;
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  .login_box_bg {
    position: relative;
    width: 3.87rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.22rem;
    overflow: hidden;
    padding-bottom: 1.2rem;
    @media screen and (max-width: $ipad_width) {
      width: 100%;
      height: 100%;
      border: none;
      overflow: auto;
    }
    .login_header {
      padding-left: 0.45rem;
      padding-top: 0.2rem;
      .title1 {
        font-size: 0.28rem;
        font-weight: 400;
        color: #1d56d1;
        font-family: MicrosoftYaHeiUI;
      }
      .title2 {
        font-size: 0.13rem;
        font-family: MicrosoftYaHeiUI;
        font-weight: 400;
        color: #afafaf;
        padding-top: 0.12rem;
      }
    }
    .login_top_bg {
      position: absolute;
      right: 0px;
      top: 0px;
      width: 1.63rem;
      height: 1.46rem;
      background: url("../../../static/image/login_top_bg.png") no-repeat;
      background-size: cover;
    }
    .login_bottom_bg {
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      height: 2.7rem;
      background: url("../../../static/image/login_bottom_bg.png") no-repeat;
      background-size: cover;
    }
    .login_tit {
      line-height: 0.45rem;
      font-size: 0.14rem;
      text-align: center;
      background-color: #203b84;
      text-shadow: 1px 1px 1px #000;
      font-weight: bold;
      font-size: 0.16rem;
    }
    .login_logo {
      width: 1.42rem;
      margin: 0.15rem auto;
      padding-top: 0.4rem;
      // padding-bottom: 0.2rem;
      img {
        border: 0;
        width: 100%;
        display: block;
        vertical-align: middle;
      }
    }
    .login_form {
      padding: 0 0.5rem;
      // margin-bottom: 0.5rem;
      .login_input {
        margin-top: 0.28rem;
        p {
          margin-bottom: 0.1rem;
          font-size: 0.14rem;
        }
      }
      .el-input-mixin {
        width: 73%;
        float: left;
        input {
          border-radius: 4px 0px 0px 4px;
        }
      }
      .img-box {
        width: 27%;
        float: left;
        height: 40px;
        border-radius: 0px 4px 4px 0px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
    .login_btn_box {
      z-index: 1;
      padding: 0.24rem 0.3rem;
      position: absolute;
      width: 100%;
      bottom: 0px;
      // border-top: 1px solid #000;
      .login-btn {
        width: 100%;
        height: 0.4rem;
        margin: 0 auto;
      }
      .login_a {
        margin-top: 0.23rem;
        overflow: hidden;
        a {
          font-size: 0.14rem;
          text-decoration: underline;
          cursor: pointer;
          color: #666666;
        }
        a:first-child {
          float: left;
        }
        a:last-child {
          float: right;
        }
      }
      .login_back {
        text-align: center;
        margin-top: 0.16rem;
        font-size: 0.16rem;
        a {
          text-decoration: none;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
