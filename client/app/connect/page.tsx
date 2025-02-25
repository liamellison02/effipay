"use client";

import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion } from "framer-motion";
import { Lock, Shield, Ban as Bank, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePlaidLink } from "react-plaid-link";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ConnectPage() {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch("/api/plaid/create_link_token", {
          method: "POST",
        });
        const { link_token } = await response.json();
        setLinkToken(link_token);
      } catch (error) {
        console.error("Error creating link token:", error);
      }
    };

    createLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      setLoading(true);
      try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch("/api/plaid/exchange_public_token", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ public_token }),
        });

        if (response.ok) {
          router.push("/recommendation");
        } else {
          console.error("Failed to exchange public token");
        }
      } catch (error) {
        console.error("Error exchanging public token:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleConnect = () => {
    if (ready) {
      open();
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
            <p>One last step to unlock personalized recommendations</p>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Glass background effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20" />
          
          {/* Content */}
          <div className="relative p-8 md:p-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-white mb-3">Connect Your Bank Account</h2>
              <p className="text-white/80 text-lg">
                Securely connect your accounts to get the most out of effipay
              </p>
            </div>

            {/* Security Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
              {[
                {
                  icon: Lock,
                  title: "Bank-Level Security",
                  description: "Your data is encrypted and securely stored",
                },
                {
                  icon: Shield,
                  title: "Privacy Protected",
                  description: "We never share your personal information",
                },
                {
                  icon: Bank,
                  title: "Read-Only Access",
                  description: "We can only view your transactions",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                  className="relative group"
                >
                  <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                    <feature.icon className="h-10 w-10 text-white mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Connect Button Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6"
            >
              <div className="flex flex-col items-center">
                <img 
                  src="assets/images/plaid-logo-white.svg" 
                  alt="Plaid" 
                  className="h-20 mb-6 opacity-80"
                />
                <Button
                  onClick={handleConnect}
                  disabled={!ready || loading}
                  className="bg-white text-[#FF5757] hover:bg-white/90 hover:text-[#FF5757]/90 transition-colors py-6 px-8 text-lg font-medium rounded-xl flex items-center gap-3"
                >
                  {loading ? (
                    "Connecting..."
                  ) : (
                    <>
                      Connect Your Bank Account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Terms */}
            <div className="text-center text-white/60 text-sm">
              By connecting your account, you agree to our{" "}
              <a href="#" className="text-white hover:text-white/90 underline underline-offset-4 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-white hover:text-white/90 underline underline-offset-4 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}