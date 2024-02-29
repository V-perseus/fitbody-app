import requests

url = "https://fba.test/api/v3/user/sign-in-email"
data = {
    "email": "anderson1@gmail.com",
    "password": "com123!@#Password",
    "timezone": "PST",
    "trial": "true"
}

response = requests.post(url, data=data, verify=False)

if response.status_code == 200:
    print(response.text)
else:
    print("Error:", response.status_code)