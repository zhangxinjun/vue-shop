<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
// import _ from 'lodash'
export default {
  data() {
    return {
        // 接口中提供的需要合并的数据
         options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    };
  },
  //   此钩子dom还没有渲染完成
  created() {},
  //   必须在dom渲染完成之后
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // dom准备完成之后发起请求得到数据
    const {data:res} = await this.$http.get("reports/type/1");
    // 指定图表的配置项和数据
    // 将要合并的数据与后台返回的数据进行合并，不合并的话图标没有鼠标跟随的效果
   const reslt = Object.assign(this.options,res.data)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(reslt);
  },
  methods: {},
  computed: {}
};
</script>

<style lange='less' scope>
</style>