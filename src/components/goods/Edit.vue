<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb class="animate__animated animate__fadeIn" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!--卡片视图-->
    <el-card>
      <el-alert
        title="修改商品信息"
        type="info"
        center
        show-icon :closable="false">
      </el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      
      <div class="editBody">
        <el-backtop target=".editBody" :bottom="100">
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
        color: #60f8a7;
      }"
          >
            UP
          </div>
        </el-backtop>
        <!--tab栏区域-->
        <el-form :model="editForm"
                 :rules="editFormRules"
                 ref="editFormRef"
                 label-width="100px"
                 label-position="top"
        >
          <el-tabs :tab-position="'left'" @tab-click.once="tabClicked" v-model="activeIndex">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="editForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price" type="number">
                <el-input v-model="editForm.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="editForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="editForm.goods_number"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="1">
              <!--图片上传组件-->
              <!--action要上传到的API地址-->
              <el-upload
                :action="uploadURL"
                :file-list="fileList"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headerObj"
                :on-success="handleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="2">
              <!--添加商品的按钮-->
              <el-button @click="edit" style="margin: 10px 0 10px 5px;font-weight: bold" class="addButton">确认修改</el-button>
              <!--富文本编辑器组件-->
              <quill-editor v-model.lazy.trim="editForm.goods_introduce"></quill-editor>
             
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
export default {
  name: "Edit",
  data() {
    return {
      activeIndex: '0',
      // 修改商品的表单数据对象
      editForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      // 修改商品的验证规则对象
      editFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ]
      },
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
      previewVisible: false,
      fileList: []
    }
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const id = this.$route.query.id;
      const {data: res} = await this.$http.get(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: '查询失败',
          center: true,
          offset: 50,
          showClose: false
        });
      }
      this.editForm = res.data;
      
    },
    // 标签被点击时触发
    tabClicked() {
      if (this.activeIndex === '1') {
        this.editForm.pics.forEach(item => {
          const picObj = {url: item.pics_big_url}
          this.fileList.push(picObj)
        })
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
      const filePath = file.url;
      // 2.从pics数组中，找到这个图片的对应索引值
      const i = this.editForm.pics.findIndex(x => x.pics === filePath);
      // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.editForm.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1.先拼接一个图片信息对象
      const picInfo = {pic: response.data.tmp_path};
      // 2.将图片信息对象，push到pics数组中
      this.editForm.pics.push(picInfo);
    },
    // 修改商品
    edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error({
          message: '请填写必要的表单项',
          center: true,
          offset: 50,
          showClose: false
        })
        // 发起请求添加商品
        // 商品名称必须唯一
        const {data: res} = await this.$http.put(`goods/${this.editForm.goods_id}`, this.editForm);
        if (res.meta.status !== 200) return this.$message.error({
          message: '修改失败',
          center: true,
          offset: 50,
          showClose: false
        });
        this.$message.success({
          message: '已修改',
          center: true,
          offset: 50,
          showClose: false
        });
        await this.$router.push('/goods');
      })
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}

.loadingPng {
  width: 150px;
  height: 150px;
}

.editBody {
  height: 48vh;
  width: 100%;
  overflow-x: hidden;
}
</style>