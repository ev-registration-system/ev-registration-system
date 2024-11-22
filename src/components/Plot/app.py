import warnings
warnings.filterwarnings("ignore")

import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend (graphg wouldn't load without this)

from flask import Flask, send_file
import matplotlib.pyplot as plt
import io
import pandas as pd
import plotly.express as px
from datetime import datetime
from flask_cors import CORS
from flask import Flask, jsonify

app = Flask(__name__)
CORS(app)  # CORS can allow communicating w/ Flask and React

@app.route('/')
def home():
    return "This is the main page.\nGo to /plot to see the plot.\nGo to /get-number to see the jsons of the emission from this current hour."

@app.route('/get-number')
def get_number():
    try:
        # Load the emissions data 
        df = pd.read_csv('/Users/ms/Desktop/SE/Untitled/ev-registration-system/src/components/Plot/expanded_emissions_data.csv')
        
        # Convert 'Date' column to datetime
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Get the current date and hour
        current_time = datetime.now()
        current_date = datetime(2024, 1, 1) # Hard-code the date to 2024-1-1
        #current_date = current_time.date() -> Can use later for when I have data for each day
        current_hour = current_time.hour
        if (current_hour == 0): current_hour = 24
        
        # Get the emission factor for the current hour
        current_data = df[(df['Date'] == current_date) & (df['Hour'] == current_hour)]
        
        if not current_data.empty:
            # Get the emission factor for the current hour
            current_emission = current_data.iloc[0]['Emission Factor (kg CO2 per kWh)']
            return jsonify({'current_emission': current_emission, 'hour': current_hour})
        else:
            # Else return 404 err
            return jsonify({'error': 'No data available for the current hour'}), 404 
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/plot')
def plot():
    try:
        # Load the emissions data 
        df = pd.read_csv('/Users/ms/Desktop/SE/Untitled/ev-registration-system/src/components/Plot/expanded_emissions_data.csv')
        
        # Convert 'Date' column to datetime
        df['Date'] = pd.to_datetime(df['Date'])

         # Get the current date and hour
        current_time = datetime.now()
        current_date = datetime(2024, 1, 1).date() # Hardcode the date to 2024-01-01
        #current_date = current_time.date() -> Can use later for when I have data for each day
        current_hour = current_time.hour  # Get the current hour
        # Since python runs the hours from 0..23, just some bug fixing 
        if (current_hour == 0): current_hour = 24
        
        # Get rows for current date
        date_rows = df[df['Date'].dt.date == current_date]
        
        # Throw error if the current date has no data
        if date_rows.empty:
            return jsonify({'error': f'No data available for {current_date}'}), 404
        
        # Starting from the current hour, get the data for the last 24 hours
        last_24_rows = date_rows[(date_rows['Hour'] >= current_hour - 24) & (date_rows['Hour'] <= current_hour)]
    
        # Sort by hour to ensure correct plotting
        last_24_rows = last_24_rows.sort_values(by='Hour')

        # Plotting the hourly emissions as a line chart
        plt.figure(figsize=(10, 6))
        plt.plot(last_24_rows['Hour'], last_24_rows['Emission Factor (kg CO2 per kWh)'], marker='o', color='green', label="CO2 Emission Factor")
        plt.title(f"Hourly Emissions on {current_date}")
        plt.xlabel("Hour")
        plt.ylabel("Emission Factor (kg CO2 per kWh)")
        plt.xticks(range(1, 25))  # Ensures each hour is labeled
        plt.legend()
        plt.grid(True)

        # Save the plot to a BytesIO object and send it as a response
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()
        # Return png img
        return send_file(img, mimetype='image/png')
    
    except Exception as e:
        print(f"Error generating plot: {e}")
        return f"Error generating plot: {e}", 500


if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
