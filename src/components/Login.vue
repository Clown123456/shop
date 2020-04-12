<template>
<div class="login">
   <div class="login-contain">
     <!-- logo区域 -->
    <div class="logo_contain">
      <img src="../assets/logo.png" alt="">    
    </div>
    <!-- 登录区域 -->
  <el-form ref="loginFormRef" label-width="0px" class="form_area" :model="form" :rules="rules">
    <!-- 登录名字区域 -->
  <el-form-item  prop="username">
    <el-input  prefix-icon="iconfont icon-user" placeholder="请输入账号" v-model="form.username"  ></el-input>
  </el-form-item>
  <!-- 登录密码区域 -->
  <el-form-item prop="password">
    <el-input  prefix-icon="iconfont icon-lock_fill"  placeholder="请输入密码" v-model="form.password" type="password" ></el-input>
  </el-form-item>
  <!-- 按钮区域 -->
  <el-form-item class="btn_area">
    
    <el-button type="primary"  @click="login">登录</el-button>
    <el-button type="info" @click="resetLoginForm">重置</el-button> 
  </el-form-item>
  </el-form>
  </div>
</div>
</template>

<script>
export default {
  data(){
    return{
      //双向绑定设置表单的数据
      form:{
        username:'admin',
        password:'123456'
      },
      //设置表单验证的规则
      rules:{
        username:[
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max:7, message: '长度在3到7个字符', trigger: 'blur'}
             ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min:6, max: 15, message: '长度在6到15个字符', trigger: 'blur'}

        ]       
      }
      

    }
  
  },
  methods:{
    // 点击重置按钮，重置登录输入框的内容
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    }, 
    login(){
      this.$refs.loginFormRef.validate(async vaild=>{
        if(!vaild)return;
        const{ data:res}=await this.$http.post('login',this.form)
        // 设置登录成功和失败之后的信息弹框
        if(res.meta.status!==200){
          return this.$message.warning("登录失败")
         
        }
        this.$message.success("登录成功") 
        //此时，我们登录成功了，要拿到token，也就是一种状态的声明，保存到sessionStronge中
        // console.log(res.data.token)
        window.sessionStorage.setItem('token',res.data.token)
        //设置了token之后，我们就要进行路由的跳转了，使用编程式导航
        this.$router.push('/home')
        

      })
    }
   
  } 
}
</script>
<style lang="less" scoped>
.login{
  background-color: #2b4b6b;
  height: 100%;
  .login-contain{
  height:300px;
  width: 450px;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-225px,-225px);
   background-color: #fff;
  .logo_contain{
    width: 150px;
    height:150px;
    position:relative;
    left:150px;
    top:-75px;
    box-shadow:0 0 10px #ddd;
    background-color: #fff;
    border-radius: 50%;
   
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #fff;
    }
  }
  .form_area{
    position:absolute;
    bottom: 0;
    width:100%;
    padding:0 15px;
    box-sizing: border-box;

    .btn_area{
      display:flex;
      justify-content: flex-end;
      
    }

  }
  
  }

}

</style>
