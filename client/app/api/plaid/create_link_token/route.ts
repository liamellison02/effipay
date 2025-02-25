import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import { NextResponse } from 'next/server';

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

export async function POST() {
  try {
    const request = {
      user: {
        client_user_id: 'user-' + Math.random().toString(36).substring(2, 15),
      },
      client_name: 'EffiPay',
      products: ['auth', 'transactions'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(request);
    return NextResponse.json({ link_token: createTokenResponse.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
}
