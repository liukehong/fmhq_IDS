<template>
  <transition name="fade">
    <div class="main_wrap inner_wrap account_bank_add" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <div class="item_title">{{ $t('bank_card.add_card') }}</div>
        <div class="item_box">
          <div class="item_list_box">
            <el-form
              :model="ruleForm"
              :label-position="screenSize == 1?'left':'top'"
              ref="ruleForm"
              label-width="1.6rem"
              class="demo-ruleForm item_form"
            >
              <!-- 选择银行卡类型 -->
              <el-form-item :label="$t('bank_card_edit.sel_card')">
                <el-select v-model="ruleForm.type" :placeholder="$t('bank_card_edit.sel_card')">
                  <el-option :label="$t('bank_card_edit.china_card')" :value="1"></el-option>
                  <el-option :label="$t('bank_card_edit.other_card')" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <!-- 银行卡号码 -->
              <el-form-item :label="$t('bank_card_edit.bank_num')">
                <el-input :placeholder="$t('bank_card_edit.bank_num')" v-model="ruleForm.bankNum"></el-input>
              </el-form-item>
              <!-- 银行卡信息 -->
              <el-form-item :label="$t('bank_card_edit.card_info')" v-if="ruleForm.type == 1">
                <el-input :placeholder="$t('bank_card_edit.card_info')" v-model="ruleForm.bankOpen"></el-input>
              </el-form-item>
              <!-- 开户银行全名 -->
              <el-form-item :label="$t('bank_card_edit.get_bank')" v-if="ruleForm.type == 2">
                <el-input :placeholder="$t('bank_card_edit.get_bank')" v-model="ruleForm.bankName"></el-input>
              </el-form-item>
              <!-- 银行SWIFT -->
              <el-form-item :label="$t('bank_card_edit.bank_swift')" v-if="ruleForm.type == 2">
                <el-input :placeholder="$t('bank_card_edit.bank_swift')" v-model="ruleForm.swift"></el-input>
              </el-form-item>
              <!-- 国家 -->
              <el-form-item :label="$t('bank_card_edit.country')" v-if="ruleForm.type == 2">
                <el-select v-model="ruleForm.country" :placeholder="$t('bank_card_edit.country')">
                  <el-option
                    v-for="item in country"
                    :key="item.code"
                    :label="lanType == 'zh'?item.areaName:item.englishName"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- 银行账户持有人 -->
              <el-form-item :label="$t('bank_card_edit.card_person')">
                <el-input :placeholder="$t('bank_card_edit.card_person')" v-model="ruleForm.name"></el-input>
              </el-form-item>
              <!-- 预留手机号码 -->
              <el-form-item :label="$t('bank_card_edit.phone')" v-if="ruleForm.type == 1">
                <el-input :placeholder="$t('bank_card_edit.phone')" v-model="ruleForm.phone">
                  <!-- 请选择 -->
                  <el-select class="reset_select" v-model="phoneCode" slot="prepend">
                    <el-option v-for="item in list" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
              <!-- 身份证号码 -->
              <el-form-item :label="$t('bank_card_edit.id_num')" v-if="ruleForm.type == 1">
                <el-input :placeholder="$t('bank_card_edit.id_num')" v-model="ruleForm.idNo"></el-input>
              </el-form-item>
              <!-- 确定 -->
              <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('login.forget_btn') }}</el-button>
              <!-- 返回 -->
              <el-button @click="p.pageType = 'list'">{{ $t('system_container.back') }}</el-button>
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
import MyValidate from "@/mixins/myValidate.js";
import MessageBox from "@/mixins/messageBox.js";
import comData from "@/utils/data.js";
export default {
  name: "account_bank_add",
  mixins: [WatchScreen, GetUserInfo, MyValidate, MessageBox],
  inject: ["$main", "p"],
  data() {
    return {
      lanType: "zh", // zh中文 en英文 jp日文
      country: [],
      list: comData.phone,
      phoneCode: "+86",
      ruleForm: {
        type: 1,
        bankNum: "",
        name: "",
        phone: "",
        idNo: "",
        bankOpen: "",
        type: "",
        bankName: "",
        swift: "",
        country: ""
      },
      rules: {}
    };
  },
  components: {},
  mounted: function() {
    let vm = this;
    vm.fnPhoneType();
    if (window.localStorage.getItem("locale")) {
      vm.lanType = window.localStorage.getItem("locale");
    }
    vm.ruleForm.type = 1;
    // 获取国家列表
    vm.fnGetCityList(0);
  },
  methods: {
    fnPhoneType() {
      let vm = this;
      let langType = "zh";
      if (!!window.localStorage.getItem("locale")) {
        langType = window.localStorage.getItem("locale");
      }
      vm.phoneCode = langType == "zh" ? "+86" : langType == "en" ? "+1" : "+81";
    },
    // 表单提交
    submitForm(formName) {
      let vm = this;
      let params;
      vm.myValidate(formName).then(err => {
        if (!!!err) {
          let params = Object.assign({}, vm.ruleForm);
          params.phone = vm.phoneCode + vm.ruleForm.phone;
          /* if (vm.ruleForm.type == 1) {
            params = {
              bankNum: vm.ruleForm.bankNum,
              name: vm.ruleForm.name,
              phone: vm.phoneCode + vm.ruleForm.phone,
              idNo: vm.ruleForm.idNo,
              bankOpen: vm.ruleForm.bankOpen,
              type: vm.ruleForm.type
            };
          } else {
            params = {
              bankNum: vm.ruleForm.bankNum,
              name: vm.ruleForm.name,
              bankName: vm.ruleForm.bankName,
              swift: vm.ruleForm.swift,
              country: vm.ruleForm.country,
              type: vm.ruleForm.type
            };
          } */
          vm.$main.loading = true;
          vm.$api.IDS_BANK_ADD(params).then(res => {
            vm.$main.loading = false;
            if (res.code == 0) {
              vm.fnOpenMessageBox(
                vm.$t("bank_card_edit.setBankErr.addSuccess"),
                "success"
              );
              vm.p.pageType = "list";
            } else {
              vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
            }
          });
        } else {
          vm.fnOpenMessageBox(err, "error");
        }
      });
    },
    // 获取城市列表数据  type 0 国家 1省份 2城市  code 编码  查询国家不需要编码
    fnGetCityList(type, code = "") {
      let vm = this;
      let arrs = ["country", "province", "city"];
      let ajaxData = {
        id: code || 0,
        type: 2
      };
      vm.$api.IBM_UTILS_LINKAGE(ajaxData).then(res => {
        if (res.code == 0) {
          vm[arrs[type]] = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.reset_select {
  width: 0.9rem;
}
</style>
