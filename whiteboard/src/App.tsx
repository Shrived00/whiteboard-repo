import { Route, Routes } from 'react-router-dom';
import CreateRoom from "./components/CreateRoom";
import RoomPage from "./page/Roompage"; // Ensure this path is correct



function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
