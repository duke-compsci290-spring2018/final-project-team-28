from datetime import date, timedelta, datetime
import billboard
import pyrebase 
config = {  "apiKey": "AIzaSyDSRaDpwgpKA6QPsGLlpi4jc5F0t2Cglz0",  "authDomain": "sonquest-3379c.firebaseapp.com",  "databaseURL": "https://sonquest-3379c.firebaseio.com",  "storageBucket": "sonquest-3379c.appspot.com",  "serviceAccount": "C:/Users/onero/Desktop/Sonquest-49f5efcc2d4d.json" } 
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
user = auth.sign_in_with_email_and_password('liljinx@runeterra.com', 'caitlyn')
db = firebase.database()
#archer = {"name": "Sterling Archer", "agency": "Figgis Agency"} 
#db.child("agents").push(archer, user['idToken'])


start = 1-2-1965
start_date= datetime.strptime('1965-01-01', '%Y-%m-%d')
db.child('adminplaylists').set({'playlist1':['rachel']}, user['idToken']);
"""
for i in range(104):
    date_str = start_date.strftime('%Y-%m-%d')
    real_date = (start_date + timedelta(days=1)).strftime('%Y-%m-%d')
    cur_year = (start_date + timedelta(days=1)).year
    print(date_str)
    chart = billboard.ChartData(name='hot-100', date=date_str)
    #r1  = db.child('weeks').child(real_date)
    for num,song in enumerate(chart):
        entry = {'week': real_date, 'rank': num+1, 'track': song.title, 'artist': song.artist}
        results = db.child(cur_year).child(real_date).child(num+1).set(entry, user['idToken'])
        print(entry)
        if num == 4:
            break
    start_date = start_date + timedelta(days=7)
"""