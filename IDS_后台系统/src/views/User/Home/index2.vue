<template>
  <div class="home_index inner_wrap" style="background: none;">
    <el-scrollbar style="height: 100%;">
      <!-- 第一行 -->
      <el-row>
        <!-- 钱包 -->
        <el-col class="col-item" :span="24" :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <!-- 头 -->
          <!-- 体 -->
          <el-row>
            <el-col
              class="wallet-item"
              :span="24"
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
              :xl="8"
              style="margin-bottom: .2rem;"
            >
              <div class="item register">
                <div class="text-box">
                  <!-- 注册钱包 -->
                  <p class="line">
                    <i class="el-icon-money"></i>
                    {{ $t('wallet.reg') }}
                  </p>
                  <p class="line">${{ rp|FORMATTED_NUMBER }}</p>
                  <el-button
                    @click="changeUrl('/user/wallet/rp')"
                    class="btn_style"
                    style="border-radius: 20px;"
                    size="small"
                  >{{ $t('home.seeInfo') }}</el-button>
                </div>
              </div>
            </el-col>
            <!-- 电子钱包 -->
            <el-col
              v-if="testType()"
              class="wallet-item"
              :span="24"
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
              :xl="8"
              style="margin-bottom: .2rem;"
            >
              <div class="item electron">
                <div class="text-box">
                  <p class="line">
                    <i class="el-icon-coin"></i>
                    {{ $t('wallet.ele') }}
                  </p>
                  <p class="line">${{ ap|FORMATTED_NUMBER }}</p>
                  <el-button @click="changeUrl('/user/wallet/ele')" class="btn_style" style="border-radius: 20px;" size="small">{{ $t('home.seeInfo') }}</el-button>
                </div>
              </div>
            </el-col>
            <el-col
              class="wallet-item"
              :span="24"
              :xs="24"
              :sm="24"
              :md="8"
              :lg="8"
              :xl="8"
              style="margin-bottom: .2rem;"
            >
              <div class="item cash">
                <div class="text-box">
                  <!-- 现金钱包 -->
                  <p class="line">
                    <i class="el-icon-wallet"></i>
                    {{ $t('wallet.cash') }}
                  </p>
                  <p class="line">${{ cp|FORMATTED_NUMBER }}</p>
                  <el-button
                    @click="changeUrl('/user/wallet/cp')"
                    style="border-radius: 20px;"
                    size="small"
                    class="btn_style"
                  >{{ $t('home.seeInfo') }}</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <!-- 资金操作 -->
        <el-col class="col-item" :span="24" :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="capital-item item-box1">
            <!-- 资金操作 -->
            <div class="title line">
              <!-- <img class="left_box" src="../../../../static/image/left.png" alt=""> -->
              <!-- <img class="right_box" src="../../../../static/image/right.png" alt=""> -->
              <span>{{ $t('home.asset_handle') }}</span>
            </div>
            <div class="content capital-box">
              <!-- 充值 -->
              <el-button
                style="border-radius: .24rem;"
                class="btn_style"
                @click="changeUrl('/user/eMoney/manage')"
                type="primary"
              >{{ $t('home.recharge') }}</el-button>
              <!-- 提现 -->
              <el-button
                style="border-radius: .24rem;"
                class="btn_style"
                @click="changeUrl('/user/oMoney/manage')"
                type="success"
              >{{ $t('home.withdraw') }}</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row style="margin-bottom: .1rem;">
        <el-col class="col-item" :span="24" :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <div class="mt4-item item-box1">
            <!-- MT4出金明细 -->
            <div class="title" style="width: 2.2rem; text-align:center;">
              <span>{{ $t('home.chart1') }}</span>
            </div>
            <div class="content personal-box">
              <el-row>
                <el-col
                  class="personal-wrap mt4-style"
                  :span="24"
                  :xs="24"
                  :sm="24"
                  :md="24"
                  :lg="24"
                  :xl="24"
                >
                  <EchartOne></EchartOne>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col class="col-item" :span="24" :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="userInfo-item item-box1">
            <!-- 用户信息 -->
            <div class="title line">{{ $t('home.user_info') }}</div>
            <div class="content userInfo-box">
              <div class="userInfo-img">
                <img :src="userInfo.icon" alt />
              </div>
              <div class="line title1">IDS{{ userId }}</div>
              <p
                style="padding-left: 10px; padding-right:5px;"
                class="title2"
              >{{ $t('home.congratulations') }}：{{ userInfo.levelName }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 配套列表 -->
      <el-row>
        <el-col class="col-item" :span="24" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="product-item item-box1">
            <div class="title line">{{ $t('user.product_setting') }}</div>
            <div class="content profit-box">
              <ProductList></ProductList>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import EchartOne from "./OneCharts";
import EchartTow from "./TowCharts";
import ProductList from "./productList";
import GetUserInfo from "../../../mixins/getUserInfo.js";
import comData from "@/utils/data.js";
export default {
  name: "Home",
  mixins: [GetUserInfo],
  inject: ["$main"],
  data() {
    return {
      userInfo: "", // 用户信息
      ben: "", // 个人资料
      ap: "",
      cp: "",
      rp: "",
      prevTime: "", // 上次登录时间
      userId: "", // 用户id
      mt4Img: "" // 用户图片
    };
  },
  components: {
    EchartOne,
    EchartTow,
    ProductList
  },
  mounted: function() {
    this.fnInit();
  },
  methods: {
    testType() {
      let vm = this;
      let dept = 11;
      if (!!window.localStorage.getItem("userInfo")) {
        dept = JSON.parse(window.localStorage.getItem("userInfo")).dept;
      }
      if(dept == 21&&comData.os_type == 2){
        return false;
      }else{
        return true;
      }
    },
    changeUrl: function(url) {
      let vm = this;
      vm.$router.push(comData.conutry_type + url);
    },
    fnInit: function() {
      let vm = this;
      // 获取用户基础信息
      vm.$api.IBM_UTILS_INFO().then(res => {
        vm.userInfo = res.data;
        vm.ap = res.data.ap;
        vm.cp = res.data.cp;
        vm.rp = res.data.rp;
        vm.userId = res.data.userId;
      });
      // 获取用户资产信息
      vm.$main.loading = true;
      vm.$api.IBM_HOME_PERSONALASSETS().then(res => {
        vm.prevTime = res.data.date;
        vm.mt4Img = res.data.mt4.icon;
        vm.$main.loading = false;
      });
      // 获取个人资料
      vm.$api.IBM_HOME_TJT().then(res => {
        vm.ben = res.data.ben;
        // vm.$main.loading = false;
      });
    }
  }
};
</script>

<style lang="scss">
.filter-charts {
  border: 1px solid rgba(155, 155, 155, 0.2);
}
.col-item {
  padding: 0.12rem;
}
.wallet-item {
  padding-right: 0.1rem;
  height: 1.94rem;
  @media screen and (max-width: 700px) {
    padding-right: 0px;
    margin-bottom: 0.2rem;
  }
  .register {
    background-image: url("../../../../static/image/home_1.png");
  }
  .electron {
    background-image: url("../../../../static/image/home_1.png");
  }
  .cash {
    background-image: url("../../../../static/image/home_1.png");
  }
  .item {
    width: 100%;
    height: 100%;
    background-size: cover;
    position: relative;
    border-radius: 0.2rem;
    box-shadow: 0px 1px 5px 0px rgba(126, 126, 126, 0.3);
    .text-box {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      // color: #fff;
      // height: 1rem;
      // position: absolute;
      // width: 100%;
      // top: 50%;
      // left: 0px;
      // transform: translateY(-50%);
      // padding-left: .21rem;
      height: 100%;
      p:nth-of-type(1) {
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.18rem;
        font-weight: bold;
        color: #353535;
        font-family: MicrosoftYaHeiUI-Bold;
      }
      p:nth-of-type(2) {
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: 0.32rem;
        font-weight: bold;
        color: #eb392e;
      }
    }
  }
}
.wallet-item:last-child {
  padding: 0px;
}
.capital-item {
  height: 1.94rem;
  // border: .02rem solid rgba(0,73,148,1);
  // padding: .31rem .21rem .2rem .2rem;
  // background: red;
  // background: url('../../../../static/image/home_2.png') no-repeat;
  box-shadow: 0px 1px 5px 0px rgba(126, 126, 126, 0.3);
  border-radius: 0.2rem;
  background: rgba(255, 255, 255, 0.9);
  background-size: cover;
  .capital-box {
    // padding-bottom: .42rem .2rem .42rem .2rem;
    // height: 100%;
    height: 1.44rem;
    display: flex;
    flex: wrap;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
}
.item-box1 {
  position: relative;
  .title {
    text-align: center;
    height: 0.5rem;
    line-height: 0.5rem;
    z-index: 999;
    font-size: 0.16rem;
    color: #353535;
    .left_box {
      position: absolute;
      width: 0.06rem;
      height: 0.2rem;
      left: 0px;
      top: 0px;
    }
    .right_box {
      position: absolute;
      width: 0.06rem;
      height: 0.2rem;
      right: 0px;
      top: 0px;
    }
  }
  .content {
    // background: rgb(9,16,55);
    // background: rgba(255,255,255,0.95)!important;
    // box-shadow:0px 17px 67px 0px rgba(83,93,113,0.06);
  }
}
.item-box {
  position: relative;
  .title {
    height: 0.2rem;
    padding: 0 0.11rem;
    position: absolute;
    z-index: 999;
    top: -0.1rem;
    left: 50%;
    transform: translateX(-50%);
    line-height: 0.2rem;
    font-size: 0.18rem;
    // border-left: 2px solid rgba(0,73,148,1);
    // border-right: 2px solid rgba(0,73,148,1);
    background: #f8f8f8 !important;
    color: rgba(0, 73, 148, 1);
    .left_box {
      position: absolute;
      width: 0.06rem;
      height: 0.2rem;
      left: 0px;
      top: 0px;
    }
    .right_box {
      position: absolute;
      width: 0.06rem;
      height: 0.2rem;
      right: 0px;
      top: 0px;
    }
  }
  .content {
    // background: rgb(9, 16, 55);
    background: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0px 17px 67px 0px rgba(83, 93, 113, 0.06);
  }
}
.personal-item {
  // min-height: 3.79rem;
  border: 0.02rem solid rgba(0, 73, 148, 1);
  // padding: 0.31rem 0.21rem 0.2rem 0.2rem;
  .personal-box {
    .personal-wrap {
      height: 3.24rem;
      @media screen and (max-width: 700px) {
        height: 2.5rem;
      }
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .meal_icon {
        height: 1.33rem;
        img {
          display: block;
          height: 100%;
        }
      }
      .meal_div {
        margin-top: 0.41rem;
        width: 90%;
        background: #eeeeee;
        text-align: center;
        padding-top: 0.1rem;
        padding-bottom: 0.2rem;
        div {
          padding-bottom: 0.24rem;
        }
      }
    }
    .personal-box-2 {
      height: 3.28rem;
    }
  }
}
.mt4-item {
  border-radius: 0.2rem;
  box-shadow: 0px 1px 5px 0px rgba(126, 126, 126, 0.3);
  background: rgba(255, 255, 255, 0.9);
  .personal-box {
    .personal-style {
      height: 3.24rem;
      /* @media screen and (max-width: 700px) {
        height: 3.24rem;
      }; */
    }
    .mt4-style {
      height: 3.24rem;
      @media screen and (max-width: 700px) {
        height: 2.5rem;
      }
    }
    .personal-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .meal_icon {
        height: 1.33rem;
        img {
          display: block;
          height: 100%;
        }
      }
      .meal_div {
        margin-top: 0.41rem;
        width: 90%;
        background: #eeeeee;
        text-align: center;
        padding-top: 0.1rem;
        padding-bottom: 0.2rem;
        div {
          padding-bottom: 0.24rem;
        }
      }
    }
    .personal-box-2 {
      height: 3.28rem;
    }
  }
}
.userInfo-item {
  background: url("../../../../static/image/home_3.png") no-repeat;
  background-size: cover;
  box-shadow: 0px 1px 5px 0px rgba(126, 126, 126, 0.3);
  border-radius: 0.2rem;
  .title {
    color: #fff;
  }
  .userInfo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 3.24rem;
    .userInfo-img {
      width: 1.24rem;
      height: 1.24rem;
      img {
        display: block;
        height: 100%;
      }
    }
    .title1 {
      padding-top: 0.21rem;
      font-size: 0.18rem;
      font-weight: bold;
      color: #fff;
      font-family: SourceHanSansCN-Medium;
    }
    .title2 {
      padding-top: 0.29rem;
      font-size: 0.14rem;
      font-weight: 500;
      color: #fff;
    }
  }
}
.profit-item {
  height: 3.79rem;
  // padding: 0.31rem 0.21rem 0.2rem 0.2rem;
  border: 0.02rem solid rgba(50, 168, 238, 0.3);
  .profit-box {
    height: 100%;
  }
}
.product-item {
  border-radius: 0.2rem;
  box-shadow: 0px 1px 5px 0px rgba(126, 126, 126, 0.3);
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  // padding: 0.31rem 0.21rem 0.2rem 0.2rem;
  .profit-box {
    height: 100%;
  }
}
.mime-item {
  height: 3.79rem;
  // padding: 0.31rem 0.21rem 0.2rem 0.2rem;
  border: 0.02rem solid rgba(50, 168, 238, 0.3);
  .mime-box {
    height: 100%;
    .content-top {
      overflow: hidden;
      background: rgb(13, 23, 67);
      p {
        width: 25%;
        text-align: center;
        float: left;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.16rem;
        font-weight: 400;
        color: rgba(137, 155, 196, 1);
      }
    }
    .content-bottom {
      .bottom-img {
        margin: 0 auto;
        margin-top: 0.57rem;
        width: 1.17rem;
        height: 1.33rem;
        img {
          display: block;
          height: 100%;
        }
      }
    }
  }
}
</style>
