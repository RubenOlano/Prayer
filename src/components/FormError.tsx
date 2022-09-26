import { FC } from "react";
import { FieldErrorsImpl } from "react-hook-form";

interface Props {
  errors: FieldErrorsImpl<{
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>;
}

const FormError: FC<Props> = ({ errors }) => {
  return (
    <div className="text-red-500 fixed">
      {errors.fname && <p>{errors.fname.message}</p>}
      {errors.lname && <p>{errors.lname.message}</p>}
      {errors.email && <p>{errors.email.message}</p>}
      {errors.password && <p>{errors.password.message}</p>}
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
    </div>
  );
};

export default FormError;
