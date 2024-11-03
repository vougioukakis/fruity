import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 5004;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const fruitData = {
  banana: { calories: 89, carbs: 22.8, protein: 1.1, fat: 0.3 },
  apple: { calories: 52, carbs: 13.8, protein: 0.3, fat: 0.2 },
  orange: { calories: 47, carbs: 11.8, protein: 0.9, fat: 0.1 },
  cherry: { calories: 50, carbs: 12, protein: 1, fat: 0.3 },
  chickoo: { calories: 83, carbs: 20, protein: 0.4, fat: 1.1 },
  grapes: { calories: 69, carbs: 18.1, protein: 0.7, fat: 0.2 },
  kiwi: { calories: 61, carbs: 14.7, protein: 1.1, fat: 0.5 },
  mango: { calories: 60, carbs: 15, protein: 0.8, fat: 0.4 },
  strawberry: { calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3 }
};

let fruitFacts = [
    'Bananas are berries, but strawberries arent!',
    'A pomegranate can hold up to 1400 seeds.',
    'Cranberries can bounce.',
    'Not all oranges are orange.',
    'Figs match milk in calcium ',
    'Kiwis contain more vitamin C than oranges. ',
    'Durian is the smelliest fruit in the world ',
    'At one point in time, blackberry juice was used to dye clothes.',
    'Strawberries typically have around 200 seeds. They’re also the only fruit with seeds on the outside.'
];

app.get('/:fruit', (req, res) => {
    const fruit = req.params.fruit.toLowerCase();
    if (fruitData[fruit]) {
        console.log('returning data for fruit :'+fruit);
        const response = {
            'name':fruit,
            'calories':fruitData[fruit].calories,
            'carbs': fruitData[fruit].carbs,
            'protein': fruitData[fruit].protein,
            'fat': fruitData[fruit].fat
        }
        console.log('response: ' + JSON.stringify(response));
        res.json(response);
    } else {
        res.status(404).json({ error: 'Fruit not found'});
    }
});

app.get('/facts/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * fruitFacts.length);
    res.json({ fact: fruitFacts[randomIndex] });
});

app.post('/facts', (req, res) => {
    const newFact = req.body.fact;
    if (typeof newFact ==='string' && newFact.trim()!== '') {
        fruitFacts.push(newFact);
        res.status(201).json({ fact: newFact });
    } else {
        res.status(400).json({ error:'Invalid fact' });
    }
});

app.listen(PORT, () => {
    console.log(`Nutrition API is running on http://localhost:${PORT}`);
});
