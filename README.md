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

<p>
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
<img src="https://img.shields.io/badge/Express%20Session-%23404d59.svg?style=for-the-badge&logo=Express%20Session"/>
<img src="https://img.shields.io/badge/Express%20Async%20Handler-%23404d59.svg?style=for-the-badge&logo=Express%20Async%20Handler"/>
<img src="https://img.shields.io/badge/Express%20Validator-%23404d59.svg?style=for-the-badge&logo=Express%20Validator"/>
<img src="https://img.shields.io/badge/Google%20API-white?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5Ny43NSA3OC42MiI+PHBhdGggZD0iTTYyLjIxIDIxLjczbDMuMTMuMDYgOC41My04LjUxLjQyLTMuNmEzOC4yIDM4LjIgMCAwIDAtNjIuMyAxOC41N2MuODgtLjY0IDIuODgtLjE2IDIuODgtLjE2bDE3LTIuOHMuODgtMS40NCAxLjMxLTEuMzVhMjEuMTkgMjEuMTkgMCAwIDEgMjktMi4yMXoiIGZpbGw9IiNlYTQzMzUiLz48cGF0aCBkPSJNODUuNzkgMjguMjdhMzguMzIgMzguMzIgMCAwIDAtMTEuNTQtMTguNmwtMTIgMTJhMjEuMiAyMS4yIDAgMCAxIDcuOTIgMTYuNTN2Mi4xOWExMC42MyAxMC42MyAwIDEgMSAwIDIxLjI1aC0yMS4zbC0yLjEyIDIuMTR2MTIuNzNsMi4xMiAyLjEyaDIxLjI1YTI3LjYxIDI3LjYxIDAgMCAwIDE1LjY3LTUwLjM2eiIgZmlsbD0iIzQyODVmNCIvPjxwYXRoIGQ9Ik0yNy42MiA3OC42M2gyMS4yNXYtMTdIMjcuNjJhMTAuNTQgMTAuNTQgMCAwIDEtNC4zOC0xbC0zLjA2Ljk0LTguNTEgOC41NS0uNzQgMi44OGEyNy40NyAyNy40NyAwIDAgMCAxNi42OSA1LjYzeiIgZmlsbD0iIzM0YTg1MyIvPjxwYXRoIGQ9Ik0yNy42MiAyMy4zOUEyNy42MSAyNy42MSAwIDAgMCAxMC45NCA3M2wxMi4zMi0xMi4zMmExMC42MiAxMC42MiAwIDEgMSAxNC0xNGwxMi4zNi0xMi4zNmEyNy42IDI3LjYgMCAwIDAtMjItMTAuOTN6IiBmaWxsPSIjZmJiYzA0Ii8+PC9zdmc+"/>
<img src="https://img.shields.io/badge/Username%20Generator-089e94?style=for-the-badge&logo=Username%20Generator"/>
<img src="https://img.shields.io/badge/Mongoose-e63b20?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAeCAYAAAB0ba1yAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gEKExcne2z1KQAABEVJREFUWEft12uIFWUYB/Dfemk3tc1SiiS7kFFZGpbRBUwqhD50I5IoIiIrouhrTReCSmQiCKMLhBBURhEUaQYlGgRdhMDMyhbMohtbWVFauq176cMzc5ydnXP26gnCPwyz887zntn//7m+HMRBHMT/GS1DGYwH0uyelJ6La83GASeeakwuZTLaxR32YU/C3jr2GLtg40q8EcmUG3EVJuAnbMUmnI2bcCh6ZMSxG7/hB+xAB7Yl8a74u6MSYVyJ50g5FbOEJ3sFgcdwQcGsO7v+EgKcheMMRq8QY58Q5me8i3ewPqGrYs+QGBHxsrppeGkazsPVuASzK7a+hqNxJFZjGY5Fa8GmT0TDSNGB17Pra+wtilEvIoZFvKI4nSS8dyUuM5BAFdaKb81JmAtpCHU7ljTaiH78ip1CvBkNbDuxUUTEVnyRi1DmMCTxomIpZ+AOXIxT6m4ajC1Yj7txXcIrkDIRj+MGEQ1V6McfWINnBPk5WICFMiEr0IltIiVeTKKu1Pg0JJ4bpZGrK4WX2ofaVwc342EcgnMSvsu8Phf3YkqjzRmew9P4Soh2lHDASpxYZ08PduFtLMsjYBCBkofbRDivwmFl2xGiA4/gJXyIK4SIW7L7gcaPQoB9WDCgmJRIn4s3RFiOlTRR6S/FclEfXhUF7qNGm8YRvTgNx2DyxHy1RPpBPIl5g7aPDWcK1dfgeiwWffmEBnvGC3mKPpGwvoUBuTxVFKHzjS6Ph4sOvIw7RZ42C12YmtBXI5dGlVwnqmuXCI1dwiPtQpRJYrRsUy1MT8XapIq1vGevFmm0GNMr7Oohn/AmiOFopiia9Wy7RVVfmrA5lf3zWV++B9vxMXYkfF/cncZH5mA+LsRFor3l6MMKA0fKHtyKkwtrn+IF0ftbhcCtwvtDkd8pxtc+MdJOFS2trWCzW7Sy/NqCDxLep9DOssY+TRwM+pRQzP3S+mwxez+EIwTJ6Ql/l+yWiPTJMT/hs5LNPNFuZqmPDcIZ84SQh2frv2CzEPRzMdt3ojOJiK2hyGXEeVwqgi1ivl4nvD8zidAr2k8RneFyrEq4TQlpHFTWqk98F54Vs8AMvCe+uQHfiLDvTipSrZ7jqvKvIUo/0p/wbcpSMStX2e9JY+JahAeqbIaBdpwuUuH+JFIK9YnlqPduNIeCGrJOIIkqfZeKI2OGTcLjv1e8Gy4WiXowoMU2It0II/Z4FTLyG8vrmTBtSczateKC1oR/yvYFbBWh/KWoGT32H0+7G+wbNsZMPPd6AzyFWwohuRyPGky8RRxIrsWb6KnKWfZ/b7TebgpSOlOuyf5enNKVlgRPWZhGrViQPR9wjNnjw0Ab7ksjbJ8XoVvuJn+Ks/knQxWr8UIziPeJGf0t0fpqBY5afdgurqZhTFV9BJiA4w3j/N8sNMPjvcLrfYXn/vxlMaybEeI5mkF8hZjecrJ7BPn/FP8CFMQfknFKffkAAAAASUVORK5CYII="/>
<img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"/>
<img src="https://img.shields.io/badge/MongoDB-045228?style=for-the-badge&logo=MongoDB"/>
<img src="https://img.shields.io/badge/Bcrypt-612bb3?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAuMCAwLjAgOTYwLjAgOTYwLjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2xpcFBhdGggaWQ9InAuMCI+PHBhdGggZD0ibTAgMGw5NjAuMCAwbDAgOTYwLjBsLTk2MC4wIDBsMCAtOTYwLjB6IiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNwLjApIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjAuMCIgZD0ibTAgMGw5NjAuMCAwbDAgOTYwLjBsLTk2MC4wIDB6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjNmM1Y2U3IiBkPSJtMC41OTg0MjUyIDE1OS44MDM3M2wwIDBjMCAtODguMjU3MTY0IDcxLjU0NjU2IC0xNTkuODAzNzMgMTU5LjgwMzczIC0xNTkuODAzNzNsNjM5LjE5NTcgMGwwIDBjNDIuMzgyNTcgMCA4My4wMjkzIDE2LjgzNjQxNCAxMTIuOTk4MjkgNDYuODA1NDI4YzI5Ljk2OTA1NSAyOS45NjkwMSA0Ni44MDU0MiA3MC42MTU3MTUgNDYuODA1NDIgMTEyLjk5ODNsMCA2NDAuMzkyNmMwIDg4LjI1NzE0IC03MS41NDY1MSAxNTkuODAzNzEgLTE1OS44MDM3MSAxNTkuODAzNzFsLTYzOS4xOTU3IDBsMCAwYy04OC4yNTcxNiAwIC0xNTkuODAzNzMgLTcxLjU0NjU3IC0xNTkuODAzNzMgLTE1OS44MDM3MXoiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wIiBkPSJtNjkuOTkyMTMgMTM4LjI2NTA5bDg1MS4yMTI2IDBsMCAxMDkuMDcwODZsLTg1MS4yMTI2IDB6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJtNDc5LjMyNDk1IDY1OS4yNjUxbC04NS4zMjgxMjUgMGwwIC0zNzMuMzI4MWw2NS4wNjI1IDBxNzAuNDA2MjUgMCAxMDYuMTQwNjI1IDI1Ljg3NXEzNS43MzQzNzUgMjUuODU5Mzc1IDM1LjczNDM3NSA3Mi43OTY4NzVxMCA1My4zMjgxMjUgLTQ0Ljc5Njg3NSA3OC4zOTA2MjVxNjUuMDYyNSAyNC41MzEyNSA2NS4wNjI1IDkyLjI2NTU5NHEwIDQ4LjAgLTM1LjIwMzEyNSA3Ni4wcS0zNS4yMDMxMjUgMjguMCAtMTA2LjY3MTg3NSAyOC4wem0wIC0xNi4wcTI1LjA3ODEyNSAwIDQ1Ljg3NSAtNC4wcTIwLjc5Njg3NSAtNC4wIDM5LjczNDM3NSAtMTMuMzI4MTI1cTE4LjkzNzUgLTkuMzQzNzUgMjkuNTkzNzUgLTI3LjQ2ODc1cTEwLjY3MTg3NSAtMTguMTQwNjI1IDEwLjY3MTg3NSAtNDMuMjAzMTI1cTAgLTU3LjA2MjQ3IC01NC45Mzc1IC03Ny4zMjgwOTRsLTMyLjAgLTExLjczNDM3NWwyOS44NzUgLTE3LjA2MjVxMzYuNzk2ODc1IC0yMC4yNjU2MjUgMzYuNzk2ODc1IC02NC41MzEyNXEwIC04Mi42NzE4NzUgLTEyNS44NzUgLTgyLjY3MTg3NWwtNDkuMDYyNSAwbDAgMzQxLjMyODFsNjkuMzI4MTI1IDB6IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L2c+PC9zdmc+"/>
<img src="https://img.shields.io/badge/Passport-088542?style=for-the-badge&logo=Passport"/>
<img src="https://img.shields.io/badge/Nodemailer-white?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACICAYAAACiAKTyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAD/1JREFUeNrsXcty48YVbYJ6a0LBdlKprIzxLqvQC6+N+YJwvsDUF5iqfAClL9AofuVZpBdZZSHNImtScZw4GScjL7Oykh8wvXDKlYrF9AUvqBaIRwPdJAHwnCqMNCLYbNy+5/a9pxug88YffjYQgBF+/Pt/v4QV6oej3/7Dd+TPriTJOcxhhLYkCQJNvcjRlj8uHf5/T5KkC7MYoStJcgoz1IIcLpFDHq6j/H0gSeLDPEboS5Ig0FSdHNPpSP7q0f+dyOuXkiRtmMkIA0kS2LCqmE4HotGYj1+UIC6TxIWljDACSSo4e/zm75IcoqP+zYk5j6aWEUhiBJdnEtiwOuSg1FgeDZFFEAJFPyhbZiAbjmCGKpDjczlrBKnVwmtOyvsg/1ogCeTf0pODApkkRzwVnIz3Q/41B+Tf8pLDE1M5yzecxFTY0WgH8q85IP+WjRy//tyV5LiUaVVqnehotgf51xyQf8sFSQ5ZJ8bUHUUIAvnXDiD/lmP2oLrQT6o7ihCE4AnIv6aA/Lt2crzoCTHtCqehdb6Ts33Iv+aA/Ls+cnQD/w1mjuUQhAD51wJJIP+unBwzOZeI0Whov88p+HmQf80B+XeV5KANiNOp9Ph8Lu8YfC7kX3NA/l02OX71NzfYgEj1X7OZ+/2O4edD/jUH5N/lgmaO9mzmaKycIJB/LQ0iSLKU2WMwJ0ejmKs7FvrhCci/poD8a5scv/zrqSRHNyjInWbhdhxL/YH8a8eGkH/tkIPqur4Qsihvbhm15VjsF+RfCySB/GtMDl8Eci6RY9u4Pcdy/yD/Wgg0kH8Lk0POwtPLgByUVjUapSMIAfKvOSD/5ibHZ25AjinVc45R3bFsghAg/1oINFC28pCD5FzhBbPG1pa1tpdFEMi/dgD5Vw/nkhwzOzW3rDbsLLHTnoD8ayPQQP5NrzsGkhzdKW0jadqpO1ZFEALkXzs2hPwbR45ffNaltY45OSzVHaskCAHyrwWSQP5dIAc9v2oQkIM26FpOrVZJEALkXwuBBvLvnBy0O1eS406QpNvY2lnaZzkrvC7Iv+bYePn36KO/uHLWGE3FlHbpzshhue5YF0EIkH8tBJpNVbYCcgT1WEiOrdz3d5SdIJB/7WAj5d9pg76SYNqe3/hkYStJ2QhC8ATkXxuBZqPk39ZHf6at674Ii/LtnZV8rrOm64X8a8eGow0hR49EioAcVJRv74oiNz9ViSAEyL8WSFJ3+VeSg4hxPidHUJSvzm2dNV8/5F8Lgaau8q8kRzsgB+3OnfIO3SWtd5SVIATIv+aonfzb+vBTb/ZVaDPFiqTcZa53lJkgBMi/FgJNXZQtSQ7+Ek0mh6w3grqj0dhYgkD+tYN6yL+NYK1jJufS5EHkcNbjqk6JzOIJyL82Ak2l5d/Wh3+aPYmEyRHc29Fsrq0/TsnsA/nXjg1HFSUHiQ3dOTnkrDGTdAUIogDyrwWSVE3+leQgYvTn5KBMa2dv7f1ySmovyL8WAk1V5F9JjmB3rpgtdQT/NHb31lKUV4UgBMi/5ii9/Nv64BN+sLRgdkxn20icZin655R8gCH/Wgg0ZVW2JDlcOU3wk0iUxcA1rHdUlSCQf+2gdPLvjBzBg6W9e3I4pag7qkQQgicg/9oINOWSf6fhk0iYHA0uyktQd1SNIATIv3ZsWAr5t/X+JzSW3Tk5wh26Jak7qkgQAuRfCyRZt/wryUHE6KnkCG58KlHdUVWCECD/Wgg065J/Wx9+2pGEGMzWOmYPXKCt643d/dIay6ngAEP+NcfK5d/W+39si7vvBvNZI9xntXdQakM5FR1gyL8WAs2qlC1JDpJzSbFyF8jRcECQJQDyrx0sXf6dkYPk3LuH5NjZXfnNT5tEEIInIP/aCDTLlX+DLSTTtkqOYHduydY76kgQAuRfOzZcivzbeu+avump84AcdGfg3mFljOPUYIAh/1ogiW35V5KjKxnBW9en95sQ9w9LtxhYd4IQIP9aCDS25N/WB5907+Vccb8YuLNfysXATSAIAfKvOYzl39Z7Y5Jzz9VZI/h9a1vWHbuVM4hTswGG/Gsh0BRVtiQ5PDHbgOg+IIecNRq7B5U0Rt0IAvnXDnLLv5IcsyeRRMlBdfleteqOOhOEEEQxkMQ40OSTf6f0DbP0sAWFHFMuypvNyhrCqekAQ/61Y0Mt+bf18xHdLus/3EYyndUcJd2EuOkEIUD+tUCSLPm39d71KX2J5gNi8HcGVmm9YxMJQoD8ayHQJMm/cuboiru7vlpvzG9+OmjV4uKdDRhgyL/mWJB/WxcjqjcGD2cO/s7A/e9VtijfRIIQIP9aCDShshWQY/ZVaPfkELwJcfdwtuZRE2wKQSD/2sHojd/90w9WycMHSyvkEPS4nt29Wl2ws0GD6wnIv8aBpnF3N3JEo71ADnoiyf6j2l2ws2EDDPnXEDt7h+LVo+8/JEdQlNen7thkghAg/xpi96Aljg5b93utSM6twM1PIIg+IP+aQM4Uj9wfikdEjO3d0j3sDQSxA8i/hiQ5eu1H4vDoB7W+TGfDhxnyr5H3NIUrC/PtmqZXIAjkXyt47eCotiRxMLyQf42dSKZb7t6j4CcIUk9A/jUEzSA0k4Ag9QXkXwskcWkfFghSW0D+NcTB9q74XkVvrwVB9AD51xBEkIPtPRCkxoD8awiSf3drsKsXBEkYXwH51xiv7LcqL/+CIMnwBORfM+dqNMSrkiRVln9BkHRA/jVE03EC+dfBY39qC8i/hqA0q7X3CASpMSD/GoLk36MKPuUEBNEH5F9DHO7sV07+BUHyAfKvIaom/4IgOcdXQP41RpXkXxAkPzwB+dfM6Sok/4IgxQD51xBVkX9BkOKA/GuIKsi/WxgmI5D8+4X4DwxRFCT/Tqd34utvvyktQcYYJiO8AxuageTfb/77rfjf3XcwBgBUSlCACQAABAEAEAQAQBAAAEEAAAQBABAEAEAQAABBAAAEAQAABAEAPWA3r4K33nrrVP7oR/785MWLF2NYZ2k2n/KvY2nnJ6UkiOykn/D6rez0bc4LppuJonfb3ch2JnAHoKozyCjh9Yl0+Mc5nZtuIooSjiIDovBmzshvy+Na+tBpHWsQV+DWUqAYObqcrlKw7HNmUcsivZuSggFAEryM/9eGIISBJAme4gHkwZBq2LAGrWqKvZUjGtB0eYJxB3TA4s7jql9HnnWQHlItYNOQRpAJUi0ABEnGWUKq1YPZgE3BVkoO+UzOFj8Vi2saJNldyddvbHeGpcHwM93IbEZF3nN5XOVddOTU8B1u11NeuuV2z/IuiEbapzY7St9VhAXqRdpn8MwcSqGT0L78906k37TwepXQTkdpJ0Tu8eJritprbjMdeykp+cSmv6T0Tes6+f2eYssJ/73Ntp5fa1aRfiyPl2JxZXwgjzctXrDPbXoJp4ROQse5PP84yUFinI7Wcbop4gO9RlL2WcG+n4rF7Skq2nzQZ5zIfg9TzgsXbIlQT9Lalq+Rgz5ViNRmG8atN1BQo/OOsxyICdZPaEc975lsK0u0eXA9lojRTxnPPtvlJMM/OuJ+fe8J2+YyJriNHQ0l4iJuMHnwbM0aI6GvkwdPWJfvG2iQY5RizAXjyuPdHP125fEygxzRflMN19NsP6ttsteIiMHkGGU4dZvP91I+c8COorOo18saA8vZhc/BOms8PfaPtAXum8i4jGLIQbjOVLF4i8BNAlvbFshR1MjdDCMMNAc66sS6iHMkmqqvuH4bivt1ABXnCWqgamNfaZvaekWOQ4MOjsQ3Sn/PeYBd/vvT8Fw+/6nSj8SdEZEUT3D/o209jtSmXZ5xlk2ONtvbVdK844hdon3raQajc+W6h2yvx5whDXXXQcJUS9hKtTiSJTk4dfSaDeFybt9NiGLPo7tt2QE7KW0/Z2dOazut772YiHPFKcxEIwXri8jCGb1Pnhv9qDejKRFdqzyPSPIl999XnOZJ9PMp1eC0Ixy/DpEh5rwJt/uSr2OckFGcyvMmyti9w9e+LHK4EXIMZT+OU/p2pVxrWC/fZsw4gq95mEfFUj/8JkHVauumDAkpjRsTgWmQg87SINEAs0HeFPHSc1waEpcqTdjhjrlNnbbT+h4tXI/jxAOegaOG9zVm37OkeoE/J9rmSZJ4we0MI+lWbLvyeJy1vZ8EnMhst0x0FSe+iiNHiq+6mmnzWVJtmGeh8FlCytBPy2szCqWFmSppcPjC4wo9X/18RfWJ4mmKw93w1KoT0ToxxD7LUNbigkuWYw0zXr9Wya8hWnxh2anHBdLSIlAd/CSHr6b5mYjYLrGe1r5hiqfgY7G4Nd7lVEtbpeAUKO6ekaus6CDfO4xJidoKeeOi41gjKlLqMtZwnrj2f1JAtHg7MpAPZiQNGXWSUL/oFKZ5U5y2Yb1molp5yhje5vDVcCy9uJQykhoLY4IoTkSD2ouJ4r3I1JsXzzXPu04gyFWKA1/n6IOv4dgLtVCB601zsNucbV1bdkxfxK8brRpeJJ0f5XhvO/J7UoD8lzWCKOlCJ8ZwfS6QdGAyxd8WcLyxZts3YoOhFMR+CbvnrqNfuQnC09cJGzIu1dLNX/sWokpW6qESUock7Q0nR3Qt5Ypn1Zto/cbRfJUOe5MjyzCdkY1mkFA6vIopgPycapAKklt18vi3MyL/jeZ7RMHzrmMc47jAIJTtHv2eQo5QTSzTjDpZx227Jk81ORaLe6a0ijeuZSaRcynH9NOKaZZGuwUI4mu07WsoHkntu1kiQEahWAaoweGpBjmWXpuwn6hj6JnsmSsCx6DzNNgmN1DF1SuXSesDynaKhXRNNRr366ZA25e6s2dM9O9nbOGg9r+krRklvl3AVx0zg+ztFRbvQ+X3PFuB/LUShA05FMVvpTxLKMResiPRiq/Ph7qdQqedC822O7yf6KXIJ1teJLTtR2cNXkgN+06z36ikDzCY5HCu/gr79bGaBvL2pCxyhHYemQYkG09WPC6ST3PUT5qBuhzRR3z0Ehz4WcKWiDTiqm1fipzbTLj905hZyuVB+YoHhtr/Ssy2ZLgRIeCyhARR7XUe51hM+IFmKmotzRIP14sGSWtO3L9TRSzyi4yvrRpk7ui8Vfy8wHvpnpPXRbF1hGHGduunInuHa1x9oXv+k4T2s+TIidBctV8xLhTHD1NCSifDdYIjcS/vh/fndFZEkhMmbFdJacM9YF/z317n/rgRHzFZm7PzbF7uxLjoxbPD6M5CQe2jsSdnIvI9sG6Yp6ZS2s8zANSXxyVTh9RIfRwhepfTqT4HsZAcdN1f2M73M/p3HEmnPe5T2L+uQg4tH8kzg4wtXMNJyiwyySp8eWtAeFdeJ8G5nnNUmORxYh7Ad0XynYoXrJjErbhOsoQK+b4Lpf2kLfAfazzjd5yilMXZNDz/1sb5lJryzt84W90K5e5LFiXGGTbSuR7ta6bUlrcavSviF6vDtZJnGT6ibbv/CzAAa7WamRNusekAAAAASUVORK5CYII="/>
</p>

