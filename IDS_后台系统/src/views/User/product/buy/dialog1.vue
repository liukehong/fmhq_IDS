<template>
<!-- 选择配套 -->
  <el-dialog :modal-append-to-body='false' class="productList" :title="$t('product_manage.sel_product')" :visible.sync="p.dialogVisible1" center :width="screenSize == 1?'40%':'90%'">
    <div class="pro_msg">
      <img :src="p.list.icon" alt>
      <div class="pro_text">
        <!-- 预期月回报能力 -->
        <p
          class="pro_profit"
        >{{ $t('product_manage.month_profit') }}：{{ parseInt(p.list.min*100) }}%~{{ parseInt(p.list.max*100) }}%</p>
        <p class="pro_intro">{{ p.list.text }}</p>
      </div>
    </div>
    <ul class="pop_pro_lsit">
      <li class="pop_pro_item" v-for="item in p.list.list" :key="item.id">
        <div class="pro_txt">
          <p class="pro_tit">IDS{{ item.money }}</p>
          <!-- 立即购买 -->
          <el-button @click="fnHistory(item)" class="btn" type="success">{{ $t('product_manage.see_btn') }}</el-button>
        </div>
      </li>
    </ul>
  </el-dialog>
</template>
<script>
import WatchScreen from "@/mixins/watchScreen.js";
export default {
  name: "productList",
  mixins: [WatchScreen],
  inject: ["p"],
  data() {
    return {};
  },
  mounted() {
    let vm = this;
  },
  methods: {
    fnGoBuy: function(data) {
      let vm = this;
      vm.$router.push({ name: "product_manage", params: { item: data } });
    },
    // 查看历史回顾
    fnHistory(data) {
      let vm = this;
      console.log(data);
      vm.p.money = data.money;
      vm.p.curSelect =
        data.name == "Deep AI Genius 1"
          ? "basic"
          : data.name == "Deep AI Genius 2"
          ? "pro"
          : data.name == "Deep AI Genius 3"
          ? "genius"
          : "junior";
      vm.p.pageType = "history";
      vm.p.dialogVisible1 = false;
    },
  }
};
</script>
<style lang="scss" scoped>
.productList {
  .pro_msg {
    // height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.4rem 0.2rem;
    // background: #ececec;
    img {
      width: 1rem;
      height: 1rem;
      display: block;
      margin-right: 0.2rem;
    }
    .pro_text {
      flex: 1;
      .pro_profit {
        font-size: 0.18rem;
        // color: #002b6e;
        font-weight: 700;
      }
      .pro_intro {
        font-size: 0.14rem;
        margin-top: 0.1rem;
      }
    }
  }
  .pop_pro_lsit {
    padding: 0.2rem;
    .pop_pro_item {
      display: flex;
      justify-content: center;
      align-items: center;
      // background: #ececec;
      border: 1px solid #ccc;
      border-radius: 0.1rem;
      padding: 0.2rem;
      margin-bottom: 0.2rem;
      .pro_txt {
        flex: 1;
        text-align: center;
        .pro_tit {
        //   color: #00296b;
          font-size: 0.18rem;
        }
        .btn {
          margin-top: 0.2rem;
        }
      }
    }
  }
}
</style>
