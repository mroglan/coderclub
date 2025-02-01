
export const TUTORIAL_NAMES = [
    "Hello World",
    "Next1",
    "Next2"
]


export const TUTORIAL_STEPS = {
    "Hello World": [
        "Say hello!",
        "Comments",
        "Challenge: Introduce yourself!",
        "Challenge: Shapes!!",
        "Variables",
        "Numbers",
        "Changing Numbers!",
        "Challenge: Raised to a Power!",
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
        "Say hello!": "print('Hello World!')",
        "Comments": `
# this is a comment, the computer will not try to run this line 
print('Hello World!')
# print('Bye World!')
        `.trim(),
        "Challenge: Introduce yourself!": `
print('Hi, my name is BOB!') 
        `.trim(),
        "Challenge: Shapes!!": `
print('  *') 
print(' ***')
print('*****')
        `.trim(),
        "Variables": `
name = 'BOB'
favorite_food = 'pasta'
print('Hello, my name is ' + name)
print(name + ' likes to eat ' + favorite_food + '.')
        `.trim(),
        "Numbers": `
age = '100'
print('I am ' + age + ' years old!') 
number_of_hats = 2
print('I have ' + str(number_of_hats) + ' hats')
        `.trim(),
        "Changing Numbers!": `
a = 10
b = 5

# Adding numbers
addition = a + b
print('After adding the numbers, we get ' + str(addition))

# Subtracting numbers
subtraction = a - b
print('After subtracting the numbers, we get ' + str(subtraction))

# Multiplying numbers
multiplication = a * b
print('After multiplying the numbers, we get ' + str(multiplication))

# Dividing numbers
division = a / b
print('After dividing the numbers, we get ' + str(division))
        `.trim(),
        "Challenge: Raised to a Power!": `
num = 16

# How can we print num^2 ? 

answer = num*num

print(str(num) + " squared = " + str(answer))
        `.trim(),
        "Changing Strings!": `
first_name = 'BOB'
last_name = 'Bobbinson'
full_name = first_name + ' ' + last_name
print('My full name is ' + full_name + '.')
        `.trim()
    },
} as {[key: string]: {[key: string]: string}}


export const TUTORIAL_TEMPLATES = {
    "Hello World": {
        "Say hello!": "print('Hello World!')",
        "Comments": `
# this is a comment, the computer will not try to run this line 
print('Hello World!')
# print('Bye World!')
        `.trim(),
        "Challenge: Introduce yourself!": `
# Try to introduce yourself!
# For example, print "Hi, my name is BOB!"
        `.trim(),
        "Challenge: Shapes!!": `
# Write some code to print this shpae:
#     *
#    ***
#   *****
        `.trim(),
        "Variables": `
name = 'BOB'
favorite_food = 'pasta'
print('Hello, my name is ' + name)
print(name + ' likes to eat ' + favorite_food + '.')
        `.trim(),
        "Numbers": `
age = '100'  # this variable is a string!
print('I am ' + age + ' years old!') 

number_of_hats = 2  # this variables is a number!
# Whenever we want to print a number,
# we need to wrap it in str()
print('I have ' + str(number_of_hats) + ' hats')
        `.trim(),
        "Changing Numbers!": `
a = 10
b = 5

# Adding numbers
addition = a + b
print('After adding the numbers, we get ' + str(addition))

# Subtracting numbers
subtraction = a - b
print('After subtracting the numbers, we get ' + str(subtraction))

# Multiplying numbers
multiplication = a * b
print('After multiplying the numbers, we get ' + str(multiplication))

# Dividing numbers
division = a / b
print('After dividing the numbers, we get ' + str(division))
        `.trim(),
        "Challenge: Raised to a Power!": `
num = 16

# How can we print num^2 ? 

answer = 0 # fix this line!

print(str(num) + " squared = " + str(answer))
        `.trim(),
        "Changing Strings!": `
first_name = 'BOB'
last_name = 'Bobbinson'
full_name = first_name + ' ' + last_name
print('My full name is ' + full_name + '.')
        `.trim()
    }
} as {[key: string]: {[key: string]: string}}


export interface SessionTutorial {
    id: string;
    name: string;
    unlockSolutions: string[];
    sessionId: string;
    teacherId: string;
}
