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



        <div>
            <button class="button is-info is-light is-small" v-if="mode == 'edit'" @click="Popup" > ✏️ edit </button>
            <button class="button is-white is-small" style="font-size:20px" v-else @click="Popup">➕</button>
        </div>

        <div class="modal " :class="{'is-active': addNotePopup}" >
            <div class="modal-background"></div>
            <div class="modal-content">
                <!-- Any other Bulma elements you want -->
                <div class="modal-content p-4">
                    <div class="card has-background-white">
                        <header class="card-header">
                            <p class="card-header-title is-size-3 is-centered">{{titleText}}</p>
                        </header>

                        <div class="card-content">
                            <p class="title is-size-5 has-text-weight-bold">Progress:</p>
                            <progress
                            class="progress is-info is-medium"
                            v-bind:value="progress"
                            max="100"
                            >
                            {{progress}}
                        </progress>
                        </div>

                        <form @submit.prevent="addNewNote">
                            <div class="field">
                                <label class="label" for="newQuestionTitle">Question Title</label>
                                <div class="control" id="newQuestionTitle">
                                    <input
                                    v-model="question"
                                    class="input"
                                    type="text"
                                    placeholder="Your Question (max length: 30 chars)"
                                    maxlength="30"
                                    />
                                </div>
                            </div>

                            <div class="field">
                                <label class="label" for="newLang">Select a Language</label>
                                <select v-if="this.langs !== false" v-model="lang">
                                    <option style="color:grey;" value=""  selected data-default>--Select a Language--</option>
                                    <option v-for="lang in this.langs" :key="lang.id" :value="lang.lang">
                                        {{lang.lang}}
                                    </option>
                                </select>
                                <div  v-else> LOADING... </div>
                            </div>

                            <div class="field">
                                <label class="label" for="newCode">Code</label>
                                
                                <div class="control" id="newCode">
                                    
                                    <editor :lang="lang.toLowerCase()" :resFail="code" @editCode="editCode" />
                                </div>
                            </div>

                            <footer class="card-footer">
                                <div class="field card-footer-item">
                                    <div class="control">
                                        <button @click="addNotePopup = false" class="button is-link">
                                            {{subBtnText}}
                                        </button>
                                    </div>
                                </div>
                            </footer>

                        </form>

                    </div>
                </div>
            </div>
            <button @click="addNotePopup = false"
                        class="modal-close is-large"
                        aria-label="close">
            </button>
          
        </div>
    </div>
</template>

<script>
import { db,auth} from '@/firebaseConfig'
import Editor from '@/components/EditorBox.vue'
import VueElementLoading from "vue-element-loading";


// import hljs from 'highlight.js'
export default {
  name: 'CreateNewNote',
  components: {
  ///
  Editor,
  ///
VueElementLoading


  },   
  props: {
      'mode': String,
      'note': Object
  },
  data: function() {
    return {
      ///
      //progress: 0,
      addNotePopup: false,

      question: this.note==null ? "" : this.note.question,
      lang: this.note==null ? "" : this.note.lang,
      code: this.note==null ? "" : this.note.code,

      //
      langs: false,

      newQuestion: "",
      newCode: "",
      newLang: "",

      subBtnText: this.mode=="edit" ? "Update" : "Add",
      titleText: this.mode=="edit" ? "Edit Your Note" : "Add a New Note",



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
  firestore: function() {
    return {
        langs: db.collection("languages")
    }
  },
  computed: {
    
    progress() {
      let prog = 0;
      if (this.question !== "") {
        prog = prog + 33;
      }
      if (this.lang !== "") {
        prog = prog + 33;
      }
      if (this.code !== "") {
        prog = prog + 34;
      }
      return prog;
    },
    
  },
  methods: {
    activateFullScreen () {
      this.fullscreen = true
      setTimeout(() => { this.fullscreen = false
                         this.$router.go('/search') }, 2000)},


    close: function(){
          //this.addNotePopup = false;
          
    },
    Popup: function(){
      this.addNotePopup = true;
      //console.log(this.langs);
    },
    addNewNote: function(){
        console.log("question is: " + this.question);
        //w5WB0D28OKR9EdmF2P1U
        //console.log("mode: " + this.mode);
        //console.log("id is: " + this.note.id);
        if (this.mode === 'edit'){
            
            //console.log("in edit");
            if (auth.currentUser.uid == this.note.owner){
                db.collection('notes').doc(this.note.objectID).update({
                    code: this.code,
                    createdAt: new Date(),
                    lang: this.lang,
                    question: this.question
                })
                
            this.activateFullScreen()
            }
        }
        else{
            let newNote = {
                code: this.code,
                createdAt: new Date(),
                lang: this.lang,
                question: this.question,
                owner: auth.currentUser.uid,
                author: auth.currentUser.displayName,
                isFavorite: false,
            }

            db.collection("notes").add(newNote);
            //this.$bind('note', db.collection('notes').doc(this.note.id), {wait: true});
            //this.$emit('note', newNote);
                // setTimeout(() => {
                //     this.$router.go("/seach");
                // },3000)
            this.activateFullScreen()

        }
    },

    editCode: function(newCode){
        console.log("newCode");
        
        this.code = newCode;
    },
  }

}
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";
</style>
