<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域  -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="+active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab标签区域 -->
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="addRuleFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="active"
          :before-leave="befortTabLeave"
          @tab-click="tableClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addRuleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addRuleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addRuleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addRuleForm.goods_cat"
                :options="caterList"
                :props="options"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item) in tabManyData" :key="item.attr_id">
              <!-- 复选框区域 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="ab" v-for="(ab,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in tabOnlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="actionURL"
              :headers="actionHeader"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handerSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addRuleForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnadd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览的对话框 -->

    <el-dialog title="图片预览" :visible.sync="imgdDialogVisible" width="50%">
      <img :src="imgURL" alt="预览图片" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 引入loadsh
import _ from "lodash";
export default {
  data() {
    return {
      // 步骤条与tab标签激活状态的数据绑定
      active: "0",
      //   表单的数据绑定对象
      addRuleForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        // 级联选择器选中是数据绑定
        goods_cat: [],
        // 上传图片的临时路径
        pics: [],
        // 商品介绍，同时是富文本编辑器的双向数据绑定对象
        goods_introduce: "",
        attrs: []
      },
      //   表单验证规则
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "必须为数字值" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { type: "number", message: "必须为数字值" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { type: "number", message: "必须为数字值" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      //   所有分类列表的数据
      caterList: [],
      //   级联选择器
      options: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 动态商品参数列表
      tabManyData: [],
      // 静态商品属性列表
      tabOnlyData: [],
      // 上传图片的提交地址
      actionURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      // 图片上传的请求头
      actionHeader: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 控制图片预览的对话框的显示与隐藏
      imgdDialogVisible: false,
      // 预览图片的路径
      imgURL: ""
    };
  },
  created() {
    this.getCaterList();
  },
  methods: {
    //   获取分类列表的数据
    async getCaterList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.caterList = res.data;
    },
    // 级联选择器选项方式变化的事件
    handleChange() {
      // console.log(this.addRuleForm.goods_cat)
      // 只允许用户选择第三级分类
      if (this.addRuleForm.goods_cat.length !== 3) {
        this.addRuleForm.goods_cat = [];
      }
    },
    // tab标签切换之前会触发的事件
    befortTabLeave(activeName, oldActiveName) {
      // 函数可以得到离开的name，以及进入的name
      // console.log(activeName,oldActiveName)
      // 判断当前离开的name是0的话就说明是从第一个tab离开的，同时判断级联选择器的绑定，判断用户是否选择了3级分类，如果没有的话就return  false组织tab切换
      if (oldActiveName == "0" && this.addRuleForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // tab标签点击的事件
    async tableClick() {
      // 点击的时候可以得到当前点击的tab的name
      console.log(this.active);
      // 说明用户点击的是商品参数标签
      if (this.active == 1) {
        // 发起请求得到对应的商品参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品参数失败");
        }

        // 赋值之前对结果进行处理
        res.data.forEach(item => {
          // 如果有长度就切割转换成数组，没有长度就直接返回空数组
          return (item.attr_vals = item.attr_vals.length
            ? item.attr_vals.split(" ")
            : []);
        });
        // console.log(res.data)
        this.tabManyData = res.data;
      } else if (this.active == 2) {
        // 说明用户点击的是商品属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品属性失败");
        }
        // console.log(res.data);
        this.tabOnlyData = res.data;
      }
    },
    // 显示上传图片的预览效果
    handlePreview(flie) {
      // 得到将要预览的图片信息
      console.log(flie);
      // 得到预览图片的完整地址，并将其赋值
      this.imgURL = flie.response.data.url;
      // 显示对话框
      this.imgdDialogVisible = true;
    },
    // 移除图片的预览效果
    handleRemove(flie) {
      // 得到将要移除的图片的信息
      // console.log(flie);
      //得到要移除的图片的路径
      const fliePath = flie.response.data.tmp_path;
      // 返回数组中满足条件的索引值,并将其赋值给变量
      const i = this.addRuleForm.pics.findIndex(index => {
        //  相等就说明这个索引是将要删除的图片的索引
        index == fliePath;
      });
      // 将改图片从数组中删除
      this.addRuleForm.pics.splice(i, 1);
      // console.log(this.addRuleForm.pics)
    },
    // 上传成功时触发的函数
    handerSuccess(response) {
      // 得到成功时候的返回值
      // console.log(response)
      // 将成功时候返回的图片临时地址push到数组中
      const picInfo = { pic: response.data.tmp_path };
      this.addRuleForm.pics.push(picInfo);
      // console.log(this.addRuleForm.pics)
    },
    // 点击添加按钮的事件
    add() {
      // 首先对表单进行验证
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请完善表单后再添加");
        }
        // 通过lodash将addRuleFrom进行深拷贝 因为goods_cat现在是数组，发起请求时要求是字符串，但是级联选择器又和它进行了双向绑定，级联选择器要求goods_cat是数组，因此将其进行深拷贝一份，防止两者之间相互干扰
        const deep = _.cloneDeep(this.addRuleForm);
        // 将goods_cat由数组转化成字符串
        deep.goods_cat = deep.goods_cat.join(",");
        // console.log(this.tabManyData,this.tabOnlyData);
        // 将静态参数以及动态属性处理成符合请求要求的格式
        this.tabManyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.addRuleForm.attrs.push(newInfo);
        });
        this.tabOnlyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addRuleForm.attrs.push(newInfo);
        });
        // 将出来好的静态参数以及动态属性赋值给深拷贝出来的deep
        deep.attrs = this.addRuleForm.attrs;
        console.log(deep);
        // 请求所需参数处理完成，发起请求
        const { data: res } = await this.$http.post("goods", deep);
        if(res.meta.status !== 201){
          return this.$message.error("添加商品失败")
        }
        this.$message.success("添加商品成功")
        // 添加成功后跳转至商品列表页面
        this.$router.push("/goods")
      });
    }
  },
  computed: {
    //计算属性，商品分类的三级id
    cateId() {
      if (this.addRuleForm.goods_cat.length == 3) {
        return this.addRuleForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scope>
.el-steps {
  margin: 20px 0;
}
.el-step__title {
  font-size: 14px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnadd {
  margin-top: 15px !important;
}
</style>