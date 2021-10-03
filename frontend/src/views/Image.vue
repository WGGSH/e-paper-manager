<template>
  <div>
    <LoadingDialog v-bind:enable="isLoading" v-bind:text="loadingText"/>

    <div>
      <v-row>
        <v-col
          v-for="picture in pictureNameList"
          :key="picture"
          class="d-flex child-flex"
          cols="6"
        >
          <v-img
            :src="`/api/image/${picture}`"
            aspect-ratio="1"
            class="grey lighten-2"
          >
          {{ picture }}
          </v-img>
        </v-col>
      </v-row>
      <!-- {{ pictureNameList }} -->
    </div>
  </div>
</template>

<script>
import LoadingDialog from '../components/LoadingDialog'
const axios = require('axios')

export default {
  name: 'Image',

  components: {
    LoadingDialog,
  },

  data() {
    return {
      isLoading: false,
      loadingText: '初期化中...',
      pictureNameList: [],
    }
  },

  created() {
    axios.get('/api/image', {}).then((response) => {
      console.log(response)
      this.pictureNameList = response.data
    })
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
