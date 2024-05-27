import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import { createVerificationInstance, getVerificationInstance, updateVerificationInstance } from "../database/functions.js";

// Password generation 
export async function generatePassword(plainTextPassword) {
    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(plainTextPassword, salt);
        return password;
    } catch (error) {
        throw error;
    }
}
// Password validation
export async function validatePassword(plainTextPassword, hashedPassword) {
    try {
        const match = bcrypt.compare(plainTextPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}

// Issuing JWT
export function issueJWT(user){
    const payload = {
        sub: user.userId,
        iat: Date.now()
    };

    const token = jsonwebtoken.sign(payload, process.env.SECRET, {expiresIn: "7d", algorithm: "HS256"});
    return token;
}

//Generate verification code
const generateCode = (length) => {
    const values = [];

    for (let i = 0; i < length; i++) {
        const value = Math.floor(Math.random() * 10);
        values.push(value);
    }

    const code = values.join("");
    return code;
}

//Send verification email
export async function sendCode(receiver, type) {
    try{
       const expireIn = 120;
       const code = generateCode(6);
 
       let transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
             user: process.env.SMTP_USER,
             pass: process.env.SMTP_PASSWORD
          }
       });
 
       let options;
       if(type === "account-verification"){
          options = {
             from: process.env.SMTP_USER,
             to: receiver,
             subject: "Gamestore - verification code",
             text: `Code for verification: ${code}`,
             html: `<div>Code will expire in 2 hours<br/>If you have not attempted to register on <b>Gamestore</b>, ignore this message</div><br/><h1>${code}</h1>`
          }
       }else if(type === "password-reset") {
          options = {
             from: process.env.SMTP_USER,
             to: receiver,
             subject: "Gamestore - password reset",
             text: `Code for resetting password: ${code}`,
             html: `<div>Code will expire in 2 hours<br/>If you have not attempted to change your password, ignore this message</div><br/><h1>${code}</h1>`
          }
       }else if(type === "email-change") {
        options = {
           from: process.env.SMTP_USER,
           to: receiver,
           subject: "Gamestore - changing email",
           text: `Code for changing email: ${code}`,
           html: `<div>Code will expire in 2 hours<br/>If you have not attempted to change your email, ignore this message</div><br/><h1>${code}</h1>`
        }
     }

        const info = await transporter.sendMail(options);

        //Check if such a verification instance already exists
        const [existingVerificationInstances] = await getVerificationInstance(receiver, type)
        if(existingVerificationInstances.length > 0) {
            const verificationInstanceId = existingVerificationInstances[0].verificationId;
            const updatedVerificationInstance = await updateVerificationInstance(code, expireIn, verificationInstanceId);
            return updatedVerificationInstance;
        //If no create a new one
        }else{
            const verificationInstance = await createVerificationInstance(receiver, code, expireIn, type);
            return verificationInstance
        }
 
    }catch(err){
       throw new Error("Couldn't send verification code, try later");
    }
 
 }

// Prototype of transaction
export async function makeTransaction(cardNumber, expiryDate, cvv, amount) {
    if (!isValidCard(cardNumber, expiryDate, cvv)) {
        return { success: false, message: "Invalid card details" };
    }

    let transactionRequest = { cardNumber, expiryDate, cvv, amount, currency: "USD" };
    let response = sendTransactionRequest(transactionRequest);

    return response.success
        ? { success: true, message: "Transaction successful", transactionId: response.transactionId }
        : { success: false, message: "Transaction failed", error: response.error };
}

// Helper Functions
function isValidCard(cardNumber, expiryDate, cvv) {
    let [month, year] = expiryDate.split('/').map(Number);
    year += 2000;
    let expiryDate_ = new Date(year, month - 1);

    let now = new Date();
    now.setHours(0, 0, 0, 0);

    if (cardNumber.length !== 16) return false;
    if (!['2', '4', '5'].includes(cardNumber[0])) return false;
    if (expiryDate.length !== 5 || expiryDate[2] !== '/') return false;
    if(expiryDate < now) return false;
    if (cvv.length !== 3) return false;

}
function sendTransactionRequest(request) {
    return { success: true, transactionId: "12345" };
}
