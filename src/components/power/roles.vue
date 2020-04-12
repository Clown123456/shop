<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格区域 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
             <el-row >
                <el-col><el-button type="primary">添加角色</el-button></el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row  v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1===0 ?'bdtop' :'','vcenter']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag  closable  @close="removeRoleById(scope.row,item1.id)" >{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row  v-for="(item2,i2) in item1.children"  :key="item2.id" :class="[i2!==0 ? 'bdtop':'','vcenter']">

                                    <el-col :span="6">
                                        <el-tag type="success" @close="removeRoleById(scope.row,item2.id)"  closable>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18" >
                                        <!-- 三级用户权限渲染 -->
                                        <el-tag type="danger" v-for="(item3,i3) in item2.children" :key="item3.id" :class="[i3!==0 ? 'bdtop':'']" closable @close="removeRoleById(scope.row,item3.id)" >{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                                    
                            </el-col>
                        </el-row>
                        </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>   
                    </template>
                </el-table-column>     
            </el-table>
            <!-- 展示分配权限的对话框 -->
            <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%" @close="setRightDialog">
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key='id' :default-checked-keys='defKeys' default-expand-all ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="alloRights">确 定</el-button>
            </span>
            </el-dialog>


        </el-card>
        

        
    </div>
</template>
<script>
export default {
    data(){
        return{
            //角色列表存储地方
            roleList:[],
            //设置分配权限对话框是否可见
           setRightDialogVisible:false,
           //权限数据
           rightsList:[],
           //设置树形控件的属性绑定
           treeProps:{
               children: 'children',
               label: 'authName'
           },
           //树形的默认选择那些，根据id来找
           defKeys:[],
           //当前即将分配权限的id
           roleId:''
        }
    },
    created(){
        this.getRoleList()
    },
    methods:{
        //获取角色列表
        async getRoleList(){
            const{data:res}=await this.$http.get('roles')
            // console.log(res)
            if(res.meta.status!==200){
                return this.$message.error("获取角色列表错误")
            }
            this.roleList=res.data
        },
         async removeRoleById(role,id){
        //弹框提示用户是否进行删除，messagebox
        const confirmRes=await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmRes!=="confirm"){
            return this.$message.info("取消了删除")
        }
        //用户确认要删除，发起请求
        const{data:res}=await this.$http.delete(`roles/${role.id}/rights/${id}`)
        if(res.meta.status!==200){
            return this.$message.error("请求失败")
        }
        //这次的接口返回的是最新的数据，因此我们不需要去重新获取角色，因为会重新刷新页面
        role.children=res.data
        
    },
    //展示分配权限的对话框
    async showSetRightDialog(role){
        
        const{data:res}=await this.$http.get('rights/tree')
        //下面的这一行代码是为了拿到当前一级角色的id，为了后面提交做数据准备
        this.roleId=role.id
        console.log(res)
        if(res.meta.status!==200){
            return this.$message.error("获取权限列表失败")
        }
        this.rightsList=res.data
        console.log(this.rightsList)
        //递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)
        //弹出对话框
        this.setRightDialogVisible=true
        
        
    },
    //通过递归的形式，获取角色下所有的三级权限的id，并保存到的defkyes
    getLeafKeys(node,arr){
        //如果当前node是三级节点,直接保存到defkeys中
        if(!node.children){
            return arr.push(node.id)
        }
        //如果不是三级节点，我们需要通过递归来实现重复调用
        node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
        })
    },
    //这个是监听对话框关闭的时候，我们重置一下数组为空，防止污染别的数组
    setRightDialog(){
        this.defKeys=[]
    },
    //点击确定分配权限
    async alloRights(){
        const keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        console.log(keys)
        const idStr=keys.join(',')
        const{data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rid:idStr})
        console.log(res)
        if(res.meta.status!==200){
            return this.$message.error("修改用户权限失败")
        }
        //成功的话，因为api数据返回为空，所以不要介意
        this.getRoleList()
        this.$message.success("修改用户权限成功")
        //然后关闭对话框
        this.setRightDialogVisible=false;

    }
    }
   

    
}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top:solid 1px #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;

}
//这是希望el-row纵向对齐的
.vcenter{
    display:flex;
   align-items: center;

}
    
</style>