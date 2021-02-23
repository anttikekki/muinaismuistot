import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Settings } from "../../store/storeTypes"

export const LoadingAnimation: React.FC = () => {
  const [loadingAnimationTimeoutID, setLoadingAnimationTimeoutID] = useState<
    number | undefined
  >()
  const loadingAnimationTimeoutIDRef = useRef(loadingAnimationTimeoutID)
  loadingAnimationTimeoutIDRef.current = loadingAnimationTimeoutID

  const [renderLoadingAnimation, setRenderLoadingAnimation] = useState<boolean>(
    false
  )
  const showLoadingAnimation = useSelector(
    (settings: Settings) => settings.showLoadingAnimation
  )
  const isPageOpen = useSelector(
    (settings: Settings) => settings.visiblePage !== undefined
  )

  useEffect(() => {
    if (showLoadingAnimation) {
      const id = window.setTimeout(() => {
        if (loadingAnimationTimeoutIDRef.current) {
          // Pending loading animation is still valid, render spinner
          setRenderLoadingAnimation(true)
        }
      }, 300)
      setLoadingAnimationTimeoutID(id)
    } else {
      // Cancel pending loading animation and hide spinner
      window.clearTimeout(loadingAnimationTimeoutIDRef.current)
      setLoadingAnimationTimeoutID(undefined)
      setRenderLoadingAnimation(false)
    }
  }, [showLoadingAnimation])

  return (
    <div
      id="loading-animation"
      className={renderLoadingAnimation ? "" : "hidden"}
      style={isPageOpen ? { right: "100px" } : undefined}
    >
      <div className="spinner" role="status"></div>
    </div>
  )
}
