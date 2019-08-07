<template>
    <v-dialog
        persistent
        v-model="$store.state.dialogCreateSetting"
        max-width="700"
    >
        <v-card>
            <v-card-title>
                <v-layout row align-center v-show="!setting">
                    <v-flex xs8>
                        <span class="headline">Создание библиотеки</span>
                    </v-flex>
                    <v-flex xs2>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn fab dark small color="red" @click="cancel()" v-on="on">
                                    <v-icon dark>close</v-icon>
                                </v-btn>
                            </template>
                            <span>Отменить</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs2>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn fab dark small color="success" @click="createLib()" v-on="on">
                                    <v-icon dark >done</v-icon>
                                </v-btn>
                            </template>
                            <span>Сохранить</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
                <v-layout row align-center v-if="setting">
                    <v-flex xs8>
                        <span class="headline">Редактирование библиотеки</span>
                    </v-flex>
                    <v-flex xs2 v-if="!currentLibrary.source">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn fab dark small color="red" @click="deleteLib()" v-on="on">
                                    <v-icon dark>delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Удалить библиотеку</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs2 v-else>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn fab dark small color="red" @click="cancel()" v-on="on">
                                    <v-icon dark>close</v-icon>
                                </v-btn>
                            </template>
                            <span>Отменить</span>
                        </v-tooltip>
                    </v-flex>
                    <v-flex xs2>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn fab dark small color="success" @click="saveChangeLib()" v-on="on">
                                    <v-icon dark >done</v-icon>
                                </v-btn>
                            </template>
                            <span>Сохранить</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
            </v-card-title>

            <v-divider my-2/>

            <v-card-text>
                <v-layout row>
                    <v-flex xs8>
                        <v-text-field
                        label="Имя библиотеки"
                        v-model="currentLibrary.name"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs4>
                        <v-btn @click="addDataSet()" color="info">Добавить набор</v-btn>
                    </v-flex>
                </v-layout>
                <span>
                    <v-expansion-panel v-model="currentDataSet">
                        <v-expansion-panel-content
                            v-for="(item, i) in currentLibrary.dataSets"
                            :key="i">
                            <template v-slot:actions>
                                <v-layout row>
                                        <span v-if="!item.link_name">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn fab outline dark small color="red" @click="deleteDataSet(i)" v-on="on">
                                                        <v-icon dark>delete</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Удалить набор</span>
                                            </v-tooltip>
                                        </span>
                                        <span>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn fab outline dark small color="orange" @click="settingValue()" v-on="on">
                                                        <v-icon dark>settings</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Настроить</span>
                                            </v-tooltip>
                                        </span>
                                        <span>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn fab outline dark small color="info" @click="''" v-on="on">
                                                        <v-icon dark>format_list_bulleted</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Показатели</span>
                                            </v-tooltip>
                                        </span>
                                </v-layout>
                            </template>
                            <template v-slot:header>
                                <v-layout row align-center>
                                    <v-flex xs10>
                                        <v-text-field
                                        v-model="item.name"
                                        label="Имя набора данных"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </template>
                            <v-divider></v-divider>

                            <v-container>
                                <v-layout row>
                                    <v-flex xs6>
                                        <v-text-field
                                            v-model="item.val1.value"
                                            label="Первый порог"
                                        ></v-text-field>
                                        </v-flex>
                                        <v-flex xs6 ml-2>
                                        <v-text-field
                                        v-model="item.val2.value"
                                        label="Второй порог"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row
                                    v-for="(it, j) in item.data"
                                    :key="j+'item'">
                                    <v-flex xs5>
                                        <v-text-field
                                            v-model="item.data[j]"
                                            mask="#############"
                                            label="Значение"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs5 ml-2>
                                        <v-text-field
                                            v-model="item.labels[j]"
                                            mask="##.##.##"
                                            label=""
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs2>
                                    <v-btn fab outline dark small color="red" @click="removeDataValue(i,j)">
                                        <v-icon dark>close</v-icon>
                                    </v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout row justify-center v-if="!item.link_name">
                                    <v-btn @click="addDataValue(i)" color="info">Добавить значение</v-btn>
                                </v-layout>
                            </v-container>
                            <!-- <v-container v-else-if="list">
                                <v-text-field
                                    v-model="item.val1.value"
                                    label="Первый порог"
                                ></v-text-field>
                                <v-text-field
                                v-model="item.val2.value"
                                label="Второй порог"
                                ></v-text-field>
                            </v-container> -->
                            
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </span>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        currentDataSet: null,
        boolSetting: false,
    }),
    methods: {
        settingValue() {
        },
        cancel() {
            this.currentDataSet = null
            this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false })
        },
        createLib() {
            this.currentDataSet = null
            if(this.currentLibrary.name) {
                this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false, newLibrary: this.currentLibrary })
            }
        },
        deleteLib() {
            this.currentDataSet = null
            this.$store.state.setting = false
            console.log(this.currentLibrary)
            this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false , deleteLibrary: this.currentLibrary})
        },
        saveChangeLib() {
            this.currentDataSet = null
            this.$store.state.setting = false
            this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false })
        },
        addDataSet() {
            this.currentDataSet = null
            this.currentLibrary.dataSet.push({
                id: this.currentLibrary.dataSet.length + 1,
                data: [],
                labels:[],
                name: '',
                val1: {
                    value: 0,
                    label: 'min'
                },
                val2: {
                    value: 0,
                    label: 'max'
                },
                link: '',
                children: [],
                relations: []
            })
        },
        deleteDataSet(i) {
            this.currentLibrary.dataSet.splice(i,1)
        },
        addDataValue(i) {
            this.currentLibrary.dataSet[i].data.push(0)
            this.currentLibrary.dataSet[i].labels.push(0)
        },
        removeDataValue(i,j) {
            this.currentLibrary.dataSet[i].data.splice(j, 1)
            this.currentLibrary.dataSet[i].labels.splice(j, 1)
        }
    },
    computed: {
        currentLibrary() {
            return this.$store.state.currentLibrary
        },
        setting() {
            return this.$store.state.setting
        }
    }
}
</script>

<style>

</style>
