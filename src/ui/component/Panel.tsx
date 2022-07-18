import React, { ReactNode } from "react"

interface Props {
  title: string
  children: ReactNode
}

export const Panel: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">{title}</div>
      <div className="panel-body">{children}</div>
    </div>
  )
}
