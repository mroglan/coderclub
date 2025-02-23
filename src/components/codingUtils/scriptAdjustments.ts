import { Environment } from "@/utils/constants";

export class ScriptAdjustments {

    private script: string;
    private env: string;

    private getCanvasDataMacro = "__canvas_data = (await __get_canvas_state()).to_py()"

    constructor(script: string, env?: string) {
        this.script = script
        this.env = env
    }

    private appendAwaitToInput(s: string) {
        return s.replaceAll("input(", "await input(")
    }

    private basicModifications(s: string) {
        return this.appendAwaitToInput(s)
    }

    private waitForAllObjectsToExitCanvas(s: string, except: string[]) {
        return s += `\n
${this.getCanvasDataMacro}
while True:
    names = list(map(lambda img: img["name"], __canvas_data["images"].values()))
    if len(list(filter(lambda n: n not in [${except.map(e => `"${e}"`).join(",")}], names))) == 0:
        break
    ${this.getCanvasDataMacro}
`
    }

    private envModifications(s: string) {
        if (this.env === Environment.AVATAR) {
            return this.waitForAllObjectsToExitCanvas(s, ["avatar"])
        }
    }

    output() {
        const s = this.basicModifications(this.script)
        return this.envModifications(s)
    }
}