<template>
    <div style="width: 100%;height: 100%;background-color: #CCE8CF;text-align: center;padding-top: 80px">
    <h1>重置密码</h1>

      <el-steps :active="active"  finish-status="success" align-center style="margin-bottom: 30px">
        <el-step title="填写邮箱" ></el-step>
        <el-step title="修改密码" ></el-step>
        <el-step title="修改完成" ></el-step>
      </el-steps>

        <el-form :model="dynamicValidateForm"  :label-position="labelPosition" ref="dynamicValidateForm">
          <el-form-item
            prop="toEmail"
          >
            邮箱:<el-input v-model="dynamicValidateForm.toEmail" style="width: 200px;height: 30px"></el-input>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>

            <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
            <el-button @click="fhdl()">返回登录</el-button>
          </el-form-item>
        </el-form>


    </div>
</template>

<script>
    export default {
        name: "zhaohui1",

        data(){
          return{
            labelPosition: 'right',
            active:0,
            dynamicValidateForm: {

              toEmail: ''
            }
          }

        },
      methods:{
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        fhdl(){
          this.$router.push({path:'/'})
        },
        submitForm(){
          var patrn=/^[1-9]\d{7,10}@qq\.com$/;
          if(!patrn.test(this.dynamicValidateForm.toEmail)){
            this.$message({
              message: '邮箱格式不正确',
              type: 'error',
              duration:'1000'
            });
            return;
          }

          this.$axios.post(this.domain.serverpath + 'sendEmail', this.dynamicValidateForm).then((res)=>{
           if(res.data.code==200){
             this.$message({
               message: '恭喜你，发送成功',
               type: 'success',
               duration:'1000'
             });
             this.dynamicValidateForm.toEmail="";
            }else if(res.data.code==500){

             this.$message({
               message: '该邮箱未注册，请先注册',
               type: 'error',
               duration:'1000'
             });
           }

          }).catch((x)=>{
            this.$message({
              message: '请联系管理员',
              type: 'error',
              duration:'1000'
            });
          })
        }
      }
    }
</script>

<style scoped>

</style>
