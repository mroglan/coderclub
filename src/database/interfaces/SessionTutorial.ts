import { S_Ref, C_Ref } from "./fauna";


export const TUTORIAL_NAMES = [
    "Hello World",
    "Next1",
    "Next2"
]


export const TUTORIAL_STEPS = {
    "Hello World": [
        "Say hello!",
        // provide template of print("Hello World!")
        "Challenge: Introduce yourself!",
        // provide no template and ask students to try printing "Hello, my name is <name>" 
        "Comments",
        // template of 
        // # this is a comment, the computer will not try to run this line
        // print("Hello World!")
        // # print("Bye world!")
        "Challenge: Shapes!!",
        // write some code to print this shape:
        //   *
        //  ***
        // *****
        "Variables",
        // provide template with 
        // name = "BOB"
        // favorite_food = "Pasta"
        // print "hello, my name is  <name>" 
        // print "<name> likes to eat <favorite_food>."
        "Numbers",
        // template:
        // age = 100
        // print("I am " + 100 + " years old")
        // hats = 2
        // print("I have " + hats + " hats")
        "Changing Numbers!",
        // template:
        // a = 10
        // b = 5
        // # Adding numbers
        // addition = a + b
        // print("After adding the numbers, we get " + addition)
        // # Subtracting numbers
        // subtraction = a - b
        // print("After subtracting the numbers, we get " + subtraction)
        // # Multiplying numbers
        // multiplication = a * b
        // print("After multiplying the numbers, we get " + multiplication)
        // # Dividing numbers
        // division = a / b
        // print("After dividing the numbers, we get " + division)
        "Challenge: Raised to a Power!",
        // template:
        // num = 16
        // # How can we print num^2?
        // answer = "idk"
        // print (num + " squared = " + "answer")
        "Changing Strings!",
        // template:
        // first_name = "BOB"
        // last_name = "Bobbinson"
        // full_name = first_name + " " + last_name
        // print("My full name is " + full_name)
    ],
    "Next1": [],
    "Next2": []
} as {[key: string]: string[]}


export const TUTORIAL_SOLUTIONS = {
    "Hello World": {
        "Say hello!": "print('Hello World!')"
    }
} as {[key: string]: {[key: string]: string}}


interface SessionTutorialData {
    name: string;
    unlockSolutions: string[];
    sessionId: string;
    teacherId: string;
}


export interface S_SessionTutorial {
    ref: S_Ref;
    data: SessionTutorialData;
}


export interface C_SessionTutorial {
    ref: C_Ref;
    data: SessionTutorialData;
}