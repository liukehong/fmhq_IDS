<template>
  <div v-loading="loading" class="item_box">
    <div class="item_list_box">
      <el-form
        style="width:100%;"
        :model="ruleForm"
        :rules="rules"
        :label-position="screenSize == 1?'left':'top'"
        ref="ruleForm"
        label-width="1.6rem"
        class="demo-ruleForm item_form"
      >
        <!-- 反馈标题 -->
        <el-form-item :label="$t('admin_feedback.title')">
          <div>{{ replayData.title }}</div>
        </el-form-item>
        <!-- 反馈内容 -->
        <el-form-item style="width:100%;" :label="$t('admin_feedback.content')">
          <div v-html="replayData.content"></div>
        </el-form-item>
        <!-- 反馈截图 -->
        <el-form-item :label="$t('admin_feedback.screenshots')">
          <ul class="screenshot_list">
            <li
              @click="fnSeeBigImg(item)"
              v-for="(item,index) in cionList"
              :key="index"
              class="screenshot_item"
            >
              <img :src="item" alt>
            </li>
          </ul>
        </el-form-item>
        <!-- 回复列表 -->
        <el-form-item :label="$t('admin_feedback.reply_list')"></el-form-item>
        <div v-if="replayList.length>0" class="reply_list_box">
          <ul class="reply_list">
            <li v-for="(item,index) in replayList" :key="index" class="reply_item gray">
              <!-- 用户ID -->
              <p
                style="margin-bottom: .1rem;"
                v-if="item.userId == replayData.userId"
              >{{ $t('admin_feedback.user_id') }}：{{ item.userId }}</p>
              <!-- 回复内容 -->
              <p
                class="reply_name"
              >{{ item.type == 1?$t('admin_feedback.reply_content'):$t('admin_feedback.content') }}:</p>
              <div class="reply_content">
                <!-- 内容 -->
                <div v-html="item.content"></div>
                <!-- 图 -->
                <img
                  @click="fnSeeBigImg(item.cion)"
                  style="width:.94rem; height: .94rem; display:block; cursor: pointer;"
                  v-if="item.cion"
                  :src="item.cion"
                  alt
                >
              </div>
              <!-- 回复时间 -->
              <p
                class="reply_date"
              >{{ item.type == 1?$t('admin_feedback.content_reply_time'):$t('admin_feedback.content_create_time') }}:{{ item.createTime|FMT_DATE }}</p>
            </li>
          </ul>
          <div class="pagination_box">
            <el-pagination
              :current-page="currentPage"
              :page-size="10"
              @current-change="handleCurrentChange"
              layout="slot,prev, pager, next"
              :total="total"
            >
              <!-- 共多少条 -->
              <span
                style="padding-right: .1rem;"
                class="el-pagination__total first"
              >{{ $t('el.pagination.total1') }}{{ total }}{{ $t('el.pagination.total2') }}</span>
              <!-- 每页展示多少条 -->
              <span class="pagination__sizes first">
                <el-select size="mini" v-model="params.totalPage" @change="fnSizeChange">
                  <el-option
                    v-for="item in sizeList"
                    :key="item"
                    :label="`${item}${$t('el.pagination.pagesize')}`"
                    :value="item"
                  ></el-option>
                </el-select>
              </span>
            </el-pagination>
          </div>
        </div>
        <!-- 回复内容 -->
        <el-form-item :label="$t('admin_feedback.reply_content')">
          <!-- <el-input :placeholder="$t('admin_feedback.reply_content')" rows="8" type="textarea" v-model="ruleForm.content"></el-input> -->
          <Editor v-model="ruleForm.content"></Editor>
        </el-form-item>
        <!-- 截图 -->
        <el-form-item :label="$t('send_feedback.screenshots')">
          <Upload
            parentName="admin_feedback_info"
            pathName="ruleForm.cion"
            :imageUrl="ruleForm.cion"
          ></Upload>
        </el-form-item>
        <el-form-item>
          <!-- 提交 -->
          <el-button type="success" @click="submitForm('ruleForm')">{{ $t('login.forget_btn') }}</el-button>
          <!-- 返回 -->
          <el-button @click="p.pageType = 'list'">{{ $t('system_container.back') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <BigImg :path="curUrl" :dialogVisible="dialogVisible" @changeUrl="fnChangeUrl"></BigImg>
  </div>
</template>

<script>
import Upload from "@/components/Upload";
import WatchScreen from "../../../mixins/watchScreen.js";
import BigImg from "@/components/BigImg";
import MessageBox from "@/mixins/messageBox.js";
import Editor from "@/components/Editor";
export default {
  name: "admin_feedback_info",
  mixins: [WatchScreen, MessageBox],
  inject: ["p", "$main"],
  components: {
    Upload,
    BigImg,
    Editor
  },
  data() {
    return {
      sizeList: [10, 15, 20, 25, 30],
      loading: false,
      params: {
        id: this.p.info.id, // 反馈id
        startTime: "",
        endTime: "",
        currPage: 1,
        totalPage: 10
      },
      replayData: {
        title: "",
        constent: "",
        cion: "",
        userId: ""
      },
      curUrl: "",
      dialogVisible: false,
      cionList: [],
      replayList: [],
      total: 0,
      currentPage: 1,
      ruleForm: {
        type: 1,
        content: "", // 内容
        feedbackId: this.p.info.id, // 反馈id
        cion: "" // 图片地址
      },
      rules: {}
    };
  },
  mounted: function() {
    let vm = this;
    vm.fnGetData();
  },
  methods: {
    // 每页要展示多少条
    fnSizeChange(val) {
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
    // 获取回复列表数据
    fnGetData() {
      let vm = this;
      let params = Object.assign({}, vm.params);
      vm.$main.loading = true;
      vm.$api.IBM_FEEDBACK_SELECTREPLY(params).then(res => {
        if (res.code == 0) {
          vm.replayList = res.data.list;
          vm.replayData.title = res.data.obj.title;
          vm.replayData.content = res.data.obj.content;
          vm.replayData.userId = res.data.obj.userId;
          if (!!res.data.obj.cion) {
            vm.cionList = res.data.obj.cion.split(";") || [];
          } else {
            vm.cionList = [];
          }
          vm.total = res.data.totalCount;
        }
        vm.$main.loading = false;
      });
    },
    // 隐藏模态框
    fnChangeUrl() {
      let vm = this;
      vm.dialogVisible = false;
    },
    // 查看大图
    fnSeeBigImg(url) {
      let vm = this;
      this.curUrl = url;
      vm.dialogVisible = true;
    },
    // 表单提交
    submitForm(formName) {
      let vm = this;
      if (!!!vm.ruleForm.content) {
        vm.fnOpenMessageBox(
          vm.$t("admin_feedback.replyErrInfo.replyContent"),
          "error"
        );
        return false;
      }
      vm.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, vm.ruleForm);
          vm.$main.loading = true;
          vm.$api.IBM_ADMIN_ADDREPLY(params).then(res => {
            vm.$main.loading = false;
            if (res.code == 0) {
              vm.$main.fnGetNewsNum();
              vm.fnOpenMessageBox(
                vm.$t("admin_feedback.replyErrInfo.success"),
                "success"
              );
              vm.fnGetData();
              vm.p.pageType = "list";
            } else {
              vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.item_form {
  max-width: 100% !important;
}
.reply_list_box {
  font-size: 0.14rem;
  margin: 0.2rem 0;
  border: 1px solid #bfbfbf;
  border-radius: 5px;
  .reply_item {
    padding: 0.2rem;
    margin-top: 0.2rem;
    .reply_name {
      margin-bottom: 0.1rem;
    }
    .reply_content {
      border: 1px solid #bfbfbf;
      border-radius: 5px;
      padding: 0.1rem;
    }
    .reply_date {
      margin-top: 0.1rem;
    }
  }
}
ul,
li {
  list-style: none;
}
.pagination_box {
  padding: 0.1rem 0;
}
.screenshot_list {
  display: flex;
  flex-wrap: wrap;
  .screenshot_item {
    margin-right: 0.1rem;
    width: 1rem;
    height: 1rem;
    padding: 2px;
    line-height: 1rem;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
