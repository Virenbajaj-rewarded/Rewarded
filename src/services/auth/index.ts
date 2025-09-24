import auth from "@react-native-firebase/auth";

let currentIdToken: string | null = null;

auth().onIdTokenChanged(async (user) => {
  console.log("onIdTokenChanged", user?.email);
  currentIdToken = user ? await user.getIdToken() : null;
});

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth().currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}
export function peekIdToken() {
  return currentIdToken;
}
