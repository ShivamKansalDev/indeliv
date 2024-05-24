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
  onSubmit,
  children,
  footer,
  shape = {},
  methods,
}: {
  submitText: string;
  heading: string;
  subHeading: string;
  onSubmit: SubmitHandler<FieldValues>;
  children: ReactElement[] | ReactElement;
  methods: UseFormReturn<any, any, any>;
  footer?: ReactElement;
  shape?: any;
}) {
  const schema = yup.object().shape(shape);

  const onFormSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <>
      <h1 className="titleH1 fs-lg-28">{heading}</h1>

      <p className="text14">{subHeading}</p>
      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          {children}
          <button
            type="submit"
            onClick={onFormSubmit}
            style={{fontSize: '16px',
            padding: '8px 10px',
            fontWeight: '400'}}
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
