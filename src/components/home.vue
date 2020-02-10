<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="tog-button" @click="toggleCollaps">|||</div>
        <el-col>
          <el-menu
            background-color="#364136"
            text-color="#fff"
            active-text-color="#409bff"
            :collapse="isCollapse"
            :collapse-transition="false"
            unique-opened
            :router="true"
            :default-active="activePath"
          >
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id" >
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item
                :index="'/'+subItem.path "
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveActive('/'+subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [], //左侧菜单列表
      iconObj: {
        "125": "iconfont icon-yonghu",
        "103": "iconfont icon-lifangtilitiduomiantifangkuai",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-icon--copy",
        "145": "iconfont icon-shuju"
      },
      //是否折叠
      isCollapse: false,
      activePath:''
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    getMenuList() {
      this.$http.get("menus").then(res => {
        // console.log(res)
        if (res.status == 200) {
          this.menuList = res.data.data;
        } else {
          alert("获取菜单列表失败");
        }
      });
    },
    toggleCollaps() {
      this.isCollapse = !this.isCollapse;
    },
    saveActive(activePath){
      // 保存二级菜单的激活状态
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
  created() {
    this.getMenuList(); //获取左侧菜单列表
    this.activePath=window.sessionStorage.getItem('activePath')//获取当前激活的菜单的path
  }
};
</script>

<style lang='less' scoped>
.home_container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.el-header {
  background: #475547;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
    }
  }
}
.el-aside {
  background: #364136;
  .el-menu {
    border: none;
  }
}
.el-main {
  background: #9fad9f;
}
.tog-button {
  background: #606960;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2rem;
}
</style>