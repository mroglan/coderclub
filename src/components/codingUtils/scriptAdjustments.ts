
export class ScriptAdjustments {

    private script: string;

    constructor(script: string) {
        this.script = script
    }

    // private prependImports(s: string) {
    //     const prepend = "import js_functions\nimport __builtin__\n__builtin__.print = js_functions.print"
    //     return prepend + s
    // }

    output() {
        // return this.prependImports(this.script)
        return this.script
    }
}