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
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDesabled"
            @click="addTableDialogVisible=true"
          >添加动态参数</el-button>
          <!-- 动态参数表格区域 -->
          <el-table :data="manyTableList" stripe border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag  closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showSetDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDesabled"
            @click="addTableDialogVisible=true"
          >添加静态属性</el-button>
          <!-- 静态属性表格区域 -->
          <el-table :data="onlyTableList" stripe border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag  closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showSetDialog(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加的弹框 -->
    <el-dialog
      :title="'添加' + tableTitleText"
      :visible.sync="addTableDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addTableRuleForm"
        :rules="addTableRules"
        ref="addTableRuleForm"
        label-width="150px"
      >
        <el-form-item :label="'添加' + tableTitleText" prop="attr_name">
          <el-input v-model="addTableRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTableDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改的弹框 -->
    <el-dialog
      :title="'修改' + tableTitleText"
      :visible.sync="editTableDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editTableRuleForm"
        :rules="editTableRules"
        ref="editTableRuleForm"
        label-width="150px"
      >
        <el-form-item :label="'修改' + tableTitleText" prop="attr_name">
          <el-input v-model="editTableRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTableDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setParams">确 定</el-button>
      </span>
    </el-dialog>
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
      activeName: "many",
      //动态参数表格的数据
      manyTableList: [],
      // 静态属性表格的数据
      onlyTableList: [],
      // 控制添加的弹框的显示隐藏
      addTableDialogVisible: false,
      // 输入框的数据绑定对象
      addTableRuleForm: {
        attr_name: ""
      },
      // 表单的验证规则
      addTableRules: {
        attr_name: [
          { required: true, message: "请输入添加内容", trigger: "blur" }
        ]
      },
      // 控制修改对话框的显示隐藏
      editTableDialogVisible: false,
      // 修改对话框的数据绑定
      editTableRuleForm: {
        attr_name: ""
      },
      // 修改表单的验证规则
      editTableRules: {
        attr_name: [
          { required: true, message: "请输入添加内容", trigger: "blur" }
        ]
      }
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
    async handleChange() {
      // 调用获取列表参数的函数
      this.getCaterTableList();
    },
    // tab切换的点击事件
    handleTadsClick() {
      // console.log(this.activeName)
      // 调用获取列表参数的函数
      this.getCaterTableList();
    },
    // 获取参数列表的数据
    async getCaterTableList() {
      console.log(this.selectParentKey);
      // 如果长度不是3就说明选中的不是第三级，只允许用户设置第三级
      if (this.selectParentKey.length !== 3) {
        // 将双向绑定的数组重置
        this.selectParentKey = [];
        return;
      }
      // 发起请求获取当前的分类列表
      const { data: res } = await this.$http.get(
        `categories/${this.isCaterId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      // 对结果进行判断赋值之前首先对attr_vals进行处理，有字符串转换为数组以备后续tag标签使用
      res.data.forEach(item => {
        // 循环的时候判断一下该属性是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [] ;
      });
      console.log(res.data);

      if (this.activeName == "many") {
        // 满足条件说明当前激活的表格是动态参数表格
        this.manyTableList = res.data;
      } else {
        //反之就是静态属性的表格
        this.onlyTableList = res.data;
      }
    },
    // 添加的对话框的关闭事件
    addDialogClose() {
      // 重置表单并清除验证结果
      this.$refs.addTableRuleForm.resetFields();
    },
    // 添加的弹框的点击确认事件
    addParams() {
      // 首先对表单进行验证
      this.$refs.addTableRuleForm.validate(async valid => {
        if (!valid) return;
        // 验证通过发起对应的请求
        const { data: res } = await this.$http.post(
          `categories/${this.isCaterId}/attributes`,
          {
            attr_name: this.addTableRuleForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        // 请求成功重新调用参数函数
        this.getCaterTableList();
        // 关闭对话框
        this.addTableDialogVisible = false;
      });
    },
    // 点击修改按钮的事件
    async showSetDialog(attr_id) {
      // 根据插槽传过来的id以及计算属性中的id发起请求
      const { data: res } = await this.$http.get(
        `categories/${this.isCaterId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("查询参数失败");
      }
      // 返回的数据给表单的数据绑定对象
      this.editTableRuleForm = res.data;
      this.editTableDialogVisible = true;
    },
    // 修改的对话框的关闭事件
    editDialogClose() {
      // 对表单重置
      this.$refs.editTableRuleForm.resetFields();
    },
    // 修改的弹窗的确定事件
    setParams() {
      // 首先对表单进行验证
      this.$refs.editTableRuleForm.validate(async valid => {
        if (!valid) return;
        // 发起对应的请求
        const { data: res } = await this.$http.put(
          `categories/${this.isCaterId}/attributes/${this.editTableRuleForm.attr_id}`,
          {
            attr_name: this.editTableRuleForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.editTableDialogVisible = false;
        this.getCaterTableList();
      });
    },
    // 点击删除按钮的事件
    removeParams(attr_id) {
      // 出现带有确认的弹窗
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 用户点击了确认按钮
          this.$http
            .delete(`categories/${this.isCaterId}/attributes/${attr_id}`)
            .then(res => {
              if (res.data.meta.status !== 200) {
                return this.$message.error("删除参数失败");
              }
              this.$message.success("删除参数成功");
              this.getCaterTableList();
            });
        })
        .catch(() => {
          // 用户点击了取消按钮
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  // 计算属性
  computed: {
    //   计算属性，如果长度不等于3就说明用户没有选中第三级，则下方对应的按钮应该是禁用状态
    isBtnDesabled() {
      if (this.selectParentKey.length !== 3) {
        return true;
      }
      return false;
    },
    // 分类列表发起请求所需要的id
    isCaterId() {
      // 如果长度等于3就说明用户选择了3级分类
      if (this.selectParentKey.length == 3) {
        // 数组的最后一项就是第三级分类的id
        return this.selectParentKey[2];
      }
      // 用户没有选择三级分类，就返回一个null
      return null;
    },
    // 表单前面的显示的文本
    tableTitleText() {
      if (this.activeName == "only") {
        return "静态属性";
      } else {
        return "动态参数";
      }
    }
  }
};
</script>

<style lange='less' scoped>
.cascader {
  margin-top: 50px;
}
.el-tag{
  margin: 10px
}
</style>