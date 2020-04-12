<template>
    <div>
          <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon :closable='false'>
            </el-alert>
            <el-steps class="stepss" :space='150' :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                 <el-step title="商品照片"></el-step>
                  <el-step title="商品内容"></el-step>
                   <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" 
            ref="addFormRef" label-width="100px" 
            :label-position="'top'"
            >
              <el-tabs :tab-position="'left'" 
              v-model="activeIndex" 
              :before-leave='beforeTabLeave'
              @tab-click="tabClick">
                <el-tab-pane label="基本信息" name='0'>
                     <el-form-item label="商品名称" prop="goods_name">
                     <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item> 
                    <el-form-item label="商品价格" prop="goods_price">
                     <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item> 
                    <el-form-item label="商品重量" prop="goods_weight">
                     <el-input v-model="addForm.goods_weight" type="number"></el-input>
                    </el-form-item> 
                    <el-form-item label="商品数量" prop="goods_number">
                     <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item> 
                    <el-cascader
                        v-model="addForm.goods_cat"
                        :options="cateList"
                        :props="cascaderProps"
                        @change="handleChange">
                    </el-cascader>
                </el-tab-pane>
                <el-tab-pane label="商品参数"  name='1'>
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                      <!-- 复选框组 -->
                      <el-checkbox-group  v-model="item.attr_vals">
                            <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                      </el-checkbox-group>

                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name='2'>
                    <el-form-item :label="ft.attr_name" v-for="ft in onlyTableData" :key="ft.attr_id">
                         <el-input v-model="ft.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品照片" name='3'>
                    <!-- action代表让图片上传的地址 on-preview是处理点击图片 
                     on-remove是处理移除图片的操作 file-list是指定的文件列表（暂时不需要）
                     list-type展现当前图片预览的效果 -->
                    <el-upload
                    class="upload-demo"
                    action="http://127.0.0.1:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers='headerObj'
                    :on-success="handelSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                </el-tab-pane>
              </el-tabs>
            </el-form>
            <!-- 展示图片的对话框 -->
            <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%">
            <img :src="previewPath" alt="" class="previewImg">
            
            </el-dialog>
            
  
        </el-card>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data(){
        return{
            //这是让tabs和step进行数据的联动
            activeIndex:'0',
            //表单数据，也就是后面要提交给服务器的数据
            addForm:{
                 goods_name:'',
                 goods_price:0,
                 goods_number:0,
                 goods_weight:0,
                 goods_cat:[],
                 pics:[],
                 attrs:[]

            },
            //表单的验证规则
            addFormRules:{
                goods_name:[
                      { required: true, 
                      message: '请输入商品名称',
                       trigger: 'blur' }
                ],
                goods_price:[
                      { required: true, 
                      message: '请输入商品价格',
                       trigger: 'blur' }
                ],
                goods_number:[
                      { required: true, 
                      message: '请输入商品数量',
                       trigger: 'blur' }
                ],
                goods_weight:[
                      { required: true, 
                      message: '请输入商品重量',
                       trigger: 'blur' }
                ],
               
            },
            //商品分类数据
            cateList:[],
            cascaderProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                expandTrigger:'hover'
                },
                //获取到的动态参数列表数据
            manyTableData:[],
            onlyTableData:[],
            //图片上传组件的headers请求头
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')


            },
            //存放将要展示图片的地址
            previewPath:'',
            //展示图片对话框的隐藏与显示
            previewVisible:false,
            goods_introduce:''
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const{data:res}=await this.$http.get('categories')
             if(res.meta.status!==200){
                 return this.$message.error("获取分类列表失败")
                 
             }
             this.cateList=res.data
             console.log(this.cateList)
        },
        //级联选择器数据发生改变的时候
        handleChange(){
          
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat=[]
            }
            console.log(this.addForm.goods_cat)
        },
        beforeTabLeave(activeName,oldactiveName){
            console.log(activeName)
            
            if(oldactiveName=='0'&&this.addForm.goods_cat.length!==3){
                this.$message.warning("请先选择商品分类")
                return false
            }else{
                return true
            }

        },
        async tabClick(){
            //点击tab标签页进行切换的时候，
            //所触发的事件
            // console.log(this.activeIndex)
            if(this.activeIndex==='1'){
                //代表你选中的动态参数，需要发起请求
                const{data:res}=await this.$http.get(`categories/${this.catId}/attributes`,{params:{
                    sel:'many'}
                })
                if(res.meta.status!==200){
                    return this.$message.error("获取动态参数失败")
                }
                
                //我们需要将res。data里面的数据进行处理，
                //这样才可以进行页面渲染
                res.data.forEach(item=>{
                    if(item.attr_vals.length===0){
                        return []
                    }else{
                        item.attr_vals=item.attr_vals.split(',')

                    }
                })
                console.log(res.data)
                //將獲取到的赋值给manyTab
                this.manyTableData=res.data    
            }else if(this.activeIndex==='2'){
                //代表访问的是静态属性
                const{data:res}=await this.$http.get(`categories/${this.catId}/attributes`,{
                    params:{sel:'only'}
                })
                if(res.meta.status!==200){
                    return this.$message.error("获取静态属性列表错误")

                }
                this.onlyTableData=res.data
                console.log(this.onlyTableData)

            }
            
        },
        //处理预览图片
        handlePreview(file){
            console.log(file)
            //先将图片地址存到data的previewPath
            this.previewPath=file.response.data.url
            //然后打开对话框
            this.previewVisible=true
        },
        //处理移除图片的操作
        handleRemove(file){
            console.log(file)
            //获取到要移除图片的临时路径
            const fpath=file.response.data.tmp_path
            //从pics数组中,找到这个图片的索引值
            //使用findIndex的方法(返回的是索引值)
            const i=this.addForm.pics.findIndex(x=>
            x===fpath)
            //然后使用splice方法进行移除
            this.addForm.pics.splice(i,1)
            //打印看下pics里面
            console.log(this.addForm.pics)
            
        },
        //处理文件上传成功的回调
        handelSuccess(res){
            //三个参数(response, file, fileList)
            console.log(res)
            //先拼接得到一个图片信息对象
            const picInfo={
                pic:res.data.tmp_path
            }
            //将拼接的信息对象，push到pics的数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm)

        },
        //最后添加商品
        add(){
            this.$refs.addFormRef.validate(async vaild=>{
                if(!vaild){
                    return this.$message.error("请填写必要的表单项！")

                }
                //服务器需要我们提交good_cat是一个字符串
            //因此我们需要去将数组转换成字符串(.join)，但是
            //级联选择器绑定了good_cat，想要一个数组，因此在这里
            //转换，是会冲突的，因此需要深拷贝一个数组，单独供我们使用
            //lodash   arr.cloneDeep()
            //但是我安装的时候发现自己已经有了  哈哈
            const form=_.cloneDeep(this.addForm)
            form.goods_cat= form.goods_cat.join(',')
            // console.log(form)
            //处理manyTableData 和onlyTableData(和api适配)
            this.manyTableData.forEach(item=>{
                const manyInfo={
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join(',')
                }
                this.addForm.attrs.push(manyInfo)
            })
            this.onlyTableData.forEach(item=>{
                const onlyInfo={
                     attr_id:item.attr_id,
                    attr_value:item.attr_vals

                }
                 this.addForm.attrs.push(onlyInfo)
            })
            form.attrs=this.addForm.attrs
            console.log(form)

             //发起请求
            const{data:res}=await this.$http.post('goods',form)
            if(res.meta.status!==201){
                return this.$message.error("添加失败！服务器错误")
            }
            this.$message.success("添加成功！")
            this.$router.push('/goods')
            })
            
           


        }


    },

    computed:{
        catId(){
            if(this.addForm.goods_cat.length===3){
                console.log(this.addForm.goods_cat[2])
                return this.addForm.goods_cat[2]
            }
            return null
            
        }
    }    
}
</script>
<style lang="less" scoped>
.el-checkbox{
    margin:0 5px 0 0!important

}
.previewImg{
    width:100%
}
.btnAdd{
    margin-top:15px
}
.stepss{
    margin:20px 0
}


    
</style>
