<template>
  <div>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>

    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      show-checkbox
      node-key="id"
      :filter-node-method="filterNode"
      ref="tree"
      @node-click="handleNodeClick">
    </el-tree>
    <div>
      <div>
        <el-dialog
          :title="menuName"
          :visible.sync="dialogVisible"

          width="33%"
          :before-close="handleClose">
          <el-row>
            <el-button v-if="ww.authmap.addMenu!=null" icon="el-icon-plus" circle @click="addMenu"></el-button>
            <el-button v-if="ww.authmap.updateMenu!=null" type="primary" icon="el-icon-edit" circle @click="updateMenu"></el-button>
            <el-button v-if="ww.authmap.delMenu!=null" type="danger" icon="el-icon-delete" circle @click="deleteMenu"></el-button>
            <el-button v-if="ww.authmap.addMenu!=null" type="warning" icon="el-icon-star-off" circle @click="ownAddMenu"></el-button>
          </el-row>
          <hr/>
          <!--添加子集开始  -->
          <el-form :inline="true" :model="entitymod" :hidden="addHidden" v-if="entitymod.leval!=4"
                   label-position="left">
            <div>
              <el-form-item label="+添加子菜单">

              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单等级:">
                {{entitymod.leval}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单名称">
                {{entitymod.menuName}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单ID">
                {{entitymod.id}}
              </el-form-item>
            </div>
            <el-form-item label="新添加子菜单的名称">
              <el-input v-model="entitymod.menuNameAdd" placeholder="新添加子菜单的名称"></el-input>
            </el-form-item>
            <el-form-item label="新添加子菜单访问的URL" v-if="entitymod.leval>=3">
              <el-input v-model="entitymod.urlAdd" placeholder="菜单访问的URL"></el-input>
            </el-form-item>

          </el-form>
          <!--添加子集结束  -->

          <!--修改子集开始  -->
          <el-form :inline="true" :model="entitymod" :hidden="updateHidden" label-position="left">
            <el-form-item label="修改菜单" label-width="150px">

            </el-form-item>

            <div>
              <el-form-item label="当前菜单等级:">
                {{entitymod.leval}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单名称">
                {{entitymod.menuName}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单ID">
                {{entitymod.id}}
              </el-form-item>
            </div>

            <el-form-item label="菜单的名称">
              <el-input v-model="entitymod.menuName" placeholder="新添加子菜单的名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单访问的URL" v-if="entitymod.leval>2">
              <el-input v-model="entitymod.url" placeholder="菜单访问的URL"></el-input>
            </el-form-item>

          </el-form>
          <!--修改子集开始  -->

          <!--删除子集开始  -->
          <el-form :inline="true" :model="entitymod" :hidden="deleteHidden" label-position="left">
            <el-form-item label="删除菜单">

            </el-form-item>
            <div>
              <el-form-item label="当前菜单等级:">
                {{entitymod.leval}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单名称">
                {{entitymod.menuName}}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="当前菜单ID">
                {{entitymod.id}}
              </el-form-item>
            </div>

            <el-form-item>
              你确定你要删除吗？
            </el-form-item>

          </el-form>
          <!--删除子集结束  -->

          <!--添加菜单开始  -->
          <el-form :inline="true" :model="entitymod" :hidden="addOwnMenu" label-position="left">
            <el-form-item label="添加一级菜单" label-width="150px">

            </el-form-item>


            <el-form-item label="菜单的名称">
              <el-input v-model="entitymod.menuNameAdd" placeholder="新添加一级菜单的名称"></el-input>
            </el-form-item>
          </el-form>
          <!--添加菜单结束  -->

          <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
        </span>
        </el-dialog>

      </div>

    </div>
  </div>
</template>

<script>

  export default {
    name: 'menulist',
    data() {
      return {
        ww:this.$store.state.userInfo,
        filterText: '',
        data: [],//总权限列表
        defaultProps: {
          children: 'menuInfoList',//下级权限列表
          label: 'menuName'//权限名字
        },
        entitymod: {},
        dialogVisible: false,
        menuName: "当前工作的菜单名称-",
        addHidden: true,//添加子集 隐藏
        updateHidden: true,
        deleteHidden: true,
        addOwnMenu: true//添加目录 隐藏
      }
    },
    watch: {
      filterText(val) {    //监测Vue实例上的数据变动
        this.$refs.tree.filter(val);
      }
    },
    mounted: function () {
      console.log("进入权限列表");

      this.getMenu();

    },
    methods: {
      getMenu() {
        //获取所有的权限
        this.$axios.post(this.domain.serverpath + "menuList").then((res) => {
          this.data = res.data.result;
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        //menuName 过滤方法
        return data.menuName.indexOf(value) !== -1;
      },
      handleNodeClick(data) {
        this.dialogVisible = true;
        this.entitymod = data;
        this.menuName = "当前工作的菜单名称-" + this.entitymod.menuName;
        if (this.entitymod.leval == 4) {
          this.addHidden = true;
          this.updateHidden = false;
          this.deleteHidden = true;
          this.addOwnMenu = true;
        } else {
          this.addHidden = false;
          this.updateHidden = true;
          this.deleteHidden = true;
          this.addOwnMenu = true;
        }

      },
      handleClose(done) {
        this.dialogVisible = false;
        this.addHidden = true;
        this.updateHidden = true;
        this.deleteHidden = true;
        this.addOwnMenu = true;

        this.entitymod = {};
        this.getMenu();
      },

      addMenu() {
        if (this.entitymod.leval == 4) {
          this.$message({
            message: '当前菜单不能添加子菜单',
            type: 'warning',
            duration: '1000'
          });
        } else {
          this.addHidden = false;
          this.updateHidden = true;
          this.deleteHidden = true;
          this.addOwnMenu = true;
        }

      },
      updateMenu() {
        alert(this.entitymod.leval);
        this.addHidden = true;
        this.updateHidden = false;
        this.deleteHidden = true;
        this.addOwnMenu = true;
      },
      deleteMenu() {
        this.addHidden = true;
        this.updateHidden = true;
        this.deleteHidden = false;
        this.addOwnMenu = true;
        var id = this.entitymod.id;
        this.$refs.tree.setCheckedKeys([id]);
      },
      ownAddMenu() {
        this.addHidden = true;
        this.updateHidden = true;
        this.deleteHidden = true;
        this.addOwnMenu = false;
      },
      getCheckedKeys() {
        var url = "";
        if (this.addHidden == false) {
          url = "addMenu";
          if (this.entitymod.menuNameAdd == null || this.entitymod.menuNameAdd == "") {
            this.$message({
              message: '新添加子菜单名称不能为空',
              type: 'warning',
              duration: '1000'
            });
            return;
          }

          this.entitymod.parentId = this.entitymod.id;
          this.entitymod.leval = this.entitymod.leval + 1;
          this.entitymod.menuName = this.entitymod.menuNameAdd;
          this.entitymod.url = this.entitymod.urlAdd;
        }
        if (this.addOwnMenu == false) {
          url="addMenu";
          this.entitymod.leval = 1;
          this.entitymod.parentId = 0;
          this.entitymod.menuName = this.entitymod.menuNameAdd;
          this.entitymod.url = ""
          if (this.entitymod.menuNameAdd == null || this.entitymod.menuNameAdd == "") {
            this.$message({
              message: '菜单名称不能为空',
              type: 'warning',
              duration: '1000'
            });
            return;
          }
        }
        if (this.updateHidden == false) {

          url = "updateMenu";
          if (this.entitymod.menuName == null || this.entitymod.menuName == "") {
            this.$message({
              message: '菜单名称不能为空',
              type: 'warning',
              duration: '1000'
            });
            return;
          }

        }
        if (this.deleteHidden == false) {
          let ids = this.$refs.tree.getCheckedKeys();
          this.entitymod.ids = ids;
          url = "delMenu";

        }
        console.log(this.entitymod);
        this.$axios.post(this.domain.serverpath + url, this.entitymod).then((res) => {


          this.$message({
            message: '恭喜你，操作成功',
            type: 'success',
            duration: '1000'
          })
          this.dialogVisible = false;
          this.addHidden = true;
          this.updateHidden = true;
          this.deleteHidden = true;
          this.addOwnMenu = true;

          this.getMenu();

        }).catch((x) => {
          this.$message({
            message: '你没有操作权限',
            type: 'error',
            duration: '1000'
          });
        })
      }
    }
  }
</script>

<style>

</style>
