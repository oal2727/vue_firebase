<template>
    <div class="mt-5">
    <div class="spinner-border text-primary m-auto justify-content-center" role="status" v-if="spinnerboolean">
  <span class="sr-only m-auto justify-content-center">Loading...</span>
    </div>
    <table class="table table-border" v-else>
    <tr>
    <th>N°</th>
    <th>Nombre Producto</th>
    <th>Categoria Producto</th>
    <th>Precio</th>
    <th>Stock</th>
    <th>Descripcion</th>
    <th>imagen</th>
    <th></th>
    <th></th>
    </tr>
    <tbody v-for="(item,index) in productos" :key="item.id">
    <tr style="align-self:center;align-items: center;">
        <td>{{index+1}}</td>
        <td>{{item.nombre}}</td>
        <td>{{item.categoria}}</td>
        <td>{{item.precio}}</td>
        <td>{{item.stock}}</td>
        <td>{{item.descripcion}}</td>
        <td><img :src="item.imageUrl" style="width:100px;height:100px;"/></td>
        <td></td>
        <button class="btn btn-warning" @click="Editar(item)">Editar</button>
         <button class="btn btn-danger" @click="Delete(item)">Delete</button>
    </tr>
    </tbody>
    </table>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    computed:{
        ...mapState(['productos']),
        ...mapState(['spinnerboolean']),
        ...mapState(['options'])
    },
    created(){
        this.$store.dispatch("getLista")
    },
    methods: {
        Editar(item){
            console.log(item)
            this.$store.commit("STATE_IMAGE")
            this.$store.commit("EDIT_PRODUCTO",item)
        },
        Delete(item){
            this.$store.dispatch("deleteProducto",item)
        }
    }
}
</script>
