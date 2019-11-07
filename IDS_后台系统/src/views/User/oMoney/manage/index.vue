<template>
  <transition name="fade">
    <div class="inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <!-- 账户出金 -->
        <div class="item_title">{{ $t('user.withdraw') }}</div>
        <div class="item_box">
          <div class="item_list_box">
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
                :lg="8"
                :xl="6"
              >
                <div class="aItem" :class="item.type" @click="fnChangeType(item.type)">
                  <div class="right_icon" :class="currency==item.type?'active':''">
                    <div class="right_icon_inner"></div>
                  </div>
                  <p>
                    <i :class="item.icon"></i>
                    {{ item.name }}
                  </p>
                  <p>${{ item.money|FORMATTED_NUMBER }}</p>
                </div>
              </el-col>
            </el-row>
            <!-- 表单 -->
            <div class="pay_form_box">
              <el-form
                :model="ruleForm"
                ref="ruleForm"
                :label-position="screenSize == 1?'left':'top'"
                label-width="1.6rem"
                class="item_form"
              >
                <!-- 提现金额（USD） -->
                <el-form-item :label="$t('withdraw.withdraw_money')+'（USD）'">
                  <el-input-number
                    :min="105"
                    v-model="ruleForm.money"
                    :placeholder="$t('withdraw.withdraw_money')"
                  ></el-input-number>
                </el-form-item>
                <!-- 提币类型 -->
                <el-form-item :label="$t('withdraw.sel_bit')">
                  <!-- 请选择 -->
                  <el-select
                    v-model="ruleForm.receiptType"
                    @change="fnGetMoney"
                    :placeholder="$t('select.placeholder')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 银行卡 -->
                <el-form-item :label="$t('withdraw.sel_bank')" v-if="ruleForm.receiptType == 4">
                  <!-- 请选择 -->
                  <el-select
                    v-model="ruleForm.bankId"
                    @change="fnGetMoney"
                    :placeholder="$t('withdraw.sel_bank')"
                  >
                    <el-option
                      v-for="item in bankList"
                      :key="item.id"
                      :label="`${item.bankNum}  ${item.bankName}  ${item.name}`"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- 获得的金额 -->
                <el-form-item
                  :label="$t('bank_card_edit.get_money')"
                  v-if="ruleForm.receiptType!=4"
                >
                  <div>{{ coinNum }} {{ ruleForm.receiptType == 1?'BTC':ruleForm.receiptType == 2?'ETH':ruleForm.receiptType == 3?'USDT':'CNY' }}</div>
                </el-form-item>
                <el-form-item label>
                  <el-button
                    :disabled="!!flag?false:true"
                    type="success"
                    @click="submitForm('ruleForm')"
                  >{{ $t('login.forget_btn') }}</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- 提示语 -->
            <div class="alertText">
              <!-- 出金说明 -->
              <p>{{ $t('withdraw.tips_tit') }}</p>
              <!--  账户出金要求最低100美元起； -->
              <p>1. {{ $t('withdraw.tips1') }}</p>
              <!-- 出金需在周一至周五进行提交申请，到账时间T+3。 -->
              <p>2. {{ $t('withdraw.tips4') }}</p>
              <!-- 出金需在周一至周五进行提交申请，到账时间T+3。 -->
              <p>3. {{ $t('withdraw.tips3') }}</p>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </transition>
</template>

