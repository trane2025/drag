import React, { useCallback, useRef, useState } from 'react';
import './DragWrapper.scss'


export const DragWrapper = ({ children, id = 'dragId', leftInit = 0, topInit = 0 }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const [position] = useState(() => {
        const local = localStorage.getItem(id);

        if (local) {
            return JSON.parse(local)
        } return {
            x: leftInit,
            y: topInit
        }
    });



    const ref = useRef(null);

    const onPointerDown = useCallback(
        (e) => {
            const body = document.body;
            const element = ref.current.getBoundingClientRect();
            const shiftX = e.clientX - element.left;
            const shiftY = e.clientY - element.top;

            body.classList.add('grabbing');


            ref.current.setPointerCapture(e.pointerId);

            ref.current.onpointermove = (e) => {
                const x = Math.max(0, Math.min( e.clientX - shiftX, body.getBoundingClientRect().width - element.width))- position.x;
                const y = Math.max(0, Math.min( e.clientY - shiftY, window.innerHeight - element.height))- position.y;
                console.log(x);
                setX(x);
                setY(y);
            }

            ref.current.onpointerup = function (event) {
                body.classList.remove('grabbing');
                ref.current.onpointermove = null;
                ref.current.onpointerup = null;
                ref.current.releasePointerCapture(e.pointerId);
                // ...при необходимости также обработайте "конец перемещения"
                setTimeout(()=> {
                    localStorage.setItem(id, JSON.stringify({
                        x: ref.current.getBoundingClientRect().left,
                        y: ref.current.getBoundingClientRect().top
                    }));
                }, 0);
            };
        }, []
    );


    return (
        <div
            className={'drag-wrapper'}
            ref={ref}
            onPointerDown={onPointerDown}
            style={{
                userSelect: 'none',
                position: 'fixed',
                top: position.y,
                left: position.x,
                transform: `translate(${x}px, ${y}px)`
            }}
        >{children}
        </div>
    )
}
