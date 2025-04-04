import React, { ReactNode } from "react"
import { Card, Form } from "react-bootstrap"

interface Props {
  title: string
  showEnablerSwitch?: boolean
  enabled?: boolean
  onSwitchChange?: () => void
  children: ReactNode
}

export const Panel: React.FC<Props> = ({
  title,
  showEnablerSwitch,
  enabled,
  onSwitchChange,
  children
}) => {
  return (
    <Card className="mb-4">
      <Card.Header>
        {showEnablerSwitch ? (
          <Form.Check
            type="switch"
            id={title}
            label={title}
            checked={enabled}
            onChange={() => onSwitchChange?.()}
          />
        ) : (
          title
        )}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  )
}
