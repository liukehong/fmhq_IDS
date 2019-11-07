<template>
  <div style="overflow: hidden;">
    <List v-if="pageType=='list'"></List>
    <Add v-if="pageType=='add'"></Add>
  </div>
</template>
<script>
import WatchScreen from "@/mixins/watchScreen.js";
import GetUserInfo from "@/mixins/getUserInfo.js";
import MyValidate from "@/mixins/myValidate.js";
import MessageBox from "@/mixins/messageBox.js";
import comData from "@/utils/data.js";
import Add from './add';
import List from './list';
export default {
  name: "account_bank",
  mixins: [WatchScreen, GetUserInfo, MyValidate, MessageBox],
  inject: ["$main"],
  provide() {
    return {
      p: this
    };
  },
  data() {
    return {
      pageType: "list",
      list: [],
    };
  },
  components: {
    Add,
    List
  },
  mounted: function() {
    let vm = this;
  },
  methods: {
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
