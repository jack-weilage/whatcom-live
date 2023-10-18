import type { ParamMatcher } from '@sveltejs/kit'

export const match: ParamMatcher = (param): param is `${number}` => /^\d+$/.test(param)
