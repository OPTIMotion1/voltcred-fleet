const axios = require("axios");

const BASE_URL = "https://app.voltcred.com";

// Axios instance that automatically stores and sends cookies
// jar-less manual approach: we keep the raw Set-Cookie value ourselves,
// since plain axios does not persist cookies between requests by default.
let sessionCookie = null;

async function login() {
  const response = await axios.post(
    `${BASE_URL}/api/session`,
    new URLSearchParams({
      email: process.env.TRACCAR_EMAIL,
      password: process.env.TRACCAR_PASSWORD,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // Traccar responds with a Set-Cookie header containing JSESSIONID
  const rawCookie = response.headers["set-cookie"];
  if (!rawCookie || rawCookie.length === 0) {
    throw new Error("Login succeeded but no session cookie was returned");
  }

  // Keep only the "JSESSIONID=xxxx" part, drop attributes like Path/HttpOnly
  sessionCookie = rawCookie[0].split(";")[0];

  return sessionCookie;
}

// Generic authenticated request wrapper. Logs in first if we have no
// session yet, and retries once if the session turns out to be expired (401).
async function authedRequest(method, path, data) {
  if (!sessionCookie) {
    await login();
  }

  const config = {
    method,
    url: `${BASE_URL}${path}`,
    headers: { Cookie: sessionCookie },
  };
  if (data !== undefined) {
    config.data = data;
    config.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const status = error.response?.status;

    if (status === 401) {
      // Session expired — log in again once and retry
      await login();
      config.headers.Cookie = sessionCookie;

      const retryResponse = await axios(config);
      return retryResponse.data;
    }

    throw error;
  }
}

async function getDevices() {
  return authedRequest("get", "/api/devices");
}

async function getPositions() {
  return authedRequest("get", "/api/positions");
}

// Returns the list of command types this specific device supports
// (e.g. engineStop/engineResume), so the UI can avoid offering
// commands the hardware can't actually run.
async function getCommandTypes(deviceId) {
  return authedRequest("get", `/api/commands/types?deviceId=${deviceId}`);
}

// Sends a remote command (e.g. engineStop, engineResume) to a device.
// Traccar returns 200 once the command is accepted/queued — that does NOT
// guarantee the vehicle has actually executed it yet, just that Traccar
// has dispatched (or queued, if offline) the instruction.
async function sendCommand(deviceId, type) {
  return authedRequest("post", "/api/commands/send", {
    id: 0,
    deviceId,
    type,
    attributes: {},
  });
}

module.exports = { getDevices, getPositions, getCommandTypes, sendCommand, login, authedRequest };