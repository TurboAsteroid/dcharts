<template>
    <v-container>
        <v-container grid-list-md>
            <v-layout wrap align-center justify-center>
                <v-flex xs2>
                    <v-btn @click.stop="addLib()" color="info" block ml-2>Выбор библиотек</v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn @click.stop="createLib()" color="warning" block>Создание библиотеки</v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn color="success" block>Сохранение коллекции</v-btn>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
        </v-container>
        
        <dialogCreateLibrary/>
        <dialogAddLibrary/>
        
        <v-container>
            <v-layout wrap row>
                <v-flex
                    :key="j+'obj'"
                    v-for="(obj, j) in librarys"
                    xl3 sm6
                >
                <v-container>
                    <v-card>
                        <v-card-title>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field
                                        :value = obj.name
                                        readonly
                                        class="title"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-card-title>
                        
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-layout row align-center justify-center>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <v-btn depressed dark small color="orange" @click="settingLib(obj)" v-on="on">
                                                <v-icon dark>settings</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Редактировать</span>
                                    </v-tooltip>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-container>
        
    </v-container>
</template>

<script>
import dialogAddLibrary from './dialog/DialogAddLibrary'
import dialogCreateLibrary from './dialog/DialogCreateLibrary'

export default {
    components:{
        dialogAddLibrary,
        dialogCreateLibrary
    },
    methods: {
        addLib() {
            this.$store.commit('changeDialogLibrary', { boolAdd: true })
            this.$store.dispatch('getLibrarysList');
        },
        createLib() {
            this.$store.commit('changeDialogLibrary', { boolCreate: true })
            // this.$store.commit('changeDialogLibrary', { boolCreateSetting: true })
        },
        settingLib(obj) {
            this.$store.commit('changeDialogLibrary', { boolSetting: true, valueSetting: obj })
            // this.$store.commit('changeDialogLibrary', { boolCreateSetting: true, valueSetting: obj })
            this.$store.dispatch('getLibrarys', {currentLib: obj})
        },
        closeLib(j, obj) {
            obj.active = false;
            this.$store.state.activeLib[this.$store.state.activeLib.findIndex(x => x.id === obj.id)].active = 0;
            // console.log(this.$store.state.selected.findIndex(x => x === obj.id))
            this.$store.state.selected.splice(this.$store.state.selected.findIndex(x => x === obj.id), 1)
            this.librarys.splice(j, 1);
            this.$store.dispatch('activationLibrarys');
        }
    },
    computed: {
        librarys() {
            return this.$store.getters.oldLibrarys
        }
    }
}
</script>

<style>

</style>
