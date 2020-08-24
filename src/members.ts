import knex from "knex";
import { hashPassword } from "./security";

const client = knex({
    client: 'pg',
    debug: true,
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: 'librarydb'
    }
});

interface Member {
    f_name: string,
    l_name: string,
    email: string,
    contact_no: string,
    password: string,
}

// Find member from search
export const findMember = (fName:string, lName:string, email:string, contactNo:string) => {
    // console.log(fName,lName,email,contactNo);
    return client
            .select("*")
            .from("member")
            .where("f_name", "like", `%${fName}%`)
            .andWhere("l_name", "like", `%${lName}%`)
            .andWhere("email", "like", `%${email}%` )
            .andWhere("contact_no", "like", `%${contactNo}%`);
}

// Lookup member by id
export const getMemberById = (id:number) => {
    return client
            .select("*")
            .from("member")
            .where("id", id)
            .first();
}

// Check password against member email


// Edit member
export const editMember = (id:number, fName:string, lName:string, email:string, contactNo:string ) => {
    return client("member")
            .where("id", id)
            .update(
                {
                    f_name: fName,
                    l_name: lName,
                    email: email,
                    contact_no: contactNo
                }
            );
}

// Add new member
export const addMember = (member : Member) => {
    const hashedPwd = hashPassword(member.password);
    return client
            .insert(
                {
                    f_name: member.f_name,
                    l_name: member.l_name,
                    email: member.email,
                    contact_no: member.contact_no,
                    hashed_pwd: hashedPwd
                }
            )
            .into("member");
}

// Find member from Email
export const fetchMemberByEmail = (email:string) => {
    return client
            .select("*")
            .from("member")
            .where("email", email)
            .first()
}

// Delete member
// const deleteMember = (id : number) => {
//     return client("member")
//             .delete()
//             .where("id", id);
// }

const softDeleteMember = (id : number) => {
    return client("member")
            .where('id', id)
            .update('deleted', true)
}