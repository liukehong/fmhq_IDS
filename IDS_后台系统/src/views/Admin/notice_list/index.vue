<template>
  <transition name="fade">
    <div class="inner_wrap" style="overflow: hidden;">
      <el-scrollbar style="height: 100%;">
        <div class="item_title">{{ PAGE_NAME }}</div>
        <div class="item_box">
          <List v-if="pageType == 'list'"></List>
          <Add v-if="pageType == 'add'"></Add>
          <Edit v-if="pageType == 'edit'"></Edit>
        </div>
      </el-scrollbar>
    </div>
  </transition>
</template>
  <script>
import List from "./list.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
export default {
  name: "notice_list",
  components: {
    List,
    Add,
    Edit
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
        list: vm.$t("admin.notice_list"), // 公告列表
        add: vm.$t("notice_list.add"), // 添加公告
        edit: vm.$t("admin.notice_detail") // 公告详情
      };
      return obj[val];
    }
  },
  data() {
    return {
      pageType: "list",
      info: "" // 反馈详情
    };
  },
  mounted: function() {},
  methods: {}
};
</script>
<style lang="scss">
</style>
