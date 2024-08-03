
import { ReactElement } from "react";
import SubDomain from "@/pages/(auth)/sub-domain";


export default function SubDomainRoute({ children }: { children: ReactElement }) {
    const parts = window.location.host.split(".")
    return (
        parts.length > 2  ?
            children
            :
            <div className="right-container">
                <div className="w-100">
                    <SubDomain />
                </div>
            </div>
    );
}
