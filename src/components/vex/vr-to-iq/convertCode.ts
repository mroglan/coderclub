
function removeVrThreadWrapper(code: string) {
    return code.replace(/vr_thread\((.*?)\)/g, "$1()")
}

export function convertCode(code: string, build: string) {

    code = removeVrThreadWrapper(code)

    code = `
#region VEXcode Generated Robot Configuration from CoderClub Vex VR to Vex IQ

import * import urandom 
import math 

# Brain should be defined by default 
brain=Brain() 

# Robot configuration code 
brain_inertial = Inertial() 
left_drive_smart = Motor(Ports.PORT1, 1.0, False) 
right_drive_smart = Motor(Ports.PORT6, 1.0, True) 
drivetrain = SmartDrive(left_drive_smart, right_drive_smart, brain_inertial, 200) 

# generating and setting random seed 
def initializeRandomSeed(): 
    wait(100, MSEC) 
    xaxis = brain_inertial.acceleration(XAXIS) * 1000 
    wyaxis = brain_inertial.acceleration(YAXIS) * 1000 
    zaxis = brain_inertial.acceleration(ZAXIS) * 1000 
    systemTime = brain.timer.system() * 100 
    urandom.seed(int(xaxis + yaxis + zaxis + systemTime)) 
    
# Initialize random seed 
initializeRandomSeed() 

vexcode_initial_drivetrain_calibration_completed = False 

def calibrate_drivetrain(): 
    # Calibrate the Drivetrain Inertial 
    global vexcode_initial_drivetrain_calibration_completed 
    sleep(200, MSEC) 
    brain.screen.print("Calibrating") 
    brain.screen.next_row() 
    brain.screen.print("Inertial") 
    brain_inertial.calibrate() 
    while brain_inertial.is_calibrating(): 
        sleep(25, MSEC) 
    vexcode_initial_drivetrain_calibration_completed = True 
    brain.screen.clear_screen() 
    brain.screen.set_cursor(1, 1) 
    
# Calibrate the Drivetrain 
calibrate_drivetrain() 

#endregion VEXcode Generated Robot Configuration 

${code}
    `

    return code.trim()
}


export function removeConfigurationCode(code: string) {
    return code.replace(/#region[\s\S]*?#endregion.*\n?/g, "").trim();
}


export function getIqPythonData(code: string, build: string) {

    const robotConfig = {
        "port": [
            1,
            6,
            0
        ],
        "name": "drivetrain",
        "customName": false,
        "deviceType": "Drivetrain",
        "deviceClass": "smartdrive",
        "setting": {
            "type": "2-motor",
            "wheelSize": "200mm",
            "gearRatio": "1:1",
            "direction": "fwd",
            "gyroType": "integrated",
            "width": "173",
            "unit": "mm",
            "wheelbase": "76",
            "wheelbaseUnit": "mm",
            "xOffset": "0",
            "yOffset": "0",
            "thetaOffset": "0"
        },
        "triportSourcePort": 22
    }

    const data = {
        "mode": "Text",
        "hardwareTarget": "brain",
        "textContent": code,
        "textLanguage": "python",
        "robotConfig": [robotConfig],
        "slot": 0,
        "platform": "IQ",
        "sdkVersion": "20230818.11.00.00",
        "appVersion": "4.61.0",
        "minVersion": "4.60.0",
        "fileFormat": "2.0.0",
        "targetBrainGen": "Second",
        "v5SoundsEnabled": false,
        "aiVisionSettings": {
            "colors": [],
            "codes": [],
            "tags": true,
            "AIObjects": true,
            "AIObjectModel": [],
            "aiModelDropDownValue": null
        },
        "target": "Physical"
    }

    return JSON.stringify(data, null, 4)
}