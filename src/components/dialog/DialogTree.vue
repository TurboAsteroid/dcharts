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
                    <v-flex xs4>
                        <!-- <v-btn outline dark small @click="addTree()" color="info">Создать новый отчет</v-btn> -->
                    </v-flex>
                    <v-flex xs2>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn outline fab dark small color="grey" @click="closeDialog()" v-on="on">
                                    <v-icon dark>close</v-icon>
                                </v-btn>
                            </template>
                            <span>Отмена</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-divider my-2/>
            <v-card-text>
                <v-list two-line>
                    <v-layout row 
                    v-for="(item, index) in treesLibrary"
                    :key="index"
                    align-center>
                        <v-flex xs12>
                            <v-list-tile
                                :key="item.name"
                                ripple
                                @click="toggle(item)"
                            >
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab outline dark small color="red" @click="removeRow(index, item)" v-on="on">
                                            <v-icon dark>delete</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Удалить отчет</span>
                                </v-tooltip>
                            </v-list-tile>
                            <v-divider v-if="index !== treesLibrary.length - 1"></v-divider>
                        </v-flex>
                            
                        <!-- <v-flex xs2>
                            
                        </v-flex> -->
                    </v-layout>
                    
                </v-list>
            </v-card-text>
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
            this.$store.dispatch('getTree', {treeID: item.id})
        },
        removeRow (i, item) {
            console.log(item)
            let trees = this.treesLibrary.splice(i, 1)
            this.$store.dispatch('deleteTree', {treeID: item.id})
            // this.$store.dispatch('setTree', { boolDelete: true, deleteTree: trees })
        },
        // addTree() { 
        //     let newTree = {
        //         // id: parseInt(this.libraryTree[this.libraryTree.length - 1].id) + 1,
        //         id: '',
        //         title: '',
        //         date: '31.07.2019'
        //     }
        //     this.$store.commit('changeDialogTree',{bool: false, value: newTree})
            
        // }
    },
    computed: {
        treesLibrary() {
            return this.$store.state.treesLibrary
        }
    }
}
</script>

<style>

</style>
