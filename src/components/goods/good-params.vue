<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
              <el-alert
                title="注意！只允许为第三级分类设置相关参数"
                type="warning"
                 show-icon
                 :closable='false'>
              </el-alert>
              <!-- 选择商品分类区域 -->
              <el-row class="cat_opt">
                  <el-col>
                      <span>选择商品分类</span>
                      <!-- 级联选择区域 -->
                      <el-cascader
                        :options="parentCateList"
                        :props="cateProps"
                        v-model="cateSelected"
                        @change="cateSelectedChange"
                        >
                      </el-cascader>
                  </el-col>
              </el-row>
              <!-- 页签区域 -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <!-- 添加动态参数的面板 -->
                    <el-tab-pane label="用户管理" name="many">
                      <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showDialog" >添加参数</el-button>
                        <!--动态参数表格  -->
                        <el-table :data='manyTableData' border stripe>
                            <el-table-column type='expand'>
                                <template slot-scope="scope">
                                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)" >
                                        {{item}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                  
                                    
                                    
                                </template>
                            </el-table-column>
                            <el-table-column type="index"></el-table-column>
                            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeParams">删除</el-button>
                                </template>
                            </el-table-column>                        
                        </el-table>

                    </el-tab-pane>
                    <!-- 添加静态属性的面板 -->
                    <el-tab-pane label="配置管理" name="only">
                        <el-button type="primary" size="mini"  :disabled="isBtnDisabled" @click="showDialog">添加属性</el-button>
                        <!-- 添加静态属性的面板 -->
                        <el-table :data='onlyTableData' border stripe>
                            <el-table-column type='expand'>
                                <template slot-scope="scope">
                                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)" >
                                        {{item}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                  
                                    
                                    
                                </template>
                            </el-table-column>
                          
                            <el-table-column type="index"></el-table-column>
                            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams">删除</el-button>
                                    
                                </template>
                            </el-table-column>                        
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
              
        </el-card>
        <!-- 添加的对话框 -->
        <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%" @close="addFormClose">
        <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px" >
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>    
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改的对话框 -->
         <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="50%" @close="editFormClose">
        <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px" >
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name">{{this.editForm.attr_name}}</el-input>
            </el-form-item>
        </el-form>    
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            parentCateList:[],
            cateSelected:[],
            cateProps:{
                expandTrigger:'hover',
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            activeName:'many',
            //动态参数的数据
            manyTableData:[],
            //静态参数的数据
            onlyTableData:[],
            addDialogVisible:false,
            addForm:{
                attr_name:''
            },
            addFormrules:{
                attr_name:[
                      { required: true, message: '请输入名称', trigger: 'blur' }

                ]
            },
            editDialogVisible:false,
            editForm:{
                attr_name:''
            },
           editFormrules:{
                attr_name:[
                      { required: true, message: '请输入名称', trigger: 'blur' }

                ]
            },
            //tag标签的显示与隐藏
            // inputVisible:false,
            //tag标签输入的内容
            // inputValue:'',




           

            

        }
    },
    methods:{
        async getParentCateList(){
            const{data:res}=await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error("获取商品列表失败")
                
            }
            this.parentCateList=res.data
            console.log(res.data)

        },
         cateSelectedChange(){
             this.getParamsData()
            
           
        },
        handleClick(){
            console.log(this.activeName)
            this.getParamsData()
            
            
        },
        //获取参数的列表数据
        async getParamsData(){
             //进行判断数组的长度，如果数组的长度为3，
            //则选中了三级分类，如果不是三级
            //我们将数组重置，也就是恢复到空的状态
            if(this.cateSelected.length!==3){
                this.cateSelected=[]
                //这个防止选择的不是三级分类，但是还会渲染出下面的tag
                //但是实际上不存在这样的现象
                this.manyTableData=[]
                this.onlyTableData=[]
                return 
            }
            //是三级分类
            console.log(this.cateSelected)
            //开始发起请求
            const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
             if(res.meta.status!==200){
                 return this.$message.error("获取参数列表失败")

             }
             //获取成功的话
            //  console.log(res.data)
            //进行遍历，然后将里面的attr_vals转换为数组，以便使用tag标签渲染
             res.data.forEach(item=>{ 
                item.attr_vals= item.attr_vals ?item.attr_vals.split(",") :[]
                item.inputVisible=false
                item.inputValue=''  
             })
            
             console.log(res.data)
             //我们要进行判断，是静态属性还好动态参数
             //然后把值赋给对应的。。
             if(this.activeName=='many'){
                 this.manyTableData=res.data
                 
             }else{
                  this.onlyTableData=res.data
             }
            


        },
        showDialog(){
            this.addDialogVisible=true
        },
        addFormClose(){
            this.$refs.addFormRef.resetFields()
        },
        addParams(){
            this.$refs.addFormRef.validate( async val=>{
                if(!val){
                    return 
                }
                const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName

                    })
                    if(res.meta.status!==201){
                        return this.$message.error("添加参数失败")
                    }
                    console.log(res.data)
                    this.$message.success("添加参数成功")
                    this. getParamsData()
                    this.addDialogVisible=false
            })
        },
        async showEditDialog(id){
            const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
            if(res.meta.status!==200){
                return this.$message.error("获取参数列表失败")
            }
            this.editForm=res.data
            this.editDialogVisible=true
            console.log(this.editForm)
            

        },
        //提交修改的数据
        editParams(){
            this.$refs.editFormRef.validate( async val=>{
                if(!val){
                    return 
                }
                const {data:res}=await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,{
                    attr_name :this.editForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status!==200){
                    return this.$message.error("修改失败")
                }
                this.$message.success("修改成功")
                this.getParamsData()
                this.editDialogVisible=false
                })
            
        },
        editFormClose(){
             this.$refs.editFormRef.resetFields()

        },
        async removeParams(){
          const confirmRes=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmRes!=='confirm'){
            return this.$message.info("已取消删除！")
        }
        const{data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`)
        if(res.meta.status!==200){
            return this.$message.error("删除未成功")
        }
        this.$message.success("删除成功")
        this.getParamsData()

           
       },
       //键盘抬起时或者移出去时候触发的事件
       //也就是我们输入完之后，我们想要展示按钮

       async handleInputConfirm(row){
           console.log('ok')
           //如果输入框的内容不合法，清空输入框的内容
           if(row.inputValue.trim().length===0){
               row.inputValue=''
               row.inputVisible=false
               return
           }
           //将输入框里面的内容添加进循环的数据
           row.attr_vals.push(row.inputValue.trim())
           row.inputValue=''
           row.inputVisible=false
           //发起请求，保存到数据库中
           this.saveAttrVals(row)
           

           
       },
       async saveAttrVals(row){
           //发起的请求中需要将我们通过join(',')
           //分割成的数字重新转换成字符串来进行发起请求
           const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
               attr_name:row.attr_name,
               attr_sel:row.attr_sel,
               attr_vals:row.attr_vals.join(',')

           })
           if(res.meta.status!==200){
               return this.$message.error("提交失败！")

           }
           this.$message.success("修改成功")
        //    this.getParamsData()
       },
        handleClose(row,i){
           //从第几个位置开始删，删除几个，
           row.attr_vals.splice(i,1)
           this.saveAttrVals(row)
       },
       //展示button按钮
       showInput(row){
          row.inputVisible=true
          //让文本框自动获得焦点
          //$nextTick方法，就是当前页面元素被重新渲染之后
          //才会指定的回调函数
          this.$nextTick(_=> {
          this.$refs.saveTagInput.$refs.input.focus()
          console.log(_)
        })
       },
      
       
    },
    created(){
        this.getParentCateList()
    },
    computed:{
        //如果按钮需要被禁用，则返回true
       isBtnDisabled(){
            if(this.cateSelected.length!==3){
                return true   
             }
             return false

       },
       //获取参数列表的id
       cateId(){
           if(this.cateSelected.length===3){
               return this.cateSelected[2]
           }
           return null
       },
       titleText(){
           if(this.activeName==="many"){
               return "动态参数"
           }
           else{
               return "静态属性"
           }
       },
       
    }
    
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin:15px 0
}
.el-tag{
    margin:0 10px
}
.input-new-tag{
    width:120px
}
</style>