<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> Home</el-breadcrumb-item>
                <el-breadcrumb-item>触点分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card shadow="hover" class="mgb20" style="height:150px;">
            <h2>查询次数 {{requestCount}} </h2>
            <h2>使用说明:</h2>
        </el-card>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="200px" @submit.native.prevent>
                    <el-form-item label="触点时间范围">
                        <div class="block">
                            <el-date-picker
                                    v-model="dateRange"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="dateRangeOptions"
                                    value-format="yyyyMMdd">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="触点">
                        <el-checkbox-group v-model="payAD">
                            <el-checkbox v-for="item in payADList" :label="item" :name="item.name" :key="item.name">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div v-if="processBar">
                    <h5>执行进度:        {{process_message}}</h5>
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="process_percent"></el-progress>
                </div>
                <el-button type="primary" @click="Search()">开始查询</el-button>
                <el-button type="primary" @click="Download()">下载</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'contact-analysis',
    data () {
      return {
        requestCount:this.$dataBankApi.api_count,
        processBar: true,
        process_percent: 0,
        process_message: '',
        form:{},
        dateRange: [],
        dateRangeOptions: {
          shortcuts: this.$dataBankApi.baseDataSelect
        },
        payAD:[],
        payADList:[
          {label:'付费广告 > Uni Desk',name:'uniDesk',value:10,model:this.getUniDeskModel},
          {label:'付费广告 > 优酷广告',name:'youKuAd',value:1, model:this.getYouKuAdModel},
          {label:'付费广告 > 一夜霸屏',name:'oneNight',value:2, model:this.getOneNightModel},
          {label:'付费广告 > 品牌雷达',name:'brandRadar',value:3,model:this.getBrandRadarModel},
          {label:'付费广告 > 品牌专区',name:'brandZone',value:4,model:this.getBrankZoneModel},
          {label:'付费广告 > 明星店铺',name:'starShop',value:5,model:this.getStarShopMpdel},
          {label:'付费广告 > 钻石展位',name:'diamondBooth',value:6, model:this.getDiamondBoothModel},
          {label:'付费广告 > 品牌特秀',name:'brandShow',value:7, model:this.getBrandShowModel},
          {label:'付费广告 > 摇一摇',name:'shake',value:8,model:this.getShakeModel},
          {label:'付费广告 > 事件营销',name:'eventMarketing',value:9,model:this.getEventMarketingModel},

          {label:'内容运营 > 品牌号',name:'pinPaiHao',value:10,model:this.getPinPaiHaoModel},
          {label:'内容运营 > 淘宝头条',name:'taoBaoTouTiao',value:10,model:this.getTaoBaoTouTiaoModel},
          {label:'内容运营 > 必买清单',name:'biMaiQinDan',value:10,model:this.getBiMaiQinDanModel},
          {label:'内容运营 > 猜你喜欢',name:'caiNiXiHuan',value:10,model:this.getCaiNiXiHuanModel},
          {label:'内容运营 > 生活研究所',name:'shenHuoYanJiuSuo',value:10,model:this.getShenHuoYanJiuSuoModel},
          {label:'内容运营 > 有好货',name:'youHaoHuo',value:10,model:this.getYouHaoHuoModel},
          {label:'内容运营 > 直播',name:'zhiBo',value:10,model:this.getZhiBoModel},
          {label:'内容运营 > 微淘',name:'weiTao',value:10,model:this.getWeiTaoModel},
          {label:'内容运营 > 淘宝短视频',name:'taoBaoDuanShiPin',value:10,model:this.getTaoBaoDuanShiPinModel},
          {label:'内容运营 > 每日好店',name:'meiRiHaoDian',value:10,model:this.getMeiRiHaoDianModel},
          {label:'内容运营 > 运动俱乐部',name:'yunDongJuLeBu',value:10,model:this.getYunDongJuLeBuModel},

          {label:'天猫营销平台 > 超级品牌日',name:'chaoJiPinPaiRi',value:10,model:this.getchaoJiPinPaiRiModel},
          {label:'天猫营销平台 > 互动吧',name:'HuDongBa',value:10,model:this},
          {label:'天猫营销平台 > 天合&流量宝',name:'TianHe',value:10,model:this},
          {label:'天猫营销平台 > 聚划算',name:'JuHuaSuan',value:10,model:this},
          {label:'天猫营销平台 > 试用中心',name:'ShiYongZhongXin',value:10,model:this},
          {label:'天猫营销平台 > 天猫U先',name:'TmallUXian',value:10,model:this},
          {label:'天猫营销平台 > 淘抢购',name:'TaoQiangGou',value:10,model:this},
          {label:'天猫营销平台 > 欢聚日',name:'HuanJuRi',value:10,model:this},
          {label:'天猫营销平台 > 全明星计划',name:'QuanMingXin',value:10,model:this},
          {label:'天猫营销平台 > 天猫新人礼',name:'TMallXinRenLi',value:10,model:this},

        ],
        result:{},
      }
    },
    created () {
      this.$dataBankApi.getCookies()
    },
    methods: {
      clear(){
        this.processBar = true
        this.process_percent = 0
        this.result = {}
      },
      getFUllLinkModel(op,types) {
        return {
          "op": op,
          "editUsefulData": {
            "aliId": ["1", "7"],
            "uniqueId": ["1", "7"],
            "conditionName": "全链路状态 > 全链路状态",
            "getDimensionId": "7"
          },
          "selectionLv1": ["FULL_LINK", "FULL_LINK"],
          "selectionLv3": {
            "cate": "ALL",
            "types": types,
            "dateType": "ABSOLUTE_DATE_RANGE",
            "dateValue": {"from":this.dateRange[0],"to":this.dateRange[1]}
          }
        }
      },
      getBHVModel(op,bhv){
        // 232#|#VIEW_ITEM
        // 233#|#COLLECT_ITEM
        // 234#|#CART
        // 236#|#PAY
        return {"op": op,
          "editUsefulData": {
            "aliId": ["3", "14"],
            "uniqueId": ["3", "14"],
            "conditionName": "以货圈人 > 店铺商品圈人",
            "getDimensionId": "14"},
          "selectionLv1": ["COMMODITY", "ITEM"],
          "selectionLv3": {
            "selectedGoodsType": "1",
            "cate": "ALL",
            "bhv": bhv,
            "dateType": "ABSOLUTE_DATE_RANGE",
            "dateValue": {"from":this.dateRange[0],"to":this.dateRange[1]}
          },
          "selectionLv2": ["231#|#ALL"]}
      },
      getUniDeskModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"72#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["22#|#UD"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"73#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["22#|#UD"]}]
      },
      getYouKuAdModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"74#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["23#|#YK"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]},"bhv":"75#|#CLICK_AD"},"selectionLv2":["23#|#YK"]}]
      },
      getOneNightModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"76#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["24#|#UB"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"77#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["24#|#UB"]}]
      },
      getBrandRadarModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"78#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["25#|#RD"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"79#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["25#|#RD"]}]
      },
      getBrankZoneModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"78#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["25#|#RD"]},{"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"80#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":"20190401","to":"20190423"}},"selectionLv2":["26#|#EB"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"81#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["26#|#EB"]}]
      },
      getStarShopMpdel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"82#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["27#|#SS"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"83#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["27#|#SS"]}]
      },
      getDiamondBoothModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"84#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["28#|#NZ"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","account":"ALL","bhv":"85#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["28#|#NZ"]}]

      },
      getBrandShowModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"86#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["29#|#BHD"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"87#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["29#|#BHD"]}]

      },
      getShakeModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"783#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["782#|#YY"]}]
      },
      getEventMarketingModel(){
        return [{"editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"88#|#EXPOSE_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["30#|#EV"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","9"],"uniqueId":["2","9"],"conditionName":"以场圈人 > 付费广告","getDimensionId":"9"},"selectionLv1":["FIELD","AD"],"selectionLv3":{"dayFrequency":{"op":"OPEN_OPEN"},"contType":"bhv","bhv":"89#|#CLICK_AD","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["30#|#EV"]}]
      },
      getPinPaiHaoModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"status","bhv":"92#|#NEW","subBhv":"247#|#ALL","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]},"dateType":"ABSOLUTE_DATE_RANGE"},"selectionLv2":["31#|#BH"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"STATUS_FANS","bhv":"403#|#NEW","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]},"dateType":"ABSOLUTE_DATE_RANGE"},"selectionLv2":["31#|#BH"]}]
      },
      getTaoBaoTouTiaoModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"contentType":"1","contentFilter":"1","bhv":"101#|#READ_CONTENT","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["32#|#TBHL"]}]
      },
      getBiMaiQinDanModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"cate":"ALL","bhv":"112#|#CLICK_ITEM","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["34#|#TBG_BMQD"]}]
      },
      getCaiNiXiHuanModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"cate":"ALL","bhv":"113#|#CLICK_ITEM","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["35#|#TBG_CNXH"]}]
      },
      getShenHuoYanJiuSuoModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"cate":"ALL","bhv":"114#|#EXPOSE","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["36#|#TBG_SHYJS"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"cate":"ALL","bhv":"115#|#CLICK_ITEM","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["36#|#TBG_SHYJS"]}]
      },
      getYouHaoHuoModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"cate":"ALL","bhv":"108#|#EXPOSE","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["33#|#TBG_YHH"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"cate":"ALL","bhv":"109#|#CLICK_ITEM","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["33#|#TBG_YHH"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"cate":"ALL","bhv":"110#|#CLICK_GOBUY","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["33#|#TBG_YHH"]}]
      },
      getZhiBoModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"liveType":"1","contentFilter":"1","bhv":"116#|#VIEW","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["37#|#LIVE"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"liveType":"2","contentFilter":"1","bhv":"116#|#VIEW","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["37#|#LIVE"]}]
      },
      getWeiTaoModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"bhv","bhv":"121#|#EXPOSE_CONTENT","contentFilter":"1","contentType":"1","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]},"dateType":"ABSOLUTE_DATE_RANGE"},"selectionLv2":["38#|#WT"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"STATUS_WEITAO_FAN","bhv":"1956#|#NEW","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]},"dateType":"ABSOLUTE_DATE_RANGE"},"selectionLv2":["38#|#WT"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"bhv","bhv":"121#|#EXPOSE_CONTENT","contentFilter":"1","contentType":"2","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]},"dateType":"ABSOLUTE_DATE_RANGE"},"selectionLv2":["38#|#WT"]}]
      },
      getTaoBaoDuanShiPinModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"feed":["ALL"],"channel":"2830#|#ALL","bhv":"2831#|#WATCH","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["2632#|#MICROVIDEO"]}]
      },
      getMeiRiHaoDianModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"bhv","bhv":"2061#|#EXPOSE","shop":"ALL","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["2060#|#MRHD"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"bhv","bhv":"2062#|#ENTER_SHOP","shop":"ALL","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["2060#|#MRHD"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"condType":"bhv","bhv":"2063#|#VIEW_ITEM","cate":"ALL","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["2060#|#MRHD"]}]
      },
      getYunDongJuLeBuModel(){
        return [{"editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"region":"2701#|#1","bhv":"2848#|#VIEW_REGION","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["2695#|#SPORTSCLUB"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"region":"2701#|#1","bhv":"2824#|#VIEW_VIDEO","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["2695#|#SPORTSCLUB"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","10"],"uniqueId":["2","10"],"conditionName":"以场圈人 > 内容运营","getDimensionId":"10"},"selectionLv1":["FIELD","CONTENT"],"selectionLv3":{"region":"2701#|#1","bhv":"2825#|#VIEW_IMGTXT","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["2695#|#SPORTSCLUB"]}]
      },
      getchaoJiPinPaiRiModel(){
        return [{"editUsefulData":{"aliId":["2","11"],"uniqueId":["2","11"],"conditionName":"以场圈人 > 天猫营销平台","getDimensionId":"11"},"selectionLv1":["FIELD","TMALL_MARKETING"],"selectionLv3":{"condType":"bhv","bhv":"131#|#EXPOSE_BANNER","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["40#|#MP_CP"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","11"],"uniqueId":["2","11"],"conditionName":"以场圈人 > 天猫营销平台","getDimensionId":"11"},"selectionLv1":["FIELD","TMALL_MARKETING"],"selectionLv3":{"condType":"bhv","bhv":"132#|#CLICK_BANNER","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["40#|#MP_CP"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","11"],"uniqueId":["2","11"],"conditionName":"以场圈人 > 天猫营销平台","getDimensionId":"11"},"selectionLv1":["FIELD","TMALL_MARKETING"],"selectionLv3":{"condType":"bhv","bhv":"133#|#VIEW_CAMP","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["40#|#MP_CP"]},
          {"op":"UNION","editUsefulData":{"aliId":["2","11"],"uniqueId":["2","11"],"conditionName":"以场圈人 > 天猫营销平台","getDimensionId":"11"},"selectionLv1":["FIELD","TMALL_MARKETING"],"selectionLv3":{"condType":"bhv","bhv":"134#|#CLICK_CAMP","dateType":"ABSOLUTE_DATE_RANGE","dateValue":{"from":this.dateRange[0],"to":this.dateRange[1]}},"selectionLv2":["40#|#MP_CP"]}]

      },
      getHuDongBaModel(){

      },
      calculatedModel(key, model){
        let tmpModel=[]
        console.log(model)
        let that=this;
        that.result[key]={}
        let fullLinkModelA =that.getFUllLinkModel('INTERSECT', ["18#|#D_AWARENESS"])
        let fullLinkModelI=that.getFUllLinkModel('INTERSECT', ["19#|#D_INTEREST"])
        let fullLinkModelPL=that.getFUllLinkModel('INTERSECT', ["20#|#D_BUY", "21#|#D_ROYALTY"])
        let bhvModelView=that.getBHVModel('INTERSECT', ["232#|#VIEW_ITEM"])
        let bhvModelCollect=that.getBHVModel('INTERSECT', ["233#|#COLLECT_ITEM"])
        let bhvModelCart=that.getBHVModel('INTERSECT', ["234#|#CART"])
        let bhvModelPay=that.getBHVModel('INTERSECT', ["236#|#PAY"])

        let diffFullLinkModelA =that.getFUllLinkModel('DIFF', ["18#|#D_AWARENESS"])
        let diffFullLinkModelI=that.getFUllLinkModel('DIFF', ["19#|#D_INTEREST"])
        let diffFullLinkModelPL=that.getFUllLinkModel('DIFF', ["20#|#D_BUY", "21#|#D_ROYALTY"])
        let diffBhvModelView=that.getBHVModel('DIFF', ["232#|#VIEW_ITEM"])
        let diffBhvModelCollect=that.getBHVModel('DIFF', ["233#|#COLLECT_ITEM"])
        let diffBhvModelCart=that.getBHVModel('DIFF', ["234#|#CART"])
        let diffBhvModelPay=that.getBHVModel('DIFF', ["236#|#PAY"])

        // 触达人数
        this.$dataBankApi.passApiCountByJquery({
          'crowdName': '',
          'list': model
          },'触达人群',(name,data)=>{
            if (data.errCode==477012012009){
              that.result[key][name]=data.errMsg
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        this.Process("触达人群")
        if( that.result[key]['触达人群'] =="人数不足2000" ){
          that.result[key]["Status"]="查询完成"
          return
        }
        // A
        tmpModel = model.concat(fullLinkModelA)
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'触达且A',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat(diffFullLinkModelA)
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'触达且非A',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达人群']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        this.Process("触达且A人群统计")
        // I
        tmpModel=model.concat(fullLinkModelI)
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'触达且I',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat(diffFullLinkModelI)
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'触达且非I',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达人群']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // A-I
        tmpModel=model.concat([fullLinkModelA,fullLinkModelI])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'A-I',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelA,diffFullLinkModelI])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'A非I',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且A']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // A-PL
        tmpModel=model.concat([fullLinkModelA,fullLinkModelPL])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'A-PL',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelA,diffFullLinkModelPL])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'A非PL',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且A']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // I-PL
        tmpModel=model.concat([fullLinkModelI,fullLinkModelPL])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'I-PL',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelI,diffFullLinkModelPL])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'A非I',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且I']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // A-浏览
        tmpModel=model.concat([fullLinkModelA,bhvModelView])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'A-浏览',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelA,diffBhvModelView])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'A非浏览',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且A']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // A-收藏
        tmpModel=model.concat([fullLinkModelA,bhvModelCollect])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'A-收藏',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelA,diffBhvModelCollect])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'A非收藏',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且A']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // A-加购
        tmpModel=model.concat([fullLinkModelA,bhvModelCart])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'A-加购',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelA,diffBhvModelCart])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'A非加购',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且A']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // A-购买
        tmpModel=model.concat([fullLinkModelA,bhvModelPay])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'A-购买',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelA,diffBhvModelPay])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'A非购买',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且A']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // I-浏览
        tmpModel=model.concat([fullLinkModelI,bhvModelView])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'I-浏览',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelI,diffBhvModelView])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'I非浏览',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且I']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // I-收藏
        tmpModel=model.concat([fullLinkModelI,bhvModelCollect])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'I-收藏',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelI,diffBhvModelCollect])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'I非收藏',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且I']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // I-加购
        tmpModel=model.concat([fullLinkModelI,bhvModelCart])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'I-加购',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelI,diffBhvModelCart])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'I非加购',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且I']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        // I-购买
        tmpModel=model.concat([fullLinkModelI,bhvModelPay])
        this.$dataBankApi.passApiCountByJquery({
            'crowdName': '',
            'list': tmpModel
          },'I-购买',(name,data)=>{
            if (data.errCode==477012012009){
              tmpModel = model.concat([fullLinkModelI,diffBhvModelPay])
              this.$dataBankApi.passApiCountByJquery({
                'crowdName': '',
                'list': tmpModel
              },'I非购买',(name1,data1)=> {
                if (data1.errCode==0) {
                  that.result[key][name] = that.result[key]['触达且I']-data1.data
                }else{
                  that.result[key][name]=data.errMsg
                }
              })
            }else if(data.errCode==0){
              that.result[key][name]=data.data
            }else{
              that.result[key][name]=data.errMsg
            }
          }
        )
        that.result[key]["Status"]="查询完成"
        this.Process(key +"统计完成")
      },
      Search(){
        this.clear()
        let that=this;
        for(let i=0;i<this.payAD.length; i++){
          let item=this.payAD[i]
          console.log(item,item.model)
          const model=item.model()
          console.log(model)
          this.calculatedModel(item.name,model)
          console.log(this.$dataBankApi.api_count)
          this.requestCount=this.$dataBankApi.api_count
        }
        this.Process()
        setTimeout(function () {
          that.Download()
        }, 5000)
      },
      Download(){
        const Sheets = {}
        let sheet0 = []
        for(let i=0;i<this.payAD.length; i++){
          let item=this.payAD[i]
          let col={...{'触点名称':item.label},...this.result[item.name]}
          sheet0.push(col)
        }
        Sheets['触点数据'] = sheet0
        this.$dataBankApi.saveExcelFromJson(Sheets, '触点分析.xlsx')
      },
      Process(message){
        let count=0;
        for(let key in this.result){
          if (this.result[key].Status=="查询完成"){count++}
        }
        this.process_percent=count/this.payAD.length*100;
        if (this.process_percent==100){
          this.process_message="查询完成";
        }else{
          this.process_message=message;
        }
      }
    }
  }
</script>
<style scoped>
</style>
