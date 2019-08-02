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
                    <v-btn fab dark small color="success" @click="closeDialog()">
                        <v-icon dark >done</v-icon>
                    </v-btn>
                </v-flex>
                </v-layout>
            </v-card-title>

            <v-divider my-2/>

            <v-card-text>
                <v-list two-line>
                    <v-layout row 
                    v-for="(item, index) in librarysLinks"
                    :key="index"
                    align-center>
                        <v-flex xs12>
                            <v-list-tile
                                :key="item.title"
                                ripple
                            >
                                <v-list-tile-action>
                                    <v-checkbox
                                        v-model="selectedLibrary"
                                        :value="item"
                                    ></v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
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
        selectedLibrary:[],
        librarysLinks:[
          {
                id: 1,
                title: 'Зарплата',
                source: 'Salary'
          },
          {
                id: 2,
                title: 'Продукция',
                source: 'Production'
          },
        ]
    }),
    methods: {
        closeDialog() {
            this.$store.commit('changeDialogLibrary',{ boolAdd: false })
        },
    }
}
</script>

<style>

</style>
