// A TypeScript interface is a way to define the structure or contract that an object should follow.
// we can also use here type. that would also have the same impact as the interface

export interface SignUpData{
    firstName:string;
    lastName:string;
    userName:string;
    email:string;
    password:string;
    confirmPassword:string;
}

export interface LoginData{
    userName:string;
    password:string;
}