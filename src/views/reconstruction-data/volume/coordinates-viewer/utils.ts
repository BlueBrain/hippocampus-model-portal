let canvas: HTMLCanvasElement | null = null

export function getGradientCanvas(): HTMLCanvasElement {
  if (!canvas) {
    canvas = document.createElement("canvas")
    canvas.width = 2048
    canvas.height = 1
    const ctx = canvas.getContext("2d")
    if (!ctx) throw Error("Unable to get 2D context on canvas!")

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
    grad.addColorStop(0, "#7b7")
    grad.addColorStop(0.1, "#4e4")
    grad.addColorStop(0.5, "#dd2")
    grad.addColorStop(0.9, "#e44")
    grad.addColorStop(1, "#b77")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  return canvas
}
