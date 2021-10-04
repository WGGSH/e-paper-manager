<template>
  <div>
    <LoadingDialog v-bind:enable="isLoading" v-bind:text="loadingText"/>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
          outlined
          elevation="5"
            dark
            @click="dialog = false"
          >
          CANCEL
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-dialog>

    <div class="album">
      <v-row>
        <v-col
          v-for="picture in currentPagePictureList"
          :key="picture"
          class="d-flex child-flex"
          cols="4"
        >
          <v-card
            @click.stop="cardClicked(picture)"
          >
            <v-img
              :src="`/api/image/${picture}`"
              aspect-ratio="1.333"
              class="grey lighten-2"
            >
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-pagination
        v-model="page"
        :length="pageMax"
      ></v-pagination>
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
      imageCol: 2,
      imageRow: 3,
      page: 1,
      dialog: false,
      selectPictureName: '',
    }
  },

  computed: {
    singlePageNum() {
      return this.imageCol * this.imageRow
    },

    pageMax() {
      return Math.ceil(this.pictureNameList.length/(this.singlePageNum))
    },

    currentPagePictureList() {
      return this.pictureNameList.slice(
        (this.page-1)*this.singlePageNum,
        this.page * this.singlePageNum
      )
    }
  },

  created() {
    axios.get('/api/image', {}).then((response) => {
      console.log(response)
      this.pictureNameList = response.data
    })
  },

  methods: {
    cardClicked(name) {
      this.selectPictureName = name
      this.dialog = true
    },
    getImage(name) {
      axios.get(`/api/image/${name}`, {}).then((response) => {
        console.log(response)
        return response.data
      })
    },
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

<style>

.album {
  padding: 16px;
}
</style>
