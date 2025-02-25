"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion } from "framer-motion";
import {
  Plane,
  ShoppingBag,
  Utensils,
  Car,
  ArrowRight,
  Percent,
  Gift,
  Sparkles,
  Map,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PreferencesPage() {
  const router = useRouter();
  const [rewardType, setRewardType] = useState('cashback');
  const [categories, setCategories] = useState({
    travel: false,
    shopping: false,
    dining: false,
    transportation: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      // Save preferences to MongoDB
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preferences: {
            rewardType,
            spendingCategories: categories
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      // Navigate to connect page
      router.push('/connect');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FF5757] flex items-center justify-center overflow-hidden py-12 px-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-4xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/">
            <h1 className="text-4xl text-white mb-2" style={{ fontFamily: 'BauhausStd, var(--font-sans)' }}>
              effipay
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Sparkles className="h-4 w-4" />
            <p>Let's personalize your experience</p>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Glass background effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20" />
          
          {/* Content */}
          <div className="relative p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Rewards Type Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-2">Reward Type</h2>
                  <p className="text-white/80">Choose your preferred type of rewards</p>
                </div>
                
                <RadioGroup 
  value={rewardType} 
  onValueChange={setRewardType} 
  className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      id: "cashback",
                      icon: Percent,
                      title: "Cash Back",
                      description: "Get money back on your purchases",
                      highlight: "Up to 5% back on select categories",
                    },
                    {
                      id: "miles",
                      icon: Plane,
                      title: "Miles",
                      description: "Earn airline miles on purchases",
                      highlight: "2x-3x miles on travel and dining",
                    },
                    {
                      id: "points",
                      icon: Gift,
                      title: "Points",
                      description: "Earn points for flexible redemption",
                      highlight: "2x-5x points on popular categories",
                    },
                  ].map((option) => (
                    <Label
                      key={option.id}
                      htmlFor={option.id}
                      className="relative group cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative h-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative flex flex-col bg-white/10 border-2 border-white/20 rounded-2xl p-8 group-hover:border-white/40 group-data-[state=checked]:border-white group-data-[state=checked]:bg-white/20 transition-all duration-300">
                          {/* Radio button and icon header */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <RadioGroupItem 
                                value={option.id} 
                                id={option.id} 
                                className="h-6 w-6 border-2 border-white/30 text-white data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-[#FF5757]" 
                              />
                              <span className="font-semibold text-xl text-white">{option.title}</span>
                            </div>
                            <option.icon className="h-8 w-8 text-white" />
                          </div>
                          
                          {/* Description */}
                          <p className="text-white/70 mb-4">{option.description}</p>
                          
                          {/* Highlight box */}
                          <div className="mt-auto">
                            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3 group-hover:bg-white/20 transition-colors">
                              <Sparkles className="h-4 w-4 text-white/70" />
                              <span className="text-sm text-white/90">{option.highlight}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Categories Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-2">Spending Categories</h2>
                  <p className="text-white/80">Select the categories that matter most to you</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Plane,
                      title: "Travel",
                      description: "Flights, hotels, and car rentals",
                    },
                    {
                      icon: ShoppingBag,
                      title: "Shopping",
                      description: "Retail purchases and online shopping",
                    },
                    {
                      icon: Utensils,
                      title: "Dining",
                      description: "Restaurants and food delivery",
                    },
                    {
                      icon: Car,
                      title: "Transportation",
                      description: "Gas, ride-sharing, and transit",
                    },
                  ].map((category) => (
                    <motion.label
                      key={category.title}
                      whileHover={{ scale: 1.02 }}
                      className="relative group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl p-6 group-hover:border-white/30 group-hover:bg-white/10 transition-all">
                        <input
                          type="checkbox"
                          checked={categories[category.title.toLowerCase() as keyof typeof categories]}
                          onChange={(e) => setCategories(prev => ({
                            ...prev,
                            [category.title.toLowerCase()]: e.target.checked
                          }))}
                          className="rounded border-white/20 bg-white/10 text-[#FF5757] focus:ring-white/40"
                        />
                        <category.icon className="h-6 w-6 text-white" />
                        <div>
                          <div className="font-medium text-white">{category.title}</div>
                          <div className="text-sm text-white/70">{category.description}</div>
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2 bg-white text-[#FF5757] hover:bg-white/90 hover:text-[#FF5757]/90 transition-colors py-6 mt-8"
              >
                Continue to Connect Bank <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}