import "bootstrap-icons/font/bootstrap-icons.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import { createRoot } from "react-dom/client"
import { Content } from "./components/Content"

const targetElement = document.getElementById("root")
if (!targetElement) {
  throw new Error("UI:n elementti puuttuu DOMista")
}

const root = createRoot(targetElement)
root.render(<Content />)
