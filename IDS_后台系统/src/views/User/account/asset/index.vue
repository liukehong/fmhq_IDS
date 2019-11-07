<template>
  <transition name="fade">
    <div class="inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <!-- 财务转账 -->
        <div class="item_title">{{ $t('user.asset_transfer')}}</div>
        <div class="item_box">
          <div class="item_list_box">
            <!-- 币种类型 -->
            <el-row class="paylist1">
              <el-col
                v-for="item in walletTypeList"
                :key="item.type"
                class="col-item"
                :span="24"
                :xs="24"
                :sm="24"
                :md="12"
                :lg="8"
                :xl="8"
              >
                <div class="aItem" :class="item.type" @click="walletType = item.type">
                  <div class="right_icon" :class="walletType==item.type?'active':''">
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
                :label-position="screenSize == 1?'left':'top'"
                ref="ruleForm"
                label-width="1.6rem"
                class="demo-ruleForm item_form"
              >
                <!-- 转入账号ID -->
                <el-form-item :label="$t('asset_transfer.trans_in_user')">
                  <el-input
                    :placeholder="$t('asset_transfer.trans_in_user')"
                    v-model="ruleForm.username"
                  ></el-input>
                </el-form-item>
                <!-- 转入用户名 -->
                <el-form-item :label="$t('asset_transfer.trans_in_name')">
                  <!-- 查询 -->
                  <span v-show="toUserName" style="padding-right: 10px;">{{ toUserName }}</span>
                  <el-button @click="fnFinduserName">{{ $t('asset_transfer.query') }}</el-button>
                </el-form-item>
                <!-- 转账金额 -->
                <el-form-item :label="$t('asset_transfer.transfer_money')" prop="money">
                  <el-input-number
                    v-model="ruleForm.money"
                    :min="0"
                    :label="$t('asset_transfer.transfer_money')"
                  ></el-input-number>
                </el-form-item>
                <!-- 当前手机号 -->
                <!-- <el-form-item :label="$t('phone_manage.now_manage')">
                  <div>{{ ruleForm.mobile }}</div>
                </el-form-item> -->
                <!-- 验证码 -->
                <!-- <el-form-item :label="$t('transaction_pass.code')" prop="phoneCord">
                  <el-input :placeholder="$t('transaction_pass.code')" v-model="ruleForm.phoneCord">
                    <template slot="append">
                      <GetCode apiUrl="IBM_UTILS_MOBILECODE" :mobile="ruleForm.mobile"></GetCode>
                    </template>
                  </el-input>
                </el-form-item> -->
                <!-- 提交 -->
                <el-form-item>
                  <el-button
                    type="success"
                    @click="submitForm('ruleForm')"
                  >{{ $t('login.forget_btn') }}</el-button>
                </el-form-item>
              </el-form>
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
import comData from "@/utils/data.js";
import MessageBox from "@/mixins/messageBox.js";
export default {
  name: "account_asset",
  mixins: [WatchScreen, GetUserInfo, MyValidate, MessageBox],
  inject: ["$main"],
  data() {
    return {
      walletType: "rp",
      toUserName: "",
      ruleForm: {
        username: "", //转账人id
        money: "", // 转账金额
        // phoneCord: "", // 验证码
        mobile: "" // 手机号
      },
      rules: {
        /* username: [
          { required: true, message: "请输入转账人ID", trigger: "blur" }
        ], */
        money: [
          {
            type: "number",
            required: true,
            message: "asset_allocation.allocationErrInfo.transfer_money",
            trigger: "blur"
          } // 请先输入金额
        ],
        /* phoneCord: [
          {
            required: true,
            message: "transaction_pass.resetPassErrInfo.beforeCode",
            trigger: "blur"
          } // 请先输入验证码
        ] */
      },
      walletTypeList: [
        {
          type: "rp",
          name: this.$t("wallet.reg"), // 3 注册钱包
          money: "",
          icon: "el-icon-money"
        },
        {
          type: "cp",
          name: this.$t("wallet.cash"), // 1 现金钱包
          money: "",
          icon: "el-icon-wallet"
        },
        {
          type: "ap", // 2
          name: this.$t("wallet.ele"), // 电子钱包
          money: "",
          icon: "el-icon-coin"
        }
      ]
    };
  },
  components: {
    GetCode
  },
  computed: {},
  mounted: function() {
    let vm = this;
    let dept = 11;
    if (!!window.localStorage.getItem("userInfo")) {
      dept = JSON.parse(window.localStorage.getItem("userInfo")).dept;
    }
    // 阉割版并且dept 为21 时候 去掉电子钱包
    if(comData.os_type == 2&&dept == 21){
      vm.walletTypeList = [
        {
          type: "rp",
          name: this.$t("wallet.reg"), // 3 注册钱包
          money: "",
          icon: "el-icon-money"
        },
        {
          type: "cp",
          name: this.$t("wallet.cash"), // 1 现金钱包
          money: "",
          icon: "el-icon-wallet"
        },
      ];
    }
    vm.fnInit();
  },
  methods: {
    // 根据id查询用户名
    fnFinduserName() {
      let vm = this;
      vm.$main.loading = true;
      vm.$api
        .IBM_USER_USERNAMECOMPLETION({
          str: vm.ruleForm.username
        })
        .then(res => {
          vm.$main.loading = false;
          if (res.code == 0) {
            vm.toUserName = res.data.username;
          } else {
            vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
          }
        });
    },
    // 初始化
    fnInit() {
      let vm = this;
      // 获取用户信息
      vm.$main.loading = true;
      vm.fnGetNewInfo().then(res => {
        vm.$main.loading = false;
        vm.ruleForm.mobile = res.mobile;
        for (var i = 0, item; (item = vm.walletTypeList[i++]); ) {
          item.money = res[item.type];
        }
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
    // 表单提交
    submitForm(formName) {
      let vm = this;
      let params = Object.assign({}, vm.ruleForm, {
        type: vm.walletType == "cp" ? 1 : vm.walletType == "ap" ? 2 : 3
      });
      delete params.mobile;
      vm.myValidate(formName).then(err => {
        if (!!!err) {
          vm.fnPassAgain()
            .then(code => {
              if (code == 0) {
                vm.$api.IBM_HOME_TRANSFER(params).then(res => {
                  vm.$main.loading = false;
                  if (res.code == 0) {
                    vm.fnOpenMessageBox(
                      vm.$t("asset_allocation.allocationErrInfo.success"),
                      "success"
                    );
                    vm.$router.push(comData.conutry_type + "/user/home");
                    // vm.fnInit();
                  } else {
                    vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
                  }
                });
              }
            })
            .catch(err => []);
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
      // color: #fff;
      box-shadow: 0px 2px 9px 0px rgba(126, 126, 126, 0.3);
      background-size: cover;
      background-repeat: no-repeat;
      height: 1.84rem;
      margin: 0 auto;
      border-radius: 0.12rem;
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
    .rp {
      background: url("../../../../../static/image/home_1.png") no-repeat;
      background-size: cover;
      .active {
        display: block;
      }
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
  }
}
.pay_form_box {
  margin-top: 0.5rem;
}
.alertText {
  color: rgba(111, 142, 208, 1);
  font-size: 0.14rem;
  font-weight: 400;
  line-height: 0.36rem;
}
</style>
