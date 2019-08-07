<template>
    <v-dialog
        persistent
        v-model="$store.state.dialogAddLibrary"
        max-width="600"
    >
        <v-card>
            <v-card-title>
                <v-layout row align-center>
                    <v-flex xs10>
                    <span class="headline">Выбор библиотек</span>
                    </v-flex>
                    <v-flex xs2>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn flat outline fab dark small v-on="on" color="success" @click="addLib()">
                                    <v-icon dark >done</v-icon>
                                </v-btn>
                            </template>
                      <span>Добавить</span>
                    </v-tooltip>
                </v-flex>
                </v-layout>
            </v-card-title>

            <v-divider my-2/>

            <v-card-text>
                <v-list two-line>
                    <v-layout row 
                    v-for="(item, index) in librarysList"
                    :key="index"
                    align-center>
                        <v-flex xs12>
                            <v-list-tile
                                ripple
                            >
                                <v-list-tile-action>
                                    <v-checkbox
                                        v-model="selected"
                                        :value="item"
                                    ></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider v-if="index != librarysList.length - 1"></v-divider>
                        </v-flex>
                    </v-layout>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data:() => ({
        selected: []
    }),
    methods: {
        addLib() {
            this.$store.commit('changeDialogLibrary',{ boolAdd: false })
            
            // this.$store.commit('addLib', { addLib: this.selectedLibrary})

            this.$store.dispatch('getLibrarys', {selectedLib: this.selected})
            this.selected = []
        },
    },
    computed: {
        librarysList() {
            return this.$store.state.librarysList
        },
    }
}
</script>

<style>

</style>
