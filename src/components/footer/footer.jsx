import React from 'react';
import siteLogo from '../../assets/site-logo.png';
import '../../styles/footer.scss';
export default function Footer() {

    return (
        <div className='footerMainDiv'>
            <footer>
                <div className='footerContainer'>
                    <span>
                        <a
                            className='siteLink'
                            href="https://phillipmblaine.github.io/"
                            target='_blank'
                            rel="noopener noreferrer"
                        >
                            Phillip M. Blaine 2022
                        </a>
                        <img
                            alt='siteLogo'
                            className='siteLogo'
                            height='30px'
                            src={siteLogo}
                            width='30px'
                        />
                    </span>
                </div>
            </footer>
        </div>
    );
}
