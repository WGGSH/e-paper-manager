<template>
  <div>
    <v-file-input
      v-model="picture"
      accept="image/*"
      label="写真を選択"
      show-size
      @change="onImagePicked"
    > </v-file-input>
    <v-btn @click="onClickUpload">
      アップロードする
    </v-btn>
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
  const axios = require('axios')

  export default {
    name: 'Image',

    data() {
      return {
        picture: null,
        pictureData: null,
      }
    },

    methods: {
      onImagePicked(file) {
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
        let formData = new FormData()
        formData.append(
          "picture",
          new Blob([this.pictureData.data], { type: this.pictureData.type }),
          this.pictureData.fileName
        )

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
    }
  }
</script>
