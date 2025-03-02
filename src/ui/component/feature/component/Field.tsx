import React, { ReactNode } from "react"
import { Col, Form, Row } from "react-bootstrap"
import { trim } from "../../../../common/util/featureParser"

interface Props {
  label: string
  value?: string | null
  children?: ReactNode
}

export const Field: React.FC<Props> = ({ label, value, children }) => {
  const trimmedValue = trim(value)
  if (!children && !trimmedValue) {
    return null
  }
  return (
    <Form.Group as={Row} controlId={label}>
      <Form.Label column sm="3" className="fw-bold">
        {label}
      </Form.Label>
      {children ? (
        <Col sm="9">
          <div className="form-control-plaintext">{children}</div>
        </Col>
      ) : (
        <Col sm="9">
          <Form.Control plaintext readOnly defaultValue={trimmedValue} />
        </Col>
      )}
    </Form.Group>
  )
}
