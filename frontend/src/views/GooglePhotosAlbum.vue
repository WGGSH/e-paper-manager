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
        <div v-show="isLoadingOriginalSizeImage">
          <v-btn @click="rotate">
            時計回りに回転
          </v-btn>
          <v-btn @click="onClickUpload">
            映す
          </v-btn>
          <v-btn v-if="!isFavoritePicture(clickedPicture)" @click="onClickAddFavorite">
            お気に入りに登録
          </v-btn>
          <v-btn v-else @click="onClickRemoveFavorite">
            お気に入りを解除
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
        </div>
        <div v-if="!isLoadingOriginalSizeImage">
          <v-img
            :src="this.thumbnailImgUrl"
          >
          </v-img>
          <div class="loading-original-image">
            読込中...
          </div>
        </div>
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
            <v-icon x-small color="yellow" class="icon">
              {{ favoriteText(picture) }}
            </v-icon>
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
    </div>
    <v-btn @click="onClickBackButton" class="button-back">
      戻る
    </v-btn>
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
      albumId: null,
      isLoading: false,
      loadingText: '書き換え中...',
      pictureNameList: [],
      imageCol: 3,
      imageRow: 3,
      page: 1,
      dialog: false,
      imgSrc: '',
      targetWidth: 600,
      targetHeight: 448,
      loadedPage: 0,
      maxPage: 1,
      isLoadingOriginalSizeImage: false,
      thumbnailImgUrl: '',
      clickedPicture: null,
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
        (this.page - 1) * this.singlePageNum,
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
    this.albumId = this.$route.query.id
    for(let i=0; i < this.maxPage; i++) tmpArray[i] = i

    for await (const i of tmpArray) {
      i // XXX: 使う必要ないけど...
      await axios.get('/api/photo/album', {
        params: {
          id: this.albumId,
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
    changeImgSrc(src) {
      if (this.imgSrc != '') {
        this.imgSrc = src
        this.$refs.cropper.replace(this.imgSrc)
      } else {
        this.imgSrc = src
      }
    },

    clearImgSrc() {
      this.imgSrc = null
    },

    cardClicked: async function(picture) {
      this.isLoadingOriginalSizeImage = false
      this.clearImgSrc()
      this.thumbnailImgUrl = picture.baseUrl
      this.dialog = true
      this.clickedPicture = picture
      await axios.get('/api/photo/album/save', {
        params: {
          id: picture.id,
        }
      })
      this.isLoadingOriginalSizeImage = true
      this.changeImgSrc('/api/image/image.jpg')
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
    },

    onClickBackButton() {
      history.back()
    },

    favoriteText(picture) {
      return picture.isFavorite ? 'mdi-star' : 'mdi-star-outline'
    },

    isFavoritePicture(picture) {
      if (picture === null) return false
      return picture.isFavorite
    },

    onClickAddFavorite: async function() {
      this.clickedPicture.isFavorite = true
      await axios.post('/api/favorite', {
        albumId: this.albumId,
        pictureId: this.clickedPicture.id,
      }).catch((err) => {
        console.log(err)
      })
    },

    onClickRemoveFavorite: async function() {
      this.clickedPicture.isFavorite = false
      await axios.delete('/api/favorite', {
        data: {
          albumId: this.albumId,
          pictureId: this.clickedPicture.id,
        }
      }).catch((err) => {
        console.log(err)
      })
    },
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

.button-back {
  margin-left: 16px;
}

.loading-original-image {
  margin: 16px;
  text-align: center;
}
</style>
