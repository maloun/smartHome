import React, {useContext, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import './Login.css'
import {Context} from "../../../index";

const Login = () => {
    const {store} = useContext(Context);
    store.setUrl(window.location.hash)

    const navigate = useNavigate()
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [coincidenceLogin, setCoincidenceLogin] = useState(false);
    const [coincidencePassword, setCoincidencePassword] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [enableButton,setEnableButton] = useState(true)
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [isRevealPwd, setIsRevealPwd] = useState(false);

    const PassHandler = (e: any) => {
        setPassword(e);
        const mass = [
            // /(?=.*[0-9])/,
            // // /(?=.*[!@#$%^&*.])/,
            // /(?=.*[a-zа-яё])/,
            // /(?=.*[A-ZА-ЯЁ])/,
            /[0-9a-zа-яёA-ZА-ЯЁ!@#$%^&*.]{6,}/,
        ];
        for (let i = 0; i < mass.length; i++) {
            const reg = new RegExp(mass[i]);
            if (!reg.test(String(e))) {
                setCoincidencePassword(true);
                setErrMsg("Введите корректный email или пароль");
                break;
            } else {
                setCoincidencePassword(false);
                setErrMsg("");

            }
        }
    };

    const handlerLogin = () => {
        if(!errorBool){
            setEnableButton(false)
            store.login(email, password)
                .then(async (r) => {

                    switch (r) {
                        case 200:
                            navigate(from, {replace: true});
                            break;
                        case 400:
                        case 401:
                            setErrMsg("Неправильный логин или пароль");
                            break;
                        default:
                            setErrMsg("Нет ответа от сервера");
                    }
                    setEnableButton(true)
                    // errorBool = false;
                });
        }
    };

    const emailHandler = (e: any) => {
        setEmail(e);
        const reEmail = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        if (!reEmail.test(String(e).toLowerCase())) {
            setCoincidenceLogin(true);
            setErrMsg("Введите корректный email или пароль");
        } else {
            setCoincidenceLogin(false);
            setErrMsg("")
        }
    };

    let errorBool = !email || !password || coincidenceLogin || coincidencePassword;

    //390px
    return (
        <div className="login-mainContainer">
            <div className={'login-preview-text login-preview-text1'}>веб разработка</div>
            <div className={'login-preview-text login-preview-text2'}>разработка | инновации | будущее</div>
            <div className={'login-preview-text login-preview-text3'}>smart</div>

            <div className={'login-input-div'}>
                <div className={'login-input-span'}>E-mail</div>
                <input
                    className={'login-input'}
                    onChange={(e) => emailHandler(e.target.value)}
                />
                <div className={'login-input-span'}>Пароль</div>
                <input
                    className={'login-input'}
                    type={isRevealPwd ? "text" : "password"}
                    onChange={(e) => PassHandler(e.target.value)}
                />
               <div className={'login-check-div'}>
                   <input
                       id={'login-check'}
                       type={"checkbox"}
                       onClick={() => setIsRevealPwd(!isRevealPwd)}
                   />
                   <label htmlFor={'login-check'} >Показать пароль</label>
               </div>
            {(errMsg) && (
                <div style={{ color: "red" }}>{errMsg}</div>
            )}

            </div>

            <button
                style={{opacity:errorBool?"60%":""}}
                className={'login-button'}
                onClick={handlerLogin}
                disabled={!enableButton}
            >
                Войти
            </button>
        </div>
    );
}

export default Login;
