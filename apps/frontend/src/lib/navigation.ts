let _navigate: ((path: string) => void) | null = null;

export function setNavigate(fn: (path: string) => void) {
  _navigate = fn;
}

export function navigate(path: string) {
  _navigate?.(path);
}
