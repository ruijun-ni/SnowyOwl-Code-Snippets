<template>
  <div class="about" v-if="item !== false && !deleting">
    <!-- <h1>{{item.note}}</h1> -->
    <textarea v-model="item.note" />
    <br>
    <button @click="markDone"> done </button>
    <button @click="updateDef">save</button>
    <select aria-label="category" @change="changeCategory" v-model="item.category">
        <option v-for="cat in categories" :key="cat.name">{{cat.name}}</option>
    </select>
  </div>
  <div v-else>
      LOADING
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
    props:['id'],
    data: function() {
        return {
            item: false,
            deleting: false,
            categories: false
        }
    },
    firestore: function() {
        return {
            item: db.collection("notes").doc(this.id),
            categories: db.collection("categories")
                          .where("owner", "==", auth.currentUser.uid)
                          .orderBy("createdAt", "desc")
        }
    },
    beforeUpdate: function() {
        if (this.item === null && !this.deleting) {
            this.$router.replace({name:'404'})
        } else if (this.item === null && this.deleting) {
            this.$router.push({name:'home'})
        }
    },
    methods: {
        markDone: function() {
            this.item.checked = true
            db.collection("notes").doc(this.id).update(this.item)
        },
        updateDef: function() {
            this.$firestoreRefs.item.update({note: this.item.note})
        },
        changeCategory: function(e) {
            this.$firestoreRefs.item.update({category: e.target.value})
        }
    }
}
</script>

<style>
</style>