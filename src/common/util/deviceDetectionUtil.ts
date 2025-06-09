export interface NavigatorUAData {
  readonly mobile: boolean;
}

let isMobile: boolean | undefined;

export const isMobileDevice = (): boolean => {
  if (isMobile !== undefined) {
    return isMobile;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
  const userAgentData = (navigator as any)["userAgentData"] as
    | NavigatorUAData
    | undefined;
  if (userAgentData && !!userAgentData.mobile) {
    isMobile = true;
  } else if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    isMobile = true;
  } else {
    isMobile = false;
  }
  return isMobile;
};
