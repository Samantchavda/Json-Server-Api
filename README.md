# Json-Server-Api


Api call Example

Login : http://localhost:3000/auth/login
payload : {
	"email":"Samant@email.com",
	"password": "Samant"
}

Response : {
   "access_token": "<ACCESS_TOKEN>"
}

-----
for Other call header as
Authorization : Bearer <ACCESS_TOKEN>

GET : http://localhost:3000/api/Gender?_sort=text&_order=asc

PUT: http://localhost:3000/api/Gender/3 
Payload : {
    "id": 3,
    "text": "Other"
}

PATCH : http://localhost:3000/api/Employee/1
Paylod : {
	"First Name": "Milap12"
}

POST: http://localhost:3000/api/Gender 
payload : {
    "id": 3,
    "text": "Femail"
}

DELETE: http://localhost:3000/api/Gender/3






