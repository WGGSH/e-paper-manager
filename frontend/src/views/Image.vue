<template>
  <div>
    <v-file-input
      v-model="picture"
      accept="image/*"
      label="写真を選択"
      show-size
      @change="onImagePicked"
    > </v-file-input>
    <v-btn @click="rotate">
      時計回りに回転
    </v-btn>
    <v-btn @click="onClickUpload">
      アップロードする
    </v-btn>

    <div v-if="imgSrc !== ''">
      <vue-cropper
        ref="cropper"
        :guides="true"
        :view-mode="2"
        :auto-crop-area="0.5"
        :min-container-width="500"
        :min-container-height="500"
        :background="true"
        :rotatable="true"
        :src="imgSrc"
        :img-style="{ 'width': '500px', 'height': '500px' }"
        :aspect-ratio="targetWidth / targetHeight"
        drag-mode="crop"
      />
    </div>
    <!-- <v-btn @click="upload"> -->
    <!--   <label v-if="!value" class="upload-content-space user-photo default"> -->
    <!--     <input ref="file" class="file-button" type="file" @change="upload" /> -->
    <!--   </label> -->
    <!--  -->
    <!--   <div v-if="value" class="uploaded"> -->
    <!--     <label class="upload-content-space user-photo"> -->
    <!--     <input ref="file" class="file-button" type="file" @change="upload" /> -->
    <!--     <img class="user-photo-image" :src="value" /> -->
    <!--   </label> -->
    <!-- </div> -->
    <!-- </v-btn> -->
    <!-- アップロードする -->
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
const axios = require('axios')

export default {
  name: 'Image',

  components: {
    VueCropper
  },

  data() {
    return {
      picture: null,
      pictureData: null,
      imgSrc: '',
      targetWidth: 600,
      targetHeight: 448,
    }
  },

  methods: {
    onImagePicked(e) {
      console.log(e)
      const file = e
      this.filename = file.name
      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imgSrc = event.target.result
          console.log(this.$refs)
          console.log(this.$refs.cropper)
          // this.$refs.cropper.rotate(90)
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
            console.log(result)
            // this.imgSrc = result
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
        console.log(formData)
        const config = {
          headers: {
            "Content-type": "multipart/form-data",
          }
        }
        axios.post('/api/image', formData, config)
          .then((response) => {
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
      console.log(formData)
axios
      // const config = {
      //   headers: {
      //     "Content-type": "multipart/form-data",
      //   }
      // }
      //
      // axios.post('/api/image', formData, config)
      //   .then((response) => {
      //     console.log(response)
      //   }).catch((err) => {
      //     console.log(err)
      //   })
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
