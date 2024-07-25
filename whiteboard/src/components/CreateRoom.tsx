import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';

const CreateRoom: React.FC = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");

    const handleCreateRoom = () => {
        const newRoomId = uuid();
        navigate(`/${newRoomId}`);
    };

    const handleJoinRoom = () => {
        if (roomId.trim()) {
            navigate(`/${roomId}`);
        } else {
            alert("Please enter a valid room ID");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(e.target.value);
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mx-auto">
                <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex space-x-4">
                        <div>
                            <img alt="Profile" className="rounded-full" height="48" src="/placeholder.jpg" width="48" />
                        </div>
                        <div>
                            <div className="text-lg font-bold dark:text-white">Whiteboard</div>
                            <div className="text-sm text-gray-500 dark:text-gray-200">@shrived</div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="text-sm text-gray-800 dark:text-gray-200">
                        Welcome to Recures, your go-to whiteboard app for seamless idea sharing! Create or join rooms effortlessly and collaborate in real time. Enjoy a range of drawing tools and customization options to bring your ideas to life.
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={handleCreateRoom}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Create Room
                        </button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-slate-500">Join Room</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Join Room</DialogTitle>
                                    <DialogDescription>
                                        Secure and fast live collaboration
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col items-center p-4">
                                    <input
                                        type="text"
                                        placeholder="Enter room ID"
                                        value={roomId}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 p-2 rounded mb-2"
                                    />
                                    <Button onClick={handleJoinRoom} className="bg-blue-500 text-white">
                                        Join
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex justify-between items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center space-x-4">
                        {/* Icons can be reused here */}
                        <svg
                            className="h-4 w-4 text-gray-500 dark:text-gray-200"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M8 16H3v5" />
                        </svg>
                        <svg
                            className="h-4 w-4 text-gray-500 dark:text-gray-200"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <svg
                            className="h-4 w-4 text-gray-500 dark:text-gray-200"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                    </div>
                    <div className="flex items-center space-x-4">
                        <svg
                            className="h-4 w-4 text-gray-500 dark:text-gray-200"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                        <svg
                            className="h-4 w-4 text-gray-500 dark:text-gray-200"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Utility function to generate a unique ID
const uuid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

export default CreateRoom;
