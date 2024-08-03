import { RegisterOptions, useFormContext } from "react-hook-form";

import findInputError from "../../../utils/findInputError";
import isFormInvalid from "../../../utils/isFormInvalid";
import { PropsWithChildren, useState } from "react";
import { ReactComponent as Eye } from "@/assets/svgs/open-eye.svg";
import { ReactComponent as EyeOff } from "@/assets/svgs/closed-eye.svg";
import { ReactComponent as Error } from "@/assets/svgs/error.svg";

type InputProps = PropsWithChildren<{
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  validations?: RegisterOptions;
}>;

const Input: React.FC<InputProps> = ({
  id,
  label,
  children,
  placeholder = "",
  type = "text",
  validations = {},
}) => {
  const [hidePass, setHidePass] = useState(true);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, id);
  const isInvalid = isFormInvalid(inputError);

  return (
    <div className={`field ${isInvalid && "invalid"}`}>
      {label && (
        <div className="label-error mb-2">
          <label htmlFor={id} className="label labeL font-size-14">
            {label}
          </label>
        </div>
      )}
      {type === "select" ? (
        <select
          className="input form-control"
          required
          {...register(id, validations)}
        >
          <option value="" disabled selected>
            {label}
          </option>
          {children}
        </select>
      ) : type === "passwordToggle" ? (
        <div className="password-container form-control rounded">
          <input
            type={hidePass ? "password" : "text"}
            id={id}
            className="w-100"
            autoFocus={window.location.pathname.includes('login') ? true : false}
            placeholder={placeholder || ".............."}
            {...register(id, validations)}
          />
          <span onClick={() => setHidePass((h) => !h)}>
            {hidePass ? <Eye /> : <EyeOff />}
          </span>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          style={{ backgroundColor: id === 'email' ? '#ECF7FF' : '' }}
          className="input form-control"
          placeholder={placeholder || label}
          {...register(id, validations)}
        />
      )}

      {isInvalid && (
        <span className="error-message">
          {inputError.error?.message && <Error />} {inputError.error?.message}
        </span>
      )}
    </div>
  );
};

export default Input;
