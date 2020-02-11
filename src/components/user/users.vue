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
                <el-button type='primary' @click="dialogVisible = true">添加用户</el-button>
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
    <!-- 弹出框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="dialogVisible"
    width="50%"
    
    @close='addUserClose'>
        <el-form :model="ruleForm" :rules="addUserRules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
                <el-input v-model='ruleForm.name'></el-input>
            </el-form-item>
            <el-form-item label="密码"  prop="password">
                <el-input v-model='ruleForm.password' type="password"></el-input>
              
            </el-form-item>
             <el-form-item label="邮箱" prop="email">
                <el-input v-model='ruleForm.email'></el-input>
              
            </el-form-item>
             <el-form-item label="手机号" prop="mobile">
                <el-input v-model='ruleForm.mobile'></el-input>
              
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
    data(){
        // 邮箱的自定义验证
         var checkEmail=(rule,value,callback )=>{
                const regEmail= /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
                if(regEmail.test(value)){
                  return  callback()//验证通过直接return
                }
                 callback(new Error('请输入合法的邮箱'))//验证没有通过，提示的信息
            };
            // 手机号的自定义校验
            var checkCall=(rule,value,callback)=>{
                const regCall=/^1[3456789]\d{9}$/
                if(regCall.test(value)){
                    return callback()
                }
                callback(new Error('请输入合法的手机号'))
            };
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
            total:0,
           
            //控制弹出框的出现隐藏
            dialogVisible:false,
            // 表单验证规则
            addUserRules:{
                 name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    {required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }

                ],
                email:[
                    {required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator:checkEmail,trigger: 'blur'}
                ],
                mobile:[
                     {required: true, message: '请输入电话号码', trigger: 'blur' },
                    {validator:checkCall,trigger: 'blur'}

                ]
            },
            //输入框的双向绑定对象
             ruleForm: {
                name: '',
                password: '',
                email:'',
                mobile:''
            },
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
        },
        // 弹出框的关闭事件
        addUserClose(){
            // 弹出框关闭的时候重置表单
            this.$refs.ruleForm.resetFields()
        },
        // 点击确定按钮时添加用户
       addUser(){
        //    首先对表单进行预先验证，验证成功后发起请求
            this.$refs.ruleForm.validate(valida => {
            // console.log(valida)
            if(!valida){
                return 
            }
            this.$http.post('users',{
                username:'this.ruleForm.name',
                password:'this.ruleForm.password',
                email:'this.ruleForm.email',
                mobile:'this.ruleForm.mobile'
            }).then(res =>{
                console.log(res.data)
                console.log(this.ruleForm)
                if(res.data.meta.status==201){
                    this.$message.success( '恭喜你，添加用户成功' )
                    this.dialogVisible=false
                    this.getUserList()
                    
                }else{
                   this.$message.error('添加用户失败');

                }

            })

            })
       }
    }
}
</script>

<style>

</style>