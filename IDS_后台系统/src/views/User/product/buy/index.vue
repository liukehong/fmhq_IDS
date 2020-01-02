<template>
  <transition name="fade">
    <div class="BuyProduct inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <div style="overflow:hidden;" v-if="pageType == 'index'">
          <!-- 购买配套 -->
          <div class="item_title">{{ $t('user.product_manage') }}</div>
          <el-row>
            <el-col
              v-for="item in productList"
              :key="item.name"
              class="col-item"
              :span="24"
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="8"
            >
              <div class="box">
                <div class="box_img">
                  <img :src="item.icon" alt />
                </div>
                <div class="box_title">{{ changeName(item.name) }}</div>
                <div class="box_text">
                  <p>{{ item.text }}</p>
                </div>
                <!-- 预期月汇报能力 -->
                <div class="box_ablity">{{ $t('product_manage.month_profit') }}</div>
                <div class="box_num">{{ parseInt(item.min*100) }}%~{{ parseInt(item.max*100) }}%</div>

                <div class="btn_wrap">
                  <!-- 选择 -->
                  <el-button
                    @click="fnOpenDialog(item)"
                    style="width: 80%;"
                    type="success"
                  >{{ $t('product_manage.select') }}</el-button>
                </div>
                <div class="btn_wrap">
                  <el-button
                    style="width: 80%;"
                    @click="fnOpenDialog1(item)"
                  >{{ $t('product_manage.look_profit') }}</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 历史回顾 -->
        <div style="overflow: hidden;" v-if="pageType == 'history'">
          <!-- 历史交易回报 -->
          <div class="item_title">{{ $t('user.product_chart') }}</div>
          <div class="item_title1">{{ $t('product_setting.mat_money') }}：{{ money }}</div>
          <myEcharts></myEcharts>
        </div>
        <ProductList></ProductList>
        <Dialog1></Dialog1>
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
import WatchScreen from "@/mixins/watchScreen.js";
import ProductList from "./dialog.vue";
import Dialog1 from "./dialog1.vue";
import myEcharts from "./echarts";
import MessageBox from "@/mixins/messageBox.js";
export default {
  name: "BuyProduct",
  mixins: [WatchScreen, MessageBox],
  inject: ["$main"],
  provide() {
    return {
      p: this
    };
  },
  components: {
    ProductList,
    Dialog1,
    myEcharts
  },
  data() {
    return {
      dept: "",
      pageType: "index",
      money: "",
      dialogVisible: false,
      dialogVisible1: false,
      list: [],
      productList: [
        // 利用系统基础面与技术面大数据进行线性分析处理，效率最高，执行最快，持单周期最短，适合初级理财人士。
        /* {
          name: "Deep AI Genius 1",
          list: [],
          icon: "",
          max: "",
          min: "",
          text: this.$t("product_manage.introduce.basic")
        }, */
        // 交易范围进一步拓宽，同时执行多项策略，允许小单亏损大单盈利的判断并开始具备高频测试空单并交易实单的能力，适合中级资产客户。
        {
          name: "Deep AI Genius 2",
          list: [],
          icon: "",
          max: "",
          min: "",
          text: this.$t("product_manage.introduce.pro")
        },
        // 拥有自主学习能力及自主防御系统，使用迭代升级及迭代策略分析并分布式执行，智能化进一步提高，适合高级客户或长期持有数字资产的客户。
        {
          name: "Deep AI Genius 3",
          list: [],
          icon: "",
          max: "",
          min: "",
          text: this.$t("product_manage.introduce.genius")
        }
      ]
    };
  },
  mounted() {
    let vm = this;
    vm.fnTypeList();
  },
  methods: {
    changeName(data) {
      let vm = this;
      if (vm.dept != 11) {
        if (data == "Deep AI Genius 2") {
          return "Deep AI Genius A";
        } else if (data == "Deep AI Genius 3") {
          return "Deep AI Genius B";
        } else {
          return "Deep AI Genius A";
        }
      } else {
        return data;
      }
    },
    // 根据dept配置不同的选项
    fnTypeList() {
      let vm = this;
      if (!!window.localStorage.getItem("userInfo")) {
        vm.dept = JSON.parse(window.localStorage.getItem("userInfo")).dept;
      }
      vm.fnGetProduct();
    },
    // 获取配套产品
    fnGetProduct: function() {
      let vm = this;
      vm.$main.loading = true;
      vm.$api.IBM_MAT_INFO().then(res => {
        vm.$main.loading = false;
        if (res.code == 0) {
          for (var i = 0, item; (item = vm.productList[i++]); ) {
            for (var j = 0, jtem; (jtem = res.data[j++]); ) {
              if (item.name == jtem.name) {
                item.list.push(jtem);
                if (!!!item.icon) {
                  if (vm.dept != 11) {
                    if (item.name == "Deep AI Genius 2") {
                      item.icon = "../../../../../static/image/A.png";
                      // item.name = "Deep AI Genius A";
                    }
                    if (item.name == "Deep AI Genius 3") {
                      item.icon = "../../../../../static/image/B.png";
                      // item.name = "Deep AI Genius B";
                    }
                    if (item.name == "Deep AI Genius 1") {
                      item.icon = "../../../../../static/image/A.png";
                      // item.name = "Deep AI Genius A";
                    }
                  } else {
                    item.icon = jtem.icon;
                  }
                  item.max = jtem.max;
                  item.min = jtem.min;
                }
              }
            }
          }
        } else {
          vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
        }
      });
    },
    // 打开模态框
    fnOpenDialog(data) {
      let vm = this;
      vm.dialogVisible = true;
      vm.list = data;
    },
    // 打开模态框
    fnOpenDialog1(data) {
      let vm = this;
      vm.dialogVisible1 = true;
      vm.list = data;
    }
  }
};
</script>
<style lang="scss">
.BuyProduct {
  .item_title1 {
    height: 0.18rem;
    margin-bottom: 0.33rem;
    font-size: 0.14rem;
    font-weight: bold;
    padding-left: 0.25rem;
    position: relative;
    color: #353535;
    font-family: MicrosoftYaHeiUI-Bold;
  }
  .col-item {
    padding: 0.5rem;
    .box {
      box-shadow: 0px 0px 43px 8px rgba(208, 220, 245, 0.38);
      border: 1px solid rgba(38, 40, 96, 1);
      overflow: hidden;
      width: 100%;
      background: url("../../../../../static/image/product_1.png") no-repeat;
      background-size: cover;
      border-radius: 0.12rem;
      text-align: center;
      .box_img {
        padding-top: 0.61rem;
        img {
          width: 1.8rem;
          // height: 2rem;
          display: block;
          margin: 0 auto;
        }
      }
      .box_title {
        padding-top: 0.34rem;
        font-size: 0.19rem;
        font-weight: bold;
        padding-bottom: 0.3rem;
        color: #282828;
      }
      .box_text {
        // height: 1.8rem;
        padding-bottom: 0.15rem;
        padding-left: 0.38rem;
        padding-right: 0.38rem;
        p {
          font-size: 0.14rem;
          // line-height: .36rem;
        }
      }
      .box_num {
        // padding-top: .59rem;
        font-size: 0.37rem;
        font-weight: bold;
        padding-bottom: 0.71rem;
        padding-top: 0.19rem;
        color: #f29a00;
      }
      .box_ablity {
        font-size: 0.12rem;
      }
      .box_select {
        // padding-bottom: .2rem;
      }
      .box_see {
        // padding-bottom: .6rem;
      }
      .btn_wrap {
        height: 0.63rem;
        width: 100%;
        line-height: 0.63rem;
        background: #262860;
      }
    }
  }
}
</style>
