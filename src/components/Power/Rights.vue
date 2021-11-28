<template>
  <div class="animate__animated animate__fadeIn">
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图-->
    <el-card >
      <div class="roles">
        <el-backtop target=".roles" :bottom="100">
          <div
            style="{
        height: 100%;
        width: 100%;
        opacity: .8;
        border-radius: 15px;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #f4b6ff;
      }"
          >
            UP
          </div>
        </el-backtop>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template v-slot="scope">
              <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
              <el-tag type="success" v-else-if="scope.row.level==='1'">二级权限</el-tag>
              <el-tag v-else type="warning">三级权限</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList() {
      const {data: res} = await this.$http.get('rights/list');
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败');
      this.rightsList = res.data;
    }
  }
}
</script>

<style scoped>
.roles {
  height: 67vh;
  overflow-x: hidden;
}
</style>