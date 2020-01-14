# m7011e-dynamic-web-systems
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
