import React from "react"

interface Props {
  text: string
  url?: string
}

export const Link: React.FC<Props> = ({ text, url }) => {
  return url ? (
    <p>
      <a href={url} target="_blank">
        {text}
      </a>
    </p>
  ) : (
    <p>{text}</p>
  )
}
