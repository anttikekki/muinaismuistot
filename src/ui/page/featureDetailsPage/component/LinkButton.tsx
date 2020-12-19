import * as React from "react"
import { Button } from "react-bootstrap"

export const LinkButton: React.FC = ({ children }) => {
  return (
    <Button variant="link" style={{ color: "black", padding: "0" }}>
      {children}
    </Button>
  )
}
