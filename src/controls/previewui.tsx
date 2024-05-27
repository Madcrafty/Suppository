import {useEffect, useRef } from "react";
import { Preview } from "./preview";
import {globals} from "../../globals";

export function PreviewUI(props:{data:Preview}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
        if(!props.data.texture) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const context = canvas.getContext('2d');
        if (!context) return;
        var image = context.createImageData(globals.textureRes, globals.textureRes);
        image.data.set(props.data.texture);
        
        context.putImageData(image, 0, 0);
    });
  
    return (
        <canvas ref={canvasRef} width={globals.textureRes} height={globals.textureRes} />
    );
}