<template>

    <div class="container">
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
      
      <ais-instant-search
        :search-client="searchClient"
        index-name="notes"
      >

      <div class="columns search-panel">


        <!-- responsive sidebar -->
        <!--<span style="font-size:20px;cursor:pointer" class="is-hidden-tablet" @click="openNav()">&#9776;</span>-->
        <span style="font-size:20px;cursor:pointer" class="open is-hidden-tablet"  @click="openNav()">&#9776;</span>
        <div id="mySidenav" class="sidenav">
          <a href="javascript:void(0)" class="closebtn is-hidden-tablet" @click="closeNav()">&times;</a>
     
          
          <div class="column">
            <div class="search-panel__filters">
              <ais-refinement-list searchable-placeholder="Search Language" attribute="lang" searchable />
            </div>
            
            <ais-toggle-refinement
              attribute="isFavorite"
              label="Favorite"
              class="favorite"
            />

            <div hidden class="search-panel__filters">
              <ais-refinement-list searchable-placeholder="Search Author" attribute="owner" searchable />
            </div>
            
            
            <!--div class="search-panel_textarea" >
              <div v-if="!todoEditMode" @click="todoEditMode=true">
                <div class="card">
                <div class="card-content">
                  <div class="content">
                    {{todoText}}
                  </div>
                </div>
              </div>
              </div>
              <vs-textarea v-else @blur="todoClickOut" class="textarea is-primary" label="TodoList " width="50%" height="50%"/>
            </div-->

            <div class="search-panel_textarea" style="margin-top: 20px;">
              
              <div class="card">
                <header class="card-header">
                   📌 
                  <p class="card-header-title">
                  Todo...
                  </p>
                </header>

                <div class="card-content" >
                    <div v-if="!todoEditMode" @click="todoEditMode=true" class="content" style="min-height: 128px; white-space: break-spaces;">
                        <p v-if="todoTextObj===false">LOADING...</p>
                        <p v-else-if="todoTextObj===null">No Todo Yet...</p>
                        <p v-else>{{todoTextObj.text == "" ? "No Todo Yet..." : todoTextObj.text}}</p>
                    </div>
                 
                    <textarea v-else @blur="todoClickOut" v-model="modifiedTodoText" class="textarea is-primary to-do" placeholder="No Todo Yet.."></textarea>
                </div>
                <!--footer class="card-footer"><p></p></footer-->
              </div>
            </div>

            <!--div class="control">
              <textarea class="textarea has-fixed-size" placeholder="Fixed size textarea"></textarea>
            </div-->

          </div>
          
        </div>
          <!-- main -->
          <div class="column search-panel__results">
            <div class="flex-container">
              <ais-search-box placeholder="Search Question" class="searchbox" />
              <add-note-popup mode='add' :note=null class="add"  />
            </div>
          
            <ais-hits>
                <template v-slot="{ items }">
                  <ul>
                    <li v-for="item in items" :key="item.objectID">
                        <br>
                        <div class="card">
                        
                          <div class="flex-container">
                            <ais-highlight class="question" attribute="question" :hit="item" />
                            <div class="buttons">
                              <button class="button is-danger is-light is-small" @click="deleteNote(item)">🗑️ delete</button>
                              <add-note-popup mode='edit' :note=item />
                              <button class="button is-warning is-light is-small" @click="likeNote(item)">{{item.isFavorite ? "❤️ like" : "🤍 like"}}</button>
                            </div>
                          </div>
                        
                          
                          <div class="card-content">
                          
                              <pre v-highlightjs class="my-pre"><code id="code_content" class="{item.lang.toLowerCase().trim()}" >{{item.code}}</code></pre>
                          
                          </div>

                        </div>
                    </li>
                  </ul>
                </template>
            </ais-hits>

            <ais-configure
            :disjunctive-facets-refinements.camel="{ owner: [authorID] }"
            />
            <div class="pagination"><ais-pagination /></div>
          </div>

        </div>
      </ais-instant-search>
    </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/satellite-min.css';
import AddNotePopup from '@/components/AddNotePopup.vue'
import VueElementLoading from 'vue-element-loading'


