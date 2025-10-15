import React, { ReactNode } from "react"

interface Params<T> {
  data: T[]
  contentFn: (row: T) => ReactNode
}

export const List = <T extends string | string[]>({
  data,
  contentFn
}: Params<T>) => {
  if (data.length === 0) {
    return null
  }
  if (data.length === 1) {
    return contentFn(data[0])
  }

  return (
    <ul>
      {data.map((row) => (
        <li key={String(row)}>{contentFn(row)}</li>
      ))}
    </ul>
  )
}
