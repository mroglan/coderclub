import { Environment } from "@/utils/constants"

export const TUTORIAL_NAMES = [
    "Hello World",
    "Inputs and More!",
    "Loops!",
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
        "Changing Strings!",
        "Numbers",
        "Changing Numbers!",
        "Challenge: Raised to a Power!",
    ],
    "Inputs and More!": [
        "The Input",
        "More Inputs!",
        "Challenge: your own input!",
        "A New Environment!",
        "Inputs: You choose!",
        "Challenge: Many Inputs!",
        "The If Statement",
        "A Shortcut?",
        "More Shortcuts?"
    ],
    "Loops!": [
        "Customize Your Game",
        "The While Loop",
        "A Guessing Game",
        "Challenge: Infinite Calculator!"
    ],
    "Next1": [],
    "Next2": []
} as {[key: string]: string[]}


export const TUTORIAL_ENVS = {
    "Hello World": {
        "Say hello!": Environment.CONSOLE,
        "Comments": Environment.CONSOLE,
        "Challenge: Introduce yourself!": Environment.CONSOLE,
        "Challenge: Shapes!!": Environment.CONSOLE,
        "Variables": Environment.CONSOLE,
        "Changing Strings!": Environment.CONSOLE,
        "Numbers": Environment.CONSOLE,
        "Changing Numbers!": Environment.CONSOLE,
        "Challenge: Raised to a Power!": Environment.CONSOLE,
    },
    "Inputs and More!": {
        "The Input": Environment.CONSOLE,
        "More Inputs!": Environment.CONSOLE,
        "Challenge: your own input!": Environment.CONSOLE,
        "A New Environment!": Environment.AVATAR,
        "Inputs: You choose!": Environment.AVATAR,
        "Challenge: Many Inputs!": Environment.AVATAR,
        "The If Statement": Environment.CONSOLE,
        "A Shortcut?": Environment.AVATAR,
        "More Shortcuts?": Environment.AVATAR
    },
    "Loops!": {
        "Customize Your Game": Environment.AVATAR,
        "The While Loop": Environment.CONSOLE,
        "A Guessing Game": Environment.CONSOLE,
        "Challenge: Infinite Calculator!": Environment.CONSOLE
    }
}


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
    "Inputs and More!": {
        "The Input": `
word = input('Enter a word:') 
print('You entered ' + word)
        `.trim(),
    "More Inputs!": `
first_name = input('Enter your first name:') 
last_name = input('Enter your last name:')
print('Hello, ' + first_name + ' ' + last_name)
    `.trim(),
    "Challenge: your own input!": `
age = input('How old are you?') 
print('I am ' + age + ' years old')
    `.trim(),
    "A New Environment!": `
# You can use 'fire', 'water', 'earth', and 'air'!!
print('fire')
    `.trim(),
    "Inputs: You choose!": `
# The avatar will use what you input!
element = input('What element do I use?')
print(element)
    `.trim(),
    "Challenge: Many Inputs!": `
element = input('What element do I use?')
print(element)
element = input('What element do I use?')
print(element)
    `.trim(),
    "The If Statement": `
name = 'BOB'

if name == 'BOB':
    print('YOU ARE BOB?')

if name == 'Something else':
    print('Interesting...')
    `.trim(),
    "A Shortcut?": `
# We can now input "f" instead of "fire" to shoot a fire ball!

element = input('What element do I use?')

if element == 'f':
    print('fire')

if element != 'f':
    print(element)
    `.trim(),
    "More Shortcuts?": `
element = input('What element do I use?')

if element == 'f':
    print('fire')

if element == 'w':
    print('water')

if element == 'e':
    print('earth')

if element == 'a':
    print('air')
    `.trim()
    },
    "Loops!": {
        "Customize Your Game": `
# Upload piskel images to use them!
# Rename the images to
# "avatar", "fire", "water", "earth", or "air"
# to customize the images used in the game!

# Some code to try them out:
print('fire')
sleep(0.5) # wait half a second
print('water')
sleep(0.5)
print('earth')
sleep(0.5)
print('air')
        `.trim(),
        "The While Loop": `
# Let's make the computer count to 10!
# with only a few lines of code!

num = 1

while num <= 10:
    print(str(num))
    num = num + 1

print('Done counting!')
        `.trim(),
        "A Guessing Game": `
import random

my_num = random.randint(1, 5)

guess = int(input('Guess a number!'))
while guess != my_num:
    print('Wrong number guessed!')
    guess = int(input('Guess a number!'))

print('You guessed the correct number!')
        `.trim(),
        "Challenge: Infinite Calculator!": `
wants_to_continue = True
while wants_to_continue:
    num1 = int(input('Enter a number:'))
    num2 = int(input('Enter a number:'))
    sum = num1 + num2
    print(str(num1) + ' + ' + str(num2) + ' = ' + str(sum))
    response = input('Do you want to continue?')
    if response == 'yes':
        wants_to_continue = True
    else:
        wants_to_continue = False
        `.trim()
    }
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
    },
    "Inputs and More!": {
        "The Input": `
word = input("Enter a word:") 
print("You entered " + word)
        `.trim(),
    "More Inputs!": `
first_name = input('Enter your first name:') 
last_name = input('Enter your last name:')
print('Hello, ' + first_name + ' ' + last_name)
    `.trim(),
    "Challenge: your own input!": `
# for example, ask the user for their age
# and print it in a sentence!
    `.trim(),
    "A New Environment!": `
# You can use 'fire', 'water', 'earth', and 'air'!!
print('fire')
    `.trim(),
    "Inputs: You choose!": `
# The avatar will use what you input!
element = input('What element do I use?')
print(element)
    `.trim(),
    "Challenge: Many Inputs!": `
# input multiple elements, and use them!
    `.trim(),
    "The If Statement": `
name = 'BOB'

if name == 'BOB':
    print('YOU ARE BOB?')

if name == 'Something else':
    print('Interesting...')
    `.trim(),
    "A Shortcut?": `
# We can now input "f" instead of "fire" to shoot a fire ball!

element = input('What element do I use?')

if element == 'f':
    print('fire')

if element != 'f':
    print(element)
    `.trim(),
    "More Shortcuts?": `
# Let's try to make "w" a shortcut for "water",
# "e" a shortcut for "earth",
# and "a" a shortcut for "air"!

element = input('What element do I use?')

if element == 'f':
    print('fire')
    `.trim()
    },
    "Loops!": {
        "Customize Your Game": `
# Upload piskel images to use them!
# Rename the images to
# "avatar", "fire", "water", "earth", or "air"
# to customize the images used in the game!

# Some code to try them out:
print('fire')
sleep(0.5) # wait half a second
print('water')
sleep(0.5)
print('earth')
sleep(0.5)
print('air')
        `.trim(),
        "The While Loop": `
# Let's make the computer count to 10!
# with only a few lines of code!

num = 1

while num <= 10:
    print(str(num))
    num = num + 1

print('Done counting!')
        `.trim(),
        "A Guessing Game": `
# Let's work together to make a guessing game! 
        `.trim(),
        "Challenge: Infinite Calculator!": `
# Make a program that does the following:
# Asks the user for two numbers
# Then, prints the sum of those two numbers 
# Then, asks the user if they want to continue
# If they do want to continue, repeats the program
# Else, ends the program
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
