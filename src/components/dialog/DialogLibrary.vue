<template>
    <v-dialog
        persistent
        v-model="$store.state.dialog"
        max-width="600"
      >
        <v-card>
          <v-card-title>
            <v-layout row align-center>
              <v-flex xs10>
                <span class="headline">Настройка набора данных</span>
              </v-flex>
              <v-flex xs2>
                <v-btn fab dark small color="red" @click="closeDialog()">
                  <v-icon dark>close</v-icon>
              </v-btn>
            </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider my-2/>
          <v-card-text>
                <v-layout row>
                    <v-flex xs9>
                    <v-text-field
                        v-model="note.name"
                        label="Имя набора данных"
                    ></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs5>
                    <v-btn @click="isLink = !isLink" color="info">Выбрать категорию</v-btn>
                  </v-flex>
                  <v-flex xs7>
                    <v-text-field
                        v-model="note.link"
                        label="Категория"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <span v-if="isLink">
                  <v-divider my-2></v-divider>
                  <v-layout>
                    <v-flex xs12>
                      <v-treeview
                        :items="libraryLink"
                        active-class="primary--text"
                      >
                        <template slot="label" slot-scope="{ item }">
                          <div @click="currentLink(item)">{{ item.name }}</div>
                        </template>
                      </v-treeview>
                    </v-flex>
                  </v-layout>
                  <v-divider></v-divider>
                </span>
                <v-layout row>
                    <v-flex xs6>
                    <v-text-field
                        v-model="note.val1.value"
                        label="Первый порог"
                    ></v-text-field>
                    </v-flex>
                    <v-flex xs6 ml-2>
                    <v-text-field
                    v-model="note.val2.value"
                    label="Второй порог"
                    ></v-text-field>
                </v-flex>
                </v-layout>
                <span v-if="!isLink && !note.link">
                  <v-layout row
                    v-for="(item, i) in note.data"
                    :key="i+'item'">
                    <v-flex xs10>
                    <v-text-field
                        v-model="note.data[i]"
                        mask="#############"
                        label="Значение"
                    ></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                    <v-btn fab outline dark small color="orange" @click="removeRow(i)">
                        <v-icon dark>close</v-icon>
                    </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-btn @click="addField()" color="info">Добавить значение</v-btn>
                </span>
                
          </v-card-text>

          <!-- <v-card-actions>
            <v-btn
              color="error"
              text
              @click="$store.commit('changeDialog',{bool: false})"
            >
              Отменить
            </v-btn>
              <v-spacer></v-spacer>
            <v-btn
              color="success"
              text
              @click="$store.commit('changeDialog',{bool: false})"
            >
              Применить
            </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-dialog>
</template>


<script>
export default {
  data:() => ({
    isLink: false,
  }),
  computed:{
    note() {
      return this.$store.state.currentNote
    },
    libraryLink() {
      return this.$store.state.libraryLink
    },
    // currentLinkName(link) {
    //   let name = '';
    //   this.findName(link)
    //   return name;
    // }
  }, 
  methods: {
    findName() {

    },
    closeDialog() {
      this.isLink = false
      this.$store.commit('changeDialog',{bool: false})
    },
    currentLink(item){
      this.note.link = item.link
    },
    addField () {
      this.note.data.push(0)
    },
    removeRow (i) {
      this.note.data.splice(i, 1)    
    },
  }
}
</script>
