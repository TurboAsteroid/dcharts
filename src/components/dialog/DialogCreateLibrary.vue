<template>
    <v-dialog
        persistent
        v-model="$store.state.dialogCreateLibrary"
        max-width="700"
    >
        <v-card>
            <v-card-title>
                <v-layout row align-center>
                    <v-flex xs8>
                    <span class="headline">Создание библиотеки</span>
                    </v-flex>
                    <v-flex xs2>
                        <v-btn fab dark small color="red" @click="cancel()">
                            <v-icon dark>close</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs2>
                        <v-btn fab dark small color="success" @click="createLib()">
                            <v-icon dark >done</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-title>

            <v-divider my-2/>

            <v-card-text>
                <v-layout row>
                    <v-flex xs8>
                        <v-text-field
                        label="Имя библиотеки"
                        v-model="library.name"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs4>
                        <v-btn @click="addDataSet()" color="info">Добавить набор</v-btn>
                    </v-flex>
                </v-layout>
                <span>
                    <v-expansion-panel v-model="currentDataSet">
                        <v-expansion-panel-content
                        v-for="(item, i) in library.dataSet"
                        :key="i">
                            <template v-slot:actions>
                                <v-layout row align-center>
                                    <v-flex xs2 >
                                        <v-btn fab outline dark small color="red" @click="deleteDataSet(i)">
                                            <v-icon dark>delete</v-icon>
                                        </v-btn>
                                    </v-flex>
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
                                            mask="#############"
                                            label=""
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs2>
                                    <v-btn fab outline dark small color="red" @click="removeDataValue(i,j)">
                                        <v-icon dark>close</v-icon>
                                    </v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout row justify-center>
                                    <v-btn @click="addDataValue(i)" color="info">Добавить значение</v-btn>
                                </v-layout>
                            </v-container>
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
        library:{
            id: 0,
            name: 'testLib',
            dataSet:[
                {
                    id: 1,
                    data: [1, 2],
                    labels:[1, 2],
                    name: 'Test1',
                    val1: {
                        value: 1,
                        label: 'min'
                    },
                    val2: {
                        value: 2,
                        label: 'max'
                    },
                    link: '',
                    children: [],
                    relations: []
                },
                {
                    id: 2,
                    data: [1, 2],
                    labels:[1, 2],
                    name: 'Test2',
                    val1: {
                        value: 1,
                        label: 'min'
                    },
                    val2: {
                        value: 2,
                        label: 'max'
                    },
                    link: '',
                    children: [],
                    relations: []
                }
            ]
        }
    }),
    methods: {
        cancel() {
            this.currentDataSet = null
            this.$store.commit('changeDialogLibrary',{ boolCreate: false })
        },
        createLib() {
            this.currentDataSet = null
            this.$store.commit('changeDialogLibrary',{ boolCreate: false, newLibrary: this.library })
        },
        addDataSet() {
            this.currentDataSet = null
            this.library.dataSet.push({
                id: this.library.dataSet.length + 1,
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
            this.library.dataSet.splice(i,1)
        },
        addDataValue(i) {
            this.library.dataSet[i].data.push(0)
            this.library.dataSet[i].labels.push(0)
        },
        removeDataValue(i,j) {
            this.library.dataSet[i].data.splice(j, 1)
            this.library.dataSet[i].labels.splice(j, 1)
        }
    }
}
</script>

<style>

</style>
