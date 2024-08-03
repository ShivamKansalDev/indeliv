import { FieldError, FieldErrors, FieldValues } from "react-hook-form"

export default function findInputError(errors: FieldErrors<FieldValues>, name: string): { error?: FieldError } {
  const filtered = Object.keys(errors)
    .filter(key => key.includes(name))
    .reduce((cur, key) => {
      return Object.assign(cur, { error: errors[key] })
    }, {})
  return filtered
}