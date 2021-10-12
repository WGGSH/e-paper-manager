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
        <v-btn @click="rotate">
          時計回りに回転
        </v-btn>
        <v-btn @click="onClickUpload">
          映す
        </v-btn>
        <vue-cropper
          ref="cropper"
          :guides="true"
          :view-mode="2"
          :auto-crop-area="1.0"
          :background="true"
          :rotatable="true"
          :src="imgSrc"
          :img-style="{ 'width': '100%' }"
          :aspect-ratio="targetWidth / targetHeight"
          drag-mode="crop"
          class="cropper"
        />
      </v-card>
    </v-dialog>

    <div class="album">
      <v-row>
        <v-col
          v-for="picture in currentPagePictureList"
          :key="picture.id"
          class="d-flex child-flex"
          cols="4"
        >
          <v-card
            @click.stop="cardClicked(picture)"
          >
            <v-img
              :src="`${picture.baseUrl}`"
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
      <div v-if="!isLoaded" class="progress">
        <v-progress-circular :value="loadedImageRate"></v-progress-circular>
      </div>
      <!-- {{ pictureNameList }} -->
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import LoadingDialog from '../components/LoadingDialog'
const axios = require('axios')

export default {
  name: 'GooglePhotosAlbum',

  components: {
    VueCropper,
    LoadingDialog,
  },

  data() {
    return {
      isLoading: false,
      loadingText: '書き換え中...',
      pictureNameList: [],
      imageCol: 5,
      imageRow: 3,
      page: 1,
      dialog: false,
      imgSrc: '',
      targetWidth: 600,
      targetHeight: 448,
      loadedPage: 0,
      maxPage: 1,
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
    },

    loadedImageRate() {
      return this.loadedPage / this.maxPage * 100
    },

    isLoaded() {
      return this.loadedPage == this.maxPage
    }
  },

  created: async function() {
    this.maxPage = Math.ceil(this.$route.query.count / this.singlePageNum)
    this.pictureNameList = []
    let next = ''
    let tmpArray=[]
    for(let i=0; i < this.maxPage; i++) tmpArray[i] = i

    for await (let i of tmpArray) {
      console.log(i) // XXX: 使う必要ないけど...
      await axios.get('/api/photo/album', {
        params: {
          id: this.$route.query.id,
          size: this.singlePageNum,
          next: next,
        },
      }).then((response) => {
        this.loadedPage ++
        this.pictureNameList = this.pictureNameList.concat(response.data.mediaItems)
        next = response.data.nextPageToken
      })
    }
  },

  methods: {
    cardClicked: async function(picture) {
      const result = await axios.get('/api/photo/album/save', {
        params: {
          id: picture.id,
        }
      })
      console.log(result)
      if (result.data === 'success') {
        const url = '/api/image/image.jpg'
        if (this.imgSrc!='') {
          this.imgSrc = url
          this.$refs.cropper.replace(this.imgSrc)
        } else {
          this.imgSrc = url
        }
        this.dialog = true
      }
    },
    getImageURL(name) {
      return `/api/image/${name}`
    },

    rotate() {
      if(!this.$refs.cropper) return
      this.$refs.cropper.rotate(90)
    },

    onClickUpload() {
      this.$refs.cropper.getCroppedCanvas().toBlob((result) => {
        let formData = new FormData()
        formData.append(
          "picture",
          result,
          "image.png"
        )
        const config = {
          headers: {
            "Content-type": "multipart/form-data",
          }
        }
        this.isLoading = true
        axios.post('/api/upload', formData, config)
          .then(() => {
            this.isLoading = false
          }).catch((err) => {
            console.log(err)
          })
      })
    }
  }
}
</script>

<style>

.album {
  padding: 16px;
}

.progress {
  text-align: center;
}
</style>
