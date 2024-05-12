export function setVarToDefaultIfNotValid<T>(variable: T, defaultValue: T): T {
    if (variable === null || variable === undefined) {
        return defaultValue;
    } else {
        return variable;
    }
}

export function checkIfVarIsValid<T>(variable: T): boolean {
    if (variable === null || variable === undefined) {
        return false;
    } else {
        return true;
    }
}

export function getEnvVar(name: string): string {
    const envVar = process.env[name];
    if (envVar === undefined) {
        throw new Error(`Environment variable ${name} not found.`);
    }
    return envVar;
}
