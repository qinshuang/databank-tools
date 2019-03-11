import XLSX from 'xlsx'
import axios from 'axios'

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
  passApiCount (customModel, name, responseCallback) {
    const _this=this;
    this.dataBankPost('https://databank.tmall.com/api/paasapi', {
      'path': '/api/v1/custom/realtime/count',
      'contentType': 'application/json',
      'customModelStr': JSON.stringify(customModel)
    }, (data) => {
      return new Promise(function (resolve, reject) {
        if (data.errCode !== 0 && data.errCode !== 477012012009) {
          if (data.errCode === 477012002005) {
            setTimeout(function () {
              _this.passApiCount(customModel, name, responseCallback)
            }, 2000)
          } else {
            console.error(data)
            // this.$notify.error({
            //   title: '错误',
            //   message: data.errMsg,
            // })
          }
        } else {
          responseCallback(name, data)
        }
        resolve()
      })
    })
  },
}
