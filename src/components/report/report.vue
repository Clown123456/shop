<template>
    <div>
          <!--1 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 750px;height:400px;"></div>
        
    </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
 

export default {
    data(){
        return{
            //option是需要合并的数据
            options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
            
            }
        },
        created(){
            
            
        },
        methods:{
           
        },
        async mounted(){
            //此时变量上的元素已经渲染完毕
              // 3基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));
                 const{data:res}=await this.$http.get('reports/type/1')
                 if(res.meta.status!==200){
                     return this.$message.error("获取数据失败")
                 }
                 
                //4准备数据和配置项
                 const result=_.merge(res.data,this.options)
               
                
              
        
        // 5使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);

        }
    }
    

</script>
<style lang="less" scoped>
    
</style>