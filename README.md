# Yii2 REST API + Angular 10 Boilerplate

[![Build](https://github.com/chrisleekr/yii2-angular-boilerplate/workflows/.github/workflows/main.yml/badge.svg)](https://github.com/chrisleekr/yii2-angular-boilerplate/actions?query=workflow%3Amain)

This is a boilerplate project for future use. The project consists of REST API developed by Yii2 and backend/frontend
developed by Angular 10 with Bootstrap 4.

The project involves:

- API
  - Yii2 REST API, Yii2 RBAC, JWT (JSON Web Token), Memcached, _Basic Unit & Functional Test using Codeception_
- Backend: Staff/Administrator dashboard to manage staffs, users and settings
  - Angular 10, Bootstrap 4, JWT (JSON Web Token), _Basic Unit test using Karma+Jasmine_, Moment.js, Sweet Alert,
    Underscore.js
- Frontend: User website to support user registration, login and account management
  - Angular 10, Bootstrap 4, JWT (JSON Web Token), _Basic Unit using Karma+Jasmine, Basic E2E test using
    Protractor+Jasmine_, Moment.js, Sweet Alert

## Demo

| Service  | Endpoint                                                                                     |
| -------- | -------------------------------------------------------------------------------------------- |
| Frontend | [https://yam-boilerplate.chrislee.kr/frontend](https://yam-boilerplate.chrislee.kr/frontend) |
| Backend  | [https://yam-boilerplate.chrislee.kr/backend](https://yam-boilerplate.chrislee.kr/backend)   |
| API      | [https://yam-boilerplate.chrislee.kr/api](https://yam-boilerplate.chrislee.kr/api/ping)      |

![Demo](https://user-images.githubusercontent.com/5715919/97081825-b4b6b680-1650-11eb-81c3-fe49b84e787e.gif)

## Architecture Diagram

![Architecture Diagram](https://user-images.githubusercontent.com/5715919/97081827-be401e80-1650-11eb-96ed-c192c842e530.png)

## Features

- API
  - User Controller
    - GET/POST/PUT/DELETE /v1/user
    - POST /v1/user/login
    - POST /v1/user/signup
    - POST /v1/user/confirm
    - POST /v1/user/password-reset-request
    - POST /v1/user/password-reset-token-verification
    - POST /v1/user/password-reset
    - GET/POST /v1/me
    - GET /v1/page/sse
  - Staff Controller
    - GET/POST/PUT/DELETE /v1/staff
    - POST /v1/staff/login
    - GET /v1/staff/get-permissions
  - Setting Controller
    - GET/POST/PUT/DELETE /v1/setting
    - GET /v1/setting/public
- Backend
  - Staff Login/Logout
    - API generates JWT(JSON Web Token) upon successful login.
  - Dashboard
    - Currently, dashboard is empty page.
  - Staff Management
    - Admin or staff who has a permission 'manageStaffs' can create/update/delete staff information.
    - Staff role can configure permissions for managing staff, user and setting.
  - User Management
    - Admin or staff who has a permission 'manageUsers' can create/update/delete user information.
  - Setting Management
    - Admin or staff who has a permission 'manageSettings' can create/update/delete setting information.
- Frontend
  - User Login/Logout
    - User can login with username and password.
    - API generates JWT(JSON Web Token) upon successful login.
    - Frontend will store JWT in local storage and use for all requests.
    - API will validate submitted access token prior to process any request.
  - User Registration
    - User can register new account.
    - API will submit verification email to the email. Note that current API system will use swift mailer component with
      file transport. You can check the email content in debug module.
  - User Email Confirmation
    - Frontend will confirm the auth key and update account status if auth key is valid.
  - User Reset Password
    - User can reset their password.
    - API will send password reset email to the requested email.
    - Frontend will display the password reset page if password reset token is valid.
  - User Account
    - User can change email address. If change email address, the API will send confirmation email to verify email
      address.
    - User can change password.

## How to start

Currently, the project is not ready for production use. Following steps are suitable for configuring development
environment.

To run the application, you will need `docker` and `docker-compose` installed.

Open the console and execute following commands.

```
$ git clone https://github.com/chrisleekr/yii2-angular-boilerplate.git
$ cd yii2-angular-boilerplate
$ docker-compose up -d
```

With `docker-compose`, following containers will be configured. Please make sure port 80, 443 are available.

1. MySQL database will be configured by API migration.
2. Memcached will be configured.
3. REST API - Yii 2
   - Database migration will be executed which are located in `/api/migrations`.
   - PHP-FPM and nginx will be running.
4. Backend - Angular
   - By default, development mode will be running with nginx.
5. Frontend - Angular
   - By default, development mode will be running with nginx.

Once all containers are finished compiling, then open the browser.

- **REST API - Yii 2**: [http://localhost/api/debug](http://localhost/api/debug)

  - To make sure API is working, go to [http://localhost/api/ping](http://localhost/api/ping). You must see `pong`
    message.

  - To access docker container, use following command:

    ```bash
    docker exec -it api /bin/sh
    ```

  - To run code sniffer, use following command:

    ```bash
    docker exec api composer run sniff
    ```

  - To run unit test, use following command:

    ```bash
    docker exec api composer run test:unit
    ```

- **Backend - Angular**: [http://localhost/backend](http://localhost/backend)

  - Administrator username: `admin`, password: `123456`

  - Staff username: `staff`, password: `123456`

  - To see compile process, use following command:

    ```bash
    docker logs backend --follow
    ```

  - To access docker container, use following command:

    ```bash
    docker exec -it backend /bin/sh
    ```

  - Note that the **live reloading feature has been disabled** due to restriction.

  - Please open **Developer Tool** to prevent caching. The changes will be checked every 1s. Please refer
    `/backend/image-files/usr/local/bin/docker-entrypoint-dev.sh`.

  - To run unit test, use following command:

    ```bash
    $ cd frontend
    $ npm run test
    ```

- **Frontend - Angular**: [http://localhost/frontend](http://localhost/frontend)

  - Username: `user`, password `123456`

  - To see compile process, use following command:

    ```bash
    $ docker logs frontend --follow
    ```

  - To access docker container, use following command:

    ```bash
    $ docker exec -it frontend /bin/sh
    ```

  - Note that the **live reloading feature has been disabled** due to restriction.

  - Please open **Developer Tool** to prevent caching. The changes will be checked every 1s. Please refer
    `/frontend/image-files/usr/local/bin/docker-entrypoint-dev.sh`.

  - To run unit test, use following command:

    ```bash
    $ cd frontend
    $ npm run test
    ```

  - To run E2E test, use following command:

    ```bash
    $ cd frontend
    $ npm run e2e
    ```

## Files & Folders structures

- **docker-compose.yml**: contains docker container specifications
- **api**: Yii2
  - `image-files`: contains nginx config, php.ini, composer and `docker-entrypoint.sh`
- **backend**: Angular Backend
  - `image-files`: contains nginx config, `docker-entrypoint-dev.sh` and `docker-entrypoint.sh`
- **frontend**: Angular Frontend
  - `image-files`: contains nginx config, `docker-entrypoint-dev.sh` and `docker-entrypoint.sh`
- **nginx**: Load Balancer
  - `image-files`: contains nginx config

## Setup for production

To run production mode, update `docker-compose.yml` by changing `target: build-stage` to `target: production-stage` for
backend and frontend.

## Troubleshooting

**I changed backend/frontend code, but I cannot see changes in the browser.**

As mentioned earlier, you have to open `Developer Tool` to prevent cache if you are using Chrome. Or clear browser cache
and reload again.

## TODO

- [x] Enhance user management - send confirmation email
- [x] Enhance user authorization with Yii2 RBAC (Role Based Access Control)
- [x] Develop new customer management section
- [x] Apply JWT(JSON Web Token) for user authentication
- [x] Upgrade Angular to latest
- [x] Dockerize application
- [ ] Develop file uploader
