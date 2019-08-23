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
    mounted() {
        this.$store.dispatch('getActiveLibrarys');
    },
    methods: {
        addLib() { // Выбор из списка всех библиотек
            this.$store.state.selected = []
            this.$store.state.currentTree.addLib = false
            this.$store.commit('changeDialogLibrary', { boolAdd: true }) // открытие окна выбора библиотеки
            this.$store.dispatch('getLibrarysList'); // Получение списка библиотек
        },
        createLib() { // Создание новой библиотеки
            this.$store.commit('changeDialogLibrary', { boolCreate: true }) // открытие окна создания-редактирования библиотеки (создание)
        },
        settingLib(obj) { // Редактирование библиотеки
            this.$store.commit('changeDialogLibrary', { boolSetting: true, valueSetting: obj }) // открытие окна создания-редактирования библиотеки (редактирование)
            this.$store.dispatch('getLibrarys', {currentLib: obj}) // получение данных для библиотеки
        }
    },
    computed: {
        librarys() { // Все активные библиотеки
            return this.$store.getters.oldLibrarys
        }
    }
}
</script>

<style>

</style>
