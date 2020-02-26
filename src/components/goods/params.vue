<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 顶部警告条 -->
      <el-col :span="24">
        <el-alert title="注意：只允许为第三级分类设置参数" type="warning" :closable="false" show-icon></el-alert>
      </el-col>
      <!-- 级联选择框 -->
      <div class="cascader">
        <span>选择商品分类:</span>
        <el-cascader
          v-model="selectParentKey"
          :options="caterList"
          :props="casCaterPropes"
          @change="handleChange"
        ></el-cascader>
      </div>
      <!-- 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTadsClick">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" size="mini" :disabled="isBtnDesabled">动态参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <el-button type="primary" size="mini" :disabled="isBtnDesabled">静态属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有分类列表
      caterList: [],
      //   选中的分类的ID数组
      selectParentKey: [],
      //   级联选择器的配置对象
      casCaterPropes: {
        //   选择器展开的方式
        expandTrigger: "hover",
        // 实际选中的项
        value: "cat_id",
        // 用户所看到的选中的项
        label: "cat_name",
        // 级联之间以哪个属性进行连接
        children: "children"
      },
      //   标签页默认选中的数据绑定
      activeName: "first"
    };
  },
  created() {
    this.getCaterList();
  },
  methods: {
    //   获取所有分类列表的数据
    async getCaterList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      console.log(res);
      this.caterList = res.data;
      console.log(this.caterList);
    },
    // 级联选择器选项发生改变的事件
    handleChange() {
      console.log(this.selectParentKey);
      // 如果长度不是3就说明选中的不是第三级，只允许用户设置第三级
      if (this.selectParentKey.length !== 3) {
        // 将双向绑定的数组重置
        this.selectParentKey = [];
        return;
      }
    },
    // tab切换的点击事件
    handleTadsClick() {}
  },
  computed: {
    //   计算属性，如果长度不等于3就说明用户没有选中第三级，则下方对应的按钮应该是禁用状态
    isBtnDesabled() {
      if (this.selectParentKey.length !== 3) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lange='less' scoped>
.cascader {
  margin-top: 50px;
}
</style>