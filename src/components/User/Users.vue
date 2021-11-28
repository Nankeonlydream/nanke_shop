<template>
  <div class="animate__animated animate__fadeIn">
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="试试搜索用户名称" v-model="queryInfo.query" @input="getUserListAgree"
                    @keyup.enter="getUserListAgree" clearable @clear="getUserList">
            <el-button slot="append" class="searchBtn" style="color: white!important;" icon="el-icon-search"
                       @click="getUserListAgree"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <button @click="addDialogVisible=true" class="button">添加用户</button>
        </el-col>
      </el-row>
      <!--用户列表区-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch class="mini-shadow"
                       v-model="scope.row.mg_state"
                       active-color="#55efc4"
                       inactive-color="#FDA7DF"
                       @change="agree(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!--修改按钮-->
            <el-tooltip effect="light" content="修改用户" placement="top" :enterable="false">
              <el-button class="mini-shadow-button-primary" type="primary" icon="el-icon-edit" size="mini"
                         effect="light" content="修改用户信息" placement="top" :enterable="false"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip effect="light" content="删除用户" placement="top" :enterable="false">
              <el-button class="mini-shadow-button-danger" type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!--分配角色-->
            <el-tooltip style="font-family: 楷体, serif" effect="light" content="分配角色" placement="top" :enterable="false">
              <el-button class="mini-shadow-button-warning" type="warning" icon="el-icon-setting"
                         @click="setRole(scope.row)"
                         size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog @close="addDialogClosed"
               title="添加用户"
               :lock-scroll="false"
               :append-to-body="true"
               :visible.sync="addDialogVisible"
               width="50%">
      <!--内容主体区-->
      <el-form :model="addForm" :rules="addFormRules" :hide-required-asterisk="true" :inline="true" ref="addFormRef"
               label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <button class="buttonReset" @click="addDialogClosed">重 置</button>
    <button class="buttonPlease" @click="addDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="addUser">确 定</button>
  </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog
      title="修改用户"
      :lock-scroll="false"
      :visible.sync="editDialogVisible"
      :append-to-body="true"
      width="45%">
      <!--内容主体区-->
      <el-form :model="editForm" :rules="editFormRules" :hide-required-asterisk="true" ref="editFormRef"
               label-width="70px">
        <el-form-item label="用户名">
          <el-input class="addOpacity" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input class="addOpacity" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input class="addOpacity" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
    <button class="buttonPlease" @click="editDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="editUserInfo">确 定</button>
  </span>
    </el-dialog>
    <!--分配角色的对话框-->
    <el-dialog
      title="分配角色"
      :lock-scroll="false"
      :visible.sync="setRoleDialogVisible"
      :append-to-body="true"
      width="45%" @close="setRoleDialogClosed">
      <el-form :hide-required-asterisk="true"
               label-width="100px">
        <el-form-item label="当前用户">
          <el-input class="addOpacity" v-model="userinfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input class="addOpacity" v-model="userinfo.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select style="width: 100%;opacity: .8;" v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
    <button class="buttonPlease" @click="setRoleDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="saveRoleInfo">确 定</button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {Debounce} from "../../utils/util";

