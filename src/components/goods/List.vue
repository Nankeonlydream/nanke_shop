<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb class="animate__animated animate__fadeIn" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="试试搜索品优购" v-model="queryInfo.query" clearable @keyup.enter="getUserListAgree"
                    @input="getUserListAgree" @clear="getUserListAgree">
            <el-button class="searchBtn" slot="append" style="color: white!important;" icon="el-icon-search"
                       @click="getUserListAgree"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <button class="button" @click="goAddPage">添加商品</button>
        </el-col>
      </el-row>
      
      <div class="listBody">
        <!--table表格区域-->
        <el-table :data="goodslist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="105px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="160px">
            <template v-slot="scope">
              {{ scope.row.add_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template v-slot="scope">
              <el-button class="mini-shadow-button-primary" size="mini" type="primary" icon="el-icon-edit"
                         @click="goEditPage(scope.row.goods_id)"></el-button>
              <el-button class="mini-shadow-button-danger" size="mini" type="danger" icon="el-icon-delete"
                         @click="removeById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {Debounce} from "../../utils/util";

export default {
  name: "List",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取数据列表（防抖）
    getUserListAgree: Debounce(async function () {
      if (this.queryInfo.query === '') {
        this.$notify({
          message: '试试填写用户名称呢 😄',
          center: true,
          offset: 110,
          showClose: false
        })
      }
      await this.getGoodsList();
    }, 800),
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods', {params: this.queryInfo});
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取列表失败 😭',
        offset: 40,
        center: true,
        iconClass: ''
      });
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async removeById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回为字符串 confirm
      // 如果用户取消删除，则返回为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info({
        message: '已取消',
        offset: 40,
        center: true,
        iconClass: ''
      });
      // 发起删除用户的请求
      const {data: res} = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error({
        message: '删除失败',
        offset: 40,
        center: true,
        iconClass: ''
      });
      this.$message.success({
        message: '已删除',
        offset: 40,
        center: true,
        iconClass: ''
      });
      await this.getGoodsList();
    },
    goAddPage() {
      this.$router.push('/goods/add');
    },
    goEditPage(id) {
      this.$router.push({
        path: '/goods/edit',
        query: {id}
      })
    }
  }
}
</script>

<style scoped lang="scss">
.listBody {
  height: 55vh;
  width: 100%;
  overflow-x: hidden;
}
.searchBtn {
  border: none !important;
  border-radius: 0 !important;
  background: linear-gradient(90deg, #55efc4, #74b9ff) !important;
  box-shadow: 0 0 8px #90fedf !important;
  transition: all 0.2s ease-in-out;
  font-weight: 600 !important;
  font-size: 15px !important;
  opacity: .9;
  &:hover {
    box-shadow: 0 0 8px #55efc4, 0 0 8px #74b9ff !important;
  }
  &:active {
    box-shadow: 0 0 2px rgba(135, 222, 245, 0.86), -1px -1px 2px #74b9ff !important;
  }
}
.el-button--default {
  background: linear-gradient(180deg, rgba(37, 204, 247, 0.86), rgba(255, 250, 101, 0.69), #ffcccc);
  border: none;
  outline: none;
  
  &:hover {
    box-shadow: 0 0 8px rgba(66, 197, 230, 0.86), 0 0 8px rgba(252, 152, 152, 0.93);
  }
  
  &:active {
    box-shadow: 0 0 2px rgba(135, 222, 245, 0.86), inset -1px -1px 2px #fedddd;
  }
}

.el-icon-search {
  color: white !important;
}
</style>