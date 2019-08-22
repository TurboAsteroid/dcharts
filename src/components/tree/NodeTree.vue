<template>
  <li class="node-tree">
    
    <div
    class="link title font-weight-regular py-1"
    @click="getCharts(node)"
    >
        <v-layout align-center>
            <v-flex v-if="node.hasOwnProperty('status')">
                <v-icon dark fab :class="currentStatus.iconClass">{{currentStatus.icon}}</v-icon>
            </v-flex>
            <v-flex xs11 ml-2 v-if="node.hasOwnProperty('status')">
                <span style="word-wrap: break-word;">{{ node.name }}</span>
                <v-divider  :class="{ active : node === $store.state.currentDashbord }"></v-divider>
            </v-flex>
            <v-flex xs12 v-else>
                <span >{{ node.name }}</span>
            </v-flex>
        </v-layout>
        
    </div>
   

    <ul v-if="node && node.children && node.children.length">
      <node v-for="(child, idx) in node.children" :node="child" :key="idx"></node>
    </ul>
  </li>
</template>

<script>
export default {
  name: "node",
  props: {
    node: Object
  },
  computed:{
      currentStatus() {
          return this.node.status
      }
  },
  data() {
      return {
          active_el:0,
          activeClass: 'active',
          defaultClass: 'default',
          datacollections: {},
          collections: {},
          backgroundColors: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
      }
  },
  methods:{
    getCharts(i) {
        this.$store.state.currentDashbord = i;
        if(!this.node.source && this.node.data.length && this.node.labels.length) {
            this.datacollections = {}
            this.fillData(Object.assign({},this.node))
            this.$router.push({ 
                path: '/report/' + this.node.id, 
                query: { 
                    obj: this.node ,
                    dataCollections: Object.assign({},this.datacollections)
                } 
            })
        } else if (!this.node.source){
            this.$router.push({ 
                path: '/report/' + this.node.id, 
                query: { 
                    obj: this.node ,
                    dataCollections: null
                } 
            })
        }
    },
    fillData (currentReport) {
        this.datacollections = {
            name: currentReport.name,
            data: currentReport.data,
            children: []
        }
        let collections = {}
        if (currentReport.data && currentReport.data.length) {
            collections = {
                name: currentReport.name,
                data: currentReport.data,
                children: [],
                top: {
                    label: 'Верхний порог',
                    backgroundColor: 'rgba(0, 255, 0, 1)',
                    borderColor: 'rgba(0, 255, 0, 1)',
                    borderWidth: 2,
                    data: Array(currentReport.data.length).fill(currentReport.val2.value),
                    fill: false,
                    type: 'line'
                },
                bot: {
                    label: 'Нижний порог',
                    backgroundColor: 'rgba(255, 0, 0, 1)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 2,
                    data: Array(currentReport.data.length).fill(currentReport.val1.value),
                    fill: false,
                    type: 'line'
                },
                datasets: [
                    {
                        label: currentReport.name,
                        backgroundColor: this.backgroundColors,
                        data: currentReport.data
                    }
                ],
                labels: currentReport.labels || this.datacollections.data
            }
            this.datacollections = JSON.parse(JSON.stringify(collections))
        }
    }
    // getTreeElement (root, path) {
    //     if (path.length > 0 && root.children.length) {
    //         let tmpNode = path.shift()
    //         return this.getTreeElement(root.children.find(element => element.id === tmpNode, this), path)
    //     } else {
    //         return root
    //     }
    // }
    // activate:function(el){
    //     console.log(el)
    // }
  }
};
</script>
<style scoped>
    /* .node-tree {
        margin-left: 5px; 
    } */
    .link {
        text-decoration: none;
        cursor: pointer;
    }
    .active {
        background-color: #2196F3;
        /* border: 1px solid grey; */
    }
    .default {
        background-color: white;
    }
</style>