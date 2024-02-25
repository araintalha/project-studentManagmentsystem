import inquirer from "inquirer";
import chalk from "chalk";
interface Data {
    stName: string;
    courseEnroll: string;

}
const studentInfoArr: Newstudent[] = [];
let paid: number = 0;
let Id: number;
let IdArr: number[] = [];
let furtherOperation: { op: string };
let feePay: { paidFee: number };
let currentDate = new Date;
currentDate.setFullYear(2024);
currentDate.setMonth(1); //yaha "1" iss lia likha hai bcuz yeh 0 base hai, means that january is = 0, so thats why feb is = 1.
currentDate.setDate(1)
let checkSetTimeout: boolean = false;
let checkId: boolean = false;
let checkPayTuition: "done" | "not" = "not";




console.log(chalk.bgBlue.bold.whiteBright.underline("Welcome to Student Management System"));


class Newstudent {
    name: string;
    courseEnroll: string;
    payFee: number;
    balanceLeft: number;
    private Id: number;
    admissionDate: Date;
    status: "active" | "off";
    courseFee: number;
    private isBalanceLeft: boolean = false;

    get _Id() {
        return this.Id;
    }
    constructor(Name: string, courseEnroll: string, PayFee: number, courseFee: number, Id: number) {
        this.name = Name;
        this.courseEnroll = courseEnroll;
        this.courseFee = courseFee;
        this.payFee = PayFee;
        this.Id = Id;
        this.admissionDate = currentDate;
        if (checkSetTimeout === false) {
            this.status = "active";
        }
        else {
            this.status = "off";
        }
        if (feePay.paidFee > paid) {
            this.balanceLeft = this.payFee - paid;
            this.isBalanceLeft = true;


        }
        else {
            this.balanceLeft = 0;
        }

    }

    displayBalance() {
        // if (this.Id !== IdArr.find((val) => val === this.Id)) { //yaha isko iss  lia comment kia hai bcuz yeh Id validation toh tab hi hoja gi jab user "Login" krega toh iss lia validation check krna ki zarorat nahi. 
        //     return `Id Not Found!`;
        // }

        if (this.balanceLeft > 0) {

            return chalk.bold.bgWhite.black(`Remaining Balance in your account is: ${this.balanceLeft}`);
        }

        return chalk.bold.bgWhite.black(`insufficient Balance\n`);
    }


    async payTuitionFee() {
        if (checkSetTimeout === false) {
            return (chalk.yellow(`${this.name},Id no:${this._Id},right now you dont have to pay fee.\n`));

        }
        else if (checkSetTimeout === true) {

            if (this.isBalanceLeft) {
                console.log(chalk.yellow(`You have already ${this.balanceLeft} in your account Now you have to pay ${this.courseFee - this.balanceLeft},Because the actual Fees of your course is ${this.courseFee}`));

            }
            else {
                console.log(`You have to Pay ${this.courseFee}`);

            }
            const result = await inquirer.prompt({
                type: "number",
                name: "payDone",
                message: "Enter the Fee",
                validate: (ans) => {

                    if (!ans || ans !== this.courseFee - this.balanceLeft) {
                        return (`you have to pay ${this.courseFee - this.balanceLeft}`);  //remember if we dont return anything here so if we return "true" within "else" statement like below we have done so it will raise an error that "undefined" | "true" is not assignable to "string" | "boolean", So thats why if we are using "else" with "if" so it must that we have to return in "if" block also. 

                    }
                    else
                        return true;
                }
            })
            checkSetTimeout = false;
            checkPayTuition = "done";

            return result.payDone;
        }

    }
}



