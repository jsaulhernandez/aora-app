import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
// components
import Loader from "@/components/Loader";
// contexts
import { useGlobalContext } from "@/context/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </Stack>
  );
};

export default AuthLayout;
