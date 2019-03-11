<template lang="pug">
    div
        el-button(@click="tab") 打开工具
</template>
<script>
  export default {
    data: () => ({}),
    computed: {},
    created () {
    },
    mounted () {
    },
    methods: {
      tab () {
        chrome.tabs.create({url: 'pages/app.html'})
      }
    }
  }
</script>
<style lang="scss">
    div {
        color: blue
    }

    body {
        margin: 0px;
    }

    .el-button {
        border-width: 0px;
    }
</style>
