import React, { useEffect, useRef } from "react";
import duck from '../../assets/duck.png'
import pad from '../../assets/pad.png'

type CanvasProps = {
    data: {
        jgaucheid: number
        jgauche: number
        jdroiteid: number
        jdscockid: string
        jgscockid: string
        jdroite: number
        scoregauche: number
        scoredroite: number
        posballex: number
        posballey: number
        speedballX: number
        speedballY: number
    };
    canardmod: boolean
  };

  const Canvas: React.FC<CanvasProps> = ({ data, canardmod }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    let imgballe = new Image();
    imgballe.src = duck
    let imgpad = new Image();
    imgpad.src = pad
    let imgpadd = new Image();
    imgpadd.src = pad
    const drawgauchepad = (rect: CanvasRenderingContext2D, wight: number, height: number) => {
        rect.fillStyle = 'red';
        rect.fillRect(0, data.jgauche*height/10, 2*wight/100, 20*height/100);
    }

    const drawdroitepad = (rect: CanvasRenderingContext2D, wight: number, height: number) => {
        rect.fillStyle = 'blue';
        rect.fillRect(wight-2*wight/100, data.jdroite*height/10, 2*wight/100, 20*height/100);
    }

    const drawmidline = (rect: CanvasRenderingContext2D, wight: number, height: number) => {
        rect.fillStyle = 'white';
        rect.fillRect(wight/2-(wight*2/1000)/2, 0, (wight*2/1000), height);
    }

    const drawballe = (ctx: CanvasRenderingContext2D, wight: number, height: number) => {
        ctx.fillStyle = 'yellow';
        ctx.arc(data.posballex*wight/100, data.posballey*height/100, wight/100, 0, 2 * Math.PI);
        ctx.fill();
    }

    const drawcanard = (ctx: CanvasRenderingContext2D, wight: number, height: number) => {
        imgballe.onload = () => {
            ctx.drawImage(imgballe, data.posballex*wight/100-(wight/50/2), data.posballey*height/100-(wight/50/2), wight/50, wight/50)
        }
    }

    const drawpadgauchebag = (ctx: CanvasRenderingContext2D, wight: number, height: number) => {
        imgpad.onload = () => {
            ctx.drawImage(imgpad, 0, data.jgauche*height/10, 2*wight/100, 20*height/100)
        }
    }

    const drawpaddroitebag = (ctx: CanvasRenderingContext2D, wight: number, height: number) => {
        imgpadd.onload = () => {
            ctx.drawImage(imgpadd, wight-2*wight/100, data.jdroite*height/10, 2*wight/100, 20*height/100)
        }
    }
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height)
                context.beginPath()
                context.fillStyle = '#000000';
                context.fillRect(0, 0, canvas.width, canvas.height);
                drawmidline(context, canvas.width, canvas.height);
                if (!canardmod)
                {
                    drawgauchepad(context, canvas.width, canvas.height);
                    drawdroitepad(context, canvas.width, canvas.height);
                    drawballe(context, canvas.width, canvas.height);
                }
                else
                {
                    drawcanard(context, canvas.width, canvas.height);
                    drawpadgauchebag(context, canvas.width, canvas.height);
                    drawpaddroitebag(context, canvas.width, canvas.height);
                }
                context.fill()
                context.closePath()
            }
        }
    let {innerWidth, innerHeight} = window;
    return (
        <div>
            <canvas ref={canvasRef} width={innerWidth/2} height={innerWidth/2/2} />
        </div>
    )
};

export default Canvas;