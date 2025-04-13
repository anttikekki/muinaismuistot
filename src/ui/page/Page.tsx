import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { Container, Offcanvas } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { ActionTypeEnum } from "../../store/actionTypes"
import { AppDispatch, PageId, Settings } from "../../store/storeTypes"
import { PageHeader } from "./PageHeader"

interface Props {
  title: string
  pageId: PageId
  children: ReactNode
}

export const Page: React.FC<Props> = ({ title, pageId, children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const visiblePage = useSelector((settings: Settings) => settings.visiblePage)
  const [isPageVisible, setPageVisibility] = useState<boolean>(false)

  useEffect(() => {
    setPageVisibility(visiblePage === pageId)
  }, [visiblePage, isPageVisible])

  const onHidePage = useCallback(() => {
    dispatch({
      type: ActionTypeEnum.SHOW_PAGE,
      pageId: undefined
    })
  }, [dispatch])

  return (
    <Offcanvas
      placement="end"
      show={isPageVisible}
      onHide={onHidePage}
      scroll={true}
      backdrop={false}
    >
      <Offcanvas.Header closeButton>
        <PageHeader title={title} />
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Container className="ps-0 pe-0">{children}</Container>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
