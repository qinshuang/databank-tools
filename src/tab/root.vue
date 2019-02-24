<template lang="pug">
    <div>
      <el-button type="primary" @click="tab"> New tab 
      </el-button>
    </div>
</template>
<script>
  export default {
    data: () => ({
    }),
    computed: { },
    created () { },
    mounted () { },
    methods: {
      tab () {
        this.$http.get('https://databank.yushanfang.com/api/ecapi?thedate=20190214&path=/datatable/fulllink/').then((response) => {
          console.log(response)
        }, (response) => {
          console.log(response)
        })
      }
    }
  }
</script>
<style lang="scss">
  div {
    color: blue
  }
</style>