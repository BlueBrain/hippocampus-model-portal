import os
import json

# Specify the directory containing all the folders
base_directory = '/Users/benjaminbotros/Documents/Work/epfl/hippocampus-model-portal/public/resources/data/1_experimental-data/neuronal-morphology/morphology/'

# Define the content of the JSON file
template = {
    "name": "",
    "contribution": {
        "names": [
            "Audrey Mercer",
            "Alex Thomson",
        ],
        "institution": "University College London"
    }
}

# Loop through each folder in the base directory
for folder_name in os.listdir(base_directory):
    folder_path = os.path.join(base_directory, folder_name)
    
    # Check if the item is a directory
    if os.path.isdir(folder_path):
        # Update the "name" field in the template with the folder name
        template['name'] = folder_name
        
        # Define the path to the JSON file to be created
        json_file_path = os.path.join(folder_path, 'table.json')
        
        # Write the JSON content to the file
        with open(json_file_path, 'w') as json_file:
            json.dump(template, json_file, indent=4)

        print(f"Created table.json in {folder_name}")