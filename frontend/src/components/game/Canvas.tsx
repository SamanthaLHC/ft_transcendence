import React, { useEffect, useRef } from "react";

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

    const drawgauchepad = (rect: CanvasRenderingContext2D) => {
        rect.fillStyle = 'red';
        rect.fillRect(0, data.jgauche*500/10, 20, 100);
    }

    const drawdroitepad = (rect: CanvasRenderingContext2D) => {
        rect.fillStyle = 'blue';
        rect.fillRect(980, data.jdroite*500/10, 20, 100);
    }

    const drawballe = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(data.posballex*1000/100, data.posballey*500/100, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.fillStyle = '#000000';
                context.fillRect(0, 0, 1000, 500);
                drawgauchepad(context);
                drawdroitepad(context);
                drawballe(context);
            }
        }
    }, [drawgauchepad]);

    return <canvas ref={canvasRef} width={1000} height={500} />;
};

export default Canvas;