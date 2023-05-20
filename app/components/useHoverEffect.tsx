import { useEffect, useState } from "react"

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })
  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener("mousemove", updateMousePosition)
    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])
  return mousePosition
}

export function useHoverEffect({ ref }: { ref: React.RefObject<HTMLElement> }) {
  const mousePosition = useMousePosition()

  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const element = ref.current

    if (!element) return
    if (!mousePosition.x || !mousePosition.y) return

    const rect = element.getBoundingClientRect()
    setOffsetX(mousePosition.x - rect.left - rect.width / 2)
    setOffsetY(mousePosition.y - rect.top - rect.height / 2)
  }, [mousePosition, ref])

  return function Effect() {
    return (
      <div
        style={{
          ["--x" as any]: `${offsetX / 8}px`,
          ["--y" as any]: `${offsetY / 6}px`,
        }}
        className="absolute inset-0 -z-10 translate-x-[var(--x)] translate-y-[var(--y)] rounded-[inherit] opacity-0 group-hover:bg-gray-800 group-hover:opacity-10"
      />
    )
  }
}
