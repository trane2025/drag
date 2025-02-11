import * as React from 'react';
import * as Drag from './useDrag';
import { useSize, useSizeStable } from './measures-hook-utils';
import './App.css';

const getMargins = (ref) => {
    const el = ref.current;
    if (!el) {
        return {bottom: 0, left: 0, right: 0, top: 0};
    }
    const css = getComputedStyle(el);
    const marginLeftRaf = parseInt(css.marginLeft);
    const marginTopRaf = parseInt(css.marginTop);
    const marginRightRaf = parseInt(css.marginRight);
    const marginBottomRaf = parseInt(css.marginBottom);

    return {
        bottom: isNaN(marginBottomRaf) ? 0 : marginBottomRaf,
        left: isNaN(marginLeftRaf) ? 0 : marginLeftRaf,
        right: isNaN(marginRightRaf) ? 0 : marginRightRaf,
        top: isNaN(marginTopRaf) ? 0 : marginTopRaf,
    };
};

const mergeToXY = (rect) => {
    return {
        x: rect.left + rect.right,
        y: rect.top + rect.bottom,
    };
};

const clamp = (from, to) => (value) => Math.max(from, Math.min(value, to));

const getWindowSize = () => {
    const html = document.documentElement;
    return {
        width: html.clientWidth,
        height: html.clientHeight,
    };
};

const getSizeFromRef = (ref) => () => {
    const rect = ref.current?.getBoundingClientRect();
    return {
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
    };
};

const getBounds = (containerPlot, targetSize) => {
    return {
        x: clamp(containerPlot.offset.x, containerPlot.size.x - targetSize.x),
        y: clamp(containerPlot.offset.y, containerPlot.size.y - targetSize.y),
    };
};

const useFullSize = (ref) => {
    const size = useSize(getSizeFromRef(ref));
    const margins = mergeToXY(getMargins(ref));

    return {
        x: size.x + margins.x,
        y: size.y + margins.y,
    };
};

const zeroPoint = { x: 0, y: 0 };

const useWindowDiff = (updated) => {
    const size = {
        window: useSize(getWindowSize, updated),
        windowStable: useSizeStable(getWindowSize, updated),
    };

    return {
        x: size.window.x - size.windowStable.x,
        y: size.window.y - size.windowStable.y,
    };
};

// -------------------------------------------------------------------------------------
// Main
// -------------------------------------------------------------------------------------

const initPosition = () => ({ x: 100, y: 200 });

const App = () => {
    const [position, commitPosition] = React.useState(initPosition);
    const [drag, dragHandlers] = Drag.useDiff();

    const windowPlot = {
        offset: zeroPoint,
        size: useSize(getWindowSize),
    };

    const ref = React.useRef(null);
    const targetSize = useFullSize(ref);

    const bounds = getBounds(windowPlot, targetSize);
    
    const isNotDragged = drag.status === Drag.Status.idle;
    const windowDiff = useWindowDiff(isNotDragged);

    const getFinalPosition = (p) => ({
        x: bounds.x(p.x + drag.x + Math.max(-p.x, windowDiff.x)),
        y: bounds.y(p.y + drag.y + Math.max(-p.y, windowDiff.y)),
    });

    Drag.useEffect(drag, {
        [Drag.Status.ended]: () => {
            commitPosition(getFinalPosition);
        },
    });

    const offset = getFinalPosition(position);

    return (
        <div className='App'>
            <div ref={ref} {...dragHandlers} style={{
                position: 'fixed',
                cursor: 'grab',
                top: offset.y,
                left: offset.x,
                width: 200,
                height: 200,
                padding: 15,
                background: 'blanchedalmond',
                margin: 20,
            }}>
            </div>
        </div>
    );
}

export default App;
