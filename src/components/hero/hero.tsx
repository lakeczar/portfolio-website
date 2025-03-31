import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import BlurredLight from "../blur-lights/BlurLights"
import alekRaczProfile from '../../assets/images/alekRaczProfile.jpg'
import { blurLights } from "../../utils/blurLightsConstants"
import { BlurredLightsProps } from "../../types/BlurredLights"

const Hero = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render animations on client side to avoid hydration issues
  if (!mounted) {
    return (
      <section className="relative w-full overflow-hidden bg-black min-h-[90vh] flex items-center justify-center">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex flex-col space-y-4 text-left md:max-w-[50%]">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                Alek Racz
              </h1>
              <p className="max-w-[600px] text-gray-300 flex flex-col md:text-xl">
                Full-Stack Software Engineer
                <span className="text-gray-300 text-sm mr-2">(Front-End Focused)</span>
              </p>
            </div>

            <div className="relative w-full md:w-[40%] aspect-square max-w-[450px] mx-auto md:mx-0">
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10">
                <img
                  src={alekRaczProfile}
                  alt="Alek Racz"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 -z-10" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full overflow-hidden  min-h-[90vh] flex items-center justify-center px-8 md:px-24 dark:bg-slate-950">
      {blurLights.map(({size, color, initialPosition, animationDuration, animationDelay}: BlurredLightsProps, index: number) => {
        return (
            <BlurredLight
              key={index}
              size={size}
              color={color}
              initialPosition={initialPosition}
              animationDuration={animationDuration}
              animationDelay={animationDelay}
            />
        )
        })
      }
       

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-col space-y-4 text-left md:max-w-[50%]">
            <motion.h1
              className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Alek Racz
            </motion.h1>
            <motion.p
              className="max-w-[600px] text-gray-300 flex flex-col md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >

              Full-Stack Software Engineer
              <motion.span
                className="text-gray-300 text-sm mr-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                (Front-End Focused)
              </motion.span>
            </motion.p>
          </div>

          <motion.div
            className="relative w-full md:w-[40%] aspect-square max-w-[450px] mx-auto md:mx-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10">
              <img src={alekRaczProfile} alt="Alek Racz" className="object-cover w-full h-full text-center" style={{lineHeight: '400px'}} />
            </div>
            <div className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
};

export default Hero;
