<template>
    <v-dialog
        persistent
        v-model="dialog"
        max-width="930"
    >
        <v-card class="dialogHeight">
            <v-card-title>
                <v-layout row align-center >
                    <v-flex xs6>
                        <v-text-field
                        label="Имя библиотеки"
                        v-model="currentLibrary.name"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs6 v-if="$store.state.dialogSetting">
                        <v-layout row justify-end align-center>
                            <v-flex xs5 v-if="!currentLibrary.source">
                                <v-btn outline dark small color="red" @click="deleteLib()">
                                    Удалить библиотеку
                                </v-btn>
                            </v-flex>
                            <v-flex xs5>
                                <v-btn outline dark small color="success" @click="saveChangeLib()">
                                    Сохранить библиотеку
                                </v-btn>
                            </v-flex>
                            <v-flex ml-3 xs2>
                                <v-btn fab outline dark small color="grey" @click="cancel()">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs6 v-else-if="$store.state.dialogCreate">
                        <v-layout row justify-end align-center>
                            
                            <v-flex xs5>
                                <v-btn outline dark small color="success" @click="createLib()">
                                    Создать библиотеку
                                </v-btn>
                            </v-flex>
                            <v-flex xs2>
                                <v-btn fab outline dark small color="grey" @click="cancel()">
                                    <v-icon>close</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card-title>

            <v-divider my-2/>

            <v-card-text>
                <span >
                    <v-layout row >     
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
                            <v-list dense class="listHeight">
                                <v-treeview
                                    open-all
                                    :items="currentLibrary.dataSets"
                                    activatable
                                >
                                    <template slot="label" slot-scope="{ item }">
                                        <div class="link" @click="currentItem(item)">{{ item.name }}</div>
                                        <v-divider v-if="currentLibrary.dataSets"></v-divider>
                                    </template>
                                </v-treeview> 
                                
                            </v-list>
                            <!-- <v-divider></v-divider>  -->
                        </v-flex>
                        
                        <v-divider vertical></v-divider>

                        <v-flex xs8 ml-2  v-if="Object.keys(currentDataSet).length !== 0">
                            <v-layout row>
                                <v-toolbar card mx-0 >
                                    <v-flex xs10>
                                        <v-text-field
                                            label="Имя набора данных"
                                            v-model="currentDataSet.name"
                                        >
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs1></v-flex>
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
                                                <v-divider></v-divider>
                                                <v-layout mt-1 class="maxHeight">
                                                    <v-flex xs12>
                                                        <!-- <transition-group name="item" tag="div" class="items"> -->
                                                        <v-layout row
                                                            v-for="(it, j) in currentDataSet.data"
                                                            :key="j + 'item'"
                                                        >
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
                                                                <v-btn fab flat dark small color="red" @click="removeDataValue(j)">
                                                                    <v-icon dark>close</v-icon>
                                                                </v-btn>
                                                            <!-- </v-flex> -->
                                                        </v-layout>
                                                        <!-- </transition-group> -->
                                                    </v-flex>
                                                
                                                </v-layout>
                                                
                                                <v-divider v-if="!currentDataSet.link"></v-divider>
                                                <v-layout row justify-center v-if="!currentDataSet.link">
                                                    <v-btn outline @click="addDataValue()" color="info">Добавить значение</v-btn>
                                                </v-layout>
                                            </span>

                                            <span v-else-if="item === items[1]">
                                                <v-layout row>
                                                    <v-flex xs12>
                                                        <v-list v-for="(indicator, idx) in indicators" :key="idx">
                                                            <v-list-tile @click="''" >
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
                                                            <v-divider></v-divider>
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
        deleteDataSetsID: [],
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
            this.deleteDataSetsID = []
            this.$store.state.dialogSetting ? this.$store.commit('changeDialogLibrary',{ boolSetting: false})
             : this.$store.commit('changeDialogLibrary',{ boolCreate: false })
            // this.$store.commit('changeDialogLibrary',{ boolSetting: false, boolCreate: false })
        },
        createLib() {
            this.currentDataSet = {}
            // if(this.currentLibrary.name) {
            //     this.$store.commit('changeDialogLibrary',{ boolCreateSetting: false, newLibrary: this.currentLibrary })
            // }
            if(this.currentLibrary.name){
                this.$store.dispatch('changeLibrarys', {
                    library: this.currentLibrary
                })
            }
        },
        deleteLib() {
            this.currentDataSet = {}
            this.$store.state.dialogSetting = false
            this.$store.dispatch('deleteLibrarysOrDataSets', {libID: parseInt(this.currentLibrary.id)})
        },
        saveChangeLib() {
            this.currentDataSet = {}
            this.$store.state.setting = false
            this.$store.dispatch('changeLibrarys', {
                library: this.currentLibrary
            })
            if(this.deleteDataSetsID.length) {
                this.$store.dispatch('deleteLibrarysOrDataSets', {datasetID: this.deleteDataSetsID})
                this.deleteDataSetsID = []
            }
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
            this.currentLibrary.dataSets.splice(this.currentLibrary.dataSets.findIndex(x => x.id === this.currentDataSet.id), 1)
            // console.log(this.currentDataSet)
            if(this.currentDataSet.datasetID === null) {
                this.deleteDataSetsID.push(parseInt(this.currentDataSet.id))
            } else if (this.currentDataSet.datasetID !== 0) {
                this.deleteDataSetsID.push(parseInt(this.currentDataSet.datasetID))
            }
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
        dialog() {
            return this.$store.state.dialogSetting || this.$store.state.dialogCreate
        },
        currentLibrary() {
            return this.$store.state.currentLibrary
        },
        // setting() {
        //     return this.$store.state.setting
        // },
        // create() {
        //     return this.$store.state.create
        // },
    }
}
</script>

<style>
.maxHeight{
    height: 440px;
    max-height: 440px;
    overflow-y: auto;
}
.dialogHeight {
    height: 843px;
}
.listHeight {
    height: 640px;
    max-height: 640px;
    overflow-y: auto;
}

/* .item-enter-active,
.item-leave-active {
  transition: height .5s;
}
.item-enter,
.item-leave-to {
  height: 0;
  margin: 0;
  border: 0;
} */
</style>