import os
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
from exa_py import Exa
from openai import OpenAI


def lambda_handler(event, context):
    
    user_id = event.get("queryStringParameters", {}).get("user_id")
    
    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing user_id in request"})
        }

    mongo_uri = os.environ.get("MONGO_URI")
    if not mongo_uri:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "MongoDB connection string (MONGO_URI) not configured"})
        }
    
    try:
        client = MongoClient(mongo_uri)
        db = client.get_database("effipay")
        collection = db.get_collection("user")
        user_data = collection.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Error connecting to MongoDB: {str(e)}"})
        }
    
    if not user_data:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "User financial data not found"})
        }
    
    try:
        openai = OpenAI(api_key=os.environ.get("OPENAI_KEY",''))
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Unable to connect to OpenAI API"})
        }    

    try:
        exa = Exa(api_key=os.environ.get("EXA_KEY"))
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Unable to connect to Exa"})
        }

    results = exa.search_and_contents(
        "Available credit card programs and offers from major credit card companies like Capital One, Citi, Chase, etc.", text=True)

    prompt: str = (
        f"Based on the following user financial data and reward preferences, provide a credit card recommendation. "
        f"Include details such as the card name, interest rate, credit limit, annual fee, and any special rewards or features.\n\n"
        f"User Data: {user_data}"
    )
    response = openai.chat.completions.create(  
        model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}]
    )
    
    try:
        recommendation = response.choices[0].message.content
        try: # Tries parsing LLM response into JSON. If that fails, just return the raw text.
            recommended_card = json.loads(recommendation)
        except json.JSONDecodeError:
            recommended_card = {"recommendation": recommendation}
        return {"statusCode": 200, "body": json.dumps(recommended_card)}
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"LLM processing error: {str(e)}"})
        }

