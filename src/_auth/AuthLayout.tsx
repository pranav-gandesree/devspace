import { BackgroundBeams } from "@/components/ui/background-beams";
import { Outlet } from "react-router-dom";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { additionalTestimonials, testimonials } from "@/data/testimonials";
import { Spotlight } from "@/components/ui/spotlight";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const AuthLayout = () => {
  
  const words = [
    {
      text :'Dive',
      className : 'text-neutral-300'
    },
    {
      text :'into',
      className : 'text-neutral-300'
    },
    {
      text :'the',
      className : 'text-neutral-300'
    },
    {
      text :'world of',
      className : 'text-neutral-300'
    },
    {
      text : 'DEVS',
      className : 'text-blue-400'
    }
  ]
  return (
    <>
    
        <>
          <div className="h-screen w-full flex bg-neutral-950 antialiased ">
            <Spotlight
              className="-top-20 left-20 md:-left-5 md:-top-80 "
              fill="white"
            />
            <div className="h-screen w-full lg:w-2/3 rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
              <div className="max-w-2xl  p-4 mb-4">
                <h1 className="relative text-3xl md:text-5xl lg:text-6xl  xl:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
                  Work Hive
                </h1>
                <p></p>
                <p className="hidden md:block text-neutral-500 max-w-lg mx-auto my-1 text-sm text-center relative z-10">
                  Work Hive gives you the best platform to share your dev life{" "}
                  <br />
                  Look for your next job at our Job Board
                </p>
              </div>
              <div className="flex flex-col items-center justify-center w-full z-10">
                <Outlet />
              </div>
            </div>

            <div className="lg:flex flex-col w-2/4 hidden bg-dot-white/[0.05] justify-center ">
              <TypewriterEffectSmooth words={words} className="justify-center"/>
              <div className="rounded-md flex flex-col antialiase  justify-center items-center relative overflow-hidden">
                <InfiniteMovingCards
                  items={testimonials}
                  direction="right"
                  speed="slow"
                />
              </div>
              <div className=" rounded-md flex flex-col antialiase justify-center items-center relative overflow-hidden">
                <InfiniteMovingCards
                  items={additionalTestimonials}
                  direction="left"
                  speed="slow"
                />
              </div>
            </div>

            <BackgroundBeams />
          </div>
        </>
    
    </>
  );
};

export default AuthLayout;