### Want to test the Backend? 

Click the button below to import the Postman Collection
 
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/24787219-ae142ac4-0766-425b-b4d2-956afca7e0e2?action=collection%2Ffork&collection-url=entityId%3D24787219-ae142ac4-0766-425b-b4d2-956afca7e0e2%26entityType%3Dcollection%26workspaceId%3D83056368-bca2-451e-8c25-56ca88eda2ef)

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
- **Params** : -
- **Query** : -
- **Body** : -
- **Session** : _(unimplemented)_ -> _for admin only_

#### **- Re Login User**

- **Method** : GET
- **URL** : /user/re-login
- **Description** : Untuk melakukan pengecekan data user melalui JWT Token yang tersimpan pada local storage setiap kali user mengakses website yang ada
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : -
- **Query** : -
- **Body** : -
- **Session** : id (user id)

#### **- Create user Orangtua**

- **Method** : POST
- **URL** : /user
- **Description** : Untuk membuat user baru dengan role orangtua
- **Access** : Admin & Orangtua
- **Auth** : No
- **Params** : -
- **Query** : -
- **Body** : email, nama, password
- **Session** : -

#### **- Login User**

- **Method** : POST
- **URL** : /user/login
- **Description** : Untuk melakukan login user
- **Access** : Admin & Orangtua
- **Auth** : No
- **Params** : -
- **Query** : -
- **Body** : identifier (username/email), password
- **Session** : -

