<template>
  <transition name="fade">
    <div class="member_list inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <div class="item_title">{{ PAGE_NAME }}</div>
        <Info v-if="pageType == 'info'"></Info>
        <Grade v-if="pageType == 'grade'"></Grade>
        <Email v-if="pageType == 'email'"></Email>
        <Phone v-if="pageType == 'phone'"></Phone>
        <Ladder v-if="pageType == 'ladder'"></Ladder>
        <Password v-if="pageType == 'password'"></Password>
      </el-scrollbar>
    </div>
  </transition>
</template>
<script>
import Info from "./info";
import Grade from "./grade";
import Email from "./email";
import Phone from "./phone";
import Ladder from "./ladder";
import Password from './Password';
export default {
  name: "member_info",
  components: {
    Info,
    Grade,
    Email,
    Phone,
    Ladder,
    Password
  },
  provide() {
    return {
      p: this
    };
  },
  computed: {
    PAGE_NAME: function() {
      let vm = this;
      let val = vm.pageType;
      let obj = {
        list: vm.$t("admin.member_list"), // 会员列表
        info: vm.$t("admin.member_info"), // 会员信息
        grade: vm.$t("admin_feedback.changeGrade"), // 修改等级
        email: vm.$t("admin_feedback.changeEmail"), // 修改邮箱
        phone: vm.$t("admin_feedback.changePhone"), // 修改手机号
        ladder: vm.$t("admin_feedback.changeLadder"), // 修改用户上下级
        password: vm.$t("pass_manage.change_pass") // 修改密码
      };
      return obj[val];
    }
  },
  data() {
    return {
      pageType: this.$route.query.type, // 显示具体页面的状态 list 列表页  info 详情页  grade 等级
      info: {
        mobile: this.$route.query.mobile,
        user_id: this.$route.query.user_id
      } // 用户信息
    };
  },
  mounted() {
    let vm = this;
  }
};
</script>
<style lang="scss">
</style>
