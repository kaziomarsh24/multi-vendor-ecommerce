import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo/csn_logo_transparent.png"
            alt="CSN Logo"
            {...props}
            className={`object-contain ${props.className || 'h-8 w-auto'}`}
        />
    );
}
