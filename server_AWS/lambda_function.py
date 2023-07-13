import json
import logging
import openai
import settings
from functions import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)  

openai.api_key = settings.secret_key

def lambda_handler(event, context):
    logger.info(event)
    method = event['httpMethod']
    path = event['path'] 
    if method == 'POST':
        if path == '/exclusive-chatbot':
            reqbody = json.loads(event['body'])
            return payint_bot_reply(reqbody['messages'])          
        