import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
import os

links = {
    "poke_salmon.jpg": "https://share.google/v2wEPiUEg8dSBlAQl",
    "pollo_teriyaki.jpg": "https://share.google/H2bfmBKEBraSDgLy0",
    "buddha_vegano.jpg": "https://share.google/yPKxd896cHYCvXqk6",
    "bowl_mexicano.jpg": "https://share.google/1VwKzNNEzwYd4Wvqo",
    "acai_bowl.jpg": "https://share.google/a8NFMnnbjVKCnE7Iv",
    "cesar_pollo.jpg": "https://share.google/3J8X7B1vFW5AA04uI",
    "ensalada_griega.jpg": "https://share.google/foEjFauYKH7FmQ13R",
    "wrap_pavo.jpg": "https://share.google/JXinBTksAaTTjb7f3",
    "wrap_falafel.jpg": "https://share.google/4B0IvRdrVbWISDLnw",
    "toast_aguacate.jpg": "https://share.google/aUQjqGLMDW4a9GzeE",
    "jugo_verde.jpg": "https://share.google/cG1WwdCulzBEGroZ4",
    "smoothie_proteico.jpg": "https://share.google/OJyRlWMhViFoH1xi9",
    "agua_pepino.jpg": "https://share.google/90IEm7xw0aJx78aSB",
    "kombucha.jpg": "https://share.google/FyCuiMIJ8eCUb7Wu7",
    "te_matcha.jpg": "https://share.google/LNgYxNgNzNDEiCtWD"
}

base_dir = r"C:\Users\DELL\Desktop\green-karen-pwa_oroz-novella-karen-jimena\img"

def download_link(filename, share_url):
    try:
        # Get redirect URL
        req = urllib.request.Request(share_url, headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req)
        redirect_url = resp.geturl()
        
        # Parse imgurl
        parsed = urllib.parse.urlparse(redirect_url)
        qs = urllib.parse.parse_qs(parsed.query)
        if 'imgurl' in qs:
            img_url = qs['imgurl'][0]
            # Download image
            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_req) as img_resp, open(os.path.join(base_dir, filename), 'wb') as f:
                f.write(img_resp.read())
            print(f"Downloaded: {filename}")
        else:
            print(f"No imgurl found for {filename}")
    except Exception as e:
        print(f"Failed {filename}: {e}")

with ThreadPoolExecutor(max_workers=5) as executor:
    for filename, share_url in links.items():
        executor.submit(download_link, filename, share_url)
