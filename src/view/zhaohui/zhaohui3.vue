<template>
  <div style="width: 100%;height: 100%;background-color: #CCE8CF;text-align: center;padding-top: 80px">
    <h1>重置密码</h1>

    <el-steps :active="active"  finish-status="success" align-center style="margin-bottom: 30px">
      <el-step title="已完成" ></el-step>
      <el-step title="已完成" ></el-step>
      <el-step title="修改完成" ></el-step>
    </el-steps>


<div>
  <el-button type="primary" @click="fhdl()">返回登陆页</el-button>

</div>


  </div>
</template>

<script>
  export default {
    name: "zhaohui3",
    data(){
      return {

        active: 2,
      }

    },
    mounted(){
      if (this.active++ > 2) this.active = 0;
    },

    methods:{
      fhdl(){
        this.$router.push({path:'/'})
      }

    }
  }
</script>

<style scoped>

</style>