<script>
import WatchScreen from "@/mixins/watchScreen.js";
import GetUserInfo from "@/mixins/getUserInfo.js";
import GetCode from "@/components/GetCode";
import MyValidate from "@/mixins/myValidate.js";
import floatNumber from "@/utils/floatNumber.js";
import comData from "@/utils/data.js";
import MessageBox from "@/mixins/messageBox.js";
export default {
  name: "oMoney_manage",
  mixins: [WatchScreen, GetUserInfo, MyValidate, MessageBox],
  components: {
    GetCode
  },
  inject: ["$main"],
  data() {
    return {
      bankList: [],
      flag: true,
      exchangeRate: "",
      rate: "",
      rmb_rate: "",
      user: {
        mobile: "" // 手机号码
      },
      ruleForm: {
        money: "", // 提现金额
        // strCode: "", // 验证码
        receiptType: 1,
        bankId: "" // 银行卡ID
      },
      rules: {
        // 请输入验证码
        /* strCode: [
          {
            required: true,
            message: "transaction_pass.resetPassErrInfo.beforeCode",
            trigger: "blur"
          }
        ] */
      },
      options: [
        {
          value: 1,
          label: "BTC"
        },
        {
          value: 2,
          label: "ETH"
        },
        {
          value: 3,
          label: "USDT"
        },
        {
          value: 4,
          label: "CNY"
        }
      ],
      currencyList: [
        
        {
          type: "cp",
          name: this.$t('wallet.cash'), // 现金钱包
          money: ""
        },
        {
          type: "ap",
          name: this.$t('wallet.ele'), // 电子钱包
          money: ""
        },
        /* {
          type: "rp",
          name: this.$t('wallet.reg'), // 注册钱包
          money: ""
        } */
      ],
      currency: "cp",
      rate: "", // 汇率
      uuid: "",
      AP: 0
    };
  },
  computed: {
    coinNum: function() {
      let rate;
      if (this.ruleForm.receiptType == 4) {
        rate = this.rmb_rate;
        return floatNumber.divide(this.ruleForm.money, 1 / rate, 4);
      } else {
        rate = this.rate;
        return floatNumber.multiply(this.ruleForm.money, 1 / rate, 4);
      }
    }
  },
  mounted: function() {
    let vm = this;
    vm.fnTypeList();
    vm.fnGetRate();
    let dept = 11;
    if (!!window.localStorage.getItem("userInfo")) {
      dept = JSON.parse(window.localStorage.getItem("userInfo")).dept;
    }
    if (comData.os_type == 2 && dept == 21) {
      // 去掉电子钱包
      vm.currencyList = [
        {
          type: "cp",
          name: this.$t("wallet.cash"), // 现金钱包
          money: "",
          icon: "el-icon-wallet"
        }
      ];
    }
    vm.fnGetList();
    vm.fnInit();
    vm.fnExchangeRate();
  },
  methods: {
    // 根据dept配置不同的选项
    fnTypeList() {
      let vm = this;
      let dept = 11;
      if (!!window.localStorage.getItem("userInfo")) {
        dept = JSON.parse(window.localStorage.getItem("userInfo")).dept;
      }
      if (dept == 21) {
        vm.options = [
          {
            value: 1,
            label: "BTC"
          },
          {
            value: 2,
            label: "ETH"
          },
          {
            value: 3,
            label: "USDT"
          }
        ];
      }
    },
    // 查询客户银行卡
    fnGetList() {
      let vm = this;
      vm.$api.IDS_BANK_SELECT().then(res => {
        console.log(res);
        vm.bankList = res.data;
      });
    },
    // 人民币兑换美元汇率
    fnGetRate() {
      let vm = this;
      vm.$api.IDS_RATE_RATE().then(res => {
        vm.rmb_rate = res.data;
        console.log(vm.rmb_rate, 333);
      });
    },
    // 二级密码验证
    fnPassAgain() {
      let vm = this;
      return new Promise(function(resolve, reject) {
        vm.$prompt(
          vm.$t("system_container.please_two_pass"),
          vm.$t("system_container.tips"),
          {
            confirmButtonText: vm.$t("system_container.ok"), // 确定
            cancelButtonText: vm.$t("system_container.no"), // 取消
            inputType: "password",
            center: true,
            confirmButtonClass: "newClass",
            inputPlaceholder: vm.$t("system_container.please_two_pass"),
            showCancelButton: false
          }
        )
          .then(({ value }) => {
            vm.$main.loading = true;
            // 驳回
            vm.$api
              .IBM_UTILS_SECURITYPASSWORD({
                securityPassword: value
              })
              .then(res => {
                if (res.code == 0) {
                  // 表单提交
                  resolve(res.code);
                } else {
                  vm.$main.loading = false;
                  vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
                  reject(res.code);
                }
              });
          })
          .catch(() => {});
      });
    },
    fnChangeType(type) {
      let vm = this;
      vm.currency = type;
      vm.fnMoney();
    },
    // 计算汇率
    fnGetMoney() {
      let vm = this;
      let rateName =
        vm.ruleForm.receiptType == 1
          ? "BTCUSD"
          : vm.ruleForm.receiptType == 2
          ? "ETHUSD"
          : "USDT";
      vm.exchangeRate.forEach((item, index) => {
        if (rateName == "USDT") {
          vm.rate = 1;
        } else {
          if (item.symbol == rateName) {
            vm.rate = item.price;
          }
        }
      });
    },
    // 获取汇率
    fnExchangeRate() {
      let vm = this;
      vm.$api
        .EXRATE_PAIR_NUMF_15()
        .then(res => {
          vm.exchangeRate = res;
        })
        .then(() => {
          vm.fnGetMoney();
        });
    },
    fnInit() {
      let vm = this;
      // 获取用户信息
      vm.$main.loading = true;
      vm.fnGetNewInfo().then(res => {
        vm.$main.loading = false;
        vm.user.mobile = res.mobile;
        for (var i = 0, item; (item = vm.currencyList[i++]); ) {
          item.money = res[item.type];
        }
        vm.fnMoney();
      });
    },
    fnMoney() {
      let vm = this;
      vm.currencyList.forEach((item, index) => {
        if (item.type == vm.currency) {
          if (item.money >= 100) {
            vm.flag = true;
          } else {
            // 可提现金额不足
            vm.flag = false;
          }
        }
      });
    },
    // 表单提交
    submitForm(formName) {
      let vm = this;
      let params;
      // 判断提现金额是否足够
      let flag = true;
      vm.currencyList.forEach((item, index) => {
        if (item.type == vm.currency) {
          if (item.money >= 100) {
          } else {
            // 可提现金额不足
            vm.fnOpenMessageBox(vm.$t(`errCode.8001`), "error");
            flag = false;
          }
        }
      });
      if (!!!flag) {
        return false;
      }
      vm.myValidate(formName).then(err => {
        if (!!!err) {
          vm.fnPassAgain().then(code => {
            if (code == 0) {
              params = {
                money: vm.ruleForm.money,
                bankId: vm.ruleForm.bankId,
                type: vm.currency == "ap" ? 1 : vm.currency == "cp" ? 2 : 3,
                getGoldType:
                  vm.ruleForm.receiptType == 1
                    ? 11
                    : vm.ruleForm.receiptType == 2
                    ? 12
                    : vm.ruleForm.receiptType == 3
                    ? 13
                    : 1
                // strCode: vm.ruleForm.strCode
              };
              vm.$api.IBM_WITHDRAW_GETGOLD(params).then(res => {
                vm.$main.loading = false;
                if (res.code == 0) {
                  vm.fnOpenMessageBox(
                    vm.$t("withdraw.withdrawalErrInfo.success"),
                    "success"
                  );
                  vm.$router.push(comData.conutry_type + "/user/home");
                } else {
                  vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
                }
              });
            }
          });
        } else {
          vm.fnOpenMessageBox(err, "error");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.paylist1 {
  .col-item {
    padding: 0.12rem;
    .aItem {
      box-shadow: 0px 2px 9px 0px rgba(126, 126, 126, 0.3);
      height: 1.84rem;
      margin: 0 auto;
      border-radius: 0.15rem;
      background: linear-gradient(
        216deg,
        rgba(49, 36, 130, 1) 0%,
        rgba(79, 70, 131, 1) 100%
      );
      cursor: pointer;
      .right_icon {
        position: absolute;
        right: 13px;
        top: 13px;
        display: none;
        width: 22px;
        height: 22px;
        border: 1px solid rgba(32, 53, 119, 1);
        border-radius: 50%;
        .right_icon_inner {
          width: 14px;
          height: 14px;
          background: #ffba00;
          border-radius: 50%;
          margin: 0 auto;
          margin-top: 3px;
        }
      }
      position: relative;
      @media screen and (max-width: 748px) {
        width: auto;
      }
    }
    .aItem p:nth-of-type(1) {
      padding-top: 0.53rem;
      font-size: 0.18rem;
      font-weight: bold;
      padding-left: 0.4rem;
      text-align: center;
      font-family: MicrosoftYaHeiUI-Bold;
    }
    .aItem p:nth-of-type(2) {
      font-size: 0.32rem;
      padding-top: 0.23rem;
      font-weight: bold;
      padding-left: 0.4rem;
      text-align: center;
      color: #f15a19;
    }
    .cp {
      background: url("../../../../../static/image/home_1.png") no-repeat;
      background-size: cover;
      .active {
        display: block;
      }
    }
    .ap {
      background: url("../../../../../static/image/home_1.png") no-repeat;
      background-size: cover;
      .active {
        display: block;
      }
    }
    .rp {
      background: url("../../../../../static/image/home_1.png") no-repeat;
      background-size: cover;
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
  line-height: 0.36rem;
}
</style>
