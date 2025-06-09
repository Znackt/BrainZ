import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { CrossIcon } from "../icons/CrossIcon";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const redirect_login = () => {
    navigate("/signin");
  }

  const signup = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        email,
        password,
      });
      alert("Signup successful!");
      console.log("Signup response:", response.data);
    } catch (error: any) {
      alert("Error signing up: " + error.message);
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-800 justify-center items-center">
      <div className="bg-white rounded-xl border min-w-lg min-h-9/12 relative">
        <div className="absolute top-4 left-4">
          <CrossIcon size="lg" />
        </div>
        <div className="flex flex-col items-center px-8 py-16">
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="text-4xl font-semibold text-left mb-4">
              Create your account
            </div>
            <div className="space-y-1">
              <Input placeholder="Username" size="lg" reference={usernameRef} />
              <Input placeholder="Email" size="lg" reference={emailRef} />

              <div className="flex flex-col pl-2">
                <span className="text-lg font-semibold text-left mt-4">
                  Create a Password
                </span>
                <span className="text-xs font-medium text-left">
                  Tips to create a strong Password: <br />
                  <ul className="list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Use numbers and symbols</li>
                    <li>Avoid common words or phrases</li>
                  </ul>
                </span>
              </div>

              <Input placeholder="Password" size="lg" reference={passwordRef} />
              <div className="pt-2 flex justify-center">
                <Button
                  variant="primary"
                  text="Submit"
                  size="lg"
                  className="rounded-full"
                  onClick={signup}
                />
              </div>

              <div className="w-full text-left pl-3 pt-5">
                <span className="text-sm font-medium opacity-95">
                  Already have an account?{" "}
                  <span className=" text-blue-800 hover:text-blue-600 duration-150 cursor-pointer" onClick={redirect_login}>
                    Login
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
