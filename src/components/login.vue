<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        label-width="80px"
        :model="login_form"
        class="login_from"
        :rules="loginFrom_rules"
        ref="loginFrom_ref"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="login_form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="login_form.password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <el-form-item class="tbs">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login_form: {
        username: "admin",
        password: "123456"
      },
      // 表单验证规则
      loginFrom_rules: {
        // 用户名校验规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ],
        // 密码校验规则
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetLogin() {
      // console.log(this)
      this.$refs.loginFrom_ref.resetFields();//对整个表单进行重置并移除校验结果
    },

    login() {
      // 登陆之前的预验证，
      this.$refs.loginFrom_ref.validate(valid => {
        console.log(valid); //验证结果返回boole
        if (!valid) return;
        this.$http.post("login", this.login_form).then(res => {
          if (res.data.meta.status == 200) {
            this.$message.success('登录成功')
            console.log(res.data)
            // 保存登录状态
            window.sessionStorage.setItem('token',res.data.data.token)
            // 登录成功后跳转页面
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败')
          }
        });
      });
    }
  }
};
</script>

<style lang='less' scoped>
.login_container {
  background: #2b4b62;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  .avater_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}
.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-right: 20px;
  box-sizing: border-box;
}
.tbs {
  display: flex;
  justify-content: flex-end;
}
</style>