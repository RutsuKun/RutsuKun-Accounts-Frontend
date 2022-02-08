import fs from "fs";
import path from "path";

const accessTokenPrivateKey = () => {
  return fs.readFileSync(path.join(__dirname, "AccessTokenPrivate.key")).toString();
};
const accessTokenPublicKey = () => {
  return fs.readFileSync(path.join(__dirname, "AccessTokenPublic.pem")).toString();
};

const refreshTokenPrivateKey = () => {
  return fs.readFileSync(path.join(__dirname, "RefreshTokenPrivate.key")).toString();
};
const refreshTokenPublicKey = () => {
  return fs.readFileSync(path.join(__dirname, "RefreshTokenPublic.pem")).toString();
};

const idTokenPrivateKey = () => {
  return fs.readFileSync(path.join(__dirname, "IDTokenPrivate.key")).toString();
};
const idTokenPublicKey = () => {
  return fs.readFileSync(path.join(__dirname, "IDTokenPublic.pem")).toString();
};

const codeTokenPrivateKey = () => {
  return fs.readFileSync(path.join(__dirname, "CodeTokenPrivate.key")).toString();
};
const codeTokenPublicKey = () => {
  return fs.readFileSync(path.join(__dirname, "CodeTokenPublic.pem")).toString();
};

const emailTokenPrivateKey = () => {
  return fs.readFileSync(path.join(__dirname, "CodeTokenPrivate.key")).toString();
};
const emailTokenPublicKey = () => {
  return fs.readFileSync(path.join(__dirname, "CodeTokenPublic.pem")).toString();
};

const mfaTokenPrivateKey = () => {
  return fs.readFileSync(path.join(__dirname, "MfaTokenPrivate.key")).toString();
};
const mfaTokenPublicKey = () => {
  return fs.readFileSync(path.join(__dirname, "MfaTokenPublic.pem")).toString();
};

export default {
  accessTokenPrivateKey,
  accessTokenPublicKey,
  refreshTokenPrivateKey,
  refreshTokenPublicKey,
  idTokenPrivateKey,
  idTokenPublicKey,
  codeTokenPrivateKey,
  codeTokenPublicKey,
  emailTokenPrivateKey,
  emailTokenPublicKey,
  mfaTokenPrivateKey,
  mfaTokenPublicKey
};
