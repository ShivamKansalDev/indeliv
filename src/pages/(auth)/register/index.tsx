import { useContext, useEffect, useState } from 'react'
import LogoForm from '../components/LogoForm';
import Input from '../components/Input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSendOTPMutation } from '@/state/slices/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { LoginUserContext } from '@/App';
import { Link } from 'react-router-dom';

export default function Register() {
    const [sendOTP, { isLoading, isSuccess, isError, error }] = useSendOTPMutation();
    const [phoneNumber, setPhoneNumber] = useState(0)
    const [email, setEmail] = useState('')
    const navigate = useNavigate();
    const context = useContext(LoginUserContext)

    const methods = useForm({
        resolver: yupResolver(
            yup.object().shape({
                phoneOrEmail: yup.string().required("required"),
            })
        ),
    });

    useEffect(() => {
        if (isSuccess) {
            if (!!email) {
                context?.setEmailOrPhone(email as any)
                navigate('/login')
            }
            else {
                context?.setEmailOrPhone(phoneNumber as any)
                navigate('/otp-verification')
            }
            return;
        }
        if (isError) {
            if (context?.emailOrPhone.includes('@')) {
                alert("Email does not exist.");

            } else {
                alert("Phone number does not exist.");
            }
            return;
        }
    }, [isSuccess, isError])



    return (
        <div className="register-page">
            <LogoForm
                heading="Welcome!"
                subHeading="Sign in to your Account"
                onSubmit={({ phoneOrEmail }: any) => {
                    if (phoneOrEmail.includes('@')) {
                        setEmail(phoneOrEmail)
                        context?.setEmailOrPhone(phoneOrEmail as any)
                        navigate('/login')
                        return;
                    }
                    else {
                        context?.setEmailOrPhone('')
                        if (phoneOrEmail.length < 10) {
                            alert("Please add valid phone number");
                            return
                        }
                        else if (phoneOrEmail.length < 12) {
                            alert("Please add country code in the phone number entered.");
                            return
                        }
                        else {
                            sendOTP({ phoneOrEmail });
                            setPhoneNumber(phoneOrEmail)
                        }

                    }
                }}
                submitText="Next"
                methods={methods}
            >
                <div className="form-group mt-4" style={{ marginBottom: '20px' }}>
                    <Input
                        id="phoneOrEmail"
                        validations={{ required: "required" }}
                        placeholder="Enter Your Phone Number / Email"
                    />
                </div>
            </LogoForm>
        </div>
    )
}
