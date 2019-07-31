<template>
    <v-dialog
        persistent
        v-model="$store.state.dialogTree"
        max-width="600"
    >
        <v-card>
            <v-card-title>
                <v-layout row align-center>
                    <v-flex xs10>
                        <span class="headline">Список отчетов</span>
                    </v-flex>
                    <v-flex xs2>
                        <v-btn fab dark small color="red" @click="closeDialog()">
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
                                <v-icon dark>close</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    
                </v-list>
            </v-card-text>
            <v-layout row justify-end>
                <v-flex xs3>
                    <v-btn @click="addTree()" color="info">Новый отчет</v-btn>
                </v-flex>
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
            this.treeLibrary.splice(i, 1)    
        },
        addTree() {
            this.treeLibrary.push({
                id: this.treeLibrary.length + 1,
                title: '',
                date: ''
            })
            this.$store.commit('changeDialogTree',{bool: false, value: this.treeLibrary[this.treeLibrary.length - 1]})
            
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
