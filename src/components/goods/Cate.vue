<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb class="animate__animated animate__fadeIn" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图区-->
    <el-card>
      <el-row>
        <el-col>
          <el-col style="display:flex;align-items: center;justify-content: space-around">
            <span class="titleForHeader" v-text="this.saying.english"></span>
            <span class="titleForHeader" v-text="this.saying.chinese"></span>
            <span class="titleForHeader" v-text="this.saying.form"></span>
            <button class="button" @click="showAddCateDialog">添加分类</button>
          </el-col>
        </el-col>
      </el-row>
      <div class="cateBody">
        <el-skeleton :rows="8" :loading="loading" animated>
          <!--表格-->
          <tree-table
            class="treeTable"
            :data="catelist"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            :is-fold="false"
            :show-index="true"
            border
            :show-row-hover="false"
          >
            <!--是否有效-->
            <template slot="isok" slot-scope="scope">
              <i style="color: #4cd137" class="el-icon-success
" v-if="scope.row.cat_deleted === false"></i>
              <i style="color: #eb4d4b" class="el-icon-error
" v-else></i>
            </template>
            <!--排序-->
            <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag size="mini" v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
              <el-tag v-else size="mini" type="warning">三级</el-tag>
            </template>
            <!--操作-->
            <template slot="opt" slot-scope="scope">
              <el-button class="mini-shadow-button-primary" size="mini" type="primary" icon="el-icon-edit"
                         @click="showEditCateDialog(scope.row.cat_id)">
                编辑
              </el-button>
              <el-button class="mini-shadow-button-danger" size="mini" type="danger" icon="el-icon-delete"
                         @click="removeCateById(scope.row.cat_id)">删除
              </el-button>
            </template>
          </tree-table>
        </el-skeleton>
      </div>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    
    <!--添加分类的对话框-->
    <el-dialog
      @close="addCateDialogClosed"
      title="添加分类"
      :modal-append-to-body="false"
      :visible.sync="addCateDialogVisible"
      width="45%">
      <!--添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" :hide-required-asterisk="true"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类列表：">
          <!--options 用来指定数据源-->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              ...cascaderProps,
              checkStrictly: 'true'
            }"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <button @click="addCateDialogClosed" class="buttonReset">重 置</button>
    <button class="buttonPlease" @click="addCateDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="addCate">确 定</button>
  </span>
    </el-dialog>
    <!--编辑分类的对话框-->
    <el-dialog
      title="修改用户"
      :modal-append-to-body="false"
      :visible.sync="editCateDialogVisible"
      width="45%">
      <!--内容主体区-->
      <el-form :model="editCateForm" :rules="editCateFormRules" :hide-required-asterisk="true" ref="editCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
    <button class="buttonPlease" @click="editCateDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="editCate">确 定</button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import computedTitle from '../../plugins/saying'
export default {
  name: "Cate",
  created() {
    this.getCateList();
    this.saying = computedTitle();
  },
  data() {
    return {
      loading: true,
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 1
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: 240
        },
        {
          label: '是否有效',
          // 表示将当前定义为模板列
          type: 'template',
          // 表示当前一列使用的模板名称
          template: 'isok',
          width: 100
        },
        {
          label: '分类排序',
          // 表示将当前定义为模板列
          type: 'template',
          // 表示当前一列使用的模板名称
          template: 'order',
          width: 100
        },
        {
          label: '分类操作',
          // 表示将当前定义为模板列
          type: 'template',
          // 表示当前一列使用的模板名称
          template: 'opt',
          width: 150
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 默认添加的等级是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类的名称😉',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      // 修改表单的分类对象
      editCateForm: {},
      // 修改表单的验证规则对象
      editCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类的名称😉',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改分类对话框的显示与隐藏
      editCateDialogVisible: false
    }
  },
  computed:{
    computedTitle(){
      let index = Math.floor(Math.random() * this.sayingList.length);
      return {
        english: this.sayingList[index].headerEN,
        chinese: this.sayingList[index].bodyCN,
        form: this.sayingList[index].formAu,
      }
    }
  },
  methods: {
    // 获取商品分类的数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.querInfo})
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败');
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
      this.loading = false
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮展示添加分类的对话框
    showAddCateDialog() {
      // 获取父级分类数据列表
      this.getParentCateList();
      // 展示对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories',
        {params: {type: 2}})
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取父级分类失败',
        offset: 40,
        center: true
      });
      this.parentCateList = res.data;
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // 如果 selectedKeys数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        // 父级分类的ID
        this.addCateForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error({
          message: '添加失败',
          offset: 40,
          center: true
        });
        this.$message.success({
          message: '添加成功',
          offset: 40,
          center: true
        });
        await this.getCateList();
        this.addCateDialogVisible = false;
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 展示编辑分类的对话框
    async showEditCateDialog(id) {
      const {data: res} = await this.$http.get(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: '查询失败',
          offset: 40,
          center: true
        });
      }
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
    // 修改分类信息并提交
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改分类的数据请求
        const {data: res} = await this.$http.put(`categories/${this.editCateForm.cat_id}`, {
          cat_name: this.editCateForm.cat_name
        });
        if (res.meta.status !== 200) return this.$message.error({
          message: '更新失败',
          offset: 40,
          center: true
        });
        // 关闭对话框
        this.editCateDialogVisible = false;
        // 刷新数据列表
        await this.getCateList();
        // 提示修改成功
        this.$message.success({
          message: '更新成功',
          offset: 40,
          center: true
        });
      })
    },
    // 根据ID删除分类
    async removeCateById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回为字符串 confirm
      // 如果用户取消删除，则返回为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info({
        message: '已取消',
        offset: 40,
        center: true
      });
      // 发起删除用户的请求
      const {data: res} = await this.$http.delete(`categories/${id}`);
      if (res.meta.status !== 200) return this.$message.error({
        message: '删除失败',
        offset: 40,
        center: true
      });
      this.$message.success({
        message: '删除成功',
        offset: 40,
        center: true
      });
      await this.getCateList();
    }
  }
}
</script>

<style scoped lang="scss">

.titleForHeader {
  font-family: 华文行楷;
  font-size: 22px;
  color: #2e2e2e !important;
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.cateBody {
  height: 55vh;
  width: 100%;
  overflow-x: hidden;
}

.treeTable {
  width: 1366px;
  margin-top: 20px !important;
}

.el-cascader {
  width: 100% !important;
}
</style>