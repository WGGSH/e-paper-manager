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
            <router-link to="/google-photos">
              <v-list-item>
                <v-list-item-title>GOOGLE PHOTOS</v-list-item-title>
              </v-list-item>
            </router-link>
            <router-link to="/settings">
              <v-list-item>
                <v-list-item-title>SETTINGS</v-list-item-title>
              </v-list-item>
            </router-link>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </header>
    <v-main>
      <router-view/>
    </v-main>
    <v-footer color="secondary" class="v-footer">
      <div class="footer">
      <router-link v-for="menu in footerList" :key="menu.icon" :to="menu.url" class="mx-3">
        <v-icon size="30px">
        {{ menu.icon }}
        </v-icon>
      </router-link>
      </div>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => {
    return {
      drawer: false,
      footerList: [
        {
          icon: 'mdi-home',
          url: '/',
        },
        {
          icon: 'mdi-backspace-reverse',
          url: '/clear',
        },
        {
          icon: 'mdi-camera',
          url: '/upload',
        },
        {
          icon: 'mdi-google-drive',
          url: 'google-photos',
        },
        {
          icon: 'mdi-content-save',
          url: '/image',
        },
        {
          icon: 'mdi-cog',
          url: '/settings',
        },
      ],
    }
  },
  methods: {
  },
};
</script>

<style>
.footer {
  margin: auto;
  margin-bottom: 16px;
}
</style>
