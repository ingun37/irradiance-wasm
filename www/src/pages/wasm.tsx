import * as React from "react"
import * as wasm from "irradiance-wasm";
import {useEffect} from "react";

const Wasm = ()=>{
    useEffect(()=>{
        console.log("wasm starting")
        const arr = wasm.fibonacci_hemi_sphere(10);
        console.log(arr);
    })
    return (<div>this is wasm page</div>)
}
export default Wasm;