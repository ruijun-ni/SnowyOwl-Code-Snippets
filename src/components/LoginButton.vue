<template>
  <div class="auth">

    <template v-if="!user">
      <button class="button is-warning is-outlined is-small" @click="signInWithGoogle"> Sign in with Google </button>
    </template>
    <template v-if="user">
      
      <img class="avatar" :src="user.photoURL" alt="avatar" referrerpolicy="no-referrer">
      <!-- google is real paranoid about hotlinking images I guess the referrerpolicy seems to fix it
        https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic -->
      <button class="button is-success is-outlined is-small" @click="signOut">Sign Out</button>
    </template>

    <!-- <pre>{{ user }}</pre> -->
  </div>
</template>

<script>
import { auth, provider } from "@/firebaseConfig";
export default {
    components: {},
    name: "LoginButton",
  data() {
    return {
      user: null
    };
  },
  beforeCreate: function() {
    auth.onAuthStateChanged(user => {
      //  console.log("user state:", user);
      // uncomment above to check out which user properties are available.
      if (user) {        
        this.user = user;
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    signInWithGoogle: function() {
      auth.signInWithRedirect(provider)
        .then(result => {
          this.user = result.user;
          
        })
        .catch(err => console.log(err));
    },
    signOut: function() {
      auth.signOut()
        .then(() => {
          this.user = null;
          this.$router.push("/");
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";
.avatar {
  width: 2em; 
  height: 2em; 
  border-radius: 50%;
}
</style>