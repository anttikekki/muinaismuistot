import * as React from "react"
import { Form } from "react-bootstrap"
import { trim } from "../../../../common/util/featureParser"

interface Props {
  label: string
  value?: string
}

export const Field: React.FC<Props> = ({ label, value, children }) => {
  const trimmedValue = trim(value)
  if (!children && !trimmedValue) {
    return null
  }
  return (
    <Form.Group>
      <Form.Label>
        <b>{label}</b>
      </Form.Label>
      {children ? children : <p>{trimmedValue}</p>}
    </Form.Group>
  )
}
