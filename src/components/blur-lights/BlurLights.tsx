import { useEffect, useState } from "react"
import { motion } from "motion/react"

import { BlurLightsProps } from "../../types/BlurLights.ts"

const BlurLights = ({
  size,
  color,
  initialPosition,
  animationDuration,
  animationDelay,
}: BlurLightsProps) => {
  const [position, setPosition] = useState(initialPosition)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setPosition({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        })
      }, animationDuration * 1000)
    }, animationDelay * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }
    , [animationDelay, animationDuration])

  return (
    <motion.div
      data-testid="motion-div"
      className={`absolute rounded-full blur-3xl opacity-0 ${color}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: position.top,
        left: position.left,
      }}
      animate={{
        opacity: [0, 0.5, 0],
      }}
      transition={{
        duration: animationDuration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}

export default BlurLights;