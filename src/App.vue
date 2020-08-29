<template>
  <div class="container p-5">
    <AddProducto></AddProducto>
  <ListProducto></ListProducto>
  </div>
</template>

<script>
import AddProducto from './components/Ferreteria/AddProducto.vue'
import ListProducto from './components/Ferreteria/ListProducto.vue'

export default {
  components: {
    AddProducto,
    ListProducto

  }
}
</script>

