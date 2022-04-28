<template>
  <div class="json-editor">
    <textarea ref="textarea"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
// 替换主题这里需修改名称
import 'codemirror/theme/idea.css'
import 'codemirror/mode/python/python'
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue()
      if (value !== editorValue) {
        this.editor.setValue(this.value)
      }
    },
    height(value) {
      this.editor.setSize('auto', this.height)
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: 'python',
      theme: "idea", // 主题
      keyMap: "sublime", // 快键键风格
      lineNumbers: true, // 显示行号
      smartIndent: true, // 智能缩进
      indentUnit: 4, // 智能缩进单位为4个空格长度
      indentWithTabs: true, // 使用制表符进行智能缩进
      lineWrapping: true, // 
      // 在行槽中添加行号显示器、折叠器、语法检测器
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"], 
      foldGutter: true, // 启用行槽中的代码折叠
      autofocus: true, // 自动聚焦
      matchBrackets: true, // 匹配结束符号，比如"]、}"
      autoCloseBrackets: true, // 自动闭合符号
      styleActiveLine: true, // 显示选中行的样式
    })
    this.editor.setSize('auto', this.height)
    this.editor.setValue(this.value)
    this.editor.on('change', cm => {
      this.$emit('change', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.editor.getValue()
    }
  },
  watch:{
    value(value) {
      const editorValue = this.editor.getValue()
      if (value !== editorValue) {
        this.editor.setValue(this.value)
      }
    },
    height(value) {
      this.editor.setSize('auto', this.height)
    }
  }
}
</script>

<style scoped>
  .json-editor{
    height: 100%;
    margin-bottom: 10px;
  }
  .json-editor >>> .CodeMirror {
    font-size: 14px;
    overflow-y:auto;
    font-weight:normal
  }
  .json-editor >>> .CodeMirror-scroll{
  }
  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
  }
</style>