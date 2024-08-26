import os
import json

def downsample_array(arr, factor):
    return arr[::factor]

def process_json_file(file_path, downsample_factor=10):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        
        if 'individual_trace' in data:
            # Downsample the individual_trace array
            data['individual_trace'] = downsample_array(data['individual_trace'], downsample_factor)
            
            # Save the modified data back to the file
            with open(file_path, 'w') as file:
                json.dump(data, file, indent=2)
            print(f"Processed: {file_path}")
        else:
            print(f"Skipped: {file_path} (no 'individual_trace' found)")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON in file: {file_path}")
        print(f"Error details: {str(e)}")
    except Exception as e:
        print(f"Unexpected error processing file: {file_path}")
        print(f"Error details: {str(e)}")

def find_and_process_json_files(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename == 'trace.json':
                file_path = os.path.join(dirpath, filename)
                process_json_file(file_path)

if __name__ == "__main__":
    root_directory = "."  # Current directory, change this if needed
    find_and_process_json_files(root_directory)
    print("Processing complete.")