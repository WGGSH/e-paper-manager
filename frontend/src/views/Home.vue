<template>
  <div class="pera">
    <LoadingDialog v-bind:enable="isLoading" v-bind:text="loadingText"/>
    <v-dialog v-model = "isUpdateDialog">
      <v-card>
        <v-card-title class="secondary">
          アップデートのお知らせ
        </v-card-title>
        <v-card-text>
          更新 ボタンを押すとアップデートします
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="isUpdateDialog = false">
            キャンセル
          </v-btn>
          <v-btn color="primary" @click="onClickUpdate">
            更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model = "isUpdatingDialog" persistent>
      <v-card>
        <v-card-title class="secondary">
          アップデート中...
        </v-card-title>
      </v-card>
    </v-dialog>
    <h2 class="title">
      Digital E-Paper System
    </h2>
    <p>
      電子ペーパーに好きな写真を映すことのできるアプリです
    </p>
    <p>
      写真を表示したい場合は，左のメニューから  IMAGE を選択
    </p>
    <p>
      映っている内容を削除したい場合は，左のメニューから CLEAR を選択
    </p>

    <p>
      Safari 下のメニューから， 「HOME 画面に追加」 をしておくと，すぐにアクセスできます
    </p>

    <v-btn color="secondary" @click="onClickRandom">
      ランダム表示
    </v-btn>

    <div v-if="currentVersion" class="version">
      {{ currentVersion.data }}
    </div>

    <div class="updates">
      更新履歴

      <ul>
        <li v-for="information in updateInformations" :key="information.version">
          {{ information.version }} {{ information.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const axios = require('axios')

import LoadingDialog from '../components/LoadingDialog'

export default {
  name: 'Home',

  components: {
    LoadingDialog,
  },

  data() {
    return {
      currentVersion: null,
      latestVersion: null,
      isUpdateDialog: false,
      isUpdatingDialog: false,
      isLoading: false,
      loadingText: '書き換え中...',
      updateInformations: [],
    }
  },
  created: async function() {
    this.currentVersion = await axios.get('api/current_version')
    this.latestVersion = await axios.get('api/latest_version')
    if (this.currentVersion.data.trim() !== this.latestVersion.data.trim()) {
      this.isUpdateDialog = true
    }
    const updateResult = await axios.get('api/updates')
    this.updateInformations = updateResult.data
  },
  methods: {
    onClickUpdate: async function() {
      this.isUpdateDialog = false
      this.isUpdatingDialog = true
      await axios.post('api/update')
      this.isUpdatingDialog = false
    },
    onClickRandom: async function() {
      this.isLoading = true
      await axios.post('/api/random').catch((err) => {
        console.log(err)
      })
      this.isLoading = false
    },
  }
}
</script>

<style lang="scss">
.pera {
  margin: 16px;

  .title {
    margin-bottom: 32px;
  }

  .version {
    color: gray;
  }
}
</style>
