import XLSX from 'xlsx'
import axios from 'axios'
import Vue from 'vue'

const FileSaver = require('file-saver')

export default {
  csrf_token: '',
  saveExcelFromJson (jsonData, excelName) {
    const defaultCellStyle = {font: {name: 'Verdana', sz: 11, color: 'FF00FF88'}, fill: {fgColor: {rgb: 'FFFFAA00'}}}
    const wopts = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      defaultCellStyle: defaultCellStyle,
      showGridLines: false
    }
    let wb = {SheetNames: [], Sheets: {}, Props: {}}
    for (let sheet in jsonData) {
      wb.SheetNames.push(sheet)
      wb.Sheets[sheet] = XLSX.utils.json_to_sheet(jsonData[sheet])
    }
    let tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], {type: 'application/octet-stream'})
    FileSaver.saveAs(tmpDown, excelName)
  },
  s2ab (s) {
    if (typeof ArrayBuffer !== 'undefined') {
      let buf = new ArrayBuffer(s.length)
      let view = new Uint8Array(buf)
      for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    } else {
      let buf = new Array(s.length)
      for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
      return buf
    }
  },
  getCookies () {
    const _this = this
    return new Promise(function (resolve, reject) {
      chrome.cookies.get({'url': 'https://databank.tmall.com', 'name': '_tb_token_'}, function (cookie) {
        _this.csrf_token = cookie.value
        resolve()
      })
    })
  },
  async dataBankPost (url, data, _callback) {
    try {
      if (this.csrf_token == '') {
        await this.getCookies()
      }

      let response = await axios.post(url, data, {
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': this.csrf_token
        }
      })
      await _callback(response.data)
    } catch (e) {
      console.error(e)
    }
  },
  dataBankGet (url) {
    try {
      return axios.get(url)
    } catch (e) {
      console.error(e)
    }
  },
  passApiCount (customModel, name, responseCallback) {
    const _this = this
    this.dataBankPost('https://databank.tmall.com/api/paasapi', {
      'path': '/api/v1/custom/realtime/count',
      'contentType': 'application/json',
      'customModelStr': JSON.stringify(customModel)
    }, (data) => {
      return new Promise(function (resolve, reject) {
        if (data.errCode === 477012002005) {
          setTimeout(function () {
            _this.passApiCount(customModel, name, responseCallback)
          }, 10000)
        } else if (data.errCode == 0 || data.errCode == 477012012009 || data.errCode == 477012002000) {
          responseCallback(name, data)
        } else {
          console.error(data)
          alert(data.errMsg)
        }
        resolve()
      })
    })
  },
  passApiCreateCustom (customModel, name, responseCallback) {
    const _this = this
    this.dataBankPost('https://databank.tmall.com/api/paasapi', {
      'path': '/api/v1/custom/databank',
      'contentType': 'application/json',
      'customModelStr': JSON.stringify(customModel)
    }, (data) => {
      return new Promise(function (resolve, reject) {
        if (data.errCode === 477012002005) {
          setTimeout(function () {
            _this.passApiCount(customModel, name, responseCallback)
          }, 2000)
        } else if (data.errCode == 0 || data.errCode == 477012012009 || data.errCode == 477012002000) {
          responseCallback(name, data)
        } else {
          alert(data.errMsg)
        }
        resolve()
      })
    })
  },
  fullLinkCategoryGet () {
    return this.dataBankGet('https://databank.tmall.com/api/paasapi?path=/api/dimension/listDimensionForbiden&type=CATEGORY&id=7')
  },
  fullLinklistChildDimension () {
    return this.dataBankGet('https://databank.tmall.com/api/paasapi?path=/api/dimension/listChildDimension&type=STATUS&id=7')
  },
  getShop () {
    return this.dataBankGet('https://databank.tmall.com/api/paasapi?path=/api/dimension/listChildDimension&type=SHOP&id=63')
  },
  getBehavior(){
    return this.dataBankGet('https://databank.tmall.com/api/paasapi?path=/api/dimension/listChildDimension&type=BEHAVIOR&id=63')
  },
  baseDataSelect: [
    {
      text: '近7天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        end.setTime(end.getTime() - 3600 * 1000 * 24)
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
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
}
