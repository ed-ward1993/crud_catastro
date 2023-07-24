import { forwardRef, useEffect, useRef, useState } from 'react';
import {InputText} from "primereact/inputtext";


export default ({ type,value,placeholder,error,ref,isFocused, name, className, errors = [], ...props }) => {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);
    return (

        <div className="flex flex-col items-start">
        <input
         type={type}
          id={name}
          name={name}
          value={value}
          ref={input}
          placeholder={placeholder}
          {...props}
          className={`h-11 w-full border-gray-300 focus:border-[#02558A] focus:ring-[#02558A] rounded-md shadow-sm text-black border px-4 form-input ${errors.length ? 'error' : ''}` + (error?' p-invalid':'')}
        />
        {errors && <div className="text-xs text-red-400">{errors}</div>}
      </div>
  );
};
