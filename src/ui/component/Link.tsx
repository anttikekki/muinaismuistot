import React from "react"

interface Props {
  text: string
  url?: string
}

export const Link: React.FC<Props> = ({ text, url }) => {
  return url ? (
    <a href={url} target="_blank">
      {text}
    </a>
  ) : (
    <span>{text}</span>
  )
}
