<template>
  <transition name="fade">
    <div class="withdraw_audit inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <!-- 出金审核 -->
        <div class="item_title">{{ $t('admin.withdraw_audit') }}</div>
        <div class="item_box">
          <div class="item_table_box">
            <!-- 时间选择 -->
            <TableDate @changeDate="changeDataByDate"></TableDate>
            <div class="sel_label" style="overflow:hidden;">
              <!-- 请选择 -->
              <el-select
                :class="screenSize == 1?'rem_2':'rem_100'"
                style="margin-right: .2rem;"
                v-model="params.type"
                :placeholder="$t('select.placeholder')"
                @change="changeState"
              >
                <!-- 出金申请 -->
                <el-option :label="$t('withdraw_audit.status.submit')" :value="1"></el-option>
                <!-- 出金驳回 -->
                <el-option :label="$t('withdraw_audit.status.rejected')" :value="3"></el-option>
                <!-- 出金成功 -->
                <el-option :label="$t('withdraw_audit.status.submit_suc')" :value="6"></el-option>
              </el-select>
              <!-- 批量通过 -->
              <el-button
                :style="screenSize == 1?'':'margin-top: .2rem;'"
                @click="fnPass"
                type="success"
              >{{ $t('withdraw_audit.pass') }}</el-button>
            </div>
            <el-table
              @selection-change="handleSelectionChange"
              border
              :empty-text="$t('el.table.emptyText')"
              row-class-name="rowClassName"
              header-row-class-name="headerRowClassName"
              style="width: 100%;"
              :stripe="true"
              :data="tableData"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <!-- 订单号 -->
              <el-table-column :label="$t('withdraw_audit.order_no')">
                <template slot-scope="scope">{{ scope.row.orderNo }}</template>
              </el-table-column>
              <!-- 申请时间 -->
              <el-table-column :label="$t('withdraw_audit.time')">
                <template slot-scope="scope">{{ scope.row.rateTime|FMT_DATE }}</template>
              </el-table-column>
              <!-- ID -->
              <el-table-column :label="$t('withdraw_audit.user_id')">
                <template slot-scope="scope">{{ scope.row.userId }}</template>
              </el-table-column>
              <!-- 真实姓名 -->
              <el-table-column :label="$t('withdraw_audit.real_name')">
                <template slot-scope="scope">{{ scope.row.realName||'--' }}</template>
              </el-table-column>
              <!-- 手机号 -->
              <el-table-column :label="$t('withdraw_audit.real_bank_phone')">
                <template slot-scope="scope">{{ scope.row.realBankPhone||'--' }}</template>
              </el-table-column>
              <!-- 银行名称 -->
              <el-table-column :label="$t('withdraw_list.bankName')">
                <template slot-scope="scope">{{ scope.row.bankName }}</template>
              </el-table-column>
              <!-- 卡号/地址 -->
              <el-table-column :label="$t('withdraw_list.bankAndCoinType')">
                <template slot-scope="scope">{{ scope.row.bankNumber }}</template>
              </el-table-column>
              <!-- 提现金额 -->
              <el-table-column :label="$t('withdraw_audit.withdraw_money')">
                <template slot-scope="scope">{{ scope.row.withdrawMoney }}</template>
              </el-table-column>
              <!-- 描述 -->
              <el-table-column :label="$t('withdraw_list.reason')">
                <template slot-scope="scope">{{ scope.row.reason||'--' }}</template>
              </el-table-column>
              <!-- 原因 -->
              <el-table-column :label="$t('withdraw_audit.reason')">
                <template
                  slot-scope="scope"
                >{{ (lanType == 'zh'?scope.row.examineReason:scope.row.examineReasonEn)||'--' }}</template>
              </el-table-column>
              <!-- 状态 -->
              <el-table-column :label="$t('withdraw_audit.withdraw_status')">
                <template slot-scope="scope">{{ STATUS(scope.row.withdrawStatus) }}</template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column width="300" :label="$t('withdraw_audit.handle')">
                <template slot-scope="scope">
                  <div v-if="scope.row.withdrawStatus == 1">
                    <!-- 通过 -->
                    <el-button
                      @click="fnChangeType(6,scope.row.id)"
                      type="success"
                      size="mini"
                    >{{ $t('withdraw_audit.through') }}</el-button>
                    <!-- 驳回 -->
                    <el-button
                      @click="fnOpenModal(scope.row.id)"
                      type="danger"
                      size="mini"
                    >{{ $t('withdraw_audit.rejected') }}</el-button>
                    <!-- 恢复 -->
                    <el-button
                      @click="fnDoSome(scope.row.id)"
                      type="warning"
                      size="mini"
                    >{{ $t('withdraw_audit.restore') }}</el-button>
                  </div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination_box">
              <el-pagination
                style="overflow: auto;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 15, 20, 25, 30]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
        <!-- 提示 -->
        <el-dialog
          :modal-append-to-body="false"
          :title="$t('system_container.tips')"
          :visible.sync="dialogVisible"
          :width="screenSize == 1?'22%':'90%'"
          center
        >
          <el-form
            label-position="top"
            style="padding-left: .2rem; padding-right: .2rem; padding-top: .2rem;"
            label-width="80px"
          >
            <el-form-item style="color: #fff;" :label="$t('withdraw_audit.reason1')">
              <el-input type="textarea" v-model="reason1"></el-input>
            </el-form-item>
            <el-form-item style="color: #fff;" :label="$t('withdraw_audit.reason2')">
              <el-input type="textarea" v-model="reason2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <!-- 确 定 -->
            <el-button
              style="width: 100%;"
              type="success"
              @click="fnDoSome1"
            >{{ $t('el.colorpicker.confirm') }}</el-button>
          </span>
        </el-dialog>
      </el-scrollbar>
    </div>
  </transition>
