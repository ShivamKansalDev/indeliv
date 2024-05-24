import { FieldErrors, FieldValues } from "react-hook-form"

export default function isFormInvalid(err: FieldErrors<FieldValues>) {
  if (Object.keys(err).length > 0) return true
  return false
}