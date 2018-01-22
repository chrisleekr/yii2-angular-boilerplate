# Yii2 REST API + Angular 4 Boilerplate

[![Build Status](https://travis-ci.org/chrisleekr/yii2-angular4-boilerplate.svg?branch=master)](https://travis-ci.org/chrisleekr/yii2-angular4-boilerplate)

This is a boilerplate project for future use. The project consists of REST API developed by Yii2 and backend/frontend developed by Angular2 with Core UI.

The project involves:
* API
    - Yii2 REST API, Yii2 RBAC, JWT (JSON Web Token), SSE (Server Send Event)
* Backend: Staff/Administrator dashboard to manage staffs, users and settings
    - Angular 4, CoreUI Bootstrap Template, JWT (JSON Web Token), Moment.js, Sweet Alert, Underscore.js
* Frontend: User website to support user registration, login and account management 
    - Angular 4, CoreUI Bootstrap Template, JWT (JSON Web Token), Moment.js, Sweet Alert, SSE (Server Send Event)

## Features
- API
    * User Controller
        - GET/POST/PUT/DELETE /v1/user
        - POST /v1/user/login
        - POST /v1/user/signup
        - POST /v1/user/confirm
        - POST /v1/user/password-reset-request
        - POST /v1/user/password-reset-token-verification
        - POST /v1/user/password-reset
        - GET/POST /v1/me
        - GET /v1/page/sse
    * Staff Controller
        - GET/POST/PUT/DELETE /v1/staff
        - POST /v1/staff/login
        - GET /v1/staff/get-permissions
    * Setting Controller
        - GET/POST/PUT/DELETE /v1/setting
        - GET /v1/setting/public
- Frontend
    * User Login/Logout     
        - User can login with username and password.
        - API generates JWT(JSON Web Token) upon successful login.
        - Frontend will store JWT in local storage and use for all requests.
        - API will validate submitted access token prior to process any request. 
    * User Registration
        - User can register new account.
        - API will submit verification email to the email. Note that current API system will use swift mailer component with file transport. You can check the email content in debug module.  
    * User Email Confirmation 
        - Frontend will confirm the auth key and update account status if auth key is valid.
    * User Reset Password
        - User can reset their password.
        - API will send password reset email to the requested email.
        - Frontend will display the password reset page if password reset token is valid.
    * User Account 
        - User can change email address. If change email address, the API will send confirmation email to verify email address.
        - User can change password.
- Backend
    * Staff Login/Logout
        - API generates JWT(JSON Web Token) upon successful login.
    * Dashboard
        - Currently, dashboard is empty page.
    * Staff Management
        - Admin or staff who has a permission 'manageStaffs' can create/update/delete staff information.
        - Staff role can configure permissions for managing staff, user and setting.
    * User Management
        - Admin or staff who has a permission 'manageUsers' can create/update/delete user information.
    * Setting Management
        - Admin or staff who has a permission 'manageSettings' can create/update/delete setting information.

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
$ cd api
$ composer install
$ ./yii migrate --migrationPath=@yii/rbac/migrations
$ ./yii migrate/up
```

Note that if you have different database connection information, you will need to update API `db.php` before you running `./yii migrate/up`

1. Open `~/yii2-angular2-boilerplate/api/config/db.php`
2. Update db config as new database connection credentials

The API is running under LAMP environment. Setup API as following configuration.
 
```
document root: ~/yii2-angular2-boilerplate/api/web
host: api.boilerplate.local
``` 

Note that you will need to update `/etc/hosts` if required.

```
127.0.0.1       api.boilerplate.local
```

Once setup api, then run `npm` to start backend

```
$ cd backend
$ npm install
$ npm start
``` 

And open new console and start frontend

```
$ cd frontend
$ npm install
$ npm start
``` 

If you get an error message like below, then you need to upgrade Angular CLI to a new version.

```
You have to be inside an angular-cli project in order to use the serve command.
```

```
$ sudo npm uninstall -g @angular/cli
$ sudo npm cache clean
$ sudo npm install -g @angular/cli@latest
```

And wait for it is up and running. Once npm is finished compiling, then open the browser.

* REST API: [http://api.boilerplate.local/debug](http://api.boilerplate.local/debug)
    - To make sure API is working, go to [http://api.boilerplate.local/ping](http://api.boilerplate.local/ping). You must see `pong` message.
* Backend: [http://localhost:4200](http://localhost:4200)
    - Administrator username: `admin`, password: `123456`
    - Staff username: `staff`, password: `123456`
* Frontend: [http://localhost:4201](http://localhost:4201)
    - Username: `user`, password `123456`


Note that if you change API address, then you will need to update frontend global configuration for pointing new API address.

1. Open following files
    - `~/yii2-angular2-boilerplate/backend/src/app/model/global.service.ts` and
    - `~/yii2-angular2-boilerplate/frontend/src/app/model/global.service.ts`
2. Update `apiHost` to new backend/frontend address
    ```
    this.apiHost = 'http://new.address.local/v1';
    ```
   Make sure you append `/v1` after the API address.

## TODO
- [X] Enhance user management - send confirmation email 
- [X] Enhance user authorization with Yii2 RBAC (Role Based Access Control)
- [X] Develop new customer management section
- [X] Apply JWT(JSON Web Token) for user authentication
- [X] Upgrade Angular 2 to Angular 4
- [ ] Develop file uploader
- [ ] Develop more test code 
- [ ] Dockerize application
   
## Screenshots
![Frontend - Homepage](/screenshots/01.png?raw=true)
![Frontend - Sample Page](/screenshots/02.png?raw=true)
![Frontend - Server Send Event Sample Page](/screenshots/03.png?raw=true)
![Frontend - Registration](/screenshots/04.png?raw=true)
![Frontend - Registration Completion](/screenshots/05.png?raw=true)
![API - Email content for registration](/screenshots/06.png?raw=true)
![Frontend - Account Confirmation](/screenshots/07.png?raw=true)
![Frontend - Login](/screenshots/08.png?raw=true)
![Frontend - Password Reset Request](/screenshots/09.png?raw=true)
![Frontend - Password Reset Request Completion](/screenshots/10.png?raw=true)
![API - Email content for resetting password](/screenshots/11.png?raw=true)
![Frontend - Reset Password Form](/screenshots/12.png?raw=true)
![Frontend - Password Updated](/screenshots/13.png?raw=true)
![Frontend - Account Page](/screenshots/14.png?raw=true)
![Frontend - Account Edit Page](/screenshots/15.png?raw=true)
![Backend - Login](/screenshots/16.png?raw=true)
![Backend - Dashboard](/screenshots/17.png?raw=true)
![Backend - Staff Management](/screenshots/18.png?raw=true)
![Backend - Staff Management](/screenshots/19.png?raw=true)
![Backend - Staff Management](/screenshots/20.png?raw=true)
![Backend - User Management](/screenshots/21.png?raw=true)
![Backend - User Management](/screenshots/22.png?raw=true)
![Backend - User Management](/screenshots/23.png?raw=true)
![Backend - Setting](/screenshots/24.png?raw=true)
![Backend - Setting](/screenshots/25.png?raw=true)

## Thanks to
@ihormartyniuk
