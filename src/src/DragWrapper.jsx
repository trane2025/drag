import React, { useCallback, useEffect, useRef, useState } from 'react';



export const DragWrapper = ({ children, id = 'foo', leftInit = 0, topInit = 0 }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const [position, setPosition] = useState(() => {
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

            const shiftX = e.clientX - ref.current.getBoundingClientRect().left;
            const shiftY = e.clientY - ref.current.getBoundingClientRect().top;



            ref.current.setPointerCapture(e.pointerId);

            ref.current.onpointermove = (e) => {
                setX(e.clientX - shiftX - position.x);
                setY(e.clientY - shiftY - position.y);
            }

            ref.current.onpointerup = function (event) {
                ref.current.onpointermove = null;
                ref.current.onpointerup = null;
                ref.current.releasePointerCapture(e.pointerId);
                // ...при необходимости также обработайте "конец перемещения"
                localStorage.setItem(id, JSON.stringify({
                    x: ref.current.getBoundingClientRect().left,
                    y: ref.current.getBoundingClientRect().top
                }))
            };
        }
    );


    return (
        <div
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
