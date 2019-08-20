import Vue from 'vue'
import Router from 'vue-router'
//import HelloWorld from '@/components/HelloWorld'

import login from '@/view/login/login'
import shouye from '@/view/shouye/shouye'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'

//用户列表
import userlist from '@/view/yonghu/userlist'
//角色列表
import rolelist from '@/view/role/rolelist'
//权限列表
import menulist from '@/view/menu/menulist'

import zhaohui1 from '@/view/zhaohui/zhaohui1'
import zhaohui2 from '@/view/zhaohui/zhaohui2'
import zhaohui3 from '@/view/zhaohui/zhaohui3'

Vue.use(Router)


export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require: false
      }
    },
    {
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require:true//该路径的访问需要登录
      },
      children:[
        {
          path: "/datamain",
          component: datamain,
          children: [
            {path:'/system',component:system,meta:{require:true}},
            {path:'/userlist',component:userlist,meta:{require:true}},
            {path:'/rolelist',component:rolelist,meta:{require:true}},
            {path:'/menulist',component:menulist,meta:{require:true}}
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    },
    {
      path: '/zhaohui1',
      name: 'zhaohui1',
      component: zhaohui1,
      meta:{require: false}
    }, {
      path: '/zhaohui2',
      name: 'zhaohui2',
      component: zhaohui2,
      meta:{require: false}
    }, {
      path: '/zhaohui3',
      name: 'zhaohui3',
      component: zhaohui3,
      meta:{require: false}
    }

  ]
})
