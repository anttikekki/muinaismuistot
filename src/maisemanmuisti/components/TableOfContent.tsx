import React from "react"

export const TableOfContent: React.FC = () => {
  return (
    <>
      <h2>Sisällys</h2>
      <ol>
        <li>
          <a href="#tarkoitus">Tietokannan tarkoitus</a>
        </li>
        <li>
          <a href="#lisenssit">Lisenssit</a>
        </li>
        <li>
          <a href="#rakenne">Aineiston rakenne</a>
        </li>
        <li>
          <a href="#lataus">Aineiston lataus</a>
        </li>
        <li>
          <a href="#listaus">Aineston listaus</a>
        </li>
      </ol>
    </>
  )
}
