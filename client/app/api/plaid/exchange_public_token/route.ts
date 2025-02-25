import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function POST(request: Request) {
  try {
    // Get the JWT token from the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { public_token } = await request.json();

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    // Log the full response to see all available data
    console.log('Plaid exchange response:', exchangeResponse.data);

    // Connect to the database
    await connectToDatabase();

    // Update the user with Plaid data
    await User.findByIdAndUpdate(decoded.userId, {
      plaid: {
        access_token: exchangeResponse.data.access_token,
        item_id: exchangeResponse.data.item_id,
        request_id: exchangeResponse.data.request_id,
      }
    });

    // Send access token to dummy endpoint
    try {
      const dummyEndpoint = 'https://api.example.com/plaid-token';
      await fetch(dummyEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${exchangeResponse.data.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Successfully sent access token to dummy endpoint');
    } catch (error) {
      // Log error but don't fail the request
      console.error('Failed to send access token to dummy endpoint:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return NextResponse.json(
      { error: 'Failed to exchange public token' },
      { status: 500 }
    );
  }
}
