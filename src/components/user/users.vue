<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input> 
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="addDialogVisible =true">添加用户</el-button></el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList"  border stripe >
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username">
                </el-table-column>
                <el-table-column label="邮箱" prop="email">
                </el-table-column> 
                <el-table-column label="电话" prop="mobile">
                </el-table-column>

                <el-table-column label="角色" prop="role_name">
                </el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <!-- {{scope.row.id}}通过这个获取到用户的id  -->
                      <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.id)" ></el-button>
                      <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUser(scope.row.id)"></el-button>
                      <el-tooltip effect="dark" content="分配角色" placement="bottom" :enterable="false" >
                      
                      <el-button type="warning" icon="el-icon-setting" size="small" @click="setRole(scope.row)" ></el-button>             
                      </el-tooltip>
                       </template>
                </el-table-column> 
            </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,5,10]"
            :page-size="queryInfo. pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
          <!-- 这是添加用户的对话框 -->
        <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%"  @close="addDialogClose">
            <!-- 对话框内容的主体区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <!-- 用户名验证 -->
           <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" ></el-input>
          </el-form-item>
          <!-- 密码验证 -->
          <el-form-item label="密码" prop="password" type="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
            <!-- 邮箱验证 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
            <!-- 手机验证 -->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
         </el-form>
         <!-- 对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
         <!--这是编辑用户的对话框  -->
        <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
              <!--  编辑弹出的对话框的用户名表单 -->
            <el-form-item label="用户名" >
            <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <!-- 编辑弹出的对话框的邮箱表单 -->
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <!--  编辑弹出的对话框的手机表单 -->
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
            
          <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 这是分配角色对话框 -->
        <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%" @close="setDialogClose">
        <div>
            <p>当前用户：{{userInfo.username}}</p>
            <p>当前角色：{{userInfo.role_name}}</p>
            <p>
                <el-select v-model="selectdRoleId" placeholder="请选择">
                <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
                </el-select>
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
        </el-dialog>


    </div>
