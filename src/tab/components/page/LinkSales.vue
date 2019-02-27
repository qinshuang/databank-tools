<template>
    <div class="table">

        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
                <el-form-item label="全链路状态">
                   <el-select v-model="full_link_select" multiple placeholder="请选择">
                    <el-option
                      v-for="item in full_link_select_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="全链路状态时间">
                  <div class="block">
                      <el-date-picker
                        v-model="full_link_data"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="full_link_data_options"
                        value-format="yyyyMMdd">
                      </el-date-picker>
                    </div>
                   </el-form-item>
                   <el-form-item label="店铺">
                     <el-select v-model="shop_select" multiple placeholder="请选择">
                      <el-option
                        v-for="item in shop_select_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="行为">
                     <el-select v-model="behavior_select" multiple placeholder="请选择">
                      <el-option
                        v-for="item in behavior_select_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="店铺行为时间">
                  <div class="block">
                      <el-date-picker
                        v-model="shop_behavior_data"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="full_link_data_options"
                        value-format="yyyyMMdd">
                      </el-date-picker>
                    </div>
                   </el-form-item>
                  <el-form-item label="商品ID">
                   <el-tag 
                    :key="tag"
                    v-for="tag in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" @click="showInput"> +</el-button>
                  </el-form-item>
                </el-form>
                
                <el-button type="primary" @click="Search()">开始查询</el-button>
                <el-button type="primary" @click="Download()">下载</el-button>
                <el-button type="primary" @click="getData()">下载</el-button>
              </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
