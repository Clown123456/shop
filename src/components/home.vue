<template>
<el-container class="header_contain">
    <!-- 头部区域 -->
  <el-header>
      <div><img src="../assets/bili_logo.png" alt=""> <span>后台系统 </span></div>
      <el-button @click="logout">退出</el-button>
  </el-header>
  <el-container>
      <!-- 左侧的侧边栏 -->
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu background-color="#4D4D4D" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
          <!-- 一级菜单进行设置 -->
        <template slot="title">
            <!-- 一级菜单的图片 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 一级菜单的文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key=subItem.id @click="saveNavState('/'+subItem.path)" >
          <template slot="title">
            <!-- 二级菜单的图片 -->
          <i class="el-icon-menu" ></i>
          <!-- 二级菜单的文本 -->
          <span>{{subItem.authName}}</span>
        </template>
          
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右边主体区域 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
    
</template>
<script>
export default {
  data(){
    return{
      //获取到的菜单
      menuList:[],
      // 一级菜单不一样，需要手动给
      iconsObj:{
        '125':'iconfont icon-users',
       '101':'iconfont icon-tijikongjian',
        '102':'iconfont icon-shangpin',
        '145':'iconfont icon-danju',
        '103':'iconfont icon-baobiao',
      },
      //不要加引号
      isCollapse:false ,
      activePath:''  
    } 
  },
  methods:{
    // 退出登录，要清空token，同时跳转到login页面
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      // 获取所有的菜单
      const{data:res}=await this.$http.get('menus')
      if(res.meta.status!==200)return this.$message.error(res.meta.msg)
      this.menuList=res.data
      // console.log(res)
      // console.log(this.menuList)
    },
    // 实现菜单栏的切换折叠功能
    toggleCollapse(){
      this.isCollapse=!this.isCollapse

    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }

  },
  created(){
    // 获取所有的菜单
    this.getMenuList()
    //给activePath赋值，让他在页面还在创建的时候就被激活
    this.activePath=window.sessionStorage.getItem("activePath")
  }
    
}

</script>
<style lang="less" scoped>
.header_contain{
    height: 100%;
}
.el-header{
    background-color: #3c3c3c;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #ffffff;
    font-size:20px;
    div{
        display:flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }

    
}
.el-aside{
    background-color: #4d4d4d;
    

    }
.iconfont{
  margin-right: 10px;
}
.el-menu{
  border-right:none;
}
.toggle-button{
  background-color: #5D5D5D;
  font-size:10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;

}


    
</style>
