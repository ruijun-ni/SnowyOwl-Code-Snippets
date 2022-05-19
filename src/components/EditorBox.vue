<template>
    <div class="resFail">
        <div ref="containerFail"  class="resFailCode"></div> 
    </div>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {
    props: {
        'resFail': String,
        'lang': String,},
    data(){
        return {
            editor:null,//文本编辑器
            isSave:true,//文件改动状态，是否保存
            oldValue:'' //保存后的文本
        }
    },
     mounted(){
      this.initEditor();  
    },
    methods:{
        initEditor(){
            let This = this
            // 初始化编辑器，确保dom已经渲染
            this.editor = monaco.editor.create(this.$refs['containerFail'], {
                value :  This.resFail,//编辑器初始显示文字
                language: This.lang,//语言支持自行查阅demo
                automaticLayout: true,//自动布局
                theme:'vs-black' , //官方自带三种主题vs, hc-black, or vs-dark
                fontSize: 14,       //字体大小
                autoIndent:true,//自动布局
                minimap: {
                    enabled: false, // 不要小地图
                },
                foldingStrategy: 'indentation',
            });
            
         
            this.editor.onKeyUp(() => {

                    this.$emit("editCode", this.editor.getValue());
                
                // console.log(this.editor.getValue())
            });
        }
    }
}
</script>

<style  scoped>
.resFail{
    width: 100%;
    height: 100%;
    text-align: left;
}
.resFailCode{
    width: 100%;
    height:  550px;
}


</style>