# shopes

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint

###后台启动
```
打开vue-api-serve db文件夹下的mydb.sql进行导入到数据库名称为mydb数据库中，
执行npm install 命令，安装完毕后，执行node app.js 启动后台

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
login页面登录的问题：
1.表单限制信息的问题element 提供的
:rules="rules"，在data中{rules：[ name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]}
首先根据提交的表单，获取到数据，
token指令：
1.在我们请求后台数据的时候，通过window.sessionStorage.setItem('token',res.data.token)拿到后台给我们的token，
2.我们在进行路由跳转的时候，要保证必须由登录页面来进行跳转，因此我们要为路由导航守卫控制访问的权限：（在router的index.js里面写）使用router.beforeEach((to,from,next)=>{})来进行限制
3.我们在退出到上一页的时候，如果需要清空用户的信息，需要清空token，使用this.$router.sessionStorage.clear(),然后路由导航回到主页面
4.请求拦截token，我们在访问页面的时候，多个页面都需要token，可以通过axios拦截token，进入下一个页面，（在main.js里设置）
axios.interceptors.request.use(config=>{
  //在config中一个headers，我们需要为header添加一个属性Authorization来挂载我们的token，
  config.headers.Authorization=window.sessionStorage.getItem('token')
  
  //必须要return，相当与于把请求给发送出去，否则会报错
  return config
})
menu注意点：
1.menu有一个属性 router，默认为false，设置为true可以跳转到/index(当前索引值的页面，我们不想要这个索引值作为跳转的url，我们看到接口里面有path：“user”等属性，可以作为/user进行路由的跳转，需要在:index中进行设置，同时要注意，一定要加上/,也就是：index="'/'+item.path")
2.关于menu的高亮，因为是二级菜单高亮，需要拿到index值做属性值，但是菜单是动态的，我们不能写死为一个，所以，我们先通过sessionStorage存储一个状态activestate，这个值由我们的index来传进去，然后我们然后我们在data中定义一个数据state，再在页面创建时拿到通过this.state=weindow.sessionStorage.getitem('activestate')
### 关于表格的问题：
我们要渲染一个状态，通过switch去执行，
解决方法1：通过已经拿到的数组，取出状态，通过双向绑定到swith上，然后通过点击，写一个方法来改变状态,但是菜单是页面创建的时候就载入了，
解决方法2：通过作用域插槽来实现<template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" >
                    </template>
### 关于refs的属性：
this.$refs.xxx.resetFields()重置表单
this.refs.xxx.vaildate(vail=>{
  vail为真，走请求
})表单预校验，如果返回值为布尔类型的
### 关于角色分配的技术盲点：
根据api接口。点击确定后，我们需要做的就是拿到角色的id，这个只能在打开对话框的时候拿，因此在另一个函数体拿到，赋值给data中的属性值，
