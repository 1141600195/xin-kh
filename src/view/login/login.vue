

<template>
  <div class="login-wrap" :style="divimg">

    <div>
      <p class="p-title">KH我爱编码,欢迎点评</p>
    </div>
    <div class="ms-login">
      <div class="ms-title">
        欢迎使用
      </div>

      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账号密码登录" name="first">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
              <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="请输入用户名">
                  <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" placeholder="请输入认证密码" v-model="ruleForm.password"
                          @keyup.enter.native="submitForm('ruleForm')">
                  <el-button slot="prepend" icon="iconfont icon-yuechi"></el-button>
                </el-input>
              </el-form-item>

              <el-form-item prop="code">
                <div class="form-inline-input">
                  <div class="code-box" id="code-box">
                    <input ref="coderef" type="text" name="code" class="code-input"/>
                    <p></p>
                    <span style="color:#909399">
                     拖动验证
                  </span>
                  </div>
                </div>
              </el-form-item>

              <template>
                <!-- `checked` 为 true 或 false -->
                <el-checkbox v-model="checked">七天免登录</el-checkbox>
              </template>

              <div class="login-btn">
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              </div>
              <div>
                <a @click="wangjimima" >忘记密码</a>
              </div>

              <!-- 登录进度 -->
              <el-progress ref="jindu" :style="jindustyle" :text-inside="true"
                           :stroke-width="18"
                           :percentage="percent"
                           status="success"></el-progress>

            </el-form>
          </el-tab-pane>


          <el-tab-pane label="短信验证登录" name="second">

            <el-form :model="phoneyanzheng" :rules="phonerules" ref="phoneyanzheng" label-width="0px"
                     class="ms-content">
              <el-form-item prop="tel">
                <el-input v-model="phoneyanzheng.tel" placeholder="请输入手机号" style="width: 84%"></el-input>
                <el-button icon="el-icon-mobile-phone" @click="send" style="width: 15%" type="success"
                           :disabled="disabled=!show">
                  <span v-show="show">获取验证码</span>
                  <span v-show="!show" class="count">{{count}} s</span>
                </el-button>
              </el-form-item>
              <el-form-item prop="telcode">
                <el-input placeholder="请输入收到的验证码" v-model="phoneyanzheng.telcode"
                          @keyup.enter.native="phonelogin('phoneyanzheng')">
                  <el-button slot="prepend" icon="el-icon-s-comment"></el-button>
                </el-input>
              </el-form-item>


              <div class="login-btn">
                <el-button type="primary" @click="phonelogin('phoneyanzheng')">验证码登录</el-button>
              </div>


            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>


    </div>


  </div>
</template>

