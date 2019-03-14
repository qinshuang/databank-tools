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
            <h4>1. 品类查询: 选择链路、类目、时间、 搜索品类数值，若查询不到将自动建包 </h4>
            <h4>2. 店铺查询：选在 店铺、行为、行为时间，查询店铺行为人数</h4>
            <h4>3. 品类->店铺 查询： 选择所有选项, 品类并完后 与 店铺相交, 若查询不到将自动建包</h4>
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
                    <el-form-item label="二级类目">
                        <el-select v-model="categorys_select" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in categorys_select_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="全链路状态时间">
                        <div class="block">
                            <el-date-picker
                                    v-model="full_link_date"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="datePickerOptions"
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
                                    :picker-options="datePickerOptions"
                                    value-format="yyyyMMdd">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="Count:" v-if="packageCountDiv">
                        <h2>{{ packageCount }}</h2>
                    </el-form-item>
                </el-form>

                <el-button type="primary" @click="Search()" :loading="searchLoading">品类查询</el-button>
                <el-button type="primary" @click="Search2()" :loading="search2Loading">店铺查询</el-button>
                <el-button type="primary" @click="Search3()" :loading="search3Loading">品类->店铺查询</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'link-sales',
    data () {
      return {
        form: {},
        behavior_select_options: [],
        behavior_select: [],
        shop_select_options: [],
        shop_select: [],
        searchLoading: false,
        search2Loading: false,
        search3Loading: false,
        packageCount: '',
        packageCountDiv: false,
        full_link_select_options: [],
        full_link_select: [],
        categorys_select: [],
        categorys_select_options: [],
        full_link_date: '',
        shop_behavior_data: '',
        datePickerOptions: {
          shortcuts: this.$dataBankApi.baseDataSelect
        },
      }
    },
    created () {
      let _this = this
      this.$dataBankApi.fullLinkCategoryGet().then((response) => {
        if (response.data.data) {
          response.data.data.map((value, index) => {
            _this.categorys_select_options.push({
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
      })
      this.$dataBankApi.fullLinklistChildDimension().then((response) => {
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
      this.$dataBankApi.getShop().then((response) => {
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
      this.$dataBankApi.getBehavior().then((response) => {
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
        this.packageCountDiv = false
      },
      getFullLinkModel (cate) {
        return {
          'editUsefulData': {
            'aliId': ['1', '7'],
            'uniqueId': ['1', '7'],
            'conditionName': '全链路状态 > 全链路状态',
            'getDimensionId': '7'
          },
          'selectionLv1': ['FULL_LINK', 'FULL_LINK'],
          'selectionLv3': {
            'cate': cate,
            'types': this.full_link_select,
            'dateType': 'ABSOLUTE_DATE_RANGE',
            'dateValue': {'from': this.full_link_date[0], 'to': this.full_link_date[1]}
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
            'selectedGoodsType': '1', 'cate': 'ALL',
            'bhv': this.behavior_select, 'dateType': 'ABSOLUTE_DATE_RANGE',
            "dayFrequency":{"op":"OPEN_OPEN"},
            'dateValue': {'from': this.shop_behavior_data[0], 'to': this.shop_behavior_data[1]}
          }, 'selectionLv2': ['63#|#4']
        }
      },
      Search () {
        this.clear()
        this.searchLoading = true
        let requstModel = []
        console.log(this.categorys_select)
        for (let i = 0; i < this.categorys_select.length; i++) {
          let item = this.categorys_select[i]
          let model = this.getFullLinkModel(item)
          if (requstModel == []) {
            requstModel = model
          } else {
            model['op'] = 'UNION'
            requstModel.push(model)
          }
        }
        let customModel = {
          'crowdName': '',
          'list': requstModel
        }
        this.$dataBankApi.passApiCount(customModel, 'count', (key, data) => {
          this.searchLoading = false
          if (data.errCode == 477012002000) {
            this.packageCountDiv = false
            this.$prompt('创建新人群包', data.errMsg, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({value}) => {
              customModel['crowdName'] = value
              this.$dataBankApi.passApiCreateCustom(customModel, 'createPackage', (key, data) => {
                console.log(key, data)
                if (data.errCode != 0) {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg
                  })
                } else {
                  this.$notify.success({
                    title: 'Success',
                    message: '创建人群包 ' + value + ' 成功'
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              })
            })
          } else {
            this.packageCountDiv = true
            this.packageCount = data.data
          }
        })
      },
      Search2 () {
        this.clear()
        this.search2Loading = true
        let customModel = {
          'crowdName': '',
          'list': [this.getShopItemModel()]
        }
        this.$dataBankApi.passApiCount(customModel, 'count', (key, data) => {
          this.search2Loading = false
          if (data.errCode == 0) {
            this.packageCountDiv = true
            this.packageCount = data.data
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg
            })
          }
        })
      },
      Search3 () {
        this.clear()
        this.search3Loading = true
        let requstModel = []
        console.log(this.categorys_select)
        for (let i = 0; i < this.categorys_select.length; i++) {
          let item = this.categorys_select[i]
          let model = this.getFullLinkModel(item)
          if (requstModel == []) {
            requstModel = model
          } else {
            model['op'] = 'UNION'
            requstModel.push(model)
          }
        }
        let shopmodel = this.getShopItemModel()
        shopmodel['op'] = 'INTERSECT'
        requstModel.push(shopmodel)
        let customModel = {
          'crowdName': '',
          'list': requstModel
        }
        console.log(customModel)
        this.$dataBankApi.passApiCount(customModel, 'count', (key, data) => {
          this.search3Loading = false
          if (data.errCode == 477012002000) {
            this.packageCountDiv = false
            this.$prompt('创建新人群包', data.errMsg, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({value}) => {
              customModel['crowdName'] = value
              this.$dataBankApi.passApiCreateCustom(customModel, 'createPackage', (key, data) => {
                console.log(key, data)
                if (data.errCode != 0) {
                  this.$notify.error({
                    title: '错误',
                    message: data.msg
                  })
                } else {
                  this.$notify.success({
                    title: 'Success',
                    message: '创建人群包 ' + value + ' 成功'
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              })
            })
          } else {
            this.packageCountDiv = true
            this.packageCount = data.data
          }
        })
      },
    }
  }
</script>

<style scoped>
</style>
