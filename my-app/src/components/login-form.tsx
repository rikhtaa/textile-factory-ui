"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { login } from "../http/api"
import { useState } from "react"
import { email } from "zod"
import { LoginFormValues, useAuthStore } from "@/store"
import { useRouter } from "next/navigation"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginData, setLoginData] = useState<LoginFormValues>({
    email: '',
    password: ''
  });

//  const LoginPage = ()=>{
  const {setUser} = useAuthStore()
  const router = useRouter();

  
  const {mutate}=useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (userData)=>{
      setUser(userData.data);
      router.push('/dashboard')
    },
    onError: (error) => {
         console.error('Login failed:', error);
        }
      })
  
  const handleLogin = (e: React.FormEvent)=>{
    e.preventDefault()
    mutate(loginData)
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
          onSubmit={handleLogin}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={loginData.email}
                  onChange={(e)=> setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required 
                value={loginData.password}
                onChange={(e)=> setLoginData({...loginData, password: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

  