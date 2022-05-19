<template>


  <div>
  <h1> Done List </h1>
  <ul v-if="notes !== false">
    <li v-for="item in notes" :key="item.id">
      <!-- <router-link :to="{ name: 'oneWord', params: { id: wordObj.id }}">{{wordObj.word}}</router-link> -->
      <todo-item :item="item" @deleteTodo="deleteTodo" @toggleComplete="toggleComplete"/>
    </li>
  </ul>
  <div v-else>
    Loading...
  </div>

  <h1> Catagories </h1>
  <ul v-if="categories !== false">
    <li v-for="cat in categories" :key="cat.id">
      <router-link :to="{ name: 'catDone', params: { category: cat.name }}">{{cat.name}}</router-link>
    </li>
  </ul>
  <div v-else>
    Loading catagories...
  </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
import TodoItem from '@/components/TodoItem'
export default {
  name: 'DoneView',
  components: {
    TodoItem
  },
  data: function() {
    return {
      notes: false,
      categories: false,
      newNote: ""
    }
  },
  firestore: function() {
    return{
    notes: db.collection("notes")
             .where("checked", "==", true)
             .where("owner", "==", auth.currentUser.uid)
             .orderBy("createdAt", "desc"),
    categories: db.collection("categories")
             .where("owner", "==", auth.currentUser.uid)
             .orderBy("createdAt", "desc")
    }
  },
  methods: {
    deleteTodo: function(id) {
      db.collection("notes").doc(id).delete()
    },
    toggleComplete: function(id) {
      db.collection("notes").doc(id).update({
        checked: document.getElementById(id).checked
      })
    }
  }
}
</script>