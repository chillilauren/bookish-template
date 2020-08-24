import crypto from "crypto";
// import { fetchMemberByEmail, Member } from "./members";

// interface HashResult {
//     salt: string;
//     hashedPwd: string;
// }

export const hashPassword = (password: string) => {
    const hashedValue = crypto
        .createHash('sha256')
        .update(password)
        .digest('base64');

    return hashedValue;
}

// export const hashPassword = (password:string): HashResult => {
//     const salt = generateSalt();
//     const hashedPwd = hash(salt, password);

//     return { salt, hashedPwd };
// }

// const hash = (salt:string, password:string) => {
//     const hashedValue = crypto
//         .createHash('sha256')
//         .update(password + salt)
//         .digest('base64');
// }
