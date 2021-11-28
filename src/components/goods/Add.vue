<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb class="animate__animated animate__fadeIn" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图-->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon :closable="false">
      </el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      
      <div class="addBody">
        <!--tab栏区域-->
        <el-form :model="addForm"
                 :rules="addFormRules"
                 ref="addFormRef"
                 label-width="100px"
                 label-position="top"
        >
          <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price" type="number">
                <el-input v-model="addForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <!--options 用来指定数据源-->
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="catelist"
                  :props="{
              expandTrigger: 'hover',
              ...cateProps,
              checkStrictly: 'true'
            }"
                  @change="handleChange"
                  clearable
                >
                </el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <!--渲染表单的Item项-->
              <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                <!--复选框组-->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!--图片上传组件-->
              <!--action要上传到的API地址-->
              <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headerObj"
                :on-success="handleSuccess"
                list-type="picture">
                <button class="buttonPlease" style="margin: 5px 0 5px 5px;font-size: 15px">点击上传</button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!--富文本编辑器组件-->
              <quill-editor v-model.lazy.trim="addForm.goods_introduce"></quill-editor>
              <!--添加商品的按钮-->
              <el-button @click="add" ref="submit" style="margin: 15px 0 5px 5px;font-weight: bold" class="addButton">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </el-card>
    
    <!--图片预览-->
    <el-dialog title="图片预览"
               :modal-append-to-body="false"
               :visible.sync="previewVisible"
               width="40%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: "Add",
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      // 添加商品的验证规则对象
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称 😊',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格 😄',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量 😁',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量 😉',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      // 商品分类列表
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览的地址
      previewPath: '',
      // 预览窗口
      previewVisible: false
    }
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品分类的数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.querInfo})
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取列表失败',
        offset: 40,
        center: true
      });
      this.catelist = res.data
    },
    // 级联选择器选中项变化,会触发这个函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        this.$message.error({
          message: '请选择三级分类 😉',
          offset: 40,
          center: true
        })
      }
    },
    // 阻止标签跳转
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error({
          message: '请选择商品分类',
          offset: 40,
          center: true
        })
        return false
      }
    },
    // 点击标签获取数据
    async tabClicked() {
      // 证明访问动态参数面板
      if (this.activeIndex === '1') {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}});
        if (res.meta.status !== 200) return this.$message.error({
          message: '获取动态参数列表失败',
            offset: 40,
            center: true
        });
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
        })
        this.manyTableData = res.data;
      } else if (this.activeIndex === '2') {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}});
        if (res.meta.status !== 200) return this.$message.error({
          message: '获取动态参数列表失败',
          offset: 40,
          center: true
        });
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中，找到这个图片的对应索引值
      const i = this.addForm.pics.findIndex(x => x.pics === filePath);
      // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1.先拼接一个图片信息对象
      const picInfo = {pic: response.data.tmp_path};
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid){
          return this.$message.error({
            message: '你有表单没有填写嗷~~ 🤗',
            offset: 40,
            center: true
          })
        }
        // 执行添加的业务逻辑
        // loadash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',');
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
          this.addForm.attrs.push(newInfo);
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addForm.attrs.push(newInfo);
        })
        form.attrs = this.addForm.attrs
        // 发起请求添加商品
        // 商品名称必须唯一
        const {data: res} = await this.$http.post('goods', form);
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
        await this.$router.push('/goods');
      })
    }
  }
}
</script>

<style scoped lang="scss">
.addBody {
  height: 48vh;
  width: 100%;
  overflow-x: hidden;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
.el-cascader {
  width: 280px!important;
}
</style>