//Pedir los nuevos productos
//
recargarPag=()=>{
  console.log("Cliente recibiendo Producto del servidor");

  /* productos.map(producto=>{

      console.log(producto.titulo);
      console.log(producto.precio);

    })  */

  // Petición HTTP Renderiza lado Servidor

   //fetch("http://localhost:8080/api/productos")
   fetch("https://joakoweb.herokuapp.com/api/productos")
      .then((response) => response.text())
       .then(data=>{
              const productos=JSON.parse(data)
              console.log(productos.productos)

             //Renderiza del lado del cliente usando HandleBard
             //
             let product = () =>productos.productos

             let prodHay=false
             let prodHayUa=false
             let prodHayUu=false

             let usuario=productos.usuario //controla los aciones
                                           //en el frontEnd

             if (product().length != 0) {
               prodHay = true;
              }

              if(prodHay){
                 if(usuario){
                  prodHayUa=true
                  prodHayUu=false
                 }else{
                  prodHayUa=false
                  prodHayUu=true
                 }
              }else{
                prodHayUa=false
                prodHayUu=false
              }

               productoClie = {
                   titulo: "Renderizado de Productos Usando Motor Handlebars",
                   prod: product(),
                   prodHay,
                   prodHayUa,
                   prodHayUu
                   };

                  let template = document.getElementById("handlebTablaProductos").innerHTML;
                    let compile = Handlebars.compile(template);

                    let compiledHTML = compile(productoClie);

                    document.getElementById('rendProd').innerHTML=compiledHTML

                   })  

}
recargarPag()