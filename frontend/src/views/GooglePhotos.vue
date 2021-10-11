<template>
  <div>
    <LoadingDialog v-bind:enable="isLoading" v-bind:text="loadingText"/>

    <div class="album">
      <v-row>
        <v-col
          v-for="album in currentPageAlbumList"
          :key="album.id"
          class="d-flex child-flex"
          cols="6"
        >
          <v-card
            @click.stop="cardClicked(album)"
          >
            {{ album.title }}
            <v-img
              :src="`${album.coverPhotoBaseUrl}`"
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
  name: 'GooglePhotos',

  components: {
    LoadingDialog,
  },

  data() {
    return {
      isLoading: false,
      loadingText: '書き換え中...',
      albumList: [],
      page: 1,
      albumCol: 2,
      albumRow: 2,
    }
  },

  computed: {
    singlePageNum() {
      return this.albumCol * this.albumRow
    },
    pageMax() {
      return Math.ceil(this.albumList.length/(this.singlePageNum))
    },
    currentPageAlbumList() {
      return this.albumList.slice(
        (this.page-1)*this.singlePageNum,
        this.page * this.singlePageNum
      )
    }
  },

  methods: {
    cardClicked (album) {
      // this.$router.push(`google-photos/album?id=${album.id} ?count=${album.mediaItemsCount}`)
      this.$router.push({
        path: 'google-photos/album',
        query: {
          id: album.id,
          count: album.mediaItemsCount
        },
      })
    },
  },

  created() {
    axios.get('/api/photo/album_list', {}).then((response) => {
      this.albumList = response.data
      console.log(response.data)
    })
  }
}
</script>
