import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: any;
  login: (email: string, password: string) => Promise<User>;
  signup: (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {
    throw new Error("login not implemented");
  },
  signup: async () => {},
  logout: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);

  // Check session on mount and listen for auth state changes
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      //Validate user against server
      if (session) {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          console.log("User is gone", error);
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser(data.user);
        }
      } else {
        setUser(null);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        //Validate user against server
        if (session) {
          const { data, error } = await supabase.auth.getUser();
          if (error || !data?.user) {
            console.log("User is gone", error);
            await supabase.auth.signOut();
            setUser(null);
          } else {
            setUser(data.user);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  const signup = async (
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string
  ) => {
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { has_completed_onboarding: false } },
    });
    if (error) throw error;
    if (!data.user) throw new Error("Signup failed. Please try again.");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        user_name: userName,
      })
      .eq("id", data.user.id)
      .select();
    if (updateError) throw updateError;
    setUser(data.user);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// Add default export to resolve Expo Router warning
export default function AuthContextWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
