type NavigateFn = (path: string, options?: { replace?: boolean }) => void

let _navigate: NavigateFn = (path, options) => {
  options?.replace ? window.location.replace(path) : (window.location.href = path)
}

export const setNavigateFn = (fn: NavigateFn) => {
  _navigate = fn
}
