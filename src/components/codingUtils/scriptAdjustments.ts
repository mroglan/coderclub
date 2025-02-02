
export class ScriptAdjustments {

    private script: string;

    constructor(script: string) {
        this.script = script
    }

    private appendAwaitToInput(s: string) {
        return s.replaceAll("input(", "await input(")
    }

    output() {
        return this.appendAwaitToInput(this.script)
    }
}