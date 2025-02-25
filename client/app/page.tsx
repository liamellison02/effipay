"use client";

import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FeatureCard } from "@/components/ui/feature-card";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Shield, Sparkles, Wallet, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FF5757] flex items-center justify-center">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full transform -rotate-6 scale-110" />
              <h1 className="relative text-7xl tracking-tight text-white mb-2 effipay-font">
                effipay
              </h1>
            </motion.div>
            
            <p className="text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Experience the future of payments with AI-driven optimization that maximizes your rewards on every transaction.
            </p>

            <div className="flex items-center gap-3 text-white/80 text-lg">
              <Zap className="h-5 w-5" />
              <span>Intelligent Splits</span>
              <span className="mx-2">•</span>
              <Wallet className="h-5 w-5" />
              <span>Smart Rewards</span>
              <span className="mx-2">•</span>
              <Shield className="h-5 w-5" />
              <span>Bank-Grade Security</span>
            </div>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center gap-4"
          >
            <Link href="/login">
              <Button 
                size="lg" 
                variant="secondary" 
                className="gap-2 text-[#FF5757] hover:text-[#FF5757]/90 text-lg px-8 py-6"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-[#FF5757] hover:bg-white/90 hover:text-[#FF5757]/90 text-lg px-8 py-6"
              >
                Get Started <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-16"
          >
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-white" />}
              title="Smart Payment Splits"
              description="Our ML algorithms analyze your cards and automatically split payments to maximize rewards on every transaction."
            />
            
            <FeatureCard
              icon={<CreditCard className="h-8 w-8 text-white" />}
              title="Card Recommendations"
              description="Get personalized card suggestions that perfectly match your spending patterns and reward preferences."
            />
            
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-white" />}
              title="Secure Analysis"
              description="Enterprise-grade security ensures your financial data is protected while we optimize your rewards."
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}