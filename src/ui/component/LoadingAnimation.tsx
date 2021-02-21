import * as React from "react"

interface Props {
  visible: boolean
  isPageOpen: boolean
}

export const LoadingAnimation: React.FC<Props> = ({ visible, isPageOpen }) => {
  return (
    <div
      id="loading-animation"
      className={visible ? "" : "hidden"}
      style={isPageOpen ? { right: "100px" } : undefined}
    >
      <div className="spinner" role="status"></div>
    </div>
  )
}
