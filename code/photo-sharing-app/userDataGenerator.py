# -*- coding: utf-8 -*-
"""
Created on Mon Mar  2 23:04:19 2020

@author: botbi
"""
import random
import string
import requests
import os, ssl
import certifi
import csv
import urllib.request


URL = "http://localhost:3007/users/register"


user_data = {"name":[],"email":[], "password":[], "phone":[]}
domain = "@hawk.iit.edu"

chars = list(string.ascii_letters)
number =list(string.digits)
anyChars = list(string.printable)
firstname =''.join(random.choice(chars) for x in range(6))
lastname = ''.join(random.choice(chars) for x in range(6))
password = ''.join(random.choice(chars) for x in range(8))
email = firstname+lastname[0]+domain
phone = ''.join(random.choice(number) for x in range(10))

word_url = "http://svnweb.freebsd.org/csrg/share/dict/words?view=co&content-type=text/plain"
response = urllib.request.urlopen(word_url)
long_txt = response.read().decode()
words = long_txt.splitlines()

upper_words = [word for word in words if word[0].isupper()]
name_words  = [word for word in upper_words if not word.isupper()]
one_name = ' '.join([name_words[random.randint(0, len(name_words))] for i in range(2)])


def rand_name():
   name = ' '.join([name_words[random.randint(0, len(name_words))] for i in range(2)])
   return name





for i in range(3):
    name = rand_name()
    password = ''.join(random.choice(chars) for x in range(8))
    email = name.split(' ')[0]+domain
    phone = ''.join(random.choice(number) for x in range(10))
    
    
    user_data['name'].append(name)
    user_data['password'].append(password)
    user_data['email'].append(email)
    user_data['phone'].append(phone)
    
    PARAMS =  {'name':name, 'email':email, 'phone':phone, 'password':password, 'confirmPassword':password}
    print(PARAMS)
    
    r = requests.post(url=URL, data = PARAMS)
    data = r.json()
    print(data)

   

print (user_data)

with open('credentials.csv','w') as f:
    for key in user_data.keys():
        f.write("%s,%s\n"%(key,user_data[key]))
