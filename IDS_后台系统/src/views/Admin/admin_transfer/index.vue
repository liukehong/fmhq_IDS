<template>
  <transition name="fade">
    <div class="admin_transfer inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <!-- 财务转账 -->
        <div class="item_title">{{ $t('asset_transfer.asset_transfer') }}</div>
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
                    v-model="ruleForm.user_id"
                  ></el-input>
                </el-form-item>
                <!-- 转入用户名 -->
                <el-form-item :label="$t('asset_transfer.trans_in_name')">
                  <span v-show="toUserName" style="padding-right: 10px;">{{ toUserName }}</span>
                  <!-- 查询 -->
                  <el-button @click="fnFinduserName">{{ $t('asset_transfer.query') }}</el-button>
                </el-form-item>
                <!-- 转账金额 -->
                <el-form-item :label="$t('asset_transfer.transfer_money')" prop="money">
                  <el-input-number
                    v-model="ruleForm.money"
                    :label="$t('asset_transfer.transfer_money')"
                  ></el-input-number>
                </el-form-item>
                <!-- 中文备注 -->
                <el-form-item :label="$t('asset_transfer.describe_cn')">
                  <el-input
                    :placeholder="$t('asset_transfer.describe_cn')"
                    v-model="ruleForm.translate"
                  ></el-input>
                </el-form-item>
                <!-- 英文备注 -->
                <el-form-item :label="$t('asset_transfer.describe_en')">
                  <el-input
                    :placeholder="$t('asset_transfer.describe_en')"
                    v-model="ruleForm.translateEnglish"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <!-- 提交 -->
                  <el-button
                    type="success"
                    @click="submitForm('ruleForm')"
                  >{{ $t('common.submit') }}</el-button>
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
import MyValidate from "@/mixins/myValidate.js";
import MessageBox from "@/mixins/messageBox.js";
import comData from "@/utils/data.js";
export default {
  name: "admin_transfer",
  mixins: [WatchScreen, GetUserInfo, MyValidate, MessageBox],
  inject: ["$main"],
  data() {
    return {
      walletType: "rp",
      user: {
        mobile: "" // 手机号
      },
      toUserName: "",
      ruleForm: {
        user_id: "", //转账人id
        money: "", // 转账金额
        translate: "", // 中文备注
        translateEnglish: "" // 英文备注
      },
      rules: {
        money: [
          // 请输入转账金额
          {
            type: "number",
            required: true,
            message: "asset_allocation.allocationErrInfo.transfer_money",
            trigger: "blur"
          }
        ]
      },
      walletTypeList: [
        // 注册钱包
        {
          type: "rp",
          name: this.$t("wallet.reg"),
          money: "",
          icon: "el-icon-money"
        },
        // 现金钱包
        {
          type: "cp",
          name: this.$t("wallet.cash"),
          money: "",
          icon: "el-icon-wallet"
        },
        // 电子钱包
        {
          type: "ap",
          name: this.$t("wallet.ele"),
          money: "",
          icon: "el-icon-coin"
        }
      ]
    };
  },
  components: {},
  computed: {},
  created: function() {
    let vm = this;
    vm.fnInit();
  },
  methods: {
    // 根据id查询用户名
    fnFinduserName() {
      let vm = this;
      vm.$main.loading = true;
      vm.$api
        .IBM_USER_USERNAMECOMPLETION({
          str: vm.ruleForm.user_id
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
      // 查询钱包信息
      vm.$main.loading = true;
      vm.$api.IBM_MAT_ASSETS().then(res => {
        vm.$main.loading = false;
        if (res.code == 0) {
          for (var i = 0, item; (item = vm.walletTypeList[i++]); ) {
            item.money = res.data[item.type];
          }
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
      let params;
      vm.myValidate(formName).then(err => {
        if (!!!err) {
          vm.fnPassAgain()
            .then(code => {
              if (code == 0) {
                params = Object.assign({}, vm.ruleForm, {
                  type:
                    vm.walletType == "cp" ? 1 : vm.walletType == "ap" ? 2 : 3
                });
                vm.$api.IBM_ADMIN_TRANSFER(params).then(res => {
                  vm.$main.loading = false;
                  if (res.code == 0) {
                    vm.fnOpenMessageBox(
                      vm.$t("asset_allocation.allocationErrInfo.success"),
                      "success"
                    );
                    vm.$router.push(comData.conutry_type + "/admin/admin_home");
                    vm.fnInit();
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
.admin_transfer {
  .paylist1 {
    .col-item {
      padding: 0.12rem;
      .aItem {
        box-shadow: 0px 2px 9px 0px rgba(126, 126, 126, 0.3);
        background-size: cover;
        background-repeat: no-repeat;
        height: 1.84rem;
        margin: 0 auto;
        border-radius: 0.15rem;
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
        background: url("../../../../static/image/home_1.png") no-repeat;
        background-size: cover;
        .active {
          display: block;
        }
      }
      .cp {
        background: url("../../../../static/image/home_1.png") no-repeat;
        background-size: cover;
        .active {
          display: block;
        }
      }
      .ap {
        background: url("../../../../static/image/home_1.png") no-repeat;
        background-size: cover;
        .active {
          display: block;
        }
      }
    }
  }
}
</style>
