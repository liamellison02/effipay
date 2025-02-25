import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  baseURL: "https://api.galadriel.com/v1/verified",
});

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, transactionData } = body;

    if (!email || !transactionData) {
      return NextResponse.json(
        { error: 'Email and transaction data are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to database and get user data
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Prepare the context for the LLM
    const llmContext = {
      transaction: transactionData,
      userPreferences: user.preferences || {},
      cards: user.cards || [],
      spendingCategories: user.spendingCategories || [],
      spendingHistory: user.spendingHistory || []
    };

    // Make LLM call for transaction splitting recommendation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a financial assistant that helps split transactions across different payment methods. 
          Analyze the provided transaction and user data to recommend the optimal payment split across available cards.
          Your response must be in valid JSON format with the following structure:
          {
            "splits": [{
              "cardId": string,
              "amount": number,
              "reason": string
            }],
            "explanation": string
          }`
        },
        {
          role: "user",
          content: `Current Transaction:
${JSON.stringify(transactionData, null, 2)}

User Cards:
${JSON.stringify(user.cards, null, 2)}

User Preferences:
${JSON.stringify(user.preferences, null, 2)}

Spending Categories:
${JSON.stringify(user.spendingCategories, null, 2)}

Spending History:
${JSON.stringify(user.spendingHistory?.slice(-5), null, 2)}`
        },
      ],
    });

    // Extract and validate the recommendation from the LLM response
    const messageContent = completion.choices[0].message.content;
    if (!messageContent) {
      return NextResponse.json(
        { error: 'No recommendation received from AI' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    let splitRecommendation;
    try {
      splitRecommendation = JSON.parse(messageContent);
      
      // Validate the response structure
      if (!splitRecommendation.splits || !Array.isArray(splitRecommendation.splits)) {
        throw new Error('Invalid response structure');
      }
      
      // Validate total split amount matches transaction amount
      const totalSplit = splitRecommendation.splits.reduce((sum: number, split: { amount: number }) => sum + split.amount, 0);
      if (Math.abs(totalSplit - transactionData.amount) > 0.01) { // Allow for small floating point differences
        throw new Error('Split amounts do not match transaction total');
      }
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      return NextResponse.json(
        { error: 'Failed to generate valid payment split recommendation' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        splitRecommendation,
        originalTransaction: transactionData
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in split-transaction route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
