<template>
  <div>
    <LoadingDialog v-bind:enable="isLoading" v-bind:text="loadingText"/>
    <v-btn @click="clear">
      画面を消す
    </v-btn>
  </div>
</template>

<script>
import LoadingDialog from '../components/LoadingDialog'
const axios = require('axios')

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

  methods: {
    clear() {
      this.isLoading = true
      axios.post('/api/clear', {
      }).then((response) => {
        this.isLoading = false
        console.log(response)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
