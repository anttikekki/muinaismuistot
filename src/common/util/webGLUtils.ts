let isSupported: undefined | boolean = undefined;

export const isWebGLSupported = () => {
  if (isSupported !== undefined) {
    return isSupported;
  }

  try {
    const canvas = document.createElement("canvas");
    isSupported = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    isSupported = false;
  }

  return isSupported;
};
