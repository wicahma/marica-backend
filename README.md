# MARICA API Routing

### Basic Needs

- Validation, Pada setiap Routing API, akan terdapat validasi apakah data tersebut sudah sesuai atau belum, berserta dengan pesan errornya apabila terdapat error.

```javascript
// Backend
router
  .route("/login")
  .post(
    [
      body("identifier").exists().withMessage("Email or Username is required!"),
      body("password")
        .exists()
        .withMessage("Password is required!")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long!"),
    ],
    loginUser
  );

// Typically Frontend response
{
    "type": "Error",
    "message": "Validation Error!"
    "errors": [
        {
        "msg": "Email or Username is required!",
        "param": "identifier",
        "location": "body"
        },
        {
        "msg": "Password is required!",
        "param": "password",
        "location": "body"
        },
        {
        "msg": "Password must be at least 8 characters long!",
        "param": "password",
        "location": "body"
        }
    ]
}
```

- Authentication, autentikasi pada Ruting yang ada dijalankan dengan menggunakan JWT

```javascript
// Frontend
const header =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzk1MzY0MDIsImV4cCI6MTY4MDE0MTIwMn0.oPipUbB3pm898kD3kDnvdDhSiDxcAD8LuNawCiJoI8Y";

// Contoh penerapan header dengan Axios
axios
  .get(`${mainRoute}/user`, {
    headers: {
      Authorization: header,
    },
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.response.data);
  });
```

- Params, Bentuk data yang di send dengan lokasi Parameter URL

```javascript
// Backend
const mainRoute = "/api/v1";
router.route(mainRoute, "/user/:id");

// :id merupakan params
```

Contoh penggunaan:
_https://marica.com/api/v1/user/vdDhSiDxcAD8LuNawCiJoI8Y_

- Body, Bentuk data yang di send dengan lokasi Body Request, Sebagian besar body berbentuk JSON, kecuali apabila terdapat pengiriman File ke backend, maka akan berbentuk Form Data

```javascript
// Frontend
const newUser = {
  username: "marica",
  email: "marica.kecil@gmail.com",
  password: "marica123",
  // etc...
};

// Contoh bentuk pengiriman data dengan Axios
axios
  .post(`${mainRoute}/user`, newUser)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err.response.data);
  });
```

- Query, Bentuk data yang di send dengan lokasi Query Location URL

```javascript
// Backend
const mainRoute = "/api/v1";
router.route(mainRoute, "/user");

// Query tidak dituliskan pada backend melainkan pada frontend saja
```

Contoh penggunaan:
_https://marica.com/api/v1/user/vdDhSiDxcAD8LuNawCiJoI8Y/anak?username=diama_

### Stack

<img
src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"
/>
<img
src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"
/>
<img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"/>
<img src="https://img.shields.io/badge/MongoDB-045228?style=for-the-badge&logo=MongoDB"/>
<img src="https://img.shields.io/badge/Passport-088542?style=for-the-badge&logo=Passport"/>
<img src="https://img.shields.io/badge/Express%20Session-black?style=for-the-badge&logo=Express%20Session"/>
<img src="https://img.shields.io/badge/Express%20Validator-black?style=for-the-badge&logo=Express%20Validator"/>
<img src="https://img.shields.io/badge/Express%20Async%20Handler-black?style=for-the-badge&logo=Express%20Async%20Handler"/>
<img src="https://img.shields.io/badge/Username%20Generator-black?style=for-the-badge&logo=Username%20Generator"/>
<img src="https://img.shields.io/badge/Google%20API-black?style=for-the-badge&logo=Google%20API"/>
<img src="https://img.shields.io/badge/Bcrypt-black?style=for-the-badge&logo=Bcrypt"/>
<img src="https://img.shields.io/badge/Mongoose-black?style=for-the-badge&logo=Mongoose"/>
<img src="https://img.shields.io/badge/Nodemailer-black?style=for-the-badge&logo=Nodemailer"/>

Main Route For API

- /api/v1 -> _we will name it **main** from now_

### User Routing

- /**main**/user -> _this is for user Routing_

#### **- Get All User**

- **Method** : GET
- **URL** : /user
- **Description** : Untuk mengambil semua user yang ada
- **Access** : Admin Only
- **Auth** : Yes
- **Params** : None
- **Query** : id
- **Body** : None

```javascript
Return;
```

### Series Routing

( ! ) _Under Construction, Please comeback later_

### Video Routing

( ! ) _Under Construction, Please comeback later_

### Comment Routing

( ! ) _Under Construction, Please comeback later_

### Payment Routing

( ! ) _Under Construction, Please comeback later_

### Admin Routing

( ! ) _Under Construction, Please comeback later_
