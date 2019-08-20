<template>
  <div style="width: 100%;height: 100%;background-color: #CCE8CF;text-align: center;padding-top: 80px">
    <h1>重置密码</h1>

    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 30px">
      <el-step title="已完成"></el-step>
      <el-step title="修改密码"></el-step>
      <el-step title="修改完成"></el-step>
    </el-steps>

    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm">

      <el-form-item prop="password">
        密码:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-input type="password"
                                                                           v-model="dynamicValidateForm.password"
                                                                           autocomplete="off"
                                                                           style="width: 200px;height: 30px;"></el-input>
      </el-form-item>
      <el-form-item prop="qpassword">
        确认密码：
        <el-input type="password" v-model="dynamicValidateForm.qpassword" autocomplete="off"
                  style="width: 200px;height: 30px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" v-show=flag @click="submitForm('dynamicValidateForm')">提交</el-button>

        <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        <el-button @click="fhdl()">返回登录</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  export default {
    name: "zhaohui2",
    data() {
      return {
        flag: false,
        active: 1,
        dynamicValidateForm: {
          id: "",
          password: '',
          qpassword: "",
        },


      }

    },
    mounted() {
      this.dynamicValidateForm.id = this.$route.query.sid;
      this.$axios.post(this.domain.serverpath + 'jianCeRedisp',this.dynamicValidateForm).then((res) => {
        if (res.data.code == 500) {
          this.$message({
            message: '此链接已过期',
            type: 'error',
            duration: '1000'
          });
          this.$router.push({path: '/youxiang1'})
        } else {
          this.flag=true,
          this.$message({
            message: '欢迎进入修改页码界面',
            type: 'success',
            duration: '1000'
          });
        }
      }).catch((x) => {
        this.$message({
          message: '你没有操作权限',
          type: 'error',
          duration: '1000'
        });
      })
    },

    methods: {
      submitForm(formName) {
        if (this.dynamicValidateForm.password == null || this.dynamicValidateForm.password === "") {
          this.$message({
            message: '密码不能为空',
            type: 'error',
            duration: '1000'
          });
          return;
        }
        var patrn = /^(\w){6,20}$/;
        if (!patrn.test(this.dynamicValidateForm.password)) {
          this.$message({
            message: '密码格式不正确',
            type: 'error',
            duration: '1000'
          });
          return;
        }

        if (this.dynamicValidateForm.qpassword === null || this.dynamicValidateForm.qpassword === "") {
          this.$message({
            message: '确认密码不能为空',
            type: 'error',
            duration: '1000'
          });
          return;
        }

        if (this.dynamicValidateForm.password != this.dynamicValidateForm.qpassword) {
          this.$message({
            message: '两次密码不一样',
            type: 'error',
            duration: '1000'
          });
          return;
        }//修改密码
        this.$axios.post(this.domain.serverpath + 'updatePassword', this.dynamicValidateForm).then((res) => {

          if (res.data.code == 200) {
            this.$message({
              message: '恭喜你，修改成功',
              type: 'success',
              duration: '1000'
            });
            this.$router.push({path: '/zhaohui3'})
          } else {
            this.$message({
              message: '此链接已过期',
              type: 'error',
              duration: '1000'
            });
            this.$router.push({path: '/zhaohui1'})
          }


        }).catch((x) => {
          this.$message({
            message: '请联系管理员',
            type: 'error',
            duration: '1000'
          });
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      fhdl() {
        this.$router.push({path: '/'})
      }
    },


  }
</script>

<style scoped>

</style>
