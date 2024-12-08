import torch.nn as nn
import torch as torch
import torch.nn.functional as F
from PIL import Image
import torchvision.transforms as transforms

UPLOAD_FOLDER = 'upload'
model_pathname = 'models/model.pth'
class_names = ['apple', 'banana', 'cherry', 'chickoo', 'grapes', 'kiwi', 'mango', 'orange', 'strawberry']
### model
class FruitClassifier(nn.Module):
    def __init__(self):
        super(FruitClassifier, self).__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)  # 3 input channels (RGB), 16 output channels
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)  # Max pooling with 2x2 window
        self.fc1 = nn.Linear(32 * 16 * 16, 128)  # Fully connected layer
        self.fc2 = nn.Linear(128, 9)  # Output layer with number of classes

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = x.view(-1, 32 * 16 * 16)  # Flatten the tensor
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x


print(torch.__version__)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = FruitClassifier()
model.to(device=device)

num_classes = 9

def map_location(storage, loc):
    """found this to fix an error about unknown mps device when making a docker image for
    --platform linux/amd64
    """
    if 'mps' in str(loc):
        return storage.cuda() if torch.cuda.is_available() else storage.cpu()
    return storage

#model.load_state_dict(torch.load(model_pathname)) #old code
model.load_state_dict(torch.load(model_pathname, map_location=map_location))
# Define transformations outside the function to avoid recreating them each time
transform = transforms.Compose([
    transforms.Resize((64, 64)),  # resize images to 64x64 pixels
    transforms.ToTensor()         # convert images to PyTorch tensors
])

def predict(file: Image, image_size=(128, 128)):
    """
    This function takes an image file and processes it to predict the skin disease.

    Parameters:
    file (Image): The image file to be processed. has to be of Image class from PIL library
    image_size (tuple, optional): The size to which the image will be resized. Default is (128, 128).

    Returns:
    dict: A dictionary containing the skin disease predictions with their corresponding probabilities.
    """
    print('running model...')

    image = Image.open(file)
    try:
        image = image.convert("RGB")
        image = transform(image)
        image = image.unsqueeze(0)  # Add batch dim
    except Exception as e:
        print(f"Error processing image: {e}")
        return {}
    image = image.to(device)
    
    # inference
    model.eval()
    with torch.no_grad():
        outputs = model(image)
        probabilities = torch.softmax(outputs, dim=1)  # apply softmax to get probabilities

    # convert probs to a dict
    probabilities = probabilities.cpu().numpy().flatten()
    prob_dict = {class_names[i]: probabilities[i] for i in range(len(class_names))}

    print('model run completed.')

    return prob_dict
