import React, { ReactNode } from "react"
import { Col, Form, Row } from "react-bootstrap"
import { trim } from "../../../../common/util/featureParser"

interface Props {
  label: string
  value?: string | null
  children?: ReactNode
  suffixColum?: ReactNode
}

export const Field: React.FC<Props> = ({
  label,
  value,
  children,
  suffixColum
}) => {
  const trimmedValue = trim(value)
  if (!children && !trimmedValue) {
    return null
  }
  return (
    <Form.Group as={Row} controlId={label}>
      <Form.Label column xs="3" className="fw-bold">
        {label}
      </Form.Label>
      <Col xs={suffixColum ? "8" : "9"}>
        <div className="form-control-plaintext">{children ?? trimmedValue}</div>
      </Col>
      {suffixColum && <Col xs="1">{suffixColum}</Col>}
    </Form.Group>
  )
}
