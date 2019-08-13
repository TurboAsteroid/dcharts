<template>
    <v-dialog
        persistent
        v-model="$store.state.dialogTree"
        max-width="630"
    >
        <v-card>
            <v-card-title>
                <v-layout row align-center>
                    <v-flex xs10>
                        <span class="headline">Список отчетов</span>
                    </v-flex>
                    <v-flex xs2>
                        <v-btn outline fab dark small color="red" @click="closeDialog()">
                            <v-icon dark>close</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-divider my-2/>
            <v-card-text>
                <v-list two-line>
                    <v-layout row 
                    v-for="(item, index) in libraryTree"
                    :key="index"
                    align-center>
                        <v-flex xs10>
                            <v-list-tile
                                :key="item.title"
                                ripple
                                @click="toggle(item)"
                            >
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
                                </v-list-tile-content>

                            </v-list-tile>
                        </v-flex>
                            
                        <v-flex xs2>
                            <v-btn fab outline dark small color="orange" @click="removeRow(index)">
                                <v-icon dark>delete</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    
                </v-list>
            </v-card-text>
            <v-layout row justify-center align-center>
                <!-- <v-flex xs12> -->
                    <v-btn outline dark @click="addTree()" color="info">Создать новый отчет</v-btn>
                <!-- </v-flex> -->
            </v-layout>
        </v-card>
      </v-dialog>
</template>

<script>
export default {
    data: () => ({
    }),
    methods: {
        closeDialog() {
            this.$store.commit('changeDialogTree',{bool: false})
        },
        toggle(item) {
            this.$store.commit('changeDialogTree',{bool: false, value: item})
            this.$store.dispatch('getTree', item.id)
        },
        removeRow (i) {
            let trees = this.libraryTree.splice(i, 1)
            this.$store.dispatch('setTree', { boolDelete: true, deleteTree: trees })
        },
        addTree() { 
            let newTree = {
                // id: parseInt(this.libraryTree[this.libraryTree.length - 1].id) + 1,
                id: '',
                title: '',
                date: '31.07.2019'
            }
            this.$store.commit('changeDialogTree',{bool: false, value: newTree})
            
        }
    },
    computed: {
        libraryTree() {
            return this.$store.state.libraryTree
        }
    }
}
</script>

<style>

</style>
