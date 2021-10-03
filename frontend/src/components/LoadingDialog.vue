<template>
  <v-dialog
    v-model="enable"
    persistent
  >
    <v-card>
      <v-card-title>
        {{ text }}
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  props: ['enable', 'text'],
}

</script>

<style>

.dialog {
  background: #fff3;
  position: absolute;
  left: 2.5%;
  width: 95%;
  height: 97.5%;
  border-radius: 16px;
}
</style>
