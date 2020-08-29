const readlineSync = require("readline-sync")
const getUser = require("./utils/api");
const markdown = require("./utils/generateMarkdown");
const fs = require("fs")


// all the questions
let questions = [
    "Enter badge label: ",
    "Enter badge message: ",
    "Enter badge color: ",
    "Enter title: ",
    "Enter description: ",
    "Enter license: ",
    "Enter installation command: ",
    "Enter usage command: ",
    "Enter test command: ",
    "Enter contributing party (if any) or leave empty and press enter to end the list: "
];

//keys for making json object
let keys = [
    "badgeLabel",
    "badgeMessage",
    "badgeColor",
    "title",
    "description",
    "license",
    "installation",
    "usage",
    "test",
    "contributing"
]

// for storing answers
let answers = {}


// for checking the ready states
// breaking code in 3 parts as node is asynchronus

// step 1: make request from provided username
// step 2: wait for step 1 to complete and then ask questions 
//         for the required data to put in README.md
// step 3: validate the data(where required) and write it in the README.md file
let check = []



const writeToFile = (fileName, userData) => {
    fs.writeFileSync(fileName, markdown(userData), err => {
        if(err) throw err
    })
}



let init = (callback) => {

    //first push the four states and then pop them one by one
    //so as to know if the program is ready to be on the next state
    check.push(1)
    check.push(2)
    check.push(3)
    check.push(4)
    
    //get github username for making request
    let username = readlineSync.question("Enter valid github username: ")

    //step 1: make the request in callback function
    callback(null, username)


    let i = 0
    
    //timeout to wait for previous step i.e fetching the request
    let timeout = setInterval(()=> {
        if(check.length === 3){


            //step 2: asking questions
            for(i = 0 ; i < keys.length - 1 ; i++){
                answers[keys[i]] = readlineSync.question(questions[i])
            }

            // indicator for step 2 partial completion
            check.pop()

            //clear the interval
            clearInterval(timeout)
        }
    },300)


    // step: 2 (continued)
    let contribute_list = []
    let str = ""
    let timeout2 = setInterval(() => {

        //checking if step 2 is partially completed
        if(check.length === 2){
            while(true){
                answer = readlineSync.question(questions[i])
                if(answer === "") {
                    let j = 0
                    if(contribute_list.length){
                        for(j = 0 ; j < contribute_list.length ; j++){


                            // making sure that contributors are displayed 
                            // in the form of a list
                            str += `${j+1}. ${contribute_list[j]}`
                            if(j !== contribute_list.length - 1){
                                str += `\n  `
                            }
                        }
                        let forTimeout = setInterval(()=> {
                            if(j === contribute_list.length){
                                answers[keys[i]] = str

                                //indicator for step 2 full completion
                                check.pop()
                                clearInterval(forTimeout)
                            }
                        },100)
                    }
                    else {

                        //indicator for step 2 full completion for else state
                        answers[keys[i]] = "None"
                        check.pop()
                    }
                    break
                }
                else contribute_list.push(answer)
            }
            clearTimeout(timeout2)
        }
    },300)
    
    
    let timeout3 = setInterval(() => {

        //checking if step 2 is completed  
        if(check.length === 1){
            answers.title = answers.title.toUpperCase()
            answers.badgeColor = answers.badgeColor.toLowerCase()
            switch (answers.badgeColor) {
                
                //checking for valid colors
                // this is the list of valid colors for badges
                case "green":
                case "brightgreen":                    
                case "yellowgreen":                    
                case "yellow":                    
                case "orange":                    
                case "red":                    
                case "blue":                    
                case "lightgrey":{
                    //indicator for step 3 completion so,
                    //we can finally write the README.md file
                    check.pop()
                    break;
                }                   
                
                default:{
                    //if the color is not valid, it is set to green
                    answers.badgeColor = "green"
                    
                    //indicator for step 3 completion if the
                    //provided color was not valid
                    check.pop()
                    break;
                }
            }
            clearTimeout(timeout3)
        }
    },200)

    let timeout4 = setInterval(()=>{

        //checking if all steps are completed
        if(check.length === 0){

            //writing the file
            writeToFile("README.md", answers)
            clearInterval(timeout4)
        }
    },300)
}

init((error, username) => {

    //making asynchronus request using promise
    getUser(username)
    .then(res => {
        let data = JSON.parse(res)

        if(data.length){
            //finding email in commits area
            for(let i = 0 ; i < data.length; i++){
                let json = data[i]
                if(json.payload.hasOwnProperty('commits')){
                    answers['email'] = json.payload.commits[0].author.email
                    check.pop()
                    break
                }
                else if(i === data.length-1){
                    answers['email'] = "Not provided"
                    check.pop()
                    break
                }
            }
            
                //getting profile picture
            if(data[0].actor)
                answers['prof_pic'] = data[0].actor.avatar_url
            else{
                
                //assigning blank profile picture if no profile photo found just in case
                answers['prof_pic'] = `https://www.google.com/search?q=no%20profile%20picture%20image&tbm=isch&tbs=sur%3Afc&hl=en&sa=X&ved=0CAIQpwVqFwoTCOiUqquGv-sCFQAAAAAdAAAAABAH&biw=1263&bih=881#imgrc=GonJG9aLPTc5LM`
            }
        }
        else{
            console.log("You didn't make any commits so the email and profile pic are not publicly available. Try making commits from your account first then use this readme generator. ")
            answers['prof_pic'] = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`
            answers['email'] = "Not provided"
            check.pop()
        }
    })
    .catch(err =>{

        //catching error if the request failed
        console.log(`Error occured: ${err.message}`)
        process.exit(5)
    })
})