export default {
  components: {
  ///
  AddNotePopup,
  ///
  VueElementLoading

  },
  data() {
    return {
      searchClient: algoliasearch(
        'EC7X8HA6MN',
        '662583522869f96d3b027b4862979d05'
      ),
      authorID: auth.currentUser.uid,
      todoEditMode: false,
      todoTextObj: false,
      modifiedTodoText: "",

    //Loading icon Setting
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

    };
  },
  firestore: function(){
    return{
      todoTextObj: db.collection("todoNote").doc(auth.currentUser.uid),
    }
  },
  watch:{
    "todoTextObj" : function(newVal){
        //console.log(newVal.text);
        //console.log(oldVal.text);
        if(newVal != null){
            console.log("todo text obj has new value");
            console.log(newVal);
            if (newVal.text){
                this.modifiedTodoText = newVal.text;
            }
        }
        else{
          //console.log("I am in initial todoNote");
          db.collection("todoNote").doc(auth.currentUser.uid).set({
            text: ""
          });
        }
        
    }
  },
  methods: {
    activateFullScreen () {
      this.fullscreen = true
      setTimeout(() => { this.fullscreen = false
                        location.reload()}, 2000)

    },

    deleteNote: function(item) {
      if (auth.currentUser.uid == item.owner){
        db.collection("notes").doc(item.objectID).delete()
      }
      this.activateFullScreen()

    },
    likeNote: function(item){
      console.log(item);
        
      if (auth.currentUser.uid == item.owner){
        console.log("in like");
        //let isFav = item.isFavorite ? false : true;
        db.collection('notes').doc(item.objectID).update({
            //isFavorite: isFav
            isFavorite: !item.isFavorite
        });
        this.activateFullScreen()

        
      }
    },
    todoClickOut: function(){
      this.todoEditMode = false;
      /**
      if (this.modifiedTodoText == ""){
          this.modifiedTodoText == "No Todo Yet..."
      }
      */
      console.log("in saving function");
    
      db.collection("todoNote").doc(auth.currentUser.uid).set({
          text: this.modifiedTodoText
      });

      this.$bind('todoTextObj', db.collection('todoNote').doc(auth.currentUser.uid), {wait: true});
      console.log(this.todoTextObj);
      /**
      this.todoTextObj.get()
        .then((res)=>{
            
            if (!res.exists){
              this.todoTextObj.set({
                text: this.modifiedTodoText
              });
              console.log("create!");
            }
            else{
              console.log("waiting to update...");
              
            }
            this.$bind('todoTextObj', db.collection('todoNote').doc(auth.currentUser.uid), {wait: true});
        });
      */
      
    },
    openNav: function() {
      // responsive sidebar
      console.log("sidebar opened");
      document.getElementById("mySidenav").style.width = "250px";
    },
    closeNav: function() {
      console.log("sidebar closed");
      document.getElementById("mySidenav").style.width = "0";
    },
  }
};


</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";

body {
  font-family: sans-serif;
  padding: 1em;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-panel {
  display: flex;
  min-height: 450px;
}

.search-panel__filters {
  flex: 1;
  margin-right: 1em;
}
.search-panel_textarea{
  flex:1;

}
.search-panel__results {
  flex: 3;
  margin-left: 280px;
}

.searchbox {
  margin-bottom: 2rem;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}

.question {
  font-family: "Lucida Console", "Courier New", monospace;
  font-size: 24px;
  letter-spacing: 1px;
  font-weight: bold;
  text-align: center;  
  margin-top: 5px;
  flex: 60%;
}

.buttons {
  flex: 40%;
}

@media (max-width: 1100px) {
  .question, .buttons {
    flex: 100%;
  }
}

.button {
  margin: 7px;
}

.pre, code {
  text-align: left;  
  margin: 0;
}

.hljs {
  padding: 0;
}

#code_content {
  overflow: hidden;
  white-space: break-spaces;
}



.my-pre {
  text-overflow: ellipsis; 
  background-color: #292b2e;
  white-space: normal;
  
}

.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 10px 20px 0 rgba(0,0,0,0.2);
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

.searchbox {
  flex: 85%;
}

.add {
  flex: 15%;
  margin-top: -12px;
}

@media (max-width: 768px) {
  .question {
    font-size: 18px;
  }
  .search-panel__results {
    margin-left: 0;
  }
  #mySidenav {
    width: 0;
  }
}

@media (min-width: 769px) {
  #mySidenav {
    width: 250px;
  }
}

.to-do {
  overflow-y: hidden;
}

.container {
  padding: 0;
}

.card-content {
  padding: 10px;
}

/* responsive sidebar */
.sidenav {
  height: 100%;
  width: 250px;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: whitesmoke;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  /*display: block;*/
  transition: 0.3s;
}

.sidenav a:hover {
  color: rgb(39, 23, 23);
}

.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

.open {
  margin-top: -40px;
}

.favorite {
  position: relative;
  left: 0;
}


.ais-ToggleRefinement-label {
    display: block;
}

.ais-ToggleRefinement-count {
  display: none;
}

input[type=checkbox], input[type=radio] {
    vertical-align: text-bottom;
}

</style>
