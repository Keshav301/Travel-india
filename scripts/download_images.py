import os
import urllib.request
import time
import ssl

# Disable SSL verification just in case
ssl._create_default_https_context = ssl._create_unverified_context

BASE_URL = "https://loremflickr.com/1200/800/{query}/all"

destinations = {
    'states': {
        'uttar-pradesh': ['taj mahal', 'varanasi ghat', 'lucknow', 'uttar pradesh tourism'],
        'uttarakhand': ['himalayas', 'rishikesh', 'nainital lake', 'uttarakhand nature'],
        'rajasthan': ['jaipur fort', 'udaipur palace', 'jaisalmer desert', 'rajasthan'],
        'kerala': ['kerala backwaters', 'munnar tea', 'kerala beach', 'alleppey'],
        'goa': ['goa beach', 'goa church', 'palolem', 'goa party']
    },
    'places': {
        'agra': ['taj mahal', 'agra fort', 'fatehpur sikri', 'agra streets', 'agra monument'],
        'varanasi': ['ganges river varanasi', 'varanasi aarti', 'kashi vishwanath', 'varanasi boat', 'sarnath'],
        'nainital': ['naini lake', 'nainital mall road', 'himalayas nainital', 'nainital ropeway', 'nainital view'],
        'jaipur': ['hawa mahal', 'amber fort jaipur', 'city palace jaipur', 'jaipur markets', 'jal mahal']
    }
}

base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'images')

def download_images():
    print("Starting image downloads...")
    for category, items in destinations.items():
        for place, queries in items.items():
            folder_path = os.path.join(base_dir, category, place)
            os.makedirs(folder_path, exist_ok=True)
            print(f"Downloading images for {place}...")
            
            for i, query in enumerate(queries, 1):
                safe_query = query.replace(' ', ',')
                url = BASE_URL.format(query=safe_query)
                file_path = os.path.join(folder_path, f"{place}{i}.jpg")
                
                if os.path.exists(file_path):
                    print(f"Skipping {file_path}, already exists.")
                    continue
                
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        print(f"  Fetching: {url} -> {file_path}")
                        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req, timeout=10) as response, open(file_path, 'wb') as out_file:
                            data = response.read()
                            out_file.write(data)
                        time.sleep(1) # Be nice to the server
                        break
                    except Exception as e:
                        print(f"  Attempt {attempt + 1} failed for {query}: {e}")
                        time.sleep(2)

if __name__ == "__main__":
    download_images()
    print("Finished downloading images!")
