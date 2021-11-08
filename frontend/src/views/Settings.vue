<template>
  <div class="settings">
    <div v-for="param in params" :key="param.label">
      <v-switch
        v-model="param.value"
        :label="param.name"
        color="primary"
        @change="onChangeValue"
      />
    </div>
  </div>
</template>

<script>
export default {

  data() {
    return {
      params: [
        {
          label: 'boot_on_random',
          name: '起動時にランダム表示',
          value: false,
        },
        {
          label: 'notify_ip_changed',
          name: 'IP変更後の起動時に通知する',
          value: false,
        },
      ]
    }
  },

  methods: {
    onChangeValue() {
    },
  },
}
</script>

<style>

.settings {
  margin: 16px;
}

</style>
