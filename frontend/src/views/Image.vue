<template>
  <div>
    <LoadingDialog v-bind:enable="isLoading" v-bind:text="loadingText"/>
  </div>
</template>

<script>
import LoadingDialog from '../components/LoadingDialog'
// const axios = require('axios')

export default {
  name: 'Clear',

  components: {
    LoadingDialog,
  },

  data() {
    return {
      isLoading: false,
      loadingText: '初期化中...',
    }
  },

  created() {
  },

  methods: {
    // clear() {
    //   this.isLoading = true
    //   axios.post('/api/clear', {
    //   }).then((response) => {
    //     this.isLoading = false
    //     console.log(response)
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // }
  }
}
</script>
