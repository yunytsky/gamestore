import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Game from "./views/Game";
import Profile from "./views/Profile";
import InsufficientFunds from "./views/InsufficientFunds";
import NotFound from "./views/NotFound";
import Store from "./views/Store";
import Cart from "./views/Cart";
import Login from "./views/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Library from "./views/Library";
import AddFunds from "./views/AddFunds";
import SuccessfullPurchase from "./views/SuccessfullPurchase";
import Purchase from "./views/Purchase";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout/>}>
        <Route element={<ProtectedRoute/>}>
          <Route path="store" element={<Store/>}/>
          <Route path="store/game/:gameId" element={<Game/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="insufficient-funds" element={<InsufficientFunds/>}/>
          <Route path="library" element={<Library/>}/>
          <Route path="cart" element={<Cart/>}/>
          <Route path="add-funds" element={<AddFunds/>}/>
          <Route path="purchase" element={<Purchase/>}/>
          <Route path="successfull-purchase" element={<SuccessfullPurchase/>}/>
        </Route>

        <Route path="login" element={<Login/>}/>


      <Route path="*" element={<NotFound/>}/>
    </Route>
    
  )
)

function App() {

  return (
    <div className="app">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
