import DataTable from "react-data-table-component";
import SinElementos from "../components/SinElementos";
import axios from 'axios';
import { useState, useEffect } from 'react';
import '../styles/Empleados.css';
import BotonLink from "../components/BotonLink";
import { getApiUrl } from "../config/configURL";
function Empleados(){
    const url = getApiUrl();
    const [empleados, setEmpleados] = useState(null);
    const [error, setError]  =useState(null);
    const [cargando, setCargando] = useState(true);
    const colums = [{
        name: "Nombre",
        selector: row => row.nombre,
        sortable: true,
    },

    {
        name: "Area",
        selector: row => row.area
    },
    {
        name: "Estado de cuenta",
        selector: row => row.activo ? 'Habilitado' : 'Deshabilitado',
        sortable: true,
        id: 'estado',
        sortFunction: (rowA, rowB) => {
            // Ordena primero por las cuentas activas (1) y luego las deshabilitadas (0)
            return rowB.activo - rowA.activo;
        }, 
    },
    {
        name: "",
        cell:(row)=>(
            <BotonLink ruta={row.activo === 0 ?  '/empleados':`/feed/objetivos/${row.idEmpleado}`} style={{
                background: row.activo === 0 ? 'rgb(235, 235, 235)' : '',
                color: row.activo === 0 ? 'gray' : '',
                cursor: row.activo === 0 ? 'no-drop' : ''
              }}>Ver objetivos</BotonLink>
        ),
    },
    {
        name: "",
        cell:(row)=>(
            <BotonLink ruta={row.activo === 0 ? '/empleadoos': `/feed/certificaciones/${row.idEmpleado}`}style={{
                background: row.activo === 0 ? 'rgb(235, 235, 235)' : '',
                color: row.activo === 0 ? 'gray' : '',
                cursor: row.activo === 0 ? 'no-drop' : ''
              }}>Ver certificaciones</BotonLink>
        ),
    },
    {
        name:"",
        cell:(row)=>(
            <BotonLink ruta={`/actualizar-usuario/${row.idEmpleado}`} style={{
                background: row.activo === 0 ? 'gray' : '',
              }}>Administrar cuenta</BotonLink>
        ),
    }]

    const estiloDeshabilitado = [
        {
            when: row => row.activo === 0,
            style: {
                backgroundColor: 'rgb(173, 173, 173)',
                color: 'rgb(104, 104, 104)',
                '&:hover': {                // Estilo en hover
                    backgroundColor: 'rgb(213, 213, 213)', // Fondo al hacer hover
                    cursor: 'pointer', }
            },
        },
    ];

    useEffect(()=>{
        axios.get(`${url}/api/empleados`)
            .then( response => {
                console.log(response)
                setEmpleados(response.data);
                setCargando(false);
            })
            .catch( error => {
                setError(error.message);
                setCargando(false);
            });
        
    },[]);

    if(cargando) return <p>Cargando...</p>
    if(error) return <p>Error: {error}</p>

    return (

        <div>
            <h1 className="titulo">Lista de Empleados</h1>
            <hr className="linea"></hr>
            <DataTable
                columns={colums}
                data={empleados}
                pagination
                highlightOnHover
                striped
                defaultSortAsc={true}
                defaultSortFieldId="estado"
                conditionalRowStyles={estiloDeshabilitado}
                noDataComponent={<SinElementos elemento='empleados'/>}
            />
            
        
        </div>
    );
}

export default Empleados;