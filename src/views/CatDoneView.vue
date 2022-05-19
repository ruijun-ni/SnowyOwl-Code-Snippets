<template>
  <div>
  <h1> {{ this.category }} Done List </h1>
  <ul v-if="notes !== false">
    <li v-for="item in notes" :key="item.id">
      <!-- <router-link :to="{ name: 'oneWord', params: { id: wordObj.id }}">{{wordObj.word}}</router-link> -->
      <todo-item :item="item" @deleteTodo="deleteTodo" @toggleComplete="toggleComplete"/>
    </li>
  </ul>
  <div v-else>
    Loading items...
  </div>
  </div>
</template>

<script>
import { db } from '@/firebaseConfig'
import TodoItem from '@/components/TodoItem'
export default {
  name: 'CatDoneView',
  components: {
    TodoItem
  },
  props: {
    category: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      notes: false,
      newNote: ""
    }
  },
  firestore: function() {
    return {
      notes: db.collection("notes")
               .where("checked", "==", true)
               .where("category", "==", this.category)
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