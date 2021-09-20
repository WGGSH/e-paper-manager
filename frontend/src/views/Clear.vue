<template>
  <div>
    <v-btn @click="clear">
      画面を消す
    </v-btn>
  </div>
</template>

<script>
  const axios = require('axios')

  export default {
    name: 'Clear',

    methods: {
      clear: () => {
        axios.post('/api/clear', {
        }).then((response) => {
          console.log(response)
        })
      }
    }
  }
</script>
