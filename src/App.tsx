import {  RouterProvider } from "react-router-dom"
import { router } from "./router";



function App() {
  return (
    <div className="bg-primary text-white">
        <RouterProvider router={router} />
    </div>
  )
}

export default App
