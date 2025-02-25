"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CreditCard, Sparkles } from "lucide-react";

export default function RecommendationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your Perfect Card Match</h1>
          <p className="text-gray-600">
            Based on your preferences and spending patterns
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Capital One Venture X</CardTitle>
                <CardDescription>Best Travel Rewards Card for You</CardDescription>
              </div>
              <CreditCard className="h-12 w-12 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="font-semibold text-2xl mb-1">75,000</div>
                  <div className="text-sm text-gray-600">
                    Bonus miles after spending $4,000 in first 3 months
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="font-semibold text-2xl mb-1">10X</div>
                  <div className="text-sm text-gray-600">
                    Miles on hotels and rental cars booked through Capital One Travel
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="font-semibold text-2xl mb-1">$395</div>
                  <div className="text-sm text-gray-600">Annual fee</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Why this card is perfect for you:</h3>
                <ul className="space-y-2">
                  {[
                    "Matches your preference for travel rewards",
                    "Aligns with your dining and shopping spending patterns",
                    "Offers premium travel benefits and lounge access",
                    "Flexible redemption options for your lifestyle",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <Button className="w-full">Apply Now</Button>
                <p className="text-sm text-center text-gray-500">
                  Applying won't affect your credit score
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline">See More Recommendations</Button>
        </div>
      </div>
    </div>
  );
}