<template>
  <v-app>
    <header>
      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
          <v-toolbar-title>
          Digital E-Paper Photo Frame
          </v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        fixed
        temporary
      >
        <v-list
          nav
          dense
        >
          <v-list-item-group>
            <router-link to="/">
              <v-list-item>
                <v-list-item-title>HOME</v-list-item-title>
              </v-list-item>
            </router-link>
            <router-link to="/clear">
              <v-list-item>
                <v-list-item-title>CLEAR</v-list-item-title>
              </v-list-item>
            </router-link>
            <router-link to="/upload">
              <v-list-item>
                <v-list-item-title>UPLOAD</v-list-item-title>
              </v-list-item>
            </router-link>
            <router-link to="/image">
              <v-list-item>
                <v-list-item-title>IMAGE</v-list-item-title>
              </v-list-item>
            </router-link>
            <v-list-item>
              <v-list-item-title>GOOGLE PHOTO</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </header>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => {
    return {
      drawer: false,
    }
  },
  methods: {
  },
};
</script>
