# Yii2 REST API + Angular 2 Boilerplate

This is a boilerplate project for future use. The project consists of backend developed by Yii2 REST API and frontend developed by Angular2 with Core UI.

The project involves:
* Backend
    - Yii2 REST API
* Frontend
    - Angular2 + CoreUI template

## Features
* User Login/Logout     
    - Backend generates access token upon successful login.
    - Frontend will store access token in local storage and use for all requests.
    - Backend will validate submitted access token prior to process any request. 
* User Registration
    - Backend will submit verification email to the email. Note that current backend system will use swift mailer component with file transport. You can check the email content in debug module.  
* User Email Confirmation 
    - Frontend will confirm the auth key and update account status if auth key is valid.
* User Reset Password
    - Backend will send password reset email to the requested email.
    - Frontend will display the password reset page if password reset token is valid.
* Dashboard
    - Currently, dashbaord is empty page.
* User Management
    - User can create/update/delete user information.
* Setting Management
    - User can create/update/delete setting information.

## Usage
Currently, the project is not ready for production use. Following steps are suitable for configuring development environment.

To run the application, create new database.
```
host: localhost
db: boilerplate
username: root
password: root
``` 

Open the console and execute following commands.

```
$ git clone https://github.com/chrisleekr/yii2-angular2-boilerplate.git
$ cd yii2-angular2-boilerplate 
$ cd backend
$ composer install
$ ./yii migrate/up
```

Note that if you have different database connection information, you will need to update backend `db.php` before you running `./yii migrate/up`

1. Open `~/yii2-angular2-boilerplate/backend/config/db.php`
2. Update db config as new database connection credentials

The backend is running under LAMP environment. Setup backend as following configuration.
 
```
document root: ~/yii2-angular2-boilerplate/backend/web
host: api.boilerplate.local
``` 

Note that you will need to update `/etc/hosts` if required.

```
127.0.0.1       api.boilerplate.local
```

Once setup backend, then run `npm` to start frontend

```
$ cd frontend
$ npm install
$ npm start --host 0.0.0.0
``` 

And wait for it is up and running. Once npm is finished compiling, then open the browser.

* Frontend: [http://localhost:4200](http://localhost:4200)
* Backend: [http://api.boilerplate.local/debug](http://api.boilerplate.local/debug)

Note that if you change backend address, then you will need to update frontend global configuration for pointing new backend address.

1. Open `~/yii2-angular2-boilerplate/frontend/src/app/model/global.service.ts`
2. Update `apiHost` to new backend address
    ```
    this.apiHost = 'http://new.address.local/v1';
    ```
   Make sure you append `/v1` after the backend address.

## TODO
- [ ] Enhance user management - send confirmation email 
- [ ] Enhance user authorization with Yii2 RBAC (Role Based Access Control)
- [ ] Develop new customer management section
- [ ] Dockerize application
   
## Screenshots
![Login](/screenshots/01.png?raw=true)
![Registration](/screenshots/02.png?raw=true)
![Register Completion](/screenshots/03.png?raw=true)
![Email Content for confirming account](/screenshots/04.png?raw=true)
![Account Confirmation](/screenshots/05.png?raw=true)
![Password Reset Request](/screenshots/06.png?raw=true)
![Password Reset Request Completion](/screenshots/07.png?raw=true)
![Email Content for resetting password](/screenshots/08.png?raw=true)
![Reset Password](/screenshots/09.png?raw=true)
![Reset Password Confirmation](/screenshots/10.png?raw=true)
![Dashboard](/screenshots/11.png?raw=true)
![User Management](/screenshots/12.png?raw=true)
![Update User Information](/screenshots/13.png?raw=true)
![Setting Management](/screenshots/14.png?raw=true)
![Update Setting Information](/screenshots/15.png?raw=true)
