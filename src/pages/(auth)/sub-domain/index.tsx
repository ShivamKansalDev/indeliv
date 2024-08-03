import LogoForm from '../components/LogoForm';
import Input from '../components/Input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ReactComponent as LogoSvg } from "@/assets/svgs/logo.svg";

const SubDomain = () => {

    const methods = useForm({
        resolver: yupResolver(
            yup.object().shape({
                subDomain: yup.string().required("required"),
            })
        ),
    });

    function addSubdomain({subDomain}: any) {
        const currentHost = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : '';
        const pathname = window.location.pathname;

        const hostParts = currentHost.split('.');

        const newHost = `${subDomain}.${hostParts.join('.')}`;

        const newUrl = `${protocol}//${newHost}${port}${pathname}`;

        window.location.replace(newUrl);
    }


    return (
        <div
            className="register-page subdomin_register"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div className="large-logo  mb-5">
                <LogoSvg />
            </div>
            <LogoForm
                heading="Welcome!"
                subHeading="Please enter your company's subdomain to access your personalised page."
                onSubmit={(subDomain) => addSubdomain(subDomain as any)}
                submitText="Next"
                methods={methods}
                isSubdomain ={true}
                centerHeading={"text-center mb-1 w-100 wlcome_Text"}
            >
                <div className="form-group mt-4 w-100" style={{ marginBottom: '20px' }}>
                    <Input
                        id="subDomain"
                        validations={{ required: "required" }}
                        placeholder="Company's subdomain"
                    />
                </div>
            </LogoForm>
        </div>

    )
}

export default SubDomain