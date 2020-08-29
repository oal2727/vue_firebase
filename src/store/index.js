import Vuex from 'vuex'
import Vue from 'vue'
import {ProductoCollection,storageRef} from '../config/index'


Vue.use(Vuex)


export default new Vuex.Store({
    state:{
        //filename,imageUrl
        producto:{id:null,nombre:'',categoria:null,descripcion:'',precio:'',stock:'',filename:'',imageUrl:''},
        // producto:{id:null,nombre:'',categoria:null,descripcion:'',precio:'',stock:'',file:null,filename:'',imageUrl:''},
       //variable solo referente a imagenes
        imagen:{file:null,image:null},
        filenameold:null,
        productos:[],
        spinnerboolean:true,
    },
    mutations:{
        GET_LISTA(state,payload){
            state.productos=payload
            state.spinnerboolean=false
        },
        ADD_PRODUCTO(state,payload){
            state.productos.push(payload)
        },
        EDIT_PRODUCTO(state,payload){
            state.producto.nombre=payload.nombre
            state.producto.categoria=payload.categoria
            state.producto.descripcion=payload.descripcion
            state.producto.precio=payload.precio
            state.producto.stock=payload.stock
            state.producto.imageUrl=payload.imageUrl
            state.producto.filename=payload.filename
            //edit imageurl
            state.imagen.image=payload.imageUrl
            state.producto.id=payload.id
            state.filenameold=payload.filename
        },
        DELETE_PRODUCT(state,payload){
            console.log('id',payload)
           const arrayData = state.productos.filter(item => {
                return payload !== item.id
            })
            state.productos=arrayData
            
        },
        Cancelar(state){
            state.producto.nombre=""
            state.producto.categoria=null
            state.producto.descripcion=""
            state.producto.precio=""
            state.producto.stock=""
            state.producto.imageUrl=""
            state.producto.id=null
            state.imagen.image=null
        },
        UpdateData(state,payload){
            const dataUpdate = state.productos.map(data => {
                return data.id === payload.id ? payload : data
            })
            state.productos=dataUpdate
        },
        STATE_IMAGE(state){
            state.imagen.image=null
        }
    },
    actions:{
       async  addProducto({commit},data){
            delete data.id 
            try{
                const upload = storageRef.child(`productos/${data.filename}`).put(data.file)
                upload.on('state_changed',function(snapshot){
                          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                          console.log(progress)
                          if(progress == 100){
                              console.log("finalizado")
                              //recordar si no se puede enviar es por el peso de la imagen
                          upload.snapshot.ref.getDownloadURL().then( async function(downloadURL) {
                                //problemas de imagenes con mucho peso 59.58 kb  
                            await  Object.assign(data,{imageUrl:downloadURL})
                                  delete data.file //delete object file
                                 return await  ProductoCollection.add(data).then((docRef)=>{
                                      Object.assign(data,{id:docRef.id})
                                         commit("ADD_PRODUCTO",data)
                                      })
                              });
                          }
                      })  
            }catch(err){
                console.log(err)
            }
         
        },
       async getLista({commit}){
           const dato= await ProductoCollection.get()
           const arrayData = dato.docs.map(doc => ({id:doc.id,...doc.data()}))
           commit('GET_LISTA',arrayData)
        },
        async deleteProducto({commit},item){
            var desertRef = storageRef.child(`productos/${item.filename}`)
            desertRef.delete().then(async()=>{
                await ProductoCollection.doc(item.id).delete().then(()=>{
                    commit("DELETE_PRODUCT",item.id)
                })
            })
           
        },
        async UpdateData({commit,state},data){
            // })
            const param={
                nombre:data.nombre,
                categoria:data.categoria,
                descripcion:data.descripcion,
                filename:data.filename,
                imageUrl:data.imageUrl,
                precio:data.precio,
                stock:data.stock
            }
            try{
                storageRef.child(`productos/${data.filename}`).getDownloadURL().then(onResolve, onReject);
              async function onResolve(){
                  console.log("exist archivo")
                       console.log(param)
                      return await ProductoCollection.doc(data.id).update(param).then(()=>{
                       Object.assign(param,{id:data.id})
                      commit("UpdateData",param)
                     })
                }
                function onReject(){
                    console.log("no existe")
                    var desertRef = storageRef.child(`productos/${state.filenameold}`)
                    desertRef.delete().then(async()=>{
                        const upload = storageRef.child(`productos/${data.filename}`).put(data.file)
                        upload.on('state_changed',function(snapshot){
                                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                  console.log(progress)
                                  if(progress == 100){
                                  upload.snapshot.ref.getDownloadURL().then( async function(downloadURL) {
                                        //problemas de imagenes con mucho peso 59.58 kb  
                                     await Object.assign(param,{imageUrl:downloadURL,id:data.id})
                                           return await ProductoCollection.doc(data.id).update(param).then(()=>{
                                            commit("UpdateData",param)
                                           })
                                      });
                                  }
                              })  
                    })
                }

            
            }catch(err){
                console.log(err)
            }
        },
    // UploadFile({commit,state},param){
    //        console.log("subiendo")
    //             var storageRef = firebase.storage().ref();
    //             //get filename and blob
    //             console.log(param)
    //        const upload = storageRef.child(`productos/${param.filename}`).put(param.file)
    //       upload.on('state_changed',function(snapshot){
    //                 var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                 console.log(progress)
    //                 if(progress == 100){
    //                     //sin funcion asyncrona obtengo la data
    //                 upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    //                         console.log('File available at', downloadURL);
    //                         state.producto.imageUrl=downloadURL;
    //                     });
    //                 }
    //             })  
    //     }
    }
})