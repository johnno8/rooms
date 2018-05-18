# Rooms
Node.js meeting room booking system web application built using hapi.js, PostgreSQL and Handlebars. 
Deployed to heroku: https://quiet-harbor-88541.herokuapp.com/

### Logging in
The app uses OAuth2 with Google, so a valid Gmail account is required to log in.

## Run locally

### Pre-requisites
The application was developed on a Mac using Docker. To install Docker go to https://docs.docker.com/docker-for-windows/install or https://docs.docker.com/docker-for-mac/install/
Clone the repo:

```sh
$ git clone https://github.com/johnno8/rooms.git
```

If Git is not installed locally the contents of the repo can be downloaded as a ZIP file from the 'Clone or Download' tab above.

### Start the app
Once Docker is installed, run the following command:

```sh
$ docker-compose up
```
This command pulls a Docker Node image and PostgreSQL image from Docker Hub, spins up a container for each and connects them. 
The app will be available at localhost:4000
