import "bootstrap-icons/font/bootstrap-icons.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { createRoot } from "react-dom/client"
import { Content } from "./components/Content"

const root = createRoot(document.getElementById("root")!)
root.render(<Content />)