#### **- Update User**

- **Method** : PUT
- **URL** : /user
- **Description** : Untuk mengupdate data user
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : -
- **Query** : -
- **Body** : nama?, imageID?, lahir?, username?
- **Session** : id (user id)

#### **- Delete User**

- **Method** : DELETE
- **URL** : /user
- **Description** : Untuk menghapus data user dan anaknya secara permanen
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : -
- **Query** : -
- **Body** : -
- **Session** : id (user id)

#### **- Update data Anak**

- **Method** : PUT
- **URL** : /user/anak
- **Description** : Untuk mengupdate / memperbarui data anak
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : -
- **Query** : -
- **Body** : lahir, image, character

```javascript
body.character = {
  gender: enum = ["male", "female"], baju: ObjId[] = [baju1ID, baju2ID, ...],
  celana: ObjId[] = [celana1ID, celana2ID, ...],
  aksesorisTangan: ObjId[] = [aksesorisTangan1ID, aksesorisTangan2ID, ...],
  aksesorisKepala: ObjId[] = [aksesorisKepala1ID, aksesorisKepala2ID, ...],
  aksesorisMuka: ObjId[] = [aksesorisMuka1ID, aksesorisMuka2ID, ...],
  }
```

- **Session** : id (user id orangtua)

#### **- Delete data Anak**

