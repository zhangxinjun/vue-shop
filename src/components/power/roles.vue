<template>
  <div>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主题卡片区域 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <el-table :data="rolesList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              :class="['bdbottom', index1 == 0 ? 'bdtop' : '', 'ycenter']"
              v-for="(item1, index1) in props.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="removeRolesById(props.row, item1.id)"
                >{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限及三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 == 0 ? '' : 'bdtop', 'ycenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.index"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesById(props.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRolesById(props.row, item3.id)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                {{ props.row.children }}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" lable="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="描述" style="width: 300px">
          <template slot-scope='scope'>
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRoles(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" >
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys=defaultKeys ref='treeRef'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 控制权限的弹窗
      dialogVisible:false,
      // 所有权限列表
      rightsList:[],
      // 树形控件的
      treeProps:{
         children: 'children',
          label: 'authName'
      },
      // 默认选中的key的id的数组
      defaultKeys:[],
      // 当前角色的id
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      this.$http.get("roles").then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        this.rolesList = res.data.data;
      });
    },
    // 点击删除图标的事件
    removeRolesById(roles, rightsId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("点击了确认");
          // 根据角色id以及权限id删除该权限
          this.$http
            .delete(`roles/${roles.id}/rights/${rightsId}`)
            .then(res => {
              console.log(res.data);
              if (res.data.meta.status !== 200) {
                return this.$message.error("删除权限失败");
              } else {
                this.$message.success("删除权限成功");
                // 不重新请求数据，重新请求会造成整个表格重新渲染
                // this.getRolesList()
                // 返回的data就是最新的权限列表，将其重新赋值给roles.children
                roles.children = res.data.data;
              }
            });
        })
        .catch(() => {
          this.$message.info("取消了删除操作");
        });
    },
    // 点击分配权限按钮的事件
    setRoles(node){
      // 保存当前角色的id
      this.roleId=node.id
      // 点击按钮首先获取所有权限 的树状列表
      this.$http.get('rights/tree').then(res => {
        // console.log(res.data)
        if(res.data.meta.status !== 200){
          return this.$message.error('获取权限列表失败')
        }
        // 在弹窗出现之前调用递归得到当前角色的三级权限id
        this.getLefKeys(node,this.defaultKeys)
        this.rightsList=res.data.data
      })
      // 控制权限的弹窗
      this.dialogVisible=true
    },
    // 通过递归的形式获取角色下获取所有三级权限的id并保存到defaultKeys数组中
    getLefKeys(node,arr){
      // 首先判断是否为第三级权限，第三级权限没有children属性
      if(!node.children){
        // 是第三级权限
        return arr.push(node.id)
      }
      // 不是第三级权限，通过递归的方式得到第三级权限
      node.children.forEach(item => {
        this.getLefKeys(item,arr)
      })
    },
    // 分配权限的弹窗的点击确定按钮的事件
    setDialogRights(){
      // 把所有全选以及半选中的节点通过解构赋值放到一个数组中，等下调用接口的时候使用
      const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      // 将数组转化成字符串
      const idStr=keys.join(",")
      this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res => {
        console.log(res.data)
        if(res.data.meta.status!==200){
         return this.$message.error("分配权限失败")
        }
        this.$message.success("分配权限成功")
        // 成功后重新获取权限列表
        this.getRolesList()
        // 关闭弹窗
        this.dialogVisible=false
      })
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.ycenter {
  display: flex;
  align-items: center;
}
</style>
