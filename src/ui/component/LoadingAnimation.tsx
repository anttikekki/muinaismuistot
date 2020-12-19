import * as React from "react"
import { Spinner } from "react-bootstrap"

interface Props {
  visible: boolean
}

export const LoadingAnimation: React.FC<Props> = ({ visible }) => {
  if (!visible) {
    return null
  }
  return (
    <Spinner animation="border" role="status" id="loading-animation">
      <span className="sr-only">Ladataan...</span>
    </Spinner>
  )
}
