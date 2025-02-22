import os

class Config:
    
    DEBUG = False if os.environ.get('ENV') == 'PROD' else True
    
    SECRET_KEY = os.environ.get('SECRET_KEY')
