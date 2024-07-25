import { useEffect, useState, useRef } from "react";
import { socket } from "../api/socket";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import WhiteBoard from "@/components/Whiteboard";
import {
    PencilIcon,
    RectangleEllipsisIcon,
    CircleIcon,
    EraserIcon,
    PaletteIcon,
    BrushIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Element } from '@/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type ToolType = "pencil" | "rect" | "circle";

const RoomPage: React.FC = () => {
    const [tool, setTool] = useState<ToolType>("pencil");
    const [elements, setElements] = useState<Element[]>([]);
    const [shareLink, setShareLink] = useState<string>("");
    const [strokeWidth, setStrokeWidth] = useState<number>(2);
    const [strokeColor, setStrokeColor] = useState<string>("black");
    const { roomId } = useParams<{ roomId?: string }>();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const handleSetElements = (newElements: Element[]) => {
            setElements(newElements);
        };

        if (roomId) {
            socket.emit("join", roomId);
            socket.on("setElements", handleSetElements);

            const link = `${window.location.origin}/${roomId}`;
            setShareLink(link);
        }

        return () => {
            socket.off("setElements", handleSetElements);
        };
    }, [roomId]);

    const handleToolChange = (newTool: ToolType) => {
        setTool(newTool);
    };

    const handleColorChange = (color: string) => {
        setStrokeColor(color);
    };

    const handleStrokeWidthChange = (width: number) => {
        setStrokeWidth(width);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    const handleClear = () => {
        setElements([]);
        if (socket && roomId) {
            socket.emit("getElements", { elements: [], room: roomId });
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <header className="sticky top-0 z-10 flex items-center justify-between bg-gray-800 text-white p-4 ">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => handleToolChange("pencil")}
                                className={`${tool === "pencil" ? "bg-gray-700" : ""} text-white p-2 rounded  w-[60px] shadow-xl`}
                            >
                                <PencilIcon className="h-5 w-5" />
                            </Button>

                        </TooltipTrigger>
                        <TooltipContent>Pencil Tool</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => handleToolChange("rect")}
                                className={`${tool === "rect" ? "bg-gray-700" : ""} text-white p-2 rounded  w-[60px] shadow-xl`}
                            >
                                <RectangleEllipsisIcon className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Rectangle Tool</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => handleToolChange("circle")}
                                className={`${tool === "circle" ? "bg-gray-700" : ""} text-white p-2 rounded  w-[60px] shadow-xl`}
                            >
                                <CircleIcon className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Circle Tool</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={handleClear}
                                className="bg-red-500 text-white"
                            >
                                <EraserIcon className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear Canvas</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button

                                className={` text-white p-2 rounded  w-[60px] shadow-xl`}
                            >
                                <PaletteIcon className="h-5 w-5" />
                                <span className="sr-only">Select Color</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Select Color</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="grid grid-cols-3 gap-2 p-2">
                                {['red', 'green', 'blue', 'yellow', 'purple', 'pink'].map((color) => (
                                    <Button
                                        key={color}
                                        variant="ghost"
                                        className={`h-8 w-8 rounded-full bg-${color}-500`}
                                        onClick={() => handleColorChange(color)}
                                    />
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button

                                className={` text-white p-2 rounded  w-[60px] shadow-xl`}
                            >
                                <BrushIcon className="h-5 w-5" />
                                <span className="sr-only">Select Stroke Width</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Select Stroke Width</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="grid grid-cols-3 gap-2 p-2">
                                {[2, 5, 10].map((width) => (
                                    <Button
                                        key={width}
                                        variant="ghost"
                                        className={`h-8 w-8 ${strokeWidth === width ? "bg-gray-300" : ""}`}
                                        onClick={() => handleStrokeWidthChange(width)}
                                    >
                                        {width === 2 ? 'S' : width === 5 ? 'M' : 'L'}
                                    </Button>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TooltipProvider>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-500">Share Session</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Share Session</DialogTitle>
                            <DialogDescription>
                                Secure and fast live collaboration
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center justify-between p-4">
                            <span>{shareLink}</span>
                            <Button onClick={handleCopyLink} className="ml-4">Copy</Button>
                        </div>

                    </DialogContent>
                </Dialog>
            </header>

            <div className="flex-1">
                <WhiteBoard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    tool={tool}
                    socket={socket}
                    roomId={roomId || ''}
                    strokeWidth={strokeWidth}
                    strokeColor={strokeColor}
                />
            </div>
        </div>
    );
};

export default RoomPage;
