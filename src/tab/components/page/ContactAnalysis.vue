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
                    <el-card shadow="never">

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
                    </el-card>
                    <el-card shadow="never">
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
                            <el-button v-else class="button-new-tag" @click="showInput" > +</el-button>
                        </el-form-item>
                    </el-card>
                </el-form>
                <div v-if="processBar">
                    <h5>执行进度</h5>
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="process_percent"></el-progress>
                </div>
                <el-button type="primary" @click="Search()" disabled>开始查询</el-button>
                <el-button type="primary" @click="Download()" disabled>下载</el-button>
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
      handleClose (tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
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
      singleItemCallback (key, data) {
        const _this = this
        if (data.errCode == 477012012009) {
          const full_link_model = this.getFullLinkModel()
          let shop_model = this.getShopItemModel(key)
          shop_model['op'] = 'DIFF'
          let customModel = {
            'crowdName': '',
            'list': [full_link_model, shop_model]
          }
          // 477012012009
          this.$dataBankApi.passApiCount(customModel, key, (k, d) => {
            if (d.errCode == 0) {
              try {
                _this.singleShopItemCount[k[0]] = _this.full_link_total - d.data
              } catch (err) {
                console.log(err, _this.full_link_total, d.data)
                _this.singleShopItemCount[k[0]] = d.errMsg
              }
            } else {
              _this.singleShopItemCount[k[0]] = d.errMsg
            }
          })
        } else if (data.errCode == 0) {
          this.singleShopItemCount[key[0]] = data.data
        } else {
          this.singleShopItemCount[key[0]] = data.errMsg
        }
        this.process_percent = 40
      },
      linkItemCallback (key, data) {
        var _this = this
        if (data.errCode == 477012012009) {
          var full_link_model = this.getFullLinkModel()
          var shop_model = this.getShopItemModel(key[0])
          var link_shop_model = this.getShopItemModel(key[1])
          shop_model['op'] = 'INTERSECT'
          link_shop_model['op'] = 'DIFF'
          var customModel = {
            'crowdName': '',
            'list': [full_link_model, shop_model, link_shop_model]
          }
          // 477012012009
          this.$dataBankApi.passApiCount(customModel, key, (k, d) => {
            if (d.errCode == 0) {
              try {
                _this.linkShopItemCount[k[0] + '_' + k[1]] = _this.singleShopItemCount[k[0]] - d.data
                _this.linkShopItemCount[k[1] + '_' + k[0]] = _this.singleShopItemCount[k[0]] - d.data
              } catch (err) {
                _this.linkShopItemCount[k[0] + '_' + k[1]] = d.errMsg
                _this.linkShopItemCount[k[1] + '_' + k[0]] = d.errMsg
              }
            } else {
              _this.linkShopItemCount[k[0] + '_' + k[1]] = d.errMsg
              _this.linkShopItemCount[k[1] + '_' + k[0]] = d.errMsg
            }
            let dynamicTagsLength = _this.dynamicTags.length
            let total = dynamicTagsLength * dynamicTagsLength - dynamicTagsLength
            _this.process_percent = 40 + 60 * Object.keys(_this.linkShopItemCount).length / total
          })
        } else if (data.errCode == 0) {
          this.linkShopItemCount[key[0] + '_' + key[1]] = data.data
          this.linkShopItemCount[key[1] + '_' + key[0]] = data.data
        } else {
          this.linkShopItemCount[key[0] + '_' + key[1]] = data.errMsg
          this.linkShopItemCount[key[1] + '_' + key[0]] = data.errMsg
        }
        let dynamicTagsLength = this.dynamicTags.length
        let total = dynamicTagsLength * dynamicTagsLength - dynamicTagsLength
        this.process_percent = 40 + 60 * Object.keys(this.linkShopItemCount).length / total
      },
      Search () {
        let shop_model
        let _this = this
        let shop_id
        this.clear()
        this.processBar = true
        let full_link_model = this.getFullLinkModel()
        let customModel = {
          'crowdName': '',
          'list': [full_link_model]
        }
        this.$dataBankApi.passApiCount(customModel, 'full_link_total', (key, data) => {
          if (data.errCode == 0) {
            _this.full_link_total = data.data
          } else {
            _this.full_link_total = data.errMsg
          }
        })
        this.process_percent = 5
        for (let i = 0; i < this.dynamicTags.length; i++) {
          shop_id = this.dynamicTags[i]
          shop_model = this.getShopItemModel([shop_id])
          shop_model['op'] = 'INTERSECT'
          customModel = {
            'crowdName': '',
            'list': [full_link_model, shop_model]
          }
          // 477012012009
          this.$dataBankApi.passApiCount(customModel, [shop_id], this.singleItemCallback)
        }
        this.process_percent = 20
        for (let i = 0; i < this.dynamicTags.length; i++) {
          if (i == this.dynamicTags.length - 1) {
            continue
          }
          for (let j = i + 1; j < this.dynamicTags.length; j++) {
            shop_id = this.dynamicTags[i]
            const link_id = this.dynamicTags[j]
            shop_model = this.getShopItemModel([shop_id])
            let link_shop_model = this.getShopItemModel([link_id])
            shop_model['op'] = 'INTERSECT'
            link_shop_model['op'] = 'INTERSECT'
            customModel = {
              'crowdName': '',
              'list': [full_link_model, shop_model, link_shop_model]
            }
            this.$dataBankApi.passApiCount(customModel, [shop_id, link_id], this.linkItemCallback)
          }
        }
      },
      Download () {
        const Sheets = {}
        let sheet1 = []
        for (let i = 0; i < this.dynamicTags.length; i++) {
          let shop_id = this.dynamicTags[i]
          sheet1.push({'产品ID': shop_id, '数量': this.singleShopItemCount[shop_id]})
        }
        Sheets['Sheet1'] = sheet1
        let sheet2 = []
        for (let i = 0; i < this.dynamicTags.length; i++) {
          for (let j = 0; j < this.dynamicTags.length; j++) {
            let first_id = this.dynamicTags[i]
            let second_id = this.dynamicTags[j]
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
        let titles = [].concat(this.dynamicTags)
        titles.unshift('商品ID')
        for (let i = 0; i < this.dynamicTags.length; i++) {
          let item = {}
          for (let j = 0; j < titles.length; j++) {
            let title = titles[j]
            let first_id = this.dynamicTags[i]
            if (title == '商品ID') {
              item[title] = this.dynamicTags[i]
            } else {
              item[title] = this.linkShopItemCount[this.dynamicTags[i] + '_' + title]
            }
          }
          sheet3.push(item)
        }
        Sheets['连带分析矩阵'] = sheet3
        this.$dataBankApi.saveExcelFromJson(Sheets, 'link_sales.xlsx')
      }
    }
  }
</script>
<style scoped>
</style>
