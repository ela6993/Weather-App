from http.client import responses

import pandas as pd
from flask import Flask, jsonify, request
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

def register_routes(app):

    @app.route('/')
    def index():
        return jsonify({'message': 'Enter the name of the city'})

    @app.route('/weather', methods=['POST'])
    def weather():
        api_key = os.getenv('OPENWEATHER_API_KEY')
        current_weather_url = 'https://api.openweathermap.org/data/2.5/weather?q={}&appid={}'
        forecast_url = 'https://api.openweathermap.org/data/2.5/forecast?q={}&units=metric&appid={}'

        data = request.get_json()
        city = data.get('city_')

        response = requests.get(current_weather_url.format(city, api_key)).json()
        forecast_response = requests.get(forecast_url.format(city, api_key)).json()

        if str(response['cod']) == '200' and str(forecast_response['cod']) == '200':
            forecast_data = get_forecast(forecast_response)
            weather_data = {
                'city': city,
                'temperature': round(response['main']['temp'] - 273.15, 2),
                'description': response['weather'][0]['description'],
                'icon': response['weather'][0]['icon']
            }

            data = {'data1': weather_data, 'data2': forecast_data}

            return jsonify(data)
        elif str(response['cod']) == '404':
            return jsonify({'error': 'Not found'})

    def get_forecast(response):
        df = pd.DataFrame(response['list'])
        df['weather'] = df['weather'].apply(lambda x: x[0])

        for i in df.columns:
            if str(df[i].dtype) == 'object' and i != 'dt_txt':
                df = df.drop(columns=[i]).join(pd.json_normalize(df[i]))

        df['dt_txt'] = pd.to_datetime(df['dt_txt'], format='%Y-%m-%d %H:%M:%S')
        df.set_index('dt_txt', inplace=True)

        df1 = df.resample('D').mean(numeric_only=True)
        df1['icon'] = df.resample('D')['icon'].agg(lambda x: x.mode()[0])
        df1['description'] = df.resample('D')['description'].agg(lambda x: x.mode()[0])

        df1 = df1[['temp', 'icon', 'description']]
        df1['date'] = df1.index.strftime("%d %B %Y")
        df1['temp'] = df1['temp'].apply(lambda x: round(x, 2))
        df1['id'] = range(1, len(df1) + 1)

        json_str = df1.to_json(orient='records', force_ascii=False)
        json_obj = json.loads(json_str)

        return json_obj

