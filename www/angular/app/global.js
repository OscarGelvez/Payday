/**
 * Archivo de definición de constantes y variables globales
 * 
 * @type @exp;angular@call;module
 */

var kubeApp = angular.module('kubeApp');

kubeApp.constant('APP', {
    //'BASE_URL': "http://192.168.33.10/payday-all-in/laravel/public/",
     'BASE_URL': "http://192.168.50.199/payday-all-in/laravel/public/",
    'FOLDER_URL': "http://localhost/casa_cambio/",
    'FILES_URL': "http://localhost/casa_cambio/files/",
    'TABLES' : {
        "names" : [
            "type_paids",
            "permissions",
            "zones",
            "neighbourhoods",
            "customers",
            "loans",
            "fees",
            "moves",
            "payments"
        ],
        "fields" : {
            "moves" : [
                "id integer PRIMARY KEY ASC NOT NULL",
                "type integer NOT NULL",
                "created text NOT NULL",
                "description TEXT NOT NULL",
                "value integer NOT NULL",
                "hour timestamp NOT NULL",
                "loan_id integer",
                "is_move_business tinyinteger NOT NULL",
                "is_move_payment boolean NOT NULL DEFAULT 0",
                "FOREIGN KEY(loan_id) REFERENCES loans(id)",

            ],
            
            "type_paids" : [
                "id integer PRIMARY KEY ASC NOT NULL",
                "name TEXT NOT NULL",
                "description LONGBLOB NOT NULL"
            ],
            
            "permissions" : [
                "id integer PRIMARY KEY ASC NOT NULL",
                "name TEXT NOT NULL",
                "description TEXT NOT NULL"
            ],
            
            "zones" : [
                "id integer NOT NULL",
                "name TEXT NOT NULL",
                "PRIMARY KEY (id)"
            ],

            "neighbourhoods" : [
                "id integer NOT NULL",
                "name TEXT NOT NULL",
                "zone_id integer NOT NULL",
                "PRIMARY KEY (id)",
                "FOREIGN KEY(zone_id) REFERENCES zones(id)"

            ],
            
            "customers" : [
                "id integer PRIMARY KEY ASC NOT NULL",
                "address TEXT NOT NULL",
                "phone_numbers TEXT NOT NULL",
                "name TEXT NOT NULL",
                "neighbourhood_id integer NOT NULL",
                "is_evil TINYINT NOT NULL",
                "route_position INT NOT NULL",
                "email TEXT NOT NULL",
                "document VARCHAR NOT NULL",
                "my_client boolean NOT NULL DEFAULT 1",
                "is_updated boolean NOT NULL DEFAULT 0",
                "is_new boolean NOT NULL DEFAULT 1",    //campo de prueba para verificar la funcionalidad de actualizar
                "FOREIGN KEY(neighbourhood_id) REFERENCES neighbourhoods(id)"
            ],
            
            "loans" : [
                "id integer PRIMARY KEY ASC NOT NULL",
                "customer_id integer NOT NULL",
                "created text NOT NULL",
                "start_date text NOT NULL",
                "date_end text NOT NULL",
                "interest_produced INT DEFAULT 0 NOT NULL",
                "pay_period varchar(20) NOT NULL",
                "balance INT NOT NULL",
                "interest_rate INT NOT NULL",
                "value_loaned INT NOT NULL",
                "type_paid_id integer NOT NULL",
                "state integer DEFAULT 1 NOT NULL",
                "retention INT",
                "guarantor_id integer DEFAULT NULL",
                "numbers_of_fee integer",
                "is_updated boolean NOT NULL DEFAULT 0",
                "is_new boolean NOT NULL DEFAULT 1",    //campo de prueba para verificar la funcionalidad de actualizar
                "FOREIGN KEY(customer_id) REFERENCES customers(id)",
                "FOREIGN KEY(guarantor_id) REFERENCES customers(id)",
                "FOREIGN KEY(type_paid_id) REFERENCES type_paids(id)"
            ],
                
            "fees" : [
                "id integer PRIMARY KEY ASC NOT NULL",
                "payment_date text NOT NULL",
                "state integer NOT NULL",
                "value INT NOT NULL",
                "interest_arrears INT NOT NULL",
                "loan_id integer NOT NULL",
                "is_updated boolean NOT NULL DEFAULT 0",
                "is_new boolean NOT NULL DEFAULT 1",    //campo de prueba para verificar la funcionalidad de actualizar
                "FOREIGN KEY(loan_id) REFERENCES loans(id)"
            ],
                
            "payments" : [
                "id integer PRIMARY KEY ASC NOT NULL",
                "value INT NOT NULL",
                "fee_id integer NOT NULL",
                "created text NOT NULL",
                "description TEXT NOT NULL",
                "type_of_fee integer default 1",
                "is_updated boolean NOT NULL DEFAULT 0",                
                "move_id integer not null",
                "FOREIGN KEY(fee_id) REFERENCES fees(id)",
                "FOREIGN KEY(move_id) REFERENCES moves(id)"
            ]
        }
    },
    'UP_DATABASE' :[
        "insert into zones (id,name) values (1,'esta es la zona 1');",
        "insert into zones (id,name) values (2,'esta es la zona 2');",
        "insert into neighbourhoods (id, name, zone_id) values (1,'Aeropuerto',1);",
        "insert into neighbourhoods (id, name, zone_id) values (2,'San Luis',2)",
        "insert into type_paids (id, name, description) values (1,'Con Abono a Capital','la descripcion');",
        "insert into type_paids (id, name, description) values (2,'Sin Abono a Capital','la descripcion');",
        "insert into customers (my_client,address, phone_numbers,name,neighbourhood_id,is_evil,route_position,document,email,is_updated) values (1,'calle 12 # 9-10','58912931,3128412312','ivonne saavedra',2,0,0,1,'ivonne@email.com',0);",
        "insert into customers (my_client,address, phone_numbers,name,neighbourhood_id,is_evil,route_position,document,email,is_updated) values (1,'calle 9 # 11-55','5801123,5909132','Mario Nieto',2,0,1,2,'mario@email.com',0);"

    ]
});

