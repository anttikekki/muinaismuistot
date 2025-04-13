import React, { useMemo } from "react"
import { Form } from "react-bootstrap"

interface ToggleAllCheckboxProps<T> {
  allValues: T[]
  selectedValues: T[]
  onSelectValues: (types: T[]) => void
  disabled?: boolean
  children: React.ReactNode
}

export const ToggleAllCheckbox = <T,>({
  allValues: allValues,
  selectedValues,
  onSelectValues,
  disabled,
  children
}: ToggleAllCheckboxProps<T>): React.ReactElement => {
  const id = useMemo(() => allValues.join("-"), [allValues])
  const isAllSelected = useMemo(
    () => allValues.every((layer) => selectedValues.includes(layer)),
    [allValues, selectedValues]
  )
  return (
    <Form.Check
      type="checkbox"
      id={id}
      onChange={() =>
        onSelectValues(
          isAllSelected
            ? selectedValues.filter((v) => !allValues.includes(v))
            : [...selectedValues, ...allValues]
        )
      }
      checked={isAllSelected}
      disabled={disabled}
      label={children}
    />
  )
}
