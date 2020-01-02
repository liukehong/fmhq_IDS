<template>
  <transition name="fade">
    <div class="inner_wrap" v-loading="loading" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <div class="form_box" style="opacity: 0;">
          <form
            action="https://otc.globalokpaytech.com/pay/toConfirmIn"
            method="post"
            name="gatewayForm"
          >
            <input type="hidden" name="crmNo" v-model="formData.crmNo" />
            <input type="hidden" name="customerId" v-model="formData.customerId" />
            <input type="hidden" name="orderAmount" v-model="formData.orderAmount" />
            <input type="hidden" name="orderCurrency" v-model="formData.orderCurrency" />
            <input type="hidden" name="orderNo" v-model="formData.orderNo" />
            <input type="hidden" name="pickupUrl" v-model="formData.pickupUrl" />
            <input type="hidden" name="receiveUrl" v-model="formData.receiveUrl" />
            <input type="hidden" name="sign" v-model="formData.sign" />
            <input type="hidden" name="signType" v-model="formData.signType" />
          </form>
        </div>
        <!-- 账户入金 -->
        <div class="item_title">{{ $t('user.recharge') }}</div>
        <div class="item_box">
          <div class="item_list_box">
            <!-- 支付方式 -->
            <div style="font-size: .14rem;">{{ $t('recharge.payment') }}：</div>
            <!-- 币种类型 -->
            <el-row class="paylist1">
              <el-col
                v-for="item in currencyList"
                :key="item.type"
                class="col-item"
                :span="24"
                :xs="24"
                :sm="24"
                :md="12"
                :lg="7"
                :xl="5"
              >
                <div
                  class="aItem"
                  :class="[item.type,currency==item.type?'border_acitve':'']"
                  @click="fnGetRate(item.type)"
                >
                  <div class="right_icon" :class="currency==item.type?'active':''"></div>
                  <!-- <p>{{ item.name }}</p>
                  <p>{{ item.type == 'btc'?'Bitcoin':item.type == 'eth'?'Ether':'USDT' }}</p>-->
                  <div class="img_box">
                    <img :src="`../../../../../static/image/coin${item.type}.png`" alt />
                  </div>
                  <div class="img_text">
                    <div class="text1">{{ item.name }}</div>
                    <div
                      class="text2"
                    >{{ item.type == 'btc'?'Bitcoin':item.type == 'eth'?'Ether':'USDT(Omni Layer)' }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 表单 -->
            <div class="pay_form_box">
              <el-form
                :label-position="screenSize == 1?'left':'top'"
                label-width="1.6rem"
                class="item_form"
              >
                <!-- dept==21  currency==usdt -->
                <el-form-item :label="$t('other.text1')+'：'" v-if="dept != 11&&currency == 'usdt'">
                  <!-- 支付通道 -->
                  <el-select v-model="payType" :placeholder="$t('select.placeholder')">
                    <el-option :label="$t('other.text2')" :value="1"></el-option>
                    <el-option :label="$t('other.text3')" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="textChange()">
                  <!-- 请选择美元金额 -->
                  <el-select v-model="value" :placeholder="$t('select.placeholder')">
                    <el-option v-for="item in list" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <!-- 您需要支付USD -->
                <el-form-item :label="$t('recharge.need_pay')+' USD'+'：'">
                  <div>{{ usd_val }}</div>
                </el-form-item>
                <!-- 需要支付-->
                <el-form-item v-if="!!currency" :label="myCyrrency">
                  <div>{{ coin_val }}</div>
                </el-form-item>
              </el-form>
              <!-- 提交购买申请 -->
              <el-button
                style="margin-bottom: .45rem;"
                type="success"
                @click="submitForm"
              >{{ $t('recharge.buy_btn') }}</el-button>
            </div>
            <!-- 提示语 -->
            <div class="alertText">
              <!-- 入金说明 -->
              <p>{{ $t('recharge.tips_tit') }}</p>
              <!-- 入金将产生3%的金流通道手续费，将由全球各银行网关及支付通道收取。 -->
              <p>1.{{ $t('recharge.tips2') }}</p>
              <!-- 请务必在2分钟内完成支付，且每个支付二维码地址仅限使用一次，超时或多次支付请刷新重新获取二维码地址。 -->
              <p>2.{{ $t('recharge.tips3') }}</p>
            </div>
          </div>
        </div>
        <el-dialog
          center
          :modal-append-to-body="false"
          :title="usd_val+' USD'"
          :visible.sync="dialogVisible"
          :width="screenSize == 1?'20%':'90%'"
        >
          <div class="imgBox">
            <img :src="resData.qrcodeUrl" alt />
          </div>
          <!-- 将指定的数量发送到下面的地址 -->
          <div class="textBox">{{ $t('recharge.pay_addr') }}</div>
          <div class="coinType">{{ currency|UPPER_CASE }}</div>
          <div class="coinNum">{{ resData.tradingMoney }}</div>
          <!-- <div class="urlBox">
                {{ resData.address }}
          </div>-->
          <!-- 请输入内容 -->
          <el-input :readonly="true" class="urlBox" v-model="resData.address">
            <!-- 复制 -->
            <el-button @click="fnDoCopy" slot="append">{{ $t('common.copy.copy') }}</el-button>
          </el-input>
          <span slot="footer" class="dialog-footer"></span>
        </el-dialog>
      </el-scrollbar>
    </div>
  </transition>
</template>

<script>
import WatchScreen from "@/mixins/watchScreen.js";
import floatNumber from "@/utils/floatNumber.js";
import MessageBox from "@/mixins/messageBox.js";
import comData from "@/utils/data.js";
import Axios from "axios";
export default {
  name: "eMoney_manage",
  mixins: [WatchScreen, MessageBox],
  inject: ["$main"],
  computed: {
    usd_val: function() {
      return this.value * (1 + 0.01);
    },
    coin_val: function() {
      if (this.dept != 11 && this.currency == "usdt" && this.payType == 2) {
        return floatNumber.multiply(this.value * (1 + 0.01), this.usd_rate, 4);
      } else {
        return floatNumber.multiply(this.value * (1 + 0.01), 1 / this.rate, 4);
      }
    },
    myCyrrency: function() {
      let vm = this;
      let val = vm.currency.toUpperCase();
      // vm.dept == 21 && vm.currency == "usdt" && vm.payType == 2
      if (this.dept != 11 && vm.currency == "usdt" && vm.payType == 2) {
        return vm.$t("recharge.need_pay") + " " + "CNY" + "：";
      } else {
        return vm.$t("recharge.need_pay") + " " + val + "：";
      }
    }
  },
  data() {
    return {
      usd_rate: "",
      formData: "",
      dept: "",
      payType: 1, // 通道1  通道2
      resData: "",
      loading: false,
      dialogVisible: false,
      list: [
        100,
        200,
        300,
        1000,
        2000,
        3000,
        4000,
        5000,
        6000,
        7000,
        8000,
        9000,
        10000,
        20000,
        30000,
        40000,
        50000,
        60000,
        70000,
        80000,
        90000,
        100000
      ],
      value: "100",
      exchangeRate: "", // 汇率
      currencyList: [
        {
          type: "btc",
          name: this.$t("recharge.payList.btc") // 比特币
        },
        {
          type: "eth",
          name: this.$t("recharge.payList.eth") // 以太坊
        },
        {
          type: "usdt",
          name: this.$t("recharge.payList.usdt") // 泰达币
        }
      ],
      // currency: 'btc',
      currency: "",
      rate: "", // 汇率
      rmbRate: "", // 人民币汇率
      uuid: "",
      AP: 0
    };
  },
  mounted: function() {
    let vm = this;
    if (!!window.localStorage.getItem("userInfo")) {
      vm.dept = JSON.parse(window.localStorage.getItem("userInfo")).dept;
    }
    vm.fnGetRateNum();
    vm.fnExchangeRate(); // 获取汇率
    vm.fnGetRMBRate(); // 获取汇率
    // vm.fnGetThree();
  },
  methods: {
    fnGetRateNum() {
      let vm = this;
      vm.$api
        .IDS_RATE_RATE()
        .then(res => {
          vm.usd_rate = res.data;
          console.log(vm.usd_rate, 344);
        })
        .catch(err => {
          console.log(err);
        });
    },
    textChange() {
      let vm = this;
      // $t('recharge.input_num')+'：'
      // dept == 21&&currency == 'usdt'
      if (vm.dept != 11 && vm.currency == "usdt") {
        // return vm.$t('recharge.input_num1');
        return vm.$t("recharge.input_num");
      } else {
        return vm.$t("recharge.input_num");
      }
    },
    // 请求第三方接口
    fnGetThree(data) {
      let vm = this;
      vm.formData = data;
      console.log(vm.formData);
      setTimeout(function() {
        document.gatewayForm.submit();
      }, 500);
    },
    // 复制
    fnDoCopy() {
      let vm = this;
      vm.$copyText(vm.resData.address).then(
        function(res) {
          vm.fnOpenMessageBox(vm.$t("common.copy.yes"), "success");
        },
        function(err) {
          vm.fnOpenMessageBox(vm.$t("common.copy.no"), "error");
        }
      );
    },
    // 获取人民币汇率
    fnGetRMBRate() {
      let vm = this;
      vm.$api.IBM_RATE_RATE().then(res => {
        vm.rmbRate = res.data;
      });
    },
    // 获取汇率
    fnExchangeRate() {
      let vm = this;
      vm.$main.loading = true;
      vm.$api
        .EXRATE_PAIR_NUMF_15()
        .then(res => {
          vm.$main.loading = false;
          vm.exchangeRate = res;
        })
        .then(() => {
          vm.fnGetRate(vm.currency);
        });
    },
    // 购买数量的变化
    handleChange(val) {
      let vm = this;
    },
    // 类型变换
    fnGetRate(type) {
      let vm = this;
      vm.payType = 1;
      vm.currency = type; // 点击的类型
      let name = type == "btc" ? "BTCUSD" : type == "eth" ? "ETHUSD" : "USDT";
      vm.exchangeRate.forEach((item, index) => {
        if (name == "USDT") {
          vm.rate = 1;
        } else {
          if (item.symbol == name) {
            vm.rate = item.price;
          }
        }
      });
    },
    // 表单提交
    submitForm() {
      let vm = this;
      if (!!!vm.currency) {
        vm.fnOpenMessageBox(vm.$t("recharge.text1"), "error"); // 请选择数字货币种类
        return false;
      }
      vm.loading = true;
      let params;
      let pathName;
      let flag;
      if (vm.dept != 11 && vm.currency == "usdt" && vm.payType == 2) {
        pathName = "IDS_NEWTRA_MAT";
        params = {
          // orderAmount: vm.coin_val,
          orderAmount: floatNumber.multiply(vm.usd_val, vm.usd_rate, 4),
          type: comData.os_type == 1 ? 1 : 2,
          usd: vm.usd_val
        };
        flag = false;
      } else {
        pathName = "IBM_TRA_MAT";
        params = {
          usd: vm.usd_val, // 美元
          // rate: 6.75, // 汇率
          rate: "", // 汇率
          from: vm.currency.toUpperCase(), // 支付的币种
          to: vm.rate, // 该币种兑美元的汇率
          money: vm.coin_val // 支付的金额
        };
        flag = true;
      }
      vm.$api[pathName](params).then(res => {
        if (res.code == 0) {
          if (!!flag) {
            vm.dialogVisible = true;
            vm.resData = res.data;
          } else {
            // alert("请求第三方接口");
            console.log(JSON.parse(res.data));
            vm.fnGetThree(JSON.parse(res.data));
          }
        } else {
          vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
        }
        vm.loading = false;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.imgBox {
  height: 1.48rem;
  img {
    display: block;
    width: 1.48rem;
    height: 1.48rem;
    margin: 0 auto;
  }
}
.textBox {
  text-align: center;
  padding-top: 0.2rem;
}
.coinNum {
  text-align: center;
  padding-top: 0.1rem;
  font-weight: bold;
}

.urlBox {
  text-align: center;
  padding-top: 0.3rem;
}

.coinType {
  text-align: center;
  padding-top: 0.1rem;
  font-weight: bold;
}
.fade-enter {
  opacity: 0;
  transform: translateY(2rem);
}
.fade-enter-active {
  transition: all 0.8s;
}
.fade-leave {
  opacity: 0;
}
.border_acitve {
  border: 2px dotted #fff !important;
}
.paylist1 {
  .col-item {
    padding: 0.12rem;
    .aItem {
      // padding: 2px;
      border: 2px solid rgba(9, 16, 55, 0.9);
      width: 2.5rem;
      height: 1.16rem;
      text-align: center;
      cursor: pointer;
      margin: 0 auto;
      border-radius: 4px;
      position: relative;
      background-size: cover;
      overflow: hidden;
      background-position: left;
      .right_icon {
        width: 0.25rem;
        height: 0.2rem;
        position: absolute;
        top: 0px;
        right: 0px;
        background: url("../../../../image/golden_icon1.png");
        display: none;
      }
      .img_box {
        width: 0.53rem;
        height: 0.53rem;
        position: absolute;
        top: 0.315rem;
        left: 0.3rem;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .img_text {
        height: 0.6rem;
        width: 1.5rem;
        position: absolute;
        top: 0.28rem;
        left: 0.9rem;
        text-align: center;
        .text1 {
          font-size: 0.18rem;
          font-weight: bold;
          height: 0.3rem;
          line-height: 0.3rem;
        }
        .text2 {
          font-size: 0.16rem;
          font-weight: bold;
          height: 0.3rem;
          line-height: 0.3rem;
        }
      }
    }
    .aItem p:nth-of-type(1) {
      padding-top: 0.4rem;
      font-size: 0.18rem;
      font-weight: bold;
    }
    .aItem p:nth-of-type(2) {
      font-size: 0.16rem;
      font-weight: bold;
    }
    .btc {
      background-image: url("../../../../image/golden_bltcoln1.png");
      .active {
        display: block;
      }
    }
    .eth {
      background-image: url("../../../../image/golden_ether1.png");
      .active {
        display: block;
      }
    }
    .usdt {
      background-image: url("../../../../image/golden_usdt1.png");
      .active {
        display: block;
      }
    }
  }
}
.pay_form_box {
  margin-top: 0.5rem;
}
.alertText {
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 0.25rem;
}
</style>
