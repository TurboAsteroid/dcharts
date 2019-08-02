<template>
    <v-container>
        <v-container grid-list-md>
            <v-layout wrap align-center justify-center>
                <v-flex xs2>
                <v-btn @click.stop="addLib()" color="info" block ml-2>Выброр библиотек</v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn @click.stop="createLib()" color="warning" block>Создание библиотеки</v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn color="success" block>Сохранение изменений</v-btn>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
        </v-container>
        
        <dialogAddLibrary/>
        <dialogCreateLibrary/>
        
        <v-container>
            <v-layout wrap>
                <v-flex
                    :key="j+'obj'"
                    v-for="(obj, j) in librarys"
                    xl3 sm6
                >
                    <v-container>
                        <v-card>
                            <v-container>
                                <v-layout row>
                                    <v-flex xs8>
                                    <v-text-field
                                    v-model="obj.name"
                                    label="Имя набора данных"
                                    ></v-text-field>
                                    </v-flex>
                                    <v-flex xs2>
                                    <v-btn fab dark small color="orange">
                                        <v-icon dark>settings</v-icon>
                                    </v-btn>
                                    </v-flex>
                                    <v-flex xs2>
                                    <v-btn fab dark small color="red" @click="removeCol(j)">
                                        <v-icon dark>close</v-icon>
                                    </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-container>
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
        },
        createLib() {
            this.$store.commit('changeDialogLibrary', { boolCreate: true })
        }
    },
    computed: {
        librarys() {
            return this.$store.state.oldLibrarys
        }
    }
}
</script>

<style>

</style>
