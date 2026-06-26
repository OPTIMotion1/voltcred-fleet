const axios = require("axios");

let authToken = null;

async function login() {
  try {
    const query = `
      mutation Login(
        $email:String!,
        $password:String!
      ) {
        sessionCreateV2(
          data:{
            email:$email,
            password:$password
          }
        ) {
          token
          success
        }
      }
    `;

    const response = await axios.post(
      process.env.VOLTCRED_URL,
      {
        query,
        variables: {
          email: process.env.VOLTCRED_EMAIL,
          password: process.env.VOLTCRED_PASSWORD
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    authToken =
      response.data.data.sessionCreateV2.token;

    return authToken;

  } catch (error) {
    console.error(
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = {
  login
};