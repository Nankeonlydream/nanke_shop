<template>
  <div class="animate__animated animate__fadeIn">
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-backtop target=".goTop" :bottom="100">
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
        color: #60adf8;
      }"
        >
          UP
        </div>
      </el-backtop>
      <!--添加角色按钮区-->
      <el-row>
        <el-col style="display:flex;align-items: center;justify-content: space-around">
          <span class="titleForHeader" v-text="this.saying.english"></span>
          <span class="titleForHeader" v-text="this.saying.chinese"></span>
          <span class="titleForHeader" v-text="this.saying.form"></span>
          <button class="button" @click="addRolesDialogVisible=true">添加角色</button>
        </el-col>
      </el-row>
      <!--角色列表区-->
      <div class="goTop">
        <el-table :data="roleList" border stripe>
          <!--展开列-->
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children"
                      :key="item1.id">
                <!--渲染一级权限-->
                <el-col class="el-col-textCenter" :span="6">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--渲染二级和三级权限-->
                <el-col :span="17">
                  <!--通过for循环嵌套渲染二级权限-->
                  <el-row :class="[i2 === 0 ? '' : 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                    <el-col :span="7">
                      <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="17">
                      <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                              @close="removeRightById(scope.row,item3.id)">{{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!--索引列-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template v-slot="scope">
              <el-button class="mini-shadow-button-primary" size="mini" type="primary" icon="el-icon-edit"
                         @click="showEditRolesDialog(scope.row.id)">编辑
              </el-button>
              <el-button class="mini-shadow-button-danger" size="mini" type="danger" icon="el-icon-delete"
                         @click="removeRolesrById(scope.row.id)">删除
              </el-button>
              <el-button class="mini-shadow-button-warning" size="mini" type="warning" icon="el-icon-setting"
                         @click="showSetRightDialog(scope.row)">权限
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--添加角色的对话框-->
    <el-dialog @close="addRolesDialogClosed"
               title="添加角色"
               :lock-scroll="false"
               :append-to-body="true"
               :visible.sync="addRolesDialogVisible"
               width="50%">
      <!--内容主体区-->
      <el-form :model="addRolesForm" :rules="addRolesFormRules" :hide-required-asterisk="true" :inline="true"
               ref="addRolesFormRef"
               label-width="90px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <button class="buttonReset" @click="addRolesDialogClosed">重 置</button>
    <button class="buttonPlease" @click="addRolesDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="addRoles">确 定</button>
  </span>
    </el-dialog>
    <!--修改角色的对话框-->
    <el-dialog
      title="修改角色"
      :lock-scroll="false"
      :append-to-body="true"
      :visible.sync="editRolesDialogVisible"
      width="50%">
      <!--内容主体区-->
      <el-form :model="editRolesForm" :rules="editRolesFormRules" :hide-required-asterisk="true" :inline="true"
               ref="editRolesFormRef"
               label-width="90px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
    <button class="buttonPlease" @click="editRolesDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="editRolesInfo">确 定</button>
  </span>
    </el-dialog>
    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      :lock-scroll="false"
      :append-to-body="true"
      width="50%" @close="setRightDialogClosed">
      <!--树形控件-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all ref="treeRef"
               :default-checked-keys="defKeys"></el-tree>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
    <button class="buttonPlease" @click="setRightDialogVisible = false">取 消</button>
    <button class="buttonConfirm" @click="allotRights">确 定</button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
import computedTitle from '../../plugins/saying'

export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制添加用户对话框的显示和隐藏
      addRolesDialogVisible: false,
      // 添加角色的表单数据
      addRolesForm: {
        // 角色名称
        roleName: '',
        // 角色描述
        roleDesc: ''
      },
      // 添加角色的验证规则对象
      addRolesFormRules: {
        roleName: [
          {
            // 必填项
            required: true,
            message: '请输入角色名🙂',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            min: 2,
            max: 8,
            message: '角色名的长度在2~8位之间😊',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            // 必填项
            required: true,
            message: '请输入对该角色的描述🙂',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '角色的描述长度在3~15位之间😊',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改角色对话框的显示和隐藏
      editRolesDialogVisible: false,
      // 查询到的角色信息对象
      editRolesForm: {},
      // 修改角色的验证规则对象
      editRolesFormRules: {
        roleName: [
          {
            // 必填项
            required: true,
            message: '请输入角色名🙂',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            min: 2,
            max: 8,
            message: '角色名的长度在2~8位之间😊',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            // 必填项
            required: true,
            message: '请输入对该角色的描述🙂',
            // 失去焦点触发规则
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '角色的描述长度在3~15位之间😊',
            trigger: 'blur'
          }
        ]
      },
      // 控制分配权限的对话框显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightslist: [],
      // 树形空间的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 当前即将分配权限的ID
      roleId: ''
    }
  },
  created() {
    this.getRolesList();
    this.saying = computedTitle();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const {data: res} = await this.$http.get('roles');
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
      this.roleList = res.data;
    },
    // 监听添加关闭对话框事件
    addRolesDialogClosed() {
      // 清空表单
      this.$refs.addRolesFormRef.resetFields();
    },
    // 点击按钮，添加角色
    addRoles() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        // 可以发送添加角色的网络请求
        const {data: res} = await this.$http.post('roles', this.addRolesForm);
        
        if (res.meta.status !== 201) this.$message.error('添加角色失败');
        this.$message.success('添加角色成功');
        // 隐藏添加的对话框
        this.addRolesDialogVisible = false;
        // 重新获取用户列表数据
        await this.getRolesList();
      })
    },
    
    async showEditRolesDialog(id) {
      const {data: res} = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败');
      }
      this.editRolesForm = res.data;
      this.editRolesDialogVisible = true;
    },
    // 修改角色信息并提交
    editRolesInfo() {
      console.log(this.editRolesForm)
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const {data: res} = await this.$http.put(`roles/${this.editRolesForm.roleId}`, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        });
        if (res.meta.status !== 200) {
          console.log(res.meta.status)
          return this.$message.error('更新用户失败');
        }
        // 关闭对话框
        this.editRolesDialogVisible = false;
        // 刷新数据列表
        await this.getRolesList();
        // 提示修改成功
        this.$message.success('更新用户成功✨');
      })
    },
    // 根据ID删除角色的信息
    async removeRolesrById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).catch(error => error)
      // 如果用户确认删除，则返回为字符串 confirm
      // 如果用户取消删除，则返回为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info({
        message: '已取消 🧐',
        offset: 40,
        center: true
      });
      // 发起删除用户的请求
      const {data: res} = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) return this.$message.error({
        message: '删除失败',
        offset: 40,
        center: true
      });
      this.$message.success({
        message: '删除成功 🤗',
        offset: 40,
        center: true
      });
      await this.getRolesList();
    },
    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消');
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error({
        message: '权限删除失败',
        offset: 40,
        center: true
      });
      this.$message.success({
        message: '权限删除成功 😉',
        offset: 40,
        center: true
      });
      // 解决每次删除后刷新整个列表
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const {data: res} = await this.$http.get('rights/tree');
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败');
      // 把获取到的权限保存到data中
      this.rightslist = res.data;
      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则说明是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',');
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr});
      if (res.meta.status !== 200) return this.$message.error({
        message: '分配失败 😉',
        offset: 40,
        center: true
      });
      this.$message.success({
        message: '分配成功 😉',
        offset: 40,
        center: true
      });
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  }
}
</script>

<style scoped lang="scss">
.goTop {
  height: 62vh;
  overflow-x: hidden;
}

.el-tree {
  background: transparent;
}

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

.el-col-textCenter {
  text-align: center;
}

.el-table {
  .el-row {
    display: flex;
    align-items: center;
    
    .el-col {
      .el-tag {
        font-size: 14px;
        font-weight: 600 !important;
        margin: 15px 7px 15px 0;
      }
    }
  }
}

.cell {
  font-weight: 600 !important;
  font-size: 18px !important;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>