</template>
<script>
export default {
    data(){
        //自定义校验规则(验证邮箱的规则,详细请看element)
            var checkEmail=(rule,value,cb)=>{
                const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]))+/
                if (regEmail.test(value)){
                //合法的对象 
                return cb()
                }
                cb(new Error('请输入合法的邮箱'))
                
            }
            
            var checkMobile=(rule,value,cb)=>{
                const regMobile=/^(0|86|17951)?(13[0-9]|15[0123456789|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)){
                //合法的对象 
                return cb()
                }
                cb(new Error('请输入合法的手机号码'))

            }

        return{
            
            // 获取用户列表的对象
            queryInfo:{
                query:'',
                //当前的页数
                pagenum:1,
                // 当前每页想显示多少条数据
                pagesize:2,
            },
            userList:[],
            //共有多少条评论
            total:0,
            //控制添加对话框的隐藏与显示w
            addDialogVisible:false,
            //添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''

            },
            //添加表单的验证规则
            addFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 7, message: '长度在 3到 7个字符', trigger: 'blur'}    
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6到 15个字符', trigger: 'blur'}    
                ],
                 email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: checkEmail, trigger: 'blur' }
                ],
                 mobile:[
                    { required: true, message: '请输入手机号码', trigger: 'blur' }, 
                    { validator: checkMobile, trigger: 'blur' } 
                ]

            },
            //控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            //查询到的用户信息对象
            editForm:{},
            //编辑表单的验证规则
            editFormRules:{
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号码', trigger: 'blur' }, 
                    { validator: checkMobile, trigger: 'blur' } 
                ]
            },
            //设置分配角色是否可见
            setRoleDialogVisible:false,
            //需要被分配角色的用户信息
            userInfo:{},
            //通过api获取到的角色数组
            rolesList:[],
            //已选中的角色id值
            selectdRoleId:''

            

        }
    },
    created(){
        this.getUserList() 
       
    },
    methods:{
        // 获取用户列表
        async getUserList(){
            const{data:res}= await this.$http.get('users',{params:this.queryInfo})
            if(res.meta.status!==200)return this.$message.error("获取用户列表失败")
            this.userList=res.data.users
            this.total=res.data.total
            // console.log(res)
            // console.log(this.userList)
        },
        // 监听pagesize发生改变
        handleSizeChange(newSize){
            // console.log(newSize)
            this.queryInfo.pagesize=newSize
            this.getUserList()
        },
        // 监听页码值发生改变
        handleCurrentChange(newPage){
            // console.log(newPage)
            this.queryInfo.pagenum=newPage
            this.getUserList()

        },
        // 监听swith状态的改变
        async userStateChanged(userInfo){
            console.log(userInfo)//是一个对象，这里的形参由上面的实参获得
            //调用接口，修改数据库用户
            const{data:res}=await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            // console.log(res)
            if(res.meta.status!==200){
                //如果失败了，我们要把状态重置回去，直接取反就可以了
                userInfo.mg_state=!userInfo.mg_state
                return this.$message.error("修改用户状态失败")}
                this.$message.success("更新用户状态成功")
            
        },
        //监听用户对话框的关闭事件
        addDialogClose(){
            console.log(this.$refs.addFormRef)
            this.$refs.addFormRef.resetFields()
            
        },
        //点击按钮，添加新用户
        addUser(){
            //在拿到数据之前，先进行预校验
             this.$refs.addFormRef.validate(async vaild=>{
                // console.log(vaild)//数据校验不成功的话返回为false
                if(!vaild){
                    return this.$message.error("您提交的数据不符合规范，请重新提交")
                }
                //校验成功
                const{data:res}=await this.$http.post('users',this.addForm)
                if(res.meta.status!==201){
                    return this.$message.error("添加失败")
                }
                this.$message.success("添加成功")
                //此时要关闭对话框,
                this.addDialogVisible=false
                //刷新列表
                this.getUserList()
            })

        },
        //展示编辑用户对话框
        async showEditDialog(id){
            //拿到一行的id，通过id来操作数据
            // console.log(id)
            const{data:res}=await this.$http.get('users/'+id)
            if(res.meta.status!==200){
                return this.$message.error("获取用户数据失败")
            }
            this.editForm=res.data
            this.editDialogVisible=true
            console.log(this.editForm)
        },
        //编辑弹出表单信息重置
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //编辑弹出表单信息预先校验
        editUserInfo(){
            this.$refs.editFormRef.validate( async vaild=>{
                if(!vaild)return
                //发起用户请求 (这样写是因为，后面两个可以为空)
                const {data:res}=await this.$http.put('users/'+this.editForm.id+{email:this.editForm.email,mobile:this.editForm.mobile})
                console.log(res)
                if(res.meta.status!==200) return this.$message.error("更新用户信息失败")
                //关闭对话框
                this.editDialogVisible=false
                //重新更新数据
                this.getUserList()
                //提示更新成功
                this.$message.success("更新用户信息成功")
                
            })
            
            
        },
        //删除用户
        async removeUser(id){
            //先弹框，询问用户是否进行删除
          const res=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)//.catch是为了捕获用户点击取消后的数据，
        console.log(res)//confirm和cancle
        //监听用户点击了取消
        if(res!=="confirm"){
            return this.$message.warning("未删除用户")
        }
        //监听用户点击了确认
        const{data:ret}=await this.$http.delete('users/'+id)
        if(ret.meta.status!==200){
            return this.$message.error("删除用户失败")  
        }
        this.getUserList()
        this.$message.success("删除用户成功！")
        // console.log(id)
            
        },
        //设置分配角色
        async setRole(userInfo){
            //获取当前用户
            this.userInfo=userInfo
            //获取角色列表（因为要把一些角色赋给当前用户）
            const{data:res}=await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error("获取角色列表失败")
            }
            //成功的话
            this.rolesList=res.data
            this.setRoleDialogVisible=true
        },
        //点击按钮，添加角色
        async saveRoleInfo(){
            if(!this.selectdRoleId){
                return this.$message.info("请选择要分配的角色")
            }
            console.log(this.selectdRoleId)
            console.log(this.userInfo.id)
            const{data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectdRoleId})
            console.log(res)
            if(res.meta.status!==200){
                return this.$message.error("设置角色失败")
            }
            this.getUserList()
            this.$message.success("设置角色成功")
            this.setRoleDialogVisible=false

        },
        setDialogClose(){
            this.selectdRoleId=''
            this.userInfo={}
        }
    }
    
}
</script>
<style lang="less" scoped>
    
</style>