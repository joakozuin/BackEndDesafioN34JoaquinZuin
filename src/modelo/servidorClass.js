
import  express from 'express'
import  morgan from 'morgan'
import productoRuta from '../rutas/producto.js'
import carritoRuta from '../rutas/carrito.js'
//import apiRuta from '../rutas/index.js'
import {Server as ioServer} from 'socket.io'
import http from 'http'


class Servidor {
  constructor(login) {
    this.app = express();
    this.port = process.env.PORT || "8080";

    this.httpServer = http.createServer(this.app);

    this.io = new ioServer(this.httpServer);

    //Middlewares
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    //this.app.use(express.static(process.cwd() + "\\public"));
    this.app.use(express.urlencoded({ extended: true }));

    // Ruta de la Api en http://localhost:8080/api
    // prefijo, por el tema de versiones de la API
    this.apiCaminos = {
      //api: "/api",
      carritos:'/api/carritos',
      productos: "/api/productos",
    };

    this.usuario(login)

    this.rutas();
    this.manErrores();

    //Websocket
    //
    this.mensajes = [
      {
        email: "Juan@gmail.com",
        fecha: this.calcFechaHora(),
        texto: "Hola que tal...",
      },
      {
        email: "Joaquin@gmail.com",
        fecha: this.calcFechaHora(),
        texto: "Genial...",
      },
    ];

    this.productos=[];

   /*  this.webSocket(); */
  }

  calcFechaHora() {
    const dato = new Date();
    const dia = dato.getDate();
    const mes = dato.getMonth() + 1;
    const ano = dato.getFullYear();
    const hor = dato.getHours();
    const min = dato.getMinutes();
    const seg = dato.getSeconds();
    const fecha = [dia, mes, ano].join("/").toString();
    const hora = [hor, min, seg].join(":").toString();
    return [fecha, hora].join(" ");
  }


  webSocket() {
    this.io.on("connection", (cliente) => {
      console.log(`Nuevo Cliente Conectado id:${cliente.id}`);
      cliente.emit("mensaje", this.mensajes);

      //Modulo CHAT
      //
      cliente.on("nuevoMensaje", (mensaje) => {
        console.log("Nuevo Mensaje: " + mensaje.email);
        console.log("Nuevo Mensaje: " + mensaje.texto);
        
        const mens={
          email: mensaje.email,
          fecha: this.calcFechaHora(),
          texto: mensaje.texto,
        }

        this.mensajes.push(mens);

        /* console.log('Enviando Mensajes al cliente')
        this.io.sockets.emit("mensaje", this.mensajes); */

      });

     //Modulo Productos
     //
     cliente.on("nuevoProducto",(producto)=>{
        
       console.log("Servidor Nuevo Producto Titulo: " + producto.titulo);
       console.log("Servidor Nuevo Producto Precio: " + producto.precio);
       console.log("Servidor Nuevo Producto Thumbnail: " + producto.thumbnail);

       const prod={
          titulo: producto.titulo,
          precio: producto.precio,
          thumbnail:producto.thumbnail
        }

       this.productos.push(prod)

      /*  console.log('Servidor Enviando Producto al cliente')
       this.io.sockets.emit("producto", this.productos); */

    });

        console.log('Enviando Mensajes al cliente')
        this.io.sockets.emit("mensaje", this.mensajes);

        console.log('Servidor Enviando Producto al cliente')
        this.io.sockets.emit("producto", this.productos);

    });

  }

   usuario(login){
    if(login=='admin'){
      console.log('Se ha Conectado un: Administrador')
      console.log('---------------------------------')
      this.app.use(function(reg,res,next){
        global.acceso=true //acceso administrador
        next()
        });

   }else{
     console.log('Se ha Conectado un: Usuario')
     console.log('---------------------------')
      this.app.use(function(reg,res,next){
        global.acceso=false //acceso usuarios
        next()
      });
   }}


  rutas() {
    //this.app.use(this.apiCaminos.api, apiRuta);
    this.app.use(this.apiCaminos.productos, productoRuta);
    this.app.use(this.apiCaminos.carritos, carritoRuta);
  }

  manErrores() {
    this.app.use((err, req, res, next) => {
      res.json({
        Mensage: "Ha ocurrido un error",
        Error: err.message,
        status: err,
      });
      //return next()
    });
  }

  
  escuchando() {
    this.httpServer.listen(this.port, () => {
      console.log(`Servidor respondiendo en el puerto ${this.port}`);
    });
  }
}

export default  Servidor