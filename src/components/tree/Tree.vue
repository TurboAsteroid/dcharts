<template>
  <div class="tree">
    <ul class="tree-list">
      <node-tree v-for="(lib,idx) of treeData" :node="lib" :key="idx"></node-tree>
    </ul>
  </div>
</template>

<script>
import NodeTree from "./NodeTree";

export default {
  props: {
      treeData: Array
},
  components: {
    NodeTree
  },
};
</script>

<style>
.tree-list ul {
  list-style-type: none; /* Убираем маркеры */

}
.tree-list ul {
  padding-left: 20px;
  margin: 5px 0;
}
</style>