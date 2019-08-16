<template>
    <v-dialog
        persistent
        v-model="$store.state.dialogAddLibrary"
        max-width="600"
    >
        <v-card>
            <v-card-title>
                <v-layout row align-center>
                    <v-flex xs11>
                    <span class="headline">Выбор библиотек</span>
                    </v-flex>
                    <v-flex xs4>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn flat outline dark small v-on="on" color="success" @click="addLib()">
                                    <!-- <v-icon dark >done</v-icon> -->
                                    Изменить коллекцию
                                </v-btn>
                            </template>
                        <span>Добавить</span>
                        </v-tooltip>
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
            <v-card-title style="padding: 0;">
                <v-layout>
                <v-flex xs1>
                    <v-checkbox
                    v-model="selectAll"
                    color="orange" 
                    style="padding: 10px; margin: 0; height: 0;"></v-checkbox>
                </v-flex>
                </v-layout>
            </v-card-title>
            <v-card-text>
                <v-list two-line>
                    <v-layout row 
                    v-for="(item, index) in librarysList"
                    :key="index"
                    align-center>
                        <v-flex xs12>
                            <v-list-tile
                                @click="''"
                            >
                                <v-list-tile-action>
                                    <v-checkbox
                                        type="checkbox"
                                        color="info"
                                        v-model="$store.state.selected"
                                        :value="item.id"
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
        getSelected(item) {
            if(item.active) {
                console.log('item',item)
                
                this.selected.push(item)
            }
        },
        addLib() {
            
            // console.log(this.selectedLib)
            // console.log(this.selected)
            this.$store.commit('changeDialogLibrary',{ boolAdd: false })
            this.$store.commit('changeDialogTree',{bool: false});

            this.$store.commit('addLibrarys')
            this.$store.dispatch('activationLibrarys');

            // this.$store.commit('addLib', { addLib: this.selectedLibrary})

            // this.$store.dispatch('getLibrarys', {selectedLib: this.selected})
            // this.selected = []
        },
        closeDialog() {
            this.$store.commit('changeDialogLibrary',{ boolAdd: false })
            this.$store.state.selected = this.selectedLib
        }
    },
    computed: {
        selectedLib () {
            // console.log('dsf')
            if(this.librarysList.length) {
                return this.librarysList.filter(l => {
                    return l.active
                }).map(l => {
                    return l.id
                })
            }
        },
        librarysList() {
            return this.$store.state.librarysList
        },
        sel() {
            return this.$store.state.selected
        },
        selectAll: {
            get: function () {
                return this.librarysList ? this.$store.state.selected.length === this.librarysList.length : false
            },
            set: function (value) {
                let selected = [];
                if (value) {
                    this.librarysList.forEach(x => selected.push(x.id))
                }
                this.$store.state.selected = selected;
            }
        }
    }
}
</script>

<style>

</style>
