const voltcred =
require("../services/voltcred.service");

exports.login =
async (req, res) => {

  try {

    const token =
      await voltcred.login();

    res.json({
      success: true,
      token
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error:
        error.response?.data ||
        error.message
    });

  }

};