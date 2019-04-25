<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> Home</el-breadcrumb-item>
                <el-breadcrumb-item>Link Sales</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card shadow="hover" class="mgb20" style="height:150px;">
            <h2>使用说明:</h2>
            <h4>1. 选择基本人群 全链路人群的状态以及时间范围</h4>
            <h4>2. 选择店铺 以及需要看的link sales行为以及时间</h4>
            <h4>3. 填写商品ID</h4>
            <h4>4. 开始查询</h4>
            <h4>5. 进度100% 后点击下载.</h4>
        </el-card>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="200px" @submit.native.prevent>
                    <el-form-item label="AIPL时间">
                        <div class="block">
                            <el-date-picker
                                    v-model="fullLinkDistribution"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="fullLinkDistributionOptions">
                            </el-date-picker>
                        </div>
                    </el-form-item>

                </el-form>
                <div>
                    <h5>执行进度</h5>
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="process_percent"></el-progress>
                </div>
                <el-button type="primary" @click="getFullLinkDistribution()" >AIPL趋势开始查询</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'link-sales',
    data () {
      return {
        form:{},
        process_percent:0,
        fullLinkDistribution: '',
        fullLinkDistributionOptions: {
          shortcuts: this.$dataBankApi.baseDataSelect
        },
        fullLInkDistributionResult:[],
      }
    },
    created () {
    },
    methods: {
      clean(){
        this.process_percent=0;
      },
      getFullLinkDistribution () {
        let _this=this;
        this.clean()
        let startTime = this.fullLinkDistribution[0];
        let endTime  = this.fullLinkDistribution[1];
        let days=(endTime.getTime()-startTime.getTime())/(3600 * 1000 * 24)+1;
        let now= new Date();
        for (let i=0;i<days;i++){
          now.setTime(startTime.getTime()+i*3600 * 1000 * 24);
          console.log(now.format('yyyyMMdd'))
          this.$dataBankApi.dataBankAsyncGet('https://databank.tmall.com/api/ecapi', { thedate:now.format('yyyyMMdd'),path:'/datatable/fulllink/'}).then((response) => {
            _this.fullLInkDistributionResult.push(response);
            _this.fullLInDistributionProcess();
          }, (response) => {
            //响应错误回调
            this.$notify.error({
              title: '错误',
              message: '接口错误'
            })
          })
        }
      },
      fullLInDistributionProcess(){
        let startTime = this.fullLinkDistribution[0];
        let endTime  = this.fullLinkDistribution[1];
        let days=(endTime.getTime()-startTime.getTime())/(3600 * 1000 * 24)+1;
        this.process_percent=this.fullLInkDistributionResult.length/days*100;
        if (this.process_percent==100){
          this.getFullLinkDistributionDownload()
        }
      },
      getFullLinkDistributionDownload(){
        let result={'A':[],'I':[],'P':[],'L':[]}
        console.log(this.fullLInkDistributionResult)
        for(let i=0;i<this.fullLInkDistributionResult.length;i++) {
          let response=this.fullLInkDistributionResult[i];
          console.log(response)
          let nowTime = response.config.params.thedate;
          let data = response.data.data;
          let status = {
            1010: 'A',
            1020: 'I',
            1030: 'P',
            1040: 'L',
          }
          for (let j=0;j<data.length;j++) {
            let item=data[j];
            result[status[item.statusId]].push({
              '日期': nowTime,
              '当天人数': item.uv,
              '新增': item.addUv,
              '减少': item.subUv
            })
          }
        }
        this.$dataBankApi.saveExcelFromJson(result, 'AIPL情况.xlsx')
      }
    }
  }
</script>
<style scoped>
</style>