</template>
  <script>
import WatchScreen from "../../../mixins/watchScreen.js";
import TableDate from "../../../../src/components/TableDate.vue";
import formDate from "@/utils/formDate.js";
import MessageBox from "@/mixins/messageBox.js";
export default {
  name: "withdraw_audit",
  mixins: [WatchScreen, MessageBox],
  components: {
    TableDate
  },
  inject: ["$main"],
  data() {
    return {
      curId: "",
      reason1: "", // 中文原因
      reason2: "", // 英文原因
      dialogVisible: false,
      sizeList: [10, 15, 20, 25, 30],
      currentPage: 1,
      tableData: [],
      params: {
        type: 1, // 1提交申请  3驳回申请  6提现成功
        totalPage: 10,
        currPage: 1,
        startTime: "",
        endTime: ""
      },
      total: 0,
      list: [],
      lanType: "zh"
    };
  },
  mounted: function() {
    let vm = this;
    // 语言类型判断
    if (window.localStorage.getItem("locale")) {
      vm.lanType = window.localStorage.getItem("locale");
    }
    vm.fnGetData();
  },
  methods: {
    // 打开模态框
    fnOpenModal(id) {
      let vm = this;
      vm.dialogVisible = true;
      vm.reason1 = "";
      vm.reason2 = "";
      vm.curId = id;
    },
    // 模态框点击事件
    fnDoSome1() {
      let vm = this;
      vm.$main.loading = true;
      vm.dialogVisible = false;
      // 驳回
      vm.$api
        .IBM_ADMIN_AUDITGOLD({
          id: vm.curId,
          withdrawStatus: 3,
          reason: vm.reason1,
          reasonEn: vm.reason2
        })
        .then(res => {
          vm.$main.loading = false;
          if (res.code == 0) {
            // 表单提交
            vm.fnOpenMessageBox(
              vm.$t("withdraw_audit.auditErrInfo.rejected"),
              "success"
            );
            vm.fnGetData();
          } else {
            vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
          }
        });
    },
    fnPass() {
      let vm = this;
      if (!!!vm.list.length) {
        vm.fnOpenMessageBox(vm.$t("withdraw_audit.select"), "error"); // 请先选择
        return false;
      } else {
        // 此操作将会
        // 是否继续？
        // 提示
        vm.$confirm(
          vm.$t("withdraw_audit.text1"),
          vm.$t("system_container.tips"),
          {
            confirmButtonText: vm.$t("system_container.ok"), // 确定
            cancelButtonText: vm.$t("system_container.no"), // 取消
            type: "warning"
          }
        )
          .then(() => {
            vm.$main.loading = true;
            vm.$api
              .IBM_ADMIN_BATCHAUDIT({
                idString: vm.list
              })
              .then(res => {
                vm.$main.loading = false;
                if (res.code == 0) {
                  vm.fnOpenMessageBox(
                    vm.$t("withdraw_audit.auditErrInfo.through"), // 通过成功
                    "success"
                  );
                  vm.fnGetData();
                } else {
                  vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
                }
              });
          })
          .catch(() => {});
      }
    },
    // 批量选择
    handleSelectionChange(val) {
      let vm = this;
      let arrs = [];
      if (val.length > 0) {
        val.forEach((item, index) => {
          arrs.push(item.id);
        });
      }
      vm.list = arrs;
    },
    // 状态
    STATUS(data) {
      let vm = this;
      let obj = {
        "1": vm.$t("withdraw_audit.status.submit"), // 出金申请
        "3": vm.$t("withdraw_audit.status.rejected"), // 出金驳回
        "6": vm.$t("withdraw_audit.status.submit_suc") // 出金成功
      };
      return obj[+data];
    },
    // 恢复
    fnDoSome(data) {
      let vm = this;
      let params = {
        withdrawStatus: 1,
        reason: "",
        id: data
      };
      vm.$main.loading = true;
      vm.$api.IBM_ADMIN_AUDITGOLD(params).then(res => {
        vm.$main.loading = false;
        if (res.code == 0) {
          vm.fnOpenMessageBox(
            vm.$t("withdraw_audit.auditErrInfo.restore"),
            "success"
          );
          vm.fnGetData();
        } else {
          vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
        }
      });
    },
    // 每页要展示多少条
    fnSizeChange(val) {
      let vm = this;
      vm.params.totalPage = val;
      vm.fnGetData();
    },
    fnChangeType(type, id) {
      let vm = this;
      let obj = {
        "3": vm.$t("withdraw_audit.status.submit"), // 出金驳回
        "6": vm.$t("withdraw_audit.status.submit_suc") // 出金成功
      };
      // 此操作将会
      // 是否继续？
      // 提示
      vm.$confirm(
        vm.$t("withdraw_audit.text1"),
        vm.$t("system_container.tips"),
        {
          confirmButtonText: vm.$t("system_container.ok"), // 确定
          cancelButtonText: vm.$t("system_container.no"), // 取消
          type: "warning"
        }
      )
        .then(() => {
          vm.$main.loading = true;
          vm.$api
            .IBM_ADMIN_AUDITGOLD({
              id: id,
              withdrawStatus: type,
              reason: ""
            })
            .then(res => {
              vm.$main.loading = false;
              if (res.code == 0) {
                if (type == 6) {
                  vm.fnOpenMessageBox(
                    vm.$t("withdraw_audit.auditErrInfo.through"),
                    "success"
                  );
                } else {
                  vm.fnOpenMessageBox(
                    vm.$t("withdraw_audit.auditErrInfo.rejected"),
                    "success"
                  );
                }
                vm.fnGetData();
              } else {
                vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
              }
            });
        })
        .catch(() => {});
    },
    changeState(val) {
      let vm = this;
      vm.params.currPage = 1;
      vm.currentPage = 1;
      vm.fnGetData();
    },
    // 时间范围选择
    changeDataByDate(data) {
      let vm = this;
      vm.params.startTime = formDate(data.startTime, 2);
      vm.params.endTime = formDate(data.endTime, 2);
      vm.fnGetData();
    },
    // 每页要展示多少条
    handleSizeChange(val) {
      let vm = this;
      vm.params.totalPage = val;
      vm.fnGetData();
    },
    // 当前第几页
    handleCurrentChange(val) {
      let vm = this;
      vm.params.currPage = val;
      vm.fnGetData();
      vm.currentPage = val;
    },
    // 获取列表数据
    fnGetData() {
      let vm = this;
      let params = Object.assign({}, vm.params);
      vm.$main.loading = true;
      vm.$api.IBM_ADMIN_GETGOLDINFO(params).then(res => {
        if (res.code == 0) {
          vm.tableData = res.data.list; // 列表
          vm.total = res.data.totalCount;
        }
        vm.$main.loading = false;
      });
    }
  }
};
</script>
<style lang="scss">
.withdraw_audit {
  .el-form-item__label {
    // color: #fff;
  }
}
</style>
