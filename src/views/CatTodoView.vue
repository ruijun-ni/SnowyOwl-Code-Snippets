<template>
  <div>
  <h1> language: {{ this.category }}</h1>
  <ul v-if="notes !== false">
    <li v-for="item in notes" :key="item.id">
    {{item.question}}
    <pre v-highlightjs><code class="{item.lang.toLowerCase().trim()}">{{item.code}}</code></pre>

    <button @click="deleteNote(item.id)">delete</button>
    <!--button @click="editNote(item.id)">fake edit</button-->
    <add-note-popup mode='edit' :note=item />

    </li>
  </ul>
  <div v-else>
    Loading items...
  </div>
  </div>
</template>

<script>
import { db, auth} from '@/firebaseConfig'
// import TodoItem from '@/components/TodoItem'
export default {
  name: 'CatTodoView',
  components: {
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
    }
  },
  firestore: function() {
    return {
      notes: db.collection("notes")
               .where("category", "==", this.category)
               .where("owner","==", auth.currentUser.uid)
               .orderBy("createdAt", "desc"),
    }
  },
  methods: {
    // addNewNote: function() {
    //   // note can't be empty
    //   if (this.newNote.length > 0) {
    //   let newNote = {
    //     note: this.newNote,
    //     checked: false,
    //     createdAt: new Date(),
    //     category: this.category
    //   };
    //   this.newNote = ""
    //   db.collection("notes").add(newNote)}
    // },
    deleteNote: function(id) {
      db.collection("notes").doc(id).delete()
    },
    // toggleComplete: function(id) {
    //   db.collection("notes").doc(id).update({
    //     checked: document.getElementById(id).checked
    //   })
    // }
    editNote: function(id){
      alert(id)
    },
    addNote: function(){
      alert("s")
    }
  }
}
</script>