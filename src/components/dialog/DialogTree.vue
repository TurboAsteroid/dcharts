<template>
<div>
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
                    <v-flex xs4>
                        <!-- <v-btn outline dark small @click="addTree()" color="info">Создать новый отчет</v-btn> -->
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
            <v-card-text>
                <v-list two-line>
                    <v-layout row 
                    v-for="(item, index) in treesLibrary"
                    :key="index"
                    align-center>
                        <v-flex xs12>
                            <v-list-tile
                                :key="item.name"
                                ripple
                                @click="toggle(item)"
                            >
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <!-- <v-alert
                                    v-model="a"
                                    :value="alert"
                                    type="success"
                                    transition="scale-transition"
                                >
                                    This is a success alert.
                                </v-alert> -->
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn fab outline dark small color="red" @click="removeRow(index, item)" v-on="on">
                                            <v-icon dark>delete</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Удалить отчет</span>
                                </v-tooltip>
                            </v-list-tile>
                            <v-divider v-if="index !== treesLibrary.length - 1"></v-divider>
                        </v-flex>
                            
                        <!-- <v-flex xs2>
                            
                        </v-flex> -->
                    </v-layout>
                    
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog 
        v-model="$store.state.dialogAlert" 
        max-width="540px"
        >
        <v-card>
            <v-card-title style="padding: 5px 10px;">
              <v-layout row align-center>
                    <!-- <v-flex xs1>
                        <v-icon large color="red">{{'warning'}}</v-icon>

                    </v-flex> -->
                    <v-flex xs10>
                        <v-text-field
                            :value = currentTree.name
                            label="Имя отчета"
                            readonly
                            class="headline"
                        ></v-text-field>
                    </v-flex>
              </v-layout>
            </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
              <v-layout row align-center justify-center>
                      <v-flex xs1>
                        <v-icon large color="red">{{'warning'}}</v-icon>
                      </v-flex>
                    <v-flex xs11 ml-2>
                        <p class="text-uppercase">
                            В коллекции отсутствуют библиотеки, ИСПОЛЬЗУЕМЫЕ В ОТЧЕТЕ
                        </p>
                        <p class="text-uppercase">
                            Для использования отчета необходимо выбрать недостающие библиотеки
                        </p>
                    </v-flex>
              </v-layout>
          </v-card-text>
          <!-- <v-divider></v-divider> -->
          <v-divider></v-divider>
          <v-card-actions>
            <v-layout>
                <v-flex xs5>
                    <v-btn 
                        outline
                        block
                        small
                        color="primary" 
                        flat 
                        @click="$store.commit('changeDialogTree', {boolAlert: false, bool: true})"
                    >
                        Выбор отчета</v-btn>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs5>
                    <v-btn 
                        outline
                        small
                        block
                        color="success" 
                        flat 
                        @click="$store.commit('changeDialogLibrary', { boolAdd: true })"
                    >
                        Выбор библиотек</v-btn>
                </v-flex>
            </v-layout>
            
          </v-card-actions>
        </v-card>
    </v-dialog>
</div>
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
            this.$store.dispatch('activationTree', {treeID: item.id})
            this.$store.dispatch('getTree', {tree: item})
        },
        removeRow (i, item) {
            let trees = this.treesLibrary.splice(i, 1)
            this.$store.dispatch('deleteTree', {treeID: item.id})
        },
    },
    computed: {
        treesLibrary() {
            return this.$store.state.treesLibrary
        },
        currentTree() {
            return this.$store.state.currentTree
        }
    }
}
</script>

<style>
    .paddingAlert {
        padding-bottom: 0; 
    }
</style>
