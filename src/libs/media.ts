const getResource = (pth: any) => new URL(pth, import.meta.url).href;

export {
  getResource
}