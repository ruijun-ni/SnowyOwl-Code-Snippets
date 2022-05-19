<template>
<div>

      <VueElementLoading
        :spinner="spinnerKind"
        :size="spinnerSize"
        :duration="spinnerDuration"
        :color="spinnerColor"
        :active="fullscreen"
        :text="text"
        :textStyle="textStyles[spinnerTextStyle] || {}"
        is-full-screen
      />



    <div class="my-container">
      <vue-element-loading :active="isActive" spinner="bar-fade-scale" color="#FF6700"/>
      <span>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Fusce id fermentum quam. Proin sagittis, nibh id hendrerit imperdiet, elit sapien laoreet elit.
      </span>
      <button> start</button>
    </div>


    <div class="columns">

      <div class="column is-one-fifths is-hidden-mobile">

        <aside class="menu" style="text-align: left; margin-left: 40px;">
          <p class="menu-label">
            Languages
          </p>
          <ul v-if="languages !== false" class="menu-list">
            <li v-for="cat in languages" :key="cat.id">
              <router-link :to="{ name: 'catTodos', params: { category: cat.lang }}">{{cat.lang}}</router-link>
            </li>
          </ul>
          <div v-else>
            Loading catagories...
          </div>

          <p class="menu-label">
            Catagories
          </p>
          <ul class="menu-list">
            <li><a>Favorite</a></li>
            <li><a>Unsolved</a></li>
          </ul>

        </aside>

      </div>

      <div class="column">

          <add-note-popup mode='add' @click="activateFullScreen()" :note=null />
      
        <ul v-if="notes !== false">
          <li v-for="item in notes" :key="item.id">
            <br>
            <div class="card">
             
              <div class="header-container">
                <div class="question"> {{item.question}} </div>
                <div class="buttons">
                  <button class="button is-danger is-light is-small" @click="deleteNote(item)">🗑️ delete</button>
                  
                  <add-note-popup mode='edit' @click="activateFullScreen()" :note=item />
                  <button class="button is-info is-light is-small" @click="likeNote(item)">{{item.isFavorite ? "❤️" : "🤍"}}</button>
                </div>
              </div>
            
              
              <div class="card-content">
                
                  <pre v-highlightjs class="my-pre"><code class="{item.lang.toLowerCase().trim()}">{{item.code}}</code></pre>
               
              </div>

            </div>
          </li>
        </ul>
        <div v-else>
          Loading items...
        </div>
      </div>

    </div>
</div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
import AddNotePopup from '@/components/AddNotePopup.vue'
import VueElementLoading from "vue-element-loading";

export default {
  name: 'TodosView',
  data: function() {
    return {
      notes: false,
      languages: false,
      newNote: "",

      //favText: "🤍",
      // newCategory: ""


      //Loading icon setting
         textStyles: {
          none: {},
          bold: {'font-weight':'bold'},
          bigNeonGreen : { 'font-size':'300%', color:'#0F0', 'text-shadow':'0 0 1em #0F0' }
         },
        text: 'Loading',
      //   show: true,
        fullscreen: false,
      //   fullscreenGreenBg: false,
      //   pikachu: false,
        spinnerKind: 'bar-fade-scale',
        spinnerColor: '#FF6700',
        spinnerSize: '32',
        spinnerDuration: '0.6',
        spinnerTextStyle: 'none'

    }
  },
  components: {
    ///
    AddNotePopup,
    ///
    VueElementLoading
  },
  firestore: function() {
    return {
    notes: db.collection("notes")
             .where("owner", "==", auth.currentUser.uid)
             .orderBy("createdAt", "desc"),
    languages: db.collection("languages")
    }
  },
  methods: {
    activateFullScreen () {
      this.fullscreen = true
      setTimeout(() => { this.fullscreen = false
                         location.reload() }, 2000)},
  //   addNewNote: function() {
  //     // note can't be empty
  //     if (this.newNote.length > 0) {
  //     let newNote = {
  //       note: this.newNote,
  //       checked: false,
  //       owner: auth.currentUser.uid,
  //       createdAt: new Date()
  //     };
  //     this.newNote = ""
  //     db.collection("notes").add(newNote)}
  //   },
    deleteNote: function(item) {
      if (auth.currentUser.uid == item.owner){
        db.collection("notes").doc(item.id).delete()
        this.activateFullScreen()
      }
    },
    editNote: function(id){
      alert(id)
      
    },

    likeNote: function(item){
      console.log(item);
        
        if (auth.currentUser.uid == item.owner){
          //let isFav = item.isFavorite ? false : true;
          db.collection('notes').doc(item.id).update({
              //isFavorite: isFav
              isFavorite: !item.isFavorite              
          });

          this.activateFullScreen()
          
        }
    },
    
  //   toggleComplete: function(id) {
  //     db.collection("notes").doc(id).update({
  //       checked: document.getElementById(id).checked
  //     })
  //   },
  //   addNewCategory: function() {
  //     // category can't be empty
  //     if (this.newCategory.length > 0) {
  //     // check if category already exists
  //     let categoryExists = false
  //     this.languages.forEach(cat => {
  //       if (cat.name === this.newCategory) {
  //         categoryExists = true
  //       }
  //     })
  //     if (!categoryExists) {
  //       let newCategory = {
  //         name: this.newCategory,
  //         owner: auth.currentUser.uid,
  //         createdAt: new Date()
  //       }
  //       this.newCategory = ""
  //       db.collection("languages").add(newCategory)
  //     }}
  //   },
  //   deleteCategory: function(id) {
  //     db.collection("languages").doc(id).delete()
  //   }
  // }
  }
}
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";

.question {
  font-family: "Lucida Console", "Courier New", monospace;
  letter-spacing: 2px;
  font-weight: bold;
}

.buttons {
  position: absolute; 
  right: 0px; 
}

.header-container {
  position: relative;
  padding: 2px;
  margin: 33px;
}

.pre, code {
  text-align: left;  
  margin: 0;
}

.my-pre {
  background-color: #292b2e;
  padding: 0;
}

.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}


</style>