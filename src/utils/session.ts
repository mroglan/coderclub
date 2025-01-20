
export function sessionNameToUrlName(name: string) {
    return name.trim().toLowerCase().replace(/\s/g, "_")
}