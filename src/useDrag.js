import * as React from "react";

export const Status = {
    idle:    2 << 0,
    started: 2 << 1,
    moved:   2 << 2,
    ended:   2 << 3,
};

export const isActive = Status.started | Status.moved;

export const useDiff = () => {
    const [diffX, setDiffX] = React.useState(0);
    const [diffY, setDiffY] = React.useState(0);
    const [status, setStatus] = React.useState(Status.idle);
    const startPosition = React.useRef({ x: 0, y: 0 });

    const onPointerDown = React.useCallback((ev) => {
        if(ev.button !== 0) return;
        ev.preventDefault();
        ev.currentTarget.setPointerCapture(ev.pointerId);
        setStatus(Status.started);
        startPosition.current.x = ev.clientX;
        startPosition.current.y = ev.clientY;
    }, []);

    const onPointerMove = React.useCallback((ev) => {
        ev.preventDefault();
        setStatus(Status.moved);
        setDiffX(ev.clientX - startPosition.current.x);
        setDiffY(ev.clientY - startPosition.current.y);
    }, []);

    const onPointerUp = React.useCallback((ev) => {
        ev.preventDefault();
        ev.currentTarget.releasePointerCapture(ev.pointerId);
        setStatus(Status.ended);
        startPosition.current.x = 0;
        startPosition.current.y = 0;
    }, []);

    React.useLayoutEffect(() => {
        if(status === Status.ended){
            setStatus(Status.idle);
            setDiffX(0);
            setDiffY(0);
        }
    }, [status]);

    const returns = {
        x: diffX,
        y: diffY,
        status,
    };

    const handlers = {
        onPointerDown,
        onPointerMove: status & isActive ? onPointerMove : undefined,
        onPointerUp,
    };

    return [returns, handlers];
}

export const useEffect = (d, cases) => {
    React.useEffect(() => {
        cases?.[d.status]?.();
    });
};
