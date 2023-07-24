import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import InputLabel from '@components/InputLabel';
import TextInput from '@components/TextInput';
import Icon from '@components/Icon';
import TableButton from '@components/TableButton'
import DynamicSelect from '@components/DynamicSelect';
import SelectInput from '@components/SelectInput';
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';



const index = () => {
    const MySwal = withReactContent(Swal);

    // Función asincrónica para obtener los datos de la API
    const fetchData = async () => {
        try {
            const limit = 10; // Número de elementos por página
            const offset = (currentPage - 1) * limit;
            const response = await axios.get('http://localhost:9000/listTerreno');
            console.log(response.data);
            // const response = await axios.get(`https://api.escuelajs.co/api/v1/products?limit=${limit}&offset=${offset}`);
            setTerrenos(response.data);

            // Calcular el número total de páginas
            const totalElements = response.data.meta.total; // Total de elementos disponibles en la API
            const calculatedTotalPages = Math.ceil(totalElements / limit); // Redondear hacia arriba para obtener el número total de páginas
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getTipoTerreno = async () => {
        try {            
            const response = await axios.get('http://localhost:9000/listTipoTerreno');
            setAllTipoTerreno(response.data);
            const initialValues = [];
            setSelectedTipoTerreno(initialValues);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [allTipoTerreno, setAllTipoTerreno] = useState([]);
    const [selectedTipoTerreno, setSelectedTipoTerreno] = useState([]);
    const [terrenos, setTerrenos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

   

    // manejo de formulario y lista 
    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);
    const [operation, setOperation] = useState(1);

    const openModal = (op, id_terreno , area, valor_comercial, fuentes_agua, tiene_construcciones,tipo_terreno) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);

        console.log('ID:', id_terreno);
        console.log('area:', area);
        console.log('valor_comercial:', valor_comercial);
        console.log('fuentes_agua:', fuentes_agua);
        console.log('tiene_construcciones:', tiene_construcciones);
        console.log('tipo_terreno:', tipo_terreno);

        if (op === 1) {
          setFormState({
            area: "",
            valor_comercial: "",
            fuentes_agua: "",
            tiene_construcciones: "",
            tipo_terreno: ""
           
          });
        } else {
          setFormState({
            id_terreno: id_terreno,
            area: area,
            valor_comercial: valor_comercial,
            fuentes_agua: fuentes_agua,
            tiene_construcciones: tiene_construcciones,
            tipo_terreno: tipo_terreno

           
          });
        }
        console.log('Form state:', formState);
      };

    // funcion envio de formulario 

    const [formState, setFormState] = useState({
        id_terreno:"",
        area: "",
        valor_comercial: "",
        fuentes_agua: "",
        tiene_construcciones: "",
        tipo_terreno:[]
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
    const addTerrenono = () => {
        const apiUrl = 'http://localhost:9000/createTerreno';

          const newTerreno = {
             
                area: formState.area,
                valor_comercial: formState.valor_comercial,
                cerca_fuentes_agua: formState.fuentes_agua,
                tiene_construcciones: formState.tiene_construcciones,
                tipo_terreno:  {
                    "id": formState.tipo_terreno
                  },
                estado : true,
        //   price: parseInt(formState.avaluo), 
        
    };
      
        axios
          .post(apiUrl, newTerreno)
          .then((response) => {
            console.log('Terreno agregado exitosamente:', response.data);
            fetchData();
            setFormState({
                area: "",
                valor_comercial: "",
                fuentes_agua: "",
                tiene_construcciones: "",
                tipo_terreno:[]
            });
            setFormSuccess(true);
            setFormSuccessMessage('Terreno agregado exitosamente.');
            setFormulario(false);
            setListado(true);
          })
          .catch((error) => {
            console.error('Error al agregar la terreno:', error);
            console.log('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
            setFormSuccess(false);
            setFormSuccessMessage('Error al agregar la terreno.');
            Swal.fire({
              icon: 'error',
              title: errorMessage,
              showConfirmButton: true,
            });
          });
      };
      
      const editTerreno = () => {
        const apiUrl = `http://localhost:9000/updateTerreno`;
      
        const updatedTerreno = {
            id_terreno : formState.id_terreno,
            area: formState.area,
            valor_comercial: formState.valor_comercial,
            cerca_fuentes_agua: formState.fuentes_agua,
            tiene_construcciones: formState.tiene_construcciones,
            tipo_terreno:  {
                "id": formState.tipo_terreno
              },
            estado : true,
        };
      
    console.log('Datos enviados en la petición:', updatedTerreno);          

        axios
          .post(apiUrl, updatedTerreno)
          .then((response) => {
            console.log('Terreno actualizado exitosamente:', response.data);
            fetchData();
            setFormState({
                area: "",
                valor_comercial: "",
                fuentes_agua: "",
                tiene_construcciones: "",
                tipo_terreno:[]
            });
            setFormSuccess(true);
            setFormSuccessMessage('Terreno actualizado exitosamente.');
            setFormulario(false);
            setListado(true);
          })
          .catch((error) => {
            console.error('Error al agregar el terreno:', error);
            console.log('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
            setFormSuccess(false);
            setFormSuccessMessage('Error al agregar el terreno.');
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
              addTerrenono(); // Llama a la función para agregar el producto
            } else if (operation === 2) {
              editTerreno(); // Llama a la función para editar el producto
            }
          }
        });
      };
      
      const submitForm = (e) => {
        e.preventDefault();
        showConfirmationDialog(); // Muestra el cuadro de diálogo de confirmación antes de agregar o editar el producto
      };

      const inactivar = ( id_terreno, area, valor_comercial, fuentes_agua, tiene_construcciones,tipo_terreno) => {

        const apiUrl = `http://localhost:9000/deleteTerreno`;
  
        const deleteTerreno = {
            id_terreno : id_terreno,
            area: area,
            valor_comercial: valor_comercial,
            cerca_fuentes_agua: fuentes_agua,
            tiene_construcciones: tiene_construcciones,
            tipo_terreno:  {
                "id": tipo_terreno
              },
            estado : false,
    };
    console.log('Datos enviados en la petición:', deleteTerreno);          


    Swal.fire({
        title: "Esta Seguro de eliminar este Terreno?",
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
    .post(apiUrl, deleteTerreno)
    .then((response) => {
      console.log('Terreno actualizado exitosamente:', response.data);
    
      setFormSuccess(true);
      setFormSuccessMessage('Terreno eliminado exitosamente.');
      setFormulario(false);
      setListado(true);
      setTerrenos((prevTerrenos) =>
        prevTerrenos.filter((terreno) => terreno.id_terreno !== id_terreno)
      );
    })
    .catch((error) => {
      console.error('Error al eliminar la Terreno:', error);
      console.log('Detalles del error:', error.response?.data);
      const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
      setFormSuccess(false);
      setFormSuccessMessage('Error al eliminar la Terreno.');
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
        getTipoTerreno();
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
                            Terrenos /
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
                                    preserveScroll={true}
                                    preserveState={true}>
                                    Nuevo Terreno
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
                                                Area
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Valor Comercial
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Cerca Fuentes de Aguas
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Tiene Contrucciones
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Tipo Terreno
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
                                        {terrenos.map((terreno) => (
                                            <tr key={terreno.id_terreno} className="hover:bg-gray-50 focus-within:bg-gray-100">
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {/* {index + 1} */}
                                                    {terreno.id_terreno}
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium border-r  text-blue-900 whitespace-nowrap ">
                                                    {terreno.area}
                                                </th>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {terreno.valor_comercial}
                                                </td>
                                               
                                                <td className="whitespace-nowrap border-r px-6 py-4">                                                   
                                                    {terreno.cerca_fuentes_agua == true ? (
                                                            <p>Si</p>
                                                        ) : (
                                                            <p>No</p>
                                                        )}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">                                                    
                                                    {terreno.tiene_construcciones == true ? (
                                                            <p>Si</p>
                                                        ) : (
                                                            <p>No</p>
                                                        )}
                                                    
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {terreno.tipo_terreno.nombre}
                                                </td> 
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                   
                                                    {terreno.estado == true ? (
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
                                                                terreno.id_terreno,
                                                                terreno.area,
                                                                terreno.valor_comercial,
                                                                terreno.cerca_fuentes_agua,
                                                                terreno.tiene_construcciones,
                                                                terreno.tipo_terreno.id
                                                            )}>
                                                            <div className='w-6 h-6  '>
                                                                <Icon className="w-6 h-6 text-white fill-current group-hover:text-gray-300 focus:text-gray-600 " name="edit" />
                                                            </div>
                                                        </TableButton>
                                                    </div>
                                                    {terreno.estado == true ? (
                                                            <div className='w-8 h-8'>
                                                                <TableButton
                                                                    className='bg-[#CB0E28] hover:bg-[#AE0C22] p-1 '
                                                                    onClick={() => inactivar( 
                                                                        terreno.id_terreno,
                                                                        terreno.area,
                                                                        terreno.valor_comercial,
                                                                        terreno.cerca_fuentes_agua,
                                                                        terreno.tiene_construcciones,
                                                                        terreno.tipo_terreno.id)}>
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
                                                    forInput="area"
                                                    value="Area"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="area"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="area"
                                                    value={formState.area}
                                                    onChange={handleInput}
                                                    placeholder="Ingrese número predial "
                                                />
                                            </div>
                                            <div className=" px-3 lg:col-span-2 col-span-6 mb-3">
                                                <InputLabel
                                                    forInput="valor_comercial"
                                                    value="Valor Comercial"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="valor_comercial"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="valor_comercial"
                                                    value={formState.valor_comercial}
                                                    onChange={handleInput}
                                                    placeholder="Ingrese número predial "
                                                />
                                            </div>  
                                            <div className="px-3 lg:col-span-2 col-span-6 mb-3" >
                                                <InputLabel
                                                    forInput="fuentes_agua"
                                                    value="Cerca Fuentes de agua"
                                                    className="text-sm font-medium"
                                                />
                                                  <SelectInput
                                                    className="w-full"
                                                    name="fuentes_agua"
                                                    value={formState.fuentes_agua}
                                                    onChange={handleInput}
                                                    >
                                                     <option selected value="">
                                                        Selecciona una Opción...
                                                    </option>
                                                    <option value="true">Si</option>
                                                    <option value="false">No</option>
                                        </SelectInput>
                                                  
                                            </div>                                         
                                                  
                                            <div className="px-3 lg:col-span-2 col-span-6 mb-3" >
                                                <InputLabel
                                                    forInput="tiene_construcciones"
                                                    value="Tiene Construccion"
                                                    className="text-sm font-medium"
                                                />
                                                  <SelectInput
                                                    className="w-full"
                                                    name="tiene_construcciones"
                                                    value={formState.tiene_construcciones}
                                                    onChange={handleInput}
                                                    >
                                                     <option selected value="">
                                                        Selecciona una Opción...
                                                    </option>
                                                    <option value="true">Si</option>
                                                    <option value="false">No</option>
                                        </SelectInput>                                                  
                                            </div>

                                            <div className="px-3 lg:col-span-2 col-span-6 mb-3 " >
                                                <InputLabel
                                                    forInput="tipo_Terreno"
                                                    value="Tipo de Terreno"
                                                    className="text-sm font-medium"
                                                />
                                                <DynamicSelect
                                                    multiple={false}
                                                    withIcons={true}
                                                    options={allTipoTerreno}
                                                    value={formState.tipo_terreno}
                                                    valueKey="id"
                                                    labelKey="nombre"
                                                    onChange={(selectedOption) => setFormState({ ...formState, tipo_terreno: selectedOption.id })}

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