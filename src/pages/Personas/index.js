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
            const response = await axios.get('http://localhost:9000/listPropietario');
            console.log(response.data);
            // const response = await axios.get(`https://api.escuelajs.co/api/v1/products?limit=${limit}&offset=${offset}`);
            setPropietarios(response.data);

            // Calcular el número total de páginas
            const totalElements = response.data.meta.total; // Total de elementos disponibles en la API
            const calculatedTotalPages = Math.ceil(totalElements / limit); // Redondear hacia arriba para obtener el número total de páginas
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

// PArametros 

    const getTipoDocumento = async () => {
        try {            
            const response = await axios.get('http://localhost:9000/listTipoDocumento');
            setAllTipoDocumento(response.data);
            const initialValues = [];
            setSelectedTipoDocumento(initialValues);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getTipoPropietario = async () => {
        try {            
            const response = await axios.get('http://localhost:9000/listTipoPersona');
            setAllTipoPersona(response.data);
            const initialValues = [];
            setSelectedTipoPersona(initialValues);            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };   

    const [allTipoDocumento, setAllTipoDocumento] = useState([]);
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState([]);
    const [allTipoPersona, setAllTipoPersona] = useState([]);
    const [selectedTipoPersona, setSelectedTipoPersona] = useState([]);

    const [tipo_persona, setTipo_persona] =useState([]);
    const [tipo_documento, setTipo_documento] =useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

  

    // manejo de formulario y lista 
    const [formulario, setFormulario] = useState(false);
    const [listado, setListado] = useState(true);
    const [operation, setOperation] = useState(1);

    const openModal = (op, 
        id_propietario,
        tipo_persona,
        tipo_documento,
        documento,
        nit,
        razon_social,
        direccion,
        telefono,
        email) => {
        setFormulario(true);
        setListado(false);
        setOperation(op);  

        console.log('id:', id_propietario);
        console.log('tipo_persona:', tipo_persona);
        console.log('tipo_documento:', tipo_documento);
        console.log('documento:', documento);
        console.log('nit:', nit);
        console.log('razon_social:', razon_social);
        console.log('direccion:', direccion);
        console.log('telefono:', telefono);
        console.log('email:', email);

        if (op === 1) {
          setFormState({
            tipo_persona: "",
            tipo_documento: "",
            documento: "",
            nit: "",
            razon_social: "",
            direccion: "",
            telefono: "",
            email: "",
          });
        } else {
          setFormState({
            id_propietario: id_propietario,
            tipo_persona: tipo_persona,
            tipo_documento: tipo_documento,
            documento: documento,
            nit: nit,
            razon_social: razon_social,
            direccion: direccion,
            telefono: telefono,
            email: email,
          });
        }
        console.log('Form state:', formState);
      };

    // funcion envio de formulario 

    const [formState, setFormState] = useState({
        id_propietario:"",
        tipo_persona: [],
        tipo_documento: [],
        documento: "",
        nit: "",
        razon_social: "",
        direccion: "",
        telefono: "",
        email: "",
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
    const addPropietario = () => {
        const apiUrl = 'http://localhost:9000/createPropietario';
      
        const newPropietario = {
            id_tipo_persona:  {
                "id": formState.tipo_persona
              },
              numero_documento: formState.documento,
              id_tipo_documento: {
                "id": formState.tipo_documento
              } ,
            nit: formState.nit,
            razon_social: formState.razon_social,
            direccion: formState.direccion,
            telefono: formState.telefono,
            correo_electronico: formState.email,
            estado : true,
        //   price: parseInt(formState.avaluo), 
        
    };
    console.log('Datos enviados en la petición:', newPropietario);          
      
        axios
          .post(apiUrl, newPropietario)
          .then((response) => {
            console.log('Persona agregado exitosamente:', response.data);
            fetchData();
            setFormState({
                tipo_persona: [],
                tipo_documento: [],
                documento: "",
                nit: "",
                razon_social: "",
                direccion: "",
                telefono: "",
                email: "",
            });
            setFormSuccess(true);
            setFormSuccessMessage('Persona agregado exitosamente.');
            setFormulario(false);
            setListado(true);
          })
          .catch((error) => {
            console.error('Error al agregar la persona:', error);
            console.log('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
            setFormSuccess(false);
            setFormSuccessMessage('Error al agregar la persona.');
            Swal.fire({
              icon: 'error',
              title: errorMessage,
              showConfirmButton: true,
            });
          });
      };
      
      const editPropietario = () => {
        const apiUrl = `http://localhost:9000/updatePropietario`;
      
        const updatedPersona = {
            id_propietario : formState.id_propietario,
            id_tipo_persona:  {
                "id": formState.tipo_persona
              },
              numero_documento: formState.documento,
              id_tipo_documento: {
                "id": formState.tipo_documento
              } ,
            nit: formState.nit,
            razon_social: formState.razon_social,
            direccion: formState.direccion,
            telefono: formState.telefono,
            correo_electronico: formState.email,
            estado : true,
        };
    // console.log('Datos enviados en la petición:', updatedPersona);          

      
        axios
          .post(apiUrl, updatedPersona)
          .then((response) => {
            // console.log('Persona actualizado exitosamente:', response.data);
            fetchData();
            setFormState({
                tipo_persona: [],
                tipo_documento: [],
                documento: "",
                nit: "",
                razon_social: "",
                direccion: "",
                telefono: "",
                email: "",
            });
            setFormSuccess(true);
            setFormSuccessMessage('Persona actualizado exitosamente.');
            setFormulario(false);
            setListado(true);
          })
          .catch((error) => {
            console.error('Error al agregar la persona:', error);
            console.log('Detalles del error:', error.response?.data);
            const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
            setFormSuccess(false);
            setFormSuccessMessage('Error al agregar la persona.');
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
          text: '¿Quieres agregar o editar este Propietario?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            if (operation === 1) {
              addPropietario(); // Llama a la función para agregar el producto
            } else if (operation === 2) {
                console.log('entre');
              editPropietario(); // Llama a la función para editar el producto
            }
          }
        });
      };
      
      const submitForm = (e) => {
        e.preventDefault();
        showConfirmationDialog(); // Muestra el cuadro de diálogo de confirmación antes de agregar o editar el producto
      };

     const inactivar = ( id_propietario,tipo_persona,tipo_documento,documento,nit,razon_social,direccion,telefono,email) => {

        const apiUrl = `http://localhost:9000/deletePropietario`;
  
        const deletePersona = {
        id_propietario : id_propietario,
        id_tipo_persona:  {
            "id": tipo_persona
          },
          numero_documento: documento,
          id_tipo_documento: {
            "id": tipo_documento
          } ,
        nit: nit,
        razon_social: razon_social,
        direccion: direccion,
        telefono: telefono,
        correo_electronico: email,
        estado : false,
    };

    Swal.fire({
        title: "Esta Seguro de eliminar este Propietario?",
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
    .post(apiUrl, deletePersona)
    .then((response) => {
      // console.log('Persona actualizado exitosamente:', response.data);
    
      setFormSuccess(true);
      setFormSuccessMessage('Persona eliminado exitosamente.');
      setFormulario(false);
      setListado(true);
      setPropietarios((prevPropietarios) =>
        prevPropietarios.filter((propietario) => propietario.id_propietario !== id_propietario)
      );
    })
    .catch((error) => {
      console.error('Error al eliminar la persona:', error);
      console.log('Detalles del error:', error.response?.data);
      const errorMessage = error.response?.data?.errorBag?.default?.[0] || 'Error desconocido';
      setFormSuccess(false);
      setFormSuccessMessage('Error al eliminar la persona.');
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
        getTipoDocumento();
        getTipoPropietario();
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
                            Propiertarios /
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
                                    Nuevo Propietario
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
                                                Tipo de Persona
                                            </th>
                                             <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Tipo de documento
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Documento
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Nit
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Razon social
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Dirección
                                            </th>
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Telefono
                                            </th> 
                                            <th scope="col" className="border-r px-6 pt-5 pb-4">
                                                Correo Electronico
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
                                        {propietarios.map((propietario, index) => (
                                            <tr key={propietario.id_propietario} className="hover:bg-gray-50 focus-within:bg-gray-100">
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {/* {index + 1} */}
                                                    {propietario.id_propietario}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.id_tipo_persona.nombre}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.id_tipo_documento.nombre}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.numero_documento}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.nit}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.razon_social}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.direccion}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.telefono}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.correo_electronico}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4">
                                                    {propietario.estado == true ? (
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
                                                                propietario.id_propietario,
                                                                propietario.id_tipo_persona.id,
                                                                propietario.id_tipo_documento.id,
                                                                propietario.numero_documento,
                                                                propietario.nit,
                                                                propietario.razon_social,
                                                                propietario.direccion,
                                                                propietario.telefono,
                                                                propietario.correo_electronico
                                                            )}>
                                                            <div className='w-6 h-6  '>
                                                                <Icon className="w-6 h-6 text-white fill-current group-hover:text-gray-300 focus:text-gray-600 " name="edit" />
                                                            </div>
                                                        </TableButton>
                                                    </div>
                                                    {propietario.estado == true ? (
                                                            <div className='w-8 h-8'>
                                                                <TableButton
                                                                    className='bg-[#CB0E28] hover:bg-[#AE0C22] p-1 '
                                                                    onClick={() => inactivar( propietario.id_propietario,
                                                                        propietario.id_tipo_persona.id,
                                                                        propietario.id_tipo_documento.id,
                                                                        propietario.numero_documento,
                                                                        propietario.nit,
                                                                        propietario.razon_social,
                                                                        propietario.direccion,
                                                                        propietario.telefono,
                                                                        propietario.correo_electronico)}>
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
                                            <div className='w-full p-2 grid grid-cols-6 gap-2 '>
                                                <p className="hidden">{operation}</p>
                                                
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3 " >
                                                <InputLabel
                                                    forInput="tipo_persona"
                                                    value="Tipo de Persona"
                                                    className="text-sm font-medium"
                                                />
                                                <DynamicSelect
                                                     multiple={false}
                                                    withIcons={true}
                                                    options={allTipoPersona}
                                                    value={formState.tipo_persona}
                                                    valueKey="id"
                                                    labelKey="nombre"
                                                    onChange={(selectedOption) => setFormState({ ...formState, tipo_persona: selectedOption.id })}
                                                    className="mb-5 h-36"
                                                />                                                  
                                            </div>                                            
                                
                                            <div className="px-3 lg:col-span-2 col-span-6 mb-3 " >
                                                <InputLabel
                                                    forInput="tipo_documento"
                                                    value="Tipo de documento"
                                                    className="text-sm font-medium"
                                                />
                                                <DynamicSelect
                                                    multiple={false}
                                                    withIcons={true}
                                                    options={allTipoDocumento}
                                                    value={formState.tipo_documento}
                                                    valueKey="id"
                                                    labelKey="nombre"
                                                    onChange={(selectedOption) => setFormState({ ...formState, tipo_documento: selectedOption.id })}

                                                    className="mb-5 h-36"
                                                />                                                  
                                            </div>
                                          <div  className=" px-3 lg:col-span-2 col-span-6 mb-3">
                                                <InputLabel
                                                    forInput="documento"
                                                    value="Documento"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="documento"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="documento"
                                                    value={formState.documento}
                                                    onChange={handleInput}
                                                    placeholder="Ingrese número documento "
                                                />
                                            </div>
                                            <div className=" px-3 lg:col-span-2 col-span-6 mb-3">
                                                <InputLabel
                                                    forInput=" nit"
                                                    value=" Nit"
                                                    className="text-sm font-medium"
                                                />
                                                <TextInput
                                                    id="nit"
                                                    type="number"
                                                    className="mt-1 block"
                                                    name="nit"
                                                    value={formState.nit}
                                                    onChange={handleInput}
                                                    placeholder="Numero de Nit "
                                                />
                                            </div>

                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="razon_social"
                                                        value="Razon social"
                                                        className="text-sm font-medium"
                                                    />

                                                    <TextInput
                                                        id="razon_social"
                                                        type="text"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="razon_social"
                                                        value={formState.razon_social}
                                                        onChange={handleInput}
                                                        placeholder="Razon social"
                                                    />
                                                </div>
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="direccion"
                                                        value="Dirección"
                                                        className="text-sm font-medium"
                                                    />
                                                    <TextInput
                                                        id="direccion"
                                                        type="text"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="direccion"
                                                        value={formState.direccion}
                                                        onChange={handleInput}
                                                        placeholder="Dirección"
                                                    />
                                                </div>
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="telefono"
                                                        value="Telefono"
                                                        className="text-sm font-medium"
                                                    />

                                                    <TextInput
                                                        id="telefono"
                                                        type="text"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="telefono"
                                                        value={formState.telefono}
                                                        onChange={handleInput}
                                                        placeholder="telefono "
                                                    />
                                                </div>
                                                <div className="px-3 lg:col-span-2 col-span-6 mb-3">
                                                    <InputLabel
                                                        forInput="correo_electronico"
                                                        value="Correo Electronico"
                                                        className="text-sm font-medium"
                                                    />

                                                    <TextInput
                                                        id="email"
                                                        type="email"
                                                        className="mt-1 block mb-6 uppercase"
                                                        name="email"
                                                        value={formState.email}
                                                        onChange={handleInput}
                                                        placeholder="correo electronico "
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