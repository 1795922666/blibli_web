declare global {
  export interface Window {
    $message?: import('naive-ui').MessageProviderInst
    $loadingBar?: import('naive-ui').LoadingBarProviderInst
  }
}
export {}
