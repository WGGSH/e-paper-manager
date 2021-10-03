<template>
  <div>
  <LoadingDialog v-bind:enable="isLoading" v-bind:text="loadingText"/>
  <div v-if="imgSrc == null">
      <v-file-input
        v-model="picture"
        accept="image/*"
        label="写真を選択"
        show-size
        @change="onImagePicked"
      >
      </v-file-input>
    </div>
    <div v-else>
      <v-btn @click="rotate">
        時計回りに回転
      </v-btn>
      <v-btn @click="onClickUpload">
        アップロードする
      </v-btn>
    </div>

    <div v-if="imgSrc !== null">
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
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import LoadingDialog from '../components/LoadingDialog'
const axios = require('axios')

export default {
  name: 'Image',

  components: {
    VueCropper,
    LoadingDialog,
  },

  data() {
    return {
      picture: null,
      pictureData: null,
      imgSrc: null,
      targetWidth: 600,
      targetHeight: 448,
      isLoading: false,
      loadingText: '書き換え中...'
    }
  },

  methods: {
    onImagePicked(e) {
      const file = e
      // 画像のキャンセルがされた場合は cropper も非表示にする
      if (e === null || e === undefined) {
        this.imgSrc = null
        return
      }
      this.filename = file.name
      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (this.$refs.cropper){
              this.imgSrc = event.target.result
              this.$refs.cropper.setData(this.imgSrc)
          }
          this.imgSrc = event.target.result
       }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
      if (file !== undefined && file !== null) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        this.pictureData = new Object();
        this.pictureData.type = file.type;
        this.pictureData.fileName = file.name;
        this.readFileAsync(file)
          .then((result) => {
            this.pictureData.data = result
          })
      }
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
        axios.post('/api/image', formData, config)
          .then((response) => {
            this.isLoading = false
            console.log(response)
          }).catch((err) => {
            console.log(err)
          })
      })
      let formData = new FormData()
      formData.append(
        "picture",
        new Blob([this.pictureData.data], { type: this.pictureData.type }),
        this.pictureData.fileName
      )
    },

    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },

    rotate() {
      if(!this.$refs.cropper) return
      this.$refs.cropper.rotate(90)
    }
  }
}
</script>
