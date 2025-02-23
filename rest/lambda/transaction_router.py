import os
import json
from pymongo import MongoClient
from exa_py import Exa
from openai import OpenAI


def lambda_handler(event, context):
    
    user_id = event.get("queryStringParameters", {}).get("user_id")

    if "body" not in event or not event["body"]:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing request body"})
        }
    
    try:
        request_body = json.loads(event["body"])
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON in request body"})
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
        user_data = collection.find_one({"_id": request_body["user_id"]})
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

    example_json = [{"payment_method_id": 1, "amount": 48.50}, {"payment_method_id": 2, "amount": 20.54}]
    prompt: str = (
        f"RESPOND WITH LIST OF RECOMMENDED CHARGES IN JSON FORMAT ONLY.\n"
        f"e.g. {example_json}\n\n"
        f"Based on the following user financial data and reward preferences, calculate the optimal credit card payment amounts "
        f"for the following credit card purchase:\n\n"
        f"Transaction Amount: {request_body["trans_amt"]}; Transaction (Merchant) Type: {request_body["trans_type"]}\n"
        f"User Data: {user_data}"
    )
    response = openai.chat.completions.create(  
        model="o1", messages=[{"role": "user", "content": prompt}]
    )
    
    try:
        recommendation = response.choices[0].message.content
        try: # Tries parsing LLM response into JSON. If that fails, just return the raw text.
            recommended_split = json.loads(recommendation)
        except json.JSONDecodeError:
            recommended_split = {"recommendation": recommendation}
        return {"statusCode": 200, "body": json.dumps(recommended_split)}
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"LLM processing error: {str(e)}"})
        }
