"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Settings2, 
  Rocket, 
  Layout, 
  Palette, 
  Building2, 
  Sliders, 
  Globe, 
  Layers,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const GUIDE_STEPS = [
  {
    id: 1,
    title: "Choose Your Theme",
    description: "Start by selecting a professional color palette and style from the Themes Option to set the mood for your entire website.",
    icon: Palette,
    color: "bg-blue-500",
    link: "/website/home",
    linkLabel: "Configure Themes"
  },
  {
    id: 2,
    title: "Setup Header & Logo",
    description: "Establish your brand by uploading your company logo and configuring the top navigation menu for easy user access.",
    icon: Building2,
    color: "bg-indigo-500",
    link: "/website/home",
    linkLabel: "Manage Header"
  },
  {
    id: 3,
    title: "Add Hero Sliders",
    description: "Create a powerful first impression with dynamic sliders. Add high-quality images and promotional text to the home hero section.",
    icon: Sliders,
    color: "bg-purple-500",
    link: "/website/home",
    linkLabel: "Add Sliders"
  },
  {
    id: 4,
    title: "Populate Sections",
    description: "Manage your core content by adding About Us details, Testimonials, and Gallery items to show your expertise.",
    icon: Layout,
    color: "bg-rose-500",
    link: "/website/home",
    linkLabel: "Manage Pages"
  },
  {
    id: 5,
    title: "Social Connectivity",
    description: "Connect your social media profiles to stay engaged with your customers and build trust across all platforms.",
    icon: Globe,
    color: "bg-cyan-500",
    link: "/website/home",
    linkLabel: "Social Links"
  },
  {
    id: 6,
    title: "Finalize Footer",
    description: "Complete your home page with a professional footer containing contact info, quick links, and your official copyright statement.",
    icon: Layers,
    color: "bg-green-500",
    link: "/website/home",
    linkLabel: "Setup Footer"
  }
];

export default function WebsiteHomePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % GUIDE_STEPS.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev) => (prev + 1) % GUIDE_STEPS.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev) => (prev - 1 + GUIDE_STEPS.length) % GUIDE_STEPS.length);
  };

  const CurrentIcon = GUIDE_STEPS[activeStep].icon;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-gray-50/30 dark:bg-transparent">
      {/* Page Header */}
      <div className="max-w-[1700px] mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-black tracking-tight text-[#1e293b] dark:text-white uppercase leading-none font-poppins">Home</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-poppins">Manage and select your website's home components</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Carousel Guide */}
        <div className="lg:col-span-12">
          <Card className="border-none shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white dark:bg-sidebar min-h-[550px] flex flex-col relative group">
            <CardContent className="p-0 flex-1 flex flex-col md:flex-row">
              
              {/* Image/Visual Side */}
              <div className={cn(
                "md:w-5/12 p-12 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700",
                GUIDE_STEPS[activeStep].color
              )}>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-20 opacity-20 transform translate-x-1/2 -translate-y-1/2">
                   <div className="size-64 rounded-full border-[20px] border-white" />
                </div>
                <div className="absolute top-0 left-0 p-8 opacity-20">
                   <span className="text-8xl font-black text-white tracking-tighter">
                     0{GUIDE_STEPS[activeStep].id}
                   </span>
                </div>

                {/* Main Icon */}
                <div className="relative z-10 transition-all duration-500 scale-110 md:scale-125">
                   <div className="p-8 rounded-[3rem] bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
                      <CurrentIcon className="size-24 text-white" strokeWidth={1.5} />
                   </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 mt-12 relative z-10">
                  {GUIDE_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveStep(i); setIsAutoPlaying(false); }}
                      className={cn(
                        "h-1.5 transition-all duration-500 rounded-full",
                        activeStep === i ? "w-8 bg-white" : "w-1.5 bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Content Side */}
              <div className="md:w-7/12 p-8 md:p-16 flex flex-col justify-center space-y-8 bg-white dark:bg-sidebar relative">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-6 py-2 rounded-full text-white text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gray-200 dark:shadow-none",
                      GUIDE_STEPS[activeStep].color
                    )}>
                      Step {GUIDE_STEPS[activeStep].id}
                    </span>
                    <div className="flex items-center gap-1.5 text-green-500 ml-2">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Home Setup Guide</span>
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-[#1e293b] dark:text-white tracking-tight leading-tight font-poppins">
                    {GUIDE_STEPS[activeStep].title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl font-poppins">
                    {GUIDE_STEPS[activeStep].description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link href={GUIDE_STEPS[activeStep].link}>
                    <Button className="h-14 px-8 bg-[#1e293b] hover:bg-black dark:bg-white dark:text-black text-white font-black text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-xl transition-all hover:-translate-y-1 duration-300">
                      <span>{GUIDE_STEPS[activeStep].linkLabel}</span>
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>

                  <div className="flex items-center gap-3 ml-auto">
                    <Button 
                      variant="outline" 
                      onClick={handlePrev}
                      className="size-14 rounded-2xl border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-400 hover:text-gray-900"
                    >
                      <ArrowLeft size={20} />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleNext}
                      className="size-14 rounded-2xl border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-400 hover:text-gray-900"
                    >
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                </div>

                {/* Decorative Sparkle */}
                <div className="absolute top-8 right-8 opacity-10">
                   <Sparkles size={80} className="text-gray-400" />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Action Suggestion
        <div className="lg:col-span-12 flex items-center justify-center pt-8">
            <div className="flex items-center gap-4 px-8 py-4 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
               <Settings2 className="text-blue-600 size-5" />
               <p className="text-sm font-bold text-blue-900 dark:text-blue-300 font-poppins">
                 Need more help? Check the <Link href="/help" className="underline decoration-2 underline-offset-4 hover:text-blue-700">documentation</Link> or contact support.
               </p>
            </div>
        </div> */}
      </div>
    </div>
  );
}

