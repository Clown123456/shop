<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
          <el-row>
            <el-col><el-button type="primary" @click="showAddDialog" >添加分类</el-button></el-col>
          </el-row>
          <!-- 表格区域 -->
          <tree-table class="treeTable" :data='cateList' :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover='false'>
              <!-- 是否有效 -->
              <template slot="isok" slot-scope="scope">
                  <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
                  <i class="el-icon-error"  style="color:red" v-else></i>
                                        
                  
              </template>
              <!-- 排序 -->
              <template slot="order" slot-scope="scope">
                  <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                  <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                  <el-tag type="warning" size="mini" v-else>三级</el-tag>
              </template>
              <!-- 操作 -->
              <template slot="setting" >
                <el-button type="warning" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-setting" size="mini">删除</el-button> 
              </template>
          </tree-table>

            <!-- 分页区域 -->
             <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="AddCateDialogVisible"
        width="50%"  @close="addCateClose">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" :rules=" addCateFormRules" ref="addCateFormRef" label-width="100px" >
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <!-- options用来指定数据源 -->
            <!-- cascaderProps用来指定配置对象 -->
            <el-cascader
                
                :props="cascaderProps"
                :options="ParentCateList"
                v-model=" selectKeys"
                @change="parentCascaderChange" clearable >
            </el-cascader>
            
           

            </el-form-item>
            
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="AddCateDialogVisible= false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>
        
        
        
    </div>
</template>
<script>
export default {
    data(){
        return{
            //商品分类的数据列表
            cateList:[],
            queryInfo:{
                tyep:3,
                pagenum:1,
                pagesize:5
            },
            //总共有多少条数据
            total:0,
            columns:[
                {
                label:"分类名称",
                prop:"cat_name",
                },
                {
                    label:"是否有效",
                    prop:"cat_deleted",
                    //表示当前定义的模板列
                    type:"template",
                    //当前列的模板名称
                    template:"isok",
                },
                  {
                    label:"排序",
                    prop:"cat_level",
                    //表示当前定义的模板列
                    type:"template",
                    //当前列的模板名称
                    template:"order",
                },
                 {
                    label:"操作",
                    //表示当前定义的模板列
                    type:"template",
                    //当前列的模板名称
                    template:"setting",
                }
                
            ],
            //控制添加分类的对话框
           AddCateDialogVisible:false,
           //添加分类的表单数据对象
           addCateForm:{
               //将要添加的分类的名称
               cat_name:'',
               //父级分类的id
               cat_pid :0,
               //分类的等级默认要添加的是一级分类
               cat_level:0,
           },
           addCateFormRules:{
               cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
               ]
               
           },
        //    父级分类列表
           ParentCateList:[],
          
           //级联选择器的prop配置对象
           cascaderProps:{
               //级联选择器上你所看到的对象
               label:'cat_name',
               //级联选择器上每个属性绑定的id
               value:'cat_id',
               //为级联选择器指定子属性
               children:'children',
               expandTrigger:'hover',
               checkStrictly:true,
               
           },
          
           //选中的数据的id
           selectKeys:[],
           
           
           
           
            
        }
    },
    created(){
        this.getCateList()
       
        
    },
    methods:{
        async getCateList(){
            const{data:res}=await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error("请求商品分类错误")
            }
            this.cateList=res.data.result
            this.total=res.data.total
            

        },
        //监听pagesize事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getCateList()

        },
        //监听pagenum的改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage

        },
        showAddDialog(){
            this.getParentCateList()
    
            //获取添加列表的数据
            this.AddCateDialogVisible=true
        },
        //获取父级分类的数据列表
        async getParentCateList(){
            const {data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200){
                return this.$message.error("获取分类列表失败")
            }
            this.ParentCateList=res.data
            
           console.log(this.ParentCateList)
            
          
        },
        //选择性发生变化触发这个函数
        parentCascaderChange(){ 
             
            console.log(this.selectKeys)
            //如果selectdkeys数组的长度大于1，代表选择了分类，
            if(this.selectKeys.length>0){
                //这个数组中的第二项就是所填的父id
                this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
                this.addCateForm.cat_level=this.selectKeys.length
                return 
            }else{
                this.addCateForm.cat_level=0
                this.addCateForm.cat_pid=0
            }
            //然后再去判断长度，如果为2，则为三级分类，如果是1，则输入的添加为二级分类
            //如果没有，代表没有选择，则输入的就是一级分类
        },
        //点击确认，添加分类
        addCate(){
           console.log(this.addCateForm)
           //首先要校验
            this.$refs.addCateFormRef.validate(async value=>{
               if(!value) return 
               const{data:res}=await this.$http.post('categories',this.addCateForm)
               if(res.meta.status!==201){
                   return this.$message.error("添加失败")
               }
               console.log(res.data)
               this.getCateList()
               this.AddCateDialogVisible=false
               this.$message.success("添加成功")
           })

           
           //发起请求
        },
        //监听添加对话框的关闭事件，清空对话框
        addCateClose(){
            //重置表单里面的输入框
          this.$refs.addCateFormRef.resetFields()
          //重置输入框下面的级联选择器
          this.addCateForm.cat_level=0
          this.addCateForm.cat_pid=0
          this.selectKeys=[]
         
          
            
        }
        
    },
        
    
}
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader{
    width:100%
}
    
</style>