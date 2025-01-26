import './App.css';
import { DragWrapper } from './DragWrapper';

// const useSize = (ref) => {
//   const [width, setWidth] = useState(null);
//   const [height, setHeight] = useState(null);

//   useEffect(() => {
//     const { width, height } = ref.current.getBoundingClientRect();
//     setWidth(width);
//     setHeight(height);
//   }, []);

//   return { width, height };
// };

// const usePosition = (ref) => {
//   const [top, setTop] = useState(null);
//   const [left, setLeft] = useState(null);

//   useEffect(() => {
//     const { top, left } = ref.current.getBoundingClientRect();
//     setTop(top);
//     setLeft(left);
//   }, []);

//   return { top, left };
// };

// const pos = (c, rect) => {
//   const y = Math.min(Math.max(-rect.top, c.y), window.innerHeight - rect.height - rect.top);
//   const x = Math.min(Math.max(-rect.left, c.x), window.innerWidth - rect.width - rect.left);

//   return {
//     top: rect.top,
//     left: rect.left,
//     transform: `translate(${x}px, ${y}px)`,
//   };
// };

// function App() {
//   const divRef = useRef(null);
//   const size = useSize(divRef);
//   const position = usePosition(divRef);
//   const [handlers, c] = useDrag();
//   const rect = {
//     ...size,
//     top: position.top ?? 400,
//     left: position.left ?? 300,
//   };
//   return (
//     <div className="App">
//       <div
//         ref={divRef}
//         style={{
//           background: 'red',
//           position: 'fixed',
//           ...pos(c, rect)
//         }}
//         {...handlers}>
//         Hello world <br /> Hello world!!!!!!!!!!!!!
//       </div>
//     </div>
//   );
// }

// const useDrag = () => {

//   const [x, setX] = useState(0);
//   const [y, setY] = useState(0);

//   const shiftX = useRef(0);
//   const shiftY = useRef(0);
//   const prevX = useRef(0);
//   const prevY = useRef(0);

//   const onMouseMove = useCallback((e) => {
//     setX(prevX.current + e.clientX - shiftX.current);
//     setY(prevY.current + e.clientY - shiftY.current);
//   }, []);

//   const onMouseUp = useCallback((e) => {
//     prevX.current += e.clientX - shiftX.current;
//     prevY.current += e.clientY - shiftY.current;
//     document.documentElement.removeEventListener('mousemove', onMouseMove);
//     document.documentElement.removeEventListener('mouseup', onMouseUp);
//   }, []
//   )

//   const onMouseDown = (e) => {
//     shiftX.current = e.clientX;
//     shiftY.current = e.clientY;
//     document.documentElement.addEventListener('mousemove', onMouseMove);
//     document.documentElement.addEventListener('mouseup', onMouseUp);
//   }
//   return [{ onMouseDown }, { x, y }]
// }

const App = () => {
  return (
    <div className="App">
      <DragWrapper leftInit={300} topInit={400}>
        <div
          style={{
            background: 'red',

          }}>
          Hello world <br /> Hello world!!!!!!!!!!!!! <br /> Hello world
        </div>
      </DragWrapper>
    </div>
  )
}

export default App;
