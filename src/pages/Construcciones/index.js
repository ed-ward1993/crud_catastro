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
            const limit = 10; // Número de elementos por página
            const offset = (currentPage - 1) * limit;
            // const response = await axios.get(`http://localhost:9000/listContruccion?limit=${limit}&offset=${offset}`);
            const response = await axios.get('http://localhost:9000/listContruccion');
            console.log(response.data);
            setConstruccion(response.data);

            // Calcular el número total de páginas
            const totalElements = response.data.meta.total; // Total de elementos disponibles en la API
            const calculatedTotalPages = Math.ceil(totalElements / limit); // Redondear hacia arriba para obtener el número total de páginas
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [construccion, setConstruccion] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getTipoConstruccion = async () => {
        try {            
            const response = await axios.get('http://localhost:9000/listTipoConstruccion');
            setAllTipoConstruccion(response.data);
            const initialValues = [];
            setSelectedTipoConstruccion(initialValues);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [allTipoConstruccion, setAllTipoConstruccion] = useState([]);
    const [selectedTipoConstruccion, setSelectedTipoConstruccion] = useState([]);

    // manejo de formulario y lista 
    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);
    const [operation, setOperation] = useState(1);

    const openModal = (op, id_construccion, numero_pisos, area_total, direccion_construccion, id_tipo_construccion) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);

        console.log('ID:', id_construccion);
        console.log('numero_pisos:', numero_pisos);
        console.log('area_total:', area_total);
        console.log('direccion_construccion:', direccion_construccion);
        console.log('id_tipo_construccion:', id_tipo_construccion);

        if (op === 1) {
          setFormState({
            numero_pisos: "",
            area_total: "",
            direccion_construccion: "",
            id_tipo_construccion: ""
          });
        } else {
          setFormState({
            id_construccion: id_construccion,
            numero_pisos: numero_pisos,
            area_total: area_total,
            direccion_construccion: direccion_construccion,
            id_tipo_construccion: id_tipo_construccion
          });
        }
        console.log('Form state:', formState);
      };

    // funcion envio de formulario 

    const [formState, setFormState] = useState({
        id_construccion: "",
        numero_pisos: "",
        area_total: "",
        direccion_construccion: "",
        id_tipo_construccion: []
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
    const addConstruccion = () => {
        const apiUrl = 'http://localhost:9000/createConstruccion';

        const newConstruccion = {
           
              numero_pisos: formState.numero_pisos,
              area_total: formState.area_total,
              direccion_construccion: formState.direccion_construccion,
              tiene_construcciones: formState.tiene_construcciones,
              id_tipo_construccion:  {
                  "id": formState.id_tipo_construccion
                },
              estado : true,
      //   price: parseInt(formState.avaluo), 
      
  };
    
      axios
        .post(apiUrl, newConstruccion)
        .then((response) => {
          console.log('Construccion agregado exitosamente:', response.data);
          fetchData();
          setFormState({
            numero_pisos: "",
            area_total: "",
            direccion_construccion: "",
            id_tipo_construccion: []
          });
          setFormSuccess(true);
          setFormSuccessMessage('Construccion agregado exitosamente.');
          setFormulario(false);
          setListado(true);
        })
        .catch((error) => {
          console.error('Error al agregar la Construccion:', error);
          console.log('Detalles del error:', error.response?.data);
          const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
          setFormSuccess(false);
          setFormSuccessMessage('Error al agregar la Construccion.');
          Swal.fire({
            icon: 'error',
            title: errorMessage,
            showConfirmButton: true,
          });
        });
    };
      
    const editConstruccion = () => {
        const apiUrl = `http://localhost:9000/updateConstruccion`;
      
        const updateConstruccion = {
            id_construccion : formState.id_construccion,
            numero_pisos: formState.numero_pisos,
            area_total: formState.area_total,
            direccion_construccion: formState.direccion_construccion,
            tiene_construcciones: formState.tiene_construcciones,
            id_tipo_construccion:  {
                "id": formState.id_tipo_construccion
              },
            estado : true,
        };
      
    console.log('Datos enviados en la petición:', updateConstruccion);          

        axios
          .post(apiUrl, updateConstruccion)
          .then((response) => {
            console.log('Construccion actualizado exitosamente:', response.data);
            fetchData();
            setFormState({
                area: "",
                valor_comercial: "",
                fuentes_agua: "",
                tiene_construcciones: "",
                id_tipo_construccion:[]
            });
            setFormSuccess(true);
            setFormSuccessMessage('Construccion actualizado exitosamente.');
            setFormulario(false);
            setListado(true);
          })
          .catch((error) => {
            console.error('Error al agregar el Construccion:', error);
            console.log('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
            setFormSuccess(false);
            setFormSuccessMessage('Error al agregar el Construccion.');
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
          text: '¿Quieres agregar o editar este producto?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            if (operation === 1) {
              addConstruccion(); // Llama a la función para agregar el producto
            } else if (operation === 2) {
              editConstruccion(); // Llama a la función para editar el producto
            }
          }
        });
      };
      
      const submitForm = (e) => {
        e.preventDefault();
        showConfirmationDialog(); // Muestra el cuadro de diálogo de confirmación antes de agregar o editar el producto
      };

      const inactivar = ( id_construccion, numero_pisos, area_total, direccion_construccion, id_tipo_construccion) => {

        const apiUrl = `http://localhost:9000/deleteConstruccion`;
  
        const deleteConstruccion = {
            id_construccion : id_construccion,
            numero_pisos: numero_pisos,
            area_total: area_total,
            direccion_construccion: direccion_construccion,
            id_tipo_construccion:  {
                "id": id_tipo_construccion
              },
            estado : false,
    };
    console.log('Datos enviados en la petición:', deleteConstruccion);          


    Swal.fire({
        title: "Esta Seguro de eliminar esta Construccion?",
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
    .post(apiUrl, deleteConstruccion)
    .then((response) => {
      console.log('Construccion actualizado exitosamente:', response.data);
    
      setFormSuccess(true);
      setFormSuccessMessage('Construccion eliminado exitosamente.');
      setFormulario(false);
      setListado(true);
      setConstruccion((prevConstruccion) =>
        prevConstruccion.filter((construccion) => construccion.id_construccion !== id_construccion)
      );
    })
    .catch((error) => {
      console.error('Error al eliminar la Construccion:', error);
      console.log('Detalles del error:', error.response?.data);
      const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
      setFormSuccess(false);
      setFormSuccessMessage('Error al eliminar la Construccion.');
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
        getTipoConstruccion();
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
                            Construcciones /
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
                                    className="w-42 px-6 py-3 rounded bg-[#01356A] text-white text-sm font-bold whitespace-nowrap hover:bg-[#001E41] focus:bg-[#001E41] focus:outline-none"
                                    preserveScroll={true}
                                    preserveState={true}>
                                    Nuevo Construcción
                                </button>
                            </div>

                            <div className="overflow-x-auto bg-white rounded shadow">
                                <table className="w-full border text-center text-base font-semibold table-auto whitespace-nowrap">
                                    <thead className="border-t font-medium border-2 border-grey-900">
                                        <tr className="font-bold text-left bg-gray-100">
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                #
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Numero Pisos
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Area Total
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Dirección
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Tipo de Construcción
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
                                        {construccion.map((construc) => (
                                            <tr key={construc.id_construccion} className="hover:bg-gray-50 focus-within:bg-gray-100">
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {/* {index + 1} */}
                                                    {construc.id_construccion}
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium border-r  text-blue-900 whitespace-nowrap ">
                                                    {construc.numero_pisos}
                                                </th>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {construc.area_total}
                                                </td>
                                               
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {construc.direccion_construccion}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {construc.id_tipo_construccion.nombre}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                   
                                                    {construc.estado == true ? (
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
                                                                construc.id_construccion,
                                                                construc.numero_pisos,
                                                                construc.area_total,
                                                                construc.direccion_construccion,
                                                                construc.id_tipo_construccion.id,
                                                            )}>
                                                            <div className='w-6 h-6  '>
                                                                <Icon className="w-6 h-6 text-white fill-current group-hover:text-gray-300 focus:text-gray-600 " name="edit" />
                                                            </div>
                                                        </TableButton>
                                                    </div>
                                                    {construc.estado == true ? (
                                                            <div className='w-8 h-8'>
                                                                <TableButton
                                                                    className='bg-[#CB0E28] hover:bg-[#AE0C22] p-1 '
                                                                    onClick={() => inactivar( 
                                                                        construc.id_construccion,
                                                                        construc.numero_pisos,
                                                                        construc.area_total,
                                                                        construc.direccion_construccion,
                                                                        construc.id_tipo_construccion.id)}>
                                                                    <div className='w-6 h-6  '>
                                                                        <Icon className="w-6 h-6 text-white fill-current group-hover:text-gray-300 focus:text-gray-600 " name="trash" />
                                                                    </div>
                                                                </TableButton>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {/* codigo para activar  */}
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
                                                <div className=" px-3 lg:col-span-2 col-span-6 mb-3">
                                                <InputLabel
                                                    forInput="numero_pisos"
                                                    value="Numero de Pisos"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="numero_pisos"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="numero_pisos"
                                                    value={formState.numero_pisos}
                                                    onChange={handleInput}
                                                    placeholder="Ingrese número predial "
                                                />
                                            </div>
                                            <div className=" px-3 lg:col-span-2 col-span-6 mb-3">
                                                <InputLabel
                                                    forInput="area_total"
                                                    value="Area Total"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="area_total"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="area_total"
                                                    value={formState.area_total}
                                                    onChange={handleInput}
                                                    placeholder="Ingrese número predial "
                                                />
                                            </div>

                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="direccion"
                                                        value="Direccion"
                                                        className="text-sm font-medium"
                                                    />

                                                    <TextInput
                                                        id="direccion"
                                                        type="text"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="direccion_construccion"
                                                        value={formState.direccion_construccion}
                                                        onChange={handleInput}
                                                        placeholder="Direccion de la construccion"
                                                    />
                                                </div>
                                              
                                               
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3" >
                                                <InputLabel
                                                    forInput="tipo_construccion"
                                                    value="Tipo de Construccion"
                                                    className="text-sm font-medium"
                                                />
                                                <DynamicSelect
                                                     multiple={false}
                                                     withIcons={true}
                                                     options={allTipoConstruccion}
                                                     value={formState.id_tipo_construccion}
                                                     valueKey="id"
                                                     labelKey="nombre"
                                                     onChange={(selectedOption) => setFormState({ ...formState, id_tipo_construccion: selectedOption.id })}
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