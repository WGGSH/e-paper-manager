<template>
  <v-app>
    <header>
      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-btn @click="reload">
          <v-toolbar-title>
            Reload
          </v-toolbar-title>
        </v-btn>
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
            <router-link to="/image">
              <v-list-item>
                <v-list-item-title>Image</v-list-item-title>
              </v-list-item>
            </router-link>
            <v-list-item>
              <v-list-item-title>SERVICE</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>BLOG</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>ACCESS</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </header>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
  <!-- <v-app> -->
  <!--   <v-app-bar -->
  <!--     app -->
  <!--     color="primary" -->
  <!--     dark -->
  <!--   > -->
  <!--     <div class="d-flex align-center"> -->
  <!--       <v-img -->
  <!--         alt="Vuetify Logo" -->
  <!--         class="shrink mr-2" -->
  <!--         contain -->
  <!--         src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" -->
  <!--         transition="scale-transition" -->
  <!--         width="40" -->
  <!--       /> -->
  <!--  -->
  <!--       <v-img -->
  <!--         alt="Vuetify Name" -->
  <!--         class="shrink mt-1 hidden-sm-and-down" -->
  <!--         contain -->
  <!--         min-width="100" -->
  <!--         src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png" -->
  <!--         width="100" -->
  <!--       /> -->
  <!--     </div> -->
  <!--  -->
  <!--     <v-spacer></v-spacer> -->
  <!--  -->
  <!--     <v-btn -->
  <!--       href="https://github.com/vuetifyjs/vuetify/releases/latest" -->
  <!--       target="_blank" -->
  <!--       text -->
  <!--     > -->
  <!--       <span class="mr-2">Latest Release</span> -->
  <!--       <v-icon>mdi-open-in-new</v-icon> -->
  <!--     </v-btn> -->
  <!--   </v-app-bar> -->
  <!--  -->
  <!--   <v-main> -->
  <!--     <router-view/> -->
  <!--   </v-main> -->
  <!-- </v-app> -->
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
    reload: () => {
      location.reload()
    }
  },
  // data: () => ({
  // }),
};
</script>
