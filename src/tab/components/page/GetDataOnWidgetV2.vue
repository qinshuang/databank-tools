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
                <el-button type="primary" @click="test()">策略中心测试</el-button>
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
        websock: null,
      }
    },
    created () {
      this.initWebSocket()
      this.init2WebSocket()
    },
    methods: {
      test () {
        this.$dataBankApi.dataBankGet('https://strategy.tmall.com/#/CustomCrowdPerspective/2084371');
        this.websocket2send(JSON.stringify(
        {"logtype":"1","title":"策略中心","pre":"https://strategy.tmall.com/","scr":"1536x864","cna":"3WIfFQlC1GkCATrdpg42YU+R","nick":"lop0320","spm-cnt":"0.0.0.0.6ca877e7fcPPzg","category":"","uidaplus":"3213969398","logkey":"/v.gif","url":"https://strategy.tmall.com/#/CustomCrowdPerspective/2087375?_k=08822e","gokey":"yunid=&5ae11635a7efe&trid=0b0afd6815554037598402365e3111&asid=AfZHkb/wk7Vcw18qGAAAAADuvfZZRYXoBQ==&p=1&o=win10&b=chrome73&s=1536x864&w=webkit&ism=pc&cache=e786fa4&lver=8.10.4&jsver=aplus_std&pver=0.6.6&urlokey=%2FCustomCrowdPerspective%2F2087375%3F_k%3D08822e&_hng=CN%25257Czh-CN%25257CCNY%25257C156&tag=1&stag=-1&lstag=-1&_slog=0","aplus_sn":"0_1554886942","ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36","lang":"zh-CN"}
      ))
        this.websocket2send(JSON.stringify(
          {"gmkey":"CLK","gokey":"nick=lop0320&smartId=233&brandId=20068&isWLogin=false&smartType=0&version=0&&uidaplus=3213969398&_hng=CN%257Czh-CN%257CCNY%257C156&jsver=aplus_std&lver=8.10.4&pver=0.6.6&cache=951ae36&_slog=0","cna":"3WIfFQlC1GkCATrdpg42YU+R","_gr_uid_":"3213969398","spm-cnt":"0.0.0.0.6ca877e7fcPPzg","logtype":"2","logkey":"/strategy.customCrowd.perspectivePv","url":"https://strategy.tmall.com/#/CustomCrowdPerspective/2087375?_k=08822e","aplus_sn":"0_1554886942","ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36","lang":"zh-CN"}
          ))
          this.websocketsend(JSON.stringify({
              'method': '/iCubeEngine/getDataOnWidgetV2',
              'headers': {'rid': '1554796983871013', 'type': 'PULL'},
              'body': {
                'args': {
                  'id': '94590',
                  'isMock': 0,
                  'whatIfParam': {'widgetParamList': [], 'customParamList': []},
                  'appId': '7'
                }
              }
            })
          )
      },
      initWebSocket () { //初始化weosocket
        const wsuri = 'wss://ws-insight-engine.tmall.com/'//ws地址
        this.websock = new WebSocket(wsuri)
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      },
      init2WebSocket(){
        const wsuri = 'wss://ws.mmstat.com/ws/3WIfFQlC1GkCATrdpg42YU+R'//ws地址
        this.websock2 = new WebSocket(wsuri)
        this.websock2.onopen = this.websocketonopen
        this.websock2.onerror = this.websocketonerror
        this.websock2.onmessage = this.websocketonmessage
        this.websock2.onclose = this.websocketclose
      },
      websocketonopen () {
        console.log('WebSocket连接成功')
      },
      websocketonerror (e) { //错误
        console.log('WebSocket连接发生错误')
      },
      websocketonmessage (e) { //数据接收
        console.log(e)
        const redata = JSON.parse(e.data)
        //注意：长连接我们是后台直接1秒推送一条数据，
        //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
        //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
        console.log(redata)
      },

      websocketsend (agentData) {//数据发送
        this.websock.send(agentData)
      },

      websocket2send (agentData) {//数据发送
        this.websock2.send(agentData)
      },

      websocketclose (e) { //关闭
        console.log('connection closed (' + e.code + ')')
      },
    }
  }
</script>
<style scoped>
</style>
