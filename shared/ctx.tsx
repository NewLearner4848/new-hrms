import React from "react";
import { useStorageState } from "./useStorageState";

type User = any;

interface Leave {
  pending_total?: number;
  concession_total?: number;
}

interface ClockingData {
  clock_in?: string;
  clock_out?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  leaves: Leave | null;
  clockData: ClockingData | null;
}

const AuthContext = React.createContext<{
  signIn: (user: User) => void;
  signOut: () => void;
  addClockingData: (data: ClockingData | null) => void;
  addLeaveData: (data: Leave) => void;
  session: AuthState | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  addClockingData: () => null,
  addLeaveData: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [[isLoading, session], setSession] =
    useStorageState<AuthState>("session");

  const signIn = (user: User) => {
    const authData: AuthState = {
      user,
      isAuthenticated: true,
      leaves: null,
      clockData: null,
    };
    setSession(authData);
  };

  const signOut = () => {
    setSession(null);
  };

  const addClockingData = (data: ClockingData | null) => {
    if (session) {
      setSession({ ...session, clockData: data });
    }
  };

  const addLeaveData = (data: Leave) => {
    if (session) {
      setSession({ ...session, leaves: data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        addClockingData,
        addLeaveData,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
