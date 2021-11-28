<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb class="animate__animated animate__fadeIn" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="试试搜索订单编号" v-model="queryInfo.query" clearable @keyup.enter="getOrderListAgree"
                    @input="getOrderListAgree" @clear="getOrderListAgree">
            <el-button class="searchBtn" slot="append" style="color: white!important;" icon="el-icon-search"
                       @click="getOrderListAgree"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div class="orderBody">
        <!--订单列表数据-->
        <el-table :data="orderlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status"></el-table-column>
          <el-table-column label="是否发货" prop="is_send">
            <template v-slot="scope">
              <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template v-slot="scope">
              {{ scope.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button class="mini-shadow-button-primary" type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
              <el-button class="mini-shadow-button-danger" type="danger" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    
    <!--修改地址的对话框-->
    <el-dialog
      @close="addressDialogClosed"
      title="修改地址"
      :modal-append-to-body="false"
      :visible.sync="addressVisible"
      width="40%">
      <!--添加分类的表单-->
      <el-form :model="addressForm" :rules="addressFormRules" :hide-required-asterisk="true"
               ref="addressFormRef"
               label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <button @click="addressDialogClosed" class="buttonReset">重 置</button>
    <button class="buttonPlease" @click="addressVisible = false">取 消</button>
    <button class="buttonConfirm">确 定</button>
  </span>
    </el-dialog>
  
    <!--展示物流进度的对话框-->
    <el-dialog
      title="物流进度"
      :modal-append-to-body="false"
      :visible.sync="progressDialogVisible"
      width="50%">
      <!--时间线-->
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.ftime">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
import {Debounce} from "../../utils/util";

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 物流信息
      progressInfo: [],
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{required: true, message: '请选择省市区县', trigger: 'blur'}],
        address2: [{required: true, message: '请填写详细地址', trigger: 'blur'}],
      },
      cityData,
      progressDialogVisible: false
    }
  },
  created() {
    this.getOrderList();
  },
  methods: {
    // 获取数据列表（节流）
    getOrderListAgree: Debounce(async function () {
      if (this.queryInfo.query === '') {
        this.$notify({
          message: '试试填写订单相关内容呢 😄',
          center: true,
          offset: 110,
          showClose: false
        })
      }
      await this.getOrderList();
    }, 600),
    async getOrderList() {
      const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取订单失败',
        center: true,
        offset: 110,
        showClose: false
      });
      this.orderlist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressBox() {
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      /*if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }*/
      // this.progressInfo = res.data
      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
      this.progressDialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../plugins/timeline/timeline.css";
@import "../../plugins/timeline-item/timeline-item.css";
.el-cascader {
  width: 100%;
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

.el-timeline {
  font-size: 16px!important;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-weight: bold;
}

.orderBody {
  height: 55vh;
  width: 100%;
  overflow-x: hidden;
}
</style>