<script>

  //七天免登陆
  import {delCookie, getCookie, setCookie} from "../../js/util";

  const TIME_COUNT = 60; //更改倒计时时间
  export default {
    name: "login",
    data() {
      return {
        show: true,  // 初始启用按钮
        count: '',   // 初始化次数
        timer: null,
        activeName: 'first',
        checked: false,
        divimg: {//背景图片的使用
          backgroundImage: "url(" + require('../../assets/66.jpg') + ")",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          backgroundSize: "cover"
        },
        percent: 0,
        jindustyle: {
          display: 'none'
        },
        ruleForm: {
          username: 'kh',
          password: '123456'
        },
        phoneyanzheng: {}
        ,
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]

        },
        phonerules: {
          tel: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          telcode: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
    wangjimima(){
      this.$router.push({
        path: '/zhaohui1',
      });
    },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      submitForm(ruleid) {

        let code = this.$refs.coderef.value;
        if (code == null || code == "") {
          const h = this.$createElement;
          this.$notify({
            title: '提示信息：',
            message: h('i', {style: 'font-style:normal'}, '请进行拖动校验！'),
            type: 'warning',
            duration: 1500 //延时时间
          });
        } else {
          //登陆操作
          let par = {};
          par.loginname = this.ruleForm.username;
          par.password = this.ruleForm.password;


          if (this.ruleForm.username == "" || this.ruleForm.username == null) {
            this.$notify.info({
              title: '提示',
              message: '请填写用户名'
            });
            return;
          }
          if (this.ruleForm.password == "" || this.ruleForm.password == null) {
            this.$notify.info({
              title: '提示',
              message: '请填写密码'
            });
            return;
          }


          par.code = this.$refs.coderef.value;
          //转JSON串
          //let canshu=this.toAes.encrypt(JSON.stringify(par));
          // let params={canshu:canshu};
          //let qs=require("qs");
          //打开登陆进度条
          this.$data.jindustyle.display = 'block';
          //每0.1秒更新一下进度
          var timer = setInterval(() => {
            let pp = this.$data.percent + 10;
            if (pp >= 100) {
              pp = 99;
            }
            this.$data.percent = pp;
          }, 100)
          //从cookie中取出某一个名称的Cookie的值
          par.codekey = this.Cookies.get("authcode")

          this.$axios.post(this.domain.ssoserverpath + "login", par).then((response) => {
            let respo = response.data;
            if (respo.code == 200) {

              //七天免登陆登陆成功存键
              if (this.checked) {
                setCookie("loginName", this.ruleForm.username, 7);
                setCookie("password", this.ruleForm.password, 7);
              }

              //存储token到vuex中，
              this.$store.state.token = response.data.token
              this.$store.state.userInfo = response.data.result
              //todo 使用全局没用session
              // window.sessionStorage.setItem("userInfo",JSON.stringify(response.data.result))
              //关闭加载窗
              this.$data.percent = 100
              //隐藏进度条
              this.$data.jindustyle.display = 'none'
              //关闭定时
              clearInterval(timer)

              //跳转到首页界面
              //将用户ID存入到全局的VUE对象中

              this.$router.push({
                path: '/view/shouye/shouye',
                query: {username: response.data.result.userName, userid: response.data.result.id}
              });

            } else if (respo.error != null) {
              //关闭加载窗
              this.$data.percent = 100
              //隐藏进度条
              this.$data.jindustyle.display = 'none'
              //关闭定时
              clearInterval(timer)
              this.$notify.error({
                title: '提示',
                duration: 1000,
                message: respo.error
              });
            }

          }).catch((error) => {
            //关闭加载窗
            this.$data.percent = 100;
            //隐藏进度条
            this.$data.jindustyle.display = 'none';
            //关闭定时
            clearInterval(timer);
            this.$notify.error({
              title: '错误',
              message: '出错了~_~，请联系管理员！'
            });
          })


        }

      },
      send() {

        alert("fasong1");
        this.$axios.post(this.domain.ssoserverpath + "yanzhengma",this.phoneyanzheng).then((res) => {
          if (res.data.code == 200) {
            alert("发送成功")
          }
        })
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;

            } else {
              this.show = true;
              clearInterval(this.timer);  // 清除定时器
              this.timer = null;
            }
          }, 1000)
        }
      },

      //短信登陆
      phonelogin(phoneid) {
        alert("66666666666666666666666");

        let par = {};
        par.tel = this.phoneyanzheng.tel;
        par.telcode = this.phoneyanzheng.telcode;
        if (this.phoneyanzheng.tel == "" || this.phoneyanzheng.tel == null) {
          this.$notify({
            title: '提示',
            message: '请填写手机号',
            type: 'warning',
            duration: 1500 //延时时间
          });
          return;
        }
        if (this.phoneyanzheng.telcode == "" || this.phoneyanzheng.telcode == null) {
          this.$notify({
            title: '提示',
            message: '请填写验证码',
            type: 'warning',
            duration: 1500 //延时时间
          });
          return;
        }


        //从cookie中取出某一个名称的Cookie的值
        par.phonecode = this.Cookies.get("phonecode")


        this.$axios.post(this.domain.ssoserverpath + "logintel", par).then((response) => {

          if (response.data.code == 200) {


            //存储token到vuex中，
            this.$store.state.token = response.data.token
            this.$store.state.userInfo = response.data.result
            //todo 使用全局没用session
            // window.sessionStorage.setItem("userInfo",JSON.stringify(response.data.result))

            //跳转到首页界面
            //将用户ID存入到全局的VUE对象中

            this.$router.push({
              path: '/view/shouye/shouye',
              query: {username: response.data.result.userName, userid: response.data.result.id}
            });

          } else if (respo.error != null) {

            this.$notify.error({
              title: '提示',
              duration: 1000,
              message: respo.error
            });
          }

        }).catch((error) => {

          this.$notify.error({
            title: '错误',
            message: '出错了~_~，请联系管理员！'
          });
        })


      },


      //拖动验证start
      getOffset(box, direction) {
        var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft';
        var offset = box[setDirection];
        var parentBox = box.offsetParent;
        while (parentBox) {
          offset += parentBox[setDirection];
          parentBox = parentBox.offsetParent;
        }
        parentBox = null;
        return parseInt(offset);
      },
      moveCode(code, _this) {
        var fn = {codeVluae: code};
        var box = document.querySelector("#code-box"),
          progress = box.querySelector("p"),
          codeInput = box.querySelector('.code-input'),
          evenBox = box.querySelector("span");
        //默认事件
        var boxEven = ['mousedown', 'mousemove', 'mouseup'];
        //改变手机端与pc事件类型
        if (typeof document.ontouchstart == 'object') {
          boxEven = ['touchstart', 'touchmove', 'touchend'];
        }
        var goX, offsetLeft, deviation, evenWidth, endX;

        function moveFn(e) {
          e.preventDefault();
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          endX = e.clientX - goX;
          endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
          if (endX > evenWidth * 0.7) {//验证百分比70%
            progress.innerText = '松开验证';
            progress.style.backgroundColor = "#66CC66";
          } else {
            progress.innerText = '';
            progress.style.backgroundColor = "#FFFF99";
          }
          progress.style.width = endX + deviation + 'px';
          evenBox.style.left = endX + 'px';
        }

        function removeFn() {
          document.removeEventListener(boxEven['2'], removeFn, false);
          document.removeEventListener(boxEven['1'], moveFn, false);
          if (endX > evenWidth * 0.8) {
            progress.innerText = '验证成功';
            progress.style.width = evenWidth + deviation + 'px';
            evenBox.style.left = evenWidth + 'px'
            codeInput.value = fn.codeVluae;
            evenBox.onmousedown = null;
            _this.ruleForm.verification = true;

            //alert( codeInput.value);

          } else {
            progress.style.width = '0px';
            evenBox.style.left = '0px';
          }
        };

        function getOffset(box, direction) {
          var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft';
          var offset = box[setDirection];
          var parentBox = box.offsetParent;
          while (parentBox) {
            offset += parentBox[setDirection];
            parentBox = parentBox.offsetParent;
          }
          parentBox = null;
          return parseInt(offset);
        };
        evenBox.addEventListener(boxEven['0'], function (e) {
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          goX = e.clientX,
            offsetLeft = getOffset(box, 'left'),
            deviation = this.clientWidth,
            evenWidth = box.clientWidth - deviation,
            endX;
          document.addEventListener(boxEven['1'], moveFn, false);
          document.addEventListener(boxEven['2'], removeFn, false);
        }, false);
        fn.setCode = function (code) {
          if (code)
            fn.codeVluae = code;
        }
        fn.getCode = function () {
          return fn.codeVluae;
        }
        fn.resetCode = function () {
          alert("====")
          evenBox.removeAttribute('style');
          progress.removeAttribute('style');
          codeInput.value = '';
        };
        return fn;
      }//拖动验证end

    },
    mounted() {
      console.log("进入login mounted方法");


      var _this = this;
      var code = "";
      //从后台获取滑动验证码1
      //参数 url 访问参数
      this.$axios.post(this.domain.ssoserverpath + 'getCode').then((response) => {
        console.log("进入login 获得验证码方法");
        code = response.data.result;
        //向浏览器写一个Cookie
        //document.cookie = 'testCookies' + "=" + response.data.token + "; " + -1;
        _this.moveCode(code, _this);
        //七天免登陆判断cookies有没有存这个键
        if (getCookie("loginName") != null && getCookie("password") != null) {

          this.$refs.coderef.value = code;
          this.ruleForm.username = getCookie("loginName");
          this.ruleForm.password = getCookie("password");
          this.submitForm('ruleForm');
        }
      }).catch((error) => {

      })
    }

  }
