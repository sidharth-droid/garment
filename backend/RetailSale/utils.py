import requests,os
from dotenv import load_dotenv
load_dotenv()
from twilio.rest import Client
'''
Helper For Sending Message On Whatsapp using UltraMsg API

'''
def send_ultramsg_whatsapp(to, message):
    API_URL = "https://api.ultramsg.com/instance107290/messages/chat"
    TOKEN = str(os.getenv("ULTRA_MSG_API_TOKEN"))

    payload = {
        "token": TOKEN,
        "to": to,
        "body": message
    }

    response = requests.post(API_URL, json=payload)
    print(response.json())

'''
Helper For Sending Message On Whatsapp using Twilio API

'''
def send_twilio_whatsapp(to,message,customer_name):
    account_sid = str(os.getenv('TWILIO_ACCOUNT_SID'))
    auth_token = str(os.getenv('TWILIO_AUTH_TOKEN'))
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        from_='whatsapp:+14155238886',
        # content_sid='HXb5b62575e6e4ff6129ad7c8efe1f983e',
        # content_sid='HX8e7b90205a93485abe823e00ab0fabd0',
        # content_variables='{"1":"' + customer_name + '"}',
        to=f'whatsapp:+91{to}',
        media_url=[
        "https://res.cloudinary.com/dumxbi1vh/raw/upload/v1739784789/tcvdmu1mdwczqxaykum0.pdf"
    ],
        body=f'{message}'
        )
    print(message.sid)
    