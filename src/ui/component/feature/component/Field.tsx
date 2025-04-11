import React, { ReactNode, useMemo } from "react"
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
  const trimmedValue = useMemo(() => trim(value), [value])
  if (!children && !trimmedValue) {
    return null
  }
  return (
    <Form.Group as={Row} controlId={label}>
      <Form.Label
        column
        xs={{ span: suffixColum ? 11 : 12, order: 1 }}
        sm={{ span: 3, order: 1 }}
        className="fw-bold"
      >
        {label}
      </Form.Label>
      <Col
        xs={{ span: 12, order: 3 }}
        sm={{ span: suffixColum ? 8 : 9, order: 2 }}
      >
        <div className="form-control-plaintext">{children ?? trimmedValue}</div>
      </Col>
      {suffixColum && (
        <Col xs={{ span: 1, order: 2 }} sm={{ span: 1, order: 3 }}>
          {suffixColum}
        </Col>
      )}
    </Form.Group>
  )
}
