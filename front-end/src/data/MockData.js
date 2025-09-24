export function obtenerObjetivos(){
    let objetivos = [
        {
            titulo: "Certificaciones",
            fecha: "12/09/2024",
            descripcion: "El proposito de este objetivo es plasmar si el usuario completo certificaciones.",
            valor: "50",
            usuario: 1
        },
        {
            titulo: "Programación",
            fecha: "13/09/2024",
            descripcion: "Desarrollar aplicación.",
            valor: "13",
            usuario: 1,
        },
        {
            titulo: "Certificaciones",
            fecha: "10/09/2024",
            descripcion: "El proposito de este objetivo es plasmar si el usuario completo certificaciones.",
            valor: "90",
            usuario: 2,
        },
        {
            titulo: "Servicio Tecnico",
            fecha: "19/09/2024",
            descripcion: "Arreglar notebook",
            valor: "50",
            usuario: 2,
        },
       
    ]
    return objetivos;
}


export function obtenerUsario(){
    let usuario = {
        idUsuario: 1,
        name: "Miguel Borja",
        email: "borja@email.com",
        usuarioPassword: "contraseña",
        empleado: 1,
        rol:"admin"

    }
    return usuario;
}
export function obtenerUsuarios(){
    let usuarios =[
        {
            idUsuario: 3,
            name: "Enzo Ranelli",
            email: "enzo@email.com",
            usuarioPassword: "contraseña",
            empleado: 3,
            rol:"admin"
        },
        {
            idUsuario: 2,
            name: "Juan Perez",
            email: "juan@email.com",
            usuarioPassword:"1234",
            empleado: 2,
            rol: "user",
        }
    ]
    return usuarios;
}
export function obtenerUsuarioIdEmpleado(empleado){
    let usuario = obtenerUsuarios().filter((obj)=> obj.empleado === parseInt(empleado));
    
    return usuario;
}


export function obtenerObjetivosID(id){
    console.log("Id obtenido: ",id);

    console.log("Objetivos antes del filtro: ", obtenerObjetivos());
    let objetivos = obtenerObjetivos().filter(obj => obj.usuario === parseInt(id));
    console.log(objetivos); 
    return objetivos;
}
export function obtenerEmpleados(){
    //Seria la tabla empleado
    let usuarios = [
        {
            idEmpleado: 3,
            Nombre:"Enzo Ranelli",
            Area:"Banco BICE",
            puesto:"Operador NOC"
        },
        {
            idEmpleado: 2,
            Nombre:"Juan Perez",
            Area:"Area Tecnica",
            puesto: "Soporte Tecnico"
        }
    ]
    return usuarios;
}


export function obtenerEmpleadoID(id){
    return obtenerEmpleados().filter(obj => obj. idEmpleado === parseInt(id));
}