import urllib.request
req = urllib.request.Request('https://share.google/v2wEPiUEg8dSBlAQl', headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req)
print(resp.geturl())
html = resp.read().decode('utf-8', errors='ignore')
import re
images = re.findall(r'https://[^"]+\.(?:jpg|png|jpeg)', html)
print(images[:5])
