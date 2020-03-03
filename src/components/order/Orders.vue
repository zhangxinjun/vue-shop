<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column label="下单时间" width="150">
          <!-- 使用创建的时间过滤器处理时间 -->
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="addressShow"></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="progressShow"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 点击修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="addressDialogClose"
    >
      <el-form
        :model="addressrRuleForm"
        :rules="addressrRules"
        ref="addressrRuleForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="addressr1">
          <!-- <el-input v-model="addressrRuleForm.addressr1"></el-input> -->
          <el-cascader
            v-model="addressrRuleForm.addressr1"
            :options="cityData"
            :props="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addressr2">
          <el-input v-model="addressrRuleForm.addressr2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 时间线组件 -->
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in progressList"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 引入省市区js
import cityData from "./citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      // 控制修改地址的对话框
      addressDialogVisible: false,
      // 修改地址的表单的数据绑定
      addressrRuleForm: {
        addressr1: [],
        addressr2: ""
      },
      // 修改地址的表单验证
      addressrRules: {
        addressr1: [
          { required: true, message: "请选择省市区", trigger: "blur" }
        ],
        addressr2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      // 引入的省市区，同时也是省市区的数据来源
      cityData: cityData,
      // props的对象
      options: {
        expandTrigger: "hover",
        value: "value",
        label: "label",
        children: "children"
      },
      // 控制物流进度对话框的显示与隐藏
      progressDialogVisible: false,
      // 物流信息列表
      progressList: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //   获取订单列表的数据
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 每页条数变化的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 当前页码变化的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 点击修改地址的按钮
    addressShow() {
      this.addressDialogVisible = true;
    },
    // 级联选择器发生变化的事件
    handleChange() {},
    // 修改地址是对话框的关闭事件
    addressDialogClose() {
      this.$refs.addressrRuleForm.resetFields();
    },
    // 点击物流进度按钮
    async progressShow() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败");
      }
      this.progressList = res.data;
      console.log(this.progressList);
      this.progressDialogVisible = true;
    }
  },
  computed: {}
};
</script>

<style lange='less' scope>
.el-cascader {
  width: 100%;
}
</style>