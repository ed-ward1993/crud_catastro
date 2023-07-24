import {React} from 'react';

const Home = () => {
    return (
        <>        
        <div className="flex flex-col h-full">
            <div className="flex-1 ">                        

                <div className="max-w-[97%] mx-auto sm:px-6 centrar mt-14">
                    <div className="flex-col overflow-hidden shadow-sm sm:rounded-lg border-2 border-gray-200  ">                    
                        <>
                        <div className="w-full centrar mt-5 p-6 font-bold text-2xl text-[#6F7477]">Bienvenido Catastro Multiproposito</div>
                        <div className="w-full centrar -mt-4 p-6 font-semibold text-xl text-[#026882] max-2xl:text-lg max-2xl:-mt-8 max-lg:text-sm max-lg:-mt-4">Selecciona una opción del menú que esta ubicado en la parte superior</div>
                        <div className="centrar w-full">
                            <img src="images/catastro.png" className="max-2xl:h-60" />
                        </div>
                        </>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};
export default Home;
