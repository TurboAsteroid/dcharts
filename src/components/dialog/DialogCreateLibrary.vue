<template>
    <v-dialog
        persistent
        v-model="$store.state.dialogCreateSetting"
        max-width="900"
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
                        <v-text-field
                        label="Имя библиотеки"
                        v-model="currentLibrary.name"
                        ></v-text-field>
                    </v-flex>
                    <!-- <v-flex xs1 v-if="!currentLibrary.source">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn fab dark small color="red" @click="deleteLib()" v-on="on">
                                    <v-icon dark>delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Удалить библиотеку</span>
                        </v-tooltip>
                    </v-flex> -->
                    <v-flex xs1>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn outline dark small color="red" @click="cancel()" v-on="on">
                                    Отменить
                                </v-btn>
                            </template>
                            <span>Отменить</span>
                        </v-tooltip>
                    </v-flex>
                    <!-- <v-flex xs1></v-flex> -->
                    <v-flex xs3 ml-4>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn outline dark small color="success" @click="saveChangeLib()" v-on="on">
                                    Сохранить библиотеку
                                </v-btn>
                            </template>
                            <span>Сохранить</span>
                        </v-tooltip>
                    </v-flex>
                </v-layout>
            </v-card-title>

            <v-divider my-2/>

            <v-card-text>
                <span>
                    <v-layout row>     
                        <v-flex xs4 mr-2>
                            <v-layout row>
                                <v-toolbar card>
                                    <v-flex xs10>
                                        <span class="headline">Наборы данных</span>
                                    </v-flex>
                                    <v-flex xs2>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn flat outline fab dark small color="orange" @click="addDataSet()" v-on="on">
                                                    <v-icon dark >add</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Новый набор</span>
                                        </v-tooltip>
                                    </v-flex>
                                </v-toolbar>
                            </v-layout>
                            <v-list dense>
                                <v-treeview
                                    :items="currentLibrary.dataSets"
                                    open-all
                                    activatable
                                >
                                <template slot="label" slot-scope="{ item }">
                                    <div class="link" @click="currentItem(item)">{{ item.name }}</div>
                                    <v-divider></v-divider>
                                </template>
                                <!-- <template v-slot:append="{ item }" >
                                    <v-btn flat fab dark small color="red" @click="''" v-on="on">
                                        <v-icon dark>delete</v-icon>
                                    </v-btn>
                                </template> -->
                                </v-treeview>  
                            </v-list>
                        </v-flex>
                        
                        <v-divider vertical></v-divider>

                        <v-flex xs8 mx-2  v-if="Object.keys(currentDataSet).length !== 0">
                            <v-layout row>
                                <v-toolbar card>
                                    <v-flex xs10>
                                        <v-text-field
                                            label="Имя набора данных"
                                            v-model="currentDataSet.name"
                                        >
                                    </v-text-field>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn outline fab dark small color="red" @click="deleteDataSet()" v-on="on">
                                                    <v-icon dark>delete</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Удалить набор</span>
                                        </v-tooltip>
                                    </v-flex>
                                    <v-flex xs1>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn outline fab dark small color="success" @click="''" v-on="on">
                                                    <v-icon dark >done</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Сохранить</span>
                                        </v-tooltip>
                                    </v-flex>
                                </v-toolbar>
                                
                                
                            </v-layout>
                            <v-tabs
                                v-model="tab"
                                grow
                                >
                                <v-tabs-slider color="grey"></v-tabs-slider>
                                <v-tab
                                    v-for="item in items"
                                    :key="item"
                                >
                                    {{ item }}
                                </v-tab>
                            </v-tabs>
                            <v-tabs-items v-model="tab">
                                <v-tab-item
                                    v-for="item in items"
                                    :key="item"
                                >
                                    <v-card flat>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            
                                            <span v-if="item === items[0]  && currentDataSet.val1">
                                                <v-layout row>
                                                    <v-flex xs6>
                                                        <v-text-field
                                                            v-model.number="currentDataSet.val1.value"
                                                            label="Первый порог"
                                                            @keypress="onlyNumber" 
                                                            type="text"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs6 ml-2>
                                                        <v-text-field
                                                            v-model.number="currentDataSet.val2.value"
                                                            label="Второй порог"
                                                            @keypress="onlyNumber" 
                                                            type="text"
                                                        ></v-text-field>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout row
                                                    v-for="(it, j) in currentDataSet.data"
                                                    :key="j + 'item'">
                                                    <v-flex xs6>
                                                        <v-text-field
                                                            v-model.number="currentDataSet.data[j]"
                                                            mask="#############"
                                                            label="Значение"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs6 ml-2>
                                                        <v-text-field
                                                            v-model="currentDataSet.labels[j]"
                                                            mask="##.##.##"
                                                            label="Дата!?"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <!-- <v-flex xs1> -->
                                                        <v-btn fab flat dark small color="grey" @click="removeDataValue(j)">
                                                            <v-icon dark>close</v-icon>
                                                        </v-btn>
                                                    <!-- </v-flex> -->
                                                </v-layout>
                                                <v-divider></v-divider>
                                                <v-layout row justify-center v-if="!currentDataSet.link">
                                                    <v-btn outline @click="addDataValue()" color="grey">Добавить значение</v-btn>
                                                </v-layout>
                                            </span>

                                            <span v-else-if="item === items[1]">
                                                <v-layout row>
                                                    <v-flex xs12>
                                                        <v-list>
                                                            <v-list-tile @click="''" v-for="(indicator, idx) in indicators" :key="idx">
                                                                <v-list-tile-action>
                                                                    <v-checkbox v-model="selected" :value="indicator" color="info"></v-checkbox>
                                                                </v-list-tile-action>

                                                                <v-list-tile-content>
                                                                    <v-list-tile-title>{{indicator.name}}</v-list-tile-title>
                                                                    <!-- <v-list-tile-sub-title>Allow not</v-list-tile-sub-title> -->
                                                                </v-list-tile-content>
                                                                
                                                                <v-btn fab flat dark small color="grey" @click="''">
                                                                    <v-icon dark>close</v-icon>
                                                                </v-btn>
                                                            </v-list-tile>
                                                        </v-list>
                                                    </v-flex>  
                                                </v-layout>
                                            </span>
                                            
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs-items>
                        </v-flex>

                    </v-layout>
                    
                    <!-- <v-expansion-panel v-model="currentDataSet">
                        <v-expansion-panel-content
                            v-for="(item, i) in currentLibrary.dataSets"
                            :key="i">
                            <template v-slot:actions>
                                <v-layout row>
                                        <span v-if="!item.link">
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
                        </v-expansion-panel-content>
                    </v-expansion-panel> -->
                </span>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        selected: [],
        indicators: [
            {
                id: 1,
                name: 'test1',
            },
            {
                id: 2,
                name: 'test2',
            },
            {
                id: 3,
                name: 'test3',
            },
        ],
        currentDataSet: {},
        boolSetting: false,
        tab: null,
        items: ['Настройка значений', 'Показатели']
    }),
    methods: {
        onlyNumber ($event) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
                $event.preventDefault();
            }
        },
        currentItem(item) {
            this.currentDataSet = item
            // console.log(item)
        },
        settingValue() {
        },
        cancel() {
            this.currentDataSet = {}
            this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false })
        },
        createLib() {
            this.currentDataSet = {}
            if(this.currentLibrary.name) {
                this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false, newLibrary: this.currentLibrary })
            }
        },
        deleteLib() {
            this.currentDataSet = null
            this.$store.state.setting = false
            // console.log(this.currentLibrary)
            this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false , deleteLibrary: this.currentLibrary})
        },
        saveChangeLib() {
            this.currentDataSet = {}
            this.$store.state.setting = false
            this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false, changeLibrary: this.currentLibrary })
            this.$store.dispatch('changeLibrarys', {
                changeLibrary: this.currentLibrary,
                library: this.currentLibrary
            })
        },
        addDataSet() {
            let idx = this.currentLibrary.dataSets.push({
                // id: Math.floor(Math.random() * 50000) + 30000, // !!!??? в дереве должны быть разные id
                id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // пусть будет любая строка как id, затем при записи в бд подставлю максимальный id + 1
                datasetID: 0,
                data: [],
                labels:[],
                name: 'Новый набор',
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
                // relations: []
            })
            this.currentDataSet = this.currentLibrary.dataSets[idx - 1]
        },
        deleteDataSet() {     
            this.currentLibrary.dataSets.splice(this.currentLibrary.dataSets.indexOf(x => x.name === this.currentDataSet.name),1)
            this.currentDataSet = {}
        },
        addDataValue() {
            this.currentDataSet.data.push(0)
            this.currentDataSet.labels.push('0')
        },
        removeDataValue(j) {
            this.currentDataSet.data.splice(j, 1)
            this.currentDataSet.labels.splice(j, 1)
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
