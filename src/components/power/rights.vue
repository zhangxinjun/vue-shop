<template>
  <div>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题卡片区域 -->
    <el-card>
      <el-table :data="rightsList" stripe border style="width: 100%">
        <el-table-column type="index" lable='#'> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope='scope'>
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    getRightList() {
      this.$http.get("rights/list").then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取权限列表失败");
        } else {
          this.rightsList = res.data.data;
        }
      });
    }
  }
};
</script>

<style></style>
