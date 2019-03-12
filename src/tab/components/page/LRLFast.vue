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
                </el-form>
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
        form: {},
        full_link_select_options: [],
        full_link_select: [],
        categorys_select: [],
        categorys_select_options: [],
        full_link_data: '',
        full_link_data_options: {
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
    },
    methods: {
      clear () {
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
            'cate': catte,
            'types': this.full_link_select,
            'dateType': 'ABSOLUTE_DATE_RANGE',
            'dateValue': {'from': this.full_link_data[0], 'to': this.full_link_data[1]}
          }
        }
      },
    }
  }
</script>

<style scoped>
</style>
