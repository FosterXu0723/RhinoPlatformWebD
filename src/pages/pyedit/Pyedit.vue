<template>
<!--      <Menu>-->
        <div slot="content">
          <CodeMirrorEditor :value="value" :height="height"></CodeMirrorEditor>
        </div>
<!--      </Menu>-->
</template>
<script>
import CodeMirrorEditor from "@/components/common/PyEditor";
import Menu from 'components/common/Menu'
export default {
    components: {
        CodeMirrorEditor,
        Menu
    },
    data() {
        return {
            height: document.documentElement.clientHeight - 210 + 'px',
            value: ""
        };
    },
    methods: {

    }
}
</script>

<style>
.CodeMirror {
    position: absolute;
    top: 80px;
    left: 2px;
    right: 5px;
    bottom: 0px;
    padding: 2px;
    height: auto;
    overflow-y: auto;
}
</style>
