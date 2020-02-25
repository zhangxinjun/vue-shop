<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-col :span="24">
        <el-button type="primary" @click="addCaterShow">添加分类</el-button>
      </el-col>
      <!--表格区域 https://github.com/MisterTaki/vue-table-with-tree-grid -->
      <tree-table
        class="TreeTable"
        :data="catreList"
        border
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:blue"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
      <!-- 添加商品的弹窗 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCaterDialogVisible"
        width="50%"
        @close="addCaterClose"
      >
        <!--  -->
        <el-form
          :model="addCaterRuleForm"
          :rules="addCaterRules"
          ref="addCaterRuleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCaterRuleForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- 级联选择器 -->
            <el-cascader
              expand-trigger="hover"
              v-model="selectParentKey"
              :options="parentsList"
              :props="casCaterPropes"
              @change="handleChange"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCaterDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCater">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 请求携带的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //   商品列表
      catreList: [],
      //   总条数
      total: 0,
      //   表格具体内容对应
      columns: [
        {
          //   列标题名称
          label: "分类名称",
          //  对应列内容的属性名
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          //   作用域插槽，当前列定义为模板列
          type: "template",
          //   插槽的名称
          template: "isOk"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      //   控制添加的弹窗的出现于隐藏
      addCaterDialogVisible: false,
      //   表单数据对象
      addCaterRuleForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      //   表单验证规则
      addCaterRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //   所有父级列表数据
      parentsList: [],
      //   选中的父级分类的ID数组
      selectParentKey: [],
      //   级联选择器的配置对象
      casCaterPropes: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getCaterList();
  },
  methods: {
    async getCaterList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.catreList = res.data.result;
      this.total = res.data.total;
    },
    // 监听每页条数变化
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize;
      this.getCaterList();
    },
    // 监听当前页码变化
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent;
      this.getCaterList();
    },
    // 点解添加分类按钮
    addCaterShow() {
      // 点击按钮时首先获取所有的父级列表数据
      this.gitParentsList();
      this.addCaterDialogVisible = true;
    },
    // 获取所有父级分类的列表
    async gitParentsList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级列表失败");
      }
      this.parentsList = res.data;
    },
    // 级联选择器的选项发生变化的事件
    handleChange() {
      //   console.log(this.selectParentKey);
      //   如果长度大于1就说明用户有选择父级
      if (this.selectParentKey.length) {
        //   当前选择的父级id
        this.addCaterRuleForm.cat_pid = this.selectParentKey[
          this.selectParentKey.length - 1
        ];
        //   当前添加分类的等级id
        this.addCaterRuleForm.cat_level = this.selectParentKey.length;
        return;
      } else {
        //   说明用户没有选择父级id，用户添加的是等级最高的分类
        this.addCaterRuleForm.cat_pid = 0;
        this.addCaterRuleForm.cat_level = 0;
      }
    },
    // 添加分类的弹框的确定按钮事件
    addCater() {
      // 点击按钮时首先对表单进行验证
      this.$refs.addCaterRuleForm.validate(async valid => {
        if (!valid) {
          return;
        }
       const {data:res} = await this.$http.post("categories", this.addCaterRuleForm);
       if(res.meta.status !== 201){
           return this.$message.error('添加分类失败')
       }
       this.$message.success("添加分类成功")
       this.getCaterList()
       this.addCaterDialogVisible = false;
      });
      
    },
    // 添加分类的表单的关闭事件
    addCaterClose() {
      // 重置表单
      this.$refs.addCaterRuleForm.resetFields();
      // 将级联选择器绑定的数据清空
      this.selectParentKey = [];
      // 将表单的数据对象重置
      this.addCaterRuleForm.cat_pid = 0;
      this.addCaterRuleForm.cat_level = 0;
    }
  }
};
</script>

<style lange='less' scoped>
.TreeTable {
  margin-top: 60px;
}
.el-cascader {
  width: 100%;
}
</style>