import LoginForm from "components/LoginForm/LoginForm"
import SignUpForm from "components/SignUpForm/SignUpForm"

export default function Page(){

    return <>
        <h1>Hello, nextjs!</h1>
        <h2>How are we today?</h2>
        <LoginForm/>
        <SignUpForm/>
    </>
}