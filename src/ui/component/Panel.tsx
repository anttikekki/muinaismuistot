import React, { ReactNode } from "react"
import { Card } from "react-bootstrap"

interface Props {
  title: string
  children: ReactNode
}

export const Panel: React.FC<Props> = ({ title, children }) => {
  return (
    <Card className="mb-4">
      <Card.Header>{title}</Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  )
}
