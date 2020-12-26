# description
Collector mobile application

# install ionic cli and some dependencies
```javascript
npm install -g @ionic/cli native-run cordova-res
```

# create ionic project from ionic cli scaffolding with capacitor compatible
```javascript
ionic start collector-mobile conference --type=angular --capacitor
```

# install some project dependencies
```javascript
npm install @ionic/pwa-elements --save
```

# start server
```javascript
ionic server
```

# create native project for android devices
```javascript
ionic capacitor build android --prod
```

from android studio build android project created and package

# create native project for ios devices
```javascript
ionic capacitor build ios --prod
```
