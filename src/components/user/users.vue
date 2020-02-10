<template>
  <div>
      <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
                 <el-input placeholder="请输入内容" class="input-with-select"
                 v-model='queryInfo.query'
                 clearable
                 @clear='getUserList'>
                    <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
                 </el-input>
            </el-col>
            <el-col :span="6">
                <el-button type='primary'>添加用户</el-button>
            </el-col>
            
        </el-row>  
         <el-table
          :data="userList"
          stripe
          border
          style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="mobile"  label="电话" > </el-table-column>
            <el-table-column prop="role_name" label="角色"> </el-table-column>
            <el-table-column  label="状态">
                <template slot-scope="scope">
                    <!-- {{scope.row}}作用域插槽 获取当前行的所有参数 -->
                    <el-switch
                    v-model="scope.row.mg_state"
                     @change='changeStata(scope.row)'
                   >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width='190px'>
                <template slot-scope=scope >
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button> 
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    <el-tooltip content="角色分配" placement="top">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>

                </template>
            </el-table-column>               
        </el-table> 
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination> 
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //请求时传递的参数
            queryInfo:{
                // 搜索关键字
                query:'',
                // 第几页
                pagenum:1,
                // 每页显示的条数
                pagesize:2
            },
            userList:[],
            total:0
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        getUserList(){
            this.$http.get('users',{
                params:this.queryInfo
            
            }).then(res => {
                console.log(res.data.data)
                if(res.data.meta.status!==200){
                    this.$message.error('获取用户列表失败')
                }
                this.userList=res.data.data.users
                this.total=res.data.data.total
            })
        },
        // 每页条数改变
        handleSizeChange(newSize){
            console.log(newSize)
            this.queryInfo.pagesize=newSize
            this.getUserList()
        },
         
        // 第几页改变
        handleCurrentChange(newPage){
            console.log(newPage)

            this.queryInfo.pagenum=newPage
            this.getUserList()
        },
        // 状态栏的状态发生改变的时候
        changeStata(newState){
            console.log(newState)
            this.$http.put(`users/${newState.id}/state/${newState.mg_state}`).then(res => {
                console.log(res.data)
                if(res.data.meta.status!==200){
                    this.$message.error('状态修改失败')
                    this.newState.mg_state=!this.newState.mg_state
                }
                this.$message.success('状态修改成功')
            })
        }
       
    }
}
</script>

<style>

</style>