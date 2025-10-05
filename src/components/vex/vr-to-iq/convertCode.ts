
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