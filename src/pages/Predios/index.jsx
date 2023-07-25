import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import InputLabel from '@components/InputLabel';
import TextInput from '@components/TextInput';
import Icon from '@components/Icon';
import TableButton from '@components/TableButton'
import DynamicSelect from '@components/DynamicSelect';
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';


const index = () => {
    const MySwal = withReactContent(Swal);

    // Función asincrónica para obtener los datos de la API
    const fetchData = async () => {
        try {
            // const limit = 10; // Número de elementos por página
            // const offset = (currentPage - 1) * limit;
            const response = await axios.get('http://localhost:9000/listPredio');  
            console.log('--->',response.data);
            setPredios(response.data);

            // Calcular el número total de páginas
            // const totalElements = response.data.meta.total; // Total de elementos disponibles en la API
            // const calculatedTotalPages = Math.ceil(totalElements / limit); // Redondear hacia arriba para obtener el número total de páginas
            // setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getTerreno = async () => {
            try {            
                const response = await axios.get('http://localhost:9000/listTerreno');
                console.log(response.data);
                setAllTerreno(response.data);
                const initialValues = [];
                setselectedTerreno(initialValues);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const getPropietarios = async () => {
            try {            
                const response = await axios.get('http://localhost:9000/listPropietario');
                console.log(response.data);
                setAllPropietarios(response.data);
                const initialValues = [];
                setselectedPropietarios(initialValues);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const getContrucciones = async () => {
            try {            
                const response = await axios.get('http://localhost:9000/listContruccion');
                console.log(response.data);
                setAllContrucciones(response.data);
                const initialValues = [];
                setselectedContrucciones(initialValues);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const handleChangePropietarios = (selectedOptions) => {
            const selectedPropietarioIDs = selectedOptions.map((option) => option.id);
            setFormState({ ...formState, id_propietario: selectedPropietarioIDs });
        };

    const [allTerreno, setAllTerreno] = useState([]);
    const [selectedPropietarios, setselectedTerreno] = useState([]);

    const [allPropietarios, setAllPropietarios] = useState([]);
    const [selectedTerreno, setselectedPropietarios] = useState([]);

    const [allContrucciones, setAllContrucciones] = useState([]);
    const [selectedContrucciones, setselectedContrucciones] = useState([]);

    const [predios, setPredios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // manejo de formulario y lista 
    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);
    const [operation, setOperation] = useState(1);

    const openModal = (op, numero_predial, avaluo, nombre,  departamento, municipio,id_propietario, id_construccion, id_terreno) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);

        console.log('ID:', numero_predial);
        console.log('Nombre:', nombre);
        console.log('Avaluo:', avaluo);
        console.log('Departamento:', departamento);
        console.log('municipio:', municipio);
        console.log('id_propietario:', id_propietario);
        console.log('id_construccion:', id_construccion);
        console.log('id_terreno:', id_terreno);

        if (op === 1) {
          setFormState({
            numero_predial: "",
            avaluo: "",
            nombre: "",
            departamento: "",
            municipio: "",
            id_propietario:[],
            id_construccion: [],
            id_terreno: []
          });
        } else {
          setFormState({
            numero_predial: numero_predial,
            avaluo: avaluo,
            nombre: nombre,
            departamento: departamento,
            municipio: municipio,
            id_propietario : id_propietario,
            id_construccion: id_construccion,
            id_terreno: id_terreno
          });
        }
        console.log('Form state:', formState);
      };

    // funcion envio de formulario 

    const [formState, setFormState] = useState({
        numero_predial: "",
        avaluo: "",
        nombre: "",
        departamento: "",
        municipio: "",
        id_propietario:[],
        id_construccion: [],
        id_terreno: []
    });

    const [formSuccess, setFormSuccess] = useState(false)
    const [formSuccessMessage, setFormSuccessMessage] = useState("")

    const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
    
        setFormState((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }


    // funcion para agregar y editar 
    const addPredio = () => {
        const apiUrl = 'http://localhost:9000/updatePredio';
      
        let construcciones=[];
        for(let i=0; i<=allContrucciones.length-1; i++){
            if (formState.id_construccion == allContrucciones[i].id_construccion) {
                // console.log('aqui---<',JSON.stringify(allContrucciones[i])); 
                construcciones.push(allContrucciones[i]) ;            
            }
            }
            let propietarios=[];
        for(let i=0; i<=allPropietarios.length-1; i++){
            if (formState.id_propietario == allPropietarios[i].id_propietario) {
                // console.log('aqui---<',JSON.stringify(allPropietarios[i])); 
                propietarios.push(allPropietarios[i]) ;            
            }
            }
         

        const newPredio = {
                avaluo: formState.avaluo,
                nombre: formState.nombre,
                departamento: formState.departamento,
                municipio: formState.municipio,
                estado : true,                 
                terreno:  {
                    "id_terreno": formState.id_terreno
                  }, construcciones,                 
                  propietarios,
        }
        ;
        console.log('Datos enviados en la petición:', JSON.stringify(newPredio)); 
      
        axios
          .post(apiUrl, newPredio)
          .then((response) => {
            console.log('Predio agregado exitosamente:', response.data);
            fetchData();
            setFormState({
                numero_predial: "",
                avaluo: "",
                nombre: "",
                departamento: "",
                municipio: "",
                id_construccion: "",
                id_propietario:"",
                id_terreno: ""
            });
            setFormSuccess(true);
            setFormSuccessMessage('Predio agregado exitosamente.');
            setFormulario(false);
            setListado(true);
          })
          .catch((error) => {
            console.error('Error al agregar la Predio:', error);
            console.log('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
            setFormSuccess(false);
            setFormSuccessMessage('Error al agregar la Predio.');
            Swal.fire({
              icon: 'error',
              title: errorMessage,
              showConfirmButton: true,
            });
          });
      };
      
      const editPredio = () => {
        const apiUrl = `http://localhost:9000/updatePredio`;
        let construcciones=[];
        for(let i=0; i<=allContrucciones.length-1; i++){
            if (formState.id_construccion == allContrucciones[i].id_construccion) {
                // console.log('aqui---<',JSON.stringify(allContrucciones[i])); 
                construcciones.push(allContrucciones[i]) ;            
            }
            }
            let propietarios=[];
        for(let i=0; i<=allPropietarios.length-1; i++){
            if (formState.id_propietario == allPropietarios[i].id_propietario) {
                // console.log('aqui---<',JSON.stringify(allPropietarios[i])); 
                propietarios.push(allPropietarios[i]) ;            
            }
            }
      
        const updatedPredio = {
            numero_predial: formState.numero_predial,
            avaluo: formState.avaluo,
                nombre: formState.nombre,
                departamento: formState.departamento,
                municipio: formState.municipio,
                estado : true,                 
                terreno:  {
                    "id_terreno": formState.id_terreno
                  }, construcciones,                 
                  propietarios,
        };
      
    console.log('Datos enviados en la petición:', updatedPredio);          

        axios
          .post(apiUrl, updatedPredio)
          .then((response) => {
            console.log('Predio actualizado exitosamente:', response.data);
            fetchData();
            setFormState({
               numero_predial: "",
                avaluo: "",
                nombre: "",
                departamento: "",
                municipio: "",
                id_construccion: [],
                id_propietario:[],
                id_terreno: []
            });
            setFormSuccess(true);
            setFormSuccessMessage('Predio actualizado exitosamente.');
            setFormulario(false);
            setListado(true);
          })
          .catch((error) => {
            console.error('Error al agregar el Predio:', error);
            console.log('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
            setFormSuccess(false);
            setFormSuccessMessage('Error al agregar el Predio.');
            Swal.fire({
              icon: 'error',
              title: errorMessage,
              showConfirmButton: true,
            });
          });
      };
      
      const showConfirmationDialog = () => {
        MySwal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres agregar o editar este Predio?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            if (operation === 1) {
              addPredio(); // Llama a la función para agregar el producto
            } else if (operation === 2) {
              editPredio(); // Llama a la función para editar el producto
            }
          }
        });
      };
      
      const submitForm = (e) => {
        e.preventDefault();
        showConfirmationDialog(); // Muestra el cuadro de diálogo de confirmación antes de agregar o editar el producto
      };

      const inactivar = ( numero_predial, avaluo, nombre,  departamento, municipio,id_propietario, id_construccion, id_terreno) => {

        const apiUrl = `http://localhost:9000/deletePredio`;

        let construcciones=[];
        for(let i=0; i<=allContrucciones.length-1; i++){
            if (id_construccion == allContrucciones[i].id_construccion) {
                // console.log('aqui---<',JSON.stringify(allContrucciones[i])); 
                construcciones.push(allContrucciones[i]) ;            
            }
            }
            let propietarios=[];
        for(let i=0; i<=allPropietarios.length-1; i++){
            if (id_propietario == allPropietarios[i].id_propietario) {
                // console.log('aqui---<',JSON.stringify(allPropietarios[i])); 
                propietarios.push(allPropietarios[i]) ;            
            }
            }
  
        const deletePredio = {
            numero_predial: numero_predial,
            avaluo: avaluo,
                nombre: nombre,
                departamento: departamento,
                municipio: municipio,
                estado : false,                 
                terreno:  {
                    "id_terreno": id_terreno
                  }, construcciones,                 
                  propietarios,
            
    };
    console.log('Datos enviados en la petición:', JSON.stringify(deletePredio));          


    Swal.fire({
        title: "Esta Seguro de eliminar este Predio?",
        type: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#059C47',
        cancelButtonColor: '#AE0C22',
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.value) {
    axios
    .post(apiUrl, deletePredio)
    .then((response) => {
      console.log('Predio eliminado exitosamente:', response.data);
    
      setFormSuccess(true);
      setFormSuccessMessage('Predio eliminado exitosamente.');
      setFormulario(false);
      setListado(true);
      setPredios((prevPredios) =>
        prevPredios.filter((predio) => predio.numero_predial !== numero_predial)
      );
    })
    .catch((error) => {
      console.error('Error al eliminar la Predio:', error);
      console.log('Detalles del error:', error.response?.data);
      const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
      setFormSuccess(false);
      setFormSuccessMessage('Error al eliminar la Predio.');
      Swal.fire({
        icon: 'error',
        title: errorMessage,
        showConfirmButton: true,
      });
    });
        } else if (
            // Read more about handling dismissals
            result.dismiss === Swal.DismissReason.cancel
        ) {
        }
        });
       
     };
    // Actualizacion de pagina 

    useEffect(() => {
        fetchData();
        getTerreno();
        getPropietarios();
        getContrucciones();
    }, [currentPage]);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    // volver atras 

    const handleGoBack = () => {
        setFormulario(false);
        setListado(true);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="h-8 py px-2 overflow-hidden shadow-sm sm:rounded-md mb-5 border-[#048fc2] border">
                    <button
                            onClick={handleGoBack}
                            className='text-[#056589] hover:text-[#025574] text-base font-semibold'>
                            Predios /
                            </button>
                        {formulario && operation === 1 && (
                            <span className='text-base text-gray-900'> Crear</span>
                        )}
                        {formulario && operation === 2 && (
                            <span className='text-base text-gray-900'> Editar</span>
                        )}
                    </div>
                </div>



                <div className="max-w-[97%] mx-auto sm:px-6 mb-5">
                    {listado && (
                        <div className="flex-col overflow-hidden shadow-sm sm:rounded-lg ">

                            <div className='max-w-full mx-auto  mb-6'>
                                <button onClick={() => openModal(1)}
                                    className="w-32 px-6 py-3 rounded bg-[#01356A] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41] focus:outline-none"
                                    >
                                    Nuevo Predio
                                </button>
                            </div>

                            <div className="overflow-x-auto bg-white rounded shadow">
                                <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap">
                                    <thead className="border-t font-medium border-2 border-grey-900">
                                        <tr className="font-bold text-left bg-gray-100">
                                            
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Numero Predial
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Avaluo
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Nombre
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Departamento
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Municipio
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Propietarios
                                            </th> 
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Contruccion
                                            </th> 
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Terreno
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Estado
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className='text-left'>
                                        {predios.map((predio, index) => (
                                            <tr key={predio.numero_predial} className="hover:bg-gray-50 focus-within:bg-gray-100">
                                                <td className="whitespace-nowrap border-r px-6 py-4 centrar">
                                                    {/* {index + 1} */}
                                                    {predio.numero_predial}
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium border-r  text-blue-900 whitespace-nowrap ">
                                                    {predio.avaluo}
                                                </th>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {predio.nombre}
                                                </td>
                                               
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {predio.departamento}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {predio.municipio}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                {predio.propietarios[0] ? predio.propietarios[0].id_propietario : 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                {predio.construcciones[0] ? predio.construcciones[0].id_construccion : 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {predio.terreno.area}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    
                                                    {predio.estado == true ? (
                                                            <p>Activo</p>
                                                        ) : (
                                                            <p>Inactivo</p>
                                                        )}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-3 py-2 space-x-2 centrar">

                                                    <div className='w-8 h-8'>
                                                        <TableButton
                                                            className='bg-[#026882] hover:bg-[#003442] p-1 '
                                                            onClick={() => openModal(2,
                                                                predio.numero_predial,
                                                                predio.avaluo,
                                                                predio.nombre,
                                                                predio.departamento,
                                                                predio.municipio,
                                                                predio.propietarios[0] ? predio.propietarios[0].id_propietario : 'N/A',
                                                                predio.construcciones[0] ? predio.construcciones[0].id_construccion : 'N/A',
                                                                predio.terreno.id_terreno
                                                            )}>
                                                            <div className='w-6 h-6  '>
                                                                <Icon className="w-6 h-6 text-white fill-current group-hover:text-gray-300 focus:text-gray-600 " name="edit" />
                                                            </div>
                                                        </TableButton>
                                                    </div>
                                                    {predio.estado == true ? (
                                                            <div className='w-8 h-8'>
                                                                <TableButton
                                                                    className='bg-[#CB0E28] hover:bg-[#AE0C22] p-1 '
                                                                    onClick={() => inactivar( 
                                                                        predio.numero_predial,
                                                                        predio.avaluo,
                                                                        predio.nombre,
                                                                        predio.departamento,
                                                                        predio.municipio,
                                                                        predio.propietarios[0] ? predio.propietarios[0].id_propietario : 'N/A',
                                                                        predio.construcciones[0] ? predio.construcciones[0].id_construccion : 'N/A',
                                                                        predio.terreno.id_terreno
                                                                        )}>
                                                                    <div className='w-6 h-6  '>
                                                                        <Icon className="w-6 h-6 text-white fill-current group-hover:text-gray-300 focus:text-gray-600 " name="trash" />
                                                                    </div>
                                                                </TableButton>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                
                                                            </div>
                                                        )}
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </div>


                            <div className="flex mt-5">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="px-6 py-3 rounded bg-[#01356A] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41] focus:outline-none disabled:bg-gray-400"
                                >
                                    Anterior
                                </button>
                                <div className="flex items-center">
                                    Página {currentPage} de {totalPages}
                                </div>
                                <button
                                    onClick={handleNextPage}
                                    className="px-6 py-3 rounded bg-[#01356A] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41] focus:outline-none"
                                >
                                    Siguiente
                                </button>
                            </div>

                        </div>
                    )}

                    {/* Formulario Crear/Editar*/}
                    {formulario && (
                        <div className="mx-auto my-2 px-4 ">
                            <div className="p-8 rounded shadow">
                                <form name="createForm" >
                                {/* <form name="createForm" onSubmit={save}> */}
                                    {(operation === 1 ||
                                        operation === 2) && (
                                            <div className='w-full p-2 grid grid-cols-6 gap-2'>
                                                <p className="hidden">{operation}</p>
                                                {(operation === 2) && (
                                                    <div className=" px-3 lg:col-span-2 col-span-6 mb-3">
                                                <InputLabel
                                                    forInput="numero_predial"
                                                    value="Numero Predial"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="numero_predial"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="numero_predial"
                                                    value={formState.numero_predial}
                                                    onChange={handleInput}
                                                    placeholder="Ingrese número predial "
                                                    disabled
                                                />
                                            </div>
                                                )}
                                                
                                            <div className=" px-3 lg:col-span-2 col-span-6 mb-3">
                                                <InputLabel
                                                    forInput="avaluo"
                                                    value="Avaluo"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="avaluo"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="avaluo"
                                                    value={formState.avaluo}
                                                    onChange={handleInput}
                                                    placeholder="Ingrese número predial "
                                                />
                                            </div>

                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="nombre"
                                                        value="Nombre"
                                                        className="text-sm font-medium"
                                                    />

                                                    <TextInput
                                                        id="nombre"
                                                        type="text"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="nombre"
                                                        value={formState.nombre}
                                                        onChange={handleInput}
                                                        placeholder="Nombre del cargo"
                                                    />
                                                </div>
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="departamento"
                                                        value="Departamento"
                                                        className="text-sm font-medium"
                                                    />

                                                    <TextInput
                                                        id="departamento"
                                                        type="text"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="departamento"
                                                        value={formState.departamento}
                                                        onChange={handleInput}
                                                        placeholder="departamento"
                                                    />
                                                </div>
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="municipio"
                                                        value="Municipio"
                                                        className="text-sm font-medium"
                                                    />

                                                    <TextInput
                                                        id="municipio"
                                                        type="text"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="municipio"
                                                        value={formState.municipio}
                                                        onChange={handleInput}
                                                        placeholder="municipio "
                                                    />
                                                </div>
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3" >
                                                <InputLabel
                                                    forInput="propietarios"
                                                    value="Propietarios"
                                                    className="text-sm font-medium"
                                                />
                                                <DynamicSelect
                                                    multiple={false}
                                                    withIcons={true}
                                                    options={allPropietarios}
                                                    value={formState.id_propietario} 
                                                    valueKey="id_propietario"
                                                    labelKey="razon_social"
                                                    onChange={(selectedOption) => setFormState({ ...formState, id_propietario: selectedOption.id_propietario })}
                                                    className="mb-5 h-36"
                                                />                                                  
                                            </div>
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3" >
                                                <InputLabel
                                                    forInput="construcciones"
                                                    value="Construcciones"
                                                    className="text-sm font-medium"
                                                />
                                                <DynamicSelect
                                                    multiple={false}
                                                    withIcons={true}
                                                    options={allContrucciones}
                                                    value={formState.id_construccion}
                                                    valueKey="id_construccion"
                                                    labelKey="direccion_construccion"
                                                    onChange={(selectedOption) => setFormState({ ...formState, id_construccion: selectedOption.id_construccion })}
                                                    className="mb-5 h-36"
                                                />                                                  
                                            </div>
                                            
                                            <div className="px-3 lg:col-span-2 col-span-6 mb-3" >
                                                <InputLabel
                                                    forInput="terreno"
                                                    value="Terrreno"
                                                    className="text-sm font-medium"
                                                />
                                                <DynamicSelect
                                                    multiple={false}
                                                    withIcons={true}
                                                    options={allTerreno}
                                                    value={formState.id_terreno}
                                                    valueKey="id_terreno"
                                                    labelKey="id_terreno"
                                                    onChange={(selectedOption) => setFormState({ ...formState, id_terreno: selectedOption.id_terreno })}
                                                    className="mb-5 h-36"
                                                />
                                                  
                                            </div>

                                            </div>
                                        )}

                                    <div className="grid justify-items-stretch">
                                        <div className="mt-4 justify-self-end space-x-2">
                                            <button
                                                onClick={submitForm}
                                                type="submit"
                                                className="px-3 py-2 rounded bg-[#002F65] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41]"
                                            >
                                                {operation === 1 && (
                                                    <div> Guardar</div>
                                                )}
                                                {operation === 2 && (
                                                    <div> Editar</div>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleGoBack}
                                                className="px-3 py-2 rounded bg-[#667379] text-white text-sm font-bold whitespace-nowrap hover:bg-[#595D60] focus:bg-[#6F7477]"
                                            >
                                                Atrás
                                            </button>
                                            
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}
                </div>


            </div>

        </div>
    );
};

export default index;