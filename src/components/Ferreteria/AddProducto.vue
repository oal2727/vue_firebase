<template>
        <div  class="m-auto" style="width:800px;display:flex;border:1px solid rgba(0,0,0,0.25);height:350px;" >
          <!-- falta editar la puta imagen y uso de spinner y el pdf-->
            <div style="width:300px;height:350px;">
            <img src="https://placekitten.com/300/300"  v-if="imagen.image === null" style="height:350px;"/>
            <!-- true elegir imagen-->
            <!-- false editar imagen -->
             <img :src="imagen.image" style="width:300px;height:null;" v-else/>
          

            <div style="position:absolute;top:53px;margin-left:10px;">
             <i class="fas fa-camera camera"  onClick="document.getElementById('imagen').click()" ></i>
            </div>
                </div>
               <div style="width:400px;margin:auto;align-items:center;">
                  <form @submit.prevent="Agregar" style="padding:10px;">

                       <div class="form-group">
                        <input class="form-control" placeholder="Name Product" v-model="producto.nombre" >
                        </div>
                       
                        <div class="form-group">
                          <select class="form-control" v-model="producto.categoria">
                                 <!-- <option v-for="item in options" :value="item.text" :key="item.id">{{item.text}}</option> -->
                        <option value="null">Seleccione Categoria</option>
                        <option value="Herramienta de Mano">Herramienta de Mano</option>
                        <option value="Lubricantes">Lubricantes</option>
                          </select>
                           <!-- <b-form-select v-model="selected" :options="options"></b-form-select> -->
                        </div>

                        <div class="form-group">
                          <textarea rows="3" class="form-control" placeholder="Ingrese descripcion" v-model="producto.descripcion"/>
                        </div>
                    
                        <div class="d-flex">
                            <div>
                               <input class="form-control" placeholder="Precio" v-model="producto.precio">
                            </div>
                              <div>
                               <input class="form-control" placeholder="Stock" v-model="producto.stock">
                            </div>
                        </div>
                        <input type="file" id="imagen" style="display:none;" @change="UploadImage">

                      <div style="margin-top:10px;" v-if="producto.id == null">
                        <button type="submit" class="btn btn-primary">Agregar</button>
                      </div>
                      <div style="margin-top:10px;" v-else>
                        <button type="submit" class="btn btn-success">Update</button>
                         <button type="submit" @click="Cancelar" class="btn btn-danger">Cancelar</button>
                    </div>
                  </form>
               </div>
        </div>
</template>

<script>
import {mapState} from 'vuex'
import { v4 as uuidv4 } from 'uuid';
  export default {
      computed:{
          ...mapState(['producto']),
          ...mapState(['options']),
          ...mapState(['stateimage']),
          ...mapState(['imagen'])
      },
      data(){
        return{
          image:null
        }
      },
    methods:{
        Agregar(){
            const param={
              nombre:this.producto.nombre,
              categoria:this.producto.categoria,
              descripcion:this.producto.descripcion,
              precio:this.producto.precio,
              stock:this.producto.stock,
              file:this.imagen.file,
              filename:this.producto.filename,
              id:this.producto.id,
         }
            if(this.producto.id == null){
               this.$store.dispatch("addProducto",param).then(()=>{
                  this.$store.commit("Cancelar");
               })
            }else{
               Object.assign(param,{imageUrl:this.producto.imageUrl})
              this.$store.dispatch("UpdateData",param).then(()=>{
                this.$store.commit("Cancelar")
              })
            }
        },
        UploadImage(e){
           let files = e.target.files || e.dataTransfer.files;
           const fileObject = files[0]
           this.imagen.file=files[0]
            this.getFileName(files[0])
            this.$store.commit("STATE_IMAGE") //state image null for add image
           const fileReader = new FileReader()
           fileReader.onload = (e)=>{
            this.imagen.image=e.target.result
           }
            fileReader.readAsDataURL(fileObject)
        },
        Cancelar(){
          this.$store.commit("Cancelar")
        },
        getFileName(files){
          const data = files.name.split(".")[1].toLowerCase()
          const filename = `${uuidv4()}.${data}`
          this.producto.filename=filename
        }
    },
    created(){
      // console.log(this.item)
      // console.log(this.stateimage)
    }
  }
</script>
<style>
.camera{
    font-size:25px;
    opacity:0.5;
    cursor:pointer;
}
.camera:hover{
    color:white;
}
</style>
