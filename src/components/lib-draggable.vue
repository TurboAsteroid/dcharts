<template>
    <draggable
            :list="tasks"
            :group="{ name: 'g1', pull: 'clone', put: false }"
    >
        <v-card style="margin: 16px"
                class="list-group-item"
                v-for="obj in tasks"
                :key="obj.name"
        >
            <v-container>
                {{ obj.name }}
            </v-container>
        </v-card>
    </draggable>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  props: {
    tasks: {
      required: true,
      type: Array
    }
  },
  components: {
    draggable
  },
  name: 'lib-draggable'
}
</script>
<style scoped>
    .dragArea {
        min-height: 50px;
        outline: 1px dashed;
    }
</style>
