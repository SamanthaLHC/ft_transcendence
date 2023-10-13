import React, { useEffect, useRef } from "react";
import duck from '../../assets/duck.png'

type CanvasProps = {
    data: {
        jgaucheid: number
        jgauche: number
        jdroiteid: number
        jdroite: number
        scoregauche: number
        scoredroite: number
        posballex: number
        posballey: number
        speedballX: number
        speedballY: number
    };
  };

  const Canvas: React.FC<CanvasProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const drawgauchepad = (rect: CanvasRenderingContext2D, wight: number, height: number) => {
        rect.fillStyle = 'red';
        rect.fillRect(0, data.jgauche*height/10, 2*wight/100, 20*height/100);
    }

    const drawdroitepad = (rect: CanvasRenderingContext2D, wight: number, height: number) => {
        rect.fillStyle = 'blue';
        rect.fillRect(wight-2*wight/100, data.jdroite*height/10, 2*wight/100, 20*height/100);
    }

    const drawballe = (ctx: CanvasRenderingContext2D, wight: number, height: number) => {
        // let img = new Image();
        // img.onload = () => {
        //     ctx.drawImage(img, data.posballex*wight/100, data.posballey*height/100, wight/50, wight/50)
        //     ctx.beginPath();
        // }
        // img.src = duck
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(data.posballex*wight/100, data.posballey*height/100, wight/100, 0, 2 * Math.PI);
        ctx.fill();
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.fillStyle = '#000000';
                context.fillRect(0, 0, canvas.width, canvas.height);
                drawgauchepad(context, canvas.width, canvas.height);
                drawdroitepad(context, canvas.width, canvas.height);
                drawballe(context, canvas.width, canvas.height);
            }
        }
    }, [data]);
    let {innerWidth, innerHeight} = window;
    return <canvas ref={canvasRef} width={innerWidth/2} height={innerWidth/2/2} />;
};

export default Canvas;