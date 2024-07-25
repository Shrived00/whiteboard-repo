import { useEffect, useLayoutEffect, useState, MouseEvent, RefObject, MutableRefObject } from "react";
import rough from "roughjs";
import DotPattern from "./DotPattern";
import { Socket } from "socket.io-client";
import { Element } from "@/types";

interface WhiteBoardProps {
    canvasRef: RefObject<HTMLCanvasElement>;
    ctxRef: MutableRefObject<CanvasRenderingContext2D | null>;
    elements: Element[];
    setElements: React.Dispatch<React.SetStateAction<Element[]>>;
    tool: "pencil" | "rect" | "circle"; // Removed select
    socket: Socket | null;
    roomId: string | undefined;
    strokeWidth: number; // Updated
    strokeColor: string; // Updated
}

const roughGenerator = rough.generator();

const WhiteBoard: React.FC<WhiteBoardProps> = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool,
    socket,
    roomId,
    strokeWidth, // Updated
    strokeColor // Updated
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentElement, setCurrentElement] = useState<Element | null>(null);
    const [currentPosition, setCurrentPosition] = useState<{ x: number, y: number } | null>(null);

    // Undo/Redo states
    const [undoStack, setUndoStack] = useState<Element[][]>([]);
    const [redoStack, setRedoStack] = useState<Element[][]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.height = window.innerHeight * 2;
            canvas.width = window.innerWidth * 2;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctxRef.current = ctx;
            } else {
                console.error("Failed to get canvas context");
            }
        } else {
            console.error("Canvas reference is null");
        }
    }, [canvasRef, ctxRef]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const roughCanvas = rough.canvas(canvas);

            if (ctxRef.current) {
                ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);

                elements.forEach((element) => {
                    const options = { stroke: element.strokeColor, strokeWidth: element.strokeWidth }; // Updated options

                    if (element.type === "rect") {
                        roughCanvas.draw(
                            roughGenerator.rectangle(
                                element.offsetX,
                                element.offsetY,
                                element.width,
                                element.height,
                                options
                            )
                        );
                    } else if (element.type === "pencil") {
                        roughCanvas.linearPath(element.path as [number, number][], options);
                    } else if (element.type === "circle") {
                        const radius = Math.sqrt(Math.pow(element.width / 2, 2) + Math.pow(element.height / 2, 2));
                        roughCanvas.draw(
                            roughGenerator.circle(
                                element.offsetX + radius,
                                element.offsetY + radius,
                                radius,
                                options
                            )
                        );
                    }
                });

                // Draw the current element
                if (currentElement) {
                    const options = { stroke: currentElement.strokeColor, strokeWidth: currentElement.strokeWidth }; // Updated options

                    if (currentElement.type === "rect") {
                        roughCanvas.draw(
                            roughGenerator.rectangle(
                                currentElement.offsetX,
                                currentElement.offsetY,
                                currentElement.width,
                                currentElement.height,
                                options
                            )
                        );
                    } else if (currentElement.type === "pencil") {
                        roughCanvas.linearPath(currentElement.path as [number, number][], options);
                    } else if (currentElement.type === "circle") {
                        const radius = Math.sqrt(Math.pow(currentElement.width / 2, 2) + Math.pow(currentElement.height / 2, 2));
                        roughCanvas.draw(
                            roughGenerator.circle(
                                currentElement.offsetX + radius,
                                currentElement.offsetY + radius,
                                radius,
                                options
                            )
                        );
                    }
                }
            } else {
                console.error("Canvas context is not available");
            }
        }
    }, [elements, currentElement, currentPosition, canvasRef, ctxRef]);

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = e.nativeEvent;

        const newElement: Element = {
            id: Date.now(),
            type: tool,
            offsetX,
            offsetY,
            width: 0,
            height: 0,
            path: tool === "pencil" ? [[offsetX, offsetY]] : [],
            strokeWidth, // Updated
            strokeColor, // Updated
        };

        setCurrentElement(newElement);
        setCurrentPosition({ x: offsetX, y: offsetY });
        setIsDrawing(true);
    };

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = e.nativeEvent;

        setCurrentPosition({ x: offsetX, y: offsetY });

        if (tool === "pencil") {
            if (currentElement) {
                const newPath: Array<[number, number]> = [...currentElement.path, [offsetX, offsetY]];
                setCurrentElement({
                    ...currentElement,
                    path: newPath,
                });
            }
        } else if (tool === "rect" || tool === "circle") {
            if (currentElement) {
                setCurrentElement({
                    ...currentElement,
                    width: offsetX - currentElement.offsetX,
                    height: offsetY - currentElement.offsetY,
                });
            }
        }

        if (socket && roomId) {
            socket.emit("getElements", { elements: [...elements, currentElement], room: roomId });
        }
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            if (currentElement) {
                // Add current elements to undo stack
                setUndoStack((prevUndoStack) => [...prevUndoStack, [...elements]]);
                setRedoStack([]);

                setElements((prevElements) => [...prevElements, currentElement]);
            }
            setCurrentElement(null);
            setCurrentPosition(null);
            setIsDrawing(false);
        }
    };

    const handleUndo = () => {
        setRedoStack((prevRedoStack) => [...prevRedoStack, elements]);
        const lastUndoState = undoStack.pop();
        if (lastUndoState) {
            setElements(lastUndoState);
            setUndoStack([...undoStack]);
        }
    };

    const handleRedo = () => {
        const lastRedoState = redoStack.pop();
        if (lastRedoState) {
            setUndoStack((prevUndoStack) => [...prevUndoStack, elements]);
            setElements(lastRedoState);
            setRedoStack([...redoStack]);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("setElements", (newElements: Element[]) => {
                setElements(newElements);
            });
        }
        return () => {
            if (socket) {
                socket.off("setElements");
            }
        };
    }, [socket, setElements]);

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            onMouseUp={handleMouseUp}
        >
            <DotPattern
                width={20}
                height={20}
                cx={10}
                cy={10}
                cr={1}
                className="absolute inset-0 z-0"
            />
            <canvas ref={canvasRef} onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove} className="relative z-10" />
            {/* Add buttons for Undo/Redo */}
            <div className="absolute top-2 right-2 z-20 flex space-x-2">
                <button
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="bg-gray-500 text-white p-2 rounded"
                >
                    Undo
                </button>
                <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="bg-gray-500 text-white p-2 rounded"
                >
                    Redo
                </button>
            </div>
        </div>
    );
};

export default WhiteBoard;
