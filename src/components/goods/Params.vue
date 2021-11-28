<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb class="animate__animated animate__fadeIn" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图区-->
    <el-card>
      <el-alert
        title="💖 注意：只允许为第三级分类设置相关参数！💌 "
        type="info"
        center
        :closable="false"
      >
      </el-alert>
      <!--选择商品分类区-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择的分类：</span>
          <!--选择商品分类级联选择框-->
          <el-cascader
            clearable
            v-model="selectedCateKeys"
            :options="catelist"
            :props="{ expandTrigger: 'hover',...cateProps }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <div class="params">
        <!--tab 页签区-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!--添加动态参数的面板-->
          <el-tab-pane label="动态参数" name="many">
            <!--添加参数的按钮-->
            <el-button class="button" style="margin: 5px 0 0 5px" :disabled="isBtnDisabled"
                       @click="addDialogVisible=true"><span style="margin: -5px 0 0 -5px">添加参数</span>
            </el-button>
            <!--动态参数表格-->
            <el-table :data="manyTableData" border stripe>
              <!--展开行-->
              <el-table-column type="expand">
                <template v-slot="scope">
                  <!--循环渲染Tag标签-->
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                    {{ item }}
                  </el-tag>
                  <!--输入文本框-->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="$event.target.blur(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!--添加的按钮-->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">News</el-button>
                </template>
              </el-table-column>
              <!--索引列-->
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button class="mini-shadow-button-primary" size="mini" type="primary" icon="el-icon-edit"
                             @click="showEditDialog(scope.row.attr_id)">
                    编辑
                  </el-button>
                  <el-button class="mini-shadow-button-danger" size="mini" type="danger" icon="el-icon-delete"
                             @click="removeParams(scope.row.attr_id)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--添加静态属性的面板-->
          <el-tab-pane label="静态属性" name="only">
            <!--添加属性的按钮-->
            <el-button class="button" size="mini" style="margin: 5px 0 0 5px" :disabled="isBtnDisabled"
                       @click="addDialogVisible=true"><span style="padding-top: 3px!important;">添加属性</span></el-button>
            <!--静态参数表格-->
            <el-table :data="onlyTableData" border stripe>
              <!--展开行-->
              <el-table-column type="expand">
                <template v-slot="scope">
                  <!--循环渲染Tag标签-->
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                    {{ item }}
                  </el-tag>
                  <!--输入文本框-->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="$event.target.blur(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!--添加的按钮-->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">News</el-button>
                </template>
              </el-table-column>
              <!--索引列-->
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button class="mini-shadow-button-primary" size="mini" type="primary" icon="el-icon-edit"
                             @click="showEditDialog(scope.row.attr_id)">
                    编辑
                  </el-button>
                  <el-button class="mini-shadow-button-danger" size="mini" type="danger" icon="el-icon-delete"
                             @click="removeParams(scope.row.attr_id)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    
    </el-card>
    <!--添加参数的对话框-->
    <el-dialog
      :modal-append-to-body="false"
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="45%"
      @close="addDialogClosed"
    >
      <!--内容主体区-->
      <el-form :model="addForm" :rules="addFormRules" :hide-required-asterisk="true" ref="addFormRef"
               label-width="90px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <button class="buttonReset" @click="addDialogClosed">重 置</button>
    <button class="buttonPlease" @click="addDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="addParams">确 定</button>
  </span>
    </el-dialog>
    <!--修改参数的对话框-->
    <el-dialog
      :modal-append-to-body="false"
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="45%"
    >
      <!--内容主体区-->
      <el-form :model="editForm" :rules="editFormRules" :hide-required-asterisk="true" ref="editFormRef"
               label-width="90px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
    <button class="buttonPlease" @click="editDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="editParams">确 定</button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品分类列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [{required: true, message: '请输入用户邮箱', trigger: 'blur'}]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [{required: true, message: '请输入用户邮箱', trigger: 'blur'}]
      }
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 如果按钮被禁用则返回true，否则返回false
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    // 当前选中的三级分类的ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性';
    }
  },
  methods: {
    // 获取所有商品的分类列表
    async getCateList() {
      const {data: res} = await this.$http.get('categories');
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取商品列表失败',
        offset: 40,
        center: true
      });
      this.catelist = res.data;
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      this.getParamsData();
    },
    // tab页签点击处理函数
    handleTabClick() {
      this.getParamsData();
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        this.$message.error({
          message: '请选择三级分类',
          offset: 40,
          center: true
        })
        return
      }
      // 证明选中的是三级分类
      // 根据所选分类的ID和当前所处的面板获取对应的参数
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}});
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取参数列表失败',
        offset: 40,
        center: true
      });
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 201) return this.$message.error({
          message: '添加失败',
          offset: 40,
          center: true
        })
        this.$message.success({
          message: '添加成功',
          offset: 40,
          center: true
        });
        this.addDialogVisible = false;
        await this.getParamsData();
      })
    },
    // 点击按钮，展示修改按钮的对话框
    async showEditDialog(attrId) {
      // 查询当前参数的信息
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {params: {attr_sel: this.activeName}})
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取参数信息失败',
        offset: 40,
        center: true
      });
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击按钮修改参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 200) return this.$message.error({
          message: '修改失败',
          offset: 40,
          center: true
        });
        this.$message.success({
          message: '修改成功',
          offset: 40,
          center: true
        });
        await this.getParamsData();
        this.editDialogVisible = false;
      })
    },
    // 根据ID删除对应的参数项
    async removeParams(attrId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
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
      const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`);
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
      await this.getParamsData();
    },
    // 文本框失去焦点，或按下enter都会触发此事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = '';
        row.inputVisible = false;
        return
      }
      // 如果没有return需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false;
      // 需要发起请求保存这次操作
      this.saveAttrVals(row);
    },
    // 将对 attr_vals 的操作保存到数据库
    async saveAttrVals(row) {
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      });
      if (res.meta.status !== 200) return this.$message.error({
        message: '修改失败',
        offset: 40,
        center: true
      });
      this.$message.success({
        message: '修改成功',
        offset: 40,
        center: true
      });
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick页面重新渲染之后，才会执行回调函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  }
}
</script>

<style scoped lang="scss">
.cat_opt {
  margin: 15px 0;
  
  span {
    font-size: 16px !important;
    font-family: 楷体;
    font-weight: bold;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  .el-cascader {
    min-width: 280px !important;
  }
}

.el-tag {
  margin: 10px;
}

.button-new-tag, .input-new-tag {
  margin-left: 10px;
  border: none !important;
  border-radius: 5px !important;
  background: linear-gradient(90deg, #ffcccc, rgba(24, 220, 255, 0.64)) !important;
  box-shadow: 0 0 8px #99c4d0 !important;
  transition: all 0.2s ease-in-out !important;
  color: #fff !important;
  height: 31.8px;
  width: 88px;
  font-size: 15px !important;
  padding: 1px 0 0 0 !important;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.button-new-tag:hover {
  color: #fff !important;
  box-shadow: -1px -1px 12px rgba(255, 204, 204, 0.78), 2px 2px 10px rgba(24, 220, 255, 0.62) !important;
}

.input-new-tag {
  width: 140px;
}

.params {
  height: 54vh;
  width: 100%;
  overflow-x: hidden;
}

</style>