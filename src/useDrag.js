import {useCallback, useState, useRef} from "react";

export const useDrag = ({onDragStart, onDragMove, onDragEnd}) => {

    const startPosition = useRef({x: 0, y: 0});
    const [isMoving, setIsMoving] = useState(false);
    const onPointerDown = useCallback((ev) => {
        ev.preventDefault();

        ev.currentTarget.setPointerCapture(ev.pointerId);
        onDragStart?.();
        setIsMoving(true);
        startPosition.current.x = ev.clientX;
        startPosition.current.y = ev.clientY;
    }, [onDragStart]);

    const onDragMoveRef = useRef(onDragMove);
    onDragMoveRef.current = onDragMove;
    const onDragEndRef = useRef(onDragEnd);
    onDragEndRef.current = onDragEnd;

    const onPointerMove = useCallback((ev) => {
        ev.preventDefault();
        onDragMoveRef.current(ev.clientX - startPosition.current.x, ev.clientY - startPosition.current.y);
    }, []);

    const onPointerUp = useCallback((ev) => {
        ev.preventDefault();
        ev.currentTarget.releasePointerCapture(ev.pointerId);
        onDragEndRef.current(ev.clientX - startPosition.current.x, ev.clientY - startPosition.current.y);
        startPosition.current.x = 0;
        startPosition.current.y = 0;
        setIsMoving(false);
    }, []);

    return [{
        onPointerDown,
        onPointerMove: isMoving ? onPointerMove : undefined,
        onPointerUp,
    }, isMoving]
}