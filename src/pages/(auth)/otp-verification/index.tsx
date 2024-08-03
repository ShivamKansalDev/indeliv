import { useContext, useEffect, useState } from 'react'
import LogoForm from '../components/LogoForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import OTPInput from 'react-otp-input';
import './style.scss'
import { LoginUserContext } from '@/App';
import { useCheckOTPMutation, useGetUserMutation, useSendOTPMutation } from '@/state/slices/authApiSlice';
import Input from '../components/Input';

const schema = yup.object().shape({
    otp: yup.string().required("OTP is required").min(5, "OTP must be 5 characters"),
});

export default function OtpVerification() {
    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [sendOTP] = useSendOTPMutation();
    const [otp, setOtp] = useState<any>('');
    const navigate = useNavigate()
    const [checkOTP, { isSuccess }] = useCheckOTPMutation();
    const [getUser, { data, isSuccess: isSuccessUser }] = useGetUserMutation();
    useEffect(() => {
        if (isSuccess) {
            getUser()
        }
    }, [isSuccess])
    const context = useContext(LoginUserContext)
    const handleChange = (newOtp: any) => {
        setOtp(newOtp);
    };

    const onSubmit = async () => {
        try {
            const res: any = await checkOTP({ otp, phone: context?.emailOrPhone })
            if (res?.data?.token) {
                context?.setAuthContext("Auth")
                context?.setLoginUserData({ ...data });
                navigate("/dashboard");
            }
            if (res?.error) {
                alert(res?.error?.data?.message?.phone[0]);
            }
        } catch (error) {
            console.log('error', error)
        }
    };

    return (
        <div className="otp-verification-page">
            <h1 className={`titleH1 fs-lg-28 text-center`}>Phone number verification</h1>
            <p className={`text14 text-center`}>{`Enter the OTP received on your phone ${context?.emailOrPhone}`}</p>
            <form onSubmit={(e) => e.preventDefault()}>
                <OTPInput
                    value={otp}
                    onChange={handleChange}
                    numInputs={5}
                    shouldAutoFocus={true}
                    renderSeparator={<span></span>}
                    renderInput={(props) => <input id='otp' {...props} />}
                    containerStyle="otp-container"
                    inputStyle='otp-input'
                />
                {/* {err && <p>{err}</p>} */}
                <Link to="#" onClick={() => sendOTP({ phoneOrEmail: context?.emailOrPhone as any })} className="text12 d-block text-center mt-3" style={{ color: '#0080fc' }}>
                    Resend OTP
                </Link>
                <button
                    type="submit"
                    onClick={onSubmit}
                    style={{
                        fontSize: '16px',
                        padding: '8px 10px',
                        fontWeight: '500',
                        marginTop: '20px'
                    }}
                    className="rounded btn btn-primary btn-lg btn-block submit-btn "
                >
                    Log in
                </button>
            </form>
        </div>
    )
}
