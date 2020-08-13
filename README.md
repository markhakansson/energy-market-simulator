# energy-market-simulator
A web system to simulate and control a small scale electricity market. Has front-ends for prosumers and market managers. Created for the course M7011E, Design of Dynamic Web Systems at Lulea University of Technology.

## Requirements
* NodeJS 10.16+
* MongoDB 4.2+
* (Optional) npm 6.9+

## Getting started
### Running tests
To run the tests and generate code coverage with Mocha and Instanbul, inside **/app** run
```
npm test
```

### Setup
Place a file called **'.env'** in the **/app** directory with your
MongoDB information as well as your session secret to use. Example:
```
DB_HOST=<host address>
DB_USER=<db username>
DB_PASS=<db password>
SESSION_SECRET=<express_session secret>
```
In the same directory, install all necessary dependencies:
```
npm install
```
### Usage
To startup the server use the follwing command inside **/app**
```
npm start
```
This will start the database, API and server.


### Usage systemd
To start the app as a service on an OS that uses systemd, add the required information to the template **m7011e.service**, you might need to change the path where npm and the project is located. 
```
# in m7011e.service
...
Environment=DB_HOST=<path to mongodb>
Enivronment=DB_USER=<user>
Environment=DB_PASS=<pass>
Environment=SESSION_SECRET=<session secret>
Environtment=NODE_ENV=production
...

```
After that place the file at
```
/etc/systemd/system/m7011e.service
```
Then reload the daemon and start the service
```
sudo systemctl daemon-reload
sudo systemctl start m7011e.service
```
## Known issues
If too much data is collected during a long period of time, queries will be quite slow. This is due to the collections in the database not being indexed. When querying for certain documents MongoDB will need to check all documents in the collection. To fix this add the following indexes in mongo:
```
$ mongo

---------

use <db name>

db.prosumers.createIndex({ name: 1 })
db.prosumers.createIndex({ timestamp: -1 })

db.markets.createIndex({ name: 1 })
db.markets.createIndex({ timestamp: -1 })

db.weathers.createIndex({ name: 1 })
db.weathers.createIndex({ timestamp: -1 })
```

## Authors
Group: **rustislife**
* Aron Strandberg - arostr-5@student.ltu.se - [bugmana](https://github.com/dynematic)
* Mark Hakansson - marhak-6@student.ltu.se - [markhakansson](https://github.com/markhakansson)

## Acknowledgements
Pictures:
[Green Grass](https://www.pexels.com/photo/agriculture-countryside-crop-cropland-388415/) by Jahoo Clouseau

Videos:
[Windfarming Wonder](https://www.pexels.com/video/wind-turbines-on-a-foggy-day-3222552/) shot in Lal Lal, Australia by Andrew Thomas 
## License
Licensed under the MIT license. See [LICENSE](LICENSE) for details.
