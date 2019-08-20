<template>
  <div id="app">
    <!--   模糊查询   -->
    <el-form :inline="true" :model="mypage" class="demo-form-inline" style="text-align: center">

      <el-form-item label="用户名">
        <el-input v-model="mypage.name" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item label="创建日期">
        <div class="block">
          <el-date-picker
            v-model="mypage.data1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <el-date-picker
            v-model="mypage.data2"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>


      <el-form-item label="性别">
        <el-select v-model="mypage.sex" placeholder="性别" clearable>
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="getuserList">查询</el-button>
      </el-form-item>

    </el-form>

    <el-button type="primary" v-if="ww.authmap.addUser!=null" @click="dialogFormVisible = true" round>+添加新用户</el-button>
    <el-button type="primary" v-if="ww.authmap.daochu!=null"  @click="downloadExcelone" round>+导出</el-button>


    <!--添加-->
    <el-dialog title="添加" :visible.sync="dialogFormVisible" :before-close="diaclose">

      <el-form :model="entityUser">

        <el-form :inline="true" :model="entityUser" class="demo-form-inline">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="entityUser.userName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="登录名" :label-width="formLabelWidth">
            <el-input v-model="entityUser.loginName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="entityUser.tel" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="entityUser.sex">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="2">女</el-radio-button>
          </el-radio-group>
        </el-form-item>


        <el-form-item label="照片">
          <el-image
            style="width: 50px; height: 50px"
            :src="url+entityUser.path"
            v-if="entityUser.path!=null"></el-image>
          <el-upload
            class="avatar-uploader"
            action="http://localhost:10020/toUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>


        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="entityUser.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="entityUser.password1" autocomplete="off"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false, entityUser={} ">取 消</el-button>
        <el-button type="primary"  @click="addUser(entityUser.id,'addForm')">确 定</el-button>
      </div>
    </el-dialog>


    <!--  绑定角色  -->
    <div>
      <el-dialog
        title="绑定角色"
        :visible.sync="bindroledia"
        width="30%">
        角色：
        <template>
          <el-select v-model="value" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="diaclose">取 消</el-button>
          <el-button type="primary" @click="addbindRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>


    <!--表单-->
    <el-table
      :data="userList"
      style="width: 100%"
      :default-sort="{prop:'createTime', order: 'descending'}"

      ref="multipleTable"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column
        label="用户名"
        width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>用户名: {{ scope.row.userName }}</p>
            <p>登录名: {{ scope.row.loginName }}</p>
            <p>性别: {{sexdata(scope.row.sex)}}</p>
            <p>电话: {{ scope.row.tel }}</p>
            <p>部门: {{ scope.row.dept }}</p>
            <p>角色: {{ scope.row.roleName }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.userName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="loginName"
        label="登录名"
        sortable
        width="180">
      </el-table-column>

      <el-table-column
        align="center"
        :formatter="formatRole"
        prop="sex"
        label="性别"
        width="100">
      </el-table-column>

      <el-table-column
        prop="tel"
        label="电话"
        width="180">
      </el-table-column>

      <el-table-column
        prop="dept"
        label="部门"
        width="180">
      </el-table-column>

      <el-table-column
        label="图片"
        width="150">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="url+scope.row.path"></el-image>
        </template>
      </el-table-column>

      <el-table-column
        prop="roleName"
        label="已绑定角色"
        width="180">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            v-if="ww.authmap.deleteUserById!=null"
            @click="deleteById(scope.$index, scope.row)">删除
          </el-button>

          <el-button
            size="mini"
            v-if="ww.authmap.updateUser!=null"
            @click="updateUser(scope.$index, scope.row)">编辑
          </el-button>

          <!--          绑定角色 scope.row.id!=pid-->
          <el-button size="mini" type="primary"  @click="bindRole(scope.$index, scope.row)" v-if="ww.authmap.adduserRole!=null">
            绑定角色
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--    分页-->
    <el-pagination style="text-align: center"
                   background
                   layout="prev,pager,next,sizes"
                   :total=total
                   :page-sizes=pageSizes
                   :page-size=pageSize
                   :current-page=currentPage
                   @current-change="nextOrOtherPage"
                   @size-change="pageSizeChange"
    >
    </el-pagination>

  </div>
</template>

<script>

  export default {
    name: 'userlist',
    data() {
      return {
        ww:this.$store.state.userInfo,
        userList: [],
        total: 0,
        pageSizes: [2, 3, 5, 10],
        pageSize: 5,
        currentPage: 1,
        mypage: {page: "1", pageSize: "5", sex: "", data1: "", data2: "", name: ""},
        multipleSelection: [],
        entityUser: {},
        dialogFormVisible: false,//添加修改弹框
        bindroledia: false,//绑定用户角色弹框
        formLabelWidth: '120px',
        radio: '1',
        options: [],//绑定用户回显的值
        pid: this.$store.state.userInfo.id,
        value: '',//绑定选中角色的id
        userId: "",//添加角色的id
        imageUrl: "",
        url: "http://localhost:8090/",
      }
    },
    mounted: function () {
      console.log("进入用户列表");
      this.getuserList();
      console.log(JSON.stringify(this.$store.state.userInfo));

    },
    methods: {
      getuserList() {
        if (this.mypage.data1 == null) {
          this.mypage.data1 = '';
        }
        if (this.mypage.data2 == null) {
          this.mypage.data2 = '';
        }
        if (this.mypage.sex == null) {
          this.mypage.sex = '';
        }
        if (this.mypage.name == null) {
          this.mypage.name = '';
        }
        this.$axios.post(this.domain.serverpath + 'userList', this.mypage).then((res) => {
          this.userList = res.data.content;
          this.total = res.data.totalElements;
        }).catch()
      },
      nextOrOtherPage(currentPage) {
        this.mypage.pageSize = this.pageSize;
        this.mypage.page = currentPage;
        this.getuserList();
      },
      pageSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.mypage.pageSize = this.pageSize;
        this.getuserList();
      },
      formatRole: function (row, column) {
        return row.sex == '1' ? "男" : row.sex == '2' ? "女" : "数据错误";
      },
      sexdata(sex) {
        return sex == '1' ? "男" : sex == '2' ? "女" : "数据错误";
      },
      deleteById(index, row) {
        alert(JSON.stringify(index));
        alert(JSON.stringify(row.id));
        this.$axios.post(this.domain.serverpath + 'deleteUserById', row).then((res) => {
          console.log(res.data);

          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: res.data.success,
              type: 'success',
              duration: 1000
            });
            this.getuserList();
          }
          if (res.data.code == 500) {
            this.$message({
              showClose: true,
              message: res.data.error,
              type: 'error',
              duration: 1000
            });
            this.getuserList();
          }
        }).catch((x) => {
            this.$message({
              message: '未有操作权限',
              type: 'error',
              duration: '1000'
            });
          }
        )
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      addUser(id, formName) {
        if (id > 0) {

          this.$axios.post(this.domain.serverpath + 'updateUser', this.entityUser).then((res) => {

            alert(JSON.stringify(this.entityUser));

            if (res.data == 200) {

              this.$message({
                showClose: true,
                message: "修改成功",
                type: 'success',
                duration: 1000
              });
              this.getuserList();
              this.entityUser = {};
              this.fileList = [];
              this.dialogFormVisible = false
            }
          }).catch((x) => {
            this.$message({
              message: '未有操作权限',
              type: 'error',
              duration: '1000'
            });
          })
        } else {


          //用户名验证
          if (this.entityUser.userName == null || this.entityUser.userName === '') {
            this.$message({
              message: '用户名不能为空',
              type: 'error',
              duration: '1000'
            });
            return;
          }

          //登录名验证

          if (this.entityUser.loginName == null) {
            this.$message({
              message: '登录名不能为空',
              type: 'error',
              duration: '1000'
            });
            return;
          }


          //登录名验证
          var patrn = /[0-9a-zA-Z]{4,9}/
          if (!patrn.test(this.entityUser.loginName)) {
            this.$message({
              message: '登录名必须是由4-9位数字和字母组合',
              type: 'error',
              duration: '1000'
            });
            return;
          }
          //手机号验证
          var patrn =/0?(13|14|15|18|17)[0-9]{9}/
          if(this.entityUser.tel == null || this.entityUser.tel === ''){
            this.$message({
              message: '手机号不能为空',
              type: 'error',
              duration: '1000'
            });
            return;
          } else if (!patrn.test(this.entityUser.tel)) {
            this.$message({
              message: '请输入正确的国内手机号',
              type: 'error',
              duration: '1000'
            });
            return;
          }


          //性别验证
          if (this.entityUser.sex == null || this.entityUser.sex === '') {
            this.$message({
              message: '请选择性别',
              type: 'error',
              duration: '1000'
            });
            return;
          }

          //图片验证
          if (this.imageUrl == null || this.imageUrl === '') {
            this.$message({
              message: '请上传头像',
              type: 'error',
              duration: '1000'
            });
            return;
          }


          //密码验证

          if (this.entityUser.password == null) {
            this.$message({
              message: '密码不能为空',
              type: 'error',
              duration: '1000'
            });
            return;
          }

          //密码验证
          var patrn = /[0-9a-zA-Z]{4,9}/;
          if (!patrn.test(this.entityUser.password)) {
            this.$message({
              message: '密码必须是由4-9位数字和字母组合',
              type: 'error',
              duration: '1000'
            });
            return;
          }

          if (this.entityUser.password != this.entityUser.password1) {
            this.$message({
              message: '两次密码不一致',
              type: 'error',
              duration: '1000'
            });
            return;
          }

          this.$axios.post(this.domain.serverpath + 'addUser', this.entityUser).then((res) => {

            if (res.data == 200) {

              this.$message({
                showClose: true,
                message: "添加成功",
                type: 'success',
                duration: 1000
              });
              this.getuserList();
              this.entityUser = {};
              this.dialogFormVisible = false
            } else if (res.data == 505) {
              alert("登录名重复");
            }

          }).catch((x) => {
              this.$message({
                message: '未有操作权限',
                type: 'error',
                duration: '1000'
              });
            }
          )


        }
      },
      updateUser(index, row) {
        alert(JSON.stringify(row));
        this.entityUser = row;
        this.entityUser.password = "";
        this.dialogFormVisible = true;
        this.imageUrl = "";
      },
      diaclose() {
        this.entityUser = {};
        this.dialogFormVisible = false;
        this.bindroledia = false;
        this.getuserList();
        this.value = '';
        this.imageUrl = "";
      },
      bindRole(index, row) {
        this.userId = row.id;
        this.bindroledia = true;
        this.$axios.post(this.domain.serverpath + "bdrolelist").then((res) => {
          this.options = res.data;
        }).catch((x) => {
          this.$message({
            message: '未有操作权限',
            type: 'error',
            duration: '1000'
          });
        })
      },
      addbindRole() {
        alert("用户id" + this.userId);
        alert("角色id" + this.value);

        this.$axios.post(this.domain.serverpath + "adduserRole", {
          userId: this.userId,
          roleId: this.value
        }).then((res) => {
          if (res.data == 200) {
            this.$message({
              showClose: true,
              message: "绑定成功",
              type: 'success',
              duration: 1000
            });
            this.getuserList();

            this.bindroledia = false;
          }
        }).catch(
          (x) => {
            this.$message({
              message: '未有操作权限',
              type: 'error',
              duration: '1000'
            });
          }
        )
        this.value = '';

      },
      handleAvatarSuccess(res, file) {
        this.entityUser.path = file.name;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        return true;
      },//导出
      downloadExcelone() {

        this.$axios.post(this.domain.serverpath + "daochu", this.userList).then((res) => {
          if (res.data > 0) {
            this.$message({
              showClose: true,
              message: "下载成功",
              type: 'success',
              duration: 1000
            });
          } else {
            this.$message({
              showClose: true,
              message: "下载失败",
              type: 'success',
              duration: 1000
            });
          }
        })
      },


    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
