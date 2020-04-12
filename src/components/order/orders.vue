<template>
    <div>
        <!--面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
       </el-breadcrumb>
               <!--卡片视图区域  -->
        <el-card>
            <el-row >
                <el-col :span="7">
                <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getOrdreList">
                <el-button slot="append" icon="el-icon-search" @click="getOrdreList"></el-button>
                </el-input> 
                </el-col>   
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="orderList"  class="ordreTable" border stripe>
                
                    <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款">
                    <template slot-scope="scope">                          
                    <el-button type="danger" v-if="scope.row.order_pay=='0'" >未付款</el-button>
                    <el-button type="success" v-else>已付款</el-button>
                     </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time|dateFormat}}
                        
                    </template>

                </el-table-column>
                <el-table-column label="操作">                                                            
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogVisible"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>                  
                </el-table-column>    
            </el-table>
               <!-- 页码区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 点击编辑按钮所展示的对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClose">
        <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
          <el-form-item label="省市区县" prop="address1">
           <el-cascader  :options="cityData"  v-model="EditForm.address1" :props="cascaderProp" clearable @change="cascaderChange" >
           </el-cascader>
          </el-form-item>
           <el-form-item label="详细地址" prop="address2">
            <el-input v-model="EditForm.address2"></el-input>
          </el-form-item>
        </el-form>

        
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 查看物流对话框 -->
        <el-dialog
        title="查看物流"
        :visible.sync="ProgressDialogVisible"
        width="50%">
        <!-- 物流信息时间线 -->
        <el-timeline >
            <el-timeline-item
            v-for="(item, index) in progressInfo"
            :key="index"
            :timestamp="item.ftime">
            {{item.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>
        
    </div>
</template>
<script>
import cityData from './citydata'
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5,
            },
            total:0,
            orderList:[],
            editDialogVisible:false,
            EditForm:{
                address1:[],
                address2:''

            },
            EditFormRules:{
                address1:[
                      { required: true, message: '请选择省市区县', trigger: 'blur' }                    
                ],
                address2:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ]

            },
            cityData,
            cascaderProp:{
                expandTrigger: 'hover',
            },
            //展示物流信息对话框的可见
            ProgressDialogVisible:false,
            progressInfo:[]


            
        }
    },
    created(){
        this.getOrdreList()
    },
    methods:{
        // 获取订单列表
        async getOrdreList(){
            const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error("获取订单列表失败")
            }
            console.log(res.data.goods)
            this.total=res.data.total
            this.orderList=res.data.goods

        },
        //监听页码区间的改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getOrdreList()

        },
        //监听页码的改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getOrdreList()
        },
        showEditDialogVisible(){
            this.editDialogVisible=true
        },
        editDialogClose(){
            this.$refs.EditFormRef.resetFields()
        },
        cascaderChange(){
            // this.EditForm.address1=val
            //先判断一下第一个输入框级联选择器里面的长度，
            //如果长度为0，则没有选择，下面的第二个输入框应该被禁用
            console.log(this.EditForm.address1)     
        },
        async showProgressBox(){
            //打开物流信息对话框的时候发起请求
            const{data:res}=await this.$http.get('/kuaidi/1106975712662')
            if(res.meta.status!==200){
                return this.$message.error("获取物流信息失败")
            }
            this.progressInfo=res.data
            this.ProgressDialogVisible=true
            console.log(res.data)


        }
        
        

        
    }
    
}
</script>
<style lang="less" scoped>
.ordreTable{
    margin: 15px,0
}
.el-cascader{
    width:100%

}
    
</style>