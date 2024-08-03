import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import LogoLayout from "../../../components/forms/LogoLayout/LogoLayout";
import { ReactElement } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

export default function LogoForm({
  submitText,
  heading,
  subHeading,
  centerHeading,
  onSubmit,
  children,
  footer,
  shape = {},
  methods,
  isSuccess,
  isSubdomain = false
}: {
  submitText: string;
  heading: string;
  subHeading: string;
  centerHeading?: string;
  onSubmit: SubmitHandler<FieldValues>;
  children: ReactElement[] | ReactElement;
  methods: UseFormReturn<any, any, any>;
  footer?: ReactElement;
  shape?: any;
  isSuccess?: any
  isSubdomain?: boolean
}) {
  const schema = yup.object().shape(shape);

  const onFormSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <>
      <h1 className={`titleH1 fs-lg-28 ${centerHeading}`}>{heading}</h1>

      {subHeading && <p className={`text14 ${isSubdomain ? 'text-center mb-0' : centerHeading}`}>{subHeading}</p>}
      <FormProvider {...methods}>
        <form className={isSubdomain ? `${centerHeading}` : ''} onSubmit={(e) => e.preventDefault()}>
          {children}
          <button
            disabled={isSuccess}
            type="submit"
            onClick={onFormSubmit}
            style={{
              fontSize: '16px',
              padding: '8px 10px',
              fontWeight: '500'
            }}
            className="rounded btn btn-primary btn-lg btn-block submit-btn "
          >
            {submitText}
          </button>
        </form>
      </FormProvider>
      {footer ? footer : <></>}
    </>
  );
}
