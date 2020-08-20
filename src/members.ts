import knex from "knex";

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
    contact_no: string
}

// Find member from search
export const findMember = (fName:string, lName:string, email:string, contactNo:string) => {
    console.log(fName,lName,email,contactNo);
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

// Edit member
export const editMember = (id:number, fName:string, lName:string, email:string, contactNo:string ) => {
    const member = getMemberById(id);

    console.log(member);

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
    return client
            .insert(
                {
                    f_name: member.f_name,
                    l_name: member.l_name,
                    email: member.email,
                    contact_no: member.contact_no
                }
            )
            .into("member");
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