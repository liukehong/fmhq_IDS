<template>
  <transition name="fade">
    <div class="inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
      <!-- 数字货币钱包 -->
      <div class="item_title">{{ $t('user.bit_address') }}</div>
      <div class="item_box">
        <div class="item_list_box">
          <el-form
            :model="ruleForm"
            :label-position="screenSize == 1?'left':'top'"
            ref="ruleForm"
            label-width="1.6rem"
            class="demo-ruleForm item_form"
          >
            <!-- BTC地址 -->
            <el-form-item :label="$t('personal_profile.btc_addr')">
              <el-input
                v-if="!!!btc"
                :placeholder="$t('personal_profile.btc_addr')"
                v-model="ruleForm.btc"
              ></el-input>
              <div v-if="!!btc">{{ ruleForm.btc == 'null'?'--':ruleForm.btc }}</div>
            </el-form-item>
            <!-- ETH地址 -->
            <el-form-item :label="$t('personal_profile.eth_addr')">
              <el-input
                v-if="!!!eth"
                :placeholder="$t('personal_profile.eth_addr')"
                v-model="ruleForm.eth"
              ></el-input>
              <div v-if="!!eth">{{ ruleForm.eth == 'null'?'--':ruleForm.eth }}</div>
            </el-form-item>
            <!-- USDT地址 -->
            <el-form-item :label="$t('personal_profile.usdt_addr')">
              <el-input
                v-if="!!!usdt"
                :placeholder="$t('personal_profile.usdt_addr')"
                v-model="ruleForm.usdt"
              ></el-input>
              <div v-if="!!usdt">{{ ruleForm.usdt == 'null'?'--':ruleForm.usdt }}</div>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item v-if="false" :label="$t('personal_profile.mobile')">
              <div>{{ ruleForm.mobile }}</div>
            </el-form-item>
            <!-- 提交 -->
            <el-form-item v-if="!!btnFlag">
              <el-button type="success" @click="submitForm('ruleForm')">{{ $t('login.forget_btn') }}</el-button>
            </el-form-item>

            <div class="bank_tips">
              <!-- 注意事项 -->
              <h5>{{ $t('product_setting.tips_tit') }}</h5>
              <!-- 钱包地址提交后将无法个人操作更改， 如需更改地址请在线反馈联系客服。 -->
              <p>1.{{ $t('personal_profile.bit_tips1') }}</p>
            </div>
          </el-form>
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
import MessageBox from "@/mixins/messageBox.js";
import comData from '@/utils/data.js'
export default {
  name: "account_bit",
  mixins: [WatchScreen, GetUserInfo, MyValidate,MessageBox],
  inject: ["$main"],
  data() {
    return {
      btnFlag: true,
      ruleForm: {
        mobile: "", // 手机号码
        btc: "", // btc地址
        eth: "", // eth地址
        usdt: "", // usdt地址
      },
      btc: "",
      eth: "",
      usdt: "",
      rules: {
        btc: [{ required: true, message: "请输入BTC地址", trigger: "blur" }],
        eth: [{ required: true, message: "请输入ETH地址", trigger: "blur" }],
        usdt: [{ required: true, message: "请输入USDT地址", trigger: "blur" }],
      }
    };
  },
  components: {
    GetCode
  },
  mounted: function() {
    let vm = this;
    vm.fnInit();
  },
  methods: {
    // 页面初始化
    fnInit() {
      let vm = this;
      vm.$main.loading = true;
      // 获取基本信息
      vm.fnGetNewInfo().then(res => {
        vm.$main.loading = false;
        function keyObj(name = {}, data = {}) {
          for (let key in vm[name]) {
            vm[name][key] = data[key];
          }
        }
        keyObj("ruleForm", res); // 遍历可修改的信息
        // if(!!vm.ruleForm.btc&&vm.ruleForm.btc!='null'&&!!vm.ruleForm.eth&&vm.ruleForm.eth!='null'&&!!vm.ruleForm.usdt&&vm.ruleForm.usdt!='null'){
        if (!!vm.ruleForm.btc && !!vm.ruleForm.eth && !!vm.ruleForm.usdt) {
          vm.btnFlag = false;
        }
        // vm.btc = vm.ruleForm.btc == 'null'?'':vm.ruleForm.btc;
        // vm.usdt = vm.ruleForm.usdt == 'null'?'':vm.ruleForm.usdt;
        // vm.eth = vm.ruleForm.eth == 'null'?'':vm.ruleForm.eth;
        vm.btc = vm.ruleForm.btc;
        vm.usdt = vm.ruleForm.usdt;
        vm.eth = vm.ruleForm.eth;
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
            inputType: 'password',
            center: true,
            confirmButtonClass: 'newClass',
            inputPlaceholder: vm.$t("system_container.please_two_pass"),
            showCancelButton: false,
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
                  vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`),'error')
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
      let params = {};
      vm.myValidate(formName).then(err => {
        if (!!!err) {
          for (var key in vm.ruleForm) {
            if (!!vm.ruleForm[key]) {
              params[key] = vm.ruleForm[key];
            }
          }
          delete params.mobile;
          if(!!vm.btc){
            delete params.btc;
          }
          if(!!vm.usdt){
            delete params.usdt;
          }
          if(!!vm.eth){
            delete params.eth;
          }
          vm.fnPassAgain()
            .then(code => {
              if (code == 0) {
                vm.$api.IBM_USER_UPDATEBLOCKCHAIN(params).then(res => {
                  vm.$main.loading = false;
                  if (res.code == 0) {
                    vm.fnOpenMessageBox(vm.$t("personal_profile.setUserInfoErr.success"),'success') // 修改成功
                    // vm.fnInit();
                    vm.$router.push(comData.conutry_type+'/user/home');
                  } else {
                    vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`),'error')
                  }
                });
              }
            })
            .catch(err => {});
        } else {
          vm.fnOpenMessageBox(err,'error')
        }
      });
    }
  }
};
</script>

<style lang="scss">
.bank_tips {
  font-size: 0.14rem;
  line-height: 0.25rem;
  p {
    font-size: 0.12rem;
  }
}
</style>