class main {
    async signUp() {
        const data: Data = await inquirer.prompt([{
            type: "input",
            name: "stName",
            message: "Enter your name:",
            validate: (ans) => {
                if (ans.length > 15 || isNaN(ans) === false || !ans) {  //"isNaN(ans) ===false" yeh code yeh bta raha haka agr "ans" number nahi hai toh "true" return hoga.Toh agr "true" return ho toh code agay execute hojaye par agr "false" return ho yani ka phr "ans" number hai toh phr code agay execute na ho. 
                    return "please enter valid name";
                }
                else return true;
            }
        },
        {
            type: "list",
            name: "courseEnroll",
            message: "available Courses",
            choices: ["Web Development", "Gen Ai", "Web 3.0", "Digital Marketing"]
        }])
        let Fee: number = 0;

        switch (data.courseEnroll) {
            case "Web Development":
                console.log("You have to pay 10000");
                Fee = 10000;
                break;
            case "Gen Ai":
                console.log("You have to pay 15000");
                Fee = 15000;
                break;
            case "Web 3.0":
                console.log("You have to pay 12000");
                Fee = 12000;
                break;
            case "Digital Marketing":
                console.log("You have to pay 8000");
                Fee = 8000;
                break;
        }
        feePay = await inquirer.prompt({
            type: "number",
            name: "paidFee",
            message: "Enter the fees amount: ",
            validate: (ans) => {
                if (ans < Fee || !ans) {
                    return `less Amount,You have to pay ${Fee}`
                }
                else
                    return true;
            }
        })
        Id = Math.floor(Math.random() * (100000 - 10000) + 1)
        console.log(chalk.yellow.italic(`Congrats You are enrolled, your Id is:${Id}`));
        IdArr.push(Id);
        paid = Fee;
        studentInfoArr.push(new Newstudent(data.stName, data.courseEnroll, feePay.paidFee, Fee, Id));
        setTimeout(() => {
            console.log(chalk.whiteBright.blueBright.bold(`\n${data.stName} your first month is done now you to pay tuition fee for second month.`));
            checkSetTimeout = true;


        }, 15000);


    }
    async Login() {
        let check: { loginId: number } = await inquirer.prompt({
            type: "number",
            name: "loginId",
            message: "Enter Your Id Number: "
        })
        return check.loginId;
    }


}
const main1 = new main();

let start: { step: string };
do {
    start = await inquirer.prompt({
        type: "list",
        name: "step",
        message: "Select the Operation",
        choices: ["Login", "SignUp", "Exit"]

    })

    if (start.step === "Login") {

        let answer = await main1.Login()

        if (answer !== IdArr.find((val) => val === answer)) {
            console.log(chalk.red.underline.bold('Invalid Id, You Have to SignUp'));
        }
        else {
            console.log("You are Logged In.");

            furtherOperation = await inquirer.prompt({
                type: "list",
                name: "op",
                message: "Select the Further Operation you want to perform:",
                choices: ["View Student Status", "View Balance", "Pay Tuition Fee"]
            })
            let Student: Newstudent | undefined;
            for (const i in studentInfoArr) {
                if (studentInfoArr[i]._Id === answer) {
                    Student = new Newstudent(studentInfoArr[i].name, studentInfoArr[i].courseEnroll, studentInfoArr[i].payFee, studentInfoArr[i].courseFee, studentInfoArr[i]._Id)

                    checkId = true;
                }
            }


            if (furtherOperation.op === "View Student Status") {


                if (checkSetTimeout === false) {
                    if (checkPayTuition === "not") {

                        for (let i = 0; i < studentInfoArr.length; i++) {
                            if (studentInfoArr[i]._Id === answer) {
                                console.log(studentInfoArr[i]);
                            }
                        }
                    }
                    else if (checkPayTuition === "done") {
                        for (let i = 0; i < studentInfoArr.length; i++) {
                            if (studentInfoArr[i]._Id === answer) {
                                studentInfoArr[i].status = "active";
                                console.log(studentInfoArr[i]);
                            }
                        }
                    }

                }


                else if (checkSetTimeout === true) {
                    for (const index in studentInfoArr) {
                        if (answer === studentInfoArr[index]["_Id"]) //we can access properties by square notation also like here i did.
                        {
                            studentInfoArr[index].status = "off";
                            console.log(studentInfoArr[index]);

                        }
                    }
                }

            }
            else if (furtherOperation.op === "View Balance") {

                if (checkId && Student !== undefined) {
                    console.log(Student.displayBalance());
                    checkId = false; //yaha iss lia false kr rhay hai takay jab 2nd time login ho toh "checkId" by default false hi ho.
                }

            }
            else if (furtherOperation.op === "Pay Tuition Fee") {

                if (checkId && Student !== undefined) {
                    console.log(await Student.payTuitionFee());
                    checkId = false; //yaha iss lia false kr rhay hai takay jab 2nd time login ho toh "checkId" by default false hi ho.
                }
            }

        }

    }
    else if (start.step === "SignUp") {
        await main1.signUp();
    }

}
while (start.step !== "Exit")