export default {
  name: "Users",
  data() {
    // 验证邮箱
    let checkEmail = (rules, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error('请输入合法的邮箱🥴'));
    }
    // 验证手机号
    let checkMobile = (rules, value, callback) => {
      // 验证手机号的正则表达式
      const refMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (refMobile.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error('请输入合法的手机号🧐'));
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      userlist: [],
      activePath: '',
      total: 0,
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            // 必填项
            required: true,
            message: '请输入用户名🙂',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10位之间😊',
            trigger: 'blur'
          }
        ],
        password: [
          {
            // 必填项
            required: true,
            message: '请输入密码😉',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15位之间😁',
            trigger: 'blur'
          }
        ],
        email: [
          {
            // 必填项
            required: true,
            message: '请输入邮箱😑',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            // 必填项
            required: true,
            message: '请输入手机号🥺',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          {
            // 必填项
            required: true,
            message: '请输入邮箱😑',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            // 必填项
            required: true,
            message: '请输入手机号🥺',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 控制分配角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userinfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色ID值
      selectedRoleId: ''
    }
  },
  created() {
    // 调用函数发起网络请求
    this.getUserList();
  },
  methods: {
    // 获取数据列表（节流）
    getUserListAgree: Debounce(async function () {
      if (this.queryInfo.query === '') {
        this.$notify({
          message: '试试填写用户名称呢 😄',
          center: true,
          offset: 110,
          showClose: false
        })
      }
      await this.getUserList();
    }, 600),
    // 获取数据列表
    async getUserList() {
      // 向服务器发送ajax请求
      const {data: res} = await this.$http.get('users', {params: this.queryInfo});
      if (res.meta.status !== 200) return this.$message.error({
        message: '获取用户列表失败',
        offset: 40,
        center: true,
        iconClass: ''
      });
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(this.queryInfo.query)
    },
    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 节流监听 switch
    agree: Debounce(async function (userinfo) {
      const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error({
          message: '更新失败 😭',
          offset: 40,
          center: true,
          iconClass: ''
        });
      }
      this.$message.success({
        message: '更新成功 😊',
        offset: 40,
        center: true
      })
    }, 500),
    // 监听添加关闭对话框事件
    addDialogClosed() {
      // 清空表单
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const {data: res} = await this.$http.post('users', this.addForm)
        
        if (res.meta.status !== 201) {
          this.$message.error({
            message: '添加失败 😭',
            offset: 40,
            center: true,
            iconClass: ''
          });
        }
        this.$message.success({
          message: '添加成功 😊',
          offset: 40,
          center: true,
          iconClass: ''
        });
        // 隐藏添加的对话框
        this.addDialogVisible = false;
        // 重新获取用户列表数据
        await this.getUserList();
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const {data: res} = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败');
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const {data: res} = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });
        if (res.meta.status !== 200) {
          return this.$message.error({
            message: '更新失败 😭',
            offset: 40,
            center: true
          });
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        await this.getUserList();
        // 提示修改成功
        this.$message.success({
          message: '更新成功 😊',
          offset: 40,
          center: true
        });
      })
    },
    // 根据ID删除用户的信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回为字符串 confirm
      // 如果用户取消删除，则返回为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info({
        message: '已取消 😳',
        offset: 40,
        center: true
      });
      // 发起删除用户的请求
      const {data: res} = await this.$http.delete(`users/${id}`);
      if (res.meta.status !== 200) return this.$message.error({
        message: '删除失败 😭',
        offset: 40,
        center: true
      });
      this.$message.success({
        message: '删除成功 🤗',
        offset: 40,
        center: true
      });
      await this.getUserList();
    },
    // 展示分配角色的对话框
    async setRole(userinfo) {
      this.userinfo = userinfo;
      // 在展示对话框之前，获取所有角色的列表
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色');
      const {data: res} = await this.$http.put(`users/${this.userinfo.id}/role`, {rid: this.selectedRoleId});
      if (res.meta.status !== 200) return this.$message.error({
        message: '更新成功 😳',
        offset: 40,
        center: true
      });
      this.$message.success({
        message: '更新成功 😉',
        offset: 40,
        center: true
      })
      await this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userinfo = {}
    }
  }
}
</script>

<style scoped lang="scss">
.setRolesDialogStyleCenter {
  .setRolesDialogStyle {
    color: white;
    font-size: 18px;
    font-weight: bold;
    font-family: 楷体, serif;
  }
}

.addOpacity {
  opacity: .8;
}

.mini-shadow {
  border-radius: 40px;
  box-shadow: 0 0 6px rgb(134, 171, 194);
}

.el-button--default {
  background: linear-gradient(180deg, rgba(37, 204, 247, 0.86), rgba(255, 250, 101, 0.69), #ffcccc);
  border: none;
  outline: none;
  
  &:hover {
    box-shadow: 0 0 8px rgba(37, 204, 247, 0.38), 0 0 8px rgba(252, 215, 152, 0.41);
  }
  
  &:active {
    box-shadow: 0 0 2px rgba(135, 222, 245, 0.86), inset -1px -1px 2px #fedddd;
  }
}

.el-icon-search {
  color: white !important;
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

</style>