- **Method** : DELETE
- **URL** : /user/anak
- **Description** : Untuk menghapus data user secara permanen
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : -
- **Query** : -
- **Body** : -

#### **- Create data Anak**

- **Method** : POST
- **URL** : /user/anak
- **Description** : Untuk membuat user anak dari akses izin orangtua dan admin
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : id Orangtua
- **Query** : -
- **Body** : nama, lahir
- **Session** : id (user id orangtua)

#### **- Get All data Anak in one User**

- **Method** : GET
- **URL** : /user/all-anak
- **Description** : Untuk mengambil seluruh data anak yang ada pada satu orangtua
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : -
- **Query** : -
- **Body** : -
- **Session** : id (user id orangtua)

#### **- Get One data Anak in one User**

- **Method** : GET
- **URL** : /user/anak?idAnak=**id**
- **Description** : Untuk mengambil 1 data anak yang ada pada satu orangtua
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : -
- **Query** : idAnak
- **Body** : -
- **Session** : id (user id orangtua)

#### **- Update email Validation Token** (exp: 30 minute)

- **Method** : GET
- **URL** : /user/:email/validation/create
- **Description** : Untuk memperbarui token validasi email
- **Access** : Admin & Orangtua
- **Auth** : Yes
- **Params** : email
- **Query** : -
- **Body** : -

### Series Routing

- /**main**/series -> _this is for user Routing_

#### **- Get All Series**

- **Method** : GET
- **URL** : /series
- **Description** : Untuk mengambil semua data series tanpa detail data video
- **Access** : admin & orangtua & anak
- **Auth** : Yes
- **Params** : -
- **Query** : -
- **Body** : -
- **Session** : _(unimplemented)_ -> _for admin only_

### Video Routing

( ! ) _Under Construction, Please comeback later_

### Comment Routing

( ! ) _Under Construction, Please comeback later_

### Payment Routing

( ! ) _Under Construction, Please comeback later_

### Admin Routing

( ! ) _Under Construction, Please comeback later_
