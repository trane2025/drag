import './App.css';
import {useDrag} from "./useDrag";
import {useEffect, useMemo, useRef, useState} from "react";

const useLocalStorageFactory = (id) => {
    return useMemo(() => {
        return {
            setLocalStorageDrag: (value) => {
                localStorage.setItem(id, JSON.stringify(value));
            },
            getLocalStorageDrag: () => {
                return JSON.parse(localStorage.getItem(id));
            },
            hasStorage: Boolean(JSON.parse(localStorage.getItem(id))),
        }
    }, [id])
};


const getMargins = (el) => {
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


function App() {

    const {setLocalStorageDrag, getLocalStorageDrag, hasStorage} = useLocalStorageFactory('dragTest');
    const ref = useRef();

    const [position, setPosition] = useState(() => {
        if (hasStorage) {
            return getLocalStorageDrag();
        }
        return {x: 0, y: 0};
    });
    const [diff, setDiff] = useState({x: 0, y: 0});

    const [pointerEvents, isMoving] = useDrag({
        onDragStart: () => {
            document.body.classList.add('grabbing');
        },
        onDragMove: (x, y) => {
            setDiff({x: x, y: y});
        },
        onDragEnd: (x, y) => {
            const {width, height} = ref.current?.getBoundingClientRect();
            const margins = getMargins(ref.current);
            const nextX = Math.max(Math.min(position.x + x, document.body.clientWidth - width - margins.left - margins.right), 0);
            const nextY = Math.max(Math.min(position.y + y, window.innerHeight - height - margins.top - margins.bottom), 0);
            setPosition({
                    x: nextX,
                    y: nextY,
                }
            );
            setLocalStorageDrag({x: nextX, y: nextY});
            document.body.classList.remove('grabbing');
            setDiff({x: 0, y: 0});
        }
    });

    const zalupa = useMemo(()=> {
        return {
            top: window.innerHeight,
            left: window.innerWidth,
        }
    }, [] )

    useEffect(() => {
        const fn = (ev) => {
            // console.log(ev);
        }

        window.addEventListener('resize', fn);

        return () => {
            window.removeEventListener('resize', fn);
        }
    })

    // console.log(zalupa)

    const cY = (zalupa.top / window.innerHeight);
    const cX = ( zalupa.left /window.innerWidth);
    const cXDiff = zalupa.left - window.innerWidth;
    const cYDiff =   zalupa.top - window.innerHeight;

    console.log({ cXDiff, cYDiff })
    console.log(zalupa)
    console.log({
        top: window.innerHeight,
        left: window.innerWidth,
    })

    const x = position.x + diff.x;
    const k = Math.round(100 + cXDiff/window.innerWidth * 100);

    return (
        <div className="App">
            <div ref={ref} {...pointerEvents} style={{
                transition: isMoving ? 'none' : 'all .1s ease',
                position: "fixed",
                cursor: "grab",
                // top:((position.y + diff.y) / zalupa.top * cY) * 100 + '%',
                left: x / window.innerWidth * 110 + '%',
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
