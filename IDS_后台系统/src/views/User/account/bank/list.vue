<template>
  <div style="overflow: hidden;">
    <div class="main_wrap inner_wrap account_bank">
      <el-scrollbar style="height: 100%;">
        <!-- 修改账号密码 -->
        <div class="item_title">{{ $t('user.bank_card') }}</div>
        <div class="item_box">
          <div class="item_list_box">
            <el-row>
              <!-- 银行卡list -->
              <el-col
                v-for="item in list"
                :key="item.id"
                :span="24"
                :xs="24"
                :sm="24"
                :md="12"
                :lg="12"
                :xl="8"
                class="col_item"
                style="padding: .1rem;"
              >
                <div>
                  <a class="bank_card_item">
                    <div class="bank_msg">
                      <div class="bank_icon"></div>
                      <div class="card_txt">
                        <h5>{{ item.bankName }}</h5>
                        <p>{{ item.name }}</p>
                      </div>
                    </div>
                    <div class="bank_code">{{ item.bankNum }}</div>
                    <i @click="fnDeleteBank(item.id)" class="del_bank el-icon-close"></i>
                  </a>
                </div>
              </el-col>
              <el-col
                :span="24"
                :xs="24"
                :sm="24"
                :md="12"
                :lg="12"
                :xl="8"
                class="col_item"
                style="padding: .1rem;"
              >
                <div @click="fnAddBankCard">
                  <!-- 添加银行卡 -->
                  <a class="add_card_item txt">{{ $t('bank_card.add_card') }}</a>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import WatchScreen from "@/mixins/watchScreen.js";
import GetUserInfo from "@/mixins/getUserInfo.js";
import MyValidate from "@/mixins/myValidate.js";
import MessageBox from "@/mixins/messageBox.js";
import comData from "@/utils/data.js";
export default {
  name: "account_bank",
  mixins: [WatchScreen, GetUserInfo, MyValidate, MessageBox],
  inject: ["$main","p"],
  data() {
    return {
      list: [],
    };
  },
  mounted: function() {
    let vm = this;
    vm.fnGetList();
  },
  methods: {
    // 查询客户银行卡
    fnGetList () {
        let vm = this;
        vm.$api.IDS_BANK_SELECT().then(res=>{
            console.log(res);
            vm.list = res.data;
        })
    },
    // 打开银行卡模态框
    fnAddBankCard() {
      let vm = this;
      vm.p.pageType = 'add';
    },
    // 删除银行卡
    fnDeleteBank(id) {
      let vm = this;
      vm.$main.loading = true;
      vm.$api
        .IDS_BANK_DELECT({
          id: id
        })
        .then(res => {
          vm.$main.loading = false;
          if (res.code == 0) {
            vm.fnOpenMessageBox(vm.$t("bank_card.setBankErr.delSuccess"), "success");
            vm.fnGetList();
          } else {
            vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
          }
        });
    }
  }
};
</script>

<style lang="scss">
.account_bank {
  .el-form-item__label {
    // color: #fff;
  }
}
.bank_card_item {
  display: block;
  border-radius: 0.05rem;
  color: #fff;
  padding: 0.1rem 0.45rem;
  background-color: #2975bc;
  background-repeat: no-repeat;
  background-position: 90%;
  background-size: auto 100%;
  height: 1rem;
  //   background-image: url("../../../../static/image/bank.png");
  background-image: url("../../../../../static/image/bank.png");
  position: relative;
  .bank_msg {
    overflow: hidden;
    margin-top: 0.1rem;
    .bank_icon {
      height: 0.36rem;
      width: 0.36rem;
      float: left;
      margin-right: 0.1rem;
      background-image: url("../../../../../static/image/bank.svg");
      background-position: 50%;
      background-size: 100% auto;
      background-repeat: no-repeat;
    }
    .card_txt {
      float: left;
      font-size: 0.14rem;
      line-height: 0.2rem;
    }
  }
  .bank_code {
    font-size: 0.2rem;
    margin-top: 0.1rem;
    line-height: 1;
    letter-spacing: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .del_bank {
    display: block;
    width: 0.2rem;
    height: 0.2rem;
    position: absolute;
    right: 0.05rem;
    top: 0.05rem;
    cursor: pointer;
  }
}
.add_card_item {
  display: block;
  border-radius: 0.05rem;
  color: #fff;
  border: 2px dashed #383838;
  background: url("../../../../../static/image/add.png") no-repeat 50%;
  background-size: auto 60%;
  height: 1rem;
}
.txt {
  padding-top: 0.6rem;
  text-align: center;
  color: #5d5d5d;
  background-position: center 0.05rem;
}
</style>
