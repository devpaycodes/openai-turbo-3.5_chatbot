import json
import settings
from custom_encoder import CustomEncoder
import openai

openai.api_key = settings.secret_key

def payint_bot_reply(eventData):
    data = append_message_array_train_data(eventData)
    chat = openai.ChatCompletion.create(  
        model="gpt-3.5-turbo",                
        messages=data     
    ) 
    response = chat.choices[0].message.content
    body = {
        'reply' : response
    }
    return buildResponse(200,body)
    
def append_message_array_train_data(data):
    with open("./data.json", "r") as file:
        initialData = []
        conversation = file.read()
        conversation = json.loads(conversation) 
        for msg in conversation:
            initialData.append(msg)
        initialData.append(data)
        return initialData


def buildResponse(statusCode, body=None):
    response = {
        'statusCode': statusCode,
        'headers':{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    }
    if body is not None:
        response['body'] = json.dumps(body, cls=CustomEncoder)
    return response