from model_stuff import predict
from quart import Quart, render_template, request, jsonify, redirect
import requests
app = Quart(__name__)


port = 5005
app = Quart(__name__)

API_URL = "http://localhost:5004"

### server
@app.route('/')
async def home():
    return await render_template('index.html')

@app.route('/upload', methods=['POST'])
async def upload_file():
    """
    runs when the image upload form is submitted in the frontend:
    <form class="file-upload" action="/upload" method="POST" enctype="multipart/form-data">
    """
    print('/upload route hit')
    print('uploading file...')

    uploaded_data = await request.files

    if 'disease-image' not in uploaded_data:
        return jsonify({'error': 'fruit-image not found in request.files. exiting...'}), 400
    
    file = uploaded_data['disease-image']

    if file:
        data = predict(file)
 
        if data == {}:
            return jsonify({'error': 'error processing file.'})
        else:
            # sort the dictionary by value in descending order
            sorted_items = sorted(data.items(), key=lambda x: x[1], reverse=True)
            print('top prediction fruit: ', sorted_items[0][0])

            #TODO: pull the fruit info from the API here
            
            return jsonify({'name':sorted_items[0][0]})
    else:
        print('No file found in request. Exiting...')
        return jsonify({'error': 'No file found in the request.'}), 400
    
@app.route('/get-nutrition/<fruit>', methods=['GET'])
async def get_nutrition(fruit):
    try:
        response = await requests.get(f"{API_URL}/{fruit}")
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Fruit not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-fact', methods=['GET'])
async def get_fact():
    try:
        response = requests.get(f"{API_URL}/facts/random")
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "No facts found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=port, debug=True)