</script>

<style scoped>

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: left;
    font-size: 20px;
    color: #fff;
    font-style: italic;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 70%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }

  /** 滑动验证start **/
  .form-inline-input {
    border: 1px solid #dadada;
    border-radius: 5px;
  }

  .form-inline-input input,
  .code-box {
    padding: 0 3px;
    width: 290px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }

  .code-box {
    position: relative;
  }

  .code-box p,
  .code-box span {
    display: block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding: 0;
    margin: 0;
  }

  .code-box span {
    width: 40px;
    background-color: #fff;
    font-size: 16px;
    cursor: pointer;
    margin-right: 1px;
  }

  .code-box p {
    width: 0;
    background-color: #FFFF99;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }

  .code-box .code-input {
    display: none;
  }

  .code-box .code-input {
    display: none;
  }

  .form-inline-input {
    border: 1px solid #dadada;
    border-radius: 5px;
  }

  .form-inline-input input,
  .code-box {
    padding: 0 3px;
    width: 285px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }

  .code-box {
    position: relative;
  }

  .code-box p,
  .code-box span {
    display: block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding: 0;
    margin: 0;
  }

  .code-box span {
    width: 70px;
    background-color: #fff;
    font-size: 12px;
    cursor: pointer;
    margin-right: 1px;
  }

  .code-box p {
    width: 0;
    background-color: #F5F7FA;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }

  .code-box .code-input {
    display: none;
  }

  .code-box .code-input {
    display: none;
  }

  .p-title {
    color: white;
    font-size: 16px;
    text-align: left;
    padding-left: 20px;
    font-style: italic
  }

  /** 滑动验证end **/

</style>
