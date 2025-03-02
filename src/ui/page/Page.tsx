import React, { ReactNode, useCallback, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { showPage } from "../../store/actionCreators"
import { AppDispatch, PageId, Settings } from "../../store/storeTypes"
import { PageHeader } from "./PageHeader"

export enum PageVisibility {
  Visible = "Visible",
  Closing = "Closing",
  Hidden = "Hidden"
}

interface Props {
  title: string
  pageId: PageId
  children: ReactNode
}

export const Page: React.FC<Props> = ({ title, pageId, children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const visiblePage = useSelector((settings: Settings) => settings.visiblePage)
  const [pageClosingAnimationTimeoutID, setPageClosingAnimationTimeoutID] =
    useState<number | undefined>()
  const [pageVisibility, setPageVisibility] = useState<PageVisibility>(
    PageVisibility.Hidden
  )

  useEffect(() => {
    if (visiblePage === pageId) {
      setPageVisibility(PageVisibility.Visible)
    }
    if (visiblePage !== pageId && pageVisibility === PageVisibility.Visible) {
      setPageVisibility(PageVisibility.Closing)
    }
  }, [visiblePage, pageVisibility])

  useEffect(() => {
    if (pageVisibility === PageVisibility.Closing) {
      // Start closing page
      const id = window.setTimeout(() => {
        setPageClosingAnimationTimeoutID(undefined)
        setPageVisibility(PageVisibility.Hidden)
      }, 500)
      setPageClosingAnimationTimeoutID(id)
    }
  }, [pageVisibility])

  useEffect(() => {
    if (
      pageVisibility === PageVisibility.Visible &&
      pageClosingAnimationTimeoutID !== undefined
    ) {
      // Abort closing page because it is visible again
      window.clearTimeout(pageClosingAnimationTimeoutID)
      setPageClosingAnimationTimeoutID(undefined)
    }
  }, [pageVisibility, pageClosingAnimationTimeoutID])

  let classes = ""
  switch (pageVisibility) {
    case PageVisibility.Visible:
      classes = "page-right-visible"
      break
    case PageVisibility.Closing:
      classes = "page-right-closing"
      break
    case PageVisibility.Hidden:
      classes = "page-right-hidden"
      break
  }

  const onHidePage = useCallback(() => {
    dispatch(showPage(undefined))
  }, [dispatch])

  return (
    <Container className={`page ${classes}`}>
      {pageVisibility !== PageVisibility.Hidden && (
        <PageHeader title={title} onHidePage={onHidePage} />
      )}

      {pageVisibility !== PageVisibility.Hidden && (
        <Container className="pageContent">{children}</Container>
      )}
    </Container>
  )
}
