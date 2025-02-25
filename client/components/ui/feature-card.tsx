"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { FeatureModal } from "./feature-modal";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const getFeatureDetails = (title: string) => {
  switch (title) {
    case "Smart Payment Splits":
      return [
        "AI-Powered Decision Making",
        "Our advanced machine learning algorithms analyze your spending patterns and card benefits in real-time.",
        "Automatic Optimization",
        "We automatically determine the best way to split payments across your cards to maximize rewards.",
        "Dynamic Adjustments",
        "As your spending patterns change or new card offers become available, our system adapts to ensure you always get the best returns.",
        "Transaction Categories",
        "We consider merchant categories, seasonal bonuses, and special promotions when making split recommendations.",
      ];
    case "Card Recommendations":
      return [
        "Personalized Suggestions",
        "Get credit card recommendations tailored to your unique spending habits and preferences.",
        "Reward Optimization",
        "We analyze your current cards and suggest new ones that could increase your overall rewards earnings.",
        "Application Timing",
        "Receive smart suggestions about when to apply for new cards to maximize sign-up bonuses.",
        "Benefit Analysis",
        "Compare card benefits, annual fees, and potential rewards to make informed decisions about your credit card portfolio.",
      ];
    case "Secure Analysis":
      return [
        "Bank-Level Security",
        "Your data is protected with the same encryption standards used by major financial institutions.",
        "Privacy First",
        "We never share your personal information or transaction data with third parties.",
        "Read-Only Access",
        "Our system can only view your transaction data, never make changes to your accounts.",
        "Regular Audits",
        "We conduct regular security audits and penetration testing to ensure your data remains protected.",
      ];
    default:
      return [];
  }
};

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const details = getFeatureDetails(title);

  return (
    <>
      <motion.div
        className="relative group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
        <div className="relative bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/10 group-hover:border-white/20 transition-colors">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/15 transition-colors">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-white/80 leading-relaxed">
              {description}
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm pt-2">
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </motion.div>

      <FeatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        icon={icon}
      >
        <div className="space-y-6">
          {details.map((detail, index) => {
            if (index % 2 === 0) {
              return (
                <div key={detail} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white/90" />
                    <h4 className="text-lg font-medium text-white">{detail}</h4>
                  </div>
                  <p className="text-white/80 pl-7">{details[index + 1]}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </FeatureModal>
    </>
  );
};
