from model_stuff import predict
from quart import Quart, render_template, request, jsonify
import random

app = Quart(__name__)
port = 5005

# Nutrition data
fruit_data = {
    'banana': {'calories': 89, 'carbs': 22.8, 'protein': 1.1, 'fat': 0.3},
    'apple': {'calories': 52, 'carbs': 13.8, 'protein': 0.3, 'fat': 0.2},
    'orange': {'calories': 47, 'carbs': 11.8, 'protein': 0.9, 'fat': 0.1},
    'cherry': {'calories': 50, 'carbs': 12, 'protein': 1, 'fat': 0.3},
    'chickoo': {'calories': 83, 'carbs': 20, 'protein': 0.4, 'fat': 1.1},
    'grapes': {'calories': 69, 'carbs': 18.1, 'protein': 0.7, 'fat': 0.2},
    'kiwi': {'calories': 61, 'carbs': 14.7, 'protein': 1.1, 'fat': 0.5},
    'mango': {'calories': 60, 'carbs': 15, 'protein': 0.8, 'fat': 0.4},
    'strawberry': {'calories': 32, 'carbs': 7.7, 'protein': 0.7, 'fat': 0.3}
}

fruit_facts = [
    'Bananas are berries, but strawberries aren’t!',
    'A pomegranate can hold up to 1400 seeds.',
    'Cranberries can bounce.',
    'Not all oranges are orange.',
    'Figs match milk in calcium.',
    'Kiwis contain more vitamin C than oranges.',
    'Durian is the smelliest fruit in the world.',
    'At one point in time, blackberry juice was used to dye clothes.',
    'Strawberries typically have around 200 seeds. They’re also the only fruit with seeds on the outside.'
]

@app.route('/')
async def home():
    return await render_template('index.html')

@app.route('/upload', methods=['POST'])
async def upload_file():
    """
    Runs when the image upload form is submitted in the frontend:
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
 
        if not data:
            return jsonify({'error': 'error processing file.'})
        else:
            # Sort the dictionary by value in descending order
            sorted_items = sorted(data.items(), key=lambda x: x[1], reverse=True)
            fruit = sorted_items[0][0]
            print('top prediction fruit: ', fruit)

            # Retrieve nutrition info
            nutrition = get_nutrition(fruit)
            print('nutrition facts: ', nutrition)
            
            return jsonify(nutrition)
    else:
        print('No file found in request. Exiting...')
        return jsonify({'error': 'No file found in the request.'}), 400
    
def get_nutrition(fruit):
    fruit = fruit.lower()
    if fruit in fruit_data:
        return {
            'name': fruit,
            'calories': fruit_data[fruit]['calories'],
            'carbs': fruit_data[fruit]['carbs'],
            'protein': fruit_data[fruit]['protein'],
            'fat': fruit_data[fruit]['fat']
        }
    else:
        return {'error': 'Fruit not found'}

@app.route('/get-fact', methods=['GET'])
async def get_fact():
    print('/get-fact route hit')
    random_fact = random.choice(fruit_facts)
    print('random fact:', random_fact)
    return jsonify({'fact': random_fact})

@app.route('/add-fact', methods=['POST'])
async def add_fact():
    print('/add-fact route hit')
    request_data = await request.json
    print('request_data:', request_data)

    new_fact = request_data.get('fact', '').strip()
    if new_fact:
        fruit_facts.append(new_fact)
        print('New fact added:', new_fact)
        return jsonify({'fact': new_fact}), 201
    else:
        return jsonify({'error': 'Invalid fact'}), 400

if __name__ == '__main__':
    app.run(port=port)
