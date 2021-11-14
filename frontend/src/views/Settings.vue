<template>
  <div class="settings">
    <div v-for="param in params" :key="param.label">
      <v-switch
        v-model="param.value"
        :label="param.name"
        color="primary"
        @change="onChangeValue(param)"
      />
    </div>
  </div>
</template>

<script>
const axios = require('axios')
export default {

  data() {
    return {
      params: {
        boot_on_random: {
          label: 'boot_on_random',
          name: '起動時にランダム表示',
          value: false,
        },
        notify_ip_changed: {
          label: 'notify_ip_changed',
          name: 'IP変更後の起動時に通知する',
          value: false,
        },
      }
    }
  },

  created: async function() {
    const result = await axios.get('/api/config')
    const configList = result.data
    for(const param in configList) {
      this.params[param].value = configList[param]
    }
  },

  methods: {
    onChangeValue: async function(param) {
      await axios.post('/api/config', {
        label: param.label,
        value: param.value,
        }
      )
    },
  },
}
</script>

<style>

.settings {
  margin: 16px;
}

</style>
