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
            <h4>{{ $dataBankApi.api_count }}</h4>
        </el-card>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="200px" @submit.native.prevent>
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
                    <el-form-item
                            v-for="(item, index) in category"
                            :label="'系列' + index"
                            :key="index"
                    >

                        <el-row :gutter="10">
                            <el-col :span="6">
                                <el-input v-model="item.key" placeholder="系列名称"></el-input>
                            </el-col>
                            <el-col :span="14">
                                <input-tag v-model="item.value" placeholder="SKUID 按,分割"></input-tag>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click.prevent="removeCategory(item)">删除</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="addCategory">新增系列</el-button>
                    </el-form-item>
                </el-form>
                <div v-if="processBar">
                    <h5>执行进度</h5>
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
    name: 'link-sales',
    data () {
      return {
        post_error: false,
        process_percent: 0,
        single_process_percent: 0,
        link_process_percent: 0,
        processBar: false,
        full_link_total: 0,
        form: {},
        singleShopItemCount: {},
        linkShopItemCount: {},
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        behavior_select_options: [],
        behavior_select: [],
        full_link_select_options: [],
        full_link_select: [],
        shop_select_options: [],
        shop_select: [],
        full_link_data: '',
        shop_behavior_data: '',
        full_link_data_options: {
          shortcuts: [{
            text: '近30天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近90天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近180天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        category: [{key: '系列0', value: []}],
      }
    },
    created () {
      let _this = this
      this.$http.get('https://databank.tmall.com/api/paasapi?path=/api/dimension/listChildDimension&type=STATUS&id=7').then((response) => {
        if (response.data.data) {
          response.data.data.map((value, index) => {
            _this.full_link_select_options.push({
              value: value.aid + '#|#' + value.extraProp.value,
              label: value.name
            })
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: response.data.msg
          })
        }
      }, (response) => {
        //响应错误回调
        this.$notify.error({
          title: '错误',
          message: '接口错误'
        })
      })
      this.$http.get('https://databank.tmall.com/api/paasapi?path=/api/dimension/listChildDimension&type=SHOP&id=63').then((response) => {
        response.data.data.map((value, index) => {
          _this.shop_select_options.push({
            value: value.aid + '#|#' + value.aid,
            label: value.name
          })
        })
      }, (response) => {
        //响应错误回调
        this.$notify.error({
          title: '错误',
          message: '接口错误'
        })
      })
      this.$http.get('https://databank.tmall.com/api/paasapi?path=/api/dimension/listChildDimension&type=BEHAVIOR&id=63').then((response) => {
        response.data.data.map((value, index) => {
          _this.behavior_select_options.push({
            value: value.aid + '#|#' + value.extraProp.value,
            label: value.name
          })
        })
      }, (response) => {
        //响应错误回调
        this.$notify.error({
          title: '错误',
          message: '接口错误'
        })
      })
    },
    methods: {
      clear () {
        this.processBar = false
        this.post_error = false
        this.process_percent = 0
        this.full_link_total = 0
        this.singleShopItemCount = {}
        this.linkShopItemCount = {}
      },
      getFullLinkModel () {
        return {
          'editUsefulData': {
            'aliId': ['1', '7'],
            'uniqueId': ['1', '7'],
            'conditionName': '全链路状态 > 全链路状态',
            'getDimensionId': '7'
          },
          'selectionLv1': ['FULL_LINK', 'FULL_LINK'],
          'selectionLv3': {
            'cate': 'ALL',
            'types': this.full_link_select,
            'dateType': 'ABSOLUTE_DATE_RANGE',
            'dateValue': {'from': this.full_link_data[0], 'to': this.full_link_data[1]}
          }
        }
      },
      getShopItemModel (shopItem) {
        return {
          'editUsefulData': {
            'aliId': ['3', '14'],
            'uniqueId': ['3', '14'],
            'conditionName': '以货圈人 > 店铺商品圈人',
            'getDimensionId': '14'
          },
          'selectionLv1': ['COMMODITY', 'ITEM'],
          'selectionLv3': {
            'shop': this.shop_select[0],
            'selectedGoodsType': '2', 'cate': 'ALL', 'item': shopItem,
            'bhv': this.behavior_select, 'dateType': 'ABSOLUTE_DATE_RANGE',
            'dateValue': {'from': this.shop_behavior_data[0], 'to': this.shop_behavior_data[1]}
          }, 'selectionLv2': ['63#|#4']
        }
      },
      Download () {
        // console.log(this)
        const Sheets = {}

        let sheet0 = []
        for (let i = 0; i < this.category.length; i++) {
          let name = this.category[i].key
          let ids = this.category[i].value.join(",")
          sheet0.push({'系列名称': name, 'id': ids})
        }
        Sheets['系列对应ID'] = sheet0

        let sheet1 = []
        for (let i = 0; i < this.category.length; i++) {
          let shop_id = this.category[i].key
          sheet1.push({'产品ID': shop_id, '数量': this.singleShopItemCount[shop_id]})
        }
        Sheets['系列数量'] = sheet1
        let sheet2 = []
        for (let i = 0; i < this.category.length; i++) {
          for (let j = 0; j < this.category.length; j++) {
            let first_id = this.category[i].key
            let second_id = this.category[j].key
            if (i == j) {
              continue
            }
            sheet2.push({
              '产品ID': first_id,
              '连带产品ID': second_id,
              '数量': this.linkShopItemCount[first_id + '_' + second_id]
            })
          }
        }
        Sheets['连带分析'] = sheet2

        let sheet3 = []
        let titles = [].concat(this.category)
        titles.unshift({key:'商品ID'})
        for (let i = 0; i < this.category.length; i++) {
          let item = {}
          for (let j = 0; j < titles.length; j++) {
            let title = titles[j].key
            let first_id = this.category[i].key
            if (title == '商品ID') {
              item[title] = this.category[i].key
            } else {
              item[title] = this.linkShopItemCount[first_id + '_' + title]
            }
          }
          sheet3.push(item)
        }
        Sheets['连带分析矩阵'] = sheet3
        this.$dataBankApi.saveExcelFromJson(Sheets, 'link_sales.xlsx')
      },
      removeCategory (item) {
        var index = this.category.indexOf(item)
        if (index !== -1) {
          this.category.splice(index, 1)
        }
      },
      addCategory () {
        this.category.push({
          value: [],
          key: '系列' + this.category.length
        })
      },
      updateProcessBar (atype) {
        if (atype == 'start') {
          this.process_percent = 10
        } else if (atype == 'singlemerchandise') {
          let total = this.category.length
          this.single_process_percent = 30 * Object.keys(this.singleShopItemCount).length / total
          this.process_percent = 10+this.link_process_percent + this.single_process_percent
        } else if (atype == 'linkmerchandise') {
          let dynamicTagsLength = this.category.length
          let total = dynamicTagsLength * dynamicTagsLength - dynamicTagsLength
          this.link_process_percent = 60 * Object.keys(this.linkShopItemCount).length / total
          this.process_percent = 10+this.link_process_percent + this.single_process_percent
        }
      },
      getSignleMerchandisCallback (category_index, data) {
        let _this = this
        const item = this.category[category_index]
        if (data.errCode == 477012012009) {
          // 数量不足 反向圈数
          let shop_model = this.getShopItemModel(item.value)
          let full_link_model = this.getFullLinkModel()
          shop_model['op'] = 'DIFF'
          let customModel = {
            'crowdName': '',
            'list': [full_link_model, shop_model]
          }
          // 477012012009
          this.$dataBankApi.passApiCount(customModel, item.key, (k, d) => {
            if (d.errCode == 0) {
              try {
                _this.singleShopItemCount[k] = _this.full_link_total - d.data
              } catch (err) {
                console.log(err, _this.full_link_total, d.data)
                _this.singleShopItemCount[k] = d.errMsg
              }
            } else {
              _this.singleShopItemCount[k] = d.errMsg
            }
            this.updateProcessBar('singlemerchandise')
          })
        } else if (data.errCode == 0) {
          this.singleShopItemCount[item.key] = data.data
        } else {
          this.singleShopItemCount[item.key] = data.errMsg
        }
        this.updateProcessBar('singlemerchandise')

      },
      getLinkMerchandisCallback (key, data) {
        let full_link_model = this.getFullLinkModel()
        const item1 = this.category[key[0]]
        const item2 = this.category[key[1]]
        if (data.errCode == 477012012009) {
          var shop_model = this.getShopItemModel(item1.value)
          var link_shop_model = this.getShopItemModel(item2.value)
          shop_model['op'] = 'INTERSECT'
          link_shop_model['op'] = 'DIFF'
          var customModel = {
            'crowdName': '',
            'list': [full_link_model, shop_model, link_shop_model]
          }
          // 477012012009
          this.$dataBankApi.passApiCount(customModel, key, this.getLinkMerchandisDIFFCallback)
        } else if (data.errCode == 0) {
          this.linkShopItemCount[item1.key + '_' + item2.key] = data.data
          this.linkShopItemCount[item2.key + '_' + item1.key] = data.data
        } else {
          this.linkShopItemCount[item1.key + '_' + item2.key] = data.errMsg
          this.linkShopItemCount[item2.key + '_' + item1.key] = data.errMsg
        }
        this.updateProcessBar('linkmerchandise')
      },

      getLinkMerchandisDIFFCallback(k,d){
        let _this = this
        let full_link_model = this.getFullLinkModel()
        const item1 = this.category[k[0]]
        const item2 = this.category[k[1]]
        if (d.errCode == 0) {
          try {
            this.linkShopItemCount[item1.key + '_' + item2.key] = this.singleShopItemCount[item1.key] - d.data
            this.linkShopItemCount[item2.key + '_' + item1.key] = this.singleShopItemCount[item1.key] - d.data
          } catch (err) {
            this.linkShopItemCount[item1.key + '_' + item2.key] = d.errMsg
            this.linkShopItemCount[item2.key + '_' + item1.key] = d.errMsg
          }
        } else {
          console.log('数量不足')
          // this.linkShopItemCount[item1.key + '_' + item2.key] = d.errMsg
          // this.linkShopItemCount[item2.key + '_' + item1.key] = d.errMsg
          // 交并差数有问题
          var shop_model = this.getShopItemModel(item1.value)
          var link_shop_model = this.getShopItemModel(item2.value)
          shop_model['op'] = 'UNION'
          link_shop_model['op']='DIFF'
          var customModel = {
            'crowdName': '',
            'list': [full_link_model,link_shop_model, shop_model]
          }
          this.$dataBankApi.passApiCount(customModel, k, (k2, d2) => {
            // console.log("数据不足 并 数据", k2,d2)
            if (d2.errCode == 0) {
              var shop_model1 = _this.getShopItemModel(_this.category[k2[0]].value)
              var link_shop_model1 = _this.getShopItemModel(_this.category[k2[1]].value)
              shop_model1['op'] = 'UNION'
              link_shop_model1['op'] = 'DIFF'
              let link_shop_model2=link_shop_model1
              let customModel1 = {
                'crowdName': '',
                'list': [full_link_model,link_shop_model2, shop_model1, link_shop_model1]
              }
              // console.log(k2, d2, customModel1)
              _this.$dataBankApi.passApiCount(customModel1, [k2, d2.data], (k3, d3) => {
                // console.log("数据不足 并 差", k3,d3)
                const item11 = _this.category[k3[0][0]]
                const item21 = _this.category[k3[0][1]]
                if (d3.errCode == 0) {
                  _this.linkShopItemCount[item11.key + '_' + item21.key] = k3[1] - d3.data
                  _this.linkShopItemCount[item21.key + '_' + item11.key] = k3[1] - d3.data
                } else {
                  _this.linkShopItemCount[item11.key + '_' + item21.key] = d3.errMsg
                  _this.linkShopItemCount[item21.key + '_' + item11.key] = d3.errMsg
                }
                this.updateProcessBar('linkmerchandise')
              })
            } else {
              _this.linkShopItemCount[item1.key + '_' + item2.key] = d2.errMsg
              _this.linkShopItemCount[item2.key + '_' + item1.key] = d2.errMsg
            }
            this.updateProcessBar('linkmerchandise')
          })
        }
        this.updateProcessBar('linkmerchandise')
      },
      Search () {
        let _this = this
        this.clear()
        this.processBar = true
        let full_link_model = this.getFullLinkModel()
        let customModel = {
          'crowdName': '',
          'list': [full_link_model]
        }
        this.$dataBankApi.passApiCount(customModel, 'full_link_total', (key, data) => {
          if (data.errCode === 0) {
            _this.full_link_total = data.data
          } else {
            _this.full_link_total = data.errMsg
          }
        })
        this.updateProcessBar('start')
        // 每个系列的数量
        for (let category_index = 0; category_index < this.category.length; category_index++) {
          const item = this.category[category_index]
          let shop_model = this.getShopItemModel(item.value)
          shop_model['op'] = 'INTERSECT'
          customModel = {
            'crowdName': '',
            'list': [full_link_model, shop_model]
          }
          this.$dataBankApi.passApiCount(customModel, category_index, this.getSignleMerchandisCallback)
        }
        // 系列连带分析
        for (let category_index2 = 0; category_index2 < this.category.length; category_index2++) {
          if (category_index2 == this.category.length - 1) {
            continue
          }
          for (let j = category_index2 + 1; j < this.category.length; j++) {
            const item1 = this.category[category_index2]
            const item2 = this.category[j]
            let shop_model = this.getShopItemModel(item1.value)
            let link_shop_model = this.getShopItemModel(item2.value)
            shop_model['op'] = 'INTERSECT'
            link_shop_model['op'] = 'INTERSECT'
            customModel = {
              'crowdName': '',
              'list': [full_link_model, shop_model, link_shop_model]
            }
            this.$dataBankApi.passApiCount(customModel, [category_index2, j], this.getLinkMerchandisCallback)
          }
        }
      },
    }
  }
</script>
<style scoped>
</style>
