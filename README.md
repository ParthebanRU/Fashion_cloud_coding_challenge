# Fashion_cloud_coding_challenge
Description:
-------------------------------------------------
An API application with Node, Express and MongoDB

Run the app:
-------------------------------------------------------
You can run the app using one of the following commands:

    1) npm start
    2) npm run start
    3) node .

You can run the test on app using one of the following commands:

    1) npm test
    2) npm run test

API's to Use
-----------------------------

    1) Find all valid entries - HTTP Method: GET, URL: /
    2) Find valid entry for given key - HTTP Method: GET, URL: /{key_value}
    3) Find create/update entry - HTTP Method: PUT, URL: /, Request body: {'key': <your_key>, 'value': <your_value>(optional)}
    4) Remove single entry - HTTP Method: DELETE, URL: /{key_value}
    5) Remove all entries - HTTP Method: DELETE, URL: /

Tech stack used
-----------------------------
node version: 16.15.0

npm version: 8.5.5

mongo version: 5.0.8

Configurable Variables:
----------------------------------

To change the port on which the app is running, goto .env file and change the value of the variable APP_PORT.

To change the time to live (TTL), goto .env file and change the value of the variable TTL.

To change the length of random generated string, goto .env file and change the value of the variable RS_LENGTH.
