export const match = (param: string): param is `${number}` => /^\d+$/.test(param)