var FileSaver = require('file-saver')
    export default {
        name: 'link-sales',
        data() {
            return {
              csrf_token:'',
              form:{},
              singleShopItemCount:{},
              linkShopItemCount:{},
              dynamicTags: [],
              inputVisible: false,
              inputValue: '',
              behavior_select_options:[],
              behavior_select:[],
              full_link_select_options:[],
              full_link_select: [],
              shop_select_options:[],
              shop_select: [],
              full_link_data:'',
              shop_behavior_data:'',
              full_link_data_options: {
                shortcuts: [{
                  text: '近30天',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '近90天',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '近180天',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                    picker.$emit('pick', [start, end]);
                  }
                }]
              },
            }
        },
        created() {
          getCookies("https://databank.yushanfang.com","_tb_token_",(token)=>{
            this.csrf_token=token
          })
                  this.$http.get("https://databank.yushanfang.com/api/paasapi?path=/api/dimension/listChildDimension&type=STATUS&id=7").then((response)=>{
                    var that=this;
                    if (response.data.data){
                      response.data.data.map((value, index)=> {
                       that.full_link_select_options.push({
                        value:value.aid+'#|#'+value.extraProp.value,
                        label:value.name
                       })
                     });
                    }else{
                      this.$notify.error({
                        title: '错误',
                        message: response.data.msg
                      });
                    }
                  },(response)=>{
                    //响应错误回调
                    this.$notify.error({
                        title: '错误',
                        message: '接口错误'
                      });
                  });
                  this.$http.get("https://databank.yushanfang.com/api/paasapi?path=/api/dimension/listChildDimension&type=SHOP&id=63").then((response)=>{
                    var that=this;
                    response.data.data.map((value, index)=> {
                     that.shop_select_options.push({
                      value:value.aid+'#|#'+value.aid,
                      label:value.name
                     })
                   });
                  },(response)=>{
                    //响应错误回调
                    this.$notify.error({
                        title: '错误',
                        message: '接口错误'
                      });
                  });
                  this.$http.get("https://databank.yushanfang.com/api/paasapi?path=/api/dimension/listChildDimension&type=BEHAVIOR&id=63").then((response)=>{
                    var that=this;
                    response.data.data.map((value, index)=> {
                     that.behavior_select_options.push({
                      value:value.aid+'#|#'+value.extraProp.value,
                      label:value.name
                     })
                   });
                  },(response)=>{
                    //响应错误回调
                    this.$notify.error({
                        title: '错误',
                        message: '接口错误'
                      });
                  })
        },
        methods: {
          handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
          },

          showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
            });
          },

          handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
              this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
          },
          getFullLinkModel(){
            return {"editUsefulData":{"aliId":["1","7"],
                            "uniqueId":["1","7"],
                          "conditionName":"全链路状态 > 全链路状态",
                        "getDimensionId":"7"},
                        "selectionLv1":["FULL_LINK","FULL_LINK"],
                        "selectionLv3":{"cate":"ALL",
                        "types":this.full_link_select,
                        "dateType":"ABSOLUTE_DATE_RANGE",
                        "dateValue":{"from":this.full_link_data[0],"to":this.full_link_data[1]}}}
          },
          getShopItemModel(shopItem){
              return {"editUsefulData":{
                    "aliId":["3","14"],
                  "uniqueId":["3","14"],
                  "conditionName":"以货圈人 > 店铺商品圈人",
                  "getDimensionId":"14"},
                  "selectionLv1":["COMMODITY","ITEM"],
                  "selectionLv3":{"shop":this.shop_select[0],
                    "selectedGoodsType":"2","cate":"ALL","item":shopItem,
                    "bhv":this.behavior_select,"dateType":"ABSOLUTE_DATE_RANGE",
                        "dateValue":{"from":this.shop_behavior_data[0],"to":this.shop_behavior_data[1]}},"selectionLv2":["63#|#4"]}
          },
          async postDataBank(customModel,key,callback){
            const that=this;
              let response = await this.$http.post("https://databank.yushanfang.com/api/paasapi",{
                "path": "/api/v1/custom/realtime/count",
                "contentType": "application/json",
                "customModelStr": JSON.stringify(customModel)
              },{headers:{
                "content-type":"application/json",
                "x-csrf-token": this.csrf_token
              }})
              // .then((response)=>{
                var res_data=response.data;
                console.log(res_data)
                if(res_data.errCode!=0 & res_data.errCode!=477012012009){
                  if (res_data.errCode==477012002005){
                    setTimeout(function () {
                      console.log(that);
                      that.postDataBank(customModel,key,callback)
                    }, 2000);
                    
                  }else{
                    console.log(res_data)
                    this.$notify.error({
                          title: '错误',
                          message: res_data.errMsg,
                        });
                  }
                }else{
                  callback(key,res_data)
                }
              // },(response)=>{
              //   //响应错误回调
              //   console.log(response)
              // })
          },
          Search(){
            
            for(var i=0;i<this.dynamicTags.length;i++){
              var full_link_model=this.getFullLinkModel()
              var shop_id=this.dynamicTags[i];
              var that=this;
              var shop_model=this.getShopItemModel([shop_id])
               shop_model['op']='INTERSECT'
               var customModel={"crowdName":"",
                 "list":[full_link_model,shop_model]
               }
              this.postDataBank(customModel,shop_id,(key,data)=>{
                if(data.errCode==0){
                  that.singleShopItemCount[key]=data.data
                }else{
                  that.singleShopItemCount[key]=data.errMsg
                }
              })
            }
            console.log(this.dynamicTags)
            for(var i=0;i<this.dynamicTags.length;i++){
              if(i==this.dynamicTags.length-1){continue}
              var full_link_model=this.getFullLinkModel()
              var shop_id=this.dynamicTags[i];
              var link_id=this.dynamicTags[i+1];
              var that=this;
              var shop_model=this.getShopItemModel([shop_id,link_id])
               shop_model['op']='INTERSECT'
               var customModel={"crowdName":"",
                 "list":[full_link_model,shop_model]
               }
              this.postDataBank(customModel,[shop_id,link_id],(key,data)=>{
                if(data.errCode==0){
                  that.linkShopItemCount[key[0]+'_'+key[1]]=data.data
                  that.linkShopItemCount[key[1]+'_'+key[0]]=data.data
                }else{
                  that.linkShopItemCount[key[0]+'_'+key[1]]=data.errMsg
                  that.linkShopItemCount[key[1]+'_'+key[0]]=data.errMsg
                }
              })
            }
          },
          getData(){
            console.log(this.singleShopItemCount,this.linkShopItemCount);
            console.log(this);
          },
          Download(){
            console.log(this.singleShopItemCount,this.linkShopItemCount);
            console.log(this);
            console.log(this.dynamicTags)
             const defaultCellStyle =  { font: { name: "Verdana", sz: 11, color: "FF00FF88"}, fill: {fgColor: {rgb: "FFFFAA00"}}};
             const wopts = { bookType:'xlsx', bookSST:false, type:'binary', defaultCellStyle: defaultCellStyle, showGridLines: false};
             const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }; 
             var sheet1=[{"test":"a","test1":"b"},{"test":"c","test1":"d"}]
             // for(var i;i<this.dynamicTags.length;i++){
             //  let shop_id=this.dynamicTags[i]
             //  console.log(shop_id)
             //    sheet1.push({"产品ID":shop_id,"数量":this.singleShopItemCount[shop_id]})
             // }
             console.log(sheet1)
            wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(sheet1)
            // let sheet2=[]
            //  for(var i;i<this.dynamicTags.length;i++){
            //    for(var j;j<this.dynamicTags.length;i++){
            //     let first_id=this.dynamicTags[i]
            //     let second_id=this.dynamicTags[j]
            //     sheet2.push({"产品ID":first_id,"产品ID":second_id,"数量":this.linkShopItemCount[first_id+"_"+second_id]})
            //    }
            //  }
            // wb.Sheets['连带分析'] = XLSX.utils.json_to_sheet(sheet2)

            // let sheet3=[]
            //  for(var i;i<this.dynamicTags.length;i++){
            //   var titles=this.dynamicTags
            //   var item={};
            //   titles.unshift('商品ID')
            //    for(let title in titles){
            //     let first_id=this.dynamicTags[i]
            //     if(title=="商品ID"){item[title]=this.dynamicTags[i]
            //     }else{
            //       item[title]=this.linkShopItemCount[this.dynamicTags[i]+"_"+title]
            //       }
            //    }
            //    sheet3.push(item);
            //  }
            // wb.Sheets['连带分析矩阵'] = XLSX.utils.json_to_sheet(sheet3)
            //创建二进制对象写入转换好的字节流
           let tmpDown =  new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" })
           FileSaver.saveAs(tmpDown, "连带分析.xls");
         },
         //字符串转字符流
         s2ab (s) {
            if (typeof ArrayBuffer !== 'undefined') {  
                var buf = new ArrayBuffer(s.length);  
                var view = new Uint8Array(buf);  
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;  
                return buf;  
            } else {  
                var buf = new Array(s.length);  
                for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;  
                return buf;  
            }
         }

        }
    }

function getCookies(domain, name, callback) {
  chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
      if(callback) {
          callback(cookie.value);
      }
  });
}
</script>

<style scoped>
</style>
