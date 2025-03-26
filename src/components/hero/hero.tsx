import { useState, useEffect } from "react"
import { motion } from "motion/react"
import BlurredLight from "./BlurLights"
import alekRaczProfile from '../../assets/images/alekRaczProfile.jpg'

const blurredLights = [
  {
    size: 300,
    color: "bg-purple-500",
    initialPosition: { top: "20%", left: "10%" },
    animationDuration: 8,
    animationDelay: 0
  },
  {
    size: 400,
    color: "bg-blue-500",
    initialPosition: { top: "60%", left: "60%" },
    animationDuration: 10,
    animationDelay: 2
  },
  {
    size: 250,
    color: "bg-pink-500",
    initialPosition: { top: "10%", left: "70%" },
    animationDuration: 7,
    animationDelay: 1
  },
  {
    size: 350,
    color: "bg-cyan-500",
    initialPosition: { top: "70%", left: "20%" },
    animationDuration: 9,
    animationDelay: 3
  },
  {
    size: 200,
    color: "bg-emerald-500",
    initialPosition: { top: "40%", left: "40%" },
    animationDuration: 6,
    animationDelay: 2.5
  }
];

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
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                <span className="text-gray-300 text-sm mr-2">(Front-End Focused)</span>
                Full-Stack Software Engineer
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
    <section className="relative w-full overflow-hidden  min-h-[90vh] flex items-center justify-center px-24 dark:bg-slate-950">
      {blurredLights.map((light, index) => {
        return (
            <BlurredLight
              key={index}
              size={light.size}
              color={light.color}
              initialPosition={light.initialPosition}
              animationDuration={light.animationDuration}
              animationDelay={light.animationDelay}
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
              transition={{ duration: 0.5 }}
            >
              Alek Racz
            </motion.h1>
            <motion.p
              className="max-w-[600px] text-gray-300 flex flex-col-reverse lg:flex-row md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.span
                className="text-gray-300 text-sm mr-2 lg:self-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                (Front-End Focused)
              </motion.span>
              Full-Stack Software Engineer
            </motion.p>
          </div>

          <motion.div
            className="relative w-full md:w-[40%] aspect-square max-w-[450px] mx-auto md:mx-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
