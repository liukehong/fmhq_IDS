<template>
  <transition name="fade">
    <div class="feedback_send inner_wrap" style="overflow:hidden;">
      <el-scrollbar style="height: 100%;">
        <!-- 发送反馈 -->
        <div class="item_title">{{ $t('user.send_feedback') }}</div>
        <div class="item_box">
          <div class="item_list_box">
            <el-form
              style="max-width: 100%;!important"
              :model="ruleForm"
              :label-position="screenSize == 1?'left':'top'"
              ref="ruleForm"
              label-width="1.6rem"
              class="demo-ruleForm item_form"
            >
              <!-- 标题 -->
              <el-form-item :label="$t('send_feedback.title')" prop="title">
                <el-input
                  style="max-width: 6rem;"
                  :placeholder="$t('send_feedback.title')"
                  v-model="ruleForm.title"
                ></el-input>
              </el-form-item>
              <!-- 截图 -->
              <el-form-item :label="$t('send_feedback.screenshots')">
                <Upload
                  parentName="feedback_send"
                  pathName="ruleForm.cion"
                  :imageUrl="ruleForm.cion"
                ></Upload>
              </el-form-item>
              <!-- 内容 -->
              <el-form-item :label="$t('send_feedback.content')" prop="content">
                <!-- <el-input :rows="8" :placeholder="$t('send_feedback.content')" type="textarea" v-model="ruleForm.content"></el-input> -->
                <Editor v-model="ruleForm.content"></Editor>
              </el-form-item>
              <el-form-item>
                <!-- 提交 -->
                <el-button
                  type="success"
                  @click="submitForm('ruleForm')"
                >{{ $t('login.forget_btn') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </transition>
</template>

<script>
import Upload from "@/components/Upload";
import WatchScreen from "@/mixins/watchScreen.js";
import MyValidate from "@/mixins/myValidate.js";
import Editor from "@/components/Editor";
import MessageBox from "@/mixins/messageBox.js";
import comData from "@/utils/data.js";
export default {
  name: "feedback_send",
  mixins: [WatchScreen, MyValidate, MessageBox],
  inject: ["$main"],
  data() {
    return {
      ruleForm: {
        cion: "", // 图片地址
        title: "", // 标题
        content: "" // 内容
      },
      rules: {
        title: [
          // 请输入标题
          {
            required: true,
            message: "send_feedback.sendErrInfo.title",
            trigger: "blur"
          }
        ],
        content: [
          // 请输入内容
          {
            required: true,
            message: "send_feedback.sendErrInfo.content",
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    Upload,
    Editor
  },
  methods: {
    // 表单提交
    submitForm(formName) {
      let vm = this;
      let params;
      vm.myValidate(formName).then(err => {
        if (!!!err) {
          params = Object.assign({}, vm.ruleForm);
          vm.$main.loading = true;
          vm.$api.IBM_FEEDBACK_ADDFEED(params).then(res => {
            vm.$main.loading = false;
            if (res.code == 0) {
              vm.$main.fnGetNewsNum();
              // 发送成功
              vm.fnOpenMessageBox(
                vm.$t("send_feedback.sendErrInfo.success"),
                "success"
              );
              vm.$router.push(comData.conutry_type + "/user/home");
            } else {
              vm.fnOpenMessageBox(vm.$t(`errCode.${res.code}`), "error");
            }
          });
        } else {
          vm.fnOpenMessageBox(err, "error");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
