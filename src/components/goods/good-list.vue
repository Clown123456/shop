<template>
    <div>
       <!-- 面包屑导航区域 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- card区域 -->
        <el-card>
             <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="inputClear">
                <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
                </el-input> 
                </el-col>
                <el-col :span="4"><el-button type="primary"  @click="addgoods">添加商品</el-button></el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table border stripe :data='goodsList' class="tab_">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop='goods_name' label="商品名称" width="500px"></el-table-column>
                <el-table-column prop='goods_price' label="商品价格(元)"></el-table-column>
                <el-table-column prop='goods_weight' label="商品重量"></el-table-column>
                 <el-table-column  label="创建时间">
                     <template slot-scope="scope">
                         {{scope.row.add_time|dateFormat}}    
                     </template>
                 </el-table-column>
                  <el-table-column  label="操作">
                      <template slot-scope="scope" >
                          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                      <el-button type="danger" size="mini" icon="el-icon-delete" @click="showDeleteBox(scope.row.goods_id)"></el-button> 
                      </template>
                      
                  </el-table-column>
            </el-table>
            <!-- 页面区域 -->
              <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            goodsList:[],
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            total:0
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        async getGoodsList(){
            const{data:res}=await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error("获取商品列表失败")
            }
            console.log(res.data)
            this.total=res.data.total
            this.goodsList=res.data.goods

        },
        handleSizeChange(pagesize){
            this.queryInfo.pagesize=pagesize
            this.getGoodsList()
        },
        handleCurrentChange(pagenum){
             this.queryInfo.pagenum=pagenum
             this.getGoodsList()
        },
        searchGoodsList(){
            this.getGoodsList()
        },
        inputClear(){
            this.getGoodsList()
        },
        async showDeleteBox(id){
            const res=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
            if(res!=='confirm') {
                return this.$message.info("已取消删除")
            }   
            const{data:ret}=await this.$http.delete(`goods/${id}`)
            if(ret.meta.status!==200){
                return this.$message.erroe('删除未成功')
            }
            this.$message.success("删除成功")
            this.getGoodsList()
        },
        addgoods(){
            this.$router.push('/goods/add')
        }
    }
    
}
</script>
<style lang="less" scoped>
.tab_{
    width:1433px
}
    
</style>