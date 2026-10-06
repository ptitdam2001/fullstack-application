type NavigateFn = (path: string, options?: { replace?: boolean }) => void

let _navigate: NavigateFn = (path, options) => {
  if (options?.replace) {
    window.location.replace(path)
  } else {
    window.location.href = path
  }
}

export const navigate: NavigateFn = (path, options) => _navigate(path, options)

export const setNavigateFn = (fn: NavigateFn) => {
  _navigate = fn
}
