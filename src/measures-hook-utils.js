import * as React from 'react';
import { unstable_batchedUpdates as batch } from 'react-dom';

/**
 * 
 * @param {Function} eff - аналог эффекта, принимающий в качестве аргумента коллбэк который установит размеры
 */
const UseSizeFactory = (eff) => {
    /**
     * 
     * @param {() => Size} getter - селектор читающий размеры из сущности
     * @param {boolean} isRunCalculated - флаг, указывающий на то производить получение размеров в данный момент или нет
     * @returns 
     */
    const useSize = (getter, isRunCalculated = true) => {
        const [width, setWidth] = React.useState(() => getter().width);
        const [height, setHeight] = React.useState(() => getter().height);

        const sizeHandler = React.useCallback(() => {
            const rect = getter();
            setWidth(rect.width);
            setHeight(rect.height);
        }, [getter]);
    
        React.useEffect(() => {
            if(!isRunCalculated) return;
    
            return eff(sizeHandler);
        }, [sizeHandler, isRunCalculated]);
    
        return { x: width, y: height };
    };

    return useSize;
}

const queue = new Set();

(function loop(){
    batch(() => {
        for(const task of queue){
            task();
        }
    });
    requestAnimationFrame(loop);
})();

export const useSize = UseSizeFactory((handler) => {
    handler();
    queue.add(handler);
    return () => {
        queue.delete(handler);
    };
});

export const useSizeStable = UseSizeFactory((handler) => {
    handler();
});
