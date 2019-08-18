<template>
    <div>

      <el-alert
        :closable="closable"
        title="首页"
        type="success"
        show-icon>
      </el-alert>

      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">新闻公告</span>
          </div>
          <div  class="text item">
             内容
          </div>
        </el-card>
      </div>
      <!-- 6 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">最近信息</span>

          </div>
          <div  class="text item">
            内容
          </div>
        </el-card>
      </div>
      <br>
      <!-- 7 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">汇总统计</span>

          </div>
          <div class="text item">
            内容
          </div>
        </el-card>
      </div>
      <!-- 8 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">类型汇总统计</span>

          </div>
          <div class="text item">
             内容
          </div>

        </el-card>
      </div>
      <!-- 8 -->
      <div style="width:100%;">
        <el-card class="box-card" >

          <div slot="header" class="clearfix">
            <span style="font-weight:bold">操作帮助</span>
            <div style="text-align: center"><span>使用蛟龙快速组织信息</span></div>
            <template>
              <!--为echarts准备一个具备大小的容器dom-->
              <div id="main" style="width: 100%;height: 400px;"> </div>
            </template>



            </div>
        </el-card>
      </div>
    </div>
</template>

<script>
  import echarts from 'echarts'

    export default {
        name: "system",
        data(){
          return{
            data1:'',
            charts: '',
            opinionData: ["3", "2", "4", "4", "5"],
            closable:false,
            styleel:{
              left:'200%'
            },
          }
        },
      watch:{
        opinionData(v,f){
          this.drawLine('main')
        }
      },
      mounted() {
        this.$nextTick(function() {
          this.drawLine('main')
        })


        this.$axios.post(this.domain.ssoserverpath + 'zhexian').then((res)=>{
          console.log(res.data.key1);
          this.opinionData=res.data.key1;
          this.data1=res.data.value1;
        })
      },
      methods: {
        drawLine(id) {
          this.charts = echarts.init(document.getElementById(id))
          this.charts.setOption({
            title:{//标题
              text:'7天登录人数据统计'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['七天登录用户']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },

            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {//横轴
              type: 'category',
              boundaryGap: false,
              data: this.opinionData

            },
            yAxis: {
              type: 'value'
            },

            series: [{//竖轴
              name: '七天登录用户',
              type: 'line',
              stack: '总量',
              data: this.data1
            }]
          })
        }
      }
    }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width:99.5%;
  }
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
