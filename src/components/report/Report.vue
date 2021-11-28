<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb class="animate__animated animate__fadeIn" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图区-->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 100%;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  name: "Report",
  data() {
    return {
      // 需要合并的数据
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
    }
  },
  created() {
  
  },
  methods: {},
  // 挂载之后此时页面上的元素渲染完毕
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    const {data: res} = await this.$http.get('reports/type/1');
    if (res.meta.status !== 200) return this.$message.error('获取折线图数据失败');
    // 4. 准备数据和配置项(将两个对象合并成一个新对象)
    const result = _.merge(res.data, this.options);
    // 展示数据
    myChart.setOption(result);
  }
}
</script>

<style scoped>

</style>