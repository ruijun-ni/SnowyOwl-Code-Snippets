<template>
  <div id="app">
  <h1 class="title owl"> SnowyOwl Snippets </h1>
    <nav class="login-btn">
      <login-button/>
    </nav>


    <router-view/>
  </div>
</template>

<script>
import { auth } from "@/firebaseConfig";
import LoginButton from './components/LoginButton.vue'
// import NavigationView from ".components/NavigationView.vue"



export default {
  components: { LoginButton },
    watch: {
        $route: {
            immediate: true,
            handler(to) {
                document.title = to.meta.title || 'SnowyOwl Snippets';
            }
        },
    },
  beforeCreate: function() {
    auth.getRedirectResult().then(result=>{
      if (result.user) {
        console.log('result: ', result)
        this.$router.push("/search")
      }
    }).catch(() => {
      this.$router.push("/itsAllForNothing")
    })
  }
}



</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}


.owl {
  text-align: center;
}


.login-btn {
  text-align: center;
}

nav {
  padding: 0 0 20px 0;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

ul {
    list-style: none;
    padding-left: 0;
}
.fade-animation-enter-active {
  transition: transform 0.15s, opacity 0.45s !important;
}
.fade-animation-enter,
.fade-animation-leave-to {
  transform: translateX(-60%) !important;
  opacity: 0 !important;
}